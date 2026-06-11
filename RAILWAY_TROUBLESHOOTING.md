# Railway Deployment Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Application Crashes Immediately After Deploy

**Symptoms:**
- Deployment completes but app crashes
- Error in logs: "Cannot find module" or "PORT not defined"

**Solutions:**

1. **Check environment variables are set:**
   ```
   DATABASE_URL - Required for database connection
   JWT_SECRET - Required for session management
   VITE_APP_ID - Required for OAuth
   ```

2. **Verify build completed successfully:**
   - Check "Deployments" tab in Railway
   - Look for "Build successful" message
   - If build failed, check build logs for errors

3. **Check logs for specific errors:**
   - Go to "Logs" tab in Railway
   - Look for error messages
   - Common errors:
     - `ENOENT: no such file or directory` → Build didn't complete
     - `Error: connect ECONNREFUSED` → DATABASE_URL is wrong
     - `Cannot find module 'express'` → Dependencies not installed

### Issue 2: Database Connection Error

**Symptoms:**
- Error: "connect ECONNREFUSED"
- Error: "Access denied for user"
- Error: "Unknown database"

**Solutions:**

1. **Verify DATABASE_URL format:**
   ```
   Correct: mysql://user:password@host:port/database
   Wrong:   mysql://user:password@host/database (missing port)
   Wrong:   mysql://user@password:host:port/database (wrong order)
   ```

2. **Check database is running:**
   - If using Railway MySQL plugin, verify it's deployed
   - If using external database, verify server is accessible

3. **Test connection locally first:**
   ```bash
   # Create .env.local with DATABASE_URL
   pnpm db:push  # Test migration
   ```

4. **Run migrations in Railway:**
   - Go to Railway dashboard
   - Click service → Shell tab
   - Run: `pnpm db:push`

### Issue 3: OAuth Not Working

**Symptoms:**
- Login button doesn't work
- Redirect fails
- Error: "Invalid app ID"

**Solutions:**

1. **Verify VITE_APP_ID:**
   - Check it matches your Manus OAuth app ID
   - Ensure it's set in Railway environment variables

2. **Check OAuth redirect URL:**
   - Your app URL must be registered in OAuth provider
   - Format: `https://your-railway-app.up.railway.app/api/oauth/callback`
   - Add this to allowed redirect URLs

3. **Verify OAUTH_SERVER_URL:**
   - Should be: `https://api.manus.im`
   - Check it's accessible from Railway

### Issue 4: Static Files Not Loading

**Symptoms:**
- CSS/JS files return 404
- Page loads but looks broken
- Console errors about missing assets

**Solutions:**

1. **Verify build output:**
   - Check that `dist/` folder exists after build
   - Verify `dist/public/` contains built files

2. **Check Procfile:**
   - Should be: `web: NODE_ENV=production node dist/index.js`
   - Ensure NODE_ENV is set to production

3. **Verify server is serving static files:**
   - In production, server serves from `dist/public/`
   - Check `server/_core/index.ts` has `serveStatic(app)` call

### Issue 5: Port Already in Use

**Symptoms:**
- Error: "EADDRINUSE: address already in use"
- App crashes on startup

**Solutions:**

1. **The app handles this automatically:**
   - Code tries port 3000, then 3001, 3002, etc.
   - Railway assigns PORT environment variable
   - App reads from `process.env.PORT`

2. **If still failing:**
   - Restart the service in Railway
   - Check for multiple instances running
   - Verify no hardcoded port numbers in code

### Issue 6: Memory/CPU Issues

**Symptoms:**
- App runs slowly
- Crashes under load
- Error: "JavaScript heap out of memory"

**Solutions:**

1. **Check Railway resource allocation:**
   - Go to Settings → Resources
   - Increase CPU/Memory if needed

2. **Optimize database queries:**
   - Add indexes to frequently queried fields
   - Use pagination for large result sets
   - Cache verification lookups

3. **Check for memory leaks:**
   - Monitor memory usage in Railway dashboard
   - If constantly increasing, check logs for issues

### Issue 7: Build Takes Too Long or Times Out

**Symptoms:**
- Build stuck for >30 minutes
- Error: "Build timeout"

**Solutions:**

1. **Check for large files:**
   - Verify no node_modules in repo
   - Check pnpm-lock.yaml isn't corrupted
   - Remove unnecessary dependencies

2. **Optimize build:**
   - Use `pnpm install --frozen-lockfile` for faster installs
   - Consider using Railway's cache

3. **Check build logs:**
   - Look for stuck operations
   - May need to rebuild pnpm-lock.yaml locally

### Issue 8: Deployment Keeps Failing

**Symptoms:**
- Multiple failed deployments
- Different errors each time
- Can't identify root cause

**Solutions:**

1. **Start fresh:**
   - Delete current deployment
   - Trigger new deploy from main branch
   - Watch logs carefully

2. **Check recent changes:**
   - Verify recent commits don't break build
   - Test locally: `pnpm build`
   - Check for syntax errors

3. **Verify all files are committed:**
   - Run `git status` locally
   - Ensure no uncommitted changes
   - Push latest changes to GitHub

## Debugging Steps

### Step 1: Check Logs
```
Railway Dashboard → Service → Logs
Look for error messages and stack traces
```

### Step 2: Verify Environment Variables
```
Railway Dashboard → Service → Variables
Ensure all required variables are set
```

### Step 3: Test Locally
```bash
# Copy environment variables
cp .env.example .env.local
# Edit with real values
nano .env.local

# Test build
pnpm build

# Test start
NODE_ENV=production node dist/index.js
```

### Step 4: Check Build Output
```bash
# Verify dist folder exists
ls -la dist/

# Check if public files are there
ls -la dist/public/

# Check if server file exists
ls -la dist/index.js
```

### Step 5: Review Recent Changes
```bash
# Check last commits
git log --oneline -10

# Check what changed
git diff HEAD~1
```

## Performance Optimization

### Database
- Add indexes on frequently queried fields
- Use pagination for large result sets
- Cache verification lookups (Redis optional)

### Frontend
- Enable gzip compression
- Minify CSS/JS (done automatically by Vite)
- Use CDN for static assets

### Server
- Use connection pooling for database
- Implement caching for API responses
- Monitor and optimize slow queries

## Monitoring

### Check Health
```
Railway Dashboard → Metrics
Monitor CPU, Memory, Network
```

### View Logs
```
Railway Dashboard → Logs
Real-time application logs
```

### Track Deployments
```
Railway Dashboard → Deployments
View deployment history
Rollback if needed
```

## Emergency Rollback

If deployment is broken:

1. Go to Railway Dashboard
2. Click "Deployments"
3. Find last working deployment
4. Click "Rollback"
5. Confirm rollback

This reverts to previous working version immediately.

## Getting Help

1. **Check Railway Docs:** https://docs.railway.app
2. **Check TrustLink Docs:** DEPLOYMENT.md, README.md
3. **Check Logs:** Most issues are in the logs
4. **Test Locally:** Always test `pnpm build && NODE_ENV=production node dist/index.js`

## Quick Checklist

- [ ] Procfile exists and is correct
- [ ] .env.example documents all variables
- [ ] All required environment variables are set in Railway
- [ ] DATABASE_URL is correct format
- [ ] JWT_SECRET is set (min 32 chars)
- [ ] VITE_APP_ID is correct
- [ ] Build completes successfully
- [ ] dist/ folder contains built files
- [ ] App starts without errors
- [ ] Database migrations are run
- [ ] OAuth redirect URL is configured
- [ ] Static files load correctly
