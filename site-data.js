// NESU site content data (English placeholder content — translations pending)
export const EVENTS = [
  { id: 'natcon-2026', type: 'Conference', title: 'NESU National Congress 2026', date: '18–19 Sep 2026', loc: 'Tashkent · Congress Hall', upcoming: true,
    desc: 'The Society’s annual flagship gathering: plenary sessions on national infrastructure, standards workshops, and the yearly general assembly.' },
  { id: 'grid-lecture', type: 'Lecture', title: 'Grid Modernisation Lecture Series', date: '21 Aug 2026', loc: 'Tashkent · NESU House', upcoming: true,
    desc: 'Monthly open lecture: integrating new solar capacity into Uzbekistan’s transmission grid, with the Energy section.' },
  { id: 'seismic-workshop', type: 'Workshop', title: 'Seismic Design Workshop', date: '03–04 Oct 2026', loc: 'Samarkand', upcoming: true,
    desc: 'Two-day practical course on seismic assessment and retrofitting of existing housing stock, led by the Civil Engineering section.' },
  { id: 'fergana-meetup', type: 'Meetup', title: 'Fergana Valley Engineers Meetup', date: '14 May 2026', loc: 'Fergana', upcoming: false,
    desc: 'Regional chapter meetup with lightning talks from young members and a factory floor tour.' },
  { id: 'bridge-forum', type: 'Forum', title: 'Bridge & Tunnel Forum 2026', date: '20 Mar 2026', loc: 'Tashkent', upcoming: false,
    desc: 'Joint forum with transport authorities on inspection standards and load rating for road bridges.' },
  { id: 'winter-school', type: 'School', title: 'Winter Engineering School', date: '12–16 Jan 2026', loc: 'Chimgan', upcoming: false,
    desc: 'A five-day residential school for senior engineering students from seven universities.' }
];

export const COMPETITIONS = [
  { id: 'bridge-challenge', title: 'National Bridge Challenge', open: true, deadline: '01 Oct 2026',
    desc: 'Student teams design and load-test a 1:100 truss bridge model. Regional heats in Tashkent, Samarkand and Nukus; finals at the National Congress.',
    entry: 'Teams of 3–5 · undergraduate', winner: '2025 — “Ko’prik-7” team, Tashkent' },
  { id: 'code-for-infrastructure', title: 'Code for Infrastructure', open: true, deadline: '15 Nov 2026',
    desc: 'A 48-hour hackathon building software for public utilities: metering, scheduling and safety reporting.',
    entry: 'Open to all members under 30', winner: '2025 — “Suvsoft” team, Urgench' },
  { id: 'young-engineer', title: 'Young Engineer of the Year', open: false, deadline: 'Closed for 2026',
    desc: 'The Society’s annual award for an outstanding early-career engineer, judged on a delivered project and a public defence.',
    entry: 'Members within 8 years of graduation', winner: '2025 — D. Karimova, power systems' }
];

export const PARTNERS = [
  { id: 'bs-sat-academy', name: 'B&S SAT Academy', mark: 'BS', img: 'logos/bs-sat-academy.jpg' },
  { id: 'ivybek', name: 'Ivybek', mark: 'IB', img: 'logos/ivybek.jpg' },
  { id: 'uzlab', name: 'UzLab', mark: 'UL', img: 'logos/uzlab.png' },
  { id: 'target-intl-school', name: 'Target International School', mark: 'TI', img: 'logos/target-international-school.jpg' },
  { id: 'triplepoint-engineering', name: 'TriplePoint Engineering', mark: 'TP', img: 'logos/triplepoint-engineering.webp' }
];

export const GALLERY = [
  { id: 'g1', caption: 'National Congress 2025 — plenary hall', h: 240 },
  { id: 'g2', caption: 'Bridge Challenge finals — load test', h: 320 },
  { id: 'g3', caption: 'Winter School, Chimgan', h: 200 },
  { id: 'g4', caption: 'Fergana Valley meetup', h: 280 },
  { id: 'g5', caption: 'Materials testing lab tour', h: 220 },
  { id: 'g6', caption: 'Young Engineer award ceremony', h: 300 },
  { id: 'g7', caption: 'Student expo — Tashkent', h: 240 },
  { id: 'g8', caption: 'Grid modernisation lecture', h: 200 },
  { id: 'g9', caption: 'Metro extension site visit', h: 280 }
];

export const FIELDS = [
  { slug: 'civil', icon: 'M4 20 L20 20 L4 4 Z M7.5 16.5 L10.5 16.5 M7.5 13 L9 13',
    blurb: 'Civil engineers design and maintain the built environment — roads, bridges, dams and water supply. In Uzbekistan the discipline carries a special seismic duty: Tashkent was largely rebuilt after the 1966 earthquake, and every major structure since is designed to resist ground shaking.' },
  { slug: 'electrical', icon: 'M3 18 H9 V10 H15 V6 H17 M17 6 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 M9 18 a2 2 0 1 0 -4 0 a2 2 0 1 0 4 0',
    blurb: 'Electrical engineering covers the generation, transmission and use of electric power, plus the electronics that control it. From national grid planning to a single lamp, everything rests on the same closed-loop principle you just used.',
    demo: 'The bulb only lit when the loop was closed: current needs an unbroken path from source, through switch and load, and back. Every electrical system — a torch, a substation, a national grid — is engineered around exactly this: when circuits close, and what happens when they open under load.' },
  { slug: 'mechanical', icon: 'M12 12 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M12 2.5 V5.5 M12 18.5 V21.5 M2.5 12 H5.5 M18.5 12 H21.5 M5.3 5.3 L7.4 7.4 M16.6 16.6 L18.7 18.7 M18.7 5.3 L16.6 7.4 M7.4 16.6 L5.3 18.7',
    blurb: 'Mechanical engineers work with forces, motion and energy — machines, engines, manufacturing plants. It is the broadest of the classical disciplines, and machine design underpins the hardware of every other field.' },
  { slug: 'industrial', icon: 'M14.7 6.3 a1 1 0 0 0 0 1.4 l1.6 1.6 a1 1 0 0 0 1.4 0 l3.77 -3.77 a6 6 0 0 1 -7.94 7.94 l-6.91 6.91 a2.12 2.12 0 0 1 -3 -3 l6.91 -6.91 a6 6 0 0 1 7.94 -7.94 l-3.76 3.76 z',
    blurb: 'Industrial engineers optimise how people, machines and materials work together — factory layout, logistics, quality systems. Their tools are statistics and process design rather than any single machine.' },
  { slug: 'chemical', icon: 'M10 2 v7.5 L4.5 19.5 A2 2 0 0 0 6.2 22 h11.6 a2 2 0 0 0 1.7 -2.5 L14 9.5 V2 M8.5 2 h7 M7 16 h10',
    blurb: 'Chemical engineers scale reactions from the lab beaker to industrial plants — fuels, fertilisers, polymers, pharmaceuticals. Thermodynamics and process safety are the core of the craft.' },
  { slug: 'aerospace', icon: 'M3 14 C7 8 14 7 21 10 C17 14 8 16.5 3 14 Z M6 12.5 H16',
    blurb: 'Aerospace engineers design aircraft and spacecraft, where every gram and every joint is calculated. The airfoil is the discipline’s signature: a shape that turns moving air into lift.' },
  { slug: 'environmental', icon: 'M20 4 C10 4 4 10 4 20 C14 20 20 14 20 4 Z M6 18 C10 13.5 13.5 10 17.5 6.5',
    blurb: 'Environmental engineers protect water, air and soil — treatment plants, emissions control, remediation. In Central Asia the discipline is inseparable from water: irrigation efficiency and the recovery of the Aral Sea basin.' },
  { slug: 'software', icon: 'M9 3 V6 M15 3 V6 M9 18 V21 M15 18 V21 M3 9 H6 M3 15 H6 M18 9 H21 M18 15 H21 M6 6 H18 V18 H6 Z M10 10 H14 V14 H10 Z',
    blurb: 'Software engineering applies engineering discipline — specification, testing, verification — to code. As infrastructure becomes computer-controlled, a software defect is a civil-safety issue, which is why rigorous review culture matters.',
    demo: 'The bug was an off-by-one error: “<=” walked one step past the end of the array, and a single bad read poisoned the whole result (NaN). Most production failures are this small. Software engineering is the practice of catching them systematically — reviews, tests, invariants — not by luck.' },
  { slug: 'robotics', icon: 'M4 21 H14 M9 21 V15 M9 15 L14 8 M14 8 L19 11 M19 11 L21.5 8.5 M19 11 L21.5 13.5 M9 15 m-1.7 0 a1.7 1.7 0 1 0 3.4 0 a1.7 1.7 0 1 0 -3.4 0 M14 8 m-1.7 0 a1.7 1.7 0 1 0 3.4 0 a1.7 1.7 0 1 0 -3.4 0',
    blurb: 'Robotics and mechatronics combine mechanics, electronics and control software into machines that sense and act. Industrial arms, inspection quadrupeds and agricultural drones all share the same sense–plan–act loop.' },
  { slug: 'structural', icon: 'M12 3.5 m-1.5 0 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0 M11 5 L5.5 21 M13 5 L18.5 21 M7.6 15 A8.5 8.5 0 0 0 16.4 15',
    blurb: 'Structural and architectural engineers make buildings stand — sizing beams, columns and foundations against gravity, wind and earthquakes. The compass and the calculation belong together: form is only half the answer.' }
];

// Mini-activities for field-detail pages (electrical + software have bespoke
// interactive puzzles; these are quick one-question challenges).
export const ACTIVITIES = {
  mechanical: {
    prompt: 'Three gears mesh in a row. The first turns clockwise. Which way does the third turn?',
    options: [
      { label: 'Counter-clockwise', ok: false },
      { label: 'Clockwise', ok: true },
      { label: 'It cannot turn at all', ok: false }
    ],
    demo: 'Each meshing pair reverses direction, so an odd-numbered gear in a chain always turns with the first: CW → CCW → CW. Gear trains are how mechanical engineers trade speed for torque — the same counting rule sizes everything from wristwatches to mine hoists.'
  },
  civil: {
    prompt: 'A concrete beam sags under a heavy point load at mid-span. Where does one added column help most?',
    options: [
      { label: 'Directly under the mid-span load', ok: true },
      { label: 'At the left support', ok: false },
      { label: 'Anywhere — the effect is the same', ok: false }
    ],
    demo: 'Bending moment peaks where the load acts — mid-span — so support added there cuts the moment (and the sag) the most. Placing stiffness where the demand is largest, not just anywhere, is the core economy of structural design.'
  },
  industrial: {
    prompt: 'A production line has three stations: cutting 20/hr, welding 5/hr, painting 12/hr. What is the line’s maximum output?',
    options: [
      { label: '12.3/hr — the average', ok: false },
      { label: '5/hr — the slowest station', ok: true },
      { label: '20/hr — the fastest station', ok: false }
    ],
    demo: 'A line can never run faster than its bottleneck; the other stations just build queues or wait. Finding and widening bottlenecks — not speeding up what is already fast — is the heart of industrial engineering.'
  },
  chemical: {
    prompt: 'Balance the combustion: CH₄ + ? O₂ → CO₂ + 2 H₂O. How many O₂ molecules?',
    options: [
      { label: '1', ok: false },
      { label: '2', ok: true },
      { label: '3', ok: false }
    ],
    demo: 'Count the atoms: one carbon needs one CO₂, four hydrogens need two H₂O — four oxygen atoms in total, so 2 O₂. Every reactor, burner and refinery column starts from exactly this bookkeeping: mass in equals mass out.'
  },
  aerospace: {
    prompt: 'Lift grows as a wing’s angle of attack increases — until the wing suddenly stops flying. Around what angle does a typical wing stall?',
    options: [
      { label: 'About 4°', ok: false },
      { label: 'About 15°', ok: true },
      { label: 'About 45°', ok: false }
    ],
    demo: 'Past roughly 15° the airflow can no longer follow the wing’s upper surface and separates — lift collapses. The margin between useful lift and stall drives wing design, flight envelopes and every landing you have ever been on.'
  },
  environmental: {
    prompt: 'In a sand filter, water flows downward. Which layer order cleans best, top to bottom?',
    options: [
      { label: 'Fine sand → coarse sand → gravel', ok: true },
      { label: 'Gravel → coarse sand → fine sand', ok: false },
      { label: 'The order makes no difference', ok: false }
    ],
    demo: 'Fine media on top traps particles at the surface where the filter can be cleaned; coarse layers below carry the water away without clogging. Layered filtration like this — scaled up to whole treatment plants — is how cities turn river water into drinking water.'
  },
  robotics: {
    prompt: 'Every robot runs the same control loop, thousands of times per second. What must come first in each cycle?',
    options: [
      { label: 'Act — drive the motors', ok: false },
      { label: 'Plan — compute a path', ok: false },
      { label: 'Sense — measure the world', ok: true }
    ],
    demo: 'Acting on stale information is how robots crash: each cycle must first sense, then plan, then act. That sense–plan–act loop is the common skeleton of a factory arm, a warehouse rover and a self-driving car.'
  },
  structural: {
    prompt: 'Same material, same total weight of bars — which frame shape resists collapse best?',
    options: [
      { label: 'A square', ok: false },
      { label: 'A triangle', ok: true },
      { label: 'A circle of bars', ok: false }
    ],
    demo: 'A triangle cannot change shape without changing the length of a side, so its joints carry no bending — a square simply folds into a parallelogram. That is why trusses, cranes and transmission towers are built almost entirely of triangles.'
  }
};
