// NESU CMS data layer — backed by a shared server-side document (Vercel
// Blob storage, see api/cms-data.js and api/cms-save.js) instead of
// localStorage, so admin edits are visible to every visitor, not just the
// browser that made them. Writes require an authenticated admin session
// (see api/cms-login.js) — a signed cookie, verified server-side.

let cachedData = null;
let cachedAt = 0;
const CACHE_MS = 5000; // avoid refetching the whole document on every call within one page

async function fetchData(force) {
  if (!force && cachedData && Date.now() - cachedAt < CACHE_MS) return cachedData;
  try {
    const res = await fetch('/api/cms-data');
    cachedData = res.ok ? await res.json() : { content: {}, logos: {}, partners: [], events: [] };
  } catch (e) {
    cachedData = { content: {}, logos: {}, partners: [], events: [] };
  }
  cachedAt = Date.now();
  return cachedData;
}

function invalidateCache() { cachedData = null; }

// ---- events ----
export async function getEvents() {
  const data = await fetchData();
  return data.events || [];
}
export async function getPublishedEvents() {
  return (await getEvents()).filter((e) => e.status === 'published');
}
export async function getEventBySlug(slug) {
  const events = await getEvents();
  return events.find((e) => e.slug === slug || e.id === slug) || null;
}
export async function saveEvent(ev) {
  const res = await fetch('/api/cms-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: ev })
  });
  invalidateCache();
  return res.ok;
}
export async function deleteEvent(id) {
  await fetch('/api/cms-events', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  invalidateCache();
}
export function makeSlug(text) {
  return String(text).toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || ('ev-' + Date.now());
}

// ---- partners ----
export async function getPartners() {
  const data = await fetchData();
  return data.partners || [];
}
export async function savePartners(list) {
  const res = await fetch('/api/cms-save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'partners', list })
  });
  invalidateCache();
  return res.ok;
}

// ---- site text content overrides ----
export async function getContent() {
  const data = await fetchData();
  return data.content || {};
}
export async function setContentBatch(entries) {
  const res = await fetch('/api/cms-save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'content', entries })
  });
  invalidateCache();
  return res.ok;
}

// ---- logo asset slots ----
export async function getLogos() {
  const data = await fetchData();
  return data.logos || {};
}
export async function setLogo(slot, url) {
  const res = await fetch('/api/cms-save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'logos', slot, url: url || null })
  });
  invalidateCache();
  return res.ok;
}

// ---- image uploads ----
// Takes a data URL (as produced by FileReader/img-resize), uploads it to
// Blob storage, and returns a real hosted URL to store in an event/logo/
// partner field — never store raw data URLs in the shared document.
export async function uploadImage(dataUrl) {
  const res = await fetch('/api/cms-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataUrl })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: data.error || 'Upload failed' };
  return { ok: true, url: data.url };
}

// ---- test-mode bug reports ----
// Forwarded live via Telegram (api/telegram-notify.js) — no separate
// persistence, since there's no admin UI reading these back.
export async function saveReport(r) {
  try {
    await fetch('/api/telegram-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'bug_report', name: r.name, email: r.email, complaint: r.complaint, page: r.page })
    });
    return true;
  } catch (e) {
    return false;
  }
}

// ---- auth ----
export async function login(user, pass) {
  const res = await fetch('/api/cms-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, pass })
  });
  return res.ok;
}
export async function isLoggedIn() {
  try {
    const res = await fetch('/api/cms-session');
    const data = await res.json();
    return !!data.loggedIn;
  } catch (e) {
    return false;
  }
}
export async function logout() {
  await fetch('/api/cms-logout', { method: 'POST' });
}
