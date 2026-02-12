const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'mr_fodee',
      resource_type: 'auto',
      public_id: file.originalname.split('.')[0], // specific filename
    };
  },
});

const upload = multer({ storage: storage });

// Single file upload route (Image or Video)
router.post('/', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(500).json({ error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      res.status(200).json({
        url: req.file.path,
        public_id: req.file.filename,
        resource_type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
      });
    } catch (error) {
       console.error("Response Error:", error);
       res.status(500).json({ error: error.message });
    }
  });
});

module.exports = router;
