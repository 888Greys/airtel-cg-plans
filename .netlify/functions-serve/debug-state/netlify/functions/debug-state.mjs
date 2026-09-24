
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// frontend/netlify/functions/debug-state.js
var debug_state_default = async (req) => {
  const url = new URL(req.url);
  const attemptId = url.searchParams.get("attemptId");
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const info = {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    attemptId: attemptId || "NOT_PROVIDED",
    envCheck: {
      hasRedisUrl: !!redisUrl,
      hasRedisToken: !!redisToken,
      hasTelegramToken: !!process.env.TELEGRAM_BOT_TOKEN
    },
    redisState: null,
    error: null
  };
  if (attemptId && redisUrl && redisToken) {
    try {
      const redisEndpoint = `${redisUrl}/get/${attemptId}`;
      const redisRes = await fetch(redisEndpoint, {
        headers: { Authorization: `Bearer ${redisToken}` }
      });
      const redisData = await redisRes.json();
      info.redisState = redisData.result;
    } catch (e) {
      info.error = "Redis Error: " + e.message;
    }
  }
  if (process.env.TELEGRAM_BOT_TOKEN) {
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getWebhookInfo`);
      const tgData = await tgRes.json();
      info.webhookStatus = tgData.result;
    } catch (e) {
      info.webhookStatus = { error: e.message };
    }
  }
  return new Response(JSON.stringify(info, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
var config = { path: "/api/debug-state" };
export {
  config,
  debug_state_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZnJvbnRlbmQvbmV0bGlmeS9mdW5jdGlvbnMvZGVidWctc3RhdGUuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCBkZWZhdWx0IGFzeW5jIChyZXEpID0+IHtcclxuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxLnVybCk7XHJcbiAgICBjb25zdCBhdHRlbXB0SWQgPSB1cmwuc2VhcmNoUGFyYW1zLmdldChcImF0dGVtcHRJZFwiKTtcclxuXHJcbiAgICBjb25zdCByZWRpc1VybCA9IHByb2Nlc3MuZW52LlVQU1RBU0hfUkVESVNfUkVTVF9VUkw7XHJcbiAgICBjb25zdCByZWRpc1Rva2VuID0gcHJvY2Vzcy5lbnYuVVBTVEFTSF9SRURJU19SRVNUX1RPS0VOO1xyXG5cclxuICAgIGNvbnN0IGluZm8gPSB7XHJcbiAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXHJcbiAgICAgICAgYXR0ZW1wdElkOiBhdHRlbXB0SWQgfHwgXCJOT1RfUFJPVklERURcIixcclxuICAgICAgICBlbnZDaGVjazoge1xyXG4gICAgICAgICAgICBoYXNSZWRpc1VybDogISFyZWRpc1VybCxcclxuICAgICAgICAgICAgaGFzUmVkaXNUb2tlbjogISFyZWRpc1Rva2VuLFxyXG4gICAgICAgICAgICBoYXNUZWxlZ3JhbVRva2VuOiAhIXByb2Nlc3MuZW52LlRFTEVHUkFNX0JPVF9UT0tFTlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVkaXNTdGF0ZTogbnVsbCxcclxuICAgICAgICBlcnJvcjogbnVsbFxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoYXR0ZW1wdElkICYmIHJlZGlzVXJsICYmIHJlZGlzVG9rZW4pIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZWRpc0VuZHBvaW50ID0gYCR7cmVkaXNVcmx9L2dldC8ke2F0dGVtcHRJZH1gO1xyXG4gICAgICAgICAgICBjb25zdCByZWRpc1JlcyA9IGF3YWl0IGZldGNoKHJlZGlzRW5kcG9pbnQsIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3JlZGlzVG9rZW59YCB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCByZWRpc0RhdGEgPSBhd2FpdCByZWRpc1Jlcy5qc29uKCk7XHJcbiAgICAgICAgICAgIGluZm8ucmVkaXNTdGF0ZSA9IHJlZGlzRGF0YS5yZXN1bHQ7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBpbmZvLmVycm9yID0gXCJSZWRpcyBFcnJvcjogXCIgKyBlLm1lc3NhZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChwcm9jZXNzLmVudi5URUxFR1JBTV9CT1RfVE9LRU4pIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0Z1JlcyA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS50ZWxlZ3JhbS5vcmcvYm90JHtwcm9jZXNzLmVudi5URUxFR1JBTV9CT1RfVE9LRU59L2dldFdlYmhvb2tJbmZvYCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRnRGF0YSA9IGF3YWl0IHRnUmVzLmpzb24oKTtcclxuICAgICAgICAgICAgaW5mby53ZWJob29rU3RhdHVzID0gdGdEYXRhLnJlc3VsdDtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGluZm8ud2ViaG9va1N0YXR1cyA9IHsgZXJyb3I6IGUubWVzc2FnZSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KGluZm8sIG51bGwsIDIpLCB7XHJcbiAgICAgICAgc3RhdHVzOiAyMDAsXHJcbiAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9XHJcbiAgICB9KTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb25maWcgPSB7IHBhdGg6IFwiL2FwaS9kZWJ1Zy1zdGF0ZVwiIH07XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7QUFBQSxJQUFPLHNCQUFRLE9BQU8sUUFBUTtBQUMxQixRQUFNLE1BQU0sSUFBSSxJQUFJLElBQUksR0FBRztBQUMzQixRQUFNLFlBQVksSUFBSSxhQUFhLElBQUksV0FBVztBQUVsRCxRQUFNLFdBQVcsUUFBUSxJQUFJO0FBQzdCLFFBQU0sYUFBYSxRQUFRLElBQUk7QUFFL0IsUUFBTSxPQUFPO0FBQUEsSUFDVCxZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsSUFDbEMsV0FBVyxhQUFhO0FBQUEsSUFDeEIsVUFBVTtBQUFBLE1BQ04sYUFBYSxDQUFDLENBQUM7QUFBQSxNQUNmLGVBQWUsQ0FBQyxDQUFDO0FBQUEsTUFDakIsa0JBQWtCLENBQUMsQ0FBQyxRQUFRLElBQUk7QUFBQSxJQUNwQztBQUFBLElBQ0EsWUFBWTtBQUFBLElBQ1osT0FBTztBQUFBLEVBQ1g7QUFFQSxNQUFJLGFBQWEsWUFBWSxZQUFZO0FBQ3JDLFFBQUk7QUFDQSxZQUFNLGdCQUFnQixHQUFHLFFBQVEsUUFBUSxTQUFTO0FBQ2xELFlBQU0sV0FBVyxNQUFNLE1BQU0sZUFBZTtBQUFBLFFBQ3hDLFNBQVMsRUFBRSxlQUFlLFVBQVUsVUFBVSxHQUFHO0FBQUEsTUFDckQsQ0FBQztBQUNELFlBQU0sWUFBWSxNQUFNLFNBQVMsS0FBSztBQUN0QyxXQUFLLGFBQWEsVUFBVTtBQUFBLElBQ2hDLFNBQVMsR0FBRztBQUNSLFdBQUssUUFBUSxrQkFBa0IsRUFBRTtBQUFBLElBQ3JDO0FBQUEsRUFDSjtBQUVBLE1BQUksUUFBUSxJQUFJLG9CQUFvQjtBQUNoQyxRQUFJO0FBQ0EsWUFBTSxRQUFRLE1BQU0sTUFBTSwrQkFBK0IsUUFBUSxJQUFJLGtCQUFrQixpQkFBaUI7QUFDeEcsWUFBTSxTQUFTLE1BQU0sTUFBTSxLQUFLO0FBQ2hDLFdBQUssZ0JBQWdCLE9BQU87QUFBQSxJQUNoQyxTQUFTLEdBQUc7QUFDUixXQUFLLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxRQUFRO0FBQUEsSUFDNUM7QUFBQSxFQUNKO0FBRUEsU0FBTyxJQUFJLFNBQVMsS0FBSyxVQUFVLE1BQU0sTUFBTSxDQUFDLEdBQUc7QUFBQSxJQUMvQyxRQUFRO0FBQUEsSUFDUixTQUFTLEVBQUUsZ0JBQWdCLG1CQUFtQjtBQUFBLEVBQ2xELENBQUM7QUFDTDtBQUVPLElBQU0sU0FBUyxFQUFFLE1BQU0sbUJBQW1COyIsCiAgIm5hbWVzIjogW10KfQo=
