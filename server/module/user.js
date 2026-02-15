const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Customer', 'Rider', 'Restaurant', 'Admin'], 
    default: 'Customer' 
  },
  createdAt: { type: Date, default: Date.now }, 
  profilePictureUrl: { type: String },
  phoneNumber: { type: String },
  addresses: [{
    type: { type: String, default: 'Home' }, // Home, Work, Other
    detail: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }],
}, { 
  timestamps: true,
  strict: true 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
