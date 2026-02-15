const express = require('express');
const router = express.Router();
const Order = require('../module/order');
const Cart = require('../module/cart');

// Create a new order (COD)
router.post('/cod', async (req, res) => {
  try {
    const { userId, items, totalAmount, deliveryAddress, instructions } = req.body;

    const order = new Order({
      user: userId,
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
    const { userId, items, totalAmount, deliveryAddress, paymentMethod, instructions } = req.body;

    const order = new Order({
      user: userId,
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
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
