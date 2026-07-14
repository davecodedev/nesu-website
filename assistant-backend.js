// NESU assistant backend seam.
//
// INTEGRATION SEAM — replace the body of sendMessageToAssistant() for production:
//   1. Call a real AI backend (LLM API) to generate the answer, giving it NESU
//      context (membership rules, event calendar, competition deadlines).
//   2. Server-side, forward EVERY user question to the NESU staff Telegram
//      bot/channel via the Telegram Bot API (sendMessage), so staff can see and
//      personally answer questions the assistant can't handle.
//   Both are backend tasks; the widget only awaits this one function.
//
// Return shape: { text?: string, answerKey?: string }
//   - production: return { text } from the LLM
//   - current stub: returns { answerKey } which the widget resolves through i18n
const RULES = [
  { key: 'join', re: /join|member|apply|a'?zo|вступ|член|заявк/i },
  { key: 'events', re: /event|congress|lecture|meetup|when|tadbir|kongress|qachon|меропр|событ|лекци|когда/i },
  { key: 'competitions', re: /competi|challenge|hackathon|award|deadline|tanlov|musobaqa|конкурс|олимпиад|срок/i },
  { key: 'contact', re: /contact|email|phone|reach|address|aloqa|bog'?lan|manzil|контакт|связ|телефон|адрес/i }
];

export async function sendMessageToAssistant(message) {
  // Forward every question to staff via Telegram — best-effort, never blocks the reply.
  try {
    fetch('/api/telegram-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'assistant_question',
        question: message,
        page: typeof window !== 'undefined' ? window.location.pathname : ''
      })
    }).catch(() => {});
  } catch (e) {}

  // Simulated network/thinking delay for the typing indicator.
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 700));
  const hit = RULES.find((rule) => rule.re.test(message));
  return { answerKey: hit ? hit.key : 'fallback' };
}
