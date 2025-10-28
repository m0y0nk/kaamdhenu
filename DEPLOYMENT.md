# Deployment Guide for KaamSetu

This guide will help you deploy KaamSetu to production.

## Prerequisites

1. GitHub account
2. MongoDB Atlas account
3. Cloudinary account
5. Vercel account (for frontend)
6. Render or Railway account (for backend)

## Backend Deployment (Render/Railway)

### Step 1: Prepare Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Ensure all dependencies are listed in `package.json`

### Step 2: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" > "Web Service"
3. Connect your GitHub repository
4. Select the `kaamsetu` repository
5. Configure the service:
   - **Name**: kaamsetu-backend
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. Add environment variables (see `.env.example`):
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret
   CLOUDINARY_URL=cloudinary://...
   PLATFORM_COMMISSION_PERCENT=5
   CONNECTION_FEE_AMOUNT=20
   FREE_CONNECTIONS_PER_CUSTOMER=5
   PRO_WORKER_PRICE=99
   JOB_POST_FEE=300
   ADMIN_EMAILS=admin@kaamsetu.in
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
7. Click "Create Web Service"
8. Wait for deployment to complete
9. Copy the backend URL (e.g., `https://kaamsetu-backend.onrender.com`)

### Step 3: Deploy to Railway (Alternative)

1. Go to [Railway Dashboard](https://railway.app)
2. Click "New Project" > "Deploy from GitHub"
3. Select the `kaamsetu` repository
4. Set Root Directory to `backend`
5. Add environment variables
6. Railway will automatically detect and deploy

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Create `.env.production` file:
```env
VITE_API_URL=https://kaamsetu-backend.onrender.com
```

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables:
   ```
   VITE_API_URL=https://kaamsetu-backend.onrender.com
   ```
6. Click "Deploy"
7. Wait for deployment to complete
8. Update your backend `FRONTEND_URL` in Render to your Vercel URL

## Database Setup (MongoDB Atlas)

### Step 1: Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier is fine)
3. Wait for cluster to be created

### Step 2: Configure Access

1. Click "Connect" > "Connect your application"
2. Select "Node.js" and copy the connection string
3. Add your database user credentials
4. Replace `<password>` with your actual password
5. Update `MONGO_URI` in your backend environment variables

### Step 3: Seed Database

1. SSH into your Render instance or run locally:
```bash
cd backend
npm run seed
```

## Media Storage Setup (Cloudinary)

### Step 1: Create Account

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free account
3. Go to Dashboard > Account Details
4. Copy the Cloudinary URL

### Step 2: Configure

Add `CLOUDINARY_URL` to your backend environment variables in Render.

## Payment Integration

Payments are planned for a future milestone. The UI includes a non-functional button for demo purposes.

## Map Integration

Map features are deferred for now.

## Testing Production

### 1. Test Authentication
- Register new users
- Login flow
- Protected routes

### 2. Test Worker Features
- Create worker profile
- Upload photos
- Update availability

### 3. Test Customer Features
- Search workers
- Send requests
- View worker profiles

### 4. Test Payments
- Payment button is a placeholder (no-op)

### 5. Test Admin
- Access admin panel
- View statistics
- Verify workers

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected
- [ ] Environment variables configured
- [ ] Seed data loaded
- [ ] Authentication working
- [ ] Worker profiles working
- [ ] Customer search working
- [ ] Payment integration working
- [ ] Webhook configured
- [ ] Admin panel accessible
- [ ] SSL certificates configured
- [ ] Domain configured (optional)

## Monitoring

### Backend Logs (Render)
1. Go to Render Dashboard
2. Select your service
3. View "Logs" tab

### Frontend Analytics (Vercel)
1. Go to Vercel Dashboard
2. Select your project
3. View "Analytics" tab

### Database Monitoring (MongoDB Atlas)
1. Go to Atlas Dashboard
2. Monitor cluster metrics
3. Set up alerts

## Troubleshooting

### Backend Issues
- Check environment variables
- Review error logs
- Verify database connection
- Check rate limiting

### Frontend Issues
- Check API URL
- Verify CORS settings
- Review browser console
- Check network requests

### Payment Issues
- Verify Razorpay keys
- Check webhook signature
- Review payment logs
- Test with test cards

## Support

For issues or questions:
- Check the README.md
- Review code comments
- Open an issue on GitHub

