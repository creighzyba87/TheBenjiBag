# Render.com Quick Start Guide

This is a condensed version of the complete Render deployment guide. Use this for a quick reference when deploying.

## Prerequisites Checklist

- [ ] Code pushed to GitHub: `Creighzyba87/TheBenjiBag`
- [ ] Render.com account created
- [ ] MongoDB Atlas connection string ready
- [ ] All API keys ready (MapTiler, Brevo, Helcim)

## Backend Deployment (5 Steps)

1. **Create Web Service**
   - Dashboard → New + → Web Service
   - Connect GitHub repo: `Creighzyba87/TheBenjiBag`

2. **Configure Settings**
   ```
   Name: thebenjibag-backend
   Root Directory: Backend
   Build Command: pnpm install
   Start Command: pnpm start
   ```

3. **Add Environment Variables**
   - Add Secret File: `.env`
   - Paste entire content of your local `.env` file
   - Leave `CORS_ORIGIN` blank for now

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

5. **Copy Backend URL**
   - Example: `https://thebenjibag-backend.onrender.com`

## Frontend Deployment (4 Steps)

1. **Create Static Site**
   - Dashboard → New + → Static Site
   - Connect same GitHub repo

2. **Configure Settings**
   ```
   Name: thebenjibag-frontend
   Root Directory: Frontend
   Build Command: pnpm install && pnpm build
   Publish Directory: dist
   ```

3. **Add Environment Variable**
   ```
   VITE_BACKEND_URL = https://thebenjibag-backend.onrender.com
   ```
   (Use your actual backend URL)

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete

## Connect Services (2 Steps)

1. **Update Backend CORS**
   - Go to backend service → Environment tab
   - Edit `CORS_ORIGIN` variable
   - Set to: `https://thebenjibag-frontend.onrender.com`
   - Save (this triggers auto-redeploy)

2. **Test Application**
   - Visit frontend URL
   - Test age gate, login, products

## Configuration Summary

| Service | Type | Root Dir | Build Command | Start/Publish |
|---------|------|----------|---------------|---------------|
| Backend | Web Service | `Backend` | `pnpm install` | `pnpm start` |
| Frontend | Static Site | `Frontend` | `pnpm install && pnpm build` | `dist` |

## Environment Variables

**Backend** (`.env` secret file):
- `MONGODB_URI`
- `JWT_SECRET`
- `MAPTILER_ADMIN`, `MAPTILER_DRIVER`, `MAPTILER_CUSTOMER`
- `BREVO_SMTP_USER`, `BREVO_SMTP_KEY`
- `HELCIM_API_KEY`
- `CORS_ORIGIN` (add after frontend is deployed)

**Frontend**:
- `VITE_BACKEND_URL` (your backend URL)

## Troubleshooting Quick Fixes

**CORS Errors**: Check `CORS_ORIGIN` matches frontend URL exactly (no trailing slash)

**Backend Won't Start**: Check logs for missing environment variables

**Frontend Blank**: Verify `VITE_BACKEND_URL` is set correctly

**Build Fails**: Verify Root Directory and Build Command are correct

---

For detailed instructions, see `Render_Deployment_Guide.md`
