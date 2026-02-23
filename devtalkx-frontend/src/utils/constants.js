// 🚀 This is the address of your Backend "Power Plant"
const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5002";
export const BASE_URL = rawUrl.replace(/\/$/, "");

if (!import.meta.env.VITE_API_URL && import.meta.env.PROD) {
    console.warn("⚠️ VITE_API_URL is not set in production! Falling back to localhost.");
}

console.log("🛠️ DevTalkX Mode:", import.meta.env.MODE);
console.log("🔗 Connecting to Backend at:", BASE_URL);