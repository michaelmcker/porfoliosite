import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

const DEFAULT_MAXIMUM_IMAGE_BYTES = 15 * 1024 * 1024;
const DEFAULT_TIMEOUT_MS = 20_000;
const MAXIMUM_REDIRECTS = 3;

function isPrivateIpv4(address) {
  const parts = address.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return false;
  const [a, b] = parts;
  return (
    a === 0
    || a === 10
    || a === 127
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168)
    || a >= 224
  );
}

function isPrivateAddress(address) {
  if (isIP(address) === 4) return isPrivateIpv4(address);
  if (isIP(address) !== 6) return false;
  const normalized = address.toLowerCase();
  return (
    normalized === '::'
    || normalized === '::1'
    || normalized.startsWith('fc')
    || normalized.startsWith('fd')
    || /^fe[89ab]/.test(normalized)
    || normalized.startsWith('::ffff:127.')
    || normalized.startsWith('::ffff:10.')
    || normalized.startsWith('::ffff:192.168.')
  );
}

async function assertPublicHttpsUrl(value, resolveDns) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error('Remote image URL is invalid.');
  }
  if (parsed.protocol !== 'https:') throw new Error('Remote images must use HTTPS.');
  if (parsed.username || parsed.password || (parsed.port && parsed.port !== '443')) {
    throw new Error('Remote image URL is not allowed.');
  }
  if (parsed.hostname === 'localhost' || isPrivateAddress(parsed.hostname)) {
    throw new Error('Remote image URL resolves to a private or local address.');
  }

  if (resolveDns && !isIP(parsed.hostname)) {
    const addresses = await lookup(parsed.hostname, { all: true, verbatim: true });
    if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) {
      throw new Error('Remote image URL resolves to a private or local address.');
    }
  }
  return parsed;
}

async function fetchWithoutUnsafeRedirects(url, fetchImpl, signal) {
  let current = url;
  for (let redirect = 0; redirect <= MAXIMUM_REDIRECTS; redirect += 1) {
    const parsed = await assertPublicHttpsUrl(current, fetchImpl === globalThis.fetch);
    const response = await fetchImpl(parsed, {
      cache: 'no-store',
      redirect: 'manual',
      signal,
    });
    if (![301, 302, 303, 307, 308].includes(response.status)) return response;
    const location = response.headers.get('location');
    if (!location || redirect === MAXIMUM_REDIRECTS) throw new Error('Remote image redirected too many times.');
    current = new URL(location, parsed).toString();
  }
  throw new Error('Remote image redirected too many times.');
}

async function readWithLimit(response, maximum) {
  const declaredLength = Number(response.headers.get('content-length') || 0);
  if (Number.isFinite(declaredLength) && declaredLength > maximum) {
    throw new Error('Remote image is too large.');
  }

  if (!response.body?.getReader) {
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > maximum) throw new Error('Remote image is too large.');
    return buffer;
  }

  const chunks = [];
  let length = 0;
  const reader = response.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maximum) {
        await reader.cancel();
        throw new Error('Remote image is too large.');
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks, length);
}

export async function fetchImageAsDataUrl(url, {
  fetchImpl = globalThis.fetch,
  maxBytes = DEFAULT_MAXIMUM_IMAGE_BYTES,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchWithoutUnsafeRedirects(url, fetchImpl, controller.signal);
    if (!response.ok) throw new Error(`Remote image request failed with ${response.status}.`);
    const contentType = String(response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!contentType.startsWith('image/')) throw new Error('Remote asset was not an image response.');
    const buffer = await readWithLimit(response, maxBytes);
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } finally {
    clearTimeout(timeout);
  }
}
