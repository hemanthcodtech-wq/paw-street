export const GOOGLE_GEOCODING_API_KEY = 'AIzaSyC1GuN_tIuHPzUkpD5B01icJTb96Tu49S0';

// Popular Delivery / Vendor Hubs in Hyderabad with precise verified coordinates
export const HYDERABAD_HUBS = [
  { area: 'Banjara Hills', city: 'Hyderabad', pincode: '500034', lat: 17.4156, lng: 78.4350 },
  { area: 'Jubilee Hills', city: 'Hyderabad', pincode: '500033', lat: 17.4319, lng: 78.4073 },
  { area: 'Madhapur / Hitec City', city: 'Hyderabad', pincode: '500081', lat: 17.4483, lng: 78.3915 },
  { area: 'Gachibowli', city: 'Hyderabad', pincode: '500032', lat: 17.4401, lng: 78.3489 },
  { area: 'Kondapur', city: 'Hyderabad', pincode: '500084', lat: 17.4699, lng: 78.3578 },
  { area: 'Kukatpally', city: 'Hyderabad', pincode: '500072', lat: 17.4947, lng: 78.3996 },
  { area: 'Begumpet', city: 'Hyderabad', pincode: '500016', lat: 17.4447, lng: 78.4664 },
  { area: 'Secunderabad', city: 'Hyderabad', pincode: '500003', lat: 17.4399, lng: 78.4983 },
  { area: 'Ameerpet', city: 'Hyderabad', pincode: '500038', lat: 17.4375, lng: 78.4482 },
  { area: 'Manikonda / Puppalguda', city: 'Hyderabad', pincode: '500089', lat: 17.3990, lng: 78.3758 }
];

export const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const p1 = Number(lat1);
  const l1 = Number(lon1);
  const p2 = Number(lat2);
  const l2 = Number(lon2);
  if (isNaN(p1) || isNaN(l1) || isNaN(p2) || isNaN(l2)) return 3.2;
  const R = 6371; // km
  const dLat = (p2 - p1) * (Math.PI / 180);
  const dLon = (l2 - l1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1 * (Math.PI / 180)) * Math.cos(p2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

export const geocodeAddress = async (query) => {
  if (!query || !query.trim()) return null;
  const trimmed = query.trim();

  // 1. Google Geocoding API
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(trimmed)}&key=${GOOGLE_GEOCODING_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'OK' && data.results?.[0]?.geometry?.location) {
      const { lat, lng } = data.results[0].geometry.location;
      let city = 'Hyderabad';
      let pincode = '500034';
      let area = trimmed;
      data.results[0].address_components?.forEach(c => {
        if (c.types.includes('sublocality') || c.types.includes('neighborhood')) area = c.long_name;
        if (c.types.includes('locality')) city = c.long_name;
        if (c.types.includes('postal_code')) pincode = c.long_name;
      });
      return {
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
        area,
        city,
        pincode,
        formattedAddress: data.results[0].formatted_address
      };
    }
  } catch (err) {
    console.warn('Google Geocode err:', err);
  }

  // 2. OpenStreetMap Nominatim Fallback
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'PawNear/1.0' } }
    );
    const data = await res.json();
    if (data && data[0]) {
      const lat = Number(Number(data[0].lat).toFixed(6));
      const lng = Number(Number(data[0].lon).toFixed(6));
      return {
        lat,
        lng,
        area: trimmed,
        city: 'Hyderabad',
        pincode: '500034',
        formattedAddress: data[0].display_name
      };
    }
  } catch (err) {
    console.warn('Nominatim err:', err);
  }

  // 3. Match against known Hyderabad Hubs
  const lower = trimmed.toLowerCase();
  const match = HYDERABAD_HUBS.find(h => lower.includes(h.area.toLowerCase()) || h.area.toLowerCase().includes(lower));
  if (match) return { ...match, formattedAddress: `${match.area}, ${match.city} (${match.pincode})` };

  return {
    lat: 17.4156,
    lng: 78.4350,
    area: trimmed,
    city: 'Hyderabad',
    pincode: '500034',
    formattedAddress: `${trimmed}, Hyderabad`
  };
};

export const reverseGeocodeCoords = async (lat, lng) => {
  const pLat = Number(lat);
  const pLng = Number(lng);

  // 1. Google Geocoding API
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pLat},${pLng}&key=${GOOGLE_GEOCODING_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'OK' && data.results?.[0]) {
      const item = data.results[0];
      let area = 'Banjara Hills';
      let city = 'Hyderabad';
      let pincode = '500034';
      item.address_components?.forEach(c => {
        if (c.types.includes('sublocality') || c.types.includes('neighborhood') || c.types.includes('route')) {
          area = c.long_name;
        }
        if (c.types.includes('locality')) city = c.long_name;
        if (c.types.includes('postal_code')) pincode = c.long_name;
      });
      return {
        lat: pLat,
        lng: pLng,
        area,
        city,
        pincode,
        formattedAddress: item.formatted_address
      };
    }
  } catch (err) {
    console.warn('Google reverseGeocode err:', err);
  }

  // 2. OpenStreetMap Nominatim Fallback
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${pLat}&lon=${pLng}&format=json`,
      { headers: { 'User-Agent': 'PawNear/1.0' } }
    );
    const data = await res.json();
    if (data && data.address) {
      const area = data.address.suburb || data.address.neighbourhood || data.address.road || 'Current Location';
      const city = data.address.city || data.address.town || 'Hyderabad';
      const pincode = data.address.postcode || '500034';
      return {
        lat: pLat,
        lng: pLng,
        area,
        city,
        pincode,
        formattedAddress: data.display_name?.split(',').slice(0, 3).join(', ') || `${area}, ${city}`
      };
    }
  } catch (err) {
    console.warn('Nominatim reverseGeocode err:', err);
  }

  // 3. Fallback to nearest hub
  let nearest = HYDERABAD_HUBS[0];
  let minD = 99999;
  HYDERABAD_HUBS.forEach(hub => {
    const d = haversineDistanceKm(pLat, pLng, hub.lat, hub.lng);
    if (d < minD) {
      minD = d;
      nearest = hub;
    }
  });

  return {
    ...nearest,
    lat: pLat,
    lng: pLng,
    formattedAddress: `${nearest.area}, ${nearest.city} (${nearest.pincode})`
  };
};
