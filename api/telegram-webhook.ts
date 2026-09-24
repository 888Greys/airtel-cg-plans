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
            callback_query?: {
                id?: string;
                data?: string;
                message?: {
                    text?: string;
                    message_id?: number;
                    chat?: { id?: number };
                };
            };
        };

        const callbackQuery = body.callback_query;

        if (callbackQuery?.data) {
            const isApprove = callbackQuery.data.startsWith("approve_");
            const isReject = callbackQuery.data.startsWith("reject_");
            const status = isApprove ? "approved" : isReject ? "rejected" : "";
            const attemptId = callbackQuery.data.replace(/^(approve_|reject_)/, "");

            if (status && attemptId) {
                await redisCommand(`/set/attempt:${attemptId}/${status}/EX/300`);

                const botToken = process.env.TELEGRAM_BOT_TOKEN;

                if (botToken) {
                    await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            callback_query_id: callbackQuery.id,
                            text: `Marked as ${status.toUpperCase()}`,
                        }),
                    });

                    const message = callbackQuery.message;

                    if (message?.chat?.id && message?.message_id) {
                        const originalText = message.text || "Approval Request";

                        await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                chat_id: message.chat.id,
                                message_id: message.message_id,
                                text: `${originalText}\n\n*STATUS:* ${isApprove ? "✅ APPROVED" : "❌ REJECTED"}`,
                                parse_mode: "Markdown",
                            }),
                        });
                    }
                }
            }
        }

        return res.status(200).send("OK");
    } catch (error) {
        console.error("Webhook error:", error);
        return res.status(500).send("Internal Server Error");
    }
}
