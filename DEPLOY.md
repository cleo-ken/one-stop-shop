# Free Deployment Guide

## Quick Start: Render (Recommended)

**Easiest option** - Deploy both frontend and backend on Render for free.

### Prerequisites
- GitHub account
- Code pushed to a GitHub repository

### Steps:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/one-stop-shop.git
   git push -u origin main
   ```

2. **Deploy Backend First**:
   - Go to https://render.com
   - Sign up with GitHub (free)
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Settings:
     - **Name**: `oss-backend` (or any name)
     - **Environment**: Node
     - **Build Command**: `cd server && npm install`
     - **Start Command**: `cd server && npm start`
     - **Plan**: Free
   - Click "Create Web Service"
   - Wait ~2-3 minutes for deployment
   - **Copy the URL** (e.g., `https://oss-backend-xxxx.onrender.com`)

3. **Deploy Frontend**:
   - In Render dashboard, click "New +" → "Static Site"
   - Connect same GitHub repo
   - Settings:
     - **Name**: `oss-frontend`
     - **Build Command**: `cd client && npm install && npm run build`
     - **Publish Directory**: `client/dist`
     - **Plan**: Free
   - **Environment Variables**:
     - Key: `VITE_API_BASE`
     - Value: `https://YOUR-BACKEND-URL.onrender.com/api` (use the URL from step 2)
   - Click "Create Static Site"
   - Wait for deployment

4. **Done!** Visit your frontend URL to see the app live.

---

## Alternative: Vercel (Frontend) + Render (Backend)

### Frontend on Vercel (Faster, no sleep):
1. Go to https://vercel.com
2. Sign up with GitHub
3. "Add New" → "Project"
4. Import your repository
5. Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client` (click "Edit" to set)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Environment Variables**:
     - `VITE_API_BASE` = `https://your-backend-url.onrender.com/api`
6. Click "Deploy"
7. Done in ~1 minute!

### Backend on Render:
Follow steps 2 above.

---

## Important Notes

✅ **Free tiers are free forever** (with limits)
⚠️ **Render free tier**: Services sleep after 15 min inactivity (first request takes ~30s to wake)
✅ **Vercel free tier**: No sleep, instant responses
✅ **HTTPS included** on all platforms
✅ **Auto-deploy** on git push (after initial setup)

---

## Troubleshooting

**No data showing?**
- Check browser console for CORS errors
- Verify `VITE_API_BASE` environment variable is set correctly
- Make sure backend URL includes `/api` at the end

**Backend not responding?**
- Check Render logs (in dashboard)
- Verify server is using `process.env.PORT` (already configured)
- First request after sleep may take 30 seconds

**Frontend build fails?**
- Check build logs in deployment platform
- Ensure `VITE_API_BASE` is set before build
- Try building locally: `cd client && npm run build`
