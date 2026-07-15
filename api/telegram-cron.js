// Daily scheduled post to the NESU Telegram channel, triggered by Vercel Cron
// (see vercel.json). Posts a daily update every day, and a quiz poll on
// Mon/Wed/Fri. Content is templated from api/_lib/content.js — no LLM call,
// so this runs at zero API cost.

const { sendMessage, sendPoll, channelId } = require('./_lib/telegram');
const { EVENTS, COMPETITIONS, QUIZ_SEEDS, pickForToday } = require('./_lib/content');

const QUIZ_WEEKDAYS = [1, 3, 5]; // Mon, Wed, Fri (UTC)

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // no secret configured — allow (dev/local)
  const header = req.headers['authorization'];
  if (header === 'Bearer ' + secret) return true;
  const url = new URL(req.url, 'http://localhost');
  return url.searchParams.get('secret') === secret;
}

function formatDailyPost(item) {
  const meta = item.kind === 'event'
    ? `📅 ${item.date} · 📍 ${item.loc}`
    : `⏳ Deadline: ${item.deadline}`;
  const hashtag = item.kind === 'event' ? '#NESUEvents' : '#NESUCompetitions';
  return `<b>${item.title}</b>\n${meta}\n\n${item.desc}\n\n#NESU #Engineering ${hashtag}`;
}

async function postDailyUpdate(now) {
  const pool = EVENTS.map((e) => ({ kind: 'event', ...e })).concat(
    COMPETITIONS.map((c) => ({ kind: 'competition', ...c }))
  );
  const item = pickForToday(pool, now);
  await sendMessage(channelId(), formatDailyPost(item));
}

async function postQuiz(now) {
  const seed = pickForToday(QUIZ_SEEDS, now);
  await sendPoll(channelId(), {
    question: `🧠 ${seed.field} quiz: ${seed.prompt}`.slice(0, 300),
    options: seed.options,
    type: 'quiz',
    correct_option_id: seed.correct,
    explanation: seed.explanation.slice(0, 200),
    is_anonymous: true
  });
}

module.exports = async (req, res) => {
  if (!isAuthorized(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const now = new Date();
  const results = { daily: false, quiz: false };

  try {
    await postDailyUpdate(now);
    results.daily = true;
  } catch (e) {
    res.status(502).json({ error: 'Daily post failed', detail: String(e.message || e), results });
    return;
  }

  if (QUIZ_WEEKDAYS.includes(now.getUTCDay())) {
    try {
      await postQuiz(now);
      results.quiz = true;
    } catch (e) {
      res.status(207).json({ error: 'Quiz post failed', detail: String(e.message || e), results });
      return;
    }
  }

  res.status(200).json({ ok: true, results });
};
