# TrustLink Deployment Guide

## Overview

TrustLink is a complete identity verification platform with AI-powered features, QR code generation, PDF reporting, and admin dashboard. This guide covers deployment, setup, and configuration.

## Prerequisites

- Node.js 22.x or higher
- pnpm package manager
- MySQL/TiDB database
- Environment variables configured

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# OAuth
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# JWT
JWT_SECRET=your_jwt_secret_key

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
```

## Installation

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm db:push

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## Project Structure

```
trustlink_landing/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities and helpers
│   │   ├── App.tsx        # Main router
│   │   └── index.css      # Global styles
│   └── public/            # Static assets
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # Main router
│   ├── verificationRouter.ts  # Verification procedures
│   ├── adminRouter.ts     # Admin procedures
│   ├── aiRouter.ts        # AI features
│   ├── db.ts              # Database helpers
│   ├── uploadHandler.ts   # File upload logic
│   ├── aiFeatures.ts      # Mock AI implementations
│   ├── pdfGenerator.ts    # PDF generation
│   └── _core/             # Framework internals
├── drizzle/               # Database schema
│   ├── schema.ts          # Table definitions
│   └── migrations/        # Migration files
├── shared/                # Shared types
└── storage/               # S3 storage helpers
```

## Key Features

### 1. Identity Verification
- Document upload with OCR extraction
- Selfie capture with face matching
- Fraud detection analysis
- Trust score calculation
- Verification status (verified/rejected/pending/expired)

### 2. QR Code System
- Auto-generated unique verification codes
- QR code linking to public lookup page
- Scan tracking and expiration management
- Public verification lookup (no auth required)

### 3. PDF Reports
- Comprehensive verification reports
- QR code embedded in PDF
- User details and verification results
- Download from verification result page

### 4. Admin Dashboard
- Real-time statistics (total verifications, verified, rejected, etc.)
- Verification table with filtering and search
- User management with role-based access
- High-risk verification alerts
- CSV export functionality
- Pagination support

### 5. AI Features (Mock)
- OCR data extraction from documents
- Face matching between document and selfie
- Fraud detection analysis
- Trust score calculation
- Verification summary generation

## API Endpoints

### Verification Routes
- `POST /api/trpc/verification.create` - Create verification
- `GET /api/trpc/verification.getById` - Get verification details
- `GET /api/trpc/verification.lookupByCode` - Public QR lookup
- `GET /api/trpc/verification.downloadPDF` - Download PDF report

### Admin Routes
- `GET /api/trpc/admin.getStats` - Dashboard statistics
- `GET /api/trpc/admin.getVerifications` - List verifications with filters
- `GET /api/trpc/admin.getUsers` - List users with search
- `GET /api/trpc/admin.getHighRiskVerifications` - Fraud alerts
- `GET /api/trpc/admin.exportVerifications` - CSV export

### AI Routes
- `POST /api/trpc/ai.processDocument` - OCR extraction
- `POST /api/trpc/ai.matchFace` - Face matching
- `POST /api/trpc/ai.detectFraud` - Fraud detection
- `POST /api/trpc/ai.calculateScore` - Trust score calculation
- `POST /api/trpc/ai.processVerification` - Complete verification

## Database Schema

### Users Table
- id, openId, name, email, phoneNumber
- loginMethod, role (admin/user)
- createdAt, updatedAt, lastSignedIn

### Verifications Table
- id, userId, status (verified/rejected/pending/expired)
- trustScore, documentType, faceMatchScore
- fraudDetectionResult, fraudConfidence
- ocrData, qrCode, verificationCode
- validityDays, expiresAt, completedAt

### QR Codes Table
- id, verificationId, userId
- qrCodeData, verificationCode
- scans, lastScannedAt, createdAt

### Verification Lookup Table
- id, verificationId, userId
- verificationCode, userName, userEmail, userPhone
- status, trustScore, documentType, faceMatchScore
- fraudDetected, verifiedAt, expiresAt

## User Roles

### Admin Role
- Access admin dashboard at `/admin`
- View all verifications and users
- Filter and search verifications
- Export verification data
- View fraud detection alerts
- Manage user accounts

### User Role
- Complete verification workflow
- View own verification results
- Download personal verification reports
- Share QR codes
- Access public verification lookup

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test server/verification.test.ts
```

## Deployment

### To Manus Platform
1. Create a checkpoint via Management UI
2. Click "Publish" button in Management UI
3. Configure custom domain if needed
4. Enable SSL/TLS

### To External Hosting
The project can be deployed to any Node.js hosting platform:

1. Build the project: `pnpm build`
2. Deploy `dist/` folder and client build
3. Set environment variables on hosting platform
4. Run database migrations
5. Start the server

## Performance Optimization

- Enable caching for QR code lookups
- Use CDN for static assets
- Implement database indexing on frequently queried fields
- Use connection pooling for database
- Enable gzip compression

## Security

- All admin routes require admin role
- Verification lookup is public (no auth required)
- Passwords hashed with bcrypt
- JWT tokens for session management
- CORS configured for API access
- SQL injection prevention via Drizzle ORM
- XSS protection via React

## Monitoring

- Check application logs in `.manus-logs/`
- Monitor database performance
- Track verification success rates
- Monitor API response times
- Alert on fraud detection spikes

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database server is running
- Ensure user has proper permissions
- Run migrations: `pnpm db:push`

### OAuth Not Working
- Verify VITE_APP_ID is correct
- Check OAUTH_SERVER_URL is accessible
- Ensure redirect URLs are configured
- Check browser console for errors

### File Upload Issues
- Verify S3 credentials are correct
- Check file size limits (10MB default)
- Ensure file types are supported
- Check storage permissions

### Admin Dashboard Not Loading
- Verify user has admin role
- Check database connection
- Ensure admin router is registered
- Check browser console for errors

## Support

For issues or questions:
1. Check the logs in `.manus-logs/`
2. Review the README.md in project root
3. Check test files for usage examples
4. Contact support at support@trustlink.com

## License

TrustLink © 2024. All rights reserved.
