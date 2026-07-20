// Thin fetch-based client for the Vercel Blob REST API. Exists because the
// @vercel/blob SDK's put() hard-crashes the deployed function runtime
// (FUNCTION_INVOCATION_FAILED that bypasses try/catch) — plain REST calls
// against blob.vercel-storage.com work reliably and need no dependency.
const API = 'https://blob.vercel-storage.com';

function token() {
  const t = process.env.BLOB_READ_WRITE_TOKEN;
  if (!t) throw new Error('BLOB_READ_WRITE_TOKEN not configured');
  return t;
}

// Uploads (or overwrites) a blob at an exact pathname. body: string or Buffer.
async function putBlob(pathname, body, contentType) {
  const res = await fetch(API + '/' + pathname, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token(),
      'Content-Type': contentType || 'application/octet-stream',
      'x-vercel-blob-access': 'public',
      'x-add-random-suffix': '0',
      'x-allow-overwrite': 'true',
      'x-cache-control-max-age': '0'
    },
    body
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error('blob put ' + pathname + ' failed: HTTP ' + res.status + ' ' + text.slice(0, 200));
  }
  return res.json();
}

// Lists blobs under a prefix, following pagination. Returns [{pathname, url, ...}].
async function listBlobs(prefix, maxPages) {
  const out = [];
  let cursor = '';
  for (let page = 0; page < (maxPages || 10); page++) {
    const url = API + '/?limit=1000&prefix=' + encodeURIComponent(prefix) + (cursor ? '&cursor=' + encodeURIComponent(cursor) : '');
    const res = await fetch(url, { headers: { Authorization: 'Bearer ' + token() } });
    if (!res.ok) throw new Error('blob list failed: HTTP ' + res.status);
    const data = await res.json();
    out.push.apply(out, data.blobs || []);
    if (!data.hasMore || !data.cursor) break;
    cursor = data.cursor;
  }
  return out;
}

async function deleteBlobs(urls) {
  if (!urls.length) return;
  for (let i = 0; i < urls.length; i += 100) {
    const res = await fetch(API + '/delete', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls: urls.slice(i, i + 100) })
    });
    if (!res.ok) throw new Error('blob delete failed: HTTP ' + res.status);
  }
}

// Fetches a blob's JSON content with a CDN cache-buster.
async function fetchBlobJson(url) {
  const res = await fetch(url + (url.indexOf('?') === -1 ? '?' : '&') + 't=' + Date.now(), { cache: 'no-store' });
  if (!res.ok) throw new Error('blob fetch failed: HTTP ' + res.status);
  return res.json();
}

module.exports = { putBlob, listBlobs, deleteBlobs, fetchBlobJson };
