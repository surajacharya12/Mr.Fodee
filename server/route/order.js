const express = require('express');
const router = express.Router();
const Order = require('../module/order');
const Cart = require('../module/cart');
const Restaurant = require('../module/resturent');
const { findNearestRider } = require('../services/riderService');

// Create a new order (COD)
router.post('/cod', async (req, res) => {
  try {
    const { userId, restaurantId, items, totalAmount, deliveryAddress, instructions } = req.body;

    const order = new Order({
      user: userId,
      restaurant: restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod: 'COD',
      status: 'Pending',
      instructions
    });

    await order.save();

    // Clear the cart after placing order
    await Cart.findOneAndUpdate({ user: userId }, { items: [], totalPrice: 0 });

    res.status(201).json({ 
      message: 'Order placed successfully with Cash on Delivery', 
      order 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create a new order (General)
router.post('/create', async (req, res) => {
  try {
    const { userId, restaurantId, items, totalAmount, deliveryAddress, paymentMethod, instructions } = req.body;

    const order = new Order({
      user: userId,
      restaurant: restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      status: 'Pending',
      paymentStatus: 'Pending',
      instructions
    });

    await order.save();

    // Note: for online payments, we clear cart after successful verification
    if (paymentMethod === 'COD') {
      await Cart.findOneAndUpdate({ user: userId }, { items: [], totalPrice: 0 });
    }

    res.status(201).json({ 
      message: 'Order initiated successfully', 
      order 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('items.food')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders (for admin)
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email phoneNumber')
      .populate('items.food')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status or payment status (for admin)
router.patch('/status/:id', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    
    let order = await Order.findById(req.params.id).populate('restaurant');
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    // Nearest Rider Assignment Logic
    if (status === 'Confirmed' && !order.rider) {
      const restaurant = order.restaurant;
      if (restaurant && restaurant.location && restaurant.location.coordinates) {
        const nearestRider = await findNearestRider(restaurant.location.coordinates);
        if (nearestRider) {
          order.rider = nearestRider._id;
          order.status = 'Assigned';
          
          // Emit socket event to rider
          if (req.io) {
            req.io.to(nearestRider.user.toString()).emit('newOrder', {
              orderId: order._id,
              restaurantName: restaurant.name,
              totalAmount: order.totalAmount
            });
          }
        }
      }
    }

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
