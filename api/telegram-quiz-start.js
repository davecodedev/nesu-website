// Quiz — triggered by a GitHub Actions cron at 20:00 Tashkent time on
// Mon/Wed/Fri. Sends an intro line, 10 quiz polls back to back, then a
// closing prompt asking players to self-report their score (Telegram quiz
// polls are anonymous, so this is the only way to see how people did).

const { sendMessage, sendPoll, channelId } = require('./_lib/telegram');
const { isAuthorizedCron } = require('./_lib/auth');
const { QUIZ_SEEDS, pickTenForToday, isLive, tashkentWeekday } = require('./_lib/content');

const QUIZ_WEEKDAYS = [1, 3, 5]; // Mon, Wed, Fri

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

  const questions = pickTenForToday(QUIZ_SEEDS, now);

  try {
    await sendMessage(channelId(), '🧠 <b>Quiz time!</b> 10 questions, one at a time. Good luck! 👇');
    for (const q of questions) {
      await sendPoll(channelId(), {
        question: `🧠 ${q.field}: ${q.prompt}`.slice(0, 300),
        options: q.options,
        type: 'quiz',
        correct_option_id: q.correct,
        explanation: q.explanation.slice(0, 200),
        is_anonymous: true
      });
    }
    await sendMessage(channelId(), '🏁 That’s all 10 questions! Comment below and tell us how many you got right 👇');
    res.status(200).json({ ok: true, count: questions.length });
  } catch (e) {
    res.status(502).json({ error: 'Quiz failed', detail: String(e.message || e) });
  }
};
