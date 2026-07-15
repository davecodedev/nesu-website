// Thin wrapper around the Telegram Bot API. Server-side only — never expose
// TELEGRAM_BOT_TOKEN to the browser.

async function call(method, params) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN not configured');
  const r = await fetch('https://api.telegram.org/bot' + token + '/' + method, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  const data = await r.json();
  if (!data.ok) {
    throw new Error('Telegram API error (' + method + '): ' + (data.description || 'unknown'));
  }
  return data.result;
}

function channelId() {
  const id = process.env.TELEGRAM_CHANNEL;
  if (!id) throw new Error('TELEGRAM_CHANNEL not configured');
  return id;
}

module.exports = {
  call,
  channelId,
  sendMessage: (chatId, text, extra) => call('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', ...extra }),
  sendPhoto: (chatId, photo, caption, extra) => call('sendPhoto', { chat_id: chatId, photo, caption, parse_mode: 'HTML', ...extra }),
  sendPoll: (chatId, params) => call('sendPoll', { chat_id: chatId, ...params }),
  editMessageCaption: (chatId, messageId, caption, extra) => call('editMessageCaption', { chat_id: chatId, message_id: messageId, caption, parse_mode: 'HTML', ...extra }),
  answerCallbackQuery: (callbackQueryId, text) => call('answerCallbackQuery', { callback_query_id: callbackQueryId, text })
};
