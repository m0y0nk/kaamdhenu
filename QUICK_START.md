# KaamSetu - Quick Start Guide

## Get Running in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier works)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure Environment

**Backend `.env`:**
```env
MONGO_URI=mongodb+srv://your-cluster-uri
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_URL=cloudinary://your-credentials
FRONTEND_URL=http://localhost:5173
PORT=5000
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000
```

### Step 3: Seed Database

```bash
cd backend
npm run seed
```

This creates:
- 8 workers
- 6 customers
- 4 job posts
- 10 requests
- 12 reviews

### Step 4: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Test the App

Visit: http://localhost:5173

**Login as Worker:**
- Email: `rajesh@example.com`
- Password: `password123`

**Login as Customer:**
- Email: `customer1@example.com`
- Password: `password123`

**Login as Admin:**
- Email: `admin@kaamsetu.in`
- Password: `password123`

## Test Scenarios

### As Customer:
1. Search for workers
2. Apply filters (category, price, rating)
3. View worker profile
4. Send request

### As Worker:
1. Login to dashboard
2. View incoming requests
3. Accept/decline requests
4. Update availability

### As Admin:
1. View platform stats
2. Verify workers
3. Manage users

## Common Issues

### MongoDB Connection Error
- Check your MONGO_URI format
- Ensure network access is enabled in MongoDB Atlas
- Verify database user credentials

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- [ ] Configure Cloudinary for media uploads
- [ ] Get Razorpay test keys for payments
- [ ] Set up Mapbox for location features
- [ ] Deploy to production (see DEPLOYMENT.md)

## Need Help?

- Check README.md for detailed documentation
- Review PROJECT_SUMMARY.md for feature overview
- See DEPLOYMENT.md for production deployment
- Read JUDGE_PRESENTATION.md for demo flow

Happy coding! 🚀

