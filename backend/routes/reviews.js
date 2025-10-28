const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Review = require('../models/Review');
const Request = require('../models/Request');
const WorkerProfile = require('../models/WorkerProfile');

const router = express.Router();

// Create review
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { requestId, rating, comment } = req.body;

    if (req.user.role !== 'CUSTOMER') {
      return res.status(403).json({ error: 'Only customers can create reviews' });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (request.status !== 'completed') {
      return res.status(400).json({ error: 'Can only review completed requests' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ requestId });
    if (existingReview) {
      return res.status(400).json({ error: 'Review already exists for this request' });
    }

    const review = new Review({
      requestId,
      customerId: req.user._id,
      workerId: request.workerId,
      workerProfileId: request.workerId, // This needs to be proper workerProfileId
      rating,
      comment
    });

    await review.save();

    // Update worker rating
    const workerProfile = await WorkerProfile.findOne({ userId: request.workerId });
    if (workerProfile) {
      const reviews = await Review.find({ workerProfileId: workerProfile._id });
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      workerProfile.rating = (totalRating / reviews.length).toFixed(1);
      workerProfile.totalReviews = reviews.length;
      await workerProfile.save();
    }

    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reviews for worker
router.get('/worker/:workerId', async (req, res) => {
  try {
    const reviews = await Review.find({ workerId: req.params.workerId })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

