# Deploy KaamSetu on Vercel (Frontend + Backend)

This guide will help you deploy both the frontend and backend to Vercel as a single mono-repo deployment.

## Prerequisites

1. GitHub account
2. Vercel account
3. MongoDB Atlas account
4. Cloudinary account (optional, for media uploads)

## Step 1: Prepare the Repository

Your project is already set up for Vercel! The structure is:
```
kaamsetu/
├── frontend/     # React app
├── backend/      # Express API routes
├── api/          # Vercel serverless functions wrapper
├── vercel.json   # Vercel configuration
└── package.json
```

## Step 2: Push to GitHub

If you haven't already:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 3: Deploy on Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository (`kaamsetu`)
4. Vercel will detect the `vercel.json` configuration automatically

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

## Step 4: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

### Required Variables:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kaamsetu
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
FRONTEND_URL=https://your-app.vercel.app
```

### Platform Settings (Optional):
```
PLATFORM_COMMISSION_PERCENT=5
CONNECTION_FEE_AMOUNT=20
FREE_CONNECTIONS_PER_CUSTOMER=5
PRO_WORKER_PRICE=99
JOB_POST_FEE=300
ADMIN_EMAILS=admin@kaamsetu.in
```

### Frontend Variables (Auto-set):
```
VITE_API_URL=https://your-app.vercel.app/api
```

## Step 5: Update Build Settings

In Vercel Dashboard → Your Project → Settings → Build & Development Settings:

- **Framework Preset**: Other (or auto-detect)
- **Root Directory**: Leave empty (root)
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: Leave empty

## Step 6: Deploy!

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at `https://your-app.vercel.app`

## Step 7: Seed the Database

After deployment, you need to seed the database. You have two options:

### Option A: Run locally and point to production DB

```bash
# Set environment variables locally
export MONGO_URI="your-production-mongo-uri"

# Run seed script
cd backend
npm run seed
```

### Option B: Use Vercel CLI

```bash
# Install Vercel CLI if not already
npm i -g vercel

# Run the seed function
vercel dev
# In another terminal, trigger seed function manually or use MongoDB Atlas UI
```

## Architecture

### How It Works:

1. **Frontend**: Static React build served from `frontend/dist`
2. **API Routes**: Express routes deployed as Vercel serverless functions
3. **Database**: MongoDB Atlas (cloud-hosted)
4. **Media**: Cloudinary (cloud-hosted)

### Request Flow:

```
User Request → Vercel Edge Network
    ↓
Frontend (React) OR API Routes (Express)
    ↓
MongoDB Atlas / Cloudinary
    ↓
Response
```

## Monitoring

### View Logs:

1. Go to Vercel Dashboard
2. Select your project
3. Click "Logs" tab
4. View real-time logs

### View Analytics:

1. Go to Vercel Dashboard
2. Select your project
3. Click "Analytics" tab
4. View traffic, performance, etc.

## Troubleshooting

### Build Errors

**Issue**: Build fails with module not found
**Solution**: 
```bash
# Ensure all dependencies are in package.json
cd frontend && npm install
cd ../backend && npm install
git add package.json
git commit -m "Fix dependencies"
git push
```

### API Errors

**Issue**: 404 on `/api/*` routes
**Solution**: 
- Check `vercel.json` routing configuration
- Ensure API routes are in `/api` directory
- Verify environment variables are set

### Database Connection Errors

**Issue**: MongoDB connection timeout
**Solution**:
- Check `MONGO_URI` is correct
- Ensure MongoDB Atlas allows connections from anywhere (IP whitelist)
- Check if your database user has proper permissions

### CORS Errors

**Issue**: CORS errors in browser console
**Solution**:
- Update `FRONTEND_URL` environment variable to your actual Vercel URL
- Check CORS configuration in `backend/server.js`

## Custom Domain

To add a custom domain:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `kaamsetu.com`)
3. Follow DNS instructions
4. Wait for SSL certificate (automatic)

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment

## Cost Estimation

### Vercel (Free Tier):
- 100GB bandwidth
- 100GB build minutes
- Serverless functions included
- Automatic SSL

### MongoDB Atlas (Free Tier):
- 512MB storage
- Shared cluster
- Enough for MVP

### Cloudinary (Free Tier):
- 25GB storage
- 25GB bandwidth
- Video transformations limited

## Next Steps

1. ✅ Set up environment variables
2. ✅ Deploy to Vercel
3. ✅ Seed database
4. ✅ Test all features
5. ⬜ Add custom domain
6. ⬜ Set up monitoring/alerts
7. ⬜ Configure backups

## Support

For issues:
- Check Vercel [Documentation](https://vercel.com/docs)
- Check project README.md
- View logs in Vercel Dashboard

---

**Note**: Since we removed Razorpay, you won't need payment gateway keys. The payment button is currently a placeholder showing "Payments coming soon!"

