import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from "@upstash/redis";

declare global {
    var __attempts: Map<string, { status: string; createdAt: number }> | undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

        if (body.callback_query) {
            const callbackQueryId = body.callback_query.id;
            const data = body.callback_query.data;
            const message = body.callback_query.message;

            let status = "";
            let attemptId = "";

            if (data.startsWith("approve_")) {
                status = "approved";
                attemptId = data.split("approve_")[1];
            } else if (data.startsWith("reject_")) {
                status = "rejected";
                attemptId = data.split("reject_")[1];
            }

            if (attemptId && status) {
                // Update in-memory store
                if (global.__attempts?.has(attemptId)) {
                    const entry = global.__attempts.get(attemptId)!;
                    entry.status = status;
                }

                // Update Redis if configured
                const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
                const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

                if (redisUrl && redisToken) {
                    try {
                        const redis = new Redis({ url: redisUrl, token: redisToken });
                        await redis.set(`attempt:${attemptId}`, status, { ex: 300 });
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
                                text: `Marked as ${status.toUpperCase()}`,
                            }),
                        });

                        if (message && message.chat && message.message_id) {
                            const originalText = message.text || "Approval Request";
                            const updatedText = `${originalText}\n\n*STATUS:* ${status === 'approved' ? '✅ APPROVED' : '❌ REJECTED'}`;

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
                        console.warn("Telegram webhook response error:", tgErr);
                    }
                }
            }
        }

        return res.status(200).send("OK");
    } catch (error) {
        console.error("Webhook Error:", error);
        return res.status(500).send("Internal Server Error");
    }
}
