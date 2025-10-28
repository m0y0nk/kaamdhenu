const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Mason', 'Carpenter', 'Cleaning', 'Cooking', 'Gardening', 'Delivery', 'Other']
  },
  skills: [{
    type: String
  }],
  description: {
    type: String
  },
  chargeType: {
    type: String,
    enum: ['hourly', 'daily', 'fixed', 'monthly'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  serviceArea: {
    type: String
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  availability: {
    type: String,
    enum: ['available', 'busy', 'unavailable'],
    default: 'available'
  },
  availabilitySlots: [{
    day: { type: String }, // Mon, Tue...
    from: { type: String }, // 09:00
    to: { type: String } // 18:00
  }],
  photos: [{
    type: String // Cloudinary URLs
  }],
  idProofImage: {
    type: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  languages: [{
    type: String
  }],
  listingType: {
    type: String,
    enum: ['on-demand', 'project', 'job'],
    default: 'on-demand'
  },
  proWorker: {
    type: Boolean,
    default: false
  },
  services: [{
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    description: { type: String },
    chargeType: { type: String, enum: ['hourly', 'daily', 'fixed', 'monthly'], required: true },
    price: { type: Number, required: true },
    duration: { type: String }, // e.g., 2 hours
    active: { type: Boolean, default: true }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);

