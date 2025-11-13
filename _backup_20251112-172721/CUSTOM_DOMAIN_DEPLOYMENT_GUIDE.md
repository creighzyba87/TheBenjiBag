# Guide to Deploying with a Custom Domain on Render.com

This guide provides step-by-step instructions for deploying your TheBenjiBag application to Render.com and connecting it to your custom domain `thebenjibag.com`.

**Prepared by**: Manus AI  
**Last Updated**: November 11, 2025

## Overview

This process involves three main stages:

1.  **Deploying the Backend and Frontend** to Render.com.
2.  **Configuring your custom domain** (`thebenjibag.com`) for the frontend.
3.  **Updating the Backend CORS** to allow requests from your custom domain.

## Prerequisites

- **GitHub Repository**: Your `Creighzyba87/TheBenjiBag` repository is live and correct.
- **Render Account**: You have a Render.com account.
- **Domain Name**: You have purchased the domain `thebenjibag.com` from a domain registrar (e.g., GoDaddy, Namecheap, Google Domains).
- **API Keys**: You have all your API keys and secrets ready (MongoDB, MapTiler, Brevo, Helcim).

## Part 1: Deploy Backend and Frontend

First, deploy both services to Render.com using the standard URLs. We will add the custom domain after they are live.

### Step 1.1: Deploy the Backend (Web Service)

1.  Go to [Render Dashboard](https://dashboard.render.com) → **New +** → **Web Service**.
2.  Connect your `Creighzyba87/TheBenjiBag` repository.
3.  Configure the service:

| Setting | Value |
| :--- | :--- |
| **Name** | `thebenjibag-backend` |
| **Root Directory** | `Backend` |
| **Build Command** | `pnpm install` |
| **Start Command** | `pnpm start` |

4.  Add your environment variables (API keys, secrets) as a **Secret File** named `.env`.
5.  **Leave `CORS_ORIGIN` blank for now**.
6.  Click **Create Web Service** and wait for it to deploy.
7.  Copy the backend URL (e.g., `https://thebenjibag-backend.onrender.com`).

### Step 1.2: Deploy the Frontend (Static Site)

1.  Go to [Render Dashboard](https://dashboard.render.com) → **New +** → **Static Site**.
2.  Connect the same `Creighzyba87/TheBenjiBag` repository.
3.  Configure the service:

| Setting | Value |
| :--- | :--- |
| **Name** | `thebenjibag-frontend` |
| **Root Directory** | `Frontend` |
| **Build Command** | `pnpm install && pnpm build` |
| **Publish Directory** | `dist` |

4.  Add the environment variable:
    - **Key**: `VITE_BACKEND_URL`
    - **Value**: Your backend URL (e.g., `https://thebenjibag-backend.onrender.com`)

5.  Click **Create Static Site** and wait for it to deploy.

## Part 2: Configure Your Custom Domain

Now, we will point `thebenjibag.com` to your frontend service on Render.

### Step 2.1: Add the Custom Domain to Render

1.  In your Render dashboard, go to your **frontend service** (`thebenjibag-frontend`).
2.  Click on the **Custom Domains** tab.
3.  Click **Add Custom Domain**.
4.  Enter `thebenjibag.com` and click **Save**.
5.  Render will now show you the DNS records you need to add to your domain registrar. It will typically be a CNAME record.

    *(Imagine a screenshot here showing the Render Custom Domains page with the required DNS records)*

### Step 2.2: Add DNS Records at Your Domain Registrar

1.  Log in to your domain registrar (e.g., GoDaddy, Namecheap).
2.  Go to the DNS management section for `thebenjibag.com`.
3.  You will need to add two records:

    **Record 1: Root Domain (thebenjibag.com)**
    - **Type**: `A`
    - **Name/Host**: `@` (this represents the root domain)
    - **Value/Points to**: The IP address provided by Render (e.g., `216.24.57.1`)
    - **TTL**: Leave as default (usually 1 hour)

    **Record 2: WWW Subdomain (www.thebenjibag.com)**
    - **Type**: `CNAME`
    - **Name/Host**: `www`
    - **Value/Points to**: Your Render frontend URL (e.g., `thebenjibag-frontend.onrender.com`)
    - **TTL**: Leave as default

    *(Imagine a screenshot here showing the DNS management page of a domain registrar with the A and CNAME records added)*

4.  Save the changes.

### Step 2.3: Verify the Domain

1.  Go back to the **Custom Domains** tab in your Render frontend service.
2.  It may take some time for the DNS changes to propagate (from a few minutes to a few hours).
3.  Render will automatically check for the correct DNS records. Once verified, it will provision an SSL certificate and your site will be live at `https://thebenjibag.com`.

## Part 3: Update Backend CORS for Custom Domain

This is a critical final step to allow your frontend to communicate with your backend using the new custom domain.

1.  In your Render dashboard, go to your **backend service** (`thebenjibag-backend`).
2.  Click on the **Environment** tab.
3.  Find the `CORS_ORIGIN` environment variable.
4.  Update the value to include **both** your Render URL and your new custom domain, separated by a comma:

    ```
    https://thebenjibag-frontend.onrender.com,https://thebenjibag.com
    ```

    **IMPORTANT**: Do not include a trailing slash. The comma-separated list allows both URLs to make requests, which is useful for testing.

5.  Click **Save Changes**.
6.  Render will automatically redeploy your backend service. Wait for this to complete.

## Part 4: Final Verification

1.  Open your custom domain in a browser: [https://thebenjibag.com](https://thebenjibag.com)
2.  Test all functionality:
    - Age gate
    - User registration and login
    - Product catalog
    - Shopping cart and checkout
3.  Check the browser developer console (F12) to ensure there are no CORS errors.

## Summary of URLs and Configurations

| Service | URL / Configuration |
| :--- | :--- |
| **GitHub Repository** | `https://github.com/Creighzyba87/TheBenjiBag` |
| **Backend API** | `https://thebenjibag-backend.onrender.com` |
| **Frontend App** | `https://thebenjibag.com` |
| **Backend CORS** | `https://thebenjibag-frontend.onrender.com,https://thebenjibag.com` |

## Troubleshooting

### Issue: Custom Domain Not Working

- **DNS Propagation**: It can take up to 48 hours for DNS changes to propagate. Use a tool like [DNS Checker](https://dnschecker.org/) to see if your records are updated globally.
- **Incorrect DNS Records**: Double-check that the A and CNAME records at your domain registrar exactly match what Render provided.

### Issue: CORS Errors After Adding Custom Domain

- **Verify `CORS_ORIGIN`**: Ensure the backend `CORS_ORIGIN` variable includes `https://thebenjibag.com` (with no trailing slash).
- **Check Backend Redeployment**: Make sure the backend has finished redeploying after you updated the `CORS_ORIGIN` variable.

---

**Your application is now live on your custom domain!** 🎉
