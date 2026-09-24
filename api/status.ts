import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from "@upstash/redis";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "GET") {
        return res.status(405).send("Method Not Allowed");
    }

    const attemptId = req.query.attemptId as string;

    if (!attemptId) {
        return res.status(400).json({ message: "attemptId is required" });
    }

    try {
        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL || "",
            token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
        });

        const status = await redis.get(`attempt:${attemptId}`);

        if (!status) {
            return res.status(404).json({ message: "Attempt not found or expired" });
        }

        return res.status(200).json({ status });
    } catch (error) {
        console.error("Status check error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
