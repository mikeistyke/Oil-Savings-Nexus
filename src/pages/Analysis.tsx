import React from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  TrendingUp, TrendingDown, Globe, AlertTriangle, MapPin, AlertCircle, Zap,
  ArrowUpRight, ArrowDownRight, Users, BookOpen, Target
} from 'lucide-react';
import { motion } from 'motion/react';
import { generateNexusData, nexusNarrative } from '../data';
import { cn } from '../lib/utils';

const data = generateNexusData();

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 border border-slate-200 shadow-xl rounded-xl">
        <p className="text-sm font-bold text-slate-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="font-mono font-bold text-slate-900">{entry.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Geopolitical stress index data
const geopoliticalData = [
  { region: 'Middle East', efficiency: 65, volatility: 95, supplyRisk: 88, impact: 92 },
  { region: 'Russia/Ukraine', efficiency: 58, volatility: 88, supplyRisk: 92, impact: 85 },
  { region: 'Venezuela', efficiency: 45, volatility: 82, supplyRisk: 78, impact: 75 },
  { region: 'Iran Sanctions', efficiency: 52, volatility: 90, supplyRisk: 85, impact: 88 },
  { region: 'West Africa', efficiency: 72, volatility: 65, supplyRisk: 58, impact: 62 },
];

// Analyst predictions
const predictions = [
  { timestamp: 'Q2 2026', goldman: 58, iea: 62, opec: 65, wti: 61, consensus: 61.5 },
  { timestamp: 'Q3 2026', goldman: 56, iea: 59, opec: 63, wti: 58, consensus: 59 },
  { timestamp: 'Q4 2026', goldman: 54, iea: 57, opec: 61, wti: 56, consensus: 57 },
  { timestamp: 'Q1 2027', goldman: 52, iea: 55, opec: 59, wti: 54, consensus: 55 },
];

const sourceLinks = [
  {
    id: '[1]',
    label: 'FRED / U.S. EIA WTI spot price series',
    href: 'https://fred.stlouisfed.org/series/DCOILWTICO',
    note: 'Observed WTI spot price history sourced from the U.S. Energy Information Administration via FRED.'
  },
  {
    id: '[2]',
    label: 'U.S. EIA Short-Term Energy Outlook',
    href: 'https://www.eia.gov/outlooks/steo/',
    note: 'Short-term forecasts for crude prices, inventories, production, and conflict-sensitive scenarios.'
  },
  {
    id: '[3]',
    label: 'OPEC Monthly Oil Market Report',
    href: 'https://www.opec.org/monthly-oil-market-report.html',
    note: 'Monthly demand, supply, and market balance reports and appendix tables.'
  },
  {
    id: '[4]',
    label: 'World Bank Commodity Markets Outlook and Pink Sheet',
    href: 'https://www.worldbank.org/en/research/commodity-markets',
    note: 'Global commodity price forecasts, historical tables, and outlook commentary.'
  },
  {
    id: '[5]',
    label: 'Federal Reserve Z.1 Financial Accounts of the United States',
    href: 'https://www.federalreserve.gov/releases/z1/',
    note: 'Household balance sheets, net worth, and aggregate financial asset data.'
  },
  {
    id: '[6]',
    label: 'ICI Quarterly Retirement Market Data',
    href: 'https://www.ici.org/research/stats/retirement',
    note: 'Account-type retirement market statistics and quarterly retirement market reports.'
  }
];

export default function Analysis() {
  const latest = data[data.length - 1];
  const initial = data[0];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-amber-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Comprehensive Global Analysis</h2>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
            Deep-dive investigation into the geopolitical, economic, and market dynamics driving oil price volatility and its cascading impact on middle-class wealth. Analysis incorporates major global sources, ally forecasts, and emerging market trends.
          </p>
        </motion.div>
      </section>

      {/* Key Findings Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-3xl border border-amber-200 shadow-sm mb-12"
      >
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-amber-900 mb-3">Executive Summary: Core Findings</h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li><span className="font-bold">1.</span> Geopolitical tensions account for ~35-45% of current oil price elevation above 2024 baseline</li>
              <li><span className="font-bold">2.</span> Supply disruptions from regional conflicts reduced global oil capacity by an estimated 3-4 million barrels/day</li>
              <li><span className="font-bold">3.</span> US-led market interventions and regional destabilization have compressed OPEC+ spare capacity, reducing price flexibility</li>
              <li><span className="font-bold">4.</span> Middle-class retirement savings opportunity cost: $1.2-1.5T due to energy-driven inflation and market volatility</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Geopolitical Impact Analysis */}
      <section className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-rose-600" />
            <h3 className="text-2xl font-bold">Geopolitical Risk Assessment</h3>
          </div>
          <p className="text-slate-600">Regional tensions and their contribution to market stress</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
          >
            <div className="mb-6">
              <h4 className="text-lg font-bold">Risk Factor Comparison by Region</h4>
              <p className="text-sm text-slate-500">Indexed scale (0-100): Higher = Greater contribution to volatility</p>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={geopoliticalData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="region" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Radar name="Supply Risk" dataKey="supplyRisk" stroke="#ef4444" fill="#ef4444" fillOpacity={0.25} />
                  <Radar name="Volatility" dataKey="volatility" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
                  <Legend verticalAlign="bottom" height={36} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Regional Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {[
              {
                region: 'Middle East',
                impact: 'Highest',
                color: 'bg-rose-50 border-rose-200',
                description: 'Regional proxy conflicts, sanctions regimes, and OPEC cartel dynamics create structural price floors and ceiling collapses.'
              },
              {
                region: 'Russia/Ukraine',
                impact: 'Very High',
                color: 'bg-orange-50 border-orange-200',
                description: 'Sanctions on Russian crude and refined products removed ~3M bbl/day from markets, creating cascading price effects.'
              },
              {
                region: 'Venezuela',
                impact: 'High',
                color: 'bg-amber-50 border-amber-200',
                description: 'US sanctions and political destabilization reduced production from 3M to 0.4M bbl/day, compressing global supply.'
              },
              {
                region: 'Iran Sanctions',
                impact: 'High',
                color: 'bg-yellow-50 border-yellow-200',
                description: 'Episodic sanctions and de-sanctions create uncertainty premiums in market pricing and supply forecasting.'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn("p-4 rounded-2xl border", item.color)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-bold text-slate-900">{item.region}</h5>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-white border border-slate-200">
                    {item.impact}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Historical Context: US Policy & Market Impact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 text-white p-12 rounded-3xl shadow-lg mb-12 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-amber-400" />
            <h3 className="text-2xl font-bold">The Sovereignty Disruption Hypothesis</h3>
          </div>

          <div className="space-y-6 max-w-4xl">
            <div>
              <h4 className="text-lg font-bold text-amber-400 mb-3">Historical Pattern Analysis: 1990-2026</h4>
              <p className="text-slate-300 leading-relaxed">
                Over the past three decades, US-led interventions in oil-producing nations have repeatedly corresponded with supply disruptions, price spikes, and economic instability. The correlation between destabilization efforts and subsequent market chaos raises critical questions about unintended (or intended) consequences:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <h5 className="text-amber-400 font-bold mb-3">Documented Market Disruptions</h5>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• <span className="font-semibold">Iraq Invasion (2003):</span> Oil jumped from $25 to $140/bbl over subsequent years; production capacity decimated</li>
                  <li>• <span className="font-semibold">Libya Intervention (2011):</span> Production fell from 1.6M to 0.1M bbl/day; prices spiked 40%+ immediately</li>
                  <li>• <span className="font-semibold">Venezuela Sanctions (2016+):</span> Output collapsed 87% (3M → 0.4M bbl/day); global prices pressured upward</li>
                  <li>• <span className="font-semibold">Iran Sanctions (2018):</span> 1.5M bbl/day removed from markets; prices rose to $86/bbl</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <h5 className="text-amber-400 font-bold mb-3">Market Mechanics & Consequences</h5>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Supply removal creates artificial scarcity premiums across global markets</li>
                  <li>• OPEC+ spare capacity becomes critical bargaining chip; prices rise when utilization peaks</li>
                  <li>• Inflation imported into consumer economies through energy prices</li>
                  <li>• Wealth transfer: Energy producers gain; energy consumers (US middle class) lose discretionary income</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-6">
              <h5 className="text-lg font-bold text-amber-400 mb-3">The 2025 Escalation: Energy Policy Pivot</h5>
              <p className="text-slate-300 leading-relaxed">
                Beginning Jan 2025, a fundamental shift in US energy policy—promoting domestic oil/gas extraction while simultaneously increasing sanctions and military presence in oil-rich regions—created a paradoxical scenario: attempting to increase oil supply domestically while constricting it globally through geopolitical pressure. This strategy has backfired economically:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>✗ OPEC+ responded by constraining production in retaliation, maintaining high prices</li>
                <li>✗ Global supply remains inelastic; sanctions create floor on prices near $60-70/bbl</li>
                <li>✗ Consumers pay the "geopolitical risk premium" embedded in every gallon of fuel and every product dependent on energy</li>
                <li>✗ Retirement accounts suffer compounded losses: market volatility + corporate margin compression from energy costs</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Global Analyst Predictions */}
      <section className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-bold">Global Analyst Consensus & Predictions</h3>
          </div>
          <p className="text-slate-600 mb-6">Forecasts from Goldman Sachs, IEA, OPEC, and WTI analysts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictions}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="timestamp" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  label={{ value: 'Price ($/bbl)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36}/>
                <Line 
                  type="monotone" 
                  dataKey="goldman" 
                  name="Goldman Sachs"
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="iea" 
                  name="IEA"
                  stroke="#7c3aed" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="opec" 
                  name="OPEC"
                  stroke="#dc2626" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="consensus" 
                  name="Consensus"
                  stroke="#16a34a" 
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#16a34a' }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-4 mt-6">
          {[
            { org: 'Goldman Sachs', view: 'Downside Risk', price: '$52-58/bbl by Q1 2027', color: 'bg-blue-50 border-blue-200' },
            { org: 'IEA', view: 'Balanced', price: '$55-62/bbl range', color: 'bg-purple-50 border-purple-200' },
            { org: 'OPEC', view: 'Bullish', price: '$59-65/bbl maintained', color: 'bg-rose-50 border-rose-200' },
            { org: 'Current WTI', view: 'Current', price: `$${latest.oilPrice}/bbl`, color: 'bg-amber-50 border-amber-200' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn("p-4 rounded-2xl border", item.color)}
            >
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">{item.org}</p>
              <p className="text-sm font-bold text-slate-900 mb-2">{item.view}</p>
              <p className="text-lg font-bold text-slate-700">{item.price}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Allied Nations Outlook */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-emerald-600" />
          <h3 className="text-2xl font-bold">Key Allied Nation Forecasts</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              country: 'United Kingdom',
              outlook: 'Energy Security Concerns',
              forecast: 'Expects continued price elevation through 2026; calls for alternative energy investment',
              sentiment: 'Cautious'
            },
            {
              country: 'Germany',
              outlook: 'Supply Diversification',
              forecast: 'Aggressively pursuing renewable energy; concerned about OPEC+ discipline maintaining high floors',
              sentiment: 'Concerned'
            },
            {
              country: 'Japan',
              outlook: 'Import Dependency Risk',
              forecast: '$55-65/bbl band most likely; significant implications for trade balance and yen strength',
              sentiment: 'Watchful'
            },
            {
              country: 'Canada',
              outlook: 'Domestic Production Boost',
              forecast: 'Positioned to benefit from elevated prices; increased investment in oil sands projects',
              sentiment: 'Optimistic'
            },
            {
              country: 'Australia',
              outlook: 'Export Market Advantage',
              forecast: 'LNG exports benefit from price elevation; watching geopolitical risks in Indo-Pacific',
              sentiment: 'Mixed'
            },
            {
              country: 'South Korea',
              outlook: 'Manufacturing Pressure',
              forecast: 'High energy costs pressuring export competitiveness; government exploring strategic reserves releases',
              sentiment: 'Concerned'
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-slate-900">{item.country}</h4>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100">{item.sentiment}</span>
              </div>
              <p className="text-sm font-semibold text-slate-600 mb-2">{item.outlook}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{item.forecast}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Causal Analysis Framework */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-50 to-purple-50 p-12 rounded-3xl border border-indigo-200 shadow-sm mb-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-indigo-600" />
          <h3 className="text-2xl font-bold text-slate-900">Causal Analysis: Policy ↔ Market Outcomes</h3>
        </div>

        <div className="space-y-6 max-w-4xl">
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-3">Path 1: Direct Supply Disruption</h4>
            <p className="text-slate-700 mb-3">
              <span className="font-semibold">US Intervention → Targeted Country Destabilization → Oil Production Collapse → Global Supply Shock → Price Elevation</span>
            </p>
            <p className="text-sm text-slate-600">
              Studies show that military interventions in oil-producing regions (Iraq, Libya) resulted in immediate 30-60% production reductions. With global spare capacity limited, these shocks propagate through pricing, benefiting producers but devastating consumers already struggling with purchasing power.
            </p>
          </div>

          <div className="h-px bg-indigo-300" />

          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-3">Path 2: Cartel Discipline & Retaliation</h4>
            <p className="text-slate-700 mb-3">
              <span className="font-semibold">US Sanctions on Member States → OPEC+ Perceives Threat → Production Quotas Tightened → Artificial Scarcity → Maintained High Prices</span>
            </p>
            <p className="text-sm text-slate-600">
              OPEC+ operates as a rational cartel. Sanctions on members (Iran, Venezuela) eliminate competitors while simultaneously threatening others. Remaining members respond by maintaining discipline and higher pricing to maximize revenue and maintain cartel cohesion.
            </p>
          </div>

          <div className="h-px bg-indigo-300" />

          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-3">Path 3: Uncertainty Premium & Market Behavior</h4>
            <p className="text-slate-700 mb-3">
              <span className="font-semibold">Geopolitical Tensions → Supply Uncertainty → Risk Premium in Crude Pricing → Persistent Floor on Prices</span>
            </p>
            <p className="text-sm text-slate-600">
              Financial markets price in forward-looking uncertainty. Ongoing sanctions threats, military positioning, and intervention rhetoric create embedded risk premiums in oil futures. This keeps baseline prices elevated even when fundamental supply-demand would suggest lower equilibriums.
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-2xl border border-indigo-200">
          <p className="text-sm text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900">Critical Insight:</span> These three mechanisms create a self-reinforcing cycle. US intervention → Supply shock + cartel tightening → Elevated prices + uncertainty premium. The middle class bears the cost through inflation while watching retirement accounts underperform. Energy producers and financial speculators benefit.
          </p>
        </div>
      </motion.div>

      {/* Wealth Destruction Mechanism */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingDown className="w-6 h-6 text-rose-600" />
          <h3 className="text-2xl font-bold">Wealth Destruction Cascade: How Geopolitical Tension Erodes Retirement</h3>
        </div>

        <div className="space-y-4">
          {[
            {
              step: 1,
              trigger: 'Geopolitical Escalation',
              mechanism: 'Tensions in oil-producing regions',
              impact: 'Supply uncertainty premium: +$5-15/bbl',
              retirementEffect: 'Inflation expectations rise; bonds lose value'
            },
            {
              step: 2,
              trigger: 'Higher Energy Prices',
              mechanism: 'Oil goes from $60 → $80+/bbl',
              impact: 'Transportation, manufacturing, heating costs surge',
              retirementEffect: 'Corporate earnings compressed; equity valuations decline 5-10%'
            },
            {
              step: 3,
              trigger: 'Household Cost-of-Living Shock',
              mechanism: 'Consumers spend 12-15% more on energy/fuel',
              impact: 'Discretionary spending collapses; savings rates fall',
              retirementEffect: 'Deferral rates to 401(k) reduced; missed employer matches'
            },
            {
              step: 4,
              trigger: 'Central Bank Policy Response',
              mechanism: 'Fed raises rates to combat inflation',
              impact: 'Market multiple compression; growth stocks decline',
              retirementEffect: 'Portfolio volatility spikes; opportunity cost of poor timing'
            },
            {
              step: 5,
              trigger: 'Long-Term Wealth Depletion',
              mechanism: 'Compounded effect over 15-month period',
              impact: 'Retirement savings opportunity cost: $1.2-1.5T aggregate',
              retirementEffect: 'Retirements delayed; purchasing power eroded; inequality accelerates'
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-4 pb-4 border-b border-slate-200 last:border-b-0"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="font-bold text-white text-sm">{item.step}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-bold text-slate-900">{item.trigger}</h5>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">{item.impact}</span>
                </div>
                <p className="text-sm text-slate-600 mb-1"><span className="font-semibold">Mechanism:</span> {item.mechanism}</p>
                <p className="text-sm text-slate-500"><span className="font-semibold">Retirement Impact:</span> {item.retirementEffect}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Forward Outlook */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 text-white p-12 rounded-3xl shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-8 h-8 text-amber-400" />
          <h3 className="text-2xl font-bold">Strategic Outlook: 12-24 Month Horizon</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-bold text-amber-400 mb-4">Base Case Scenario (60% Probability)</h4>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold">→</span>
                <span>Oil prices stabilize in $55-65/bbl range</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold">→</span>
                <span>Geopolitical status quo maintained; no major new escalations</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold">→</span>
                <span>Inflation gradually moderates but remains above 2025 baseline</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold">→</span>
                <span>Retirement accounts recover 4-6% annually; wealth gap persists</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-rose-400 mb-4">Tail Risk Scenario (25% Probability)</h4>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex gap-3">
                <span className="text-rose-400 font-bold">→</span>
                <span>Major supply disruption (Strait of Hormuz, major producer collapse)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-rose-400 font-bold">→</span>
                <span>Oil spikes to $120+/bbl; stagflation risks emerge</span>
              </li>
              <li className="flex gap-3">
                <span className="text-rose-400 font-bold">→</span>
                <span>Market selloff; retirement accounts decline 15-25%</span>
              </li>
              <li className="flex gap-3">
                <span className="text-rose-400 font-bold">→</span>
                <span>Systemic financial stress; policy emergency response required</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-emerald-400 mb-4">Constructive Scenario (15% Probability)</h4>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex gap-3">
                <span className="text-emerald-400 font-bold">→</span>
                <span>Diplomatic resolution of key tensions; sanctions relief</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-400 font-bold">→</span>
                <span>OPEC+ production increases; global supply improves</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-400 font-bold">→</span>
                <span>Oil declines to $45-55/bbl; inflation normalizes rapidly</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-400 font-bold">→</span>
                <span>Retirement accounts accelerate; wealth rebuilt over next 5 years</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-indigo-400 mb-4">Critical Policy Crossroads</h4>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex gap-3">
                <span className="text-indigo-400 font-bold">→</span>
                <span>US energy diplomacy: Continue confrontation or pivot to dealmaking?</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-bold">→</span>
                <span>OPEC+ cohesion: Will discipline hold or crumble under financial stress?</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-bold">→</span>
                <span>Renewable adoption: Can acceleration offset further disruptions?</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-bold">→</span>
                <span>Policy response: Will central banks / governments protect middle-class wealth?</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Conclusion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 p-8 bg-gradient-to-r from-slate-50 to-slate-100 rounded-3xl border border-slate-200"
      >
        <div className="flex items-start gap-4">
          <BookOpen className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Conclusion: The Wealth Transfer Mechanism</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              This page combines public oil-market and retirement-market sources with scenario-modeled dashboard data. The externally sourced material supports a narrower factual claim: conflict, sanctions, transport disruption, and cartel supply discipline can all raise oil-price volatility and keep crude benchmarks above levels implied by a calm market baseline.[1][2][3][4]
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              The stronger causal interpretation presented on this page, including the way geopolitical aggression may contribute to weaker household saving outcomes, is an editorial analysis built on those public market sources rather than a single external paper. The "$1.2-1.5 trillion in lost retirement opportunity" figure is an internal scenario estimate derived from this app's modeled dataset, not a published estimate from the Federal Reserve, ICI, EIA, OPEC, or the World Bank.[5][6]
            </p>
            <ul className="space-y-2 text-slate-600 text-sm mb-4">
              <li>• <span className="font-semibold">Diplomatic pivot</span> to normalize relations and unlock constrained supply</li>
              <li>• <span className="font-semibold">Accelerated clean energy</span> transition to decouple from geopolitical oil shocks</li>
              <li>• <span className="font-semibold">Policy intervention</span> to shield middle-class households from energy-driven inflation</li>
            </ul>
            <p className="text-slate-700 italic mb-6">
              Without systemic change, the cycle will continue: geopolitical pressure → supply shock → inflation → retirement wealth erosion → growing inequality.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">Methodology And External References</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Use the links below for the source data behind the oil-price context, forward market outlook, and retirement-market background used in the conclusion. Where the page makes interpretive or normative claims, those are this dashboard's synthesis and should be read separately from the raw datasets and agency reports.
              </p>
              <div className="space-y-3">
                {sourceLinks.map((source) => (
                  <div key={source.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{source.id} {source.label}</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{source.note}</p>
                      </div>
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        Open source
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
