const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  salaryType: {
    type: String,
    enum: ['monthly', 'daily', 'fixed'],
    default: 'monthly'
  },
  location: {
    type: String,
    required: true
  },
  applicants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['open', 'filled', 'closed'],
    default: 'open'
  },
  requirements: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobPost', jobPostSchema);

