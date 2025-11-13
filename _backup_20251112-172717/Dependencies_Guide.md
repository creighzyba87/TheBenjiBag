# TheBenjiBag: Detailed Dependency Installation Guide

This document provides a comprehensive, step-by-step guide for certifying, downloading, and installing all the necessary third-party dependencies required to run TheBenjiBag project. It includes direct weblinks for all tools and services.

**Prepared by**: Manus AI  
**Last Updated**: November 10, 2025

## 1. Core Development Tools

These are the fundamental tools required for both frontend and backend development. The PowerShell script provided in Section 3 automates the installation of these tools on Windows.

| Tool | Description | Direct Weblink |
| :--- | :--- | :--- |
| **Node.js (v18+ LTS)** | A JavaScript runtime environment that lets you run JavaScript on the server. It includes **npm** (Node Package Manager) for managing project dependencies. | [https://nodejs.org/en/download/](https://nodejs.org/en/download/) |
| **Git** | A distributed version control system for tracking changes in source code during software development. | [https://git-scm.com/downloads](https://git-scm.com/downloads) |
| **Windows PowerShell 5.1+** | A modern command-line shell and scripting language. It is pre-installed on Windows 10 and 11. | [https://docs.microsoft.com/en-us/powershell/](https://docs.microsoft.com/en-us/powershell/) |
| **Chocolatey** | A package manager for Windows that simplifies the installation of software. The provided PowerShell script will install this for you. | [https://chocolatey.org/install](https://chocolatey.org/install) |

## 2. Backend Dependencies

These dependencies are required for the Node.js server and are managed via `npm`. They will be installed when you run `npm install` in the `Backend` directory.

| Dependency | Description | Direct Weblink |
| :--- | :--- | :--- |
| **Express.js** | A fast, unopinionated, minimalist web framework for Node.js, used to build the server and handle API requests. | [https://expressjs.com/](https://expressjs.com/) |
| **Mongoose** | An Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a schema-based solution to model your application data. | [https://mongoosejs.com/](https://mongoosejs.com/) |
| **CORS** | A Node.js package for providing a Connect/Express middleware that can be used to enable Cross-Origin Resource Sharing with various options. | [https://www.npmjs.com/package/cors](https://www.npmjs.com/package/cors) |
| **Dotenv** | A zero-dependency module that loads environment variables from a `.env` file into `process.env`. | [https://www.npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv) |
| **Socket.IO** | A library that enables real-time, bidirectional and event-based communication between the browser and the server. | [https://socket.io/](https://socket.io/) |
| **tRPC** | A library for building end-to-end typesafe APIs with TypeScript, without the need for code generation. | [https://trpc.io/](https://trpc.io/) |

## 3. Frontend Dependencies

These dependencies are required for the React user interface and are managed via `npm`. They will be installed when you run `npm install` in the `Frontend` directory.

| Dependency | Description | Direct Weblink |
| :--- | :--- | :--- |
| **React** | A JavaScript library for building user interfaces. It is the core of the frontend application. | [https://react.dev/](https://react.dev/) |
| **Vite** | A build tool that aims to provide a faster and leaner development experience for modern web projects. It is used to bundle the React application. | [https://vitejs.dev/](https://vitejs.dev/) |
| **Tailwind CSS** | A utility-first CSS framework for rapidly building custom user interfaces. | [https://tailwindcss.com/](https://tailwindcss.com/) |
| **@vitejs/plugin-react** | A Vite plugin that enables React support in Vite projects. | [https://www.npmjs.com/package/@vitejs/plugin-react](https://www.npmjs.com/package/@vitejs/plugin-react) |

## 4. Step-by-Step Manual Installation (Windows)

This section provides detailed instructions for manually installing each dependency on Windows. If you prefer automation, skip to Section 5 for the PowerShell script.

### 4.1. Install Chocolatey Package Manager

Chocolatey is a package manager for Windows that simplifies software installation. It is similar to `apt` on Linux or `brew` on macOS.

**Step 1**: Open PowerShell as Administrator. To do this, search for "PowerShell" in the Windows Start menu, right-click on "Windows PowerShell", and select "Run as administrator".

**Step 2**: Run the following command to install Chocolatey:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

**Step 3**: Wait for the installation to complete. You should see a success message.

**Step 4**: Verify the installation by running:

```powershell
choco --version
```

You should see the version number of Chocolatey displayed.

**Direct Link**: [https://chocolatey.org/install](https://chocolatey.org/install)

### 4.2. Install Node.js LTS

Node.js is the JavaScript runtime that powers both the backend server and the build tools for the frontend.

**Step 1**: With Chocolatey installed, run the following command in PowerShell (as Administrator):

```powershell
choco install nodejs-lts -y
```

The `-y` flag automatically confirms all prompts during installation.

**Step 2**: After installation, close and reopen PowerShell to refresh the environment variables.

**Step 3**: Verify the installation by running:

```powershell
node --version
npm --version
```

You should see version numbers for both Node.js and npm (Node Package Manager).

**Alternative Manual Download**: If you prefer not to use Chocolatey, you can download the installer directly from [https://nodejs.org/en/download/](https://nodejs.org/en/download/). Choose the "LTS" (Long Term Support) version for Windows.

### 4.3. Install Git

Git is a version control system that allows you to track changes in your code and collaborate with others.

**Step 1**: With Chocolatey installed, run the following command in PowerShell (as Administrator):

```powershell
choco install git -y
```

**Step 2**: After installation, close and reopen PowerShell to refresh the environment variables.

**Step 3**: Verify the installation by running:

```powershell
git --version
```

You should see the version number of Git displayed.

**Alternative Manual Download**: If you prefer not to use Chocolatey, you can download the installer directly from [https://git-scm.com/downloads](https://git-scm.com/downloads). Choose the Windows version and follow the installation wizard.

### 4.4. Install pnpm (Optional but Recommended)

pnpm is an alternative package manager to npm that is faster and more efficient. While it is optional, it is recommended for larger projects.

**Step 1**: With Node.js and npm installed, run the following command in PowerShell:

```powershell
npm install -g pnpm
```

The `-g` flag installs pnpm globally, making it available from any directory.

**Step 2**: Verify the installation by running:

```powershell
pnpm --version
```

You should see the version number of pnpm displayed.

**Direct Link**: [https://pnpm.io/installation](https://pnpm.io/installation)

### 4.5. Install Backend Dependencies

Once Node.js and npm are installed, you can install the specific dependencies required by the backend.

**Step 1**: Open PowerShell and navigate to the `Backend` directory of the TheBenjiBag project:

```powershell
cd path\to\TheBenjiBag\Backend
```

Replace `path\to\TheBenjiBag` with the actual path to your project.

**Step 2**: Run the following command to install all backend dependencies listed in the `package.json` file:

```powershell
npm install
```

This command will download and install all the required packages, including Express, Mongoose, Socket.IO, and others.

**Step 3**: Wait for the installation to complete. You should see a message indicating that the packages were installed successfully.

**Step 4**: Verify the installation by checking the `node_modules` folder in the `Backend` directory. This folder should now contain all the installed packages.

### 4.6. Install Frontend Dependencies

Similarly, you need to install the dependencies required by the frontend.

**Step 1**: Open PowerShell and navigate to the `Frontend` directory of the TheBenjiBag project:

```powershell
cd path\to\TheBenjiBag\Frontend
```

**Step 2**: Run the following command to install all frontend dependencies listed in the `package.json` file:

```powershell
npm install
```

This command will download and install all the required packages, including React, Vite, Tailwind CSS, and others.

**Step 3**: Wait for the installation to complete. You should see a message indicating that the packages were installed successfully.

**Step 4**: Verify the installation by checking the `node_modules` folder in the `Frontend` directory. This folder should now contain all the installed packages.

## 5. Automated Installation Using PowerShell Script

For your convenience, a comprehensive PowerShell script has been provided that automates the entire installation process. This script will install all the core development tools and project dependencies in one go.

### 5.1. Script Location

The script is located at:

```
TheBenjiBag/scripts/install_all_dependencies.ps1
```

### 5.2. Prerequisites

Before running the script, ensure that:

**Requirement 1**: You are using Windows 10 or Windows 11.

**Requirement 2**: PowerShell 5.1 or higher is installed. PowerShell is pre-installed on Windows 10 and 11. You can check your version by running:

```powershell
$PSVersionTable.PSVersion
```

**Requirement 3**: You have administrator privileges on your computer. The script will check for this and warn you if you are not running as administrator.

### 5.3. Running the Script

**Step 1**: Open PowerShell as Administrator. Search for "PowerShell" in the Windows Start menu, right-click on "Windows PowerShell", and select "Run as administrator".

**Step 2**: Navigate to the TheBenjiBag project root directory:

```powershell
cd path\to\TheBenjiBag
```

Replace `path\to\TheBenjiBag` with the actual path to your project.

**Step 3**: Run the installation script:

```powershell
.\scripts\install_all_dependencies.ps1
```

If you encounter an error about execution policies, you may need to temporarily allow script execution:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
.\scripts\install_all_dependencies.ps1
```

**Step 4**: The script will now perform the following actions automatically:

1. Check your PowerShell version
2. Verify administrator privileges
3. Install Chocolatey package manager (if not already installed)
4. Install Node.js LTS (if not already installed)
5. Install Git (if not already installed)
6. Install pnpm globally (if not already installed)
7. Verify the project structure
8. Install all Backend dependencies by running `npm install` in the Backend folder
9. Install all Frontend dependencies by running `npm install` in the Frontend folder
10. Display a summary of installed tools and next steps

**Step 5**: Review the output. The script will display success messages in green and any errors in red. If all steps complete successfully, you will see a summary of installed tools and version numbers.

### 5.4. What the Script Does

The PowerShell script performs comprehensive checks and installations. Here is a breakdown of each step:

**Check 1: PowerShell Version** - The script verifies that you are running PowerShell 5.1 or higher. If not, it will display an error and exit.

**Check 2: Administrator Privileges** - The script checks if it is running with administrator privileges. While not strictly required, running as administrator ensures that all installations complete successfully. If you are not running as administrator, the script will warn you and ask if you want to continue.

**Installation 1: Chocolatey** - If Chocolatey is not already installed, the script will download and install it. Chocolatey is a package manager for Windows that simplifies the installation of software.

**Installation 2: Node.js LTS** - The script uses Chocolatey to install the latest LTS (Long Term Support) version of Node.js. This includes npm (Node Package Manager) by default.

**Installation 3: Git** - The script uses Chocolatey to install Git, a version control system required for managing your codebase.

**Installation 4: pnpm** - The script installs pnpm globally using npm. pnpm is an alternative package manager that is faster and more efficient than npm.

**Verification: Project Structure** - The script checks that the `Backend` and `Frontend` folders exist in the project root. If they do not exist, the script will display an error and exit.

**Installation 5: Backend Dependencies** - The script navigates to the `Backend` folder and runs `npm install` to install all dependencies listed in the `package.json` file. If the `package.json` file does not exist, the script will create a basic one with common dependencies.

**Installation 6: Frontend Dependencies** - The script navigates to the `Frontend` folder and runs `npm install` to install all dependencies listed in the `package.json` file. If the `package.json` file does not exist, the script will create a basic one with common dependencies.

**Summary** - After all installations are complete, the script displays a summary showing the versions of all installed tools and provides guidance on the next steps.

### 5.5. Troubleshooting the Script

If you encounter any issues while running the script, here are some common problems and solutions:

**Problem 1: Execution Policy Error** - If you see an error message about execution policies, it means that PowerShell is configured to prevent script execution for security reasons. To resolve this, run the following command before executing the script:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
```

This command temporarily allows script execution for the current PowerShell session only.

**Problem 2: Chocolatey Installation Fails** - If Chocolatey fails to install, it may be due to network issues or security software blocking the download. Try the following:

- Ensure you have an active internet connection.
- Temporarily disable any antivirus or firewall software.
- Manually install Chocolatey by following the instructions at [https://chocolatey.org/install](https://chocolatey.org/install).

**Problem 3: Node.js or Git Installation Fails** - If Node.js or Git fails to install via Chocolatey, you can manually download and install them from their official websites:

- Node.js: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
- Git: [https://git-scm.com/downloads](https://git-scm.com/downloads)

After manual installation, re-run the script. It will detect that these tools are already installed and skip their installation steps.

**Problem 4: npm install Fails** - If the `npm install` command fails in either the Backend or Frontend folder, it may be due to:

- Missing `package.json` file: The script will attempt to create a basic one, but you may need to manually add additional dependencies.
- Network issues: Ensure you have a stable internet connection.
- Corrupted npm cache: Try clearing the npm cache by running `npm cache clean --force` and then re-running the script.

**Problem 5: Permission Denied Errors** - If you encounter permission denied errors, ensure that:

- You are running PowerShell as Administrator.
- You have write permissions to the project directory.
- No other applications are using files in the project directory.

## 6. Verifying Your Installation

After installing all dependencies, it is important to verify that everything is set up correctly. This section provides commands to test each component.

### 6.1. Verify Core Tools

Open PowerShell and run the following commands to verify that the core development tools are installed correctly:

**Check Node.js**:
```powershell
node --version
```
Expected output: `v18.x.x` or higher (e.g., `v18.19.0`)

**Check npm**:
```powershell
npm --version
```
Expected output: `9.x.x` or higher (e.g., `9.8.1`)

**Check Git**:
```powershell
git --version
```
Expected output: `git version 2.x.x` or higher (e.g., `git version 2.43.0`)

**Check pnpm** (if installed):
```powershell
pnpm --version
```
Expected output: `8.x.x` or higher (e.g., `8.15.0`)

### 6.2. Verify Backend Dependencies

Navigate to the Backend directory and verify that the dependencies are installed:

```powershell
cd path\to\TheBenjiBag\Backend
npm list --depth=0
```

This command will display a list of all installed packages at the top level. You should see packages like:

- `express`
- `mongoose`
- `cors`
- `dotenv`
- `socket.io`
- `@trpc/server`

If you see any errors or missing packages, run `npm install` again in the Backend directory.

### 6.3. Verify Frontend Dependencies

Navigate to the Frontend directory and verify that the dependencies are installed:

```powershell
cd path\to\TheBenjiBag\Frontend
npm list --depth=0
```

This command will display a list of all installed packages at the top level. You should see packages like:

- `react`
- `react-dom`
- `vite`
- `@vitejs/plugin-react`
- `tailwindcss`

If you see any errors or missing packages, run `npm install` again in the Frontend directory.

### 6.4. Test Backend Server

To verify that the backend server can start correctly, follow these steps:

**Step 1**: Ensure you have configured the `.env` file in the Backend directory with your MongoDB connection string and other required environment variables.

**Step 2**: Navigate to the Backend directory:

```powershell
cd path\to\TheBenjiBag\Backend
```

**Step 3**: Start the server:

```powershell
npm start
```

**Expected Output**: You should see a message indicating that the server is running, such as:

```
Server running on port 3000
MongoDB connected successfully
```

If you see any errors, review the error messages and ensure that:

- Your `.env` file is configured correctly
- Your MongoDB connection string is valid
- All required environment variables are set

**Step 4**: Press `Ctrl+C` to stop the server.

### 6.5. Test Frontend Development Server

To verify that the frontend development server can start correctly, follow these steps:

**Step 1**: Navigate to the Frontend directory:

```powershell
cd path\to\TheBenjiBag\Frontend
```

**Step 2**: Start the development server:

```powershell
npm run dev
```

**Expected Output**: You should see a message indicating that the development server is running, such as:

```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Step 3**: Open your web browser and navigate to `http://localhost:5173/`. You should see the TheBenjiBag application homepage.

**Step 4**: Press `Ctrl+C` in the PowerShell window to stop the development server.

## 7. Common Installation Issues and Solutions

This section addresses common issues you may encounter during the installation process and provides solutions.

### Issue 1: "npm is not recognized as an internal or external command"

**Cause**: This error occurs when Node.js is not installed correctly or the environment variables are not set up properly.

**Solution**:

1. Verify that Node.js is installed by running `node --version` in PowerShell.
2. If Node.js is installed but npm is not recognized, close and reopen PowerShell to refresh the environment variables.
3. If the issue persists, manually add the Node.js installation path to your system's PATH environment variable. The default path is usually `C:\Program Files\nodejs\`.

### Issue 2: "Cannot find module 'express'" or similar errors

**Cause**: This error occurs when the required npm packages are not installed in the project directory.

**Solution**:

1. Navigate to the Backend or Frontend directory (depending on where the error occurred).
2. Run `npm install` to install all dependencies.
3. If the issue persists, delete the `node_modules` folder and the `package-lock.json` file, then run `npm install` again.

### Issue 3: "EACCES: permission denied" errors during npm install

**Cause**: This error occurs when npm does not have the necessary permissions to write to the project directory or the global npm directory.

**Solution**:

1. Ensure you are running PowerShell as Administrator.
2. If you are installing global packages (with the `-g` flag), you may need to configure npm to use a different directory. See the npm documentation for instructions: [https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)

### Issue 4: "Error: Cannot find module 'dotenv'"

**Cause**: This error occurs when the `dotenv` package is not installed in the Backend directory.

**Solution**:

1. Navigate to the Backend directory: `cd path\to\TheBenjiBag\Backend`
2. Install the dotenv package: `npm install dotenv`

### Issue 5: MongoDB connection errors

**Cause**: This error occurs when the MongoDB connection string in the `.env` file is incorrect or when the MongoDB server is not accessible.

**Solution**:

1. Verify that your MongoDB connection string is correct. It should look like: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
2. Ensure that your IP address is whitelisted in MongoDB Atlas under Network Access.
3. Verify that your MongoDB user has the correct permissions.
4. Test your connection string using MongoDB Compass or the MongoDB shell.

### Issue 6: Port already in use errors

**Cause**: This error occurs when another application is already using the port that the backend or frontend server is trying to use.

**Solution**:

1. Identify the process using the port. For example, if port 3000 is in use, run: `netstat -ano | findstr :3000`
2. Stop the process using the port, or configure your application to use a different port by modifying the `PORT` environment variable in the `.env` file (for backend) or the `server.port` setting in `vite.config.js` (for frontend).

## 8. Next Steps After Installation

Once all dependencies are installed and verified, you can proceed with the following steps:

**Step 1: Configure Environment Variables** - Set up your `.env` file in the Backend directory with all required credentials (MongoDB URI, API keys, etc.). Refer to the `Setup_Guide.md` for detailed instructions.

**Step 2: Initialize the Database** - Run the seed script to populate your MongoDB database with initial data:

```powershell
cd Backend
node seed.js
```

**Step 3: Start Development Servers** - Open two PowerShell windows. In the first window, start the backend server:

```powershell
cd Backend
npm start
```

In the second window, start the frontend development server:

```powershell
cd Frontend
npm run dev
```

**Step 4: Access the Application** - Open your web browser and navigate to `http://localhost:5173/` to access the TheBenjiBag application.

**Step 5: Review Documentation** - Familiarize yourself with the project structure and features by reviewing the documentation in the `docs` folder, particularly `README.md` and `DEPLOYMENT.md`.

## 9. Additional Resources

For more information on the tools and technologies used in this project, refer to the following resources:

| Resource | Description | Link |
| :--- | :--- | :--- |
| **Node.js Documentation** | Official documentation for Node.js | [https://nodejs.org/docs/](https://nodejs.org/docs/) |
| **npm Documentation** | Official documentation for npm | [https://docs.npmjs.com/](https://docs.npmjs.com/) |
| **Express.js Guide** | Official guide for Express.js | [https://expressjs.com/en/guide/routing.html](https://expressjs.com/en/guide/routing.html) |
| **React Documentation** | Official documentation for React | [https://react.dev/learn](https://react.dev/learn) |
| **Vite Documentation** | Official documentation for Vite | [https://vitejs.dev/guide/](https://vitejs.dev/guide/) |
| **MongoDB Documentation** | Official documentation for MongoDB | [https://docs.mongodb.com/](https://docs.mongodb.com/) |
| **Mongoose Documentation** | Official documentation for Mongoose | [https://mongoosejs.com/docs/](https://mongoosejs.com/docs/) |
| **Socket.IO Documentation** | Official documentation for Socket.IO | [https://socket.io/docs/v4/](https://socket.io/docs/v4/) |
| **Tailwind CSS Documentation** | Official documentation for Tailwind CSS | [https://tailwindcss.com/docs](https://tailwindcss.com/docs) |
| **Git Documentation** | Official documentation for Git | [https://git-scm.com/doc](https://git-scm.com/doc) |
| **Chocolatey Documentation** | Official documentation for Chocolatey | [https://docs.chocolatey.org/](https://docs.chocolatey.org/) |

---

**Prepared by**: Manus AI  
**Last Updated**: November 10, 2025
