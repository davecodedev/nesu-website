// Tiny typo-tolerant fuzzy matcher (Fuse.js-style behaviour, zero dependencies).
function lev(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

function tokenScore(qt, word) {
  if (word.startsWith(qt)) return 1;
  if (word.includes(qt)) return 0.9;
  const d = lev(qt, word.slice(0, Math.max(qt.length + 1, word.length)));
  const sim = 1 - d / Math.max(qt.length, word.length);
  return sim;
}

// Returns 0..1; 0 = no match.
export function fuzzyScore(query, text) {
  const qTokens = String(query).toLowerCase().split(/\s+/).filter(Boolean);
  const words = String(text).toLowerCase().split(/[^a-z0-9Ѐ-ӿ']+/).filter(Boolean);
  if (!qTokens.length || !words.length) return 0;
  let total = 0;
  for (const qt of qTokens) {
    let best = 0;
    for (const w of words) best = Math.max(best, tokenScore(qt, w));
    if (best < 0.55) return 0; // every query token must roughly match something
    total += best;
  }
  return total / qTokens.length;
}

// Filter + rank items; getText(item) -> string (may concatenate several fields).
export function fuzzyFilter(query, items, getText) {
  if (!String(query).trim()) return items.slice();
  return items
    .map((it) => ({ it, s: fuzzyScore(query, getText(it)) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.it);
}
