# 🛠️ Deployment Fix Guide

If your app shows "**Cannot reach the server**" on other devices or on the live link, follow these steps to link your Netlify frontend to your Render backend.

## 1. Get your Render Backend URL
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click on your backend service.
3. Copy the URL at the top (it looks like `https://devtalkx-back.onrender.com`).

---

## 2. Update Netlify Settings (Frontend)
1. Go to your [Netlify Dashboard](https://app.netlify.com/).
2. Select your `devtalkx` site.
3. Go to **Site Configuration** > **Environment variables**.
4. Click **Add a variable** > **Add single variable**.
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` (Paste the URL from Step 1)
5. **IMPORTANT**: Go to the **Deploys** tab, click **Trigger deploy** > **Clear cache and deploy site**. 
   *Vite needs a fresh build to bake this URL into the code.*

---

## 3. Update Render Settings (Backend)
1. In your Render Dashboard, go to your backend service.
2. Go to the **Environment** tab.
3. Add (or update) these variables:
   - **Key**: `CLIENT_URL`
     - **Value**: `https://devtalkx.netlify.app`
   - **Key**: `NODE_ENV`
     - **Value**: `production`
4. Click **Save Changes**. The service will restart automatically.

---

## 4. Verify
- Open your Netlify link: `https://devtalkx.netlify.app/`
- Open the browser console (Press **F12** or **Inspect**).
- You should see: `🔗 Connecting to Backend at: https://devtalkx-back.onrender.com`
- If you still see `localhost`, repeat Step 2 (Clear cache and deploy).
