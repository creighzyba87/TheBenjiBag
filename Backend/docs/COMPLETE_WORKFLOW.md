# Complete Workflow: Reset GitHub Repository and Deploy to Render.com

This document provides a complete, end-to-end workflow for resetting your GitHub repository and deploying your TheBenjiBag application to Render.com.

**Prepared by**: Manus AI  
**Last Updated**: November 11, 2025

## Overview

This workflow consists of three main phases:

1.  **Phase 1**: Delete the old GitHub repository and create a new one.
2.  **Phase 2**: Push the correct project files to the new repository.
3.  **Phase 3**: Deploy both Backend and Frontend to Render.com.

## Prerequisites

Before you begin, ensure you have:

- Windows 10 or 11 with PowerShell
- Git installed on your computer
- A GitHub account with access to `Creighzyba87/TheBenjiBag`
- A Render.com account
- Your project files at `C:\TheBenjiBag`
- All environment variables and API keys ready (MongoDB, MapTiler, Brevo, Helcim)

## Phase 1: Reset GitHub Repository

### Step 1.1: Delete the Old Repository

1.  Go to [https://github.com/Creighzyba87/TheBenjiBag](https://github.com/Creighzyba87/TheBenjiBag)
2.  Click **Settings** tab
3.  Scroll to the **Danger Zone** at the bottom
4.  Click **Delete this repository**
5.  Type `Creighzyba87/TheBenjiBag` to confirm
6.  Click **I understand the consequences, delete this repository**

### Step 1.2: Create a New Empty Repository

1.  Go to [https://github.com/new](https://github.com/new)
2.  Fill in the details:
    - **Owner**: `Creighzyba87`
    - **Repository name**: `TheBenjiBag`
    - **Description**: `Full-stack cannabis delivery platform with React frontend and Node.js backend`
    - **Public** or **Private**: Your choice
    - **DO NOT** check any boxes (no README, no .gitignore, no license)
3.  Click **Create repository**

## Phase 2: Push Correct Files to GitHub

### Step 2.1: Prepare Your Local Project

1.  Open File Explorer and navigate to `C:\TheBenjiBag`
2.  Go to **View** tab and check **Hidden items**
3.  If you see a `.git` folder, delete it (this ensures a fresh start)

### Step 2.2: Run the Automated Script

1.  Open **PowerShell as Administrator**
2.  Navigate to the scripts folder:
    ```powershell
    cd C:\TheBenjiBag\scripts
    ```
3.  Run the reset script:
    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
    .\reset_and_push.ps1
    ```

### Step 2.3: Provide GitHub Credentials

When prompted:
- **Username**: `Creighzyba87`
- **Password**: Your GitHub Personal Access Token

**To create a Personal Access Token**:
1.  Go to [https://github.com/settings/tokens](https://github.com/settings/tokens)
2.  Click **Generate new token (classic)**
3.  Give it a name: `TheBenjiBag Deployment`
4.  Select scope: **repo** (full control of private repositories)
5.  Click **Generate token**
6.  Copy the token immediately (you won't see it again!)

### Step 2.4: Verify the Push

1.  Go to [https://github.com/Creighzyba87/TheBenjiBag](https://github.com/Creighzyba87/TheBenjiBag)
2.  You should see all your files organized correctly:
    - `Backend/` folder
    - `Frontend/` folder
    - `docs/` folder
    - `scripts/` folder
    - Documentation files (`.md` files)
    - `.gitignore` file

## Phase 3: Deploy to Render.com

Now that your GitHub repository is correct, we can deploy to Render.com.

### Step 3.1: Deploy the Backend

1.  Log in to [Render Dashboard](https://dashboard.render.com)
2.  Click **New +** → **Web Service**
3.  Connect your GitHub repository: `Creighzyba87/TheBenjiBag`
4.  Configure the backend service:

| Setting | Value |
| :--- | :--- |
| **Name** | `thebenjibag-backend` |
| **Region** | `US East (Ohio)` |
| **Branch** | `main` |
| **Root Directory** | `Backend` |
| **Runtime** | `Node` |
| **Build Command** | `pnpm install` |
| **Start Command** | `pnpm start` |
| **Instance Type** | `Free` |

5.  Add environment variables:
    - Click **Add Environment Variable**
    - Add as **Secret File**: `.env`
    - Paste the entire content of your local `Backend/.env` file
    - **Leave `CORS_ORIGIN` blank for now** (we'll add it after frontend is deployed)

6.  Click **Create Web Service**
7.  Wait for deployment to complete (watch the logs)
8.  **Copy the backend URL** (e.g., `https://thebenjibag-backend.onrender.com`)

### Step 3.2: Deploy the Frontend

1.  From Render Dashboard, click **New +** → **Static Site**
2.  Connect the same GitHub repository: `Creighzyba87/TheBenjiBag`
3.  Configure the frontend service:

| Setting | Value |
| :--- | :--- |
| **Name** | `thebenjibag-frontend` |
| **Branch** | `main` |
| **Root Directory** | `Frontend` |
| **Build Command** | `pnpm install && pnpm build` |
| **Publish Directory** | `dist` |

4.  Add environment variable:
    - **Key**: `VITE_BACKEND_URL`
    - **Value**: Your backend URL (e.g., `https://thebenjibag-backend.onrender.com`)

5.  Click **Create Static Site**
6.  Wait for deployment to complete
7.  **Copy the frontend URL** (e.g., `https://thebenjibag-frontend.onrender.com`)

### Step 3.3: Connect Backend and Frontend (CORS)

1.  Go back to your **Backend service** on Render
2.  Click the **Environment** tab
3.  Find the `CORS_ORIGIN` variable (or add it if it doesn't exist)
4.  Set the value to your **frontend URL** (e.g., `https://thebenjibag-frontend.onrender.com`)
5.  Click **Save Changes**
6.  Render will automatically redeploy the backend

### Step 3.4: Test Your Application

1.  Open your frontend URL in a browser
2.  Test the following:
    - Age gate appears and works
    - User registration works
    - Login works
    - Products load correctly
    - Shopping cart works
    - Checkout process works
3.  Open browser developer console (F12) and check for errors

## Summary of URLs

After completing this workflow, you will have:

| Service | URL |
| :--- | :--- |
| **GitHub Repository** | `https://github.com/Creighzyba87/TheBenjiBag` |
| **Backend API** | `https://thebenjibag-backend.onrender.com` |
| **Frontend App** | `https://thebenjibag-frontend.onrender.com` |

## Troubleshooting

### GitHub Push Failed

**Issue**: Authentication failed when pushing to GitHub.

**Solution**: Ensure you're using a Personal Access Token, not your GitHub password. The token must have `repo` scope.

### Backend Deployment Failed

**Issue**: Backend service fails to start on Render.

**Solution**: 
- Check the logs on Render for error messages
- Verify all environment variables are set correctly
- Ensure `PORT=10000` is in your environment variables
- Verify MongoDB connection string is correct

### Frontend Shows Blank Page

**Issue**: Frontend loads but shows a blank page.

**Solution**:
- Check browser console for errors
- Verify `VITE_BACKEND_URL` is set correctly in frontend environment variables
- Ensure backend is running and accessible

### CORS Errors

**Issue**: Browser console shows CORS errors.

**Solution**:
- Verify `CORS_ORIGIN` on backend matches your frontend URL exactly
- Ensure there's no trailing slash in the URL
- Wait for backend to finish redeploying after changing CORS_ORIGIN

## Additional Resources

For more detailed information, refer to these guides in your project:

- **Render_Deployment_Guide.md** - Complete Render.com deployment instructions
- **RENDER_QUICK_START.md** - Quick reference for Render deployment
- **GITHUB_REPO_RESET_GUIDE.md** - Detailed GitHub repository reset instructions
- **Setup_Guide.md** - Complete local setup guide
- **Dependencies_Guide.md** - Dependency installation guide

---

**Prepared by**: Manus AI  
**Last Updated**: November 11, 2025
