const mongoose = require('mongoose');

const favoritesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  }
}, {
  timestamps: true
});

favoritesSchema.index({ user: 1, food: 1 }, { unique: true });

module.exports = mongoose.model('Favorites', favoritesSchema);
