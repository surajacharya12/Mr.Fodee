const express = require('express');
const router = express.Router();
const Review = require('../module/review');
const Restaurant = require('../module/resturent');
const Food = require('../module/food');

// Post a review
router.post('/', async (req, res) => {
  try {
    const { user, restaurant, food, rating, comment } = req.body;

    if (!restaurant && !food) {
      return res.status(400).json({ error: 'Review must be for a restaurant or a food item' });
    }

    const review = new Review({ user, restaurant, food, rating, comment });
    await review.save();

    // Update average rating for restaurant or food
    if (restaurant) {
      const reviews = await Review.find({ restaurant });
      const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      await Restaurant.findByIdAndUpdate(restaurant, { rating: avgRating.toFixed(1) });
    }

    if (food) {
      const reviews = await Review.find({ food });
      const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      // Note: We need to add rating field to Food model if not present, which I will do in the next step
      await Food.findByIdAndUpdate(food, { rating: avgRating.toFixed(1) });
    }

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'You have already reviewed this item' });
    }
    res.status(400).json({ error: err.message });
  }
});

// Get reviews for a restaurant
router.get('/restaurant/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.id }).populate('user', 'username profilePictureUrl');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reviews for a food item
router.get('/food/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ food: req.params.id }).populate('user', 'username');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
