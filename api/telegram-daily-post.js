// Daily "Did you know?" post to the NESU Telegram channel — triggered by a
// GitHub Actions cron at 10:00 Tashkent time (see .github/workflows). Sent
// as a single photo+caption (via Pexels, if PEXELS_API_KEY is set) when the
// text fits Telegram's 1024-character caption limit; falls back to a
// text-only message if it doesn't, or if no image was found.

const { sendMessage, sendPhoto, channelId } = require('./_lib/telegram');
const { fetchImage } = require('./_lib/pexels');
const { isAuthorizedCron } = require('./_lib/auth');
const { CTA, DID_YOU_KNOW, pickForToday } = require('./_lib/content');

const CAPTION_LIMIT = 1024;

function formatPost(item) {
  return `${item.emoji} <b>Did you know? — ${item.title}</b>\n\n${item.body}\n\n${CTA}\n\n#NESU #Engineering #${item.hashtag}\n\n@nesuuz`;
}

module.exports = async (req, res) => {
  if (!isAuthorizedCron(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const now = new Date();
  const item = pickForToday(DID_YOU_KNOW, now);
  const text = formatPost(item);

  try {
    const imageUrl = await fetchImage(item.search);
    if (imageUrl && text.length <= CAPTION_LIMIT) {
      await sendPhoto(channelId(), imageUrl, text);
    } else {
      if (imageUrl) await sendPhoto(channelId(), imageUrl);
      await sendMessage(channelId(), text);
    }
    res.status(200).json({ ok: true, slug: item.slug, image: !!imageUrl });
  } catch (e) {
    res.status(502).json({ error: 'Daily post failed', detail: String(e.message || e) });
  }
};
