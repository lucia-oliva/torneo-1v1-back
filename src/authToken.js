import crypto from 'crypto';

const COOKIE_NAME = 'nova_admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function getAuthSecret() {
  return process.env.AUTH_SECRET || process.env.JWT_SECRET || 'dev-only-change-this-secret';
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signPayload(payload) {
  return crypto.createHmac('sha256', getAuthSecret()).update(payload).digest('base64url');
}

function constantTimeEquals(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));

  if (left.length !== right.length) return false;

  return crypto.timingSafeEqual(left, right);
}

function parseCookieHeader(cookieHeader = '') {
  return cookieHeader.split(';').reduce((cookies, part) => {
    const [rawName, ...rawValue] = part.trim().split('=');
    if (!rawName) return cookies;

    cookies[rawName] = decodeURIComponent(rawValue.join('='));
    return cookies;
  }, {});
}

function getCookieOptions(maxAgeSeconds) {
  const sameSite = process.env.AUTH_COOKIE_SAMESITE || 'Lax';
  const secure =
    process.env.AUTH_COOKIE_SECURE === 'true' ||
    sameSite.toLowerCase() === 'none' ||
    process.env.NODE_ENV === 'production';

  return [
    `${COOKIE_NAME}=`,
    'HttpOnly',
    `SameSite=${sameSite}`,
    'Path=/',
    `Max-Age=${maxAgeSeconds}`,
    secure ? 'Secure' : '',
  ].filter(Boolean);
}

export function createSessionCookie(user) {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = base64UrlEncode(
    JSON.stringify({
      email: user.email,
      role: user.role,
      exp: expiresAt,
    })
  );
  const signature = signPayload(payload);
  const cookie = getCookieOptions(SESSION_MAX_AGE_SECONDS);

  cookie[0] = `${COOKIE_NAME}=${encodeURIComponent(`${payload}.${signature}`)}`;
  return cookie.join('; ');
}

export function createExpiredSessionCookie() {
  return getCookieOptions(0).join('; ');
}

export function readSessionFromRequest(req) {
  const cookies = parseCookieHeader(req.headers.cookie);
  const token = cookies[COOKIE_NAME];

  if (!token) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  if (!constantTimeEquals(signPayload(payload), signature)) return null;

  try {
    const session = JSON.parse(base64UrlDecode(payload));
    if (!session.exp || session.exp < Date.now()) return null;

    return {
      email: session.email,
      role: session.role,
    };
  } catch {
    return null;
  }
}

export function verifyAdminPassword(password) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || !password) {
    return false;
  }

  return constantTimeEquals(password, adminPassword);
}
