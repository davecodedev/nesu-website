// NESU i18n — locale dictionaries live in ./locales/*.json
const KEY = 'nesu-lang';
const LANGS = ['uz', 'en', 'ru'];
let dicts = null;
let loading = null;

// Site-content overrides edited via the admin CMS (see cms-store.js).
let overrides = {};
function readOverrides() {
  try {
    overrides = JSON.parse(localStorage.getItem('nesu-cms-content') || '{}');
    // Migration: a bulk "Save changes" in the admin CMS snapshotted the old
    // footer saying as an override, which would shadow the new dictionary
    // value forever. Purge that one stale entry (a deliberate admin edit to
    // any other wording is left untouched).
    const gl = overrides['footer.glitchLine'];
    if (gl && typeof gl.en === 'string' && gl.en.indexOf('This website has problems') === 0) {
      delete overrides['footer.glitchLine'];
      localStorage.setItem('nesu-cms-content', JSON.stringify(overrides));
    }
  } catch (e) { overrides = {}; }
}
readOverrides();
if (typeof window !== 'undefined') window.addEventListener('nesu-content-changed', readOverrides);

export const NAV = [
  { key: 'home', href: 'index.dc.html' },
  { key: 'about', href: 'about.dc.html' },
  { key: 'events', href: 'events.dc.html' },
  { key: 'competitions', href: 'competitions.dc.html' },
  { key: 'news', href: 'news.dc.html' },
  { key: 'fields', href: 'fields.dc.html' },
  { key: 'gallery', href: 'gallery.dc.html' },
  { key: 'qa', href: 'qa.dc.html' },
  { key: 'contact', href: 'contact.dc.html' }
];

export function getLang() {
  try {
    const l = localStorage.getItem(KEY);
    return LANGS.includes(l) ? l : 'en';
  } catch (e) { return 'en'; }
}

export function setLang(l) {
  if (!LANGS.includes(l)) return;
  try { localStorage.setItem(KEY, l); } catch (e) {}
  window.dispatchEvent(new CustomEvent('nesu-lang', { detail: l }));
}

export function onLangChange(fn) {
  const h = (e) => fn(e.detail);
  window.addEventListener('nesu-lang', h);
  return () => window.removeEventListener('nesu-lang', h);
}

export function load() {
  if (!loading) {
    loading = Promise.all(LANGS.map((l) =>
      fetch(new URL('./locales/' + l + '.json', import.meta.url)).then((r) => r.json())
    )).then((arr) => {
      dicts = {};
      LANGS.forEach((l, i) => { dicts[l] = arr[i]; });
    });
  }
  return loading;
}

export function t(lang, key) {
  const ov = overrides[key];
  if (ov && ov[lang]) return ov[lang];
  if (!dicts) return '';
  const d = dicts[lang] || {};
  return d[key] !== undefined ? d[key] : (dicts.en[key] !== undefined ? dicts.en[key] : key);
}

// Attach to a DC logic component: sets state.lang, subscribes, loads dicts.
export async function bind(comp) {
  comp.i18n = { t: (k) => t(comp.state.lang, k), setLang, NAV };
  comp.setState({ lang: getLang() });
  comp._i18nUnsub = onLangChange((l) => comp.setState({ lang: l }));
  await load();
  comp.forceUpdate();
}

export function allKeys() {
  return dicts && dicts.en ? Object.keys(dicts.en) : [];
}
