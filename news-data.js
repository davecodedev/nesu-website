// NESU news data.
// SEAM: replace the body of getNewsItems() with a real news-API fetch later —
// the page only calls getNewsItems() and expects this item shape:
// { id, category, title, summary, source, date, url }
const PLACEHOLDER_ITEMS = [
  { id: 'n01', category: 'Infrastructure', title: 'World’s longest immersed-tube tunnel passes final segment test',
    summary: 'The 18 km Baltic crossing completed hydrostatic testing of its last precast element, clearing the way for fit-out to begin next spring.',
    source: 'ENR', date: '09 Jul 2026', url: '#' },
  { id: 'n02', category: 'Renewable Energy', title: 'Perovskite-silicon tandem cells reach 34.2% in field trials',
    summary: 'A year-long outdoor trial reports record efficiency with under 2% degradation, a key step toward commercial tandem modules.',
    source: 'PV Magazine', date: '07 Jul 2026', url: '#' },
  { id: 'n03', category: 'Robotics', title: 'Quadruped robots certified for unmanned substation inspection',
    summary: 'Grid operators in three countries approved autonomous thermal-imaging patrols after a two-year pilot cut inspection costs by 40%.',
    source: 'IEEE Spectrum', date: '05 Jul 2026', url: '#' },
  { id: 'n04', category: 'Materials Science', title: 'Self-healing concrete admixture enters mass production',
    summary: 'Bacteria-based capsules that seal hairline cracks are now shipping at scale, with first use in marine foundations.',
    source: 'Materials Today', date: '02 Jul 2026', url: '#' },
  { id: 'n05', category: 'Aerospace', title: 'Hydrogen-electric regional aircraft completes 500 km demonstration flight',
    summary: 'The 40-seat demonstrator flew a full route profile on fuel-cell power, with certification targeted for 2029.',
    source: 'Aviation Week', date: '28 Jun 2026', url: '#' },
  { id: 'n06', category: 'Water Engineering', title: 'Drip-irrigation retrofit doubles water efficiency in Central Asian pilot',
    summary: 'A basin-scale modernisation project reports major reductions in canal losses, informing regional agricultural policy.',
    source: 'World Bank Blogs', date: '25 Jun 2026', url: '#' },
  { id: 'n07', category: 'Power Grid', title: 'HVDC interconnector links Caspian wind to South Asian demand centres',
    summary: 'The 2 GW line entered commercial operation, the first leg of a planned trans-regional green-energy corridor.',
    source: 'IEEE Spectrum', date: '21 Jun 2026', url: '#' },
  { id: 'n08', category: 'Transport', title: 'Automated track-renewal train lays 2 km of rail per shift',
    summary: 'The new maintenance platform combines robotic clip handling with continuous survey, cutting possession times in half.',
    source: 'Railway Gazette', date: '18 Jun 2026', url: '#' },
  { id: 'n09', category: 'Software', title: 'Open-source BIM standard adopted by four national road agencies',
    summary: 'The shared schema promises interoperable digital twins across borders — and lower licensing costs for public projects.',
    source: 'Infrastructure Intelligence', date: '14 Jun 2026', url: '#' },
  { id: 'n10', category: 'Seismic Engineering', title: 'Base-isolation retrofit standard updated after decade of sensor data',
    summary: 'Revised guidance draws on 10 years of instrumented-building records, refining displacement limits for mid-rise housing.',
    source: 'EERI', date: '10 Jun 2026', url: '#' }
];

export async function getNewsItems() {
  // Later: fetch + map a real news API here. Keep the returned shape identical.
  return PLACEHOLDER_ITEMS;
}
