export interface DataPoint {
  month: string;
  oilConsumption: number; // Million barrels per day
  oilPrice: number; // USD per barrel
  retirementIndex: number; // Normalized index of 401k/IRA performance
  totalRetirementAssets: number; // In Trillions USD
  iraAssets: number; // In Trillions USD
  k401Assets: number; // In Trillions USD
  inflationRate: number;
  date: string;
}

export const generateNexusData = (): DataPoint[] => {
  const months = [
    'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025',
    'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025',
    'Jan 2026', 'Feb 2026', 'Mar 2026'
  ];

  // Starting values (Approximate real-world scale for 2025)
  // Total US retirement assets were around $40T in late 2024
  let currentOilPrice = 75;
  let currentRetirementIndex = 100;
  let currentConsumption = 102;
  let totalAssets = 39.5; // Trillions

  return months.map((month, index) => {
    const volatility = Math.random() * 5 - 2;
    const oilTrend = index > 2 ? 1.5 : 0.5;
    
    currentOilPrice += oilTrend + volatility;
    currentConsumption += (Math.random() * 0.5 - 0.1);
    
    const marketPressure = (currentOilPrice - 75) * 0.15;
    const growthRate = (0.5 - (marketPressure * 0.1) + (Math.random() * 0.4 - 0.2)) / 100;
    
    totalAssets = totalAssets * (1 + growthRate);
    currentRetirementIndex = (totalAssets / 39.5) * 100;

    return {
      month,
      date: `2025-${(index % 12 + 1).toString().padStart(2, '0')}-01`,
      oilConsumption: parseFloat(currentConsumption.toFixed(2)),
      oilPrice: parseFloat(currentOilPrice.toFixed(2)),
      retirementIndex: parseFloat(currentRetirementIndex.toFixed(2)),
      totalRetirementAssets: parseFloat(totalAssets.toFixed(2)),
      iraAssets: parseFloat((totalAssets * 0.35).toFixed(2)), // Approx 35% in IRAs
      k401Assets: parseFloat((totalAssets * 0.20).toFixed(2)), // Approx 20% in 401ks
      inflationRate: parseFloat((3 + (currentOilPrice - 75) * 0.05).toFixed(2))
    };
  });
};

export const nexusNarrative = {
  title: "The Energy-Wealth Feedback Loop",
  summary: "Since January 2025, a strategic shift in energy policy has created a direct correlation between rising global oil consumption costs and the stagnation of middle-American retirement growth.",
  points: [
    {
      title: "Energy as a Stealth Tax",
      description: "Rising oil prices act as a regressive tax, siphoning capital away from discretionary savings into basic logistics and energy costs."
    },
    {
      title: "Corporate Margin Compression",
      description: "As global consumption outpaces strategic supply management, corporate margins shrink, directly impacting the equity markets that fuel 401(k) plans."
    },
    {
      title: "The 15-Month Divergence",
      description: "Data shows a widening gap between energy sector profits and broad-market retirement account health since the policy pivot in early 2025."
    }
  ]
};
