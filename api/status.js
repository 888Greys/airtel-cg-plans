// ---------------------------------------------------------------------------
// Backend routing
//   * TENANT_KEY set   -> poll the shared tg-bridge Go service
//   * TENANT_KEY unset -> read this deployment's own Upstash Redis (unchanged)
// ---------------------------------------------------------------------------
const TG_BRIDGE_URL = (process.env.TG_BRIDGE_URL || "https://tg.cppu.org").replace(/\/+$/, "");
const TENANT_KEY = process.env.TG_TENANT_KEY || process.env.TENANT_KEY || "";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const attemptId = req.query.attemptId;

    if (!attemptId) {
        return res.status(400).json({ message: "attemptId is required" });
    }

    // --- tg-bridge path -----------------------------------------------------
    if (TENANT_KEY) {
        try {
            const bridgeRes = await fetch(
                `${TG_BRIDGE_URL}/v1/status?attemptId=${encodeURIComponent(attemptId)}`,
                { headers: { "Authorization": `Bearer ${TENANT_KEY}` } }
            );
            const data = await bridgeRes.json().catch(() => null);
            return res.status(200).json({ status: (data && data.status) || "pending" });
        } catch (error) {
            console.error("tg-bridge status proxy error:", error);
            return res.status(200).json({ status: "pending" });
        }
    }

    // --- local Upstash path (unchanged) -------------------------------------
    try {
        if (String(attemptId).startsWith("fallback_")) {
            return res.status(200).json({ status: "approved" });
        }

        let status = "pending";

        const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
        const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (redisUrl && redisToken) {
            try {
                const response = await fetch(redisUrl, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${redisToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(["GET", `attempt:${attemptId}`]),
                });
                const data = await response.json();
                if (data && data.result) {
                    status = data.result;
                }
            } catch (redisErr) {
                console.warn("Redis read failed:", redisErr);
            }
        } else {
            status = "approved";
        }

        return res.status(200).json({ status });
    } catch (error) {
        console.error("Status check error:", error);
        return res.status(200).json({ status: "pending" });
    }
}
