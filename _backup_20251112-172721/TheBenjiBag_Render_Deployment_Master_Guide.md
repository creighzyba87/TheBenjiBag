# TheBenjiBag: The Complete Render.com Deployment Guide

**Purpose**: This guide is the single source of truth for deploying your TheBenjiBag application to Render.com. It covers everything from dependencies and API keys to custom domain setup, ensuring a successful deployment.

**Prepared by**: Manus AI  
**Last Updated**: November 11, 2025

---

## 1. Understanding the Deployment Process

Before we start, it's important to understand how your application will be deployed and how dependencies and APIs are handled.

### How Dependencies Are Managed

**You do not need to manually install any dependencies on Render.**

Render.com automatically detects the `package.json` files in your `Backend` and `Frontend` folders. During the build process, it runs the `pnpm install` command, which downloads and installs all the necessary packages listed in those files. This includes:

- **Backend**: Express, Mongoose, Socket.IO, tRPC, etc.
- **Frontend**: React, Vite, Tailwind CSS, MapTiler SDK, etc.

This automated process ensures that your application always has the correct dependencies to run.

### How APIs and Secrets Are Managed

**You must never store API keys or secrets directly in your code or on GitHub.**

We will use Render's **Environment Variables** to securely store and use your secrets. These are values that you provide in the Render dashboard, which are then made available to your application at runtime. You will need to add all the keys from your local `.env` file to Render.

### Deployment Architecture

We will deploy your application as two separate services:

1.  **Backend (Web Service)**: A continuously running Node.js server that handles API requests, database interactions, and real-time events.
2.  **Frontend (Static Site)**: A set of pre-built HTML, CSS, and JavaScript files served globally via Render's CDN for maximum speed.

This is the standard and most robust way to deploy a full-stack application.

---

## 2. Prerequisites Checklist

Before you begin, ensure you have the following ready:

- [ ] **GitHub Repository**: Your `Creighzyba87/TheBenjiBag` repository is live and correct.
- [ ] **Render Account**: You have a Render.com account.
- [ ] **Domain Name**: You own the domain `thebenjibag.com`.
- [ ] **API Keys & Secrets**: You have all the following credentials ready to copy-paste:
    - MongoDB Atlas Connection String
    - JWT Secret (a long, random string you create)
    - MapTiler API Keys (Admin, Driver, Customer)
    - Brevo SMTP Credentials (User and Key)
    - Helcim API Key

---

## 3. Step-by-Step Deployment Instructions

Follow these steps in order. The backend must be deployed first.

### Part A: Deploy the Backend Service

1.  **Create a New Web Service**
    - Log in to your [Render Dashboard](https://dashboard.render.com).
    - Click **New +** → **Web Service**.

2.  **Connect Your Repository**
    - Select **Build and deploy from a Git repository**.
    - Connect your `Creighzyba87/TheBenjiBag` repository.

3.  **Configure the Service**
    Fill in the details exactly as shown below:

| Setting | Value |
| :--- | :--- |
| **Name** | `thebenjibag-backend` |
| **Region** | `US East (Ohio)` (or your preferred region) |
| **Branch** | `main` |
| **Root Directory** | `Backend` |
| **Runtime** | `Node` |
| **Build Command** | `pnpm install` |
| **Start Command** | `pnpm start` |
| **Instance Type** | `Free` |

4.  **Add Environment Variables (The Most Important Step)**
    - Scroll down to the **Advanced** section.
    - Click **Add Environment Variable**.
    - Select the type **Secret File**.
    - For the **Filename**, enter `.env`.
    - In the **Contents** box, copy and paste the entire content of your local `.env` file. It should look like this, but with your actual secrets:

    ```env
    # Server Configuration
    PORT=10000
    NODE_ENV=production

    # Database
    MONGODB_URI=your_mongodb_atlas_connection_string

    # Authentication
    JWT_SECRET=your_super_secret_jwt_string_here

    # MapTiler API Keys
    MAPTILER_ADMIN=your_maptiler_admin_key
    MAPTILER_DRIVER=your_maptiler_driver_key
    MAPTILER_CUSTOMER=your_maptiler_customer_key

    # Brevo Email Service
    BREVO_SMTP_HOST=smtp-relay.brevo.com
    BREVO_SMTP_PORT=587
    BREVO_SMTP_SECURE=false
    BREVO_SMTP_USER=your_brevo_smtp_username
    BREVO_SMTP_KEY=your_brevo_smtp_api_key
    BREVO_SMTP_FROM=admin@thebenjibag.com

    # Helcim Payment Processing
    HELCIM_API_KEY=your_helcim_api_key
    HELCIM_TEST_MODE=true

    # CORS Configuration - LEAVE THIS BLANK FOR NOW
    CORS_ORIGIN=
    ```

    **CRITICAL**: Leave `CORS_ORIGIN` blank for now. We will fill this in later.

5.  **Create and Deploy**
    - Click the **Create Web Service** button.
    - Wait for the deployment to complete. It will show a "Live" status.

6.  **Copy Your Backend URL**
    - At the top of the service page, copy the URL. It will be something like `https://thebenjibag-backend.onrender.com`.
    - **Save this URL.** You need it for the next part.

### Part B: Deploy the Frontend Service

1.  **Create a New Static Site**
    - Go back to the [Render Dashboard](https://dashboard.render.com).
    - Click **New +** → **Static Site**.

2.  **Connect the Same Repository**
    - Select your `Creighzyba87/TheBenjiBag` repository again.

3.  **Configure the Service**
    Fill in the details exactly as shown below:

| Setting | Value |
| :--- | :--- |
| **Name** | `thebenjibag-frontend` |
| **Branch** | `main` |
| **Root Directory** | `Frontend` |
| **Build Command** | `pnpm install && pnpm build` |
| **Publish Directory** | `dist` |

4.  **Add the Backend URL**
    - Scroll down and click **Add Environment Variable**.
    - Add the following:

| Key | Value |
| :--- | :--- |
| `VITE_BACKEND_URL` | `https://thebenjibag-backend.onrender.com` (Your actual backend URL) |

5.  **Create and Deploy**
    - Click the **Create Static Site** button.
    - Wait for the deployment to complete.

### Part C: Configure Your Custom Domain (`thebenjibag.com`)

1.  **Add the Domain to Render**
    - In your Render dashboard, go to your **frontend service** (`thebenjibag-frontend`).
    - Click the **Custom Domains** tab.
    - Click **Add Custom Domain**, enter `thebenjibag.com`, and click **Save**.
    - Render will now show you the DNS records you need to add.

2.  **Update DNS at Your Registrar**
    - Log in to your domain registrar (e.g., GoDaddy, Namecheap).
    - Go to the DNS management page for `thebenjibag.com`.
    - Add the following two records:

    | Type | Name/Host | Value/Points to |
    | :--- | :--- | :--- |
    | `A` | `@` | The IP address provided by Render |
    | `CNAME` | `www` | Your Render frontend URL (e.g., `thebenjibag-frontend.onrender.com`) |

3.  **Verify the Domain**
    - It can take a few minutes to a few hours for DNS changes to propagate.
    - Render will automatically verify the records and provision a free SSL certificate.
    - Your site will then be live at `https://thebenjibag.com`.

### Part D: Final Connection (CORS)

This is the final, critical step to allow your frontend to talk to your backend.

1.  **Go Back to Your Backend Service**
    - In your Render dashboard, navigate to your `thebenjibag-backend` service.

2.  **Update the CORS Environment Variable**
    - Go to the **Environment** tab.
    - Find the `CORS_ORIGIN` variable.
    - Update the value to include **both** your Render URL and your custom domain, separated by a comma:

    ```
    https://thebenjibag-frontend.onrender.com,https://thebenjibag.com
    ```

    **IMPORTANT**: Do not include a trailing slash (`/`).

3.  **Save and Redeploy**
    - Click **Save Changes**.
    - Render will automatically redeploy your backend. Wait for this to complete.

---

## 4. Final Verification

1.  Open your custom domain in a browser: **https://thebenjibag.com**
2.  Test all site functionality:
    - Age gate, user registration, login.
    - Product catalog, shopping cart, checkout.
3.  Open the browser developer console (F12) and ensure there are no CORS errors.

## Troubleshooting

- **CORS Errors**: The most common issue. Double-check that `CORS_ORIGIN` on the backend is set correctly and that the backend has finished redeploying.
- **Backend Fails to Start**: Check the backend logs on Render. This is almost always due to a missing or incorrect environment variable (especially `MONGODB_URI`).
- **Custom Domain Not Working**: DNS changes can take time. Use a tool like [DNS Checker](https://dnschecker.org/) to verify your records. Also, ensure the A and CNAME records are correct.

---

**Your application is now fully deployed and live on your custom domain!** 🎉
