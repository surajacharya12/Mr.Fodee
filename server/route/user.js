const express = require('express');
const User = require('../module/user');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Base route for /user
router.get('/', (req, res) => {
  res.status(200).json({ message: 'User API is working' });
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Login route with password hashing
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Return user details without password
    const userDetails = {
      id: user._id,
      username: user.username,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt
    };
    
    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user with password hashing
router.post('/users', async (req, res) => {
  try {
    const { username, email, passwordHash, profilePictureUrl, phoneNumber } = req.body;
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordHash, salt);
    
    const newUser = new User({ 
      username, 
      email, 
      passwordHash: hashedPassword, 
      profilePictureUrl, 
      phoneNumber 
    });
    
    await newUser.save();
    
    // Return user details without password
    const userDetails = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profilePictureUrl: newUser.profilePictureUrl,
      phoneNumber: newUser.phoneNumber,
      createdAt: newUser.createdAt
    };
    
    res.status(201).json(userDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user by ID
router.put('/users/:id', async (req, res) => {
  try {
    console.log("\n========================================");
    console.log("📥 USER UPDATE REQUEST");
    console.log("========================================");
    console.log("User ID:", req.params.id);
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    
    const { username, email, passwordHash, profilePictureUrl, phoneNumber } = req.body;
    
    // Create an update object with only defined fields
    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (passwordHash !== undefined) updateData.passwordHash = passwordHash;
    if (profilePictureUrl !== undefined) updateData.profilePictureUrl = profilePictureUrl;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    console.log("Update Data Object:", JSON.stringify(updateData, null, 2));
    console.log("Calling findByIdAndUpdate...");

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      console.log("❌ User not found!");
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log("✅ User updated successfully!");
    console.log("Updated profilePictureUrl:", updatedUser.profilePictureUrl);
    console.log("========================================\n");
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("❌ Update User Error:", error);
    console.error("Error message:", error.message);
    console.error("========================================\n");
    res.status(400).json({ error: error.message });
  }
});

// Add an address to a user
router.post('/users/:id/addresses', async (req, res) => {
  try {
    const { type, detail, isDefault } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If adding first address or isDefault is true, manage defaults
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    } else if (user.addresses.length === 0) {
      // First address must be default if not specified
      // But we will respect the input generally, or force first one to be default on retrieval/deletion logic?
      // Let's just follow input for now, but maybe auto-set first one?
      // For simplicity, if user has no addresses, new one becomes default if user didn't specify? Let's keep simple.
    }
    
    // Add the new address
    user.addresses.push({ type, detail, isDefault: isDefault || false });
    
    await user.save();
    
    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an address
router.delete('/users/:id/addresses/:addressId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const address = user.addresses.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    
    // Check if we are deleting the default address
    const wasDefault = address.isDefault;
    
    // Remove the address
    user.addresses.pull(req.params.addressId);
    
    // If we deleted the default address and there are other addresses, make the first one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    
    await user.save();
    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an address (e.g. set as default)
router.put('/users/:id/addresses/:addressId', async (req, res) => {
  try {
    const { type, detail, isDefault } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const address = user.addresses.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If setting as default, unset others
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    // Update fields if provided
    if (type) address.type = type;
    if (detail) address.detail = detail;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await user.save();
    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user password
router.put('/users/:id/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    
    user.passwordHash = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});     



module.exports = router;