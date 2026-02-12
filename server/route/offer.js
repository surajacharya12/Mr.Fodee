const express = require('express');
const router = express.Router();
const Offer = require('../module/offer');


// GET all offers (admin)
router.get('/all', async (req, res) => {
  try {
    const offers = await Offer.find().populate('restaurant').sort({ createdAt: -1 });
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all active offers
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    // Simplified query: just check isActive. 
    // We'll handle dates in the frontend or just rely on the manual toggle for now to ensure they show up.
    const offers = await Offer.find({ isActive: true }).populate('restaurant');
    
    console.log(`[Offer] Found ${offers.length} active offers`);
    res.status(200).json(offers);
  } catch (error) {
    console.error("[Offer] GET / error:", error);
    res.status(500).json({ message: error.message });
  }
});


// GET single offer
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate('restaurant');

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// CREATE offer
router.post('/', async (req, res) => {
  try {
    const newOffer = new Offer(req.body);
    const savedOffer = await newOffer.save();

    res.status(201).json(savedOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// UPDATE offer
router.put('/:id', async (req, res) => {
  try {
    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.status(200).json(updatedOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// DELETE offer
router.delete('/:id', async (req, res) => {
  try {
    const deletedOffer = await Offer.findByIdAndDelete(req.params.id);

    if (!deletedOffer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.status(200).json({ message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
