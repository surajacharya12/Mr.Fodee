const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    subtitle: {
      type: String
    },

    offerType: {
      type: String,
      enum: ['discount', 'freeDelivery', 'express', 'newUser'],
      required: true
    },

    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      default: null
    },

    discountValue: {
      type: Number,
      default: null
    },

    couponCode: {
      type: String,
      uppercase: true
    },

    minOrderAmount: {
      type: Number,
      default: 0
    },

    deliveryTime: {
      type: Number, // for 30 min express type
      default: null
    },

    gradientFrom: {
      type: String, // ex: #ff7e5f
      required: true
    },

    gradientTo: {
      type: String, // ex: #feb47b
      required: true
    },

    icon: {
      type: String // icon name (percent, truck, clock, star)
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      default: null
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Offer', offerSchema);
