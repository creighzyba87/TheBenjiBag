# Quick Fix: Missing package.json Files

## Problem

You're seeing the error `'dev' is not recognized as an internal or external command` because the Backend and Frontend folders are missing their `package.json` files, which define the available npm scripts and dependencies.

## Solution

Follow these steps to fix the issue:

### Step 1: Add package.json to Backend Folder

1. Navigate to your Backend folder:
   ```powershell
   cd C:\TheBenjiBag\Backend
   ```

2. Create a new file named `package.json` with the following content:

```json
{
  "name": "thebenjibag-backend",
  "version": "1.0.0",
  "description": "TheBenjiBag Cannabis Delivery Platform - Backend Server",
  "main": "server.js",
  "type": "commonjs",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seed.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "cannabis",
    "delivery",
    "express",
    "mongodb",
    "socket.io"
  ],
  "author": "TheBenjiBag",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "socket.io": "^4.6.1",
    "@trpc/server": "^11.0.0-rc.332",
    "nodemailer": "^6.9.7",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "@types/node": "^20.10.6",
    "typescript": "^5.3.3"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

3. Install the dependencies:
   ```powershell
   pnpm install
   ```

### Step 2: Add package.json to Frontend Folder

1. Navigate to your Frontend folder:
   ```powershell
   cd C:\TheBenjiBag\Frontend
   ```

2. Create a new file named `package.json` with the following content:

```json
{
  "name": "thebenjibag-frontend",
  "version": "1.0.0",
  "description": "TheBenjiBag Cannabis Delivery Platform - Frontend Application",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx,ts,tsx"
  },
  "keywords": [
    "react",
    "vite",
    "tailwind",
    "cannabis",
    "delivery"
  ],
  "author": "TheBenjiBag",
  "license": "MIT",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@trpc/client": "^11.0.0-rc.332",
    "@trpc/react-query": "^11.0.0-rc.332",
    "@tanstack/react-query": "^5.17.9",
    "socket.io-client": "^4.6.1",
    "react-router-dom": "^6.21.1",
    "@maptiler/sdk": "^1.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.11",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.33",
    "autoprefixer": "^10.4.16",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "typescript": "^5.3.3",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.2"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

3. Install the dependencies:
   ```powershell
   pnpm install
   ```

### Step 3: Verify the Fix

1. In the Backend folder, try running:
   ```powershell
   cd C:\TheBenjiBag\Backend
   pnpm dev
   ```
   
   This should now start the backend server with nodemon (auto-restart on file changes).

2. In the Frontend folder, try running:
   ```powershell
   cd C:\TheBenjiBag\Frontend
   pnpm dev
   ```
   
   This should now start the Vite development server.

## Available Scripts

### Backend Scripts

| Command | Description |
|---------|-------------|
| `pnpm start` | Start the server in production mode |
| `pnpm dev` | Start the server in development mode with auto-restart |
| `pnpm seed` | Populate the database with initial data |

### Frontend Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the development server with hot reload |
| `pnpm build` | Build the application for production |
| `pnpm preview` | Preview the production build locally |

## Important Notes

1. **Environment Variables**: Make sure you have a `.env` file in the Backend folder with all required environment variables (MongoDB URI, API keys, etc.).

2. **Port Configuration**: The backend runs on port 3000 by default, and the frontend runs on port 5173. Make sure these ports are not in use by other applications.

3. **Database Connection**: Before running the backend, ensure your MongoDB Atlas connection string is properly configured in the `.env` file.

## Troubleshooting

**If you still see errors after adding package.json:**

1. Delete the `node_modules` folder in both Backend and Frontend directories
2. Delete `pnpm-lock.yaml` if it exists
3. Run `pnpm install` again in both directories

**If nodemon is not found:**

The backend uses `nodemon` for development. If you get an error that nodemon is not found, it should be installed automatically when you run `pnpm install`. If not, install it manually:

```powershell
cd C:\TheBenjiBag\Backend
pnpm add -D nodemon
```

---

**Prepared by**: Manus AI  
**Date**: November 11, 2025
