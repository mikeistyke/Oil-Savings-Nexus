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

export const executiveCorruptionTitle = 'The Cannibalization of Monroe';
export const executiveCorruptionByline = 'Written by Mike Cirigliano, aided by Google Gemini';
export const executiveCorruptionIntro = 'A personal reflection on the Trump Corollary, resource-first statecraft, and why oil-market disruption can cascade into middle-class wealth losses.';

export const executiveCorruptionSources: ExecutiveCorruptionSource[] = [
  {
    id: '[1]',
    label: '2025 National Security Strategy (White House PDF)',
    organization: 'The White House',
    year: '2025',
    category: 'Government',
    href: 'https://www.whitehouse.gov/wp-content/uploads/2025/12/2025-National-Security-Strategy.pdf',
    note: 'Primary document referenced for the policy language around the Trump Corollary and hemispheric strategy.',
  },
  {
    id: '[2]',
    label: 'Breaking Down Trump\'s 2025 National Security Strategy',
    organization: 'Brookings Institution',
    year: '2025',
    category: 'Private / Policy',
    href: 'https://www.brookings.edu/articles/breaking-down-trumps-2025-national-security-strategy/',
    note: 'Think-tank analysis of strategic shifts including hemispheric preeminence, migration, cartels, and China policy framing.',
  },
  {
    id: '[3]',
    label: 'The Trump Corollary in US Security Strategy Brings New Focus to Latin America',
    organization: 'Chatham House',
    year: '2025',
    category: 'Private / Policy',
    href: 'https://www.chathamhouse.org/2025/12/trump-corollary-us-security-strategy-brings-new-focus-latin-america-it-disordered-plan',
    note: 'Analysis of the doctrine\'s implications for U.S. political, economic, and military influence in the hemisphere.',
  },
  {
    id: '[4]',
    label: 'Ten Jolting Takeaways from Trump\'s New National Security Strategy',
    organization: 'War on the Rocks',
    year: '2025',
    category: 'Private / Policy',
    href: 'https://warontherocks.com/2025/12/ten-jolting-takeaways-from-trumps-new-national-security-strategy/',
    note: 'Commentary focused on strategic reprioritization and implications of hemispheric-first doctrine.',
  },
  {
    id: '[5]',
    label: 'White House Calls NSS Trump\'s Version of the Monroe Doctrine',
    organization: 'NPR',
    year: '2025',
    category: 'Private / Policy',
    href: 'https://www.npr.org/2025/12/09/nx-s1-5633261/white-house-calls-national-security-strategy-trumps-version-of-the-monroe-doctrine',
    note: 'News coverage tying doctrine language to contemporaneous policy actions and operations in the hemisphere.',
  },
  {
    id: '[6]',
    label: 'The Trump Corollary to the Monroe Doctrine: Crisis or Opportunity',
    organization: 'RUSI',
    year: '2025',
    category: 'Private / Policy',
    href: 'https://www.rusi.org/explore-our-research/publications/commentary/trump-corollary-monroe-doctrine-crisis-or-opportunity',
    note: 'Security-policy commentary that weighs potential strategic gains against escalation and instability risks.',
  },
];

export const executiveCorruptionSections: ExecutiveCorruptionSection[] = [
  {
    id: 'main-essay',
    eyebrow: 'Essay',
    heading: 'The Cannibalization of Monroe',
    body: [
      'What do you call it when a superpower quietly decides that oil fields and shipping lanes matter more than treaties and trust? When I watch the headlines roll by from my kitchen table in Shenandoah, Virginia - new strikes in the Gulf, another carrier group off Venezuela\'s coast - it doesn\'t feel abstract. It feels like someone has reached into my gas tank, my grocery bill, and my retirement account and started rearranging the furniture.',
      'Over the last few years, a new American foreign-policy mindset has moved from think-tank white papers into the official 2025 National Security Strategy. Commentators have started calling it the "Trump Corollary" to the Monroe Doctrine: a return to the idea that the Western Hemisphere is America\'s backyard, but updated for a world where the real power isn\'t just borders - it\'s who controls oil, gas, rare earths, and the chokepoints where those things move.',
      'Under this corollary, the old language of "rules-based order" gives way to something more bluntly transactional. Instead of saying, "We defend global stability because it helps our allies and the system," the quiet premise sounds more like: "We secure direct leverage over critical resources so we\'re not at the mercy of anyone else\'s instability." In practice, that has meant a heavy emphasis on the Western Hemisphere and nearby waters; the strategy frames the region as central to U.S. security and to the resilience of American supply chains.',
      'If you squint, some of this looks familiar. The original Monroe Doctrine warned European powers to stay out of Latin America, and the Roosevelt Corollary later expanded that into a kind of self-appointed "international police power" in the hemisphere. The Trump version pushes further: it doesn\'t just object to foreign troops or colonies; it signals that Washington aims to deny other states control over "strategically vital assets" in the Americas, from ports to pipelines. It\'s about who owns, finances, and ultimately can shut off the tap.',
      'You can see how this logic plays out in operations like Operation Southern Spear, the U.S. campaign off Venezuela\'s coast that began as a surge against narco-trafficking but quickly took on broader strategic weight. Analysts describe it as a hybrid of the war on drugs and a bid to reshape Venezuela\'s political and economic trajectory, right down to control over its oil exports. Whether the public framing is "drug boats" or "terrorist networks," the underlying question is the same: who ultimately controls the flow of energy out of the Caribbean basin, and on what terms?',
      'From my vantage point, the pivot here is simple but unsettling: it treats invasions, sanctions, and naval cordons less as tools to spread democracy and more as ways to "lock up" resources. In that story, it is supposedly cheaper - over decades - to seize and stabilize a resource-rich region once than to live indefinitely with price spikes caused by coups, blockades, or hostile regimes. The cost isn\'t just measured in dollars; it\'s counted in lives, legitimacy, and the precedents we set about when force is acceptable.',
      'This all sounds very far away until you look at the receipt in your hand at the grocery store or the little red number in your 401(k) app. When tankers face higher insurance premiums in the Strait of Hormuz or the Caribbean because of missile strikes or "near misses," shipping companies pass that risk on in the form of higher freight costs. Those costs don\'t stay in the Gulf; they land in the price of lettuce, diesel, and everything that rides on a truck across America.',
      'Financial markets translate these shocks into a different kind of anxiety. Investors don\'t just look at earnings; they look at whether any given week might bring a new strike, sanction package, or blockade that reroutes global trade. When a big power signals that international law is more flexible than it used to be, money tends to run toward gold, cash, and short-term Treasuries, and away from the kind of long-term bets that make your retirement account grow steadily. The jargon for this is "risk-off," but it feels, in lived experience, like volatility and unease.',
      'Of course, this "Trump Corollary" doesn\'t live alone in some vacuum-sealed glass case. It\'s sitting on a shelf next to older, competing ways of thinking about America\'s role in the world. There\'s Liberal Internationalism, which leans on alliances like NATO and institutions like the UN, betting that stable rules and shared norms create safer trade routes and fewer shocks. There\'s Restraint or offshore balancing, the view that every "necessary" intervention grows into something that costs more than it\'s worth and that the U.S. should only act directly when a true hegemon threatens a region.',
      'You also have Democratic Peace Theory, which says democracies rarely fight each other and urges us to rely on sanctions, diplomacy, and economic engagement rather than tanks to open markets. And then there\'s the more hard-edged resource-first approach implied by the Trump Corollary, which openly prioritizes control of strategic nodes - oil fields, rare-earth mines, ports - accepting higher short-term volatility in exchange for a hoped-for future of "managed" prices. Each of these isn\'t just a foreign-policy theory; it\'s a different story about how your job, your gas bill, and your savings are connected to a map you rarely see.',
      'When I sit with all this, I notice the tension between my love of order and my skepticism of overreach. Part of me is drawn to the promise of stability - who wouldn\'t want predictable prices and fewer supply shocks after the last decade? But another part of me hears a quieter question: if we normalize using force to secure "our" resources wherever they happen to be under someone else\'s soil, what kind of world are we building for our kids? A doctrine isn\'t just language in a PDF; it\'s the invisible architecture behind the numbers we see at the pump, the headlines on our phones, and the moral weather we\'re asking the next generation to live inside.',
      'As someone wired for context and connection, I\'m less interested in whether this doctrine is strong and more interested in what it does to the web of relationships that keep markets and people stable.',
      'My strengths live in wonder and enablement, so I naturally ask: what else could we build, short of invasion, that still protects people from wild swings at the pump?',
      'Note on process: I drafted this reflection with support from Google\'s Gemini AI, then rewrote, fact-checked, and shaped it in my own voice. Any errors - or strong opinions - are mine alone.',
      'Ever clicked through a story that mentions "sources" but leaves you hunting for the actual links? From my desk in Elkton, Virginia, on this quiet March morning in 2026, I get it - that itch for the raw material behind the words. Here are direct links to key sources referenced throughout our discussion on the Trump Corollary and its reworking of the Monroe Doctrine, pulled straight from the analyses we\'ve covered.',
    ],
    citations: ['[1]', '[2]', '[3]', '[4]', '[5]', '[6]'],
  },
];

export const executiveCorruptionThesis = 'The essay argues that a resource-first Trump Corollary can magnify geopolitical volatility and shift downstream economic pain onto American households through fuel, freight, and retirement-account pressure.';