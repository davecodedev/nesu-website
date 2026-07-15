// Topic-relevant stock photo lookup via the Pexels API (free tier). Returns
// null (not a thrown error) when no key is configured or nothing is found,
// so callers can fall back to a text-only post instead of failing outright.

async function fetchImage(query) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;
  try {
    const r = await fetch('https://api.pexels.com/v1/search?query=' + encodeURIComponent(query) + '&per_page=1&orientation=landscape', {
      headers: { Authorization: key }
    });
    if (!r.ok) return null;
    const data = await r.json();
    const photo = data.photos && data.photos[0];
    return photo ? photo.src.large : null;
  } catch (e) {
    return null;
  }
}

module.exports = { fetchImage };
