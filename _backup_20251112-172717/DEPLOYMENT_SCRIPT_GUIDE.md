# Complete Setup and Deployment Script Guide

## Overview

The `complete_setup_and_deploy.ps1` script is an all-in-one solution that automates the entire setup and deployment process for TheBenjiBag project. It handles dependency installation, project setup, and pushing to your GitHub repository in a single execution.

## What the Script Does

The script performs **10 automated steps**:

1. **Verifies Administrator Privileges** - Ensures the script is running with the necessary permissions
2. **Verifies Project Directory** - Confirms that `C:\TheBenjiBag` exists
3. **Installs Chocolatey** - Installs the Windows package manager (if not already installed)
4. **Installs Node.js LTS** - Installs the JavaScript runtime and npm
5. **Installs Git** - Installs the version control system
6. **Installs pnpm** - Installs the fast package manager
7. **Installs Backend Dependencies** - Runs `pnpm install` in the Backend folder
8. **Installs Frontend Dependencies** - Runs `pnpm install` in the Frontend folder
9. **Initializes Git Repository** - Sets up Git, creates .gitignore, and configures remote
10. **Commits and Pushes to GitHub** - Stages all files, commits, and pushes to your repository

## Prerequisites

Before running the script, ensure you have:

- **Windows 10 or Windows 11**
- **Administrator access** to your computer
- **GitHub account** with repository access
- **Project files** located at `C:\TheBenjiBag`
- **Internet connection** for downloading dependencies

## How to Use

### Step 1: Open PowerShell as Administrator

1. Press `Windows Key` and type "PowerShell"
2. Right-click on "Windows PowerShell"
3. Select "Run as administrator"
4. Click "Yes" on the User Account Control prompt

### Step 2: Navigate to the Scripts Folder

```powershell
cd C:\TheBenjiBag\scripts
```

### Step 3: Run the Script

```powershell
.\complete_setup_and_deploy.ps1
```

If you encounter an execution policy error, run this first:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
.\complete_setup_and_deploy.ps1
```

### Step 4: Follow the Prompts

The script will:

- Display progress for each step with color-coded output (Green = Success, Red = Error, Yellow = Warning)
- Ask for your Git username and email if not already configured
- Prompt for GitHub credentials when pushing to the repository

### Step 5: Verify Completion

After the script completes, you will see a summary showing:

- All installed tools and their versions
- Project status
- GitHub repository URL
- Next steps for running the application

## GitHub Authentication

When the script pushes to GitHub, you will be prompted for authentication. You have two options:

### Option 1: HTTPS with Personal Access Token (Recommended)

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "TheBenjiBag Deployment")
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. Copy the token (you won't see it again!)
7. When prompted for password, paste the token instead

### Option 2: SSH Key

If you prefer SSH authentication, you'll need to:

1. Generate an SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Add the key to your GitHub account
3. Update the script to use SSH URL instead of HTTPS

## Script Configuration

The script uses these default values:

```powershell
$PROJECT_PATH = "C:\TheBenjiBag"
$GITHUB_USERNAME = "Creighzyba87"
$GITHUB_REPO = "TheBenjiBag"
$GITHUB_REPO_URL = "https://github.com/$GITHUB_USERNAME/$GITHUB_REPO.git"
```

If you need to change any of these values, edit the script at the top where these variables are defined.

## What Gets Pushed to GitHub

The script automatically creates a `.gitignore` file that excludes:

- `node_modules/` folders (Backend and Frontend)
- `.env` files (contains sensitive credentials)
- Build outputs (`dist/`, `build/`)
- Log files
- OS-specific files (`.DS_Store`, `Thumbs.db`)
- IDE configuration files

Everything else in your `C:\TheBenjiBag` folder will be committed and pushed to GitHub.

## Troubleshooting

### Error: "This script must be run as Administrator"

**Solution**: Close PowerShell and reopen it as Administrator (right-click > Run as administrator).

### Error: "Project directory not found at: C:\TheBenjiBag"

**Solution**: Ensure your project is located at `C:\TheBenjiBag`. If it's in a different location, either move it or edit the `$PROJECT_PATH` variable in the script.

### Error: "package.json not found in Backend/Frontend folder"

**Solution**: Ensure both `Backend/package.json` and `Frontend/package.json` files exist. Use the files provided in the `TheBenjiBag_WithPackageJSON.zip` package.

### Error: "Failed to install Backend/Frontend dependencies"

**Solution**: 
1. Check your internet connection
2. Try running `pnpm install` manually in the Backend/Frontend folder
3. If pnpm fails, the script will fall back to npm automatically

### Warning: "Push failed"

**Possible causes**:

1. **Repository doesn't exist**: Create the repository at [https://github.com/new](https://github.com/new) with the name `TheBenjiBag`
2. **Authentication failed**: Ensure you're using the correct GitHub credentials or Personal Access Token
3. **No push access**: Verify you have write access to the repository
4. **Network issues**: Check your internet connection

**Manual push**: If the automatic push fails, you can push manually later:

```powershell
cd C:\TheBenjiBag
git push -u origin main
```

### Error: "Chocolatey installation failed"

**Solution**:
1. Ensure you have an active internet connection
2. Temporarily disable antivirus/firewall
3. Manually install Chocolatey from [https://chocolatey.org/install](https://chocolatey.org/install)
4. Re-run the script

### Error: "Node.js/Git installation failed"

**Solution**: Manually download and install from:
- Node.js: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
- Git: [https://git-scm.com/downloads](https://git-scm.com/downloads)

Then re-run the script. It will detect the existing installations and skip those steps.

## After Running the Script

Once the script completes successfully:

### 1. Verify GitHub Repository

Visit your repository at: [https://github.com/Creighzyba87/TheBenjiBag](https://github.com/Creighzyba87/TheBenjiBag)

You should see all your project files (except those in `.gitignore`).

### 2. Configure Environment Variables

Edit `C:\TheBenjiBag\Backend\.env` and add your credentials:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
MAPTILER_ADMIN=your_admin_key
MAPTILER_DRIVER=your_driver_key
MAPTILER_CUSTOMER=your_customer_key
BREVO_SMTP_USER=your_brevo_user
BREVO_SMTP_KEY=your_brevo_key
HELCIM_API_KEY=your_helcim_key
```

### 3. Initialize the Database

```powershell
cd C:\TheBenjiBag\Backend
pnpm seed
```

### 4. Start the Development Servers

**Terminal 1 (Backend)**:
```powershell
cd C:\TheBenjiBag\Backend
pnpm dev
```

**Terminal 2 (Frontend)**:
```powershell
cd C:\TheBenjiBag\Frontend
pnpm dev
```

### 5. Access the Application

Open your browser and navigate to: [http://localhost:5173](http://localhost:5173)

## Script Output Example

```
============================================================================
  TheBenjiBag: Complete Setup and GitHub Deployment
============================================================================

Project Path: C:\TheBenjiBag
GitHub Repo: https://github.com/Creighzyba87/TheBenjiBag.git

[STEP 1/10] Checking administrator privileges...
✓ Running with Administrator privileges.

[STEP 2/10] Verifying project directory...
✓ Project directory found: C:\TheBenjiBag

[STEP 3/10] Installing Chocolatey package manager...
✓ Chocolatey is already installed.

[STEP 4/10] Installing Node.js LTS...
✓ Node.js is already installed: v18.19.0

[STEP 5/10] Installing Git...
✓ Git is already installed: git version 2.43.0

[STEP 6/10] Installing pnpm...
✓ pnpm is already installed: 8.15.0

[STEP 7/10] Installing Backend dependencies...
✓ Backend dependencies installed successfully!

[STEP 8/10] Installing Frontend dependencies...
✓ Frontend dependencies installed successfully!

[STEP 9/10] Setting up Git repository...
✓ Git repository initialized.
✓ Remote origin added.
✓ .gitignore created.

[STEP 10/10] Committing and pushing to GitHub...
✓ Commit created successfully.
✓ Successfully pushed to GitHub!

============================================================================
  Setup Complete!
============================================================================

Installed Tools:
  ✓ Node.js: v18.19.0
  ✓ npm: 9.8.1
  ✓ Git: git version 2.43.0
  ✓ pnpm: 8.15.0

Project Status:
  ✓ Backend dependencies installed
  ✓ Frontend dependencies installed
  ✓ Git repository initialized
  ✓ Remote origin configured

GitHub Repository:
  https://github.com/Creighzyba87/TheBenjiBag.git

Next Steps:
  1. Configure your .env file in the Backend directory
  2. Set up MongoDB Atlas and get your connection string
  3. Run 'cd Backend && pnpm dev' to start the backend server
  4. Run 'cd Frontend && pnpm dev' to start the frontend
  5. Visit your GitHub repository to verify the push
```

## Additional Resources

- **Setup Guide**: `Setup_Guide.md` - Comprehensive setup instructions
- **Quick Reference**: `Quick_Reference.md` - Common commands and tasks
- **Dependencies Guide**: `Dependencies_Guide.md` - Detailed dependency information
- **Quick Fix**: `QUICK_FIX.md` - Solutions to common issues

---

**Prepared by**: Manus AI  
**Last Updated**: November 11, 2025
