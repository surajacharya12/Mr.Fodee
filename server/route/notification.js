const express = require('express');
const router = express.Router();
const Notification = require('../module/notification');


// 🔹 Create Notification
router.post('/', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    const saved = await notification.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// 🔹 Get All Notifications
router.get('/all', async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};
    
    // If userId provided, only show notifications NOT deleted by this user
    if (userId) {
      query.deletedBy = { $ne: userId };
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 });

    // Map notifications to include a user-specific isRead flag
    const results = notifications.map(notif => {
      const plain = notif.toObject();
      return {
        ...plain,
        isRead: userId ? (notif.readBy && notif.readBy.includes(userId)) : false
      };
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔹 Get Single
router.get('/:id', async (req, res) => {
  try {
    const { userId } = req.query;
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    const plain = notification.toObject();
    res.json({
      ...plain,
      isRead: userId ? (notification.readBy && notification.readBy.includes(userId)) : false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔹 Update (Mark Read / Edit)
router.put('/:id', async (req, res) => {
  try {
    const { userId, isRead, ...updateData } = req.body;

    // If it's a "mark as read" action for a user
    if (userId && isRead !== undefined) {
      const update = isRead 
        ? { $addToSet: { readBy: userId } } 
        : { $pull: { readBy: userId } };
      
      const updated = await Notification.findByIdAndUpdate(req.params.id, update, { new: true });
      return res.json({ ...updated.toObject(), isRead });
    }

    // Standard admin edit
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// 🔹 Delete One (Soft delete if userId provided, else hard delete)
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.query;

    if (userId) {
      // Per-user soft delete (hide)
      await Notification.findByIdAndUpdate(req.params.id, {
        $addToSet: { deletedBy: userId }
      });
      return res.json({ message: "Notification hidden for user" });
    }

    // Admin hard delete
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Deleted successfully from database" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔹 Delete All (Soft delete per user if userId provided, else hard delete all)
router.delete('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (userId) {
      // Hide all notifications for this user
      const notifications = await Notification.find({ deletedBy: { $ne: userId } });
      const ids = notifications.map(n => n._id);
      await Notification.updateMany(
        { _id: { $in: ids } },
        { $addToSet: { deletedBy: userId } }
      );
      return res.json({ message: "All notifications hidden for user" });
    }

    // Admin hard delete all
    await Notification.deleteMany();
    res.json({ message: "All notifications deleted from database" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
