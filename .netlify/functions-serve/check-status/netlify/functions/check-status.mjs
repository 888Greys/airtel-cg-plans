
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// frontend/netlify/functions/check-status.js
var check_status_default = async (req) => {
  const url = new URL(req.url);
  const attemptId = url.searchParams.get("attemptId");
  console.log("check-status called for:", attemptId);
  if (!attemptId) {
    return new Response(JSON.stringify({ status: "pending" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!redisUrl || !redisToken) {
      console.error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN");
      return new Response(JSON.stringify({ status: "pending", error: "Configuration Error" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const redisEndpoint = `${redisUrl}/get/${attemptId}`;
    const redisRes = await fetch(redisEndpoint, {
      headers: { Authorization: `Bearer ${redisToken}` }
    });
    const redisData = await redisRes.json();
    console.log("Redis GET result:", redisData);
    const status = redisData.result || "pending";
    console.log("Returning status:", status);
    return new Response(JSON.stringify({ status }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("check-status error:", err.message);
    return new Response(JSON.stringify({ status: "pending" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};
var config = { path: "/api/check-status" };
export {
  config,
  check_status_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZnJvbnRlbmQvbmV0bGlmeS9mdW5jdGlvbnMvY2hlY2stc3RhdHVzLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgZGVmYXVsdCBhc3luYyAocmVxKSA9PiB7XHJcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHJlcS51cmwpO1xyXG4gICAgY29uc3QgYXR0ZW1wdElkID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJhdHRlbXB0SWRcIik7XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJjaGVjay1zdGF0dXMgY2FsbGVkIGZvcjpcIiwgYXR0ZW1wdElkKTtcclxuXHJcbiAgICBpZiAoIWF0dGVtcHRJZCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoeyBzdGF0dXM6IFwicGVuZGluZ1wiIH0pLCB7XHJcbiAgICAgICAgICAgIHN0YXR1czogMjAwLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlZGlzVXJsID0gcHJvY2Vzcy5lbnYuVVBTVEFTSF9SRURJU19SRVNUX1VSTDtcclxuICAgICAgICBjb25zdCByZWRpc1Rva2VuID0gcHJvY2Vzcy5lbnYuVVBTVEFTSF9SRURJU19SRVNUX1RPS0VOO1xyXG5cclxuICAgICAgICBpZiAoIXJlZGlzVXJsIHx8ICFyZWRpc1Rva2VuKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJNaXNzaW5nIFVQU1RBU0hfUkVESVNfUkVTVF9VUkwgb3IgVVBTVEFTSF9SRURJU19SRVNUX1RPS0VOXCIpO1xyXG4gICAgICAgICAgICAvLyBSZXR1cm4gcGVuZGluZyBzbyBmcm9udGVuZCBkb2Vzbid0IGNyYXNoIHdoaWxlIGNvbmZpZ3VyaW5nXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoeyBzdGF0dXM6IFwicGVuZGluZ1wiLCBlcnJvcjogXCJDb25maWd1cmF0aW9uIEVycm9yXCIgfSksIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmVhZCBmcm9tIFVwc3Rhc2ggUmVkaXNcclxuICAgICAgICBjb25zdCByZWRpc0VuZHBvaW50ID0gYCR7cmVkaXNVcmx9L2dldC8ke2F0dGVtcHRJZH1gO1xyXG4gICAgICAgIGNvbnN0IHJlZGlzUmVzID0gYXdhaXQgZmV0Y2gocmVkaXNFbmRwb2ludCwge1xyXG4gICAgICAgICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtyZWRpc1Rva2VufWAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCByZWRpc0RhdGEgPSBhd2FpdCByZWRpc1Jlcy5qc29uKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSZWRpcyBHRVQgcmVzdWx0OlwiLCByZWRpc0RhdGEpO1xyXG5cclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZWRpc0RhdGEucmVzdWx0IHx8IFwicGVuZGluZ1wiO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmV0dXJuaW5nIHN0YXR1czpcIiwgc3RhdHVzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShKU09OLnN0cmluZ2lmeSh7IHN0YXR1cyB9KSwge1xyXG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcclxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcImNoZWNrLXN0YXR1cyBlcnJvcjpcIiwgZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoeyBzdGF0dXM6IFwicGVuZGluZ1wiIH0pLCB7XHJcbiAgICAgICAgICAgIHN0YXR1czogMjAwLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb25maWcgPSB7IHBhdGg6IFwiL2FwaS9jaGVjay1zdGF0dXNcIiB9O1xyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7O0FBQUEsSUFBTyx1QkFBUSxPQUFPLFFBQVE7QUFDMUIsUUFBTSxNQUFNLElBQUksSUFBSSxJQUFJLEdBQUc7QUFDM0IsUUFBTSxZQUFZLElBQUksYUFBYSxJQUFJLFdBQVc7QUFFbEQsVUFBUSxJQUFJLDRCQUE0QixTQUFTO0FBRWpELE1BQUksQ0FBQyxXQUFXO0FBQ1osV0FBTyxJQUFJLFNBQVMsS0FBSyxVQUFVLEVBQUUsUUFBUSxVQUFVLENBQUMsR0FBRztBQUFBLE1BQ3ZELFFBQVE7QUFBQSxNQUNSLFNBQVMsRUFBRSxnQkFBZ0IsbUJBQW1CO0FBQUEsSUFDbEQsQ0FBQztBQUFBLEVBQ0w7QUFFQSxNQUFJO0FBQ0EsVUFBTSxXQUFXLFFBQVEsSUFBSTtBQUM3QixVQUFNLGFBQWEsUUFBUSxJQUFJO0FBRS9CLFFBQUksQ0FBQyxZQUFZLENBQUMsWUFBWTtBQUMxQixjQUFRLE1BQU0sNERBQTREO0FBRTFFLGFBQU8sSUFBSSxTQUFTLEtBQUssVUFBVSxFQUFFLFFBQVEsV0FBVyxPQUFPLHNCQUFzQixDQUFDLEdBQUc7QUFBQSxRQUNyRixRQUFRO0FBQUEsUUFDUixTQUFTLEVBQUUsZ0JBQWdCLG1CQUFtQjtBQUFBLE1BQ2xELENBQUM7QUFBQSxJQUNMO0FBR0EsVUFBTSxnQkFBZ0IsR0FBRyxRQUFRLFFBQVEsU0FBUztBQUNsRCxVQUFNLFdBQVcsTUFBTSxNQUFNLGVBQWU7QUFBQSxNQUN4QyxTQUFTLEVBQUUsZUFBZSxVQUFVLFVBQVUsR0FBRztBQUFBLElBQ3JELENBQUM7QUFFRCxVQUFNLFlBQVksTUFBTSxTQUFTLEtBQUs7QUFDdEMsWUFBUSxJQUFJLHFCQUFxQixTQUFTO0FBRTFDLFVBQU0sU0FBUyxVQUFVLFVBQVU7QUFDbkMsWUFBUSxJQUFJLHFCQUFxQixNQUFNO0FBRXZDLFdBQU8sSUFBSSxTQUFTLEtBQUssVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHO0FBQUEsTUFDNUMsUUFBUTtBQUFBLE1BQ1IsU0FBUyxFQUFFLGdCQUFnQixtQkFBbUI7QUFBQSxJQUNsRCxDQUFDO0FBQUEsRUFFTCxTQUFTLEtBQUs7QUFDVixZQUFRLE1BQU0sdUJBQXVCLElBQUksT0FBTztBQUNoRCxXQUFPLElBQUksU0FBUyxLQUFLLFVBQVUsRUFBRSxRQUFRLFVBQVUsQ0FBQyxHQUFHO0FBQUEsTUFDdkQsUUFBUTtBQUFBLE1BQ1IsU0FBUyxFQUFFLGdCQUFnQixtQkFBbUI7QUFBQSxJQUNsRCxDQUFDO0FBQUEsRUFDTDtBQUNKO0FBRU8sSUFBTSxTQUFTLEVBQUUsTUFBTSxvQkFBb0I7IiwKICAibmFtZXMiOiBbXQp9Cg==
