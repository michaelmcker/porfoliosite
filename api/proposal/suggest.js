import {
  RequestSecurityError,
  assertRateLimit,
  assertSameOrigin,
} from '../_lib/proposal/request-security.js';

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'private, no-store');
  response.end(JSON.stringify(payload));
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  try {
    assertSameOrigin(request);
    assertRateLimit(request, {
      bucket: 'proposal-suggest',
      limit: 60,
      windowMs: 60 * 1000,
    });
  } catch (error) {
    if (error instanceof RequestSecurityError) {
      if (error.retryAfter) response.setHeader('Retry-After', String(error.retryAfter));
      return sendJson(response, error.statusCode, { error: error.message });
    }
    throw error;
  }

  const query = String(request.query?.q || '').trim();
  if (query.length > 180) return sendJson(response, 400, { error: 'Address query is too long.' });
  if (query.length < 3) return sendJson(response, 200, { suggestions: [] });

  const token = process.env.MAPBOX_ACCESS_TOKEN;
  if (!token) return sendJson(response, 500, { error: 'Address lookup is not configured.' });

  try {
    const url = new URL('https://api.mapbox.com/search/geocode/v6/forward');
    url.searchParams.set('q', query);
    url.searchParams.set('autocomplete', 'true');
    url.searchParams.set('limit', '6');
    url.searchParams.set('types', 'address,street,place,postcode');
    url.searchParams.set('language', 'en');
    url.searchParams.set('access_token', token);

    const mapboxResponse = await fetch(url, { cache: 'no-store' });
    if (!mapboxResponse.ok) throw new Error(`Mapbox returned ${mapboxResponse.status}.`);
    const data = await mapboxResponse.json();
    const suggestions = (data.features || []).flatMap((feature) => {
      const coordinates = feature.geometry?.coordinates;
      const fullAddress = feature.properties?.full_address || feature.place_name || feature.properties?.name;
      if (!fullAddress || !Array.isArray(coordinates) || coordinates.length < 2) return [];
      return [{
        id: feature.id,
        fullAddress,
        lat: Number(coordinates[1]),
        lng: Number(coordinates[0]),
        relevance: Number(feature.properties?.match_code?.confidence === 'exact' ? 1 : feature.relevance || 0),
      }];
    });
    return sendJson(response, 200, { suggestions });
  } catch (error) {
    console.error('Address suggestion failed:', error);
    return sendJson(response, 502, { error: 'Address suggestions are temporarily unavailable.' });
  }
}
