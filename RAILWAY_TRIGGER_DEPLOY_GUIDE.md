# How to Find "Trigger Deploy" in Railway Dashboard

This guide shows you exactly where to click to trigger a new deployment.

## Step-by-Step Visual Guide

### Step 1: Go to Railway Dashboard
1. Open https://railway.app
2. Click **"Sign in"** (top right)
3. Log in with your GitHub account
4. You'll see your projects

### Step 2: Select Your TrustLink Project
1. Look for your project named **"trustlink_landing"** or similar
2. Click on it to open the project

**Expected Screen:**
```
Your Projects
├── trustlink_landing ← Click here
├── other-project
└── another-project
```

### Step 3: Find the Deployments Tab
Once inside your project, you'll see several tabs at the top:

```
┌─────────────────────────────────────────┐
│ Project: trustlink_landing              │
├─────────────────────────────────────────┤
│ [Overview] [Deployments] [Logs] [Vars]  │
│                    ↑                     │
│              Click here                  │
└─────────────────────────────────────────┘
```

**Click on "Deployments" tab**

### Step 4: Find the "Trigger Deploy" Button
After clicking Deployments, you'll see:

```
┌──────────────────────────────────────────┐
│ Deployments                              │
├──────────────────────────────────────────┤
│ [Trigger Deploy] [Rollback]              │
│      ↑                                   │
│  Click this button                       │
├──────────────────────────────────────────┤
│ Deployment History:                      │
│ • Jun 11 - 04:15 - Failed                │
│ • Jun 10 - 10:30 - Success               │
│ • Jun 10 - 09:45 - Failed                │
└──────────────────────────────────────────┘
```

**Click the "Trigger Deploy" button** (usually purple/blue colored)

### Step 5: Confirm Deployment
A dialog will appear asking:
```
Trigger new deployment?
This will deploy the latest code from your GitHub repository.

[Cancel] [Trigger Deploy]
```

**Click "Trigger Deploy"** to confirm

### Step 6: Monitor the Deployment
After clicking, you'll see:
```
Status: Building...
Progress: ████░░░░░░ 40%

Build Logs:
[2026-06-11 04:25:00] Installing dependencies...
[2026-06-11 04:25:15] Running build script...
[2026-06-11 04:25:30] Building frontend...
```

Wait for it to complete (usually 2-5 minutes)

---

## Alternative Method: Auto-Deploy from GitHub

If you don't want to manually trigger deploys, Railway can auto-deploy when you push to GitHub:

1. Go to your project in Railway
2. Click **"Settings"** tab
3. Look for **"GitHub"** section
4. Enable **"Auto-deploy on push"**

Now every time you push to GitHub, Railway will automatically deploy!

---

## What to Look For After Deployment

### ✅ Successful Deployment
```
Status: Deployed
Last deployment: Jun 11 04:30 UTC
Environment: production
URL: https://trustlinklanding-production.up.railway.app
```

### ❌ Failed Deployment
```
Status: Failed
Error: Database connection failed
Check logs for details
```

If it fails, check:
1. **Logs** tab for error messages
2. **Variables** tab to verify environment variables
3. **RAILWAY_TROUBLESHOOTING.md** for common issues

---

## Quick Navigation Map

```
Railway Dashboard
│
├─ Your Projects
│  └─ trustlink_landing ← Click here
│     │
│     ├─ Overview (current status)
│     ├─ Deployments ← Go here
│     │  │
│     │  ├─ [Trigger Deploy] ← Click this button
│     │  └─ Deployment History
│     │
│     ├─ Logs (view application logs)
│     ├─ Variables (environment variables)
│     └─ Settings
│
└─ Other Projects
```

---

## Troubleshooting

### Can't Find "Trigger Deploy" Button?
- Make sure you're in the **Deployments** tab
- The button should be near the top of the page
- If you don't see it, try refreshing the page

### Button is Greyed Out?
- The deployment might already be in progress
- Wait for current deployment to finish
- Then you can trigger a new one

### Don't See Your Project?
- Make sure you're logged in
- Check if the project is in a different team/organization
- Click on your profile icon to see all projects

---

## After Successful Deployment

1. **Check the URL**: Click the URL to visit your deployed app
2. **Set Environment Variables**: Go to Variables tab and add all required variables
3. **Run Database Migrations**: Open Shell and run `pnpm db:push`
4. **Test the App**: Visit the URL and test the landing page and dashboard

---

## Need Help?

- **Railway Docs**: https://docs.railway.app
- **Troubleshooting**: See RAILWAY_TROUBLESHOOTING.md
- **Setup Guide**: See RAILWAY_SETUP.md
