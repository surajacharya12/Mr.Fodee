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
  console.log("\n========================================");
  console.log("📤 FILE UPLOAD REQUEST");
  console.log("========================================");
  
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error("❌ Upload Error:", err);
      console.error("========================================\n");
      return res.status(500).json({ error: err.message });
    }
    
    if (!req.file) {
      console.log("❌ No file in request");
      console.log("========================================\n");
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      console.log("✅ File received:", req.file.originalname);
      console.log("File size:", req.file.size, "bytes");
      console.log("\n🔍 Cloudinary Response Object:");
      console.log("  - fieldname:", req.file.fieldname);
      console.log("  - originalname:", req.file.originalname);
      console.log("  - encoding:", req.file.encoding);
      console.log("  - mimetype:", req.file.mimetype);
      console.log("  - path:", req.file.path);
      console.log("  - size:", req.file.size);
      console.log("  - filename:", req.file.filename);
      
      // CRITICAL FIX: req.file.path IS the full Cloudinary URL
      // Don't use req.file.filename (that's just the public_id)
      const cloudinaryUrl = req.file.path;
      
      console.log("\n✅ Extracted Cloudinary URL:", cloudinaryUrl);
      
      // Validate it's a proper URL
      if (!cloudinaryUrl || !cloudinaryUrl.startsWith('http')) {
        console.error("❌ Invalid Cloudinary URL:", cloudinaryUrl);
        console.error("This should start with http:// or https://");
        console.error("========================================\n");
        return res.status(500).json({ 
          error: 'Invalid URL from Cloudinary',
          debug: { received: cloudinaryUrl }
        });
      }
      
      console.log("✅ URL validation passed");
      console.log("Returning URL:", cloudinaryUrl);
      console.log("========================================\n");
      
      res.status(200).json({
        url: cloudinaryUrl,
        public_id: req.file.filename,
        resource_type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
      });
    } catch (error) {
       console.error("❌ Response Error:", error);
       console.error("========================================\n");
       res.status(500).json({ error: error.message });
    }
  });
});

module.exports = router;
