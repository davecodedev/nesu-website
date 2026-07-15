// Minimal server-side admin session: a signed, expiring cookie — no external
// auth service or database needed. The signing key is ADMIN_PASSWORD itself,
// which is an acceptable tradeoff for this site's threat model (a single
// internal editor login, not a multi-tenant or financial system).
const crypto = require('crypto');

const COOKIE_NAME = 'nesu_admin_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function secret() {
  const s = process.env.ADMIN_PASSWORD;
  if (!s) throw new Error('ADMIN_PASSWORD not configured');
  return s;
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

function createSessionCookie() {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = String(expires);
  const token = payload + '.' + sign(payload);
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  return COOKIE_NAME + '=' + token + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=' + maxAge;
}

function clearSessionCookie() {
  return COOKIE_NAME + '=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';
}

function parseCookies(req) {
  const header = (req.headers && req.headers.cookie) || '';
  const out = {};
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

function verifySession(req) {
  try {
    const token = parseCookies(req)[COOKIE_NAME];
    if (!token) return false;
    const dot = token.indexOf('.');
    if (dot === -1) return false;
    const payload = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const expected = sign(payload);
    if (sig.length !== expected.length) return false;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
    const expires = Number(payload);
    if (!Number.isFinite(expires) || Date.now() > expires) return false;
    return true;
  } catch (e) {
    return false;
  }
}

function checkPassword(user, pass) {
  const expectedUser = process.env.ADMIN_USER || 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD || '';
  if (!expectedPass) return false;
  const passBuf = Buffer.from(String(pass || ''));
  const expBuf = Buffer.from(expectedPass);
  const passOk = passBuf.length === expBuf.length && crypto.timingSafeEqual(passBuf, expBuf);
  return user === expectedUser && passOk;
}

module.exports = { createSessionCookie, clearSessionCookie, verifySession, checkPassword };
