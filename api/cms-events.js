// GET: public list of all events (published + draft — callers filter).
// POST/DELETE: auth-gated create/update/remove of a single event.
const { verifySession } = require('../lib/cms-auth');
const { loadDb, saveDb } = require('../lib/cms-db');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const db = await loadDb();
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=10, stale-while-revalidate=30');
    res.status(200).json({ events: db.events });
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

  if (req.method === 'POST') {
    const ev = body.event;
    if (!ev || !ev.id) { res.status(400).json({ error: 'Missing event' }); return; }
    const db = await loadDb();
    const i = db.events.findIndex((x) => x.id === ev.id);
    if (i >= 0) db.events[i] = ev; else db.events.unshift(ev);
    try {
      await saveDb(db);
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(502).json({ error: 'Failed to save' });
    }
    return;
  }

  if (req.method === 'DELETE') {
    const id = body.id || (req.query && req.query.id);
    const db = await loadDb();
    db.events = db.events.filter((e) => e.id !== id);
    try {
      await saveDb(db);
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(502).json({ error: 'Failed to save' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
