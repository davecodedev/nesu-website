// Combined auth endpoint (Hobby plan allows max 12 serverless functions, so
// login/logout/session-check share one function, routed by HTTP method):
//   GET    → { loggedIn } session check
//   POST   → login with { user, pass }, sets the signed session cookie
//   DELETE → logout, clears the cookie
const { createSessionCookie, clearSessionCookie, verifySession, checkPassword } = require('../lib/cms-auth');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    res.status(200).json({ loggedIn: verifySession(req) });
    return;
  }

  if (req.method === 'POST') {
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
    return;
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearSessionCookie());
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
