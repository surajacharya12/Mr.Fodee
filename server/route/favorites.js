const express = require('express');
const router = express.Router();
const Favorites = require('../module/favorites');

// ✅ Add to favorites
router.post('/', async (req, res) => {
  try {
    const { user, food } = req.body;

    const favorite = new Favorites({ user, food });
    await favorite.save();

    res.status(201).json(favorite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ✅ Get all favorites of a user
router.get('/:userId', async (req, res) => {
  try {
    const favorites = await Favorites.find({ user: req.params.userId })
      .populate({
        path: 'food',
        populate: {
          path: 'restaurant',
          select: 'name'
        }
      });

    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Remove from favorites
router.delete('/', async (req, res) => {
  try {
    const { user, food } = req.body;

    const favorite = await Favorites.findOneAndDelete({ user, food });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Toggle favorite (BEST METHOD)
router.post('/toggle', async (req, res) => {
  try {
    const { user, food } = req.body;

    const existing = await Favorites.findOne({ user, food });

    if (existing) {
      await Favorites.deleteOne({ user, food });
      return res.json({ message: 'Removed from favorites', favorited: false });
    }

    await Favorites.create({ user, food });
    res.json({ message: 'Added to favorites', favorited: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
