# Location Feature Setup

PathMind now includes a browser-based location feature for the **Nearby Coach Centres** section. After permission is granted, the backend searches OpenStreetMap for real nearby learning and training centres.

Users can click **Use my location** to allow the browser to detect their approximate location. The app sends the coordinates to the Express backend, which queries OpenStreetMap and returns nearby centres sorted by distance.

## What was added

- Browser Geolocation API support
- A `Use my location` button on the dashboard
- Live nearby centre lookup through OpenStreetMap
- Distance sorting for real coach centres
- A local fallback directory when the public map service is unavailable
- Distance shown in kilometres
- Permission-denied and unsupported-browser messages
- Mobile-friendly location controls

## 1. Run the app locally

From the project folder:

```powershell
cd "C:\Users\LAKSHMI\OneDrive\Desktop\New folder\pathmind-app"
npm run dev
```

Open the frontend URL shown by Vite, usually:

```text
http://localhost:5173
```

`localhost` is considered a secure context by modern browsers, so location should work during local development.

## 2. Allow browser location access

1. Log in to PathMind.
2. Open the dashboard.
3. Find **Nearby Coach Centres**.
4. Click **Use my location**.
5. Choose **Allow** in the browser permission popup.
6. The coaches will be sorted by distance.

If you previously selected Block:

1. Click the lock or settings icon beside the website address.
2. Open **Site permissions**.
3. Set **Location** to **Allow**.
4. Refresh the page.
5. Click **Use my location** again.

## 3. HTTPS is required in production

Browser geolocation normally works only on:

- `localhost`
- `127.0.0.1`
- an HTTPS website

When deploying PathMind, configure HTTPS on your hosting provider. Do not use a plain `http://` production URL for location.

## 4. Update coach locations

Coach coordinates currently live in:

```text
client/src/data/constants.js
```

Each coach has:

```js
{
  n: 'Coach name',
  lat: 13.0827,
  lng: 80.2707
}
```

Replace `lat` and `lng` with the coach centre's real coordinates. You can find coordinates by searching the address in Google Maps and copying the latitude and longitude.

Do not use a user's exact location as a coach location. Use the public address or centre coordinates.

## 5. Privacy behavior

The current implementation:

- asks for permission only after the user clicks the button
- does not save the user's coordinates to the database
- uses the coordinates only in the current browser session
- does not send location to Supabase

## 6. Optional future map integration

The current feature sorts and displays distances without a map. A future map can be added with:

- MapLibre GL JS with OpenStreetMap tiles
- Google Maps JavaScript API
- Mapbox GL JS

A map provider may require an API key and billing setup. Never expose a private server key in frontend code.

## 7. Troubleshooting

### The permission popup does not appear

The browser may remember an earlier choice. Check the site location permission beside the address bar and reset it.

### It says location is blocked

Allow location for the site, refresh the page, and click the button again.

### Distances look wrong

Check that the coach `lat` and `lng` values are correct and in decimal degrees. Latitude is between `-90` and `90`; longitude is between `-180` and `180`.

### It works locally but not after deployment

Confirm the deployed website uses HTTPS. Also check that the browser, operating system, and device have location services enabled.

### Live search is temporarily unavailable

The app uses the public OpenStreetMap Overpass service. If that service is busy or unavailable, PathMind shows its local directory instead and labels it clearly. No API key is required for local development. For production traffic, consider hosting your own Overpass instance or using a managed places provider.
