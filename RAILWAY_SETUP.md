# Railway Deployment Setup Guide

This guide will help you deploy TrustLink to Railway successfully.

## Prerequisites

- Railway account (https://railway.app)
- GitHub repository with the code
- Database (MySQL/TiDB) - Railway can provide this
- All required environment variables

## Step 1: Create a Railway Project

1. Go to [Railway Dashboard](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select `trustlink_landing` repository
5. Railway will automatically detect the Node.js project

## Step 2: Configure Environment Variables

Railway needs the following environment variables. Add them in the Railway dashboard:

### Database
```
DATABASE_URL=mysql://user:password@host:port/database
```

### OAuth & Authentication
```
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
JWT_SECRET=your_jwt_secret_key_min_32_chars
```

### Owner Information
```
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id
```

### Manus APIs
```
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

### Analytics
```
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

### App Configuration
```
VITE_APP_TITLE=TrustLink
VITE_APP_LOGO=https://your-logo-url.png
PORT=3000
NODE_ENV=production
```

## Step 3: Add a Database Plugin (Optional)

Railway can provision a MySQL database for you:

1. In your Railway project, click "Add"
2. Select "Database"
3. Choose "MySQL"
4. Railway will automatically set `DATABASE_URL` environment variable

## Step 4: Deploy

1. Railway will automatically deploy when you push to GitHub
2. Check the "Deployments" tab to monitor build progress
3. Once deployed, Railway provides a public URL

## Step 5: Run Database Migrations

After the first deployment:

1. Go to the Railway dashboard
2. Click on your service
3. Open the "Shell" tab
4. Run: `pnpm db:push`

This will apply all database migrations.

## Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version is 22.x or higher

### App Crashes After Deploy
- Check logs in Railway dashboard
- Verify all environment variables are set
- Ensure DATABASE_URL is correct
- Run `pnpm db:push` to apply migrations

### Database Connection Error
- Verify DATABASE_URL format: `mysql://user:password@host:port/database`
- Check database server is running
- Ensure user has proper permissions
- Test connection locally first

### OAuth Not Working
- Verify VITE_APP_ID is correct
- Check OAUTH_SERVER_URL is accessible
- Ensure redirect URLs are configured in OAuth provider
- Check browser console for errors

### Port Issues
- Railway automatically assigns a PORT environment variable
- The app reads from `process.env.PORT` (defaults to 3000)
- Do NOT hardcode port numbers

## Monitoring

1. **Logs**: View real-time logs in Railway dashboard
2. **Metrics**: Monitor CPU, memory, and network usage
3. **Deployments**: Track deployment history and rollback if needed

## Custom Domain

1. In Railway dashboard, go to "Settings"
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Scaling

Railway automatically scales based on:
- CPU usage
- Memory usage
- Request volume

You can configure auto-scaling in project settings.

## Support

For Railway-specific issues:
- Check [Railway Docs](https://docs.railway.app)
- Visit [Railway Community](https://railway.app/community)
- Contact Railway support

For TrustLink-specific issues:
- Check logs in `.manus-logs/` (after SSH into Railway)
- Review DEPLOYMENT.md for general setup
- Check README.md for feature documentation
