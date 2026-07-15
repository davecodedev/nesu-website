// Source material for the Telegram bot's daily posts and quizzes.
//
// This intentionally duplicates (a trimmed copy of) the EVENTS/COMPETITIONS/
// FIELDS/ACTIVITIES data in ../../site-data.js rather than importing it: that
// file is an ES module consumed by the browser, while these /api functions
// run as CommonJS on Vercel's Node runtime. Keep the two in sync by hand when
// NESU's real events/competitions data changes — this is placeholder content
// pending the real CMS described in cms-store.js.

const EVENTS = [
  { title: 'NESU National Congress 2026', date: '18–19 Sep 2026', loc: 'Tashkent · Congress Hall',
    desc: 'The Society’s annual flagship gathering: plenary sessions on national infrastructure, standards workshops, and the yearly general assembly.' },
  { title: 'Grid Modernisation Lecture Series', date: '21 Aug 2026', loc: 'Tashkent · NESU House',
    desc: 'Monthly open lecture: integrating new solar capacity into Uzbekistan’s transmission grid, with the Energy section.' },
  { title: 'Seismic Design Workshop', date: '03–04 Oct 2026', loc: 'Samarkand',
    desc: 'Two-day practical course on seismic assessment and retrofitting of existing housing stock, led by the Civil Engineering section.' }
];

const COMPETITIONS = [
  { title: 'National Bridge Challenge', deadline: '01 Oct 2026',
    desc: 'Student teams design and load-test a 1:100 truss bridge model. Regional heats in Tashkent, Samarkand and Nukus; finals at the National Congress.' },
  { title: 'Code for Infrastructure', deadline: '15 Nov 2026',
    desc: 'A 48-hour hackathon building software for public utilities: metering, scheduling and safety reporting.' }
];

// One quiz seed per engineering field — mirrors site-data.js ACTIVITIES.
// Posted verbatim (no LLM rephrasing) to keep this at zero API cost.
const QUIZ_SEEDS = [
  { field: 'Mechanical Engineering', prompt: 'Three gears mesh in a row. The first turns clockwise. Which way does the third turn?',
    options: ['Counter-clockwise', 'Clockwise', 'It cannot turn at all'], correct: 1,
    explanation: 'Each meshing pair reverses direction, so an odd-numbered gear in a chain always turns with the first.' },
  { field: 'Civil Engineering', prompt: 'A concrete beam sags under a heavy point load at mid-span. Where does one added column help most?',
    options: ['Directly under the mid-span load', 'At the left support', 'Anywhere — the effect is the same'], correct: 0,
    explanation: 'Bending moment peaks where the load acts, so support added there cuts the sag the most.' },
  { field: 'Industrial Engineering', prompt: 'A line has three stations: cutting 20/hr, welding 5/hr, painting 12/hr. What is its max output?',
    options: ['12.3/hr — the average', '5/hr — the slowest station', '20/hr — the fastest station'], correct: 1,
    explanation: 'A line can never run faster than its bottleneck; other stations just build queues.' },
  { field: 'Chemical Engineering', prompt: 'Balance the combustion: CH₄ + ? O₂ → CO₂ + 2 H₂O. How many O₂ molecules?',
    options: ['1', '2', '3'], correct: 1,
    explanation: 'One carbon needs one CO₂, four hydrogens need two H₂O — four oxygen atoms total, so 2 O₂.' },
  { field: 'Aerospace Engineering', prompt: 'Lift grows with a wing’s angle of attack — until it suddenly stops flying. Around what angle does a typical wing stall?',
    options: ['About 4°', 'About 15°', 'About 45°'], correct: 1,
    explanation: 'Past roughly 15° the airflow separates from the wing’s upper surface and lift collapses.' },
  { field: 'Environmental Engineering', prompt: 'In a sand filter, water flows downward. Which layer order (top to bottom) cleans best?',
    options: ['Fine sand → coarse sand → gravel', 'Gravel → coarse sand → fine sand', 'The order makes no difference'], correct: 0,
    explanation: 'Fine media on top traps particles at the surface where the filter can be cleaned.' },
  { field: 'Robotics', prompt: 'Every robot runs the same control loop thousands of times per second. What must come first each cycle?',
    options: ['Act — drive the motors', 'Plan — compute a path', 'Sense — measure the world'], correct: 2,
    explanation: 'Acting on stale information is how robots crash: each cycle must sense, then plan, then act.' },
  { field: 'Structural Engineering', prompt: 'Same material, same total weight of bars — which frame shape resists collapse best?',
    options: ['A square', 'A triangle', 'A circle of bars'], correct: 1,
    explanation: 'A triangle cannot change shape without changing a side’s length, so its joints carry no bending.' }
];

// Deterministic pick by day-of-year, so repeated cron runs on the same day
// (retries, redeploys) return the same item instead of double-posting variety.
function dayOfYear(date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  return Math.floor((date.getTime() - start) / 86400000);
}

function pickForToday(list, date) {
  return list[dayOfYear(date) % list.length];
}

module.exports = { EVENTS, COMPETITIONS, QUIZ_SEEDS, dayOfYear, pickForToday };
