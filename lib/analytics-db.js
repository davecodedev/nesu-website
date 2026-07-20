// Visitor analytics store on Vercel Blob, designed around Blob's eventual
// consistency (reads can lag writes by up to ~60s, which makes naive
// read-modify-write counters lose increments under concurrent visitors):
//
//   - recordEvent(): each beacon becomes its own tiny blob whose PATHNAME
//     encodes the whole event — append-only, no reads, no race conditions.
//   - getAnalytics(): admin-only. Lists event blobs (pathnames carry the
//     data; contents are never fetched), merges them with the compacted
//     aggregate document, and folds finished days into that document so the
//     event blobs can be deleted and the store stays small. The aggregate
//     doc has a single, rare writer (admin views), so RMW is safe there.
const { putBlob, listBlobs, deleteBlobs, fetchBlobJson } = require('./blob-rest');

const AGG_PATHNAME = 'cms/analytics.json';
const EV_PREFIX = 'analytics/ev/';
const KEEP_DAYS = 90;

function defaultAgg() {
  return { totalVisitors: 0, days: {}, foldedDays: {} };
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ---- event recording (public beacon path) ----

async function recordEvent(ev) {
  const day = today();
  const payload = [ev.type, ev.path, ev.seconds || 0, ev.newVisitor ? 1 : 0, ev.newToday ? 1 : 0];
  const name = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const rand = Math.random().toString(36).slice(2, 8);
  await putBlob(EV_PREFIX + day + '/' + name + '.' + rand, '1', 'text/plain');
}

function parseEventPathname(pathname) {
  // analytics/ev/<day>/<base64url>.<rand>
  const rest = pathname.slice(EV_PREFIX.length);
  const slash = rest.indexOf('/');
  if (slash === -1) return null;
  const day = rest.slice(0, slash);
  const file = rest.slice(slash + 1);
  const dot = file.lastIndexOf('.');
  if (dot === -1) return null;
  try {
    const arr = JSON.parse(Buffer.from(file.slice(0, dot), 'base64url').toString());
    return { day, type: arr[0], path: arr[1], seconds: Number(arr[2]) || 0, newVisitor: !!arr[3], newToday: !!arr[4] };
  } catch (e) {
    return null;
  }
}

// ---- aggregation (admin read path) ----

function foldInto(days, ev) {
  const d = days[ev.day] = days[ev.day] || { views: 0, visitors: 0, durSum: 0, durN: 0, pages: {} };
  const p = d.pages[ev.path] = d.pages[ev.path] || { views: 0, durSum: 0, durN: 0 };
  if (ev.type === 'view') {
    d.views += 1;
    p.views += 1;
    if (ev.newToday) d.visitors += 1;
  } else if (ev.type === 'leave' && ev.seconds > 0) {
    d.durSum += ev.seconds; d.durN += 1;
    p.durSum += ev.seconds; p.durN += 1;
  }
}

async function loadAgg() {
  try {
    const blobs = await listBlobs(AGG_PATHNAME, 1);
    if (!blobs.length) return defaultAgg();
    return Object.assign(defaultAgg(), await fetchBlobJson(blobs[0].url));
  } catch (e) {
    console.error('[analytics-db] agg load failed:', e && e.message);
    return defaultAgg();
  }
}

async function saveAgg(agg) {
  const keys = Object.keys(agg.days).sort();
  while (keys.length > KEEP_DAYS) {
    const k = keys.shift();
    delete agg.days[k];
    delete agg.foldedDays[k];
  }
  await putBlob(AGG_PATHNAME, JSON.stringify(agg), 'application/json');
}

async function getAnalytics() {
  const agg = await loadAgg();
  const blobs = await listBlobs(EV_PREFIX);
  const tod = today();

  const byDay = {};
  for (const b of blobs) {
    const ev = parseEventPathname(b.pathname);
    if (!ev) continue;
    (byDay[ev.day] = byDay[ev.day] || { events: [], urls: [] }).events.push(ev);
    byDay[ev.day].urls.push(b.url);
  }

  // Fold finished days permanently into the aggregate, then delete their
  // event blobs. Days already folded are strays from eventual-consistency
  // re-listing — never fold twice, just retry the delete.
  const staleUrls = [];
  let aggChanged = false;
  for (const day of Object.keys(byDay)) {
    if (day === tod) continue;
    if (!agg.foldedDays[day]) {
      for (const ev of byDay[day].events) {
        foldInto(agg.days, ev);
        if (ev.newVisitor) agg.totalVisitors += 1;
      }
      agg.foldedDays[day] = true;
      aggChanged = true;
    }
    staleUrls.push.apply(staleUrls, byDay[day].urls);
  }
  if (aggChanged) {
    try { await saveAgg(agg); } catch (e) { console.error('[analytics-db] agg save failed:', e && e.message); }
  }
  if (staleUrls.length) {
    try { await deleteBlobs(staleUrls); } catch (e) { console.error('[analytics-db] event cleanup failed:', e && e.message); }
  }

  // Merge today's still-live events on the fly (they stay as blobs until the
  // day is over, so repeated dashboard views never double-count them).
  const merged = { totalVisitors: agg.totalVisitors, days: JSON.parse(JSON.stringify(agg.days)) };
  if (byDay[tod]) {
    for (const ev of byDay[tod].events) {
      foldInto(merged.days, ev);
      if (ev.newVisitor) merged.totalVisitors += 1;
    }
  }
  return merged;
}

module.exports = { recordEvent, getAnalytics };
