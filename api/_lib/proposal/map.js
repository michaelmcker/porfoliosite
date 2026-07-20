const DEFAULT_OPTIONS = {
  width: 600,
  height: 400,
  zoom: 14,
  mapStyle: "light-v11",
  // Clean, minimal style
  businessMarkerColor: "#dc2626",
  // Red-600
  screenMarkerColor: "#0ea5e9"
  // Sky-500
};
function generateMapUrl(business, screens, options = {}) {
  const accessToken = process.env.MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("MAPBOX_ACCESS_TOKEN not set");
  }
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const validScreens = screens.filter((s) => s.lat && s.lng);
  const bizColor = (opts.businessMarkerColor || "#dc2626").replace("#", "");
  const scrColor = (opts.screenMarkerColor || "#0ea5e9").replace("#", "");
  const pins = [];
  for (const screen of validScreens) {
    pins.push(`pin-s+${scrColor}(${screen.lng},${screen.lat})`);
  }
  pins.push(`pin-l-star+${bizColor}(${business.lng},${business.lat})`);
  console.log(`Map: ${validScreens.length} screen markers + 1 business marker (pin format)`);
  const baseUrl = `https://api.mapbox.com/styles/v1/mapbox/${opts.mapStyle}/static`;
  const overlay = pins.join(",");
  const size = `${opts.width}x${opts.height}`;
  const zoom = options.zoom ?? (validScreens.length > 0 ? calculateOptimalZoom(business, validScreens) : opts.zoom);
  const viewport = `${business.lng},${business.lat},${zoom}`;
  return `${baseUrl}/${overlay}/${viewport}/${size}@2x?access_token=${accessToken}&logo=false&attribution=false`;
}
function generateStyledMapUrl(business, screens, options = {}) {
  const accessToken = process.env.MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("MAPBOX_ACCESS_TOKEN not set");
  }
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const features = [];
  features.push({
    type: "Feature",
    properties: {
      "marker-color": "#e74c3c",
      "marker-size": "large",
      "marker-symbol": "b"
    },
    geometry: {
      type: "Point",
      coordinates: [business.lng, business.lat]
    }
  });
  for (const screen of screens) {
    features.push({
      type: "Feature",
      properties: {
        "marker-color": "#3498db",
        "marker-size": "medium",
        "marker-symbol": "s"
      },
      geometry: {
        type: "Point",
        coordinates: [screen.lng, screen.lat]
      }
    });
  }
  const geojson = {
    type: "FeatureCollection",
    features
  };
  const encodedGeojson = encodeURIComponent(JSON.stringify(geojson));
  const baseUrl = `https://api.mapbox.com/styles/v1/mapbox/${opts.mapStyle}/static`;
  const overlay = `geojson(${encodedGeojson})`;
  const size = `${opts.width}x${opts.height}`;
  return `${baseUrl}/${overlay}/auto/${size}@2x?access_token=${accessToken}&logo=false&attribution=false&padding=50`;
}
function calculateOptimalZoom(business, screens) {
  if (screens.length === 0) return 15;
  let maxDistance = 0;
  for (const screen of screens) {
    const distance = haversineDistance(business, screen);
    if (distance > maxDistance) {
      maxDistance = distance;
    }
  }
  if (maxDistance < 0.5) return 16;
  if (maxDistance < 1) return 15;
  if (maxDistance < 2) return 14;
  if (maxDistance < 5) return 13;
  if (maxDistance < 10) return 12;
  return 11;
}
function haversineDistance(point1, point2) {
  const R = 3959;
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);
  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function toRad(deg) {
  return deg * (Math.PI / 180);
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const { config } = await import("dotenv");
  config();
  const business = { lat: 33.7756, lng: -84.3963 };
  const screens = [
    { lat: 33.7786, lng: -84.388 },
    { lat: 33.772, lng: -84.392 },
    { lat: 33.78, lng: -84.4 }
  ];
  const url = generateMapUrl(business, screens);
  console.log("Generated map URL:");
  console.log(url);
  console.log("\nOpen this URL in a browser to see the map.");
}
export {
  calculateOptimalZoom,
  generateMapUrl,
  generateStyledMapUrl
};
