const express = require('express');
const router = express.Router();
const Restaurant = require('../module/resturent');
const Offer = require('../module/offer');
const https = require('https');

async function resolveGoogleMapsLink(link, maxRedirects = 3) {
  if (!link) return null;
  
  // 1. Check if the link itself already contains coordinates
  const patterns = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,               // @lat,lng
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/           // !3dlat!4dlng
  ];

  for (const pattern of patterns) {
    const match = link.match(pattern);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      // Pattern 2 (!3d/!4d) is [lat, lng], Pattern 1 (@) is [lat, lng]
      // Wait, let's be careful. @lat,lng match[1] is lat, match[2] is lng.
      // !3dlat!4dlng match[1] is lat, match[2] is lng.
      return [lng, lat]; // MongoDB [lng, lat]
    }
  }

  // 2. If it's a shortened link, resolve it
  if ((link.includes('maps.app.goo.gl') || link.includes('goo.gl/maps') || link.includes('bit.ly') || link.includes('t.co')) && maxRedirects > 0) {
    try {
      const redirectedUrl = await new Promise((resolve, reject) => {
        const req = https.get(link, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            resolve(res.headers.location);
          } else {
            resolve(null);
          }
          req.destroy();
        }).on('error', (err) => {
          console.error("Link resolution error:", err);
          resolve(null);
        });
      });

      if (redirectedUrl) {
        // Recursively follow until we get a long URL or run out of redirects
        return await resolveGoogleMapsLink(redirectedUrl, maxRedirects - 1);
      }
    } catch (e) {
      console.error("Failed to resolve maps link:", e);
    }
  }

  return null;
}


// GET all restaurants
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      query.foodCategory = { $regex: new RegExp(category, 'i') };
    }
    const restaurants = await Restaurant.find(query).lean();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET single restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).lean();

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Attach active offer
    const activeOffer = await Offer.findOne({
      $or: [{ restaurant: restaurant._id }, { restaurant: null }],
      isActive: true,
      endDate: { $gte: new Date() }
    }).sort({ createdAt: -1 });

    const restaurantWithOffer = {
      ...restaurant,
      offer: restaurant.offer || (activeOffer ? activeOffer.subtitle : null)
    };

    res.status(200).json(restaurantWithOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// CREATE new restaurant
router.post('/', async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Auto-resolve coordinates from Google Maps link if not provided or [0,0]
    if (data.googleMapsLink && (!data.location?.coordinates || (data.location.coordinates[0] === 0 && data.location.coordinates[1] === 0))) {
      const coords = await resolveGoogleMapsLink(data.googleMapsLink);
      if (coords) {
        data.location = {
          ...data.location,
          type: 'Point',
          coordinates: coords
        };

        // If address is still missing, try to auto-fetch it from coordinates
        if (!data.location.address || data.location.address === "") {
          try {
            const geoRes = await new Promise((resolve, reject) => {
              const options = {
                hostname: 'nominatim.openstreetmap.org',
                path: `/reverse?format=json&lat=${coords[1]}&lon=${coords[0]}`,
                headers: { 'User-Agent': 'MrFodee-Server/1.0' }
              };
              https.get(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => resolve(JSON.parse(data)));
              }).on('error', reject);
            });
            if (geoRes && geoRes.display_name) {
              data.location.address = geoRes.display_name.split(',').slice(0, 3).join(',');
            }
          } catch (e) {
            console.error("Reverse geocoding failed:", e);
          }
        }
      }
    }

    const newRestaurant = new Restaurant(data);
    const savedRestaurant = await newRestaurant.save();

    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// UPDATE restaurant
router.put('/:id', async (req, res) => {
  try {
    const data = { ...req.body };

    // Auto-resolve coordinates if link is updated or coordinates are missing
    if (data.googleMapsLink) {
      const coords = await resolveGoogleMapsLink(data.googleMapsLink);
      if (coords) {
        data.location = {
          ...data.location,
          type: 'Point',
          coordinates: coords
        };

        // Auto-fetch address if missing
        if (!data.location.address || data.location.address === "") {
          try {
            const geoRes = await new Promise((resolve, reject) => {
              const options = {
                hostname: 'nominatim.openstreetmap.org',
                path: `/reverse?format=json&lat=${coords[1]}&lon=${coords[0]}`,
                headers: { 'User-Agent': 'MrFodee-Server/1.0' }
              };
              https.get(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => resolve(JSON.parse(data)));
              }).on('error', reject);
            });
            if (geoRes && geoRes.display_name) {
              data.location.address = geoRes.display_name.split(',').slice(0, 3).join(',');
            }
          } catch (e) {
            console.error("Reverse geocoding failed:", e);
          }
        }
      }
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// DELETE restaurant
router.delete('/:id', async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!deletedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
