const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentType: {
    type: String,
    enum: ['transaction', 'connection', 'subscription', 'job_post'],
    required: true
  },
  gatewayId: {
    type: String // Razorpay order/payment ID
  },
  commissionAmount: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);

