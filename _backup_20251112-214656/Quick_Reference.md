# TheBenjiBag: Quick Reference Guide

This document provides a condensed reference for the most common tasks and commands you'll need when working with TheBenjiBag.

## Project Structure

```
TheBenjiBag/
├── backend/           # Node.js/Express backend
│   ├── server.js      # Main server entry point
│   ├── routers.ts     # tRPC API routes
│   ├── schema.ts      # MongoDB schemas
│   └── ...            # Other backend files
├── frontend/          # React frontend
│   ├── App.tsx        # Main app component
│   ├── vite.config.js # Vite configuration
│   └── ...            # Other frontend files
├── config/            # Configuration files
│   ├── .env           # Environment variables
│   ├── render.yaml    # Render deployment config
│   └── build.yml      # GitHub Actions workflow
├── docs/              # Documentation
│   ├── README.md      # Project overview
│   └── DEPLOYMENT.md  # Deployment guide
└── scripts/           # Deployment and setup scripts
    ├── install_dependencies.ps1
    ├── deploy.sh
    └── deploy.ps1
```

## Common Commands

### Local Development

```bash
# Install all dependencies
npm install
cd frontend && npm install && cd ..

# Start backend server (Terminal 1)
cd backend && npm start

# Start frontend server (Terminal 2)
cd frontend && npm run dev

# Run database seed script
cd backend && node seed.js
```

### Git Commands

```bash
# Initialize repository
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/thebenjibag.git
git push -u origin main

# Create a new branch
git checkout -b feature-name

# Commit changes
git add .
git commit -m "Description of changes"
git push
```

### PowerShell Commands (Windows)

```powershell
# Install dependencies using the automated script
.\scripts\install_dependencies.ps1

# Deploy to Render using PowerShell script
$env:RENDER_API_KEY = "your_api_key"
$env:RENDER_SERVICE_ID = "your_service_id"
.\scripts\deploy.ps1
```

## Environment Variables

The following environment variables must be set in the `backend/.env` file:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Server port | `10000` |
| `NODE_ENV` | Environment mode | `production` or `development` |
| `JWT_SECRET` | Secret for JWT signing | Random string (64+ chars) |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `MAPTILER_ADMIN` | MapTiler key for admin | Your admin key |
| `MAPTILER_DRIVER` | MapTiler key for driver | Your driver key |
| `MAPTILER_CUSTOMER` | MapTiler key for customer | Your customer key |
| `BREVO_SMTP_USER` | Brevo SMTP username | Your Brevo username |
| `BREVO_SMTP_KEY` | Brevo SMTP password | Your Brevo password |
| `HELCIM_API_KEY` | Helcim API key | Your Helcim test key |
| `CORS_ORIGIN` | Allowed CORS origins | `https://thebenjibag.com` |

## Direct Links to Third-Party Services

| Service | Purpose | Link |
| :--- | :--- | :--- |
| **Node.js** | Download and install Node.js | [https://nodejs.org/](https://nodejs.org/) |
| **Git** | Download and install Git | [https://git-scm.com/](https://git-scm.com/) |
| **GitHub** | Create a GitHub account | [https://github.com/](https://github.com/) |
| **Render** | Create a Render account | [https://render.com/](https://render.com/) |
| **MongoDB Atlas** | Create a MongoDB Atlas account | [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) |
| **MapTiler** | Get MapTiler API keys | [https://www.maptiler.com/](https://www.maptiler.com/) |
| **Brevo** | Get Brevo SMTP credentials | [https://www.brevo.com/](https://www.brevo.com/) |
| **Helcim** | Get Helcim payment API key | [https://www.helcim.com/](https://www.helcim.com/) |

## Render.com Deployment Checklist

- [ ] Create a new web service on Render
- [ ] Connect your GitHub repository
- [ ] Verify build command: `npm run build`
- [ ] Verify start command: `npm start`
- [ ] Add all environment variables in the Render dashboard
- [ ] Deploy the service
- [ ] Add `RENDER_API_KEY` and `RENDER_SERVICE_ID` as GitHub secrets for CI/CD

## Troubleshooting

### Age Gate Not Showing
```javascript
// Clear browser localStorage
localStorage.clear()
```

### Database Connection Issues
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

### Map Not Loading
- Verify MapTiler API keys are valid
- Check CORS configuration
- Ensure keys have appropriate permissions

### Payment Processing Issues
- Verify Helcim API key is in test mode
- Check Helcim test credentials are valid
- Review payment webhook logs

## Support Resources

- **Project README**: `docs/README.md`
- **Deployment Guide**: `docs/DEPLOYMENT.md`
- **Setup Guide**: `Setup_Guide.md`
- **GitHub Issues**: Create an issue in your repository
- **Render Documentation**: [https://render.com/docs](https://render.com/docs)
