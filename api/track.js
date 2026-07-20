// Public tracking beacon — no auth (it is hit by every visitor). Accepts two
// event types from analytics.js: a 'view' when a page loads and a 'leave'
// carrying the seconds the page was actually visible. Aggregates into daily
// per-page counters; never stores anything that identifies the visitor.
const { loadAnalytics, saveAnalytics } = require('../lib/analytics-db');

module.exports = async (req, res) => {
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

  const db = await loadAnalytics();
  const day = new Date().toISOString().slice(0, 10);
  const d = db.days[day] = db.days[day] || { views: 0, visitors: 0, durSum: 0, durN: 0, pages: {} };
  const p = d.pages[path] = d.pages[path] || { views: 0, durSum: 0, durN: 0 };

  if (type === 'view') {
    d.views += 1;
    p.views += 1;
    if (b.newToday) d.visitors += 1;
    if (b.newVisitor) db.totalVisitors = (db.totalVisitors || 0) + 1;
  } else {
    const s = Math.max(0, Math.min(7200, Math.round(Number(b.seconds) || 0)));
    if (s > 0) {
      d.durSum += s; d.durN += 1;
      p.durSum += s; p.durN += 1;
    }
  }

  await saveAnalytics(db);
  res.status(204).end();
};
