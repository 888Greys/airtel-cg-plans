export default async (req) => {
    console.log("=== TELEGRAM WEBHOOK HIT ===");

    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const body = await req.json();

        if (!body.callback_query) {
            return new Response("OK", { status: 200 });
        }

        const { id: queryId, data } = body.callback_query;
        const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
        const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

        console.log("Callback data:", data);

        if (!data || (!data.startsWith("approve_") && !data.startsWith("reject_"))) {
            return new Response("OK", { status: 200 });
        }

        if (!redisUrl || !redisToken) {
            console.error("Missing Redis env vars");
            return new Response("Config Error", { status: 500 });
        }

        const action = data.startsWith("approve_") ? "approve" : "reject";
        const attemptId = data.substring(action.length + 1);
        const newStatus = action === "approve" ? "approved" : "rejected";

        console.log("Action:", action, "| AttemptId:", attemptId);

        // Read destination from its own dedicated key (plain string: "primary" or "secondary")
        let destination = "primary";
        try {
            const destRes = await fetch(`${redisUrl}/get/${attemptId}_dest`, {
                headers: { Authorization: `Bearer ${redisToken}` }
            });
            const destData = await destRes.json();
            destination = destData.result || "primary";
            console.log("Destination:", destination);
        } catch (e) {
            console.error("Redis dest read error:", e.message);
        }

        // Update status key with plain string
        try {
            await fetch(`${redisUrl}/set/${attemptId}/${newStatus}/EX/600`, {
                headers: { Authorization: `Bearer ${redisToken}` }
            });
            console.log("Redis SET status:", newStatus);
        } catch (e) {
            console.error("Redis status write error:", e.message);
        }

        // Use correct bot token based on destination
        const token = destination === "secondary"
            ? process.env.SECONDARY_BOT_TOKEN
            : process.env.TELEGRAM_BOT_TOKEN;

        if (token) {
            // Answer Telegram callback (removes the spinner on buttons)
            const ans = await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    callback_query_id: queryId,
                    text: action === "approve" ? "✅ Approved!" : "❌ Rejected."
                })
            });
            console.log("answerCallbackQuery:", (await ans.json()).ok);

            // Remove inline keyboard buttons from the message
            await fetch(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: body.callback_query.message.chat.id,
                    message_id: body.callback_query.message.message_id,
                    reply_markup: { inline_keyboard: [] }
                })
            });
        } else {
            console.error("No bot token found for destination:", destination);
        }

        return new Response("OK", { status: 200 });

    } catch (err) {
        console.error("Webhook error:", err.message);
        return new Response("Error", { status: 500 });
    }
};

export const config = { path: "/api/telegram-webhook" };
