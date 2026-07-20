// Combined analytics endpoint (Hobby plan allows max 12 serverless functions):
//   POST → public tracking beacon from analytics.js ('view' and 'leave' events),
//          each recorded as an append-only event blob — anonymous, race-free
//   GET  → admin read: aggregated daily/per-page stats (requires session)
const { verifySession } = require('../lib/cms-auth');
const { recordEvent, getAnalytics } = require('../lib/analytics-db');

module.exports = async (req, res) => {
  try {
    await handler(req, res);
  } catch (e) {
    console.error('[analytics] unhandled:', e && e.message);
    res.status(500).json({ error: 'analytics_failed' });
  }
};

async function handler(req, res) {
  if (req.method === 'GET') {
    if (!verifySession(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const data = await getAnalytics();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(data);
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let b = req.body;
  if (typeof b === 'string') {
    try { b = JSON.parse(b); } catch (e) { b = null; }
  }
  if (!b || typeof b !== 'object') {
    res.status(400).json({ error: 'Bad request' });
    return;
  }
  const type = b.type === 'view' ? 'view' : b.type === 'leave' ? 'leave' : null;
  if (!type) {
    res.status(400).json({ error: 'Bad request' });
    return;
  }
  let path = String(b.path || '/').split('?')[0].split('#')[0].slice(0, 120);
  if (path.charAt(0) !== '/') path = '/' + path;
  if (path.indexOf('admin') !== -1) { res.status(204).end(); return; }

  await recordEvent({
    type,
    path,
    seconds: Math.max(0, Math.min(7200, Math.round(Number(b.seconds) || 0))),
    newVisitor: !!b.newVisitor,
    newToday: !!b.newToday
  });
  res.status(204).end();
}
