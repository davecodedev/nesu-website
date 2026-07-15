// Telegram webhook: lets the NESU admin submit an event photo + description
// in a private chat with the bot, previews it as a channel post, and only
// posts to the real channel after the admin taps "Approve" on the preview.
// No database — the pending draft lives entirely in the Telegram message the
// bot sends back (its photo file_id + caption), which comes back to us
// inside callback_query.message when the button is tapped.

const { sendMessage, sendPhoto, editMessageCaption, answerCallbackQuery, channelId } = require('./_lib/telegram');

function isAdmin(id) {
  const adminId = process.env.TELEGRAM_ADMIN_ID;
  return adminId && String(id) === String(adminId);
}

function isFromTelegram(req) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) return true; // no secret configured — allow (dev/local)
  return req.headers['x-telegram-bot-api-secret-token'] === secret;
}

function formatDraft(description) {
  return `${description}\n\n#NESU`;
}

async function handlePhotoSubmission(message) {
  const from = message.from.id;
  const photos = message.photo || [];
  const fileId = photos.length ? photos[photos.length - 1].file_id : null;
  const description = (message.caption || '').trim();

  if (!fileId) return;
  if (!description) {
    await sendMessage(from, 'Got the photo — reply with a caption describing the event and I\'ll show you a preview to approve.');
    return;
  }

  const draft = formatDraft(description);
  await sendPhoto(from, fileId, draft, {
    reply_markup: {
      inline_keyboard: [[
        { text: '✅ Approve & post', callback_data: 'approve' },
        { text: '❌ Discard', callback_data: 'reject' }
      ]]
    }
  });
}

async function handleCallback(callbackQuery) {
  const from = callbackQuery.from.id;
  const msg = callbackQuery.message;
  if (!isAdmin(from)) {
    await answerCallbackQuery(callbackQuery.id, 'Not authorized.');
    return;
  }

  if (callbackQuery.data === 'approve') {
    const photos = msg.photo || [];
    const fileId = photos.length ? photos[photos.length - 1].file_id : null;
    const caption = msg.caption || '';
    if (!fileId) {
      await answerCallbackQuery(callbackQuery.id, 'No photo found on this draft.');
      return;
    }
    await sendPhoto(channelId(), fileId, caption);
    await answerCallbackQuery(callbackQuery.id, 'Posted to channel ✅');
    await editMessageCaption(from, msg.message_id, caption + '\n\n✅ <b>Posted to channel.</b>', { reply_markup: { inline_keyboard: [] } });
  } else if (callbackQuery.data === 'reject') {
    await answerCallbackQuery(callbackQuery.id, 'Discarded.');
    await editMessageCaption(from, msg.message_id, (msg.caption || '') + '\n\n❌ <b>Discarded.</b>', { reply_markup: { inline_keyboard: [] } });
  } else {
    await answerCallbackQuery(callbackQuery.id, '');
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!isFromTelegram(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  let update = req.body;
  if (typeof update === 'string') {
    try { update = JSON.parse(update); } catch (e) { update = {}; }
  }
  update = update || {};

  // Always ack fast — Telegram retries on non-200 / slow responses.
  res.status(200).json({ ok: true });

  try {
    if (update.message && update.message.photo && isAdmin(update.message.from.id)) {
      await handlePhotoSubmission(update.message);
    } else if (update.message && update.message.text && isAdmin(update.message.from.id)) {
      await sendMessage(update.message.from.id, 'Send me a photo with a caption describing the event, and I\'ll show you a channel post preview to approve or discard.');
    } else if (update.callback_query) {
      await handleCallback(update.callback_query);
    }
  } catch (e) {
    // Best-effort: nothing more we can do once the 200 ack has been sent.
    console.error('telegram-webhook error:', e);
  }
};
