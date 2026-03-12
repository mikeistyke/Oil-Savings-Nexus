import React from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, ScatterChart, Scatter
} from 'recharts';
import {
  TrendingUp, TrendingDown, Droplets, ArrowUpRight, ArrowDownRight, Activity, Zap, AlertTriangle, Globe
} from 'lucide-react';
import { motion } from 'motion/react';
import { generateNexusData, nexusNarrative } from '../data';
import { cn } from '../lib/utils';

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

export default function OilDynamics() {
  const latest = data[data.length - 1];
  const initial = data[0];
  const oilChange = (((latest.oilPrice - initial.oilPrice) / initial.oilPrice) * 100).toFixed(1);
  const consumptionChange = (((latest.oilConsumption - initial.oilConsumption) / initial.oilConsumption) * 100).toFixed(1);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Droplets className="w-8 h-8 text-amber-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Oil Dynamics & Price Evolution</h2>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
            Understanding global oil market dynamics, supply-demand mechanics, and the cascading impact on energy prices, inflation, and consumer purchasing power since January 2025.
          </p>
        </motion.div>
      </section>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Current Oil Price" 
          value={`$${latest.oilPrice}`} 
          subValue="WTI Crude per Barrel" 
          icon={Zap} 
          trend={parseFloat(oilChange)}
          color="bg-amber-600"
        />
        <StatCard 
          title="Global Consumption" 
          value={`${latest.oilConsumption}M`} 
          subValue="Barrels per Day" 
          icon={Droplets} 
          trend={parseFloat(consumptionChange)}
          color="bg-blue-600"
        />
        <StatCard 
          title="Price Change (YTD)" 
          value={`${oilChange}%`} 
          subValue="vs Jan 2025" 
          icon={TrendingUp} 
          trend={parseFloat(oilChange)}
          color="bg-amber-500"
        />
        <StatCard 
          title="Inflation Impact" 
          value={`${latest.inflationRate}%`} 
          subValue="Energy Core" 
          icon={AlertTriangle} 
          trend={1.2}
          color="bg-rose-600"
        />
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Oil Price Trend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold">Historical Oil Price Trend</h3>
            <p className="text-sm text-slate-500">WTI Crude prices over 15 months (USD/barrel)</p>
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
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36}/>
                <Line 
                  type="monotone" 
                  dataKey="oilPrice" 
                  name="Oil Price ($/bbl)"
                  stroke="#f59e0b" 
                  strokeWidth={4}
                  dot={{ r: 4, fill: '#f59e0b' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900">Observation:</span> Oil prices experienced significant volatility, reflecting geopolitical tensions, supply constraints, and shifting energy demand patterns globally.
            </p>
          </div>
        </motion.div>

        {/* Consumption vs Price */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold">Price-Consumption Relationship</h3>
            <p className="text-sm text-slate-500">How consumption responds to price movements</p>
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
                  interval={1}
                />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36}/>
                <Bar yAxisId="left" dataKey="oilConsumption" name="Consumption (M bbl/day)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="oilPrice" name="Price ($/bbl)" stroke="#f59e0b" strokeWidth={3} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900">Key Finding:</span> Higher prices have not significantly reduced global demand, suggesting inelastic consumption patterns driven by economic necessity.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Supply Chain Impact */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold">Energy Consumption Pattern</h3>
            <p className="text-sm text-slate-500">Daily consumption trends (millions of barrels)</p>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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
                  dataKey="oilConsumption" 
                  name="Daily Consumption"
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorConsumption)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900">Market Analysis:</span> Global consumption has remained surprisingly stable despite price volatility, indicating persistent demand from emerging markets offsetting developed economy conservation efforts.
            </p>
          </div>
        </motion.div>

        {/* Market Insights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-lg"
        >
          <div className="mb-6">
            <Globe className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="text-xl font-bold">Market Insights & Dynamics</h3>
          </div>
          <div className="space-y-5">
            <div className="pb-5 border-b border-slate-700">
              <h4 className="font-semibold text-amber-400 mb-2">Supply-Side Pressures</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                OPEC+ production constraints and geopolitical tensions in key producing regions continue to support elevated price floors, with structural undersupply expected through mid-2026.
              </p>
            </div>
            <div className="pb-5 border-b border-slate-700">
              <h4 className="font-semibold text-amber-400 mb-2">Demand Resilience</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Despite high prices, global demand remains sticky. Industrial production and transportation needs have proven resistant to demand destruction, even as consumer spending shows signs of stress.
              </p>
            </div>
            <div className="pb-5 border-b border-slate-700">
              <h4 className="font-semibold text-amber-400 mb-2">Inflation Cascade</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Energy prices are the primary driver of headline inflation, with knock-on effects rippling through transportation, manufacturing, and consumer goods sectors.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-400 mb-2">Policy Implications</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Central banks face conflicting pressures: supporting growth while combating energy-driven inflation, complicating monetary policy decision-making.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Risk Assessment */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-rose-600" />
          <h3 className="text-2xl font-bold">Risk Assessment & Forward Outlook</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-rose-600" />
              <h4 className="font-bold text-rose-900">Upside Risks</h4>
            </div>
            <ul className="text-sm text-rose-800 space-y-2">
              <li>• Further supply disruptions</li>
              <li>• Geopolitical escalation</li>
              <li>• Refinery capacity constraints</li>
              <li>• Unexpected demand surge</li>
            </ul>
          </div>
          <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-slate-600" />
              <h4 className="font-bold text-slate-900">Base Case</h4>
            </div>
            <ul className="text-sm text-slate-700 space-y-2">
              <li>• Prices stabilize mid-$60s</li>
              <li>• Gradual demand moderation</li>
              <li>• Inflation persists above target</li>
              <li>• Economic slowdown emerges</li>
            </ul>
          </div>
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-emerald-900">Downside Risks</h4>
            </div>
            <ul className="text-sm text-emerald-800 space-y-2">
              <li>• Global recession reduces demand</li>
              <li>• OPEC+ increases production</li>
              <li>• Renewable energy acceleration</li>
              <li>• Strategic reserve releases</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
