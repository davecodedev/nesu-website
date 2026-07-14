// NESU CMS data layer — PROTOTYPE PERSISTENCE (localStorage/sessionStorage).
//
// PRODUCTION SEAM: keep these function signatures, replace the implementation.
// Real deployment needs:
//   - a database for events ({id, slug, title{uz,en,ru}, date, desc{uz,en,ru},
//     photos[] (ordered, first = cover), status: 'draft'|'published'})
//     and site content ({key, value{uz,en,ru}} + named logo asset slots)
//   - real file/object storage for uploaded images (here: data URLs)
//   - real authentication (here: hardcoded credentials + sessionStorage flag)
import { EVENTS, PARTNERS } from './site-data.js';

const EV_KEY = 'nesu-cms-events';
const CT_KEY = 'nesu-cms-content';
const LG_KEY = 'nesu-cms-logos';
const AUTH_KEY = 'nesu-admin-session';

function read(key, fb) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fb : v; }
  catch (e) { return fb; }
}
function write(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); return true; }
  catch (e) { console.warn('CMS storage write failed (quota?)', e); return false; }
}
function ping() { window.dispatchEvent(new CustomEvent('nesu-content-changed')); }

// ---- events ----
function seedEvents() {
  if (localStorage.getItem(EV_KEY)) return;
  write(EV_KEY, EVENTS.map((e) => ({
    id: e.id, slug: e.id,
    title: { en: e.title, uz: '[UZ] ' + e.title, ru: '[RU] ' + e.title },
    date: e.date, loc: e.loc || '',
    desc: { en: e.desc, uz: '[UZ] ' + e.desc, ru: '[RU] ' + e.desc },
    photos: [], status: 'published'
  })));
}
export function getEvents() { seedEvents(); return read(EV_KEY, []); }
export function getPublishedEvents() { return getEvents().filter((e) => e.status === 'published'); }
export function getEventBySlug(slug) { return getEvents().find((e) => e.slug === slug || e.id === slug) || null; }
export function saveEvent(ev) {
  const all = getEvents();
  const i = all.findIndex((x) => x.id === ev.id);
  if (i >= 0) all[i] = ev; else all.unshift(ev);
  const ok = write(EV_KEY, all);
  ping();
  return ok;
}
export function deleteEvent(id) { write(EV_KEY, getEvents().filter((e) => e.id !== id)); ping(); }
export function makeSlug(text) {
  return String(text).toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || ('ev-' + Date.now());
}

// ---- partners ----
const PT_KEY = 'nesu-cms-partners';
function seedPartners() {
  if (localStorage.getItem(PT_KEY)) return;
  write(PT_KEY, PARTNERS.map((p) => ({ id: p.id, name: p.name, mark: p.mark, img: '' })));
}
export function getPartners() { seedPartners(); return read(PT_KEY, []); }
export function savePartners(list) { write(PT_KEY, list); ping(); }

// ---- site text content overrides ----
export function getContent() { return read(CT_KEY, {}); }
export function setContent(key, vals) { const c = getContent(); c[key] = vals; write(CT_KEY, c); ping(); }

// ---- logo asset slots ----
export function getLogos() { return read(LG_KEY, {}); }
export function setLogo(slot, dataUrl) {
  const l = getLogos();
  if (dataUrl) l[slot] = dataUrl; else delete l[slot];
  write(LG_KEY, l); ping();
}

// ---- test-mode bug reports ----
// PRODUCTION SEAM: POST these to a backend (and/or forward to the staff
// Telegram channel) instead of localStorage.
const RP_KEY = 'nesu-feedback-reports';
export function saveReport(r) {
  const list = read(RP_KEY, []);
  list.push(Object.assign({ at: new Date().toISOString() }, r));
  const ok = write(RP_KEY, list);
  // Best-effort forward to staff via Telegram; local save above stays the source of truth.
  try {
    fetch('/api/telegram-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'bug_report',
        name: r.name,
        email: r.email,
        complaint: r.complaint,
        page: r.page
      })
    }).catch(() => {});
  } catch (e) {}
  return ok;
}
export function getReports() { return read(RP_KEY, []); }

// ---- auth (prototype only) ----
export function login(user, pass) {
  if (user === 'admin' && pass === 'nesu2026') {
    try { sessionStorage.setItem(AUTH_KEY, '1'); } catch (e) {}
    return true;
  }
  return false;
}
export function isLoggedIn() { try { return sessionStorage.getItem(AUTH_KEY) === '1'; } catch (e) { return false; } }
export function logout() { try { sessionStorage.removeItem(AUTH_KEY); } catch (e) {} }
