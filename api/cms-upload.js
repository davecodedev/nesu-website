// Auth-gated image upload — decodes a data URL and stores it as a real file
// in Vercel Blob, returning a public URL. Keeps large images out of the CMS
// JSON document entirely (which would otherwise bloat every read/write).
const { putBlob } = require('../lib/blob-rest');
const { verifySession } = require('../lib/cms-auth');

const MAX_BYTES = 4 * 1024 * 1024;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!verifySession(req)) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const dataUrl = String(body.dataUrl || '');
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    res.status(400).json({ error: 'Expected an image data URL' });
    return;
  }
  const mime = match[1];
  const buf = Buffer.from(match[2], 'base64');
  if (buf.length > MAX_BYTES) {
    res.status(413).json({ error: 'Image too large (max 4MB)' });
    return;
  }

  const ext = (mime.split('/')[1] || 'jpg').replace(/[^a-z0-9]/gi, '');
  const name = 'uploads/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;

  try {
    const blob = await putBlob(name, buf, mime);
    res.status(200).json({ url: blob.url });
  } catch (e) {
    console.error('[cms-upload] put failed:', e && e.message, e);
    res.status(502).json({ error: 'Upload failed' });
  }
};
