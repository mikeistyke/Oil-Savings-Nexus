export interface ExecutiveCorruptionSource {
  id: string;
  label: string;
  organization: string;
  year: string;
  category: 'Government' | 'Academic' | 'Private / Policy';
  href: string;
  note: string;
}

export interface ExecutiveCorruptionSection {
  id: string;
  eyebrow: string;
  heading: string;
  body: string[];
  citations: string[];
}

export const executiveCorruptionSources: ExecutiveCorruptionSource[] = [
  {
    id: '[1]',
    label: 'Economic Sanctions: Overview for the 117th Congress',
    organization: 'Congressional Research Service / Library of Congress',
    year: '2021',
    category: 'Government',
    href: 'https://www.congress.gov/crs-product/IF11730',
    note: 'CRS frames sanctions as a durable instrument of U.S. foreign policy and a recurring tool across administrations, useful for comparison with earlier presidents.',
  },
  {
    id: '[2]',
    label: 'United States produces more crude oil than any country, ever',
    organization: 'U.S. Energy Information Administration',
    year: '2024',
    category: 'Government',
    href: 'https://www.eia.gov/todayinenergy/detail.php?id=61545',
    note: 'EIA documents record U.S. output in 2023, which complicates claims that coercive foreign policy is needed to secure supply for Americans.',
  },
  {
    id: '[3]',
    label: 'What Have We Learned About the Macroeconomic Effects of Oil Price Shocks?',
    organization: 'Journal of Economic Literature / American Economic Association',
    year: '2012',
    category: 'Academic',
    href: 'https://www.aeaweb.org/articles?id=10.1257/jel.50.4.1054',
    note: 'Lutz Kilian and Robert J. Vigfusson survey the academic literature and conclude that oil shocks transmit through inflation, output, and demand channels rather than through a single mechanical price effect.',
  },
  {
    id: '[4]',
    label: 'Oil Price Shocks and Stock Returns',
    organization: 'NBER Reporter Digest',
    year: '2020',
    category: 'Academic',
    href: 'https://www.nber.org/digest/apr20/oil-price-shocks-and-stock-returns',
    note: 'NBER summarizes research finding that the stock market response depends on the source of the oil shock, with adverse supply disruptions tending to weigh on equity valuations.',
  },
  {
    id: '[5]',
    label: 'Trump’s New Maximum Pressure Campaign on Iran',
    organization: 'Brookings Institution',
    year: '2019',
    category: 'Private / Policy',
    href: 'https://www.brookings.edu/articles/trumps-new-maximum-pressure-campaign-on-iran/',
    note: 'Brookings describes the Trump-era approach as a maximum-pressure strategy, useful for distinguishing his style from the more coalition-based coercive tools used by some predecessors.',
  },
  {
    id: '[6]',
    label: 'Calibrating central bank inflation messages is key to policy success',
    organization: 'Federal Reserve Bank of Dallas',
    year: '2023',
    category: 'Government',
    href: 'https://www.dallasfed.org/research/economics/2023/0328',
    note: 'Dallas Fed emphasizes that households and firms face real attention limits in inflationary periods, which helps explain why energy-driven price shocks can produce outsized pain for ordinary savers.',
  },
];

export const executiveCorruptionSections: ExecutiveCorruptionSection[] = [
  {
    id: 'thesis',
    eyebrow: 'Thesis',
    heading: 'A coercive presidency does not have to be uniquely criminal to be wealth-destructive.',
    body: [
      'The strongest defensible comparison between Donald Trump and his predecessors is not that he invented pressure politics, but that he personalized it, branded it, and normalized its spectacle. The United States has long used sanctions, military pressure, and diplomatic coercion to shape commodity-producing regions, especially in the Middle East and Latin America. The Congressional Research Service describes sanctions as a standing instrument of U.S. statecraft rather than an improvisation by any single president, which means the relevant question is one of degree, style, and economic fallout rather than simple novelty.[1]',
      'On that measure, Trump stands out because he converted coercion into a public performance of dominance. His first term repeatedly advertised "maximum pressure" as an end in itself, especially toward Iran, and that framing mattered. It encouraged a climate in which disruption could be treated as proof of strength, even when disruption risked tighter oil markets, higher insurance and shipping premiums, and wider uncertainty for households already exposed to inflation. Brookings treated that Iran strategy as a distinct campaign, not merely a continuation of ordinary sanctions administration.[5]',
    ],
    citations: ['[1]', '[5]'],
  },
  {
    id: 'comparison',
    eyebrow: 'Comparison',
    heading: 'Trump did not begin the pattern, but he sharpened the indifference to collateral economic damage.',
    body: [
      'George W. Bush tied force to regime change after 9/11. Barack Obama more often preferred negotiated coalitions, targeted sanctions, and multilateral bargaining. Joe Biden has also used sanctions and strategic pressure, particularly after Russia’s full-scale invasion of Ukraine. Trump belongs inside that continuum, but his difference was rhetorical and institutional: he treated bargaining shocks, tariff threats, secondary sanctions, and personal threats to allies as visible evidence of leadership rather than as tools to be constrained by alliance management.[1][5]',
      'That distinction matters for oil markets because commodity systems price not only physical shortages but also political risk. When a president publicly signals that market disruption is acceptable collateral, traders, producers, insurers, and households begin pricing the possibility of escalation before barrels are actually lost. The result is that a style of executive politics can widen the wealth penalty of the shock even when the physical supply loss is temporary. That is the core sense in which executive indifference becomes economically corrupting: not always by direct theft, but by turning instability into a tolerated cost imposed on people with the least pricing power.',
    ],
    citations: ['[1]', '[5]'],
  },
  {
    id: 'oil-and-wealth',
    eyebrow: 'Oil And Wealth',
    heading: 'The middle class usually absorbs the first-round damage from oil disruption.',
    body: [
      'The academic literature is much firmer on this point than on partisan narratives. Lutz Kilian and Robert Vigfusson show that oil price shocks work through multiple channels, including inflation, output, and demand expectations, which is why they often hit ordinary households through transportation costs, consumer prices, and weaker macro growth rather than through gasoline alone.[3] NBER reporting on related work shows that stock returns also respond differently depending on whether the oil move comes from demand strength or from adverse supply news, with supply-driven shocks exerting the more damaging effect on broad equities.[4]',
      'That distinction is essential to the thesis of this page. If executives court or tolerate geopolitical friction in producer states, they do not merely alter foreign policy optics. They increase the odds of the kind of oil shock most associated with lower financial valuations and weaker household balance sheets. For middle-class families, the damage tends to arrive in layers: higher energy bills, more expensive freight embedded in everyday goods, pressure on inflation expectations, and shakier retirement portfolios as markets reprice future earnings.[3][4][6]',
    ],
    citations: ['[3]', '[4]', '[6]'],
  },
  {
    id: 'counterpoint',
    eyebrow: 'Counterpoint',
    heading: 'Record U.S. production weakens the argument that coercion abroad is needed to protect prosperity at home.',
    body: [
      'The Energy Information Administration reported that the United States produced more crude oil in 2023 than any country has ever produced in a single year.[2] That fact does not eliminate exposure to global prices, but it does undercut the old political claim that American household security depends on treating foreign pressure as the only route to energy abundance. The United States can be a record producer and still suffer from volatility imported through global pricing, shipping, sanctions, and conflict risk.',
      'That is why the strongest critique of Trump relative to his predecessors is not simply moral outrage. It is structural. A presidency that treats coercion as branding can intensify the very market conditions that punish workers, commuters, and retirement savers, even while domestic production remains historically high. In that sense, the corruption is executive before it is personal: power is exercised in a way that socializes the downside risk onto the middle class while concentrating the upside in narrow sectors that can hedge, speculate, or pass on costs.[2][4]',
    ],
    citations: ['[2]', '[4]'],
  },
  {
    id: 'conclusion',
    eyebrow: 'Conclusion',
    heading: 'The most serious charge is normalization, not novelty.',
    body: [
      'Trump should be compared to his predecessors as an escalator of an existing tradition, not as a solitary exception. The United States already possessed the instruments of sanctions, pressure, and intervention. What changed under Trump was the public normalization of indifference: the repeated suggestion that strong-arm politics was inherently productive, that visible coercion was a proxy for national gain, and that any resulting instability was a price others should bear. For oil markets and the American middle class, that is a dangerous political formula because the empirical literature points in the opposite direction. Supply-sensitive oil shocks and inflationary uncertainty erode wealth rather than secure it.[3][4][6]',
      'If this page is going to persuade, it should persuade on that narrower and stronger claim: when presidents treat coercion as a theater of strength, the middle class often finances the show. Trump may be the loudest recent example, but the deeper indictment reaches across administrations and asks why American power is so often judged by its willingness to impose disorder abroad without honestly pricing the losses at home.[1][5]',
    ],
    citations: ['[1]', '[3]', '[4]', '[5]', '[6]'],
  },
];

export const executiveCorruptionThesis = 'Oil disruption is not just a foreign-policy story. When U.S. presidents normalize coercive pressure in producer regions, the resulting uncertainty can move through inflation, equities, and household budgets in ways that leave the American middle class poorer.';