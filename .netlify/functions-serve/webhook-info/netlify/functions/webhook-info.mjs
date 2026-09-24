
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// frontend/netlify/functions/webhook-info.ts
var webhook_info_default = async (req) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: "TELEGRAM_BOT_TOKEN not set" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  const response = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  const data = await response.json();
  return new Response(JSON.stringify(data, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
var config = {
  path: "/api/webhook-info"
};
export {
  config,
  webhook_info_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZnJvbnRlbmQvbmV0bGlmeS9mdW5jdGlvbnMvd2ViaG9vay1pbmZvLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgZGVmYXVsdCBhc3luYyAocmVxOiBSZXF1ZXN0KSA9PiB7XHJcbiAgICBjb25zdCB0b2tlbiA9IHByb2Nlc3MuZW52LlRFTEVHUkFNX0JPVF9UT0tFTjtcclxuXHJcbiAgICBpZiAoIXRva2VuKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBcIlRFTEVHUkFNX0JPVF9UT0tFTiBub3Qgc2V0XCIgfSksIHtcclxuICAgICAgICAgICAgc3RhdHVzOiA1MDAsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkudGVsZWdyYW0ub3JnL2JvdCR7dG9rZW59L2dldFdlYmhvb2tJbmZvYCk7XHJcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMiksIHtcclxuICAgICAgICBzdGF0dXM6IDIwMCxcclxuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xyXG4gICAgcGF0aDogXCIvYXBpL3dlYmhvb2staW5mb1wiXHJcbn07XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7QUFBQSxJQUFPLHVCQUFRLE9BQU8sUUFBaUI7QUFDbkMsUUFBTSxRQUFRLFFBQVEsSUFBSTtBQUUxQixNQUFJLENBQUMsT0FBTztBQUNSLFdBQU8sSUFBSSxTQUFTLEtBQUssVUFBVSxFQUFFLE9BQU8sNkJBQTZCLENBQUMsR0FBRztBQUFBLE1BQ3pFLFFBQVE7QUFBQSxNQUNSLFNBQVMsRUFBRSxnQkFBZ0IsbUJBQW1CO0FBQUEsSUFDbEQsQ0FBQztBQUFBLEVBQ0w7QUFFQSxRQUFNLFdBQVcsTUFBTSxNQUFNLCtCQUErQixLQUFLLGlCQUFpQjtBQUNsRixRQUFNLE9BQU8sTUFBTSxTQUFTLEtBQUs7QUFFakMsU0FBTyxJQUFJLFNBQVMsS0FBSyxVQUFVLE1BQU0sTUFBTSxDQUFDLEdBQUc7QUFBQSxJQUMvQyxRQUFRO0FBQUEsSUFDUixTQUFTLEVBQUUsZ0JBQWdCLG1CQUFtQjtBQUFBLEVBQ2xELENBQUM7QUFDTDtBQUVPLElBQU0sU0FBUztBQUFBLEVBQ2xCLE1BQU07QUFDVjsiLAogICJuYW1lcyI6IFtdCn0K
