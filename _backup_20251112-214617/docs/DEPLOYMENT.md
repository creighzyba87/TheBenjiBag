# TheBenjiBag Deployment Guide

This guide covers deploying the TheBenjiBag cannabis delivery platform to Render.com.

## Prerequisites

- GitHub account with repository access
- Render.com account (free tier supported)
- MongoDB Atlas account (free tier)
- MapTiler API keys (3 keys: admin, driver, customer)
- Brevo SMTP credentials
- Helcim API credentials (test mode)

## Environment Variables

All required environment variables are configured in `render.yaml`. You must set the following secrets in your Render dashboard:

### Database & Core
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Session signing secret

### Mapping (MapTiler)
- `MAPTILER_ADMIN` - Admin dashboard map key
- `MAPTILER_DRIVER` - Driver mobile map key
- `MAPTILER_CUSTOMER` - Customer tracking map key

### Email (Brevo)
- `BREVO_SMTP_USER` - SMTP username
- `BREVO_SMTP_KEY` - SMTP password/API key

### Payments (Helcim)
- `HELCIM_API_KEY` - Helcim test API key

### Render Deployment
- `RENDER_API_KEY` - Your Render API key
- `RENDER_SERVICE_ID` - Your service ID

## Deployment Steps

### 1. Prepare Your Repository

```bash
# Clone or create your repository
git clone https://github.com/yourusername/thebenjibag.git
cd thebenjibag

# Install dependencies
npm install
cd client && npm install && cd ..

# Verify builds work locally
npm run build
cd client && npm run build && cd ..
```

### 2. Connect to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select the repository containing TheBenjiBag

### 3. Configure Render Service

1. Set the build command: `npm run build`
2. Set the start command: `npm start`
3. Set the publish directory (if using static): `client/dist`

### 4. Add Environment Variables

In your Render dashboard, add all secrets from the Prerequisites section:

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
MAPTILER_ADMIN=...
MAPTILER_DRIVER=...
MAPTILER_CUSTOMER=...
BREVO_SMTP_USER=...
BREVO_SMTP_KEY=...
HELCIM_API_KEY=...
```

### 5. Deploy

#### Option A: Automatic Deployment (Recommended)

Push to your main branch and Render will automatically deploy:

```bash
git push origin main
```

#### Option B: Manual Deployment Script

**Unix/Linux/macOS:**
```bash
export RENDER_API_KEY=your_api_key
export RENDER_SERVICE_ID=your_service_id
chmod +x tools/deploy.sh
./tools/deploy.sh
```

**Windows PowerShell:**
```powershell
$env:RENDER_API_KEY = "your_api_key"
$env:RENDER_SERVICE_ID = "your_service_id"
.\tools\deploy.ps1
```

## Post-Deployment

### 1. Verify Deployment

1. Check Render dashboard for deployment status
2. Visit your service URL to verify it's running
3. Test age gate on landing page
4. Verify login flow works

### 2. Configure Custom Domain

1. In Render dashboard, go to Settings
2. Add your custom domain (e.g., thebenjibag.com)
3. Update DNS records as instructed
4. Update CORS_ORIGIN in environment variables

### 3. Set Up Monitoring

1. Enable email notifications in Render dashboard
2. Set up error tracking (optional)
3. Monitor logs for any issues

## Database Setup

The application uses MongoDB Atlas (free tier). To set up:

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Whitelist Render's IP addresses
4. Copy the connection string to `MONGODB_URI`

The database schema will be automatically created on first deployment.

## Troubleshooting

### Build Failures

Check the build logs in Render dashboard:
1. Verify all dependencies are installed
2. Check Node.js version compatibility
3. Ensure all environment variables are set

### Runtime Errors

1. Check application logs in Render dashboard
2. Verify database connection
3. Ensure all API keys are valid
4. Check CORS configuration

### Deployment Issues

1. Verify GitHub repository is accessible
2. Check Render API key is valid
3. Ensure service ID is correct
4. Review deployment logs for errors

## Scaling

### For Production Use

1. Upgrade from free tier to paid plans
2. Enable auto-scaling
3. Set up CDN for static assets
4. Configure database backups
5. Implement rate limiting
6. Add monitoring and alerting

### Performance Optimization

1. Enable gzip compression
2. Implement caching headers
3. Optimize database queries
4. Use connection pooling
5. Implement lazy loading for images

## Security Checklist

- [ ] All secrets are in Render environment, not in code
- [ ] CORS is properly configured
- [ ] JWT secret is strong and unique
- [ ] Database backups are enabled
- [ ] SSL/TLS is enabled (automatic on Render)
- [ ] Rate limiting is configured
- [ ] API keys are rotated regularly
- [ ] Logs are monitored for suspicious activity

## Support

For issues or questions:
1. Check Render documentation: https://render.com/docs
2. Review application logs
3. Check GitHub Issues
4. Contact Render support

## Rollback

If deployment fails:

1. Go to Render dashboard
2. Select your service
3. Click "Deployments"
4. Select a previous successful deployment
5. Click "Redeploy"

## CI/CD Pipeline

The project includes GitHub Actions workflow (`.github/workflows/build.yml`) that:
1. Runs on push to main/develop branches
2. Installs dependencies
3. Runs linting and tests
4. Builds frontend and backend
5. Creates deployment artifact
6. Deploys to Render (main branch only)

To enable automatic deployments:
1. Add `RENDER_API_KEY` and `RENDER_SERVICE_ID` as GitHub secrets
2. Push to main branch
3. GitHub Actions will automatically deploy

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
