const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const Request = require('../models/Request');
const Review = require('../models/Review');
const JobPost = require('../models/JobPost');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await WorkerProfile.deleteMany({});
    await Request.deleteMany({});
    await Review.deleteMany({});
    await JobPost.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 10);

    // Create users
    const users = [
      { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543210', role: 'WORKER', isVerified: true },
      { name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543211', role: 'WORKER', isVerified: true },
      { name: 'Amit Patel', email: 'amit@example.com', phone: '9876543212', role: 'WORKER', isVerified: false },
      { name: 'Anita Devi', email: 'anita@example.com', phone: '9876543213', role: 'WORKER', isVerified: true },
      { name: 'Vikash Singh', email: 'vikash@example.com', phone: '9876543214', role: 'WORKER', isVerified: false },
      { name: 'Suresh Yadav', email: 'suresh@example.com', phone: '9876543215', role: 'WORKER', isVerified: true },
      { name: 'Meera Iyer', email: 'meera@example.com', phone: '9876543216', role: 'WORKER', isVerified: true },
      { name: 'Kiran Reddy', email: 'kiran@example.com', phone: '9876543217', role: 'WORKER', isVerified: true },
      { name: 'Customer One', email: 'customer1@example.com', phone: '9800000001', role: 'CUSTOMER' },
      { name: 'Customer Two', email: 'customer2@example.com', phone: '9800000002', role: 'CUSTOMER' },
      { name: 'Customer Three', email: 'customer3@example.com', phone: '9800000003', role: 'CUSTOMER' },
      { name: 'Customer Four', email: 'customer4@example.com', phone: '9800000004', role: 'CUSTOMER' },
      { name: 'Business Corp', email: 'business@example.com', phone: '9900000001', role: 'CUSTOMER' },
      { name: 'Admin User', email: 'admin@kaamsetu.in', phone: '9999999999', role: 'ADMIN' }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = new User({ ...userData, passwordHash });
      await user.save();
      createdUsers.push(user);
    }

    // Create worker profiles
    const categories = ['Plumber', 'Electrician', 'Carpenter', 'Cleaning', 'Cooking', 'Gardening', 'Painter', 'Delivery'];
    const workers = createdUsers.filter(u => u.role === 'WORKER');
    
    const workerProfiles = [];
    for (let i = 0; i < workers.length; i++) {
      const categoriesList = ['hourly', 'daily', 'fixed', 'monthly'];
      const listingTypes = ['on-demand', 'project', 'job'];
      
      const profile = new WorkerProfile({
        userId: workers[i]._id,
        displayName: workers[i].name,
        category: categories[i % categories.length],
        skills: ['Skill 1', 'Skill 2', 'Skill 3'].map(s => `${categories[i % categories.length]} ${s}`),
        description: `Experienced ${categories[i % categories.length]} with 5+ years of experience.`,
        chargeType: categoriesList[i % categoriesList.length],
        price: [500, 800, 1000, 1200, 1500][i % 5],
        serviceArea: 'Delhi',
        location: { lat: 28.6139 + Math.random() * 0.1, lng: 77.2090 + Math.random() * 0.1, address: 'Delhi, India' },
        availability: ['available', 'busy'][i % 2],
        photos: [`https://picsum.photos/400?random=${i}`],
        verified: [true, true, false, true, false, true, true, true][i],
        rating: (3 + Math.random() * 2).toFixed(1),
        totalReviews: Math.floor(Math.random() * 20) + 5,
        languages: ['Hindi', 'English'],
        listingType: listingTypes[i % listingTypes.length]
      });
      await profile.save();
      workerProfiles.push(profile);
    }

    // Create requests
    const customers = createdUsers.filter(u => u.role === 'CUSTOMER');
    
    for (let i = 0; i < 10; i++) {
      const customer = customers[i % customers.length];
      const worker = workers[i % workers.length];
      
      const request = new Request({
        customerId: customer._id,
        workerId: worker._id,
        listingType: ['on-demand', 'project', 'job'][i % 3],
        price: [500, 800, 1000, 1200, 1500][i % 5],
        duration: `${i + 1} hours`,
        status: ['pending', 'accepted', 'in_progress', 'completed'][i % 4],
        scheduledAt: new Date(Date.now() + i * 86400000),
        address: {
          street: `Street ${i + 1}`,
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001',
          full: `Street ${i + 1}, Delhi - 110001`
        },
        message: `Need help with service ${i + 1}`
      });
      await request.save();
    }

    // Create reviews
    const completedRequests = await Request.find({ status: 'completed' });
    
    for (let i = 0; i < Math.min(completedRequests.length, 12); i++) {
      const request = completedRequests[i];
      const workerProfile = await WorkerProfile.findOne({ userId: request.workerId });
      
      const review = new Review({
        requestId: request._id,
        customerId: request.customerId,
        workerId: request.workerId,
        workerProfileId: workerProfile?._id,
        rating: Math.floor(Math.random() * 3) + 3,
        comment: `Great service! ${i + 1}`
      });
      await review.save();
    }

    // Create job posts
    const businesses = customers.filter((_, i) => i < 3);
    
    for (let i = 0; i < 4; i++) {
      const business = businesses[i % businesses.length];
      
      const job = new JobPost({
        employerId: business._id,
        title: `Job Title ${i + 1}`,
        description: `Job description for position ${i + 1}`,
        category: categories[i % categories.length],
        salary: [15000, 20000, 25000][i % 3],
        salaryType: 'monthly',
        location: 'Delhi',
        requirements: ['Experience required', 'Skills needed'],
        status: 'open'
      });
      await job.save();
    }

    console.log('Seed data created successfully!');
    console.log(`Users: ${createdUsers.length}`);
    console.log(`Worker Profiles: ${workerProfiles.length}`);
    console.log('Seed completed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

