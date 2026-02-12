// routes/food.js
const express = require('express');
const router = express.Router();
const Food = require('../module/food');

// Create a new food item
router.post('/', async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all food items (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { restaurant, category } = req.query;
    let query = {};
    
    if (restaurant) query.restaurant = restaurant;
    if (category) {
      const mongoose = require('mongoose');
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        // Find category by name if a string is passed
        const Category = require('../module/category');
        const catDoc = await Category.findOne({ name: { $regex: new RegExp(category, 'i') } });
        if (catDoc) query.category = catDoc._id;
        else query.category = null; // No results if category name doesn't exist
      }
    }

    const foods = await Food.find(query)
      .populate('restaurant', 'name location rating restaurantImage')
      .populate('category')
      .sort({ createdAt: -1 });
      
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single food item by ID
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('restaurant').populate('category');
    if (!food) return res.status(404).json({ error: 'Food not found' });
    res.json(food);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a food item by ID
router.put('/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!food) return res.status(404).json({ error: 'Food not found' });
    res.json(food);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a food item by ID
router.delete('/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ error: 'Food not found' });
    res.json({ message: 'Food deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
