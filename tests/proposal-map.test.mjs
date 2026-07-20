import assert from "node:assert/strict";
import test from "node:test";

import { generateMapUrl } from "../api/_lib/proposal/map.js";

test("proposal map keeps the business at the camera centre when screens are one-sided", () => {
  const previousToken = process.env.MAPBOX_ACCESS_TOKEN;
  process.env.MAPBOX_ACCESS_TOKEN = "test-mapbox-token";

  try {
    const business = { lat: 49.888, lng: -119.496 };
    const screens = [
      { lat: 49.889, lng: -119.482 },
      { lat: 49.892, lng: -119.475 },
      { lat: 49.896, lng: -119.468 },
    ];

    const url = generateMapUrl(business, screens, { width: 1200, height: 600 });

    assert.match(url, /\/-119\.496,49\.888,\d+\/1200x600@2x\?/);
    assert.doesNotMatch(url, /\/auto\//);
  } finally {
    if (previousToken === undefined) delete process.env.MAPBOX_ACCESS_TOKEN;
    else process.env.MAPBOX_ACCESS_TOKEN = previousToken;
  }
});
