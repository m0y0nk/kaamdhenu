const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Request = require('../models/Request');
const Connection = require('../models/Connection');
const Payment = require('../models/Payment');

const router = express.Router();

// Create request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { workerId, listingType, price, duration, address, scheduledAt, message } = req.body;

    if (req.user.role !== 'CUSTOMER') {
      return res.status(403).json({ error: 'Only customers can create requests' });
    }

    const request = new Request({
      customerId: req.user._id,
      workerId,
      listingType,
      price,
      duration,
      address,
      scheduledAt,
      message,
      status: 'pending'
    });

    await request.save();

    res.status(201).json({ request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get requests (filtered by role)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, role } = req.query;
    const filter = {};

    if (req.user.role === 'WORKER') {
      filter.workerId = req.user._id;
    } else if (req.user.role === 'CUSTOMER') {
      filter.customerId = req.user._id;
    }

    if (status) filter.status = status;

    const requests = await Request.find(filter)
      .populate('customerId', 'name email phone')
      .populate('workerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single request
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('workerId', 'name email phone');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check authorization
    if (request.customerId._id.toString() !== req.user._id.toString() &&
        request.workerId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update request status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Authorization checks
    if (status === 'accepted' || status === 'cancelled') {
      if (request.workerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    }

    if (status === 'in_progress' || status === 'completed') {
      if (request.customerId.toString() !== req.user._id.toString() &&
          request.workerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    }

    request.status = status;
    request.updatedAt = Date.now();
    await request.save();

    res.json({ request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

