export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (e) {
                body = {};
            }
        }
        body = body || {};

        if (body.callback_query) {
            const callbackQueryId = body.callback_query.id;
            const data = body.callback_query.data;
            const message = body.callback_query.message;

            let status = "";
            let attemptId = "";

            if (data && data.startsWith("approve_")) {
                status = "approved";
                attemptId = data.split("approve_")[1];
            } else if (data && data.startsWith("reject_")) {
                status = "rejected";
                attemptId = data.split("reject_")[1];
            }

            if (attemptId && status) {
                const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
                const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

                if (redisUrl && redisToken) {
                    try {
                        await fetch(redisUrl, {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${redisToken}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(["SET", `attempt:${attemptId}`, status, "EX", "300"]),
                        });
                    } catch (redisErr) {
                        console.warn("Redis write error in webhook:", redisErr);
                    }
                }

                const botToken = process.env.TELEGRAM_BOT_TOKEN;
                if (botToken) {
                    try {
                        await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                callback_query_id: callbackQueryId,
                                text: `Statut: ${status.toUpperCase()}`,
                            }),
                        });

                        if (message && message.chat && message.message_id) {
                            const originalText = message.text || "Demande d'approbation";
                            const updatedText = `${originalText}\n\n*STATUT:* ${status === 'approved' ? '✅ APPROUVÉ' : '❌ REJETÉ'}`;

                            await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    chat_id: message.chat.id,
                                    message_id: message.message_id,
                                    text: updatedText,
                                    parse_mode: "Markdown",
                                }),
                            });
                        }
                    } catch (tgErr) {
                        console.warn("Telegram webhook answer error:", tgErr);
                    }
                }
            }
        }

        return res.status(200).send("OK");
    } catch (error) {
        console.error("Webhook Error:", error);
        return res.status(200).send("OK");
    }
}
