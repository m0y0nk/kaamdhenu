const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const JobPost = require('../models/JobPost');
const User = require('../models/User');

const router = express.Router();

// Create job post (business)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, category, salary, salaryType, location, requirements } = req.body;

    const jobPost = new JobPost({
      employerId: req.user._id,
      title,
      description,
      category,
      salary,
      salaryType,
      location,
      requirements
    });

    await jobPost.save();
    res.status(201).json({ jobPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all job posts
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    const jobs = await JobPost.find(filter)
      .populate('employerId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id)
      .populate('employerId', 'name email phone company');

    res.json({ job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply for job
router.post('/:id/apply', authMiddleware, async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const existingApplication = job.applicants.find(
      app => app.userId.toString() === req.user._id.toString()
    );

    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied for this job' });
    }

    job.applicants.push({ userId: req.user._id });
    await job.save();

    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

