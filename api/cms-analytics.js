// Admin read of the analytics document — requires a valid admin session.
const { verifySession } = require('../lib/cms-auth');
const { loadAnalytics } = require('../lib/analytics-db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!verifySession(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const db = await loadAnalytics();
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(db);
};
