import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  summarizeInventory,
  validateProposalInput,
} from '../api/_lib/proposal/core.js';
import { renderProposalHtml } from '../api/_lib/proposal/pdf-template.js';

const PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

test('validates the public fields without accepting client-supplied inventory', () => {
  assert.deepEqual(validateProposalInput({
    businessName: '  Midtown Family Dental  ',
    address: ' 600 West Peachtree Street, Atlanta, GA ',
    businessType: 'dentist',
    screens: 999999,
  }), {
    businessName: 'Midtown Family Dental',
    address: '600 West Peachtree Street, Atlanta, GA',
    businessType: 'dentist',
  });
});

test('calculates the package from server-side inventory rows', () => {
  const summary = summarizeInventory([
    { screenCount: 4, monthlyImpressions: 1_200_000, distanceMiles: 0.3 },
    { screenCount: 12, monthlyImpressions: 2_400_000, distanceMiles: 1.2 },
  ], 'dentist');
  assert.equal(summary.buildings, 2);
  assert.equal(summary.screens, 16);
  assert.equal(summary.monthlyPrice, 1120);
  assert.equal(summary.monthlyImpressions, 300000);
});

test('renders the same approved one-page proposal language and representative footer', () => {
  const html = renderProposalHtml({
    businessName: 'Midtown Family Dental',
    fullAddress: '600 West Peachtree Street, Atlanta, GA',
    businessType: 'dentist',
    logoDataUrl: PIXEL,
    compositeDataUrl: PIXEL,
    mapDataUrl: PIXEL,
    buildings: 92,
    screens: 327,
    monthlyImpressions: 223_500_000,
    monthlyPrice: 22_890,
    proposalCopy: {
      headline: 'Your Next 50 Patients Live in These {{screens}} Buildings',
      valueProps: ['One', 'Two', 'Three', 'Four'],
    },
    repName: 'Sales Representative',
    repTitle: 'Account Executive',
    repPhone: '(000) 000-0000',
    repEmail: 'hello@verticalimpression.com',
  });
  assert.match(html, /proposal-page--dark/);
  assert.match(html, /Your Next 50 Patients/);
  assert.match(html, /92 Buildings/);
  assert.match(html, /Sales Representative/);
  assert.match(html, /\(000\) 000-0000/);
  assert.doesNotMatch(html, /vi-automation|POSTGRES|MAPBOX_ACCESS_TOKEN|LETZAI_API_KEY/i);
});

test('uses inline address suggestions instead of a confirmation modal', async () => {
  const [html, client] = await Promise.all([
    readFile(new URL('../proposal-generator.html', import.meta.url), 'utf8'),
    readFile(new URL('../proposal-generator.js', import.meta.url), 'utf8'),
  ]);
  assert.match(html, /role="combobox"/);
  assert.match(html, /role="listbox"/);
  assert.doesNotMatch(html, /role="dialog"/);
  assert.match(client, /\/api\/proposal\/suggest/);
  assert.match(client, /\/api\/proposal\/generate/);
  assert.match(client, /URL\.createObjectURL/);
  assert.match(html, /<iframe/);
});

test('keeps secrets and VI application dependencies out of browser code', async () => {
  const files = await Promise.all([
    readFile(new URL('../proposal-generator.html', import.meta.url), 'utf8'),
    readFile(new URL('../proposal-generator.js', import.meta.url), 'utf8'),
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
  ]);
  const source = files.join('\n');
  assert.doesNotMatch(source, /MAPBOX_ACCESS_TOKEN|LETZAI_API_KEY|api\.letz\.ai|vi-automation\.vercel\.app/i);
});

test('applies request guards before expensive proposal generation', async () => {
  const [generate, suggest] = await Promise.all([
    readFile(new URL('../api/proposal/generate.js', import.meta.url), 'utf8'),
    readFile(new URL('../api/proposal/suggest.js', import.meta.url), 'utf8'),
  ]);

  assert.match(generate, /assertSameOrigin\(request, \{ requireOrigin: true \}\)/);
  assert.match(generate, /assertJsonRequest\(request\)/);
  assert.match(generate, /assertRateLimit\(request/);
  assert.match(generate, /parseJsonBody\(request/);
  assert.match(suggest, /assertRateLimit\(request/);
  assert.match(suggest, /query\.length > 180/);
  assert.doesNotMatch(generate, /Access-Control-Allow-Origin/i);
  assert.doesNotMatch(suggest, /Access-Control-Allow-Origin/i);
});

test('presents the V2 proposal builder as a compact portfolio tool', async () => {
  const [html, client] = await Promise.all([
    readFile(new URL('../proposal-generator.html', import.meta.url), 'utf8'),
    readFile(new URL('../proposal-generator.js', import.meta.url), 'utf8'),
  ]);

  assert.match(html, /<h1 id="proposal-title">A local proposal, assembled around the business\.<\/h1>/);
  assert.match(html, /This proposal was one output of the local prospecting workflow/i);
  assert.match(html, /Custom ad/);
  assert.match(html, /Live screen count/);
  assert.match(html, /Local map/);
  assert.doesNotMatch(html, /simplified public demonstration|API credentials remain server-side/i);
  assert.match(html, /https:\/\/www\.linkedin\.com\//);
  assert.match(html, /https:\/\/github\.com\//);
  assert.match(html, /Generate to complete/);
  assert.match(client, /Generate to complete/);
});
