const express = require('express');
const router = express.Router();
const Cart = require('../module/cart');
const Food = require('../module/food');

// Get cart for a specific user
router.get('/:userId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.params.userId })
      .populate('items.food')
      .populate('items.restaurant');
    
    if (!cart) {
      // Return empty cart structure if not found
      return res.status(200).json({ items: [], totalPrice: 0 });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add items or update quantity in cart
router.post('/add', async (req, res) => {
  try {
    const { userId, foodId, quantity, restaurantId } = req.body;
    
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ food: foodId, quantity, restaurant: restaurantId });
    }

    // Populate and calculate stats
    await cart.populate('items.food');
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (item.food.price * item.quantity);
    }, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update item quantity directly
router.put('/update', async (req, res) => {
  try {
    const { userId, foodId, quantity } = req.body;
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      
      await cart.populate('items.food');
      cart.totalPrice = cart.items.reduce((total, item) => {
        return total + (item.food.price * item.quantity);
      }, 0);
      
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Item not found in cart' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove item from cart
router.delete('/remove/:userId/:foodId', async (req, res) => {
  try {
    const { userId, foodId } = req.params;
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(item => item.food.toString() !== foodId);
    
    await cart.populate('items.food');
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (item.food.price * item.quantity);
    }, 0);

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear cart
router.delete('/clear/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
