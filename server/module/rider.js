const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['Bike', 'Car', 'Scooter'],
    required: true
  },
  licenseNumber: {
    type: String,
    required: true
  },
  documents: {
    licenseImage: String,
    photoPath: String
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
      default: [0, 0]
    }
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  totalDeliveries: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 5
  }
}, { timestamps: true });

module.exports = mongoose.model('Rider', riderSchema);
