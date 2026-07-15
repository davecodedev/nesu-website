// Daily "Did you know?" post to the NESU Telegram channel — triggered by a
// GitHub Actions cron at 10:00 Tashkent time (see .github/workflows). An
// image (via Pexels, if PEXELS_API_KEY is set) is sent first, followed by
// the full write-up as a separate message — kept separate rather than used
// as a photo caption because Telegram caps photo captions at 1024
// characters and these posts can run close to that limit.

const { sendMessage, sendPhoto, channelId } = require('./_lib/telegram');
const { fetchImage } = require('./_lib/pexels');
const { isAuthorizedCron } = require('./_lib/auth');
const { CTA, DID_YOU_KNOW, pickForToday } = require('./_lib/content');

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

  try {
    const imageUrl = await fetchImage(item.search);
    if (imageUrl) {
      await sendPhoto(channelId(), imageUrl);
    }
    await sendMessage(channelId(), formatPost(item));
    res.status(200).json({ ok: true, slug: item.slug, image: !!imageUrl });
  } catch (e) {
    res.status(502).json({ error: 'Daily post failed', detail: String(e.message || e) });
  }
};
