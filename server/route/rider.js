const express = require('express');
const router = express.Rowter; // No, it should be router
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Rider = require('../module/rider');
const User = require('../module/user');
const Order = require('../module/order');

const riderRouter = express.Router();

// Rider Registration
riderRouter.post('/register', async (req, res) => {
  try {
    const { username, email, password, phoneNumber, vehicleType, licenseNumber, bankDetails } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create User
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const user = new User({
      username,
      email,
      passwordHash,
      phoneNumber,
      role: 'Rider'
    });
    await user.save();

    // Create Rider Profile
    const rider = new Rider({
      user: user._id,
      vehicleType,
      licenseNumber,
      bankDetails
    });
    await rider.save();

    const token = jwt.sign({ id: user._id, role: 'Rider' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      rider: {
        id: rider._id,
        vehicleType: rider.vehicleType,
        isOnline: rider.isOnline
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rider Login
riderRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.role !== 'Rider') {
      return res.status(401).json({ error: 'Access denied. Rider account not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const rider = await Rider.findOne({ user: user._id });
    const token = jwt.sign({ id: user._id, role: 'Rider' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      rider
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Rider Online Status
riderRouter.patch('/status', async (req, res) => {
  try {
    const { riderId, isOnline } = req.body;
    const rider = await Rider.findByIdAndUpdate(riderId, { isOnline }, { new: true });
    res.json(rider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Rider Location
riderRouter.patch('/location', async (req, res) => {
  try {
    const { riderId, latitude, longitude } = req.body;
    const rider = await Rider.findByIdAndUpdate(riderId, {
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    }, { new: true });
    res.json(rider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Assigned Orders
riderRouter.get('/orders/:riderId', async (req, res) => {
  try {
    const orders = await Order.find({ 
      rider: req.params.riderId,
      status: { $in: ['Assigned', 'Accepted', 'Picked Up', 'Out for Delivery'] }
    }).populate('items.food');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept Order
riderRouter.patch('/orders/accept', async (req, res) => {
  try {
    const { orderId, riderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order || order.status !== 'Assigned') {
      return res.status(400).json({ error: 'Order no longer available for acceptance' });
    }

    order.status = 'Accepted';
    order.rider = riderId;
    await order.save();

    await Rider.findByIdAndUpdate(riderId, { isAvailable: false });

    res.json({ message: 'Order accepted', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Order Status (Progression)
riderRouter.patch('/orders/status', async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    
    // If delivered, mark rider as available and add earnings
    if (status === 'Delivered') {
      const rider = await Rider.findById(order.rider);
      rider.isAvailable = true;
      rider.walletBalance += 50; // Simple flat commission for now
      rider.totalDeliveries += 1;
      await rider.save();
      
      order.paymentStatus = 'Completed'; // For COD or online, it's finished now
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = riderRouter;
