// Shared CRON_SECRET check for the scheduled endpoints — triggered by
// GitHub Actions (see .github/workflows), which sends it as a Bearer token.

function isAuthorizedCron(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // no secret configured — allow (dev/local)
  const header = req.headers['authorization'];
  if (header === 'Bearer ' + secret) return true;
  const url = new URL(req.url, 'http://localhost');
  return url.searchParams.get('secret') === secret;
}

module.exports = { isAuthorizedCron };
