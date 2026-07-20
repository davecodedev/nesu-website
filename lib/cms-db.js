// Shared JSON "database" for the CMS — a single document stored in Vercel
// Blob storage. Low write volume, single admin editor, so a whole-document
// read-modify-write with no locking is an acceptable simplification.
// Uses the Blob REST API via lib/blob-rest.js: the @vercel/blob SDK's put()
// hard-crashes the deployed function runtime, and plain fetch does not.
const { putBlob, listBlobs, fetchBlobJson } = require('./blob-rest');

const DB_PATHNAME = 'cms/data.json';

function defaultDb() {
  return { content: {}, logos: {}, partners: [], events: [] };
}

async function loadDb() {
  try {
    const blobs = await listBlobs(DB_PATHNAME, 1);
    if (!blobs.length) return defaultDb();
    const data = await fetchBlobJson(blobs[0].url);
    return Object.assign(defaultDb(), data);
  } catch (e) {
    console.error('[cms-db] loadDb failed:', e && e.message, e);
    return defaultDb();
  }
}

async function saveDb(db) {
  await putBlob(DB_PATHNAME, JSON.stringify(db), 'application/json');
}

module.exports = { loadDb, saveDb };
