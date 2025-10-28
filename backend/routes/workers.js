const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { roleMiddleware } = require('../middleware/auth');
const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');
const Review = require('../models/Review');

const router = express.Router();

// Get my profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'WORKER') {
      return res.status(403).json({ error: 'Only workers can access this' });
    }
    const workerProfile = await WorkerProfile.findOne({ userId: req.user._id });
    if (!workerProfile) return res.status(404).json({ error: 'No profile found' });
    res.json({ workerProfile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Services: Add (must be before /:id route)
router.post('/services', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'WORKER') return res.status(403).json({ error: 'Only workers allowed' });
    const workerProfile = await WorkerProfile.findOne({ userId: req.user._id });
    if (!workerProfile) return res.status(404).json({ error: 'No profile found' });
    workerProfile.services.push(req.body);
    await workerProfile.save();
    res.status(201).json({ services: workerProfile.services });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Services: Update
router.put('/services/:serviceId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'WORKER') return res.status(403).json({ error: 'Only workers allowed' });
    const workerProfile = await WorkerProfile.findOne({ userId: req.user._id });
    if (!workerProfile) return res.status(404).json({ error: 'No profile found' });
    const service = workerProfile.services.id(req.params.serviceId);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    Object.assign(service, req.body);
    await workerProfile.save();
    res.json({ services: workerProfile.services });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Services: Delete
router.delete('/services/:serviceId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'WORKER') return res.status(403).json({ error: 'Only workers allowed' });
    const workerProfile = await WorkerProfile.findOne({ userId: req.user._id });
    if (!workerProfile) return res.status(404).json({ error: 'No profile found' });
    const service = workerProfile.services.id(req.params.serviceId);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    service.deleteOne();
    await workerProfile.save();
    res.json({ services: workerProfile.services });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get worker dashboard stats (must be before /:id route)
router.get('/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const workerProfile = await WorkerProfile.findOne({ userId: req.user._id });
    
    if (!workerProfile) {
      return res.status(404).json({ error: 'No profile found' });
    }

    const Request = require('../models/Request');
    const requests = await Request.find({ workerId: req.user._id });
    const completed = requests.filter(r => r.status === 'completed');
    const totalEarnings = completed.reduce((sum, r) => sum + (r.price || 0), 0);
    
    const stats = {
      totalRequests: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      accepted: requests.filter(r => r.status === 'accepted').length,
      completed: completed.length,
      totalEarnings,
      rating: workerProfile.rating,
      totalReviews: workerProfile.totalReviews
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all workers with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      listingType,
      minPrice,
      maxPrice,
      verified,
      minRating,
      availability,
      search,
      limit = 20,
      skip = 0
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (listingType) filter.listingType = listingType;
    if (verified !== undefined) filter.verified = verified === 'true';
    if (availability) filter.availability = availability;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    if (search) {
      filter.$or = [
        { displayName: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const workers = await WorkerProfile.find(filter)
      .populate('userId', 'name email phone')
      .sort({ verified: -1, rating: -1, proWorker: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await WorkerProfile.countDocuments(filter);

    res.json({ workers, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single worker
router.get('/:id', async (req, res) => {
  try {
    const worker = await WorkerProfile.findById(req.params.id)
      .populate('userId', 'name email phone');

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const reviews = await Review.find({ workerProfileId: worker._id })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ worker, reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create/Update worker profile
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 'WORKER') {
      return res.status(403).json({ error: 'Only workers can create profiles' });
    }

    let workerProfile = await WorkerProfile.findOne({ userId });

    if (workerProfile) {
      Object.assign(workerProfile, req.body);
      await workerProfile.save();
    } else {
      workerProfile = new WorkerProfile({ userId, ...req.body });
      await workerProfile.save();
    }

    res.json({ workerProfile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update worker profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const workerProfile = await WorkerProfile.findById(req.params.id);

    if (!workerProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (workerProfile.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    Object.assign(workerProfile, req.body);
    await workerProfile.save();

    res.json({ workerProfile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

