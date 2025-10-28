// Vercel serverless function wrapper for Express app
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database connection
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch(err => console.error('MongoDB connection error:', err));
}

// Import routes
app.use('/api/auth', require('../backend/routes/auth'));
app.use('/api/workers', require('../backend/routes/workers'));
app.use('/api/requests', require('../backend/routes/requests'));
app.use('/api/reviews', require('../backend/routes/reviews'));
app.use('/api/jobs', require('../backend/routes/jobs'));
app.use('/api/admin', require('../backend/routes/admin'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Export the Express app as a serverless function
module.exports = app;

