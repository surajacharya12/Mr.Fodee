/**
 * Calculates the Haversine distance between two points in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Attempts to extract coordinates from a Google Maps link.
 * Only works for long links with @lat,lng format.
 */
export function extractCoordsFromLink(link: string): { latitude: number; longitude: number } | null {
  if (!link) return null;
  
  // 1. Long links with @lat,lng format
  const atMatch = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    return {
      latitude: parseFloat(atMatch[1]),
      longitude: parseFloat(atMatch[2])
    };
  }

  // 2. Links with q=lat,lng or ll=lat,lng format
  const qMatch = link.match(/[?&](?:q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) {
    return {
      latitude: parseFloat(qMatch[1]),
      longitude: parseFloat(qMatch[2])
    };
  }

  // 3. Match !3d and !4d format in resolved URL (e.g. ...!3d27.7142291!4d85.3112428...)
  const d3Match = link.match(/!3d(-?\d+\.\d+)/);
  const d4Match = link.match(/!4d(-?\d+\.\d+)/);
  if (d3Match && d4Match) {
    return {
      latitude: parseFloat(d3Match[1]),
      longitude: parseFloat(d4Match[1])
    };
  }
  
  return null;
}

/**
 * Generates a Google Maps navigation link
 */
export function getNavigationLink(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/**
 * Formats distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}
