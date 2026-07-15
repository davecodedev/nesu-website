// Public read of the whole CMS document — no auth required. Used by every
// page (site text overrides, logos, partners, published events).
const { loadDb } = require('../lib/cms-db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const db = await loadDb();
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=10, stale-while-revalidate=30');
  res.status(200).json(db);
};
