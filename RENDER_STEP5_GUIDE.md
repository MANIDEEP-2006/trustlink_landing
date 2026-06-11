# Step 5: Add Environment Variables - Detailed Guide

This guide shows you **exactly** how to add environment variables in Render.

---

## What Are Environment Variables?

Environment variables are settings that your app needs to run. Think of them as configuration values.

Example:
- `VITE_APP_ID` = Your app's ID
- `JWT_SECRET` = Secret key for sessions
- `DATABASE_URL` = Database connection string

---

## Where to Add Them

### Location in Render Dashboard:

```
Dashboard
  ↓
Your Project (trustlink-landing)
  ↓
Settings (gear icon)
  ↓
Environment
  ↓
Add variables here ← YOU ARE HERE
```

---

## Step-by-Step: How to Add Variables

### Step 1: Find the Variables Section

After you click "Advanced" during web service creation, you'll see:

```
┌─────────────────────────────────────────┐
│ Web Service Configuration               │
├─────────────────────────────────────────┤
│ Name:              [trustlink-landing]  │
│ Environment:       [Node]               │
│ Region:            [US East]            │
│ Branch:            [main]               │
│ Build Command:     [pnpm install...]    │
│ Start Command:     [NODE_ENV=prod...]   │
│                                         │
│ ┌─ Advanced ─────────────────────────┐ │
│ │ Environment Variables:              │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ Key              │ Value         │ │ │
│ │ ├─────────────────────────────────┤ │ │
│ │ │ [Add Variable]                  │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Step 2: Click "Add Variable" Button

You'll see a new row appear:

```
┌──────────────────────────────────────┐
│ Key              │ Value             │
├──────────────────────────────────────┤
│ [empty field]    │ [empty field]     │
└──────────────────────────────────────┘
```

### Step 3: Enter First Variable

**First variable: NODE_ENV**

1. Click the **Key** field (left side)
2. Type: `NODE_ENV`
3. Press Tab or click the **Value** field (right side)
4. Type: `production`

Result:
```
┌──────────────────────────────────────┐
│ Key              │ Value             │
├──────────────────────────────────────┤
│ NODE_ENV         │ production        │
└──────────────────────────────────────┘
```

### Step 4: Add More Variables

Click **"Add Variable"** again and repeat for each variable:

---

## All Variables to Add

Copy-paste these one by one:

### 1. NODE_ENV
```
Key:   NODE_ENV
Value: production
```

### 2. VITE_APP_ID
```
Key:   VITE_APP_ID
Value: your_app_id_here
```
⚠️ Replace `your_app_id_here` with your actual app ID

### 3. JWT_SECRET
```
Key:   JWT_SECRET
Value: your_jwt_secret_key_min_32_chars
```
⚠️ Replace with a random string (at least 32 characters)

Example: `abcdefghijklmnopqrstuvwxyz123456`

### 4. OAUTH_SERVER_URL
```
Key:   OAUTH_SERVER_URL
Value: https://api.manus.im
```

### 5. VITE_OAUTH_PORTAL_URL
```
Key:   VITE_OAUTH_PORTAL_URL
Value: https://portal.manus.im
```

### 6. OWNER_NAME
```
Key:   OWNER_NAME
Value: Your Name
```
⚠️ Replace with your actual name

### 7. OWNER_OPEN_ID
```
Key:   OWNER_OPEN_ID
Value: your_open_id_here
```
⚠️ Replace with your actual open ID

### 8. BUILT_IN_FORGE_API_URL
```
Key:   BUILT_IN_FORGE_API_URL
Value: https://api.manus.im
```

### 9. BUILT_IN_FORGE_API_KEY
```
Key:   BUILT_IN_FORGE_API_KEY
Value: your_api_key_here
```
⚠️ Replace with your actual API key

### 10. VITE_FRONTEND_FORGE_API_KEY
```
Key:   VITE_FRONTEND_FORGE_API_KEY
Value: your_frontend_key_here
```
⚠️ Replace with your actual frontend key

### 11. VITE_FRONTEND_FORGE_API_URL
```
Key:   VITE_FRONTEND_FORGE_API_URL
Value: https://api.manus.im
```

### 12. VITE_ANALYTICS_ENDPOINT
```
Key:   VITE_ANALYTICS_ENDPOINT
Value: https://analytics.manus.im
```

### 13. VITE_ANALYTICS_WEBSITE_ID
```
Key:   VITE_ANALYTICS_WEBSITE_ID
Value: your_website_id_here
```
⚠️ Replace with your actual website ID

### 14. VITE_APP_TITLE
```
Key:   VITE_APP_TITLE
Value: TrustLink
```

### 15. VITE_APP_LOGO
```
Key:   VITE_APP_LOGO
Value: https://your-logo-url.png
```
⚠️ Replace with your actual logo URL

---

## After Adding All Variables

Your screen should look like this:

```
┌────────────────────────────────────────────┐
│ Environment Variables:                     │
├────────────────────────────────────────────┤
│ Key                    │ Value              │
├────────────────────────────────────────────┤
│ NODE_ENV               │ production         │
│ VITE_APP_ID            │ your_app_id        │
│ JWT_SECRET             │ your_secret_key    │
│ OAUTH_SERVER_URL       │ https://api...     │
│ VITE_OAUTH_PORTAL_URL  │ https://portal...  │
│ OWNER_NAME             │ Your Name          │
│ OWNER_OPEN_ID          │ your_open_id       │
│ BUILT_IN_FORGE_API_URL │ https://api...     │
│ BUILT_IN_FORGE_API_KEY │ your_api_key       │
│ VITE_FRONTEND_FORGE... │ your_frontend_key  │
│ VITE_FRONTEND_FORGE... │ https://api...     │
│ VITE_ANALYTICS_ENDPOINT│ https://analytics..│
│ VITE_ANALYTICS_WEBSITE │ your_website_id    │
│ VITE_APP_TITLE         │ TrustLink          │
│ VITE_APP_LOGO          │ https://your-logo..│
└────────────────────────────────────────────┘
```

---

## Important Notes

### ⚠️ Values with Special Characters

If your value has special characters or spaces:
- Wrap it in quotes: `"value with spaces"`
- Example: `"My App Title"`

### ⚠️ Don't Share Secrets

Never share these values:
- `JWT_SECRET`
- `BUILT_IN_FORGE_API_KEY`
- `VITE_FRONTEND_FORGE_API_KEY`

### ✅ Placeholder Values

If you don't have all values yet:
1. Use placeholder values (like `placeholder_value`)
2. Deploy first
3. Update values later in Render dashboard

### ✅ Update Later

You can always update variables later:
1. Go to Render dashboard
2. Click your service
3. Click "Settings"
4. Click "Environment"
5. Edit values
6. Click "Save"

---

## Common Mistakes

### ❌ Mistake 1: Wrong Key Names
```
WRONG: vite_app_id (lowercase)
RIGHT: VITE_APP_ID (uppercase)
```

### ❌ Mistake 2: Missing Values
```
WRONG: VITE_APP_ID = (empty)
RIGHT: VITE_APP_ID = your_app_id
```

### ❌ Mistake 3: Extra Spaces
```
WRONG: VITE_APP_ID = " your_app_id " (spaces)
RIGHT: VITE_APP_ID = your_app_id (no spaces)
```

### ❌ Mistake 4: Quotes in Value
```
WRONG: VITE_APP_ID = "your_app_id" (quotes in value)
RIGHT: VITE_APP_ID = your_app_id (no quotes)
```

---

## Checklist

- [ ] NODE_ENV = production
- [ ] VITE_APP_ID = your_app_id
- [ ] JWT_SECRET = your_secret_key
- [ ] OAUTH_SERVER_URL = https://api.manus.im
- [ ] VITE_OAUTH_PORTAL_URL = https://portal.manus.im
- [ ] OWNER_NAME = Your Name
- [ ] OWNER_OPEN_ID = your_open_id
- [ ] BUILT_IN_FORGE_API_URL = https://api.manus.im
- [ ] BUILT_IN_FORGE_API_KEY = your_api_key
- [ ] VITE_FRONTEND_FORGE_API_KEY = your_frontend_key
- [ ] VITE_FRONTEND_FORGE_API_URL = https://api.manus.im
- [ ] VITE_ANALYTICS_ENDPOINT = https://analytics.manus.im
- [ ] VITE_ANALYTICS_WEBSITE_ID = your_website_id
- [ ] VITE_APP_TITLE = TrustLink
- [ ] VITE_APP_LOGO = https://your-logo-url.png

---

## Next Step

After adding all variables:

1. Click **"Create Database"** button
2. Choose **"MySQL"**
3. Follow the database setup

---

## Need Help?

If you're stuck:
1. Check the checklist above
2. Make sure all keys are uppercase
3. Make sure all values are filled
4. Take a screenshot and show me
5. I can help you fix it!

---

## Quick Reference

| Variable | Example Value | Required |
|----------|---------------|----------|
| NODE_ENV | production | ✅ Yes |
| VITE_APP_ID | abc123def456 | ✅ Yes |
| JWT_SECRET | abcdefgh... | ✅ Yes |
| OAUTH_SERVER_URL | https://api.manus.im | ✅ Yes |
| VITE_OAUTH_PORTAL_URL | https://portal.manus.im | ✅ Yes |
| OWNER_NAME | John Doe | ✅ Yes |
| OWNER_OPEN_ID | user123 | ✅ Yes |
| BUILT_IN_FORGE_API_URL | https://api.manus.im | ✅ Yes |
| BUILT_IN_FORGE_API_KEY | key123 | ✅ Yes |
| VITE_FRONTEND_FORGE_API_KEY | key456 | ✅ Yes |
| VITE_FRONTEND_FORGE_API_URL | https://api.manus.im | ✅ Yes |
| VITE_ANALYTICS_ENDPOINT | https://analytics.manus.im | ✅ Yes |
| VITE_ANALYTICS_WEBSITE_ID | web123 | ✅ Yes |
| VITE_APP_TITLE | TrustLink | ✅ Yes |
| VITE_APP_LOGO | https://logo.png | ✅ Yes |
