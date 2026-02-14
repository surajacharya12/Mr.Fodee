const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    notificationImage: {
      type: String,
      required: false
    },
    notificationTitle: {
      type: String,
      required: true
    },
    notificationDescription: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["order", "promo", "info"],
      default: "info"
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    deletedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
