
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// frontend/netlify/functions/telegram-webhook.js
var telegram_webhook_default = async (req) => {
  console.log("=== TELEGRAM WEBHOOK HIT ===");
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  try {
    const body = await req.json();
    console.log("Body:", JSON.stringify(body));
    if (!body.callback_query) {
      console.log("No callback_query, ignoring");
      return new Response("OK", { status: 200 });
    }
    const { id: queryId, data } = body.callback_query;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    console.log("Callback data:", data);
    if (!data || !data.startsWith("approve_") && !data.startsWith("reject_")) {
      console.log("Unknown callback data:", data);
      return new Response("OK", { status: 200 });
    }
    if (!redisUrl || !redisToken) {
      console.error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN");
      return new Response("Configuration Error", { status: 500 });
    }
    const action = data.startsWith("approve_") ? "approve" : "reject";
    const attemptId = data.substring(action.length + 1);
    console.log("Action:", action, "AttemptId:", attemptId);
    const newStatus = action === "approve" ? "approved" : "rejected";
    try {
      const redisEndpoint = `${redisUrl}/set/${attemptId}/${newStatus}/EX/600`;
      const redisRes = await fetch(redisEndpoint, {
        headers: { Authorization: `Bearer ${redisToken}` }
      });
      const redisData = await redisRes.json();
      console.log("Redis SET result:", redisData);
    } catch (e) {
      console.error("Error writing Redis:", e.message);
    }
    if (token) {
      const ans = await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: queryId,
          text: action === "approve" ? "\u2705 Approved!" : "\u274C Rejected."
        })
      });
      console.log("answerCallbackQuery:", await ans.json());
      await fetch(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: body.callback_query.message.chat.id,
          message_id: body.callback_query.message.message_id,
          reply_markup: { inline_keyboard: [] }
        })
      });
    }
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Error", { status: 500 });
  }
};
var config = { path: "/api/telegram-webhook" };
export {
  config,
  telegram_webhook_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZnJvbnRlbmQvbmV0bGlmeS9mdW5jdGlvbnMvdGVsZWdyYW0td2ViaG9vay5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZXhwb3J0IGRlZmF1bHQgYXN5bmMgKHJlcSkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coXCI9PT0gVEVMRUdSQU0gV0VCSE9PSyBISVQgPT09XCIpO1xyXG5cclxuICAgIGlmIChyZXEubWV0aG9kICE9PSBcIlBPU1RcIikge1xyXG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoXCJNZXRob2QgTm90IEFsbG93ZWRcIiwgeyBzdGF0dXM6IDQwNSB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZXEuanNvbigpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQm9keTpcIiwgSlNPTi5zdHJpbmdpZnkoYm9keSkpO1xyXG5cclxuICAgICAgICBpZiAoIWJvZHkuY2FsbGJhY2tfcXVlcnkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBjYWxsYmFja19xdWVyeSwgaWdub3JpbmdcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoXCJPS1wiLCB7IHN0YXR1czogMjAwIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgeyBpZDogcXVlcnlJZCwgZGF0YSB9ID0gYm9keS5jYWxsYmFja19xdWVyeTtcclxuICAgICAgICBjb25zdCB0b2tlbiA9IHByb2Nlc3MuZW52LlRFTEVHUkFNX0JPVF9UT0tFTjtcclxuICAgICAgICBjb25zdCByZWRpc1VybCA9IHByb2Nlc3MuZW52LlVQU1RBU0hfUkVESVNfUkVTVF9VUkw7XHJcbiAgICAgICAgY29uc3QgcmVkaXNUb2tlbiA9IHByb2Nlc3MuZW52LlVQU1RBU0hfUkVESVNfUkVTVF9UT0tFTjtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDYWxsYmFjayBkYXRhOlwiLCBkYXRhKTtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhIHx8ICghZGF0YS5zdGFydHNXaXRoKFwiYXBwcm92ZV9cIikgJiYgIWRhdGEuc3RhcnRzV2l0aChcInJlamVjdF9cIikpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBjYWxsYmFjayBkYXRhOlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShcIk9LXCIsIHsgc3RhdHVzOiAyMDAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXJlZGlzVXJsIHx8ICFyZWRpc1Rva2VuKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJNaXNzaW5nIFVQU1RBU0hfUkVESVNfUkVTVF9VUkwgb3IgVVBTVEFTSF9SRURJU19SRVNUX1RPS0VOXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKFwiQ29uZmlndXJhdGlvbiBFcnJvclwiLCB7IHN0YXR1czogNTAwIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYWN0aW9uID0gZGF0YS5zdGFydHNXaXRoKFwiYXBwcm92ZV9cIikgPyBcImFwcHJvdmVcIiA6IFwicmVqZWN0XCI7XHJcbiAgICAgICAgY29uc3QgYXR0ZW1wdElkID0gZGF0YS5zdWJzdHJpbmcoYWN0aW9uLmxlbmd0aCArIDEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQWN0aW9uOlwiLCBhY3Rpb24sIFwiQXR0ZW1wdElkOlwiLCBhdHRlbXB0SWQpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdTdGF0dXMgPSBhY3Rpb24gPT09IFwiYXBwcm92ZVwiID8gXCJhcHByb3ZlZFwiIDogXCJyZWplY3RlZFwiO1xyXG5cclxuICAgICAgICAvLyBVcGRhdGUgVXBzdGFzaCBSZWRpcyAoRXhwaXJlIGluIDEwIG1pbnV0ZXMpXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVkaXNFbmRwb2ludCA9IGAke3JlZGlzVXJsfS9zZXQvJHthdHRlbXB0SWR9LyR7bmV3U3RhdHVzfS9FWC82MDBgO1xyXG4gICAgICAgICAgICBjb25zdCByZWRpc1JlcyA9IGF3YWl0IGZldGNoKHJlZGlzRW5kcG9pbnQsIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3JlZGlzVG9rZW59YCB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCByZWRpc0RhdGEgPSBhd2FpdCByZWRpc1Jlcy5qc29uKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVkaXMgU0VUIHJlc3VsdDpcIiwgcmVkaXNEYXRhKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciB3cml0aW5nIFJlZGlzOlwiLCBlLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQW5zd2VyIGNhbGxiYWNrIHRvIHJlbW92ZSBzcGlubmVyIG9uIFRlbGVncmFtIGJ1dHRvblxyXG4gICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICBjb25zdCBhbnMgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkudGVsZWdyYW0ub3JnL2JvdCR7dG9rZW59L2Fuc3dlckNhbGxiYWNrUXVlcnlgLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxyXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrX3F1ZXJ5X2lkOiBxdWVyeUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGFjdGlvbiA9PT0gXCJhcHByb3ZlXCIgPyBcIlx1MjcwNSBBcHByb3ZlZCFcIiA6IFwiXHUyNzRDIFJlamVjdGVkLlwiXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJhbnN3ZXJDYWxsYmFja1F1ZXJ5OlwiLCBhd2FpdCBhbnMuanNvbigpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBpbmxpbmUgYnV0dG9ucyBmcm9tIG1lc3NhZ2VcclxuICAgICAgICAgICAgYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLnRlbGVncmFtLm9yZy9ib3Qke3Rva2VufS9lZGl0TWVzc2FnZVJlcGx5TWFya3VwYCwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICBjaGF0X2lkOiBib2R5LmNhbGxiYWNrX3F1ZXJ5Lm1lc3NhZ2UuY2hhdC5pZCxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlX2lkOiBib2R5LmNhbGxiYWNrX3F1ZXJ5Lm1lc3NhZ2UubWVzc2FnZV9pZCxcclxuICAgICAgICAgICAgICAgICAgICByZXBseV9tYXJrdXA6IHsgaW5saW5lX2tleWJvYXJkOiBbXSB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoXCJPS1wiLCB7IHN0YXR1czogMjAwIH0pO1xyXG5cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJXZWJob29rIGVycm9yOlwiLCBlcnIpO1xyXG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoXCJFcnJvclwiLCB7IHN0YXR1czogNTAwIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHsgcGF0aDogXCIvYXBpL3RlbGVncmFtLXdlYmhvb2tcIiB9O1xyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7O0FBQUEsSUFBTywyQkFBUSxPQUFPLFFBQVE7QUFDMUIsVUFBUSxJQUFJLDhCQUE4QjtBQUUxQyxNQUFJLElBQUksV0FBVyxRQUFRO0FBQ3ZCLFdBQU8sSUFBSSxTQUFTLHNCQUFzQixFQUFFLFFBQVEsSUFBSSxDQUFDO0FBQUEsRUFDN0Q7QUFFQSxNQUFJO0FBQ0EsVUFBTSxPQUFPLE1BQU0sSUFBSSxLQUFLO0FBQzVCLFlBQVEsSUFBSSxTQUFTLEtBQUssVUFBVSxJQUFJLENBQUM7QUFFekMsUUFBSSxDQUFDLEtBQUssZ0JBQWdCO0FBQ3RCLGNBQVEsSUFBSSw2QkFBNkI7QUFDekMsYUFBTyxJQUFJLFNBQVMsTUFBTSxFQUFFLFFBQVEsSUFBSSxDQUFDO0FBQUEsSUFDN0M7QUFFQSxVQUFNLEVBQUUsSUFBSSxTQUFTLEtBQUssSUFBSSxLQUFLO0FBQ25DLFVBQU0sUUFBUSxRQUFRLElBQUk7QUFDMUIsVUFBTSxXQUFXLFFBQVEsSUFBSTtBQUM3QixVQUFNLGFBQWEsUUFBUSxJQUFJO0FBRS9CLFlBQVEsSUFBSSxrQkFBa0IsSUFBSTtBQUVsQyxRQUFJLENBQUMsUUFBUyxDQUFDLEtBQUssV0FBVyxVQUFVLEtBQUssQ0FBQyxLQUFLLFdBQVcsU0FBUyxHQUFJO0FBQ3hFLGNBQVEsSUFBSSwwQkFBMEIsSUFBSTtBQUMxQyxhQUFPLElBQUksU0FBUyxNQUFNLEVBQUUsUUFBUSxJQUFJLENBQUM7QUFBQSxJQUM3QztBQUVBLFFBQUksQ0FBQyxZQUFZLENBQUMsWUFBWTtBQUMxQixjQUFRLE1BQU0sNERBQTREO0FBQzFFLGFBQU8sSUFBSSxTQUFTLHVCQUF1QixFQUFFLFFBQVEsSUFBSSxDQUFDO0FBQUEsSUFDOUQ7QUFFQSxVQUFNLFNBQVMsS0FBSyxXQUFXLFVBQVUsSUFBSSxZQUFZO0FBQ3pELFVBQU0sWUFBWSxLQUFLLFVBQVUsT0FBTyxTQUFTLENBQUM7QUFDbEQsWUFBUSxJQUFJLFdBQVcsUUFBUSxjQUFjLFNBQVM7QUFFdEQsVUFBTSxZQUFZLFdBQVcsWUFBWSxhQUFhO0FBR3RELFFBQUk7QUFDQSxZQUFNLGdCQUFnQixHQUFHLFFBQVEsUUFBUSxTQUFTLElBQUksU0FBUztBQUMvRCxZQUFNLFdBQVcsTUFBTSxNQUFNLGVBQWU7QUFBQSxRQUN4QyxTQUFTLEVBQUUsZUFBZSxVQUFVLFVBQVUsR0FBRztBQUFBLE1BQ3JELENBQUM7QUFDRCxZQUFNLFlBQVksTUFBTSxTQUFTLEtBQUs7QUFDdEMsY0FBUSxJQUFJLHFCQUFxQixTQUFTO0FBQUEsSUFDOUMsU0FBUyxHQUFHO0FBQ1IsY0FBUSxNQUFNLHdCQUF3QixFQUFFLE9BQU87QUFBQSxJQUNuRDtBQUdBLFFBQUksT0FBTztBQUNQLFlBQU0sTUFBTSxNQUFNLE1BQU0sK0JBQStCLEtBQUssd0JBQXdCO0FBQUEsUUFDaEYsUUFBUTtBQUFBLFFBQ1IsU0FBUyxFQUFFLGdCQUFnQixtQkFBbUI7QUFBQSxRQUM5QyxNQUFNLEtBQUssVUFBVTtBQUFBLFVBQ2pCLG1CQUFtQjtBQUFBLFVBQ25CLE1BQU0sV0FBVyxZQUFZLHFCQUFnQjtBQUFBLFFBQ2pELENBQUM7QUFBQSxNQUNMLENBQUM7QUFDRCxjQUFRLElBQUksd0JBQXdCLE1BQU0sSUFBSSxLQUFLLENBQUM7QUFHcEQsWUFBTSxNQUFNLCtCQUErQixLQUFLLDJCQUEyQjtBQUFBLFFBQ3ZFLFFBQVE7QUFBQSxRQUNSLFNBQVMsRUFBRSxnQkFBZ0IsbUJBQW1CO0FBQUEsUUFDOUMsTUFBTSxLQUFLLFVBQVU7QUFBQSxVQUNqQixTQUFTLEtBQUssZUFBZSxRQUFRLEtBQUs7QUFBQSxVQUMxQyxZQUFZLEtBQUssZUFBZSxRQUFRO0FBQUEsVUFDeEMsY0FBYyxFQUFFLGlCQUFpQixDQUFDLEVBQUU7QUFBQSxRQUN4QyxDQUFDO0FBQUEsTUFDTCxDQUFDO0FBQUEsSUFDTDtBQUVBLFdBQU8sSUFBSSxTQUFTLE1BQU0sRUFBRSxRQUFRLElBQUksQ0FBQztBQUFBLEVBRTdDLFNBQVMsS0FBSztBQUNWLFlBQVEsTUFBTSxrQkFBa0IsR0FBRztBQUNuQyxXQUFPLElBQUksU0FBUyxTQUFTLEVBQUUsUUFBUSxJQUFJLENBQUM7QUFBQSxFQUNoRDtBQUNKO0FBRU8sSUFBTSxTQUFTLEVBQUUsTUFBTSx3QkFBd0I7IiwKICAibmFtZXMiOiBbXQp9Cg==
