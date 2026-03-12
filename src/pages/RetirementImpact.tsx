import React, { useMemo } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, Briefcase, PiggyBank, Shield, ArrowUpRight, ArrowDownRight,
  AlertTriangle, CheckCircle, Zap, Activity, Users
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
            <span className="font-mono font-bold text-slate-900">${entry.value}T</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RetirementImpact() {
  const latest = data[data.length - 1];
  const initial = data[0];
  
  const wealthChange = (((latest.retirementIndex - initial.retirementIndex) / initial.retirementIndex) * 100).toFixed(1);
  const k401Change = (((latest.k401Assets - initial.k401Assets) / initial.k401Assets) * 100).toFixed(1);
  const iraChange = (((latest.iraAssets - initial.iraAssets) / initial.iraAssets) * 100).toFixed(1);

  // Calculate others (assuming total = 401k + IRA + Others)
  const othersAssets = latest.totalRetirementAssets - latest.k401Assets - latest.iraAssets;
  const initialOthersAssets = initial.totalRetirementAssets - initial.k401Assets - initial.iraAssets;
  const othersChange = (((othersAssets - initialOthersAssets) / initialOthersAssets) * 100).toFixed(1);

  // Prepare pie chart data
  const pieData = [
    { name: '401(k)', value: latest.k401Assets, fill: '#6366f1' },
    { name: 'IRA', value: latest.iraAssets, fill: '#818cf8' },
    { name: 'Others', value: othersAssets, fill: '#a5b4fc' }
  ];

  // Prepare breakdown data for stacked bar chart
  const breakdownData = data.map(item => ({
    month: item.month,
    k401: item.k401Assets,
    ira: item.iraAssets,
    others: (item.totalRetirementAssets - item.k401Assets - item.iraAssets)
  }));

  const COLORS = ['#6366f1', '#818cf8', '#a5b4fc'];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Retirement Impact Analysis</h2>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
            Understanding how rising energy costs and inflation pressure are affecting American retirement vehicles—401(k)s, IRAs, and other savings mechanisms. Explore the divergence between account types and their resilience in the current economic environment.
          </p>
        </motion.div>
      </section>

      {/* Key Metrics - Account Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="401(k) Assets" 
          value={`$${latest.k401Assets}T`} 
          subValue="Employer-Sponsored" 
          icon={Briefcase} 
          trend={parseFloat(k401Change)}
          color="bg-indigo-600"
        />
        <StatCard 
          title="IRA Assets" 
          value={`$${latest.iraAssets}T`} 
          subValue="Individual Retirement Accounts" 
          icon={PiggyBank} 
          trend={parseFloat(iraChange)}
          color="bg-blue-600"
        />
        <StatCard 
          title="Other Retirement Assets" 
          value={`$${othersAssets.toFixed(1)}T`} 
          subValue="Roth, SEP, Solo 401(k)" 
          icon={Shield} 
          trend={parseFloat(othersChange)}
          color="bg-purple-600"
        />
        <StatCard 
          title="Total Impact Index" 
          value={latest.retirementIndex} 
          subValue="Benchmark Growth" 
          icon={TrendingUp} 
          trend={parseFloat(wealthChange)}
          color="bg-emerald-600"
        />
      </div>

      {/* Account Composition */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Pie Chart - Current Composition */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold">Current Account Distribution</h3>
            <p className="text-sm text-slate-500">Allocation of ${latest.totalRetirementAssets}T total retirement assets</p>
          </div>
          <div className="h-[350px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: $${entry.value.toFixed(1)}T`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(1)}T`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900">Key Takeaway:</span> IRAs represent the largest share of US retirement wealth, but 401(k)s continue to grow as workplace participation rates remain strong despite economic headwinds.
            </p>
          </div>
        </motion.div>

        {/* Growth Comparison */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold">Year-to-Date Performance</h3>
            <p className="text-sm text-slate-500">Growth rates by account type (Jan 2025 - Current)</p>
          </div>
          <div className="space-y-6">
            {[
              { label: '401(k) Accounts', value: parseFloat(k401Change), icon: Briefcase, color: 'bg-indigo-600' },
              { label: 'IRA Accounts', value: parseFloat(iraChange), icon: PiggyBank, color: 'bg-blue-600' },
              { label: 'Other Retirement', value: parseFloat(othersChange), icon: Shield, color: 'bg-purple-600' },
              { label: 'Overall Benchmark', value: parseFloat(wealthChange), icon: TrendingUp, color: 'bg-emerald-600' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className={cn("p-2 rounded-lg", item.color)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                      <span className={cn(
                        "text-sm font-bold",
                        item.value > 0 ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {item.value > 0 ? '+' : ''}{item.value}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(Math.abs(item.value) * 2, 100)}%` }}
                        className={cn(
                          "h-full transition-all",
                          item.value > 0 ? "bg-emerald-500" : "bg-rose-500"
                        )}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Stacked Area Chart - Account Evolution */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-12"
      >
        <div className="mb-6">
          <h3 className="text-xl font-bold">Retirement Asset Evolution by Account Type</h3>
          <p className="text-sm text-slate-500">15-month trend of aggregated retirement savings (Trillions USD)</p>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={breakdownData}>
              <defs>
                <linearGradient id="color401k" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorIRA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOthers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a5b4fc" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a5b4fc" stopOpacity={0}/>
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
              <Legend verticalAlign="top" height={36}/>
              <Area 
                type="monotone" 
                dataKey="k401" 
                name="401(k) ($T)"
                stroke="#6366f1" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#color401k)"
                stackId="1"
              />
              <Area 
                type="monotone" 
                dataKey="ira" 
                name="IRA ($T)"
                stroke="#818cf8" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorIRA)"
                stackId="1"
              />
              <Area 
                type="monotone" 
                dataKey="others" 
                name="Others ($T)"
                stroke="#a5b4fc" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorOthers)"
                stackId="1"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Detailed Breakdown Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* 401(k) Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-3xl border border-indigo-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-600 p-3 rounded-xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-indigo-900">401(k) Plans</h3>
              <p className="text-sm text-indigo-700">Employer-Sponsored</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-indigo-600 text-sm font-medium mb-1">Current Assets</p>
              <p className="text-3xl font-bold text-indigo-900">${latest.k401Assets}T</p>
            </div>
            <div className="h-px bg-indigo-200" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-indigo-600 text-xs font-medium mb-1">YTD Growth</p>
                <p className={cn(
                  "text-lg font-bold",
                  parseFloat(k401Change) > 0 ? "text-emerald-600" : "text-rose-600"
                )}>
                  {parseFloat(k401Change) > 0 ? '+' : ''}{k401Change}%
                </p>
              </div>
              <div>
                <p className="text-indigo-600 text-xs font-medium mb-1">Market Share</p>
                <p className="text-lg font-bold text-indigo-900">
                  {((latest.k401Assets / latest.totalRetirementAssets) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="p-4 bg-white/50 rounded-xl border border-indigo-200">
              <p className="text-xs text-indigo-800 leading-relaxed">
                <span className="font-bold">Status:</span> Employer match programs have held steady, but employee deferrals show signs of strain as workers redirect savings to cover energy costs.
              </p>
            </div>
          </div>
        </motion.div>

        {/* IRA Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl border border-blue-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 p-3 rounded-xl">
              <PiggyBank className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900">IRA Accounts</h3>
              <p className="text-sm text-blue-700">Individual Retirement</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-blue-600 text-sm font-medium mb-1">Current Assets</p>
              <p className="text-3xl font-bold text-blue-900">${latest.iraAssets}T</p>
            </div>
            <div className="h-px bg-blue-200" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-blue-600 text-xs font-medium mb-1">YTD Growth</p>
                <p className={cn(
                  "text-lg font-bold",
                  parseFloat(iraChange) > 0 ? "text-emerald-600" : "text-rose-600"
                )}>
                  {parseFloat(iraChange) > 0 ? '+' : ''}{iraChange}%
                </p>
              </div>
              <div>
                <p className="text-blue-600 text-xs font-medium mb-1">Market Share</p>
                <p className="text-lg font-bold text-blue-900">
                  {((latest.iraAssets / latest.totalRetirementAssets) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="p-4 bg-white/50 rounded-xl border border-blue-200">
              <p className="text-xs text-blue-800 leading-relaxed">
                <span className="font-bold">Status:</span> IRAs remain the largest retirement vehicle. Individual savers are maintaining discipline despite inflation pressures and market volatility.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Others Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-3xl border border-purple-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-600 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-900">Other Vehicles</h3>
              <p className="text-sm text-purple-700">Roth, SEP, Solo 401(k)</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-purple-600 text-sm font-medium mb-1">Current Assets</p>
              <p className="text-3xl font-bold text-purple-900">${othersAssets.toFixed(1)}T</p>
            </div>
            <div className="h-px bg-purple-200" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-purple-600 text-xs font-medium mb-1">YTD Growth</p>
                <p className={cn(
                  "text-lg font-bold",
                  parseFloat(othersChange) > 0 ? "text-emerald-600" : "text-rose-600"
                )}>
                  {parseFloat(othersChange) > 0 ? '+' : ''}{othersChange}%
                </p>
              </div>
              <div>
                <p className="text-purple-600 text-xs font-medium mb-1">Market Share</p>
                <p className="text-lg font-bold text-purple-900">
                  {(((othersAssets) / latest.totalRetirementAssets) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="p-4 bg-white/50 rounded-xl border border-purple-200">
              <p className="text-xs text-purple-800 leading-relaxed">
                <span className="font-bold">Status:</span> Alternative retirement vehicles are gaining traction among self-employed and high-income earners seeking greater control and tax optimization.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Risk & Opportunity Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-rose-600" />
          <h3 className="text-2xl font-bold">Vulnerabilities & Strategic Opportunities</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-rose-600">
              <TrendingDown className="w-5 h-5" />
              Critical Vulnerabilities
            </h4>
            <div className="space-y-3">
              {[
                'Energy inflation eroding real purchasing power of retirement funds',
                'Behavioral: workers reducing 401(k) deferrals to manage living expenses',
                'Sequence-of-returns risk: market volatility during high inflation period',
                'Longevity risk: depleted assets unable to sustain 30+ year retirements',
                'Rebalancing pressure: fixed-income allocations losing value in high-rate environment'
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
              Strategic Opportunities
            </h4>
            <div className="space-y-3">
              {[
                'Dollar-cost averaging during market corrections benefits long-term investors',
                'Roth conversion opportunities amid market volatility and lower valuations',
                'Employer match maximization: still 100% immediate return on investment',
                'Alternative investments: diversification beyond traditional stock/bond mix',
                'Career transition planning: evaluate 401(k) rollover vs. employer plan options'
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-12 rounded-3xl shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-8 h-8 text-indigo-400" />
          <h3 className="text-2xl font-bold">Evidence-Based Action Items</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-indigo-400 font-bold mb-4 text-lg">For Individual Savers</h4>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-3">
                <span className="text-indigo-400 font-bold">→</span>
                <span>Maintain 401(k) contributions at minimum to capture employer match</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-bold">→</span>
                <span>Evaluate Roth conversion windows during market dips</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-bold">→</span>
                <span>Rebalance allocation to reflect 20+ year time horizon</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-indigo-400 font-bold mb-4 text-lg">For Employers & Plan Sponsors</h4>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-3">
                <span className="text-indigo-400 font-bold">→</span>
                <span>Consider financial wellness programs addressing energy cost pressures</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-bold">→</span>
                <span>Enhance plan communication around long-term value propositions</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-bold">→</span>
                <span>Monitor deferral trends for early signals of financial distress</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
