const { createSessionCookie, checkPassword } = require('../lib/cms-auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const ok = checkPassword(String(body.user || ''), String(body.pass || ''));
  if (!ok) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }

  res.setHeader('Set-Cookie', createSessionCookie());
  res.status(200).json({ ok: true });
};
