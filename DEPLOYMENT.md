# Deployment Guide

## Frontend (Vercel)

1. **Local Development**
   - Run `npm run dev` in `client/`
   - Client will use Vite proxy: `/api` → `http://localhost:3000` (backend)
   - Backend must run locally with `npm run server` in `server/`

2. **Production on Vercel**
   - `.env.production` file controls production build
   - Update `VITE_BACKEND_URL` to your production backend URL
   - Push to GitHub → Vercel auto-deploys
   - If `VITE_BACKEND_URL` is empty, app will use relative `/api` paths (requires backend on same domain)

3. **Vercel Environment Variables** (recommended setup)
   - Add these in Vercel Dashboard → Settings → Environment Variables
   - `VITE_BACKEND_URL`: https://your-backend-api.com
   - Other secrets from `.env.production`

## Backend (Node.js)

Deploy to:
- Heroku, Railway, Render, AWS, DigitalOcean, etc.
- Update `VITE_BACKEND_URL` in Vercel to point to your deployed backend

### Quick Deploy Options:
- **Railway**: `npm install -g railway && railway link && railway up`
- **Render**: Connect GitHub repo, set build command `npm install && npm start`
- **Fly.io**: `npm install -g flyctl && fly launch`

## Current Issue

Your deployed app (`major-minor.vercel.app`) is still calling `http://localhost:3000` because:
1. Old code was cached / not redeployed yet
2. Or `VITE_BACKEND_URL` is still set to localhost in Vercel env vars

**Fix:**
1. Commit `.env.production` changes
2. Push to GitHub
3. Wait for Vercel to rebuild (check Vercel Dashboard → Deployments)
4. Set `VITE_BACKEND_URL` in Vercel project settings to your backend URL
