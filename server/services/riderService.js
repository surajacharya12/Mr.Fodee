const Rider = require('../module/rider');

/**
 * Finds the nearest available online rider to a set of coordinates.
 * @param {Array} coordinates - [longitude, latitude]
 * @param {Number} maxDistance - distance in meters (default 5000m)
 */
const findNearestRider = async (coordinates, maxDistance = 5000) => {
  try {
    const riders = await Rider.find({
      isOnline: true,
      isAvailable: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coordinates
          },
          $maxDistance: maxDistance
        }
      }
    }).limit(1);

    return riders.length > 0 ? riders[0] : null;
  } catch (error) {
    console.error("Error finding nearest rider:", error);
    return null;
  }
};

module.exports = { findNearestRider };
