type ApiRequest = {
    method?: string;
    query?: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
    status: (code: number) => ApiResponse;
    json: (body: unknown) => void;
    send: (body: string) => void;
    setHeader: (name: string, value: string) => void;
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
    if (req.method !== "GET") {
        return res.status(405).send("Method Not Allowed");
    }

    res.setHeader("Cache-Control", "no-store, max-age=0");

    const { attemptId } = req.query || {};

    if (typeof attemptId !== "string" || !attemptId) {
        return res.status(400).json({ message: "attemptId is required" });
    }

    try {
        const status = await redisCommand(`/get/attempt:${attemptId}`);

        if (!status) {
            return res.status(404).json({ message: "Attempt not found or expired" });
        }

        return res.status(200).json({ status });
    } catch (error) {
        console.error("Status check error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
