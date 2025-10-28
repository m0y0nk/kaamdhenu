# KaamSetu - Worker Marketplace Platform

KaamSetu is a simple, accessible web marketplace that connects informal workers (vendors, domestic workers, artisans, gig workers) with customers and businesses. The platform enables workers to create profiles, showcase their skills, and connect with customers seeking their services, while also providing businesses with a hiring pipeline for their job needs.

## Key Users

- **Worker**: Informal workers who offer services (plumbers, electricians, domestic help, artisans, etc.)
- **Customer**: Individuals or families seeking service providers
- **Admin**: Platform administrators managing verification, analytics, and moderation

## MVP Scope

### Core Features
- User authentication with JWT (Worker, Customer, Admin roles)
- Worker profile creation with skills, pricing, photos, and verification
- Customer search with filters (category, distance, price, rating, availability)
- Request and booking flow with status management
- Ratings and reviews system
- Payment button placeholder (integration coming soon)
- Commission tracking (connection fees, transaction fees, subscriptions)
- Business job postings and applicant tracking
- Admin panel for verification and analytics

### Deployment Plan
- **Frontend**: React app deployed on Vercel
- **Backend**: Express.js REST API on Render or Railway
- **Database**: MongoDB Atlas
- **Media Storage**: Cloudinary
 

## Tech Stack

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS
- react-hook-form
- React Router DOM
- shadcn/ui components

### Backend
- Node.js with Express.js
- Mongoose for MongoDB ORM
- JWT-based authentication
- Cloudinary for media uploads

### Services
- MongoDB Atlas (database)
- Cloudinary (media storage)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
 

### Installation

1. Clone the repository or create a new directory:
```bash
mkdir kaamsetu && cd kaamsetu
```

2. Install dependencies for all packages:
```bash
cd backend && npm install
cd ../frontend && npm install
```

3. Set up environment variables:

**Backend (.env)**:
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
```

**Frontend (.env)**:
```bash
cd frontend  
cp .env.example .env
# Edit .env with your API URL
```

4. Start development servers:

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

5. Seed the database with sample data:
```bash
cd backend
npm run seed
```

Now visit:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Test Credentials
After seeding, you can login with:
- Email: `rajesh@example.com` (Worker)
- Email: `customer1@example.com` (Customer)
- Email: `admin@kaamsetu.in` (Admin)
- Password: `password123` (for all)

## Project Structure

```
kaamsetu/
├── backend/          # Express.js API server
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API route handlers
│   ├── middleware/   # Auth & validation
│   ├── controllers/ # Business logic
│   ├── utils/       # Helpers
│   └── seeds/       # Seed data
├── frontend/        # React + Vite app
│   ├── src/
│   │   ├── pages/   # Page components
│   │   ├── components/ # Reusable components
│   │   ├── hooks/   # Custom React hooks
│   │   ├── utils/   # Utilities
│   │   └── context/ # React context
│   └── public/
├── README.md
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Workers
- `GET /api/workers` - List workers with filters
- `GET /api/workers/:id` - Get worker details
- `POST /api/workers` - Create/update worker profile
- `PUT /api/workers/:id` - Update worker profile

### Requests
- `POST /api/requests` - Create new request
- `GET /api/requests` - List requests (filtered by role)
- `PATCH /api/requests/:id/status` - Update request status
- `GET /api/requests/:id` - Get request details

### Reviews
- `POST /api/reviews` - Add review for worker
- `GET /api/workers/:id/reviews` - Get worker reviews

### Payments
- (Deferred) Payment integration planned

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `PATCH /api/admin/verifyWorker/:id` - Verify worker
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id` - Block/unblock user

### Jobs (Business)
- `POST /api/jobs` - Create job post
- `GET /api/jobs` - List job posts
- `POST /api/jobs/:id/apply` - Apply for job

## Environment Variables

### Backend (.env)
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
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## Commission Models

1. **Connection Fee**: Customers pay small fee (₹20) after 5 free contacts
2. **Transaction Commission**: Platform takes 5% of each completed job
3. **Worker Subscription**: Optional monthly plan (₹99) for verification & boosted visibility
4. **Job Post Fee**: Businesses pay for job postings after first free post

## Testing

```bash
cd backend && npm test
cd frontend && npm test
```

## Deployment

### Deploy Everything on Vercel

KaamSetu can be deployed entirely on Vercel as a mono-repo:

1. **Push to GitHub**:
```bash
git add .
git commit -m "Prepare for Vercel"
git push origin main
```

2. **Import on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration

3. **Add Environment Variables** in Vercel Dashboard → Settings → Environment Variables:
   - `MONGO_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Your JWT secret key
   - `JWT_REFRESH_SECRET` - Your refresh token secret
   - `CLOUDINARY_URL` - Cloudinary credentials (optional)
   - `FRONTEND_URL` - Your Vercel deployment URL

4. **Deploy**: Click "Deploy" and wait for build to complete

For detailed instructions, see [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)

### Alternative: Separate Deployments

If you prefer separate deployments:

**Frontend (Vercel)**:
```bash
cd frontend
vercel deploy
```

**Backend (Render/Railway)**:
1. Connect your GitHub repository
2. Set environment variables
3. Deploy

## How to Present to Judges

### Key Selling Points
1. **Accessibility**: Mobile-first design with clear UI for low-literacy users
2. **Trust Signals**: Verified badge system, ratings, and review system
3. **Economic Impact**: Direct connection between workers and customers
4. **Scalable**: Supports multiple revenue streams (connection fees, commissions, subscriptions)
5. **Payments Placeholder**: Payment button in UI; integration planned next

### Demo Flow
1. Show worker onboarding (3-step process)
2. Search and filter workers
3. Send request from customer side
4. Accept/decline from worker dashboard
5. Complete payment flow
6. Show admin verification panel

### Technical Highlights
- Clean code with TypeScript for type safety
- JWT-based authentication with refresh tokens
- Payments integration planned (placeholder in UI)
- Cloudinary for optimized media uploads
- Responsive design with Tailwind CSS
- Comprehensive API documentation

## License

MIT

