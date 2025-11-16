/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format time to readable string
 */
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Extract coordinates from Google Maps link
 */
export const extractCoordinatesFromLink = (link) => {
  try {
    // Pattern 1: https://maps.google.com/?q=LAT,LNG
    const pattern1 = /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const match1 = link.match(pattern1);
    if (match1) {
      return {
        lat: parseFloat(match1[1]),
        lng: parseFloat(match1[2]),
      };
    }

    // Pattern 2: https://www.google.com/maps/@LAT,LNG,ZOOMz
    const pattern2 = /@(-?\d+\.?\d*),(-?\d+\.?\d*),/;
    const match2 = link.match(pattern2);
    if (match2) {
      return {
        lat: parseFloat(match2[1]),
        lng: parseFloat(match2[2]),
      };
    }

    // Pattern 3: https://www.google.com/maps/place/.../@LAT,LNG
    const pattern3 = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const match3 = link.match(pattern3);
    if (match3) {
      return {
        lat: parseFloat(match3[1]),
        lng: parseFloat(match3[2]),
      };
    }

    return null;
  } catch (error) {
    console.error('Error extracting coordinates:', error);
    return null;
  }
};

/**
 * Validate phone number (Sri Lankan format)
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^(?:\+94|0)?[1-9]\d{8}$/;
  return phoneRegex.test(phone);
};

/**
 * Format phone number
 */
export const formatPhone = (phone) => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format: 077 123 4567
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  return phone;
};

/**
 * Validate Google Maps link
 */
export const validateGoogleMapsLink = (link) => {
  return link.includes('google.com/maps') || link.includes('maps.google.com');
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance.toFixed(2);
};

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Get directions URL for Google Maps
 */
export const getDirectionsUrl = (fromLat, fromLng, toLat, toLng) => {
  return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=driving`;
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};