const express = require('express');
const mongoose = require('mongoose');
const User = require('../module/user');
const Restaurant = require('../module/resturent');
const Food = require('../module/food');
const Category = require('../module/category');
const Offer = require('../module/offer');

const router = express.Router();

// Admin Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return res.status(500).json({ error: 'Server configuration error: Admin credentials not set' });
  }

  if (email === adminEmail && password === adminPassword) {
    res.status(200).json({ 
      token: 'admin-mock-token-12345', 
      admin: { email: adminEmail, role: 'super-admin' } 
    });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});

// Dashboard Summary Stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();
    const totalOffers = await Offer.countDocuments();
    const totalFoods = await Food.countDocuments();
    const totalCategories = await Category.countDocuments();
    
    // Recent Data (last 5)
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-passwordHash');
    const recentRestaurants = await Restaurant.find().sort({ createdAt: -1 }).limit(5);
    const recentOffers = await Offer.find().sort({ createdAt: -1 }).limit(5);
    const recentFoods = await Food.find().sort({ createdAt: -1 }).limit(5).populate('restaurant', 'name');
    const recentCategories = await Category.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      counts: {
        users: totalUsers,
        restaurants: totalRestaurants,
        offers: totalOffers,
        foods: totalFoods,
        categories: totalCategories,
        revenue: 125000 
      },
      recent: {
        users: recentUsers,
        restaurants: recentRestaurants,
        offers: recentOffers,
        foods: recentFoods,
        categories: recentCategories
      }
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    const dbState = mongoose.connection.readyState;
    res.status(500).json({ 
      error: error.message, 
      stack: error.stack,
      dbState: dbState === 1 ? 'Connected' : 'Disconnected (' + dbState + ')'
    });
  }
});

module.exports = router;
