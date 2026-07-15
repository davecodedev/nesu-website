// Shared JSON "database" for the CMS — a single document stored in Vercel
// Blob storage. Low write volume, single admin editor, so a whole-document
// read-modify-write with no locking is an acceptable simplification.
const { put, list, del } = require('@vercel/blob');

const DB_PATHNAME = 'cms/data.json';

function defaultDb() {
  return { content: {}, logos: {}, partners: [], events: [] };
}

async function loadDb() {
  try {
    const { blobs } = await list({ prefix: DB_PATHNAME, limit: 1 });
    if (!blobs.length) return defaultDb();
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!res.ok) return defaultDb();
    const data = await res.json();
    return Object.assign(defaultDb(), data);
  } catch (e) {
    return defaultDb();
  }
}

async function saveDb(db) {
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
    // Older/newer @vercel/blob versions may reject allowOverwrite, or a blob
    // may already exist at this pathname — fall back to delete-then-put.
    try {
      const { blobs } = await list({ prefix: DB_PATHNAME, limit: 1 });
      if (blobs.length) await del(blobs[0].url);
    } catch (e2) {}
    await put(DB_PATHNAME, body, opts);
  }
}

module.exports = { loadDb, saveDb };
