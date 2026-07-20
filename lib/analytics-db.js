// Visitor analytics store — daily aggregates in a single Blob document,
// kept separate from the CMS document so high-frequency tracking writes can
// never clobber edited site content. Same read-modify-write simplification
// as cms-db.js: a lost increment under concurrent writes is acceptable here.
const { put, list, del } = require('@vercel/blob');

const DB_PATHNAME = 'cms/analytics.json';
const KEEP_DAYS = 90;

function defaultDb() {
  return { totalVisitors: 0, days: {} };
}

async function loadAnalytics() {
  try {
    const { blobs } = await list({ prefix: DB_PATHNAME, limit: 1 });
    if (!blobs.length) return defaultDb();
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!res.ok) return defaultDb();
    const data = await res.json();
    return Object.assign(defaultDb(), data);
  } catch (e) {
    console.error('[analytics-db] load failed:', e && e.message);
    return defaultDb();
  }
}

async function saveAnalytics(db) {
  // Prune to the newest KEEP_DAYS days so the document stays small forever.
  const keys = Object.keys(db.days).sort();
  while (keys.length > KEEP_DAYS) delete db.days[keys.shift()];
  const body = JSON.stringify(db);
  const opts = {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
    cacheControlMaxAge: 0
  };
  try {
    await put(DB_PATHNAME, body, Object.assign({ allowOverwrite: true }, opts));
  } catch (e) {
    console.error('[analytics-db] save allowOverwrite put failed:', e && e.message);
    try {
      const { blobs } = await list({ prefix: DB_PATHNAME, limit: 1 });
      if (blobs.length) await del(blobs[0].url);
    } catch (e2) {
      console.error('[analytics-db] save cleanup failed:', e2 && e2.message);
    }
    await put(DB_PATHNAME, body, opts);
  }
}

module.exports = { loadAnalytics, saveAnalytics };
