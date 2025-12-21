# Netlify Deployment Guide

This application is configured and ready for production deployment on Netlify.

## Prerequisites

1. **GitHub Repository**: Push your code to a GitHub repository
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **Environment Variables** (Optional): If you want to persist attendance data in a database

## Deployment Steps

### Step 1: Connect Your Repository

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Select GitHub and authorize Netlify
4. Choose your repository
5. Click "Deploy"

Netlify will automatically:

- Detect the `netlify.toml` configuration
- Set the build command to `pnpm run build`
- Deploy the frontend to `dist/spa`
- Deploy serverless functions to `netlify/functions`

### Step 2: Configure Environment Variables (Optional)

To enable persistent attendance data storage with a PostgreSQL database:

1. Go to your site settings → "Build & deploy" → "Environment"
2. Add the following environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Your PostgreSQL connection string

For example, if using **Neon**:

```
postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

Or **Supabase**:

```
postgresql://user.email@supabase.co:password@db.supabase.co:5432/postgres
```

### Step 3: Deploy

Once you push changes to your repository, Netlify will automatically:

1. Build the frontend React app
2. Bundle the backend Express server for serverless functions
3. Deploy everything to a production URL

## Features

✅ **Frontend**: React SPA deployed as static files
✅ **Backend**: Express server deployed as Netlify Functions
✅ **API Routes**: All `/api/*` requests routed to serverless functions
✅ **Database**: Optional PostgreSQL integration for data persistence
✅ **Automatic Redirects**: SPA routing handled with automatic redirects to `index.html`

## Architecture

- **Frontend**: `dist/spa/` (React SPA)
- **API Backend**: `netlify/functions/api.ts` (Express wrapped in serverless function)
- **Database**: Optional - PostgreSQL via connection string

## Database

### Without Database (Default)

The app works perfectly without a database:

- Attendance data stored in browser's localStorage
- Data persists per browser session
- Perfect for demo/testing

### With Database (Optional)

Connect a PostgreSQL database for:

- Data persistence across sessions
- Multi-user support
- Data synchronization

**Recommended providers**:

- [Neon](https://neon.tech) - Serverless Postgres
- [Supabase](https://supabase.com) - Postgres + Auth + APIs
- [AWS RDS](https://aws.amazon.com/rds/) - Managed Postgres

## Monitoring

View logs and monitor your site:

1. Go to your site in Netlify dashboard
2. Click "Deploys" to see build logs
3. Click "Functions" to monitor API calls
4. Check "Analytics" for traffic data

## Troubleshooting

### Build Fails

- Check build logs in Netlify dashboard
- Ensure all dependencies are installed locally: `pnpm install`
- Run local build test: `pnpm run build`

### API Endpoints Not Working

- Check that database is configured if needed
- Review function logs in Netlify dashboard
- Ensure `/api/*` routes match your backend endpoints

### Attendance Data Not Saving

- If using database: verify DATABASE_URL is set correctly
- Check browser console for API errors
- Without database: data is stored in localStorage (browser-specific)

## Local Testing

To test the exact Netlify environment locally:

```bash
# Install dependencies
pnpm install

# Build for production
pnpm run build

# Start production server
pnpm start
```

## Production Checklist

- [ ] Push code to GitHub
- [ ] Connect GitHub repository to Netlify
- [ ] Configure DATABASE_URL if using database
- [ ] Test login/dashboard functionality
- [ ] Monitor initial deploy in Netlify dashboard
- [ ] Check analytics after launch

## Support

- **Netlify Docs**: https://docs.netlify.com
- **Build Configuration**: See `netlify.toml`
- **Function Configuration**: See `netlify/functions/api.ts`
- **Environment Variables**: https://docs.netlify.com/configure-builds/file-based-configuration/#environment
