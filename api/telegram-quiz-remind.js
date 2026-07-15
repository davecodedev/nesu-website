// Heads-up post before the quiz — triggered by GitHub Actions crons at
// 19:50 and 19:55 Tashkent time on Mon/Wed/Fri, i.e. 10 and 5 minutes
// before the 20:00 quiz. Which one fires is passed as ?minutes=10 or
// ?minutes=5.

const { sendMessage, channelId } = require('./_lib/telegram');
const { isAuthorizedCron } = require('./_lib/auth');
const { isLive, tashkentWeekday } = require('./_lib/content');

const QUIZ_WEEKDAYS = [1, 3, 5]; // Mon, Wed, Fri

const MESSAGES = {
  10: '⏰ <b>10 minutes</b> until tonight’s NESU quiz! 10 questions on science & engineering — first one drops at 20:00. Turn on notifications so you don’t miss it! 🔔',
  5: '⏰ <b>5 minutes</b> to go! Quiz starts at 20:00 sharp — 10 questions, are you ready? 🧠'
};

module.exports = async (req, res) => {
  if (!isAuthorizedCron(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const now = new Date();
  if (!isLive(now) || !QUIZ_WEEKDAYS.includes(tashkentWeekday(now))) {
    res.status(200).json({ ok: true, skipped: true });
    return;
  }

  const url = new URL(req.url, 'http://localhost');
  const minutes = url.searchParams.get('minutes');
  const text = MESSAGES[minutes];
  if (!text) {
    res.status(400).json({ error: 'minutes must be 10 or 5' });
    return;
  }

  try {
    await sendMessage(channelId(), text);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(502).json({ error: 'Reminder failed', detail: String(e.message || e) });
  }
};
