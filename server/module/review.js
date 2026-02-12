const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Prevent multiple reviews from same user on same item
reviewSchema.index({ user: 1, restaurant: 1 }, { unique: true, partialFilterExpression: { restaurant: { $exists: true } } });
reviewSchema.index({ user: 1, food: 1 }, { unique: true, partialFilterExpression: { food: { $exists: true } } });

module.exports = mongoose.model('Review', reviewSchema);
