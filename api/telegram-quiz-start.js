// Nightly 10-question quiz — triggered by a GitHub Actions cron at 20:00
// Tashkent time. Sends an intro line, then 10 quiz polls back to back.

const { sendMessage, sendPoll, channelId } = require('./_lib/telegram');
const { isAuthorizedCron } = require('./_lib/auth');
const { QUIZ_SEEDS, pickTenForToday } = require('./_lib/content');

module.exports = async (req, res) => {
  if (!isAuthorizedCron(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const now = new Date();
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
    res.status(200).json({ ok: true, count: questions.length });
  } catch (e) {
    res.status(502).json({ error: 'Quiz failed', detail: String(e.message || e) });
  }
};
