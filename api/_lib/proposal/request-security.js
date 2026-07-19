const DEFAULT_MAXIMUM_BODY_BYTES = 16_384;
const rateLimitStore = globalThis.__portfolioProposalRateLimits
  || (globalThis.__portfolioProposalRateLimits = new Map());

export class RequestSecurityError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'RequestSecurityError';
    this.statusCode = statusCode;
  }
}

function headerValue(request, name) {
  const value = request.headers?.[name];
  return Array.isArray(value) ? value[0] : value;
}

export function assertSameOrigin(request, { requireOrigin = false } = {}) {
  const fetchSite = String(headerValue(request, 'sec-fetch-site') || '').toLowerCase();
  if (fetchSite === 'cross-site') {
    throw new RequestSecurityError(403, 'Cross-site request rejected.');
  }

  const origin = headerValue(request, 'origin');
  if (!origin) {
    if (requireOrigin) {
      throw new RequestSecurityError(403, 'A same-origin request is required.');
    }
    return;
  }

  const forwardedHost = headerValue(request, 'x-forwarded-host');
  const host = String(forwardedHost || headerValue(request, 'host') || '').split(',')[0].trim().toLowerCase();
  const protocol = String(headerValue(request, 'x-forwarded-proto') || 'https')
    .split(',')[0]
    .trim()
    .toLowerCase();
  let parsedOrigin;
  try {
    parsedOrigin = new URL(String(origin));
  } catch {
    throw new RequestSecurityError(403, 'Cross-site request rejected.');
  }

  if (
    !host
    || parsedOrigin.protocol !== `${protocol}:`
    || parsedOrigin.host.toLowerCase() !== host
  ) {
    throw new RequestSecurityError(403, 'Cross-site request rejected.');
  }
}

function clientAddress(request) {
  const forwarded = String(headerValue(request, 'x-forwarded-for') || '').split(',')[0].trim();
  return forwarded || String(headerValue(request, 'x-real-ip') || request.socket?.remoteAddress || 'unknown');
}

export function assertRateLimit(request, {
  bucket,
  limit,
  windowMs,
}) {
  const now = Date.now();
  const key = `${bucket}:${clientAddress(request)}`;
  const existing = rateLimitStore.get(key);
  const entry = !existing || existing.resetAt <= now
    ? { count: 0, resetAt: now + windowMs }
    : existing;

  entry.count += 1;
  rateLimitStore.set(key, entry);

  if (entry.count > limit) {
    const error = new RequestSecurityError(429, 'Too many requests. Please try again later.');
    error.retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    throw error;
  }

  if (rateLimitStore.size > 2_000) {
    for (const [storedKey, storedEntry] of rateLimitStore) {
      if (storedEntry.resetAt <= now) rateLimitStore.delete(storedKey);
    }
  }
}

export function assertJsonRequest(request) {
  const contentType = String(headerValue(request, 'content-type') || '').toLowerCase();
  if (!contentType.startsWith('application/json')) {
    throw new RequestSecurityError(415, 'Use application/json.');
  }
}

export function assertBodySize(request, maximum = DEFAULT_MAXIMUM_BODY_BYTES) {
  const length = Number(headerValue(request, 'content-length') || 0);
  if (Number.isFinite(length) && length > maximum) {
    throw new RequestSecurityError(413, 'Request body is too large.');
  }
}

export async function parseJsonBody(request, maximum = DEFAULT_MAXIMUM_BODY_BYTES) {
  assertBodySize(request, maximum);

  if (request.body && typeof request.body === 'object' && !Buffer.isBuffer(request.body)) {
    if (Buffer.byteLength(JSON.stringify(request.body), 'utf8') > maximum) {
      throw new RequestSecurityError(413, 'Request body is too large.');
    }
    return request.body;
  }

  const parse = (source) => {
    if (Buffer.byteLength(source, 'utf8') > maximum) {
      throw new RequestSecurityError(413, 'Request body is too large.');
    }
    try {
      return JSON.parse(source || '{}');
    } catch {
      throw new RequestSecurityError(400, 'Invalid JSON request body.');
    }
  };

  if (typeof request.body === 'string') return parse(request.body);

  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.from(chunk);
    size += buffer.length;
    if (size > maximum) throw new RequestSecurityError(413, 'Request body is too large.');
    chunks.push(buffer);
  }
  return parse(Buffer.concat(chunks).toString('utf8'));
}
