const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    restaurantImage: {
      type: String, // image URL
      required: true
    },

    description: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },

    foodCategory: {
      type: String, // Pizza, Sushi, Burger etc.
      required: true
    },

    deliveryTime: {
      type: String, // e.g. "30-40 min"
    },

    googleMapsLink: {
      type: String,
      trim: true
    },

    location: {
      type: {
        type: String, 
        enum: ['Point'], 
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      },
      address: {
        type: String
      }
    },

    isOpen: {
      type: Boolean,
      default: true
    },
    offer: {
      type: String, // e.g. "50% OFF"
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
