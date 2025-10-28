const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fee: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Connection', connectionSchema);

