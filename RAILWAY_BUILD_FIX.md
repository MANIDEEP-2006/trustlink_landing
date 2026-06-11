# Railway Build Failure - Diagnosis and Fix

## Problem Identified

Your deployment is **failing during the build process** on Railway.

**Error:** `Deployment failed during build process - Build > Build image`

---

## Root Causes (Most Likely)

### 1. **Missing or Incorrect Environment Variables** ⭐ (Most Common)
Railway needs environment variables during build time for Vite to work correctly.

**Required build-time variables:**
```
VITE_APP_ID=your_app_id
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your_id
VITE_APP_TITLE=TrustLink
VITE_APP_LOGO=https://your-logo-url.png
```

### 2. **Node.js Version Mismatch**
Railway might be using a different Node.js version than expected.

### 3. **Dependency Installation Failure**
`pnpm install` might be failing due to corrupted lock file.

### 4. **Build Script Error**
The build command might be failing silently.

---

## Step-by-Step Fix

### Step 1: Set All Environment Variables in Railway

1. Go to Railway Dashboard
2. Click your **trustlink_landing** project
3. Click **Variables** tab
4. Add ALL these variables:

```
# OAuth & Auth
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
JWT_SECRET=your_jwt_secret_min_32_chars

# Owner Info
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your_website_id

# App Config
VITE_APP_TITLE=TrustLink
VITE_APP_LOGO=https://your-logo-url.png

# Database
DATABASE_URL=mysql://user:password@host:port/database

# Node
NODE_ENV=production
```

### Step 2: Verify Build Configuration

Check that these files are in your repo:
- ✅ `Procfile` - Should exist
- ✅ `railway.json` - Should exist
- ✅ `package.json` - Should have build script
- ✅ `vite.config.ts` - Should exist

### Step 3: Trigger New Deployment

1. Go to **Deployments** tab
2. Click **Trigger Deploy** button
3. Wait for build to complete

### Step 4: Monitor Build Logs

1. Click on the deployment that's building
2. Click **View logs** to see real-time build output
3. Look for errors like:
   - `Cannot find module`
   - `ENOENT: no such file`
   - `Build failed`

---

## Common Build Errors and Fixes

### Error: "Cannot find module 'express'"
**Cause:** Dependencies not installed
**Fix:** 
1. Check `package.json` exists
2. Check `pnpm-lock.yaml` exists
3. Rebuild lock file locally: `pnpm install`
4. Push to GitHub

### Error: "VITE_APP_ID is undefined"
**Cause:** Missing environment variables
**Fix:** Add all VITE_* variables to Railway Variables tab

### Error: "Build > Build image failed"
**Cause:** Build script error
**Fix:**
1. Test build locally: `pnpm build`
2. Check for TypeScript errors: `pnpm check`
3. Fix errors and push

### Error: "esbuild: command not found"
**Cause:** esbuild not installed
**Fix:**
1. Check `package.json` has esbuild in devDependencies
2. Run `pnpm install` locally
3. Push `pnpm-lock.yaml`

---

## Testing Build Locally

Before pushing to Railway, test the build locally:

```bash
# Install dependencies
pnpm install

# Check for TypeScript errors
pnpm check

# Build the project
pnpm build

# If successful, you should see:
# ✓ dist/public/ (frontend build)
# ✓ dist/index.js (server build)

# Test production start
NODE_ENV=production node dist/index.js
```

If any of these fail, fix the error before pushing to GitHub.

---

## Advanced Debugging

### Check Build Logs in Railway

1. Go to your deployment
2. Click **View logs**
3. Look for the exact error message
4. Search for keywords like:
   - `error`
   - `failed`
   - `undefined`
   - `not found`

### Common Log Patterns

**Successful build:**
```
[2026-06-11 04:25:00] Installing dependencies...
[2026-06-11 04:25:15] Running build script...
[2026-06-11 04:25:30] Building frontend...
[2026-06-11 04:25:45] Building server...
[2026-06-11 04:26:00] Build successful!
```

**Failed build:**
```
[2026-06-11 04:25:00] Installing dependencies...
[2026-06-11 04:25:15] Running build script...
[2026-06-11 04:25:30] Error: Cannot find module 'express'
[2026-06-11 04:25:31] Build failed!
```

---

## Rollback to Working Deployment

If the new deployment fails, rollback to the last working one:

1. Go to **Deployments** tab
2. Find the last **ACTIVE** deployment
3. Click the three dots (⋯)
4. Click **Rollback**
5. Confirm

This instantly reverts to the working version.

---

## Checklist Before Deployment

- [ ] All environment variables set in Railway
- [ ] `Procfile` exists in repo
- [ ] `railway.json` exists in repo
- [ ] `package.json` has correct build script
- [ ] `pnpm-lock.yaml` is up to date
- [ ] Build works locally: `pnpm build`
- [ ] No TypeScript errors: `pnpm check`
- [ ] Latest code pushed to GitHub

---

## Quick Fix Summary

If deployment is still failing:

1. **Set environment variables** in Railway Variables tab
2. **Test build locally**: `pnpm build`
3. **Check for errors**: `pnpm check`
4. **Push to GitHub**: `git push origin main`
5. **Trigger new deployment** in Railway
6. **Monitor logs** for errors

---

## Need More Help?

- Check **RAILWAY_TROUBLESHOOTING.md** for more issues
- Check **RAILWAY_SETUP.md** for setup instructions
- Check build logs in Railway dashboard
- Review **DEPLOYMENT.md** for general info

---

## Build Process Overview

```
GitHub Push
    ↓
Railway Detects Change
    ↓
Clone Repository
    ↓
Install Dependencies (pnpm install)
    ↓
Set Environment Variables
    ↓
Run Build Script (pnpm build)
    ├─ Vite builds frontend → dist/public/
    └─ esbuild builds server → dist/index.js
    ↓
Start Application (node dist/index.js)
    ↓
✅ Deployment Successful or ❌ Deployment Failed
```

If any step fails, the entire deployment fails.
