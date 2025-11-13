# TheBenjiBag: Comprehensive Setup Guide

This document provides a detailed, step-by-step guide for setting up, deploying, and maintaining TheBenjiBag cannabis delivery platform. It covers everything from installing dependencies to deploying the application on Render.com.

## 1. Prerequisites

Before you begin, ensure you have the following software and accounts set up. This section provides direct links for each requirement.

| Prerequisite | Link | Description |
| :--- | :--- | :--- |
| **Node.js (v18+ recommended)** | [https://nodejs.org/](https://nodejs.org/) | JavaScript runtime for both frontend and backend. |
| **npm or pnpm** | [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm) | Package manager for Node.js. npm is included with Node.js. |
| **Git** | [https://git-scm.com/](https://git-scm.com/) | Version control system for managing your codebase. |
| **GitHub Account** | [https://github.com/](https://github.com/) | Required for version control and CI/CD with Render. |
| **Render.com Account** | [https://render.com/](https://render.com/) | The cloud platform for deploying the application. |
| **MongoDB Atlas Account** | [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) | The cloud database service for the application. |
| **MapTiler Account** | [https://www.maptiler.com/](https://www.maptiler.com/) | Provides the mapping services for driver and customer tracking. |
| **Brevo (formerly Sendinblue) Account** | [https://www.brevo.com/](https://www.brevo.com/) | Used for sending transactional emails. |
| **Helcim Account** | [https://www.helcim.com/](https://www.helcim.com/) | The payment processing platform. |

### PowerShell Script for Automated Dependency Installation (Windows)

For Windows users, a PowerShell script is provided to automate the installation of Node.js, Git, and pnpm using the Chocolatey package manager.

1.  **Open PowerShell as Administrator**.
2.  **Navigate to the `scripts` directory** within the project.
3.  **Run the script** by executing the following command:

    ```powershell
    .\install_dependencies.ps1
    ```

This script will first install Chocolatey if it's not already present, and then use it to install all the necessary software.

## 2. Local Development Setup

Follow these steps to get the application running on your local machine.

### 2.1. Clone the Repository

First, clone the project repository from GitHub to your local machine.

```bash
git clone https://github.com/your-username/thebenjibag.git
cd thebenjibag
```

### 2.2. Install Dependencies

Navigate to the project's root directory and install the necessary npm packages for both the backend and frontend.

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2.3. Set Up Environment Variables

A `.env` file is required to store sensitive information and configuration details. A template is provided in the `config` directory.

1.  **Navigate to the `config` directory**.
2.  **Copy the `.env` file** to the `backend` directory.

    ```bash
    cp config/.env backend/.env
    ```

3.  **Edit the `backend/.env` file** with your credentials for the following services:

    *   `MONGODB_URI`: Your MongoDB Atlas connection string.
    *   `JWT_SECRET`: A long, random string for signing authentication tokens.
    *   `MAPTILER_ADMIN`, `MAPTILER_DRIVER`, `MAPTILER_CUSTOMER`: Your three MapTiler API keys.
    *   `BREVO_SMTP_USER`, `BREVO_SMTP_KEY`: Your Brevo SMTP credentials.
    *   `HELCIM_API_KEY`: Your Helcim test API key.

### 2.4. Initialize the Database

The project includes a seed script to populate the database with initial data.

```bash
# Run the seed script
cd backend
node seed.js
cd ..
```

### 2.5. Start the Development Servers

You will need two separate terminal windows to run the backend and frontend servers concurrently.

**Terminal 1: Start the Backend Server**

```bash
cd backend
npm start
```

**Terminal 2: Start the Frontend Server**

```bash
cd frontend
npm run dev
```

Once both servers are running, you can access the application at `http://localhost:5173`.

## 3. GitHub and Version Control

Properly setting up your project on GitHub is crucial for collaboration, version control, and automated deployments.

### 3.1. Create a New GitHub Repository

1.  Go to [GitHub](https://github.com/) and create a new repository. You can name it `thebenjibag` or any other name you prefer.
2.  **Do not** initialize the new repository with a `README`, `.gitignore`, or license file, as these are already included in the project.

### 3.2. Link the Local Project to the GitHub Repository

In your local project directory, run the following commands to link your local repository to the remote one on GitHub and push the initial code.

```bash
# Initialize a new Git repository in the project's root directory
git init

# Add all files to the staging area
git add .

# Create the initial commit
git commit -m "Initial commit: Organized project structure"

# Add the remote repository URL
git remote add origin https://github.com/your-username/thebenjibag.git

# Push the code to the main branch on GitHub
git push -u origin main
```

### 3.3. Branching Strategy

It is recommended to use a branching strategy for development. For example, you can create a `develop` branch for new features and bug fixes, and only merge into the `main` branch when you are ready to deploy.

```bash
# Create and switch to a new develop branch
git checkout -b develop

# Push the develop branch to GitHub
git push -u origin develop
```

## 4. Deployment to Render.com

Render.com is a cloud platform that makes it easy to deploy web applications. This project is pre-configured for deployment on Render.

### 4.1. Create a New Web Service on Render

1.  Log in to your [Render Dashboard](https://dashboard.render.com).
2.  Click the **New +** button and select **Web Service**.
3.  Connect your GitHub account and select the repository you created in the previous step.

### 4.2. Configure the Web Service

Render will automatically detect that you have a `render.yaml` file in your repository and will pre-fill most of the settings. Here are the key settings to review:

*   **Name**: Give your service a unique name (e.g., `thebenjibag`).
*   **Region**: Choose a region that is geographically close to your users.
*   **Branch**: Select the `main` branch for production deployments.
*   **Build Command**: This should be automatically set to `npm run build` from the `render.yaml` file.
*   **Start Command**: This should be automatically set to `npm start` from the `render.yaml` file.

### 4.3. Add Environment Variables

Render needs access to the same environment variables you used for local development. You must add these as **secrets** in the Render dashboard.

1.  In your new web service, go to the **Environment** tab.
2.  Under **Secret Files**, for the `.env` file content, copy and paste the content of your local `.env` file.

### 4.4. Deploy the Application

Once you have configured the web service and added the environment variables, you can deploy the application.

1.  Click the **Create Web Service** button.
2.  Render will automatically start the build and deployment process. You can monitor the progress in the **Events** tab.

Once the deployment is complete, your application will be live at the URL provided by Render.

### 4.5. Automated Deployments (CI/CD)

The project is set up with a GitHub Actions workflow for continuous integration and continuous deployment (CI/CD). This means that every time you push a new commit to the `main` branch, the application will be automatically tested and deployed to Render.

To enable this, you need to add your Render API key and service ID as secrets in your GitHub repository:

1.  In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions**.
2.  Create two new secrets:
    *   `RENDER_API_KEY`: Your Render API key, which you can find in your Render account settings.
    *   `RENDER_SERVICE_ID`: The ID of the web service you created on Render. You can find this in the URL of your service's dashboard page.

## 5. Third-Party Service Configuration

This section provides detailed, step-by-step instructions for setting up each of the third-party services required by TheBenjiBag.

### 5.1. MongoDB Atlas Setup

MongoDB Atlas is a cloud-based database service that hosts your application's data.

1.  **Create an Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2.  **Create a New Cluster**: After logging in, click **Build a Database** and select the **Free Shared** tier.
3.  **Configure the Cluster**: Choose a cloud provider and region. The default settings are usually sufficient.
4.  **Create a Database User**:
    *   In the **Security** section, click **Database Access**.
    *   Click **Add New Database User**.
    *   Create a username and password. Make sure to save these credentials securely.
    *   Under **Database User Privileges**, select **Read and write to any database**.
5.  **Whitelist Your IP Address**:
    *   In the **Security** section, click **Network Access**.
    *   Click **Add IP Address**.
    *   For development, you can click **Allow Access from Anywhere** (0.0.0.0/0). For production, you should whitelist only the IP addresses of your servers.
6.  **Get the Connection String**:
    *   In the **Deployment** section, click **Database**.
    *   Click **Connect** on your cluster.
    *   Select **Connect your application**.
    *   Copy the connection string. It will look like this: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
    *   Replace `<username>` and `<password>` with the credentials you created in step 4.
    *   Add the database name after the `/` and before the `?`. For example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/thebenjibag?retryWrites=true&w=majority`
    *   This is your `MONGODB_URI` environment variable.

### 5.2. MapTiler API Keys

MapTiler provides the mapping services for the application. You need three separate API keys for different user roles.

1.  **Create an Account**: Go to [MapTiler](https://www.maptiler.com/) and sign up for a free account.
2.  **Create API Keys**:
    *   After logging in, go to **Account** > **API Keys**.
    *   Click **Create a new key** three times to create three separate keys.
    *   Name them appropriately (e.g., `Admin Key`, `Driver Key`, `Customer Key`).
3.  **Copy the Keys**: Copy each key and store them securely. These will be your `MAPTILER_ADMIN`, `MAPTILER_DRIVER`, and `MAPTILER_CUSTOMER` environment variables.

### 5.3. Brevo (Sendinblue) SMTP Credentials

Brevo is used for sending transactional emails, such as order confirmations and delivery notifications.

1.  **Create an Account**: Go to [Brevo](https://www.brevo.com/) and sign up for a free account.
2.  **Get SMTP Credentials**:
    *   After logging in, go to **SMTP & API** > **SMTP**.
    *   You will see your SMTP server details:
        *   **SMTP Server**: `smtp-relay.brevo.com`
        *   **Port**: `587`
        *   **Login**: Your email address or a generated SMTP username.
        *   **SMTP Key**: Click **Create a new SMTP key** to generate a new key.
3.  **Copy the Credentials**: Copy the login and SMTP key. These will be your `BREVO_SMTP_USER` and `BREVO_SMTP_KEY` environment variables.
4.  **Set the From Email**: The `BREVO_SMTP_FROM` environment variable should be set to an email address that you have verified in Brevo. You can verify an email address in the **Senders & IP** section.

### 5.4. Helcim Payment API

Helcim is the payment processing platform used for handling customer payments.

1.  **Create an Account**: Go to [Helcim](https://www.helcim.com/) and sign up for an account.
2.  **Enable Test Mode**: In your Helcim dashboard, ensure that you are in **Test Mode** for development.
3.  **Get the API Key**:
    *   Go to **Settings** > **API Keys**.
    *   Click **Create a new API key**.
    *   Copy the API key. This will be your `HELCIM_API_KEY` environment variable.
4.  **Set Test Mode**: In your `.env` file, ensure that `HELCIM_TEST_MODE` is set to `true`.

### 5.5. Render.com API Key and Service ID

These are required for automated deployments using the deployment scripts or GitHub Actions.

1.  **Get the API Key**:
    *   Log in to your [Render Dashboard](https://dashboard.render.com).
    *   Go to **Account Settings** > **API Keys**.
    *   Click **Create API Key**.
    *   Copy the API key. This will be your `RENDER_API_KEY` environment variable.
2.  **Get the Service ID**:
    *   After creating a web service on Render (see section 4.2), go to the service's dashboard.
    *   The service ID is visible in the URL. For example, if the URL is `https://dashboard.render.com/web/srv-abc123`, then `srv-abc123` is your service ID.
    *   This will be your `RENDER_SERVICE_ID` environment variable.

## 6. Testing Your Setup

After completing the setup, it is important to verify that everything is working correctly.

### 6.1. Test the Age Gate

When you first visit the application at `http://localhost:5173`, you should see an age gate asking you to confirm that you are 21 years or older. This is a compliance feature required for cannabis delivery services. Click the confirmation button to proceed.

### 6.2. Test User Registration and Login

The application includes role-based access control with three user types: Admin, Driver, and Customer. You can test the registration and login functionality by creating a new user account. The seed script (run in section 2.4) should have already created some test users for you.

### 6.3. Test the Product Catalog

Navigate to the product catalog page and verify that the products are displayed correctly. The seed script should have populated the database with six cannabis products.

### 6.4. Test the Shopping Cart and Checkout

Add some products to your shopping cart and proceed to checkout. Verify that the order total is calculated correctly and that the payment processing flow works as expected. Since you are using Helcim in test mode, you can use test credit card numbers provided by Helcim.

### 6.5. Test Real-Time Features

The application uses Socket.IO for real-time updates. To test this, you can open two browser windows: one for the admin dashboard and one for the customer view. When a driver updates their location or an order status changes, the updates should appear in real-time in both windows.

## 7. Troubleshooting Common Issues

This section addresses some of the most common issues you may encounter during setup and deployment.

### 7.1. Age Gate Not Showing

If the age gate does not appear when you first visit the application, it may be because the age verification flag is already set in your browser's local storage. To reset this, open the browser's developer console and run the following command:

```javascript
localStorage.clear()
```

Then refresh the page, and the age gate should appear.

### 7.2. Database Connection Errors

If you encounter errors related to the database connection, verify the following:

*   The `MONGODB_URI` in your `.env` file is correct and includes the database name.
*   Your IP address is whitelisted in MongoDB Atlas under **Network Access**.
*   The database user has the correct permissions (read and write access).

### 7.3. Map Not Loading

If the map does not load in the admin dashboard or driver view, check the following:

*   The MapTiler API keys are valid and have not expired.
*   The CORS configuration in your backend allows requests from your frontend's origin.
*   The API keys have the appropriate permissions in your MapTiler account.

### 7.4. Payment Processing Failures

If payment processing is not working, ensure that:

*   The `HELCIM_API_KEY` is correct and valid.
*   Helcim is in test mode (`HELCIM_TEST_MODE=true` in your `.env` file).
*   You are using valid test credit card numbers provided by Helcim.

### 7.5. Deployment Failures on Render

If the deployment to Render fails, review the build and deployment logs in the Render dashboard. Common issues include:

*   Missing environment variables in the Render dashboard.
*   Incorrect build or start commands.
*   Node.js version incompatibility. Ensure that the Node.js version specified in your `package.json` matches the version installed on Render.

## 8. Next Steps

Once you have successfully set up and tested the application, you can proceed with the following:

*   **Customize the Application**: Modify the frontend components, backend routes, and database schemas to fit your specific business requirements.
*   **Add New Features**: Refer to the roadmap in the `docs/README.md` file for ideas on new features to implement.
*   **Deploy to Production**: When you are ready to go live, switch from test mode to production mode for all third-party services, update the environment variables, and deploy to Render.
*   **Set Up Monitoring**: Implement monitoring and logging to track application performance and errors in production.

## 9. Additional Resources

For more detailed information, refer to the following resources:

*   **Project README**: The `docs/README.md` file contains a comprehensive overview of the project, including features, tech stack, and API endpoints.
*   **Deployment Guide**: The `docs/DEPLOYMENT.md` file provides additional details on deploying the application to Render.com.
*   **Quick Reference**: The `Quick_Reference.md` file contains a condensed reference for common commands and tasks.
*   **Render Documentation**: [https://render.com/docs](https://render.com/docs)
*   **MongoDB Atlas Documentation**: [https://docs.atlas.mongodb.com/](https://docs.atlas.mongodb.com/)
*   **Express.js Documentation**: [https://expressjs.com/](https://expressjs.com/)
*   **React Documentation**: [https://react.dev/](https://react.dev/)

---

**Prepared by**: Manus AI  
**Last Updated**: November 10, 2025
