# Render Deployment Guide for TrustLink

This guide will help you deploy TrustLink to Render with all required configuration.

## Why Render?

- ✅ **Free tier** - Completely free with generous limits
- ✅ **Easy setup** - Connect GitHub and deploy automatically
- ✅ **Database included** - Free MySQL database
- ✅ **No credit card** - Truly free (no hidden charges)
- ✅ **Good performance** - Reliable uptime and speed

---

## Prerequisites

1. GitHub account (you already have this)
2. Render account (free at https://render.com)
3. Your TrustLink repository (https://github.com/MANIDEEP-2006/trustlink_landing)

---

## Step 1: Create Render Account

1. Go to https://render.com
2. Click **"Sign up"**
3. Choose **"Sign up with GitHub"**
4. Authorize Render to access your GitHub
5. Complete signup

---

## Step 2: Create New Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** button
3. Select **"Web Service"**
4. Choose **"Build and deploy from a Git repository"**

---

## Step 3: Connect GitHub Repository

1. Click **"Connect account"** if needed
2. Search for **"trustlink_landing"**
3. Click to select it
4. Click **"Connect"**

---

## Step 4: Configure Service

Fill in the following details:

| Field | Value |
|-------|-------|
| **Name** | trustlink-landing |
| **Environment** | Node |
| **Region** | Choose closest to you (e.g., Singapore, US) |
| **Branch** | main |
| **Build Command** | `pnpm install && pnpm build` |
| **Start Command** | `NODE_ENV=production node dist/index.js` |
| **Plan** | Free |

---

## Step 5: Add Environment Variables

Click **"Advanced"** and add these environment variables:

### Critical Variables (Must Have)
```
NODE_ENV=production
VITE_APP_ID=your_app_id
JWT_SECRET=your_jwt_secret_key_min_32_chars
DATABASE_URL=provided_by_render_mysql
```

### OAuth Variables
```
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
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
```

---

## Step 6: Add Database

1. Click **"Create Database"** button
2. Choose **"MySQL"**
3. Name it: **trustlink-db**
4. Plan: **Free**
5. Click **"Create Database"**

Render will automatically set `DATABASE_URL` environment variable.

---

## Step 7: Deploy

1. Click **"Create Web Service"**
2. Render will start building (takes 3-5 minutes)
3. Watch the build logs
4. Once deployed, you'll get a URL like: `https://trustlink-landing-xxxxx.onrender.com`

---

## Step 8: Run Database Migrations

After deployment succeeds:

1. Go to your service in Render dashboard
2. Click **"Shell"** tab
3. Run: `pnpm db:push`
4. Wait for migrations to complete

---

## Step 9: Make Yourself Admin

1. Go to your Render dashboard
2. Click your service
3. Go to **"Shell"** tab
4. Run this command to make yourself admin:

```bash
# Get your user ID from the database
mysql -u root -p$DATABASE_URL -e "SELECT id, email, role FROM users LIMIT 5;"

# Update your role to admin
mysql -u root -p$DATABASE_URL -e "UPDATE users SET role='admin' WHERE email='your_email@example.com';"
```

Or use the Render dashboard's database browser to update the `role` field to `'admin'`.

---

## Step 10: Test Your Deployment

1. Visit your Render URL: `https://trustlink-landing-xxxxx.onrender.com`
2. Test the landing page
3. Test the dashboard
4. Test login with your account
5. Verify you're admin

---

## Environment Variables Reference

### What Each Variable Does

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `VITE_APP_ID` | OAuth app identifier | `your-app-id` |
| `JWT_SECRET` | Session signing key | `your-secret-key` |
| `DATABASE_URL` | Database connection | Auto-provided by Render |
| `OAUTH_SERVER_URL` | OAuth server | `https://api.manus.im` |
| `OWNER_OPEN_ID` | Your user ID | `your-open-id` |
| `VITE_APP_TITLE` | Website title | `TrustLink` |
| `VITE_APP_LOGO` | Logo URL | `https://...` |

---

## Troubleshooting

### Build Fails
1. Check build logs in Render dashboard
2. Verify all environment variables are set
3. Test build locally: `pnpm build`
4. Check for TypeScript errors: `pnpm check`

### Database Connection Error
1. Verify `DATABASE_URL` is set
2. Check MySQL database is running
3. Run migrations: `pnpm db:push`

### OAuth Not Working
1. Verify `VITE_APP_ID` is correct
2. Check OAuth redirect URL is configured
3. Ensure `OAUTH_SERVER_URL` is accessible

### App Crashes After Deploy
1. Check service logs in Render
2. Verify all critical variables are set
3. Check database migrations ran successfully

---

## Auto-Deploy from GitHub

Render automatically deploys when you push to GitHub:

1. Push code to main branch
2. Render detects change
3. Build starts automatically
4. Deploy completes
5. Your changes are live!

No manual deployment needed after setup!

---

## Monitoring Your App

### View Logs
- Go to Render dashboard
- Click your service
- Click **"Logs"** tab
- See real-time application logs

### Check Metrics
- Click **"Metrics"** tab
- Monitor CPU, memory, requests
- See error rates

### View Deployments
- Click **"Deployments"** tab
- See deployment history
- Rollback if needed

---

## Custom Domain (Optional)

1. Go to your service settings
2. Click **"Custom Domain"**
3. Enter your domain (e.g., trustlink.com)
4. Follow DNS configuration instructions
5. Domain will be live in 24 hours

---

## Scaling (Optional)

Render automatically scales your app, but you can:

1. Go to service settings
2. Increase plan from Free to Starter ($7/month)
3. Get more CPU, memory, and better uptime

---

## Backup and Recovery

### Backup Database
1. Go to MySQL database in Render
2. Click **"Backups"** tab
3. Click **"Create Backup"**

### Restore from Backup
1. Click **"Backups"** tab
2. Find backup you want
3. Click **"Restore"**

---

## Cost Breakdown

| Service | Free Tier | Cost |
|---------|-----------|------|
| Web Service | Yes | $0 |
| MySQL Database | Yes | $0 |
| Storage | 0.5 GB | Included |
| Bandwidth | Limited | Included |
| **Total** | | **$0/month** |

---

## Next Steps After Deployment

1. ✅ Test the application thoroughly
2. ✅ Verify you're admin
3. ✅ Set up custom domain (optional)
4. ✅ Monitor logs regularly
5. ✅ Create database backups
6. ✅ Share your URL with users

---

## Support

- **Render Docs**: https://render.com/docs
- **Render Status**: https://status.render.com
- **GitHub Issues**: Check your repo for issues

---

## Quick Checklist

- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Web service configured
- [ ] All environment variables set
- [ ] MySQL database created
- [ ] Deployment completed
- [ ] Database migrations ran
- [ ] Admin role set
- [ ] App tested and working
- [ ] Custom domain configured (optional)
