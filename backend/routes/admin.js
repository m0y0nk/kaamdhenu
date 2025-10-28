const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const Request = require('../models/Request');
const Payment = require('../models/Payment');

const router = express.Router();

// Get platform stats
router.get('/stats', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWorkers = await WorkerProfile.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'CUSTOMER' });
    const totalRequests = await Request.countDocuments();
    
    const payments = await Payment.find({ status: 'completed' });
    const totalRevenue = payments.reduce((sum, p) => sum + p.commissionAmount, 0);

    res.json({
      users: { total: totalUsers, workers: totalWorkers, customers: totalCustomers },
      requests: totalRequests,
      revenue: totalRevenue
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify worker
router.patch('/verifyWorker/:id', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try {
    const workerProfile = await WorkerProfile.findById(req.params.id);
    
    if (!workerProfile) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    workerProfile.verified = true;
    await workerProfile.save();

    res.json({ workerProfile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get('/users', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Block/Unblock user
router.patch('/users/:id', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isBlocked = isBlocked;
    await user.save();

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

