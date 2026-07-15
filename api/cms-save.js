// Auth-gated writes for site content overrides, logos, and the partner list.
// Events have their own endpoint (api/cms-events.js) since they're a list
// with per-item create/update/delete rather than a whole-section replace.
const { verifySession } = require('../lib/cms-auth');
const { loadDb, saveDb } = require('../lib/cms-db');

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

  const db = await loadDb();

  if (body.section === 'content') {
    const entries = body.entries && typeof body.entries === 'object' ? body.entries : {};
    db.content = Object.assign({}, db.content, entries);
  } else if (body.section === 'logos') {
    const slot = String(body.slot || '');
    if (!slot) { res.status(400).json({ error: 'Missing slot' }); return; }
    if (body.url) db.logos[slot] = body.url; else delete db.logos[slot];
  } else if (body.section === 'partners') {
    if (!Array.isArray(body.list)) { res.status(400).json({ error: 'Missing list' }); return; }
    db.partners = body.list;
  } else {
    res.status(400).json({ error: 'Unknown section' });
    return;
  }

  try {
    await saveDb(db);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(502).json({ error: 'Failed to save' });
  }
};
