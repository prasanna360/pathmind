import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { fallbackCoaches } from '../data/coaches.js';

const router = Router();
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

function isCoordinate(value, min, max) {
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max;
}

function distanceInKilometres(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371;
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const deltaLat = radians(lat2 - lat1);
  const deltaLng = radians(lng2 - lng1);
  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(deltaLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

router.get('/nearby', authRequired, async (req, res) => {
  const latitude = Number(req.query.lat);
  const longitude = Number(req.query.lng);
  const radius = Math.min(Math.max(Number(req.query.radius) || 10000, 1000), 25000);

  if (!isCoordinate(latitude, -90, 90) || !isCoordinate(longitude, -180, 180)) {
    return res.status(400).json({ error: 'Valid latitude and longitude are required.' });
  }

  const query = `[out:json][timeout:20];(nwr["name"]["amenity"~"school|college|training|music_school|language_school|arts_centre|community_centre"](around:${radius},${latitude},${longitude});nwr["name"~"academy|institute|coaching|training|school|college|university|learning",i](around:${radius},${latitude},${longitude});nwr["name"]["office"="educational_institution"](around:${radius},${latitude},${longitude}););out center tags;`;

  try {
    const response = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'PathMind/1.0 (nearby coaching centre lookup)',
      },
      body: new URLSearchParams({ data: query }),
    });
    if (!response.ok) throw new Error(`OpenStreetMap returned ${response.status}`);

    const payload = await response.json();
    const centers = (payload.elements || [])
      .map((element) => {
        const lat = element.lat ?? element.center?.lat;
        const lng = element.lon ?? element.center?.lon;
        const tags = element.tags || {};
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || !tags.name) return null;
        const address = [tags['addr:street'], tags['addr:suburb'], tags['addr:city']].filter(Boolean).join(', ');
        return {
          id: `${element.type}-${element.id}`,
          e: '📍',
          n: tags.name,
          s: tags.amenity === 'music_school' ? 'Music School' : tags.amenity === 'training' ? 'Training Centre' : 'Learning Centre',
          i: address || 'Address unavailable',
          b: 'Open in Maps',
          lat,
          lng,
          distance: distanceInKilometres(latitude, longitude, lat, lng),
          mapUrl: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance)
      .filter((center, index, all) => all.findIndex((item) => item.n === center.n && item.i === center.i) === index)
      .slice(0, 12);

    res.json({ centers, source: 'OpenStreetMap' });
  } catch (error) {
    console.error('Nearby centers lookup failed:', error.message);
    res.json({ centers: fallbackCoaches.slice(0, 4).map((center) => ({ ...center, live: false })), source: 'PathMind directory', fallback: true });
  }
});

export default router;