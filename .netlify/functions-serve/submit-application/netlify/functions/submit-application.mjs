
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// frontend/netlify/functions/submit-application.js
var submit_application_default = async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }
  try {
    const data = await req.json();
    console.log("Submit application:", data);
    return new Response(JSON.stringify({
      status: "success",
      message: "Application submitted successfully",
      application: { id: Math.floor(Math.random() * 1e6) }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to process" }), { status: 400 });
  }
};
var config = { path: "/api/submit-application" };
export {
  config,
  submit_application_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZnJvbnRlbmQvbmV0bGlmeS9mdW5jdGlvbnMvc3VibWl0LWFwcGxpY2F0aW9uLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgZGVmYXVsdCBhc3luYyAocmVxKSA9PiB7XHJcbiAgICBpZiAocmVxLm1ldGhvZCAhPT0gXCJQT1NUXCIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwiTWV0aG9kIG5vdCBhbGxvd2VkXCIgfSksIHsgc3RhdHVzOiA0MDUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVxLmpzb24oKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlN1Ym1pdCBhcHBsaWNhdGlvbjpcIiwgZGF0YSk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICBzdGF0dXM6IFwic3VjY2Vzc1wiLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkFwcGxpY2F0aW9uIHN1Ym1pdHRlZCBzdWNjZXNzZnVsbHlcIixcclxuICAgICAgICAgICAgYXBwbGljYXRpb246IHsgaWQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApIH1cclxuICAgICAgICB9KSwge1xyXG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcclxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwiRmFpbGVkIHRvIHByb2Nlc3NcIiB9KSwgeyBzdGF0dXM6IDQwMCB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb25maWcgPSB7IHBhdGg6IFwiL2FwaS9zdWJtaXQtYXBwbGljYXRpb25cIiB9O1xyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7O0FBQUEsSUFBTyw2QkFBUSxPQUFPLFFBQVE7QUFDMUIsTUFBSSxJQUFJLFdBQVcsUUFBUTtBQUN2QixXQUFPLElBQUksU0FBUyxLQUFLLFVBQVUsRUFBRSxPQUFPLHFCQUFxQixDQUFDLEdBQUcsRUFBRSxRQUFRLElBQUksQ0FBQztBQUFBLEVBQ3hGO0FBRUEsTUFBSTtBQUNBLFVBQU0sT0FBTyxNQUFNLElBQUksS0FBSztBQUM1QixZQUFRLElBQUksdUJBQXVCLElBQUk7QUFFdkMsV0FBTyxJQUFJLFNBQVMsS0FBSyxVQUFVO0FBQUEsTUFDL0IsUUFBUTtBQUFBLE1BQ1IsU0FBUztBQUFBLE1BQ1QsYUFBYSxFQUFFLElBQUksS0FBSyxNQUFNLEtBQUssT0FBTyxJQUFJLEdBQU8sRUFBRTtBQUFBLElBQzNELENBQUMsR0FBRztBQUFBLE1BQ0EsUUFBUTtBQUFBLE1BQ1IsU0FBUyxFQUFFLGdCQUFnQixtQkFBbUI7QUFBQSxJQUNsRCxDQUFDO0FBQUEsRUFDTCxTQUFTLEtBQUs7QUFDVixXQUFPLElBQUksU0FBUyxLQUFLLFVBQVUsRUFBRSxPQUFPLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxRQUFRLElBQUksQ0FBQztBQUFBLEVBQ3ZGO0FBQ0o7QUFFTyxJQUFNLFNBQVMsRUFBRSxNQUFNLDBCQUEwQjsiLAogICJuYW1lcyI6IFtdCn0K
