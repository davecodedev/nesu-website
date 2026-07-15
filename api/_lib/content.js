// Source material for the Telegram bot's daily "Did you know?" posts and
// quizzes. Hand-written, factual, generic engineering knowledge — not
// attributed to any external source, so nothing here can misrepresent a
// real outlet the way pulling from placeholder news data would.
//
// This intentionally does not import site-data.js: that file is an ES
// module consumed by the browser, while these /api functions run as
// CommonJS on Vercel's Node runtime.

const CTA = 'Did you know this already? React with 🔥 if yes — or 🤯 if this is brand new to you!';

const DID_YOU_KNOW = [
  { slug: 'civil', emoji: '🏗️', title: 'Civil Engineering', hashtag: 'CivilEngineering', search: 'bridge construction engineering',
    body: 'Civil engineers design and maintain the built environment — roads, bridges, dams, tunnels and the water systems entire cities depend on. In Uzbekistan the discipline carries a special seismic duty.\n\nAfter the devastating 1966 earthquake leveled much of old Tashkent, the capital was rebuilt almost from scratch with earthquake resistance built into every structure. Modern buildings here use base isolation and ductile framing — designs that let a structure flex and absorb shaking instead of cracking under it.\n\nThat same technique is now standard across seismically active Central Asia. Every bridge, dam and high-rise you pass in Tashkent has survived a seismic design check most cities never have to think about.' },
  { slug: 'electrical', emoji: '⚡', title: 'Electrical Engineering', hashtag: 'ElectricalEngineering', search: 'electrical grid power lines',
    body: 'Electrical engineers plan and run everything from national power grids down to the switch on your wall. The core idea behind almost all of it is deceptively simple: a closed loop.\n\nCurrent only flows when there’s an unbroken path from source, through a switch and a load, and back again — break that loop anywhere and the whole system goes dark. Substations, transmission lines and the wiring in your house are all built around managing that one rule at different scales.\n\nUzbekistan’s grid is now going through a major modernization push, integrating new solar capacity into a transmission network originally built for a very different energy mix.' },
  { slug: 'mechanical', emoji: '⚙️', title: 'Mechanical Engineering', hashtag: 'MechanicalEngineering', search: 'gears machine engineering',
    body: 'Mechanical engineers work with forces, motion and energy — engines, machines, manufacturing lines, anything that moves. It’s the broadest of the classical engineering disciplines, and machine design underpins the hardware inside nearly every other field.\n\nOne of the field’s oldest tricks: gear trains. Every meshing pair of gears reverses direction, so an odd-numbered gear in a chain always spins the same way as the first.\n\nThat simple counting rule lets engineers trade speed for torque, scaling from a wristwatch’s tiny gears to the hoists that lift entire mineshafts.' },
  { slug: 'industrial', emoji: '🏭', title: 'Industrial Engineering', hashtag: 'IndustrialEngineering', search: 'factory assembly line',
    body: 'Industrial engineers don’t design the machines themselves — they design how people, machines and materials work together: factory layout, logistics, quality systems. Their core tool isn’t a single piece of hardware but statistics and process design.\n\nThe single biggest idea in the field is the bottleneck: a production line can never run faster than its slowest station, no matter how fast the others go — the rest just build up queues waiting on it.\n\nFinding and widening that one constraint, rather than speeding up whatever’s already fast, is the entire economy of industrial engineering.' },
  { slug: 'chemical', emoji: '🧪', title: 'Chemical Engineering', hashtag: 'ChemicalEngineering', search: 'chemical plant industrial',
    body: 'Chemical engineers scale reactions from a lab beaker up to full industrial plants — fuels, fertilizers, polymers, pharmaceuticals all pass through their hands before reaching anyone else. The discipline runs on two things above all: thermodynamics and process safety.\n\nEven the simplest reaction has to balance exactly — burn methane (CH₄) and you need precisely two O₂ molecules to produce one CO₂ and two H₂O, atom for atom.\n\nMultiply that bookkeeping by a plant producing thousands of tonnes a day, running at high pressure and temperature, and you understand why chemical engineers spend as much time on safety margins as they do on yield.' },
  { slug: 'aerospace', emoji: '✈️', title: 'Aerospace Engineering', hashtag: 'AerospaceEngineering', search: 'aircraft airplane engineering',
    body: 'Aerospace engineers design aircraft and spacecraft, where every gram and every joint is calculated down to the decimal. The discipline’s signature shape is the airfoil — a wing cross-section that turns moving air into lift.\n\nLift grows as the wing’s angle of attack increases, right up until a critical point, usually around 15°, where the airflow can no longer follow the wing’s upper surface. It separates, lift collapses, and the wing stalls.\n\nThat narrow margin between useful lift and stall drives almost every decision in aircraft design — wing shape, flight envelopes, and the approach speed of every landing you’ve ever been on.' },
  { slug: 'environmental', emoji: '🌊', title: 'Environmental Engineering', hashtag: 'EnvironmentalEngineering', search: 'water treatment plant',
    body: 'Environmental engineers protect water, air and soil — treatment plants, emissions control, contamination cleanup. In Central Asia the discipline is inseparable from one resource above all: water.\n\nIrrigation efficiency and the ongoing effort to stabilize the shrinking Aral Sea basin are central to the region’s environmental engineering work.\n\nEven something as basic as a sand filter reflects careful design: water flows downward through layers ordered fine-to-coarse, so the finest sand sits on top and traps particles right at the surface where the filter can be cleaned, while coarser layers below carry the water away without clogging.' },
  { slug: 'software', emoji: '💻', title: 'Software Engineering', hashtag: 'SoftwareEngineering', search: 'computer programming code',
    body: 'Software engineering applies the same discipline as any other engineering field — specification, testing, verification — to code instead of concrete or steel. As more infrastructure becomes computer-controlled, a software defect stops being just an inconvenience and starts being a civil-safety issue.\n\nMost production failures trace back to something tiny: an off-by-one error, a boundary condition nobody tested, one bad read that poisons an entire result.\n\nCatching those systematically — through code review, automated testing, and designing around invariants that must never break — rather than relying on luck, is what separates software engineering from just writing code.' },
  { slug: 'robotics', emoji: '🤖', title: 'Robotics', hashtag: 'Robotics', search: 'industrial robot arm',
    body: 'Robotics and mechatronics combine mechanics, electronics and control software into machines that can sense their surroundings and act on their own. Every robot, no matter how advanced, runs the same basic control loop thousands of times per second: sense the world, plan a response, then act.\n\nActing on stale information — skipping straight to ‘act’ without first sensing — is how robots crash or collide.\n\nThat sense-plan-act loop is the shared skeleton behind a factory arm welding car frames, a warehouse rover picking orders, and a self-driving car reading the road ahead of it.' },
  { slug: 'structural', emoji: '🏛️', title: 'Structural Engineering', hashtag: 'StructuralEngineering', search: 'steel truss bridge structure',
    body: 'Structural and architectural engineers make buildings stand — sizing every beam, column and foundation against gravity, wind and, in this region, earthquakes. One of the field’s most elegant ideas is also one of its oldest: the triangle.\n\nA triangle can’t change shape without changing the length of one of its sides, so its joints carry no bending force at all — unlike a square, which simply folds into a parallelogram under the same push.\n\nThat single geometric fact is why trusses, cranes and transmission towers are built almost entirely out of triangles: it’s the strongest shape you can make from the least material.' }
];

// Two questions per engineering field. Posted verbatim (no LLM rephrasing)
// to keep this at zero API cost — correctness matters more than variety
// here, so facts are fixed rather than generated fresh each time.
const QUIZ_SEEDS = [
  { field: 'Civil Engineering', prompt: 'A concrete beam sags under a heavy point load at mid-span. Where does one added column help most?',
    options: ['Directly under the mid-span load', 'At the left support', 'Anywhere — the effect is the same'], correct: 0,
    explanation: 'Bending moment peaks where the load acts, so support added there cuts the sag the most.' },
  { field: 'Civil Engineering', prompt: 'Tashkent was largely rebuilt after which event, prompting citywide seismic design standards?',
    options: ['A flood in 1958', 'The 1966 earthquake', 'A fire in 1972'], correct: 1,
    explanation: 'The 1966 Tashkent earthquake led to a citywide rebuild with earthquake-resistant construction standards.' },
  { field: 'Electrical Engineering', prompt: 'In a simple circuit, current only flows when...',
    options: ['Only the switch is closed', 'There’s an unbroken path from source, through the load, and back', 'The wire is thick enough'], correct: 1,
    explanation: 'Current needs a complete closed loop — break it anywhere and the circuit stops working.' },
  { field: 'Electrical Engineering', prompt: 'Uzbekistan’s grid modernization is focused on integrating more of what?',
    options: ['Coal power', 'Solar capacity', 'Tidal power'], correct: 1,
    explanation: 'Grid modernization projects are focused on integrating new solar capacity into the transmission network.' },
  { field: 'Mechanical Engineering', prompt: 'Three gears mesh in a row. The first turns clockwise. Which way does the third turn?',
    options: ['Counter-clockwise', 'Clockwise', 'It cannot turn at all'], correct: 1,
    explanation: 'Each meshing pair reverses direction, so an odd-numbered gear in a chain always turns with the first.' },
  { field: 'Mechanical Engineering', prompt: 'What do mechanical engineers trade off against each other using a gear train?',
    options: ['Speed and torque', 'Color and weight', 'Voltage and current'], correct: 0,
    explanation: 'Gear trains let engineers trade rotational speed for torque (or vice versa) at a fixed ratio.' },
  { field: 'Industrial Engineering', prompt: 'A line has three stations: cutting 20/hr, welding 5/hr, painting 12/hr. What is its max output?',
    options: ['12.3/hr — the average', '5/hr — the slowest station', '20/hr — the fastest station'], correct: 1,
    explanation: 'A line can never run faster than its bottleneck; other stations just build queues.' },
  { field: 'Industrial Engineering', prompt: 'In industrial engineering, what is a ‘bottleneck’?',
    options: ['The fastest station on a line', 'The slowest station, which limits total output', 'The most expensive machine'], correct: 1,
    explanation: 'A line can never run faster than its slowest station — the bottleneck sets the ceiling for total output.' },
  { field: 'Chemical Engineering', prompt: 'Balance the combustion: CH₄ + ? O₂ → CO₂ + 2 H₂O. How many O₂ molecules?',
    options: ['1', '2', '3'], correct: 1,
    explanation: 'One carbon needs one CO₂, four hydrogens need two H₂O — four oxygen atoms total, so 2 O₂.' },
  { field: 'Chemical Engineering', prompt: 'Alongside reaction chemistry, what does chemical engineering run on above all else?',
    options: ['Marketing and logistics', 'Thermodynamics and process safety', 'Color theory and design'], correct: 1,
    explanation: 'Scaling reactions safely to industrial size depends heavily on thermodynamics and process safety.' },
  { field: 'Aerospace Engineering', prompt: 'Lift grows with a wing’s angle of attack — until it suddenly stops flying. Around what angle does a typical wing stall?',
    options: ['About 4°', 'About 15°', 'About 45°'], correct: 1,
    explanation: 'Past roughly 15° the airflow separates from the wing’s upper surface and lift collapses.' },
  { field: 'Aerospace Engineering', prompt: 'What happens to a wing just past its stall angle?',
    options: ['Lift keeps increasing', 'Airflow separates and lift collapses', 'The wing gets heavier'], correct: 1,
    explanation: 'Past the stall angle, airflow can no longer follow the wing’s upper surface, and lift collapses.' },
  { field: 'Environmental Engineering', prompt: 'In a sand filter, water flows downward. Which layer order (top to bottom) cleans best?',
    options: ['Fine sand → coarse sand → gravel', 'Gravel → coarse sand → fine sand', 'The order makes no difference'], correct: 0,
    explanation: 'Fine media on top traps particles at the surface where the filter can be cleaned.' },
  { field: 'Environmental Engineering', prompt: 'Why does fine sand go on top in a layered sand filter?',
    options: ['It looks better', 'It traps particles at the surface, where the filter is easiest to clean', 'Fine sand is cheaper'], correct: 1,
    explanation: 'Coarse layers below prevent clogging while the fine top layer catches particles where it’s easy to clean.' },
  { field: 'Software Engineering', prompt: 'Most production software failures trace back to...',
    options: ['Exotic, rare edge cases', 'Small errors like off-by-one or untested boundary conditions', 'Hardware failures'], correct: 1,
    explanation: 'Most failures are small, common mistakes — reviews and tests exist to catch exactly these.' },
  { field: 'Software Engineering', prompt: 'Why does a software defect increasingly count as a civil-safety issue?',
    options: ['Because code is expensive', 'Because infrastructure is increasingly computer-controlled', 'Because software has no test coverage'], correct: 1,
    explanation: 'As traffic systems, grids and other infrastructure become computer-controlled, a bug can become a real-world safety issue.' },
  { field: 'Robotics', prompt: 'Every robot runs the same control loop thousands of times per second. What must come first each cycle?',
    options: ['Act — drive the motors', 'Plan — compute a path', 'Sense — measure the world'], correct: 2,
    explanation: 'Acting on stale information is how robots crash: each cycle must sense, then plan, then act.' },
  { field: 'Robotics', prompt: 'What is the correct order of a robot’s control loop?',
    options: ['Act, sense, plan', 'Plan, act, sense', 'Sense, plan, act'], correct: 2,
    explanation: 'Robots must sense the world before planning a response and acting on it.' },
  { field: 'Structural Engineering', prompt: 'Same material, same total weight of bars — which frame shape resists collapse best?',
    options: ['A square', 'A triangle', 'A circle of bars'], correct: 1,
    explanation: 'A triangle cannot change shape without changing the length of a side, so its joints carry no bending.' },
  { field: 'Structural Engineering', prompt: 'Why are trusses, cranes and transmission towers built almost entirely of triangles?',
    options: ['Triangles are the cheapest shape to manufacture', 'A triangle’s joints carry no bending force', 'Triangles are easiest to paint'], correct: 1,
    explanation: 'A triangle can’t change shape without changing a side’s length, unlike a square, which folds into a parallelogram.' }
];

// Deterministic per-day picks, so repeated runs on the same day (retries,
// redeploys) return the same content instead of double-posting variety.
function dayOfYear(date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  return Math.floor((date.getTime() - start) / 86400000);
}

function pickForToday(list, date) {
  return list[dayOfYear(date) % list.length];
}

// Deterministic seeded shuffle (small LCG) so each day's 10-question set
// looks different from the last, without relying on Math.random() (which
// would make retries non-reproducible).
function seededShuffle(list, seed) {
  const arr = list.slice();
  let s = seed || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}

function pickTenForToday(list, date) {
  return seededShuffle(list, dayOfYear(date)).slice(0, 10);
}

// Automated posting starts this Tashkent-local calendar date (not before) —
// requested explicitly so testing today doesn't count as the real launch.
// Change this if you want to push the start date further out.
const LIVE_FROM = '2026-07-16';

function tashkentDateString(date) {
  const t = new Date(date.getTime() + 5 * 3600 * 1000); // UTC+5, no DST in Uzbekistan
  const y = t.getUTCFullYear();
  const m = String(t.getUTCMonth() + 1).padStart(2, '0');
  const d = String(t.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isLive(date) {
  return tashkentDateString(date) >= LIVE_FROM;
}

// 0=Sun, 1=Mon, ... 6=Sat, evaluated against the Tashkent-local calendar day.
function tashkentWeekday(date) {
  const t = new Date(date.getTime() + 5 * 3600 * 1000);
  return t.getUTCDay();
}

module.exports = { CTA, DID_YOU_KNOW, QUIZ_SEEDS, dayOfYear, pickForToday, pickTenForToday, isLive, tashkentWeekday };
