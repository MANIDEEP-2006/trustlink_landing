# Admin Setup Guide for TrustLink

This guide explains how to make yourself an admin on the TrustLink platform.

---

## What is Admin?

An admin user can:
- ✅ Access the admin dashboard
- ✅ View all verifications
- ✅ Search and filter verifications
- ✅ Export data
- ✅ Manage users
- ✅ View analytics
- ✅ Generate reports

---

## How Admin Role Works

In the database, there's a `role` field in the `users` table:

```
role = 'user'   → Regular user (can only see their own data)
role = 'admin'  → Admin user (can see all data and manage platform)
```

---

## Method 1: Using Render Shell (Easiest)

### Step 1: Get Your Email

You need to know your email address used for login.

### Step 2: Open Render Shell

1. Go to Render Dashboard
2. Click your **trustlink-landing** service
3. Click **"Shell"** tab
4. You'll see a command prompt

### Step 3: Connect to Database

Run this command to connect to MySQL:

```bash
mysql -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD $DATABASE_NAME
```

Or simpler (if DATABASE_URL is set):

```bash
mysql $DATABASE_URL
```

### Step 4: Check Your User

Run this query to find your user:

```sql
SELECT id, email, name, role FROM users WHERE email='your_email@example.com';
```

Example output:
```
+----+---------------------+----------+------+
| id | email               | name     | role |
+----+---------------------+----------+------+
| 1  | your_email@example.com | Your Name | user |
+----+---------------------+----------+------+
```

### Step 5: Make Yourself Admin

Run this command to update your role:

```sql
UPDATE users SET role='admin' WHERE email='your_email@example.com';
```

### Step 6: Verify

Run this to confirm:

```sql
SELECT id, email, role FROM users WHERE email='your_email@example.com';
```

You should see:
```
+----+---------------------+------+
| id | email               | role |
+----+---------------------+------+
| 1  | your_email@example.com | admin |
+----+---------------------+------+
```

### Step 7: Exit MySQL

Type: `exit`

---

## Method 2: Using Render Database Browser

### Step 1: Go to Database

1. Go to Render Dashboard
2. Click **trustlink-db** (MySQL database)
3. Click **"Browser"** tab

### Step 2: Find Users Table

1. Click **"users"** table
2. Find your row (by email)

### Step 3: Edit Role

1. Click the **"role"** cell
2. Change from `user` to `admin`
3. Click **"Save"**

---

## Method 3: Using Local MySQL Client

If you have MySQL installed locally:

```bash
# Connect to database
mysql -h your-render-host.mysql.render.com -u your_user -p your_password your_database

# Find your user
SELECT id, email, role FROM users WHERE email='your_email@example.com';

# Make yourself admin
UPDATE users SET role='admin' WHERE email='your_email@example.com';

# Verify
SELECT id, email, role FROM users WHERE email='your_email@example.com';
```

---

## Verify Admin Access

After making yourself admin:

1. Go to your TrustLink app
2. Log in with your account
3. You should see **Admin Dashboard** link
4. Click it to access admin features

If you don't see admin dashboard:
- Refresh the page
- Clear browser cache
- Log out and log back in

---

## Database Schema Reference

### Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Important Fields

| Field | Type | Purpose |
|-------|------|---------|
| `id` | INT | User ID (primary key) |
| `openId` | VARCHAR | OAuth identifier (unique) |
| `email` | VARCHAR | User email |
| `role` | ENUM | `user` or `admin` |
| `createdAt` | TIMESTAMP | Account creation date |
| `lastSignedIn` | TIMESTAMP | Last login date |

---

## Troubleshooting

### Can't Connect to Database

**Error:** `Access denied for user`

**Solution:**
1. Check DATABASE_URL is correct
2. Verify MySQL is running
3. Check credentials

### Can't Find Your User

**Error:** `No rows returned`

**Solution:**
1. Verify email is correct
2. Make sure you've logged in once (creates user record)
3. Check email case sensitivity

### Admin Dashboard Not Showing

**Error:** Dashboard link doesn't appear

**Solution:**
1. Verify role is `admin` in database
2. Clear browser cache
3. Log out and log back in
4. Check browser console for errors

### Multiple Users

If you have multiple users and want to make one admin:

```sql
-- Make specific user admin
UPDATE users SET role='admin' WHERE email='admin_email@example.com';

-- View all users
SELECT id, email, role FROM users;

-- Make all users admin (not recommended)
UPDATE users SET role='admin';
```

---

## Security Notes

⚠️ **Important:**
- Only make trusted people admins
- Admins can see all verification data
- Admins can export all data
- Change admin role if someone leaves

---

## Removing Admin Role

If you want to remove admin role:

```sql
UPDATE users SET role='user' WHERE email='your_email@example.com';
```

---

## Creating Additional Admins

To make another user admin:

1. They must log in once (creates user record)
2. Run: `UPDATE users SET role='admin' WHERE email='their_email@example.com';`
3. They log out and log back in
4. They now have admin access

---

## Quick Reference

### Make User Admin
```sql
UPDATE users SET role='admin' WHERE email='email@example.com';
```

### Remove Admin
```sql
UPDATE users SET role='user' WHERE email='email@example.com';
```

### View All Users
```sql
SELECT id, email, role FROM users;
```

### View All Admins
```sql
SELECT id, email FROM users WHERE role='admin';
```

### Count Users by Role
```sql
SELECT role, COUNT(*) as count FROM users GROUP BY role;
```

---

## Next Steps

1. ✅ Make yourself admin
2. ✅ Log in to verify admin access
3. ✅ Explore admin dashboard
4. ✅ Test all admin features
5. ✅ Invite other admins if needed

---

## Support

If you have issues:
1. Check this guide
2. Check RENDER_SETUP.md
3. Check application logs in Render
4. Check database in Render browser
