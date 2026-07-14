// Forwards AI assistant questions and bug reports to a staff Telegram chat.
// Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID env vars (Vercel project settings).
// Never exposes the bot token to the browser — this runs server-side only.
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    res.status(500).json({ error: 'Telegram not configured' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const page = typeof body.page === 'string' ? body.page.slice(0, 200) : '';
  let text;
  if (body.type === 'assistant_question') {
    const question = String(body.question || '').slice(0, 1000);
    if (!question.trim()) { res.status(400).json({ error: 'Missing question' }); return; }
    text = 'NESU Assistant question\n\n' + question + (page ? '\n\nPage: ' + page : '');
  } else if (body.type === 'bug_report') {
    const name = String(body.name || '').trim().slice(0, 200) || '(no name)';
    const email = String(body.email || '').trim().slice(0, 200) || '(no email)';
    const complaint = String(body.complaint || '').slice(0, 1000);
    text = 'NESU bug report\n\nFrom: ' + name + ' <' + email + '>\n\n' + complaint + (page ? '\n\nPage: ' + page : '');
  } else {
    res.status(400).json({ error: 'Unknown type' });
    return;
  }

  try {
    const r = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    const data = await r.json();
    if (!data.ok) {
      res.status(502).json({ error: 'Telegram API error', detail: data.description || null });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(502).json({ error: 'Failed to reach Telegram' });
  }
};
