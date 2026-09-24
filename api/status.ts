import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from "@upstash/redis";

declare global {
    var __attempts: Map<string, { status: string; createdAt: number }> | undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "GET") {
        return res.status(405).send("Method Not Allowed");
    }

    const attemptId = req.query.attemptId as string;

    if (!attemptId) {
        return res.status(400).json({ message: "attemptId is required" });
    }

    try {
        let status: string | null = null;

        const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
        const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (redisUrl && redisToken) {
            try {
                const redis = new Redis({ url: redisUrl, token: redisToken });
                const redisVal = await redis.get(`attempt:${attemptId}`);
                if (redisVal) status = String(redisVal);
            } catch (redisErr) {
                console.warn("Redis read error, checking memory:", redisErr);
            }
        }

        // Fallback to in-memory store
        if (!status && global.__attempts?.has(attemptId)) {
            const entry = global.__attempts.get(attemptId)!;
            // If running without telegram bot configured in env, auto-approve after 4s so UI preview works smoothly
            if (!process.env.TELEGRAM_BOT_TOKEN && (Date.now() - entry.createdAt > 4000)) {
                entry.status = "approved";
            }
            status = entry.status;
        }

        // Default fallback
        if (!status) {
            status = "pending";
        }

        return res.status(200).json({ status });
    } catch (error) {
        console.error("Status check error:", error);
        return res.status(200).json({ status: "pending" });
    }
}
