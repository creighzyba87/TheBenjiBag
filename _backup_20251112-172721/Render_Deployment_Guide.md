# TheBenjiBag: Complete Render.com Deployment Guide

This document provides a detailed, step-by-step guide for deploying both the Backend and Frontend of TheBenjiBag application to Render.com. It covers creating two separate services, configuring them, and connecting them to work together.

**Prepared by**: Manus AI  
**Last Updated**: November 11, 2025

## Overview of Render.com Deployment Strategy

We will deploy TheBenjiBag as two separate services on Render.com. This is a common and robust pattern for full-stack applications.

1.  **Backend Service (Web Service)**: The Node.js/Express backend will be deployed as a **Web Service**. This service will run continuously, handle API requests, manage database connections, and process real-time events with Socket.IO.

2.  **Frontend Service (Static Site)**: The React frontend will be deployed as a **Static Site**. Render will build the React application into a set of static HTML, CSS, and JavaScript files and serve them globally via a CDN, ensuring fast load times for users.

This separation allows for independent scaling, deployment, and management of the frontend and backend.

## Prerequisites

Before you begin, ensure you have completed the following:

- **GitHub Repository**: Your TheBenjiBag project, with the `Backend` and `Frontend` folders, is pushed to a GitHub repository (`Creighzyba87/TheBenjiBag`).
- **Render Account**: You have a Render.com account. If not, sign up at [https://dashboard.render.com/register](https://dashboard.render.com/register).
- **Third-Party Accounts**: You have accounts and API keys for:
    - MongoDB Atlas
    - MapTiler
    - Brevo (for email)
    - Helcim (for payments)
- **Completed `.env` file**: You have a complete `.env` file with all your secret keys and credentials. You will need to copy these into Render.

## Part 1: Deploying the Backend (Web Service)

The backend must be deployed first, as the frontend will need its URL to make API requests.

### Step 1: Create a New Web Service

1.  Log in to your [Render Dashboard](https://dashboard.render.com).
2.  Click the **New +** button and select **Web Service**.

    *(Imagine a screenshot here showing the "New +" button and the "Web Service" option highlighted)*

### Step 2: Connect Your GitHub Repository

1.  Choose **Build and deploy from a Git repository**.
2.  If you haven't already, click **Connect account** under the GitHub section to authorize Render to access your repositories.
3.  Once connected, find your `Creighzyba87/TheBenjiBag` repository in the list and click **Connect**.

    *(Imagine a screenshot here showing the repository list with "TheBenjiBag" and the "Connect" button)*

### Step 3: Configure the Backend Service

Now, you will fill out the details for your backend service. This is the most important part.

| Setting | Value | Description |
| :--- | :--- | :--- |
| **Name** | `thebenjibag-backend` | A unique name for your service. Render will use this to create the URL. |
| **Region** | `(US East) Ohio` | Choose a region close to you or your users. |
| **Branch** | `main` | The GitHub branch to deploy from. |
| **Root Directory** | `Backend` | **Crucial!** This tells Render to run commands from the `Backend` subfolder. |
| **Runtime** | `Node` | Render should auto-detect this. |
| **Build Command** | `pnpm install` | Installs all dependencies defined in `Backend/package.json`. |
| **Start Command** | `pnpm start` | Runs the `start` script from `Backend/package.json` (`node server.js`). |
| **Instance Type** | `Free` | Select the free tier for this project. You can upgrade later if needed. |

*(Imagine a screenshot here showing the Render service configuration form filled out with the values above, especially highlighting the "Root Directory" setting)*

### Step 4: Add Environment Variables

This is the most critical step for the backend. You must add all your secret keys from your local `.env` file.

1.  Scroll down to the **Advanced** section.
2.  Click **Add Environment Group** or **Add Environment Variable**.
3.  Select **Secret File** as the type for easier management.
4.  For the **Filename**, enter `.env`.
5.  In the **Contents** box, copy and paste the **entire content** of your local `C:\TheBenjiBag\Backend\.env` file.

    ```env
    # Paste the full content of your .env file here
    PORT=10000
    NODE_ENV=production
    JWT_SECRET=your_super_secret_jwt_string_here
    MONGODB_URI=your_mongodb_atlas_connection_string
    
    # MapTiler Keys
    MAPTILER_ADMIN=your_maptiler_admin_key
    MAPTILER_DRIVER=your_maptiler_driver_key
    MAPTILER_CUSTOMER=your_maptiler_customer_key
    
    # Brevo Email
    BREVO_SMTP_HOST=smtp-relay.brevo.com
    BREVO_SMTP_PORT=587
    BREVO_SMTP_USER=your_brevo_smtp_user
    BREVO_SMTP_KEY=your_brevo_smtp_key
    BREVO_SMTP_FROM=admin@thebenjibag.com
    
    # Helcim Payments
    HELCIM_API_KEY=your_helcim_test_key
    HELCIM_TEST_MODE=true
    
    # CORS - IMPORTANT! Leave this blank for now. We will update it later.
    CORS_ORIGIN=
    ```

    **IMPORTANT**: For now, leave `CORS_ORIGIN` blank. We will fill this in after the frontend is deployed and we have its URL.

### Step 5: Create the Web Service

1.  Scroll to the bottom of the page.
2.  Click the **Create Web Service** button.

Render will now start building and deploying your backend. You can watch the progress in the **Logs** tab. This may take a few minutes.

### Step 6: Get Your Backend URL

Once the deployment is successful, you will see a "Live" status.

1.  At the top of your service page, you will find the URL for your backend.
2.  It will look something like: `https://thebenjibag-backend.onrender.com`
3.  **Copy this URL and save it.** You will need it for the frontend deployment.

    *(Imagine a screenshot here showing the live service URL at the top of the Render dashboard)*

## Part 2: Deploying the Frontend (Static Site)

Now that the backend is live, we can deploy the frontend and connect it to the backend.

### Step 1: Create a New Static Site

1.  Go back to your [Render Dashboard](https://dashboard.render.com).
2.  Click the **New +** button and select **Static Site**.

    *(Imagine a screenshot here showing the "New +" button and the "Static Site" option highlighted)*

### Step 2: Connect the Same GitHub Repository

1.  Select your `Creighzyba87/TheBenjiBag` repository again.

### Step 3: Configure the Frontend Service

This configuration is different from the backend. Pay close attention to the settings.

| Setting | Value | Description |
| :--- | :--- | :--- |
| **Name** | `thebenjibag-frontend` | A unique name for your frontend service. |
| **Branch** | `main` | The GitHub branch to deploy from. |
| **Root Directory** | `Frontend` | **Crucial!** This tells Render to run commands from the `Frontend` subfolder. |
| **Build Command** | `pnpm install && pnpm build` | Installs dependencies and then builds the React app for production. |
| **Publish Directory** | `dist` | **Crucial!** This is the folder where the built static files are located. |

*(Imagine a screenshot here showing the Render static site configuration form filled out with the values above, highlighting "Root Directory" and "Publish Directory")*

### Step 4: Add Environment Variables for the Frontend

The frontend needs to know the URL of the backend to make API requests.

1.  Scroll down and click **Add Environment Variable**.
2.  Add the following variable:

| Key | Value |
| :--- | :--- |
| `VITE_BACKEND_URL` | `https://thebenjibag-backend.onrender.com` |

    **IMPORTANT**: Replace the value with the actual URL of your backend service that you copied in Part 1, Step 6.

### Step 5: Create the Static Site

1.  Scroll to the bottom of the page.
2.  Click the **Create Static Site** button.

Render will now build and deploy your frontend. This is usually faster than the backend deployment.

### Step 6: Get Your Frontend URL

Once the deployment is successful, you will see a "Live" status.

1.  At the top of your service page, you will find the URL for your frontend.
2.  It will look something like: `https://thebenjibag-frontend.onrender.com`
3.  **Copy this URL.** This is the public URL for your application.

## Part 3: Connecting Frontend and Backend (CORS)

Now that both services are deployed, we need to allow the frontend to make requests to the backend. This is done by configuring CORS (Cross-Origin Resource Sharing) on the backend.

### Step 1: Go Back to Your Backend Service

1.  From your Render dashboard, navigate back to your `thebenjibag-backend` service.

### Step 2: Update the CORS Environment Variable

1.  Go to the **Environment** tab.
2.  Find the `CORS_ORIGIN` environment variable you created earlier.
3.  Click **Edit** and paste the URL of your **frontend** service into the value field.

    | Key | Value |
    | :--- | :--- |
    | `CORS_ORIGIN` | `https://thebenjibag-frontend.onrender.com` |

    **Note**: Do not include a trailing slash (`/`) at the end of the URL.

4.  Click **Save Changes**.

### Step 3: Trigger a New Backend Deployment

Render will detect the change in environment variables and automatically trigger a new deployment for your backend service. This is necessary for the changes to take effect.

1.  Wait for the new deployment to complete. You can monitor the progress in the **Logs** tab.

## Part 4: Final Verification

Once the backend has finished redeploying, your application should be fully functional.

1.  **Open Your Frontend URL**: Navigate to `https://thebenjibag-frontend.onrender.com` in your browser.
2.  **Test Functionality**:
    - Test the age gate.
    - Try creating a user account.
    - Log in and browse products.
    - Add items to the cart and proceed to checkout.
    - Check the browser's developer console (F12) for any errors, especially CORS errors.

If you see any errors, review the logs for both the frontend and backend services in the Render dashboard.

## Summary of Render Configuration

### Backend Service (`thebenjibag-backend`)

| Setting | Value |
| :--- | :--- |
| **Type** | Web Service |
| **Root Directory** | `Backend` |
| **Build Command** | `pnpm install` |
| **Start Command** | `pnpm start` |
| **Environment** | `.env` secret file + `CORS_ORIGIN` variable |

### Frontend Service (`thebenjibag-frontend`)

| Setting | Value |
| :--- | :--- |
| **Type** | Static Site |
| **Root Directory** | `Frontend` |
| **Build Command** | `pnpm install && pnpm build` |
| **Publish Directory** | `dist` |
| **Environment** | `VITE_BACKEND_URL` variable |

## Troubleshooting

### Issue: "Application failed to respond" on Backend

- **Check PORT**: Ensure your `.env` file has `PORT=10000`. Render requires web services to bind to this port.
- **Check Logs**: Review the backend logs for any startup errors. Common issues include incorrect MongoDB URI or missing environment variables.

### Issue: Frontend is blank or shows errors

- **Check `VITE_BACKEND_URL`**: Ensure this environment variable is set correctly in your frontend service settings on Render.
- **Check Browser Console**: Open the developer console (F12) and look for errors. CORS errors usually mean the `CORS_ORIGIN` variable on the backend is incorrect or the backend hasn't finished redeploying.

### Issue: CORS Errors

- **Verify `CORS_ORIGIN`**: Double-check that the `CORS_ORIGIN` on the backend exactly matches your frontend URL (e.g., `https://thebenjibag-frontend.onrender.com`), with no trailing slash.
- **Check Backend Redeployment**: Ensure the backend has finished redeploying after you updated the `CORS_ORIGIN` variable.

### Issue: Build Fails

- **Check Root Directory**: Ensure the `Root Directory` is set correctly for both services (`Backend` and `Frontend`).
- **Check Build Command**: Verify that the build commands are correct (`pnpm install` for backend, `pnpm install && pnpm build` for frontend).
- **Check `package.json`**: Ensure that `package.json` files exist in both the `Backend` and `Frontend` folders and contain all the necessary dependencies and scripts.

---

**Prepared by**: Manus AI  
**Last Updated**: November 11, 2025

## Advanced Topics

### Using render.yaml for Automated Deployment

For easier management and deployment, you can use a `render.yaml` file in the root of your repository. This file defines both services and their configurations in a single place.

A `render.yaml` file has been included in your project root. To use it:

1.  Go to your [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** and select **Blueprint**.
3.  Connect your GitHub repository.
4.  Render will detect the `render.yaml` file and create both services automatically.
5.  You will still need to manually add the sensitive environment variables (API keys, secrets) in each service's settings.

**Note**: The `render.yaml` approach is more advanced and is best used after you have manually deployed the services at least once to understand the configuration.

### Custom Domains

Once your application is working on the Render-provided URLs, you can add custom domains.

1.  Go to your frontend service settings on Render.
2.  Navigate to the **Custom Domains** section.
3.  Click **Add Custom Domain**.
4.  Enter your domain (e.g., `thebenjibag.com`).
5.  Follow the instructions to add the required DNS records to your domain registrar.
6.  Once the DNS records are verified, Render will automatically provision an SSL certificate and serve your site over HTTPS.

**Important**: After adding a custom domain to your frontend, you must update the `CORS_ORIGIN` environment variable on the backend to include your custom domain.

### Monitoring and Logs

Render provides built-in monitoring and logging for your services.

- **Logs**: Click on the **Logs** tab in any service to view real-time logs. This is invaluable for debugging issues.
- **Metrics**: The **Metrics** tab shows CPU, memory, and bandwidth usage for your service.
- **Alerts**: You can set up email alerts for service failures or high resource usage in the service settings.

### Scaling

The free tier on Render is suitable for development and small-scale production use. If your application grows, you can upgrade to paid plans that offer:

- More CPU and memory
- Faster builds
- Persistent storage
- Auto-scaling based on traffic
- Priority support

To upgrade, go to your service settings and select a different **Instance Type**.

### Database Backups

MongoDB Atlas (which you are using for your database) provides automatic backups. However, it is good practice to:

1.  Enable automated backups in your MongoDB Atlas cluster settings.
2.  Periodically export your data manually for additional safety.
3.  Test your backup restoration process to ensure you can recover data if needed.

### Environment-Specific Configurations

You may want to have different configurations for development, staging, and production environments. You can achieve this by:

1.  Creating separate branches in your GitHub repository (e.g., `develop`, `staging`, `main`).
2.  Creating separate Render services for each environment, each pointing to a different branch.
3.  Using different environment variables for each service (e.g., different MongoDB databases, different API keys).

This allows you to test changes in a staging environment before deploying to production.

## Deployment Checklist

Use this checklist to ensure you have completed all the necessary steps for a successful deployment.

### Pre-Deployment

- [ ] GitHub repository is set up and code is pushed
- [ ] `Backend/package.json` and `Frontend/package.json` files exist and are correct
- [ ] MongoDB Atlas cluster is created and connection string is obtained
- [ ] MapTiler API keys are obtained (3 keys: admin, driver, customer)
- [ ] Brevo SMTP credentials are obtained
- [ ] Helcim API key is obtained
- [ ] `.env.example` file is reviewed and all required variables are understood

### Backend Deployment

- [ ] Backend web service is created on Render
- [ ] Root directory is set to `Backend`
- [ ] Build command is `pnpm install`
- [ ] Start command is `pnpm start`
- [ ] All environment variables are added (`.env` secret file)
- [ ] Backend service is deployed and shows "Live" status
- [ ] Backend URL is copied and saved

### Frontend Deployment

- [ ] Frontend static site is created on Render
- [ ] Root directory is set to `Frontend`
- [ ] Build command is `pnpm install && pnpm build`
- [ ] Publish directory is set to `dist`
- [ ] `VITE_BACKEND_URL` environment variable is set to backend URL
- [ ] Frontend service is deployed and shows "Live" status
- [ ] Frontend URL is copied and saved

### Post-Deployment

- [ ] `CORS_ORIGIN` on backend is updated with frontend URL
- [ ] Backend is redeployed after CORS update
- [ ] Frontend is tested in browser
- [ ] Age gate is working
- [ ] User registration and login are working
- [ ] Product catalog is loading
- [ ] Shopping cart and checkout are functional
- [ ] No CORS errors in browser console
- [ ] Backend logs show no errors

### Optional

- [ ] Custom domain is added to frontend
- [ ] `CORS_ORIGIN` is updated to include custom domain
- [ ] SSL certificate is provisioned and working
- [ ] Monitoring and alerts are configured
- [ ] Database backups are enabled in MongoDB Atlas

## Common Deployment Scenarios

### Scenario 1: Updating Code After Initial Deployment

When you make changes to your code and want to deploy the updates:

1.  Commit and push your changes to GitHub.
2.  Render will automatically detect the changes and trigger a new deployment for both services (if auto-deploy is enabled).
3.  Monitor the deployment progress in the Render dashboard.
4.  Once the deployment is complete, test your changes.

### Scenario 2: Changing Environment Variables

If you need to update an environment variable (e.g., changing from test mode to production mode for Helcim):

1.  Go to the service settings on Render.
2.  Navigate to the **Environment** tab.
3.  Edit the environment variable.
4.  Click **Save Changes**.
5.  Render will automatically redeploy the service with the new variable.

### Scenario 3: Rolling Back a Deployment

If a new deployment introduces a bug:

1.  Go to the service page on Render.
2.  Click on the **Deployments** tab.
3.  Find a previous successful deployment.
4.  Click **Redeploy** on that deployment.
5.  Render will roll back to that version.

### Scenario 4: Debugging a Failed Deployment

If a deployment fails:

1.  Check the **Logs** tab for error messages.
2.  Common issues include:
    - Missing or incorrect environment variables
    - Syntax errors in code
    - Missing dependencies in `package.json`
    - Incorrect build or start commands
3.  Fix the issue in your code or settings.
4.  Push the changes to GitHub or manually trigger a redeploy.

## Cost Considerations

Render offers a generous free tier that is suitable for this project:

- **Web Services (Backend)**: 750 hours per month on the free tier. Your backend will spin down after 15 minutes of inactivity and spin up again when a request is received (this causes a slight delay on the first request after inactivity).
- **Static Sites (Frontend)**: Free with 100 GB bandwidth per month.
- **Bandwidth**: 100 GB per month across all services.

For production use with consistent traffic, you may want to upgrade to a paid plan to avoid the spin-down behavior on the backend. Paid plans start at $7/month for web services.

## Security Best Practices

1.  **Never commit `.env` files**: Ensure your `.gitignore` file includes `.env` to prevent accidentally committing sensitive information.
2.  **Use strong secrets**: Generate strong, random strings for `JWT_SECRET` and other secrets.
3.  **Rotate API keys regularly**: Periodically regenerate your API keys for third-party services.
4.  **Use HTTPS only**: Render automatically provides HTTPS for all services. Never use HTTP in production.
5.  **Limit CORS origins**: Only allow your frontend domain in `CORS_ORIGIN`. Do not use wildcards (`*`) in production.
6.  **Keep dependencies updated**: Regularly update your npm packages to patch security vulnerabilities.

## Additional Resources

| Resource | Link |
| :--- | :--- |
| **Render Documentation** | [https://render.com/docs](https://render.com/docs) |
| **Render Blueprint (render.yaml) Guide** | [https://render.com/docs/blueprint-spec](https://render.com/docs/blueprint-spec) |
| **MongoDB Atlas Documentation** | [https://docs.atlas.mongodb.com/](https://docs.atlas.mongodb.com/) |
| **Vite Build Configuration** | [https://vitejs.dev/guide/build.html](https://vitejs.dev/guide/build.html) |
| **Express.js Production Best Practices** | [https://expressjs.com/en/advanced/best-practice-performance.html](https://expressjs.com/en/advanced/best-practice-performance.html) |

---

**Prepared by**: Manus AI  
**Last Updated**: November 11, 2025
