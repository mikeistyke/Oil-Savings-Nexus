import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Droplets, Wallet, AlertTriangle, 
  Info, ArrowUpRight, ArrowDownRight, Activity, Globe, Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { generateNexusData, nexusNarrative } from './data';
import { cn } from './lib/utils';

const data = generateNexusData();

const StatCard = ({ title, value, subValue, icon: Icon, trend, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2 rounded-lg", color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {trend && (
        <div className={cn(
          "flex items-center text-xs font-medium px-2 py-1 rounded-full",
          trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {trend > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <div className="mt-1 flex items-baseline gap-2">
      <span className="text-2xl font-bold text-slate-900">{value}</span>
      <span className="text-slate-400 text-xs">{subValue}</span>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 border border-slate-200 shadow-xl rounded-xl">
        <p className="text-sm font-bold text-slate-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="font-mono font-bold text-slate-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const latest = data[data.length - 1];
  const initial = data[0];
  
  const oilChange = (((latest.oilPrice - initial.oilPrice) / initial.oilPrice) * 100).toFixed(1);
  const wealthChange = (((latest.retirementIndex - initial.retirementIndex) / initial.retirementIndex) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Oil & Wealth Nexus</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">15-Month Economic Analysis (2025-2026)</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['Overview', 'Oil Dynamics', 'Retirement Impact', 'Analysis'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                  activeTab === tab.toLowerCase() 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6"
              >
                The Self-Inflicted <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Energy War</span> and Middle-Class Wealth.
              </motion.h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Since January 2025, the shift in energy policy has triggered a global consumption surge that directly competes with the wealth-building capacity of American households. Explore the nexus between rising barrel prices and the depletion of retirement security.
              </p>
            </div>
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-slate-400">
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Global Status</span>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Avg. Oil Price (2026)</p>
                    <p className="text-3xl font-bold">${latest.oilPrice}<span className="text-sm font-normal text-slate-500 ml-2">/bbl</span></p>
                  </div>
                  <div className="h-px bg-slate-800" />
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Retirement Growth Delta</p>
                    <p className="text-3xl font-bold text-rose-400">{wealthChange}%<span className="text-sm font-normal text-slate-500 ml-2">vs 2024</span></p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-12 -bottom-12 opacity-10">
                <Droplets className="w-64 h-64" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <StatCard 
            title="Global Oil Consumption" 
            value={`${latest.oilConsumption}M`} 
            subValue="Barrels / Day" 
            icon={Droplets} 
            trend={2.4}
            color="bg-blue-600"
          />
          <StatCard 
            title="Crude Price Index" 
            value={`$${latest.oilPrice}`} 
            subValue="WTI Crude" 
            icon={Zap} 
            trend={parseFloat(oilChange)}
            color="bg-amber-600"
          />
          <StatCard 
            title="Total Retirement Assets" 
            value={`$${latest.totalRetirementAssets}T`} 
            subValue="US Total (401k/IRA)" 
            icon={Wallet} 
            trend={parseFloat(wealthChange)}
            color="bg-indigo-600"
          />
          <StatCard 
            title="Retirement Index" 
            value={latest.retirementIndex} 
            subValue="Growth Benchmark" 
            icon={TrendingUp} 
            trend={parseFloat(wealthChange)}
            color="bg-emerald-600"
          />
          <StatCard 
            title="Inflation Pressure" 
            value={`${latest.inflationRate}%`} 
            subValue="Energy Core" 
            icon={AlertTriangle} 
            trend={1.2}
            color="bg-rose-600"
          />
        </div>

        {/* Retirement Savings Deep Dive */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Wallet className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-bold">US Retirement Savings Analysis</h3>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Detailed Line Graph: Asset Growth */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
            >
              <div className="mb-6">
                <h4 className="text-lg font-bold">Total Retirement Asset Growth</h4>
                <p className="text-sm text-slate-500">Aggregate value of 401(k) and IRA accounts (Trillions USD)</p>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                    />
                    <YAxis 
                      domain={['dataMin - 1', 'dataMax + 1']}
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36}/>
                    <Line 
                      type="monotone" 
                      dataKey="totalRetirementAssets" 
                      name="Total Assets ($T)"
                      stroke="#4f46e5" 
                      strokeWidth={4}
                      dot={{ r: 4, fill: '#4f46e5' }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-900">Analysis:</span> The total pool of US retirement savings has seen a volatile trajectory since January 2025. While nominal values have increased, the rate of growth has been significantly dampened by rising energy costs which act as a drag on corporate earnings and household disposable income.
                </p>
              </div>
            </motion.div>

            {/* Detailed Bar Graph: IRA vs 401k */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
            >
              <div className="mb-6">
                <h4 className="text-lg font-bold">Account Type Breakdown</h4>
                <p className="text-sm text-slate-500">Estimated distribution of assets ($T)</p>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      interval={2}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36}/>
                    <Bar dataKey="iraAssets" name="IRAs ($T)" fill="#6366f1" stackId="a" />
                    <Bar dataKey="k401Assets" name="401(k)s ($T)" fill="#818cf8" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <h5 className="text-sm font-bold mb-2">Key Insight</h5>
                <p className="text-xs text-slate-500 leading-relaxed">
                  IRAs continue to hold the largest share of retirement wealth, but 401(k) contributions have become increasingly sensitive to the "energy tax" as workers adjust deferral rates to manage higher cost-of-living expenses.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Chart 1: The Nexus */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold">The Price-Wealth Divergence</h3>
                <p className="text-sm text-slate-500">Tracking Oil Prices vs. Retirement Index since Jan 2025</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                  <div className="w-3 h-3 rounded-full bg-indigo-600" /> Retirement
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                  <div className="w-3 h-3 rounded-full bg-amber-500" /> Oil Price
                </div>
              </div>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRetirement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOil" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="retirementIndex" 
                    name="Retirement Index"
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRetirement)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="oilPrice" 
                    name="Oil Price ($)"
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorOil)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 2: Consumption Impact */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold">Global Consumption Intensity</h3>
                <p className="text-sm text-slate-500">Monthly Barrels (Millions) vs. Inflation Pressure</p>
              </div>
              <Droplets className="w-6 h-6 text-slate-300" />
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="oilConsumption" 
                    name="Consumption (M)"
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                    barSize={20}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="inflationRate" 
                    name="Inflation %"
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#ef4444' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Narrative Cards */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Info className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-bold">Strategic Analysis</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {nexusNarrative.points.map((point, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-slate-900 font-bold">0{i + 1}</span>
                </div>
                <h4 className="text-lg font-bold mb-3">{point.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* The Road Ahead Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-bold">The Road Ahead</h3>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <h4 className="text-xl font-bold mb-4">Price Threshold Scenarios</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  The $100 per barrel mark is the psychological and economic "tripwire" for global markets. Our analysis projects two distinct futures based on this threshold.
                </p>
                
                <div className="space-y-4">
                  <div className={cn(
                    "p-4 rounded-2xl border transition-all duration-500",
                    latest.oilPrice < 100 
                      ? "bg-emerald-50 border-emerald-200 shadow-sm" 
                      : "bg-slate-50 border-slate-100 opacity-50 grayscale"
                  )}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-emerald-700">&lt; $100 Per Barrel</span>
                      {latest.oilPrice < 100 && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                    </div>
                    <p className="text-xs text-emerald-600 leading-tight">
                      Manageable inflation. Retirement accounts maintain 4-6% growth trajectory as corporate margins remain stable.
                    </p>
                  </div>

                  <div className={cn(
                    "p-4 rounded-2xl border transition-all duration-500",
                    latest.oilPrice >= 100 
                      ? "bg-rose-50 border-rose-200 shadow-sm" 
                      : "bg-slate-50 border-slate-100 opacity-50 grayscale"
                  )}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-rose-700">&gt; $100 Per Barrel</span>
                      {latest.oilPrice >= 100 && <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                    </div>
                    <p className="text-xs text-rose-600 leading-tight">
                      Critical Stagnation. Energy costs trigger broad-market sell-offs, potentially erasing 12-18 months of retirement gains.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="text-center mb-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Trajectory</p>
                  <div className="text-5xl font-black text-slate-900">${latest.oilPrice}</div>
                </div>
                
                <div className="w-full h-4 bg-slate-200 rounded-full relative overflow-hidden mb-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((latest.oilPrice / 150) * 100, 100)}%` }}
                    className={cn(
                      "h-full transition-colors duration-500",
                      latest.oilPrice < 100 ? "bg-emerald-500" : "bg-rose-500"
                    )}
                  />
                  <div className="absolute left-[66.6%] top-0 w-1 h-full bg-slate-900 z-20" title="$100 Threshold" />
                </div>
                
                <div className="flex justify-between w-full text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  <span>$0</span>
                  <span className="text-slate-900">$100 (Critical)</span>
                  <span>$150+</span>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-xs text-slate-500 italic">
                    {latest.oilPrice < 100 
                      ? "Currently in the 'Stability Zone', but trending toward the critical threshold."
                      : "Threshold breached. Market volatility and retirement depletion risks are at maximum."}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Background Accent */}
            <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Deep Dive Section */}
        <section className="bg-slate-900 text-white p-12 rounded-[3rem] overflow-hidden relative">
          <div className="max-w-3xl relative z-10">
            <h3 className="text-3xl font-bold mb-6">The "Self-Inflicted" War for Oil</h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              The data from the last 15 months suggests that the aggressive pivot back to fossil-fuel dominance has not yielded the promised "wealth explosion" for middle America. Instead, the increased global consumption—fueled by a lack of diversification—has created a supply-demand trap. As oil prices climbed from $75 to over ${latest.oilPrice}, the average 401(k) has struggled to outpace energy-driven inflation.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-indigo-400 font-bold text-4xl mb-2">15mo</p>
                <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Duration of Policy Shift</p>
              </div>
              <div>
                <p className="text-rose-400 font-bold text-4xl mb-2">-$1.2T</p>
                <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Est. Retirement Opportunity Cost</p>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/10 to-transparent hidden lg:block" />
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-slate-400" />
            <div className="flex flex-col">
              <span className="text-slate-500 text-sm font-medium">Oil & Wealth Nexus Dashboard © 2026</span>
              <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest">A Middle-Class Empowerment Voice</span>
              <span className="text-slate-400 text-[10px] font-medium italic mt-0.5">Brought to you by Mike Cirigliano</span>
            </div>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Globe className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Droplets className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Wallet className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
