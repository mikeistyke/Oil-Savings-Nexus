import React, { useCallback, useEffect, useState } from 'react';
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
import type { LiveMetric, LiveMetricsResponse } from './lib/liveMetrics';
import type { VisitorStatsResponse } from './lib/visitorStats';
import OilDynamics from './pages/OilDynamics';
import RetirementImpact from './pages/RetirementImpact';
import Analysis from './pages/Analysis';
import ExecutiveCorruption from './pages/ExecutiveCorruption';

const data = generateNexusData();
const LIVE_REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000;
const LIVE_METRICS_TIMEOUT_MS = 35000;
const MIN_REFRESH_INTERVAL_MS = 60 * 1000;
const TAB_LABELS = ['Overview', 'Oil Dynamics', 'Retirement Impact', 'Analysis', 'Executive Corruption'] as const;
const VISITOR_ID_STORAGE_KEY = 'oil-wealth-nexus-visitor-id';

const formatRefreshInterval = (value: number) => {
  const hours = value / (60 * 60 * 1000);

  if (hours >= 1) {
    return `${hours.toFixed(hours >= 10 ? 0 : 1)} hour${hours >= 2 ? 's' : ''}`;
  }

  const minutes = Math.max(1, Math.round(value / (60 * 1000)));
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
};

const formatSyncLabel = (value?: string) => {
  if (!value) {
    return 'Waiting for sync';
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const normalizeMetric = (metric: any, fallbackSyncedAt?: string): LiveMetric | null => {
  if (!metric || typeof metric !== 'object') {
    return null;
  }

  return {
    title: String(metric.title ?? ''),
    value: Number(metric.value ?? 0),
    displayValue: String(metric.displayValue ?? metric.display ?? 'N/A'),
    subValue: String(metric.subValue ?? metric.subtitle ?? ''),
    trend: Number(metric.trend ?? 0),
    sourceLabel: String(metric.sourceLabel ?? metric.source ?? ''),
    sourceHref: String(metric.sourceHref ?? metric.sourceUrl ?? '#'),
    sourceFrequency: String(metric.sourceFrequency ?? metric.frequency ?? ''),
    publishedAt: String(metric.publishedAt ?? metric.published ?? metric.publishedDate ?? ''),
    syncedAt: String(metric.syncedAt ?? metric.synced ?? fallbackSyncedAt ?? ''),
    note: metric.note ? String(metric.note) : undefined,
  };
};

const fallbackMetric = (
  title: string,
  subValue: string,
  sourceLabel: string,
  sourceHref: string,
  syncedAt: string,
): LiveMetric => ({
  title,
  value: 0,
  displayValue: 'N/A',
  subValue,
  trend: 0,
  sourceLabel,
  sourceHref,
  sourceFrequency: 'Unknown',
  publishedAt: 'N/A',
  syncedAt,
});

const normalizeLiveMetrics = (payload: unknown): LiveMetricsResponse | null => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const root = payload as Record<string, any>;
  const syncedAt = String(root.syncedAt ?? root.synced ?? '');
  const refreshIntervalMs = Number(root.refreshIntervalMs ?? (6 * 60 * 60 * 1000));
  const rawMetrics = root.metrics ?? root.data?.metrics ?? root.payload?.metrics;

  if (!rawMetrics || typeof rawMetrics !== 'object') {
    return null;
  }

  const metrics = rawMetrics as Record<string, any>;

  const oilConsumption = normalizeMetric(
    metrics.oilConsumption ?? metrics.oil_consumption,
    syncedAt,
  ) ?? fallbackMetric(
    'Global Oil Consumption',
    'Barrels / Day',
    'OPEC MOMR Appendix',
    'https://www.opec.org/monthly-oil-market-report.html',
    syncedAt,
  );
  const oilPrice = normalizeMetric(
    metrics.oilPrice ?? metrics.oil_price,
    syncedAt,
  ) ?? fallbackMetric(
    'Crude Price Index',
    'WTI Crude',
    'FRED WTI Spot Price',
    'https://fred.stlouisfed.org/series/DCOILWTICO',
    syncedAt,
  );
  const totalRetirementAssets = normalizeMetric(
    metrics.totalRetirementAssets ?? metrics.total_retirement_assets,
    syncedAt,
  ) ?? fallbackMetric(
    'Total Retirement Assets',
    'US Total (401k/IRA)',
    'ICI US Retirement Market',
    'https://www.ici.org/research/stats/retirement',
    syncedAt,
  );
  const retirementIndex = normalizeMetric(
    metrics.retirementIndex ?? metrics.retirement_index,
    syncedAt,
  ) ?? fallbackMetric(
    'Retirement Index',
    'Growth Benchmark',
    'Computed from ICI Table 1',
    'https://www.ici.org/research/stats/retirement',
    syncedAt,
  );
  const inflationPressure = normalizeMetric(
    metrics.inflationPressure ?? metrics.inflation_pressure,
    syncedAt,
  ) ?? fallbackMetric(
    'Inflation Pressure',
    'Energy CPI YoY',
    'FRED CPI Energy Index',
    'https://fred.stlouisfed.org/series/CPIENGSL',
    syncedAt,
  );

  return {
    syncedAt,
    refreshIntervalMs,
    metrics: {
      oilConsumption,
      oilPrice,
      totalRetirementAssets,
      retirementIndex,
      inflationPressure,
    },
  };
};

const StatCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  trend,
  color,
  sourceLabel,
  sourceHref,
  publishedAt,
  syncedAt,
  note,
  loading,
}: any) => (
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
      {loading ? (
        <span className="h-7 w-24 animate-pulse rounded bg-slate-200 inline-block" />
      ) : (
        <span className="text-2xl font-bold text-slate-900">{value}</span>
      )}
      <span className="text-slate-400 text-xs">{subValue}</span>
    </div>
    <div className="mt-4 border-t border-slate-100 pt-3">
      <a
        href={sourceHref}
        target="_blank"
        rel="noreferrer"
        className="text-[11px] font-medium text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-slate-700"
      >
        Source: {sourceLabel}
      </a>
      <p className="mt-2 text-[11px] text-slate-400">
        Published: {publishedAt || 'N/A'}
      </p>
      <p className="text-[11px] text-slate-400">
        Synced: {formatSyncLabel(syncedAt)}
      </p>
      {note && <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{note}</p>}
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
  const [liveMetrics, setLiveMetrics] = useState<LiveMetricsResponse | null>(null);
  const [liveMetricsError, setLiveMetricsError] = useState<string | null>(null);
  const [isRefreshingMetrics, setIsRefreshingMetrics] = useState(false);
  const [refreshIntervalMs, setRefreshIntervalMs] = useState(LIVE_REFRESH_INTERVAL_MS);
  const [visitorStats, setVisitorStats] = useState<VisitorStatsResponse | null>(null);

  const latest = data[data.length - 1];
  const initial = data[0];

  const fetchWithTimeout = async (url: string, timeoutMs: number) => {
    const timeoutSupported = typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function';

    if (timeoutSupported) {
      return fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(url, { signal: controller.signal });
    } finally {
      window.clearTimeout(timer);
    }
  };

  const loadLiveMetrics = useCallback(async () => {
    setIsRefreshingMetrics(true);
    try {
      const response = await fetchWithTimeout('/api/live-metrics', LIVE_METRICS_TIMEOUT_MS);
      if (!response.ok) {
        let apiMessage = '';
        try {
          const errorPayload = await response.json();
          apiMessage = errorPayload?.message ? `: ${errorPayload.message}` : '';
        } catch {
          // Ignore body parse failures; keep status-level error.
        }
        throw new Error(`Live metrics responded ${response.status}${apiMessage}`);
      }
      const rawPayload: unknown = await response.json();
      const payload = normalizeLiveMetrics(rawPayload);
      if (!payload) {
        throw new Error('Live metrics payload shape was invalid.');
      }

      const nextRefreshInterval = Number.isFinite(payload.refreshIntervalMs)
        ? Math.max(MIN_REFRESH_INTERVAL_MS, payload.refreshIntervalMs)
        : LIVE_REFRESH_INTERVAL_MS;

      setLiveMetrics(payload);
      setRefreshIntervalMs(nextRefreshInterval);
      setLiveMetricsError(null);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Could not load live metrics.';
      setLiveMetricsError(msg);
      console.error('[live-metrics] fetch failed:', msg);
    } finally {
      setIsRefreshingMetrics(false);
    }
  }, []);

  useEffect(() => {
    loadLiveMetrics();
    const intervalId = window.setInterval(loadLiveMetrics, refreshIntervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadLiveMetrics, refreshIntervalMs]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return;
    }

    const pageVisitKey = `oil-wealth-nexus-hit:${window.location.pathname}:${Math.floor(performance.timeOrigin)}`;
    if (window.sessionStorage.getItem(pageVisitKey)) {
      return;
    }

    window.sessionStorage.setItem(pageVisitKey, '1');

    let visitorId = window.localStorage.getItem(VISITOR_ID_STORAGE_KEY);
    if (!visitorId) {
      visitorId = window.crypto.randomUUID();
      window.localStorage.setItem(VISITOR_ID_STORAGE_KEY, visitorId);
    }

    void fetch('/api/visitor-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: window.location.pathname,
        visitorId,
      }),
      keepalive: true,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Visitor tracking responded ${response.status}`);
        }

        const payload = await response.json() as VisitorStatsResponse;
        setVisitorStats(payload);
      })
      .catch((error) => {
        console.error('[visitor-tracking] failed:', error);
      });
  }, []);
  
  const oilChange = (((latest.oilPrice - initial.oilPrice) / initial.oilPrice) * 100).toFixed(1);
  const wealthChange = (((latest.retirementIndex - initial.retirementIndex) / initial.retirementIndex) * 100).toFixed(1);

  const cardOilConsumption = liveMetrics?.metrics.oilConsumption;
  const cardOilPrice = liveMetrics?.metrics.oilPrice;
  const cardTotalRetirement = liveMetrics?.metrics.totalRetirementAssets;
  const cardRetirementIndex = liveMetrics?.metrics.retirementIndex;
  const cardInflation = liveMetrics?.metrics.inflationPressure;

  const heroOilPriceValue = cardOilPrice ? cardOilPrice.displayValue.replace('$', '') : `${latest.oilPrice}`;
  const heroWealthDelta = cardRetirementIndex ? `${cardRetirementIndex.trend.toFixed(1)}` : wealthChange;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
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
            {TAB_LABELS.map((tab) => (
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
        <div className="mt-4 max-w-7xl mx-auto md:hidden">
          <label htmlFor="mobile-tab-select" className="sr-only">Select dashboard section</label>
          <select
            id="mobile-tab-select"
            value={activeTab}
            onChange={(event) => setActiveTab(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
          >
            {TAB_LABELS.map((tab) => (
              <option key={tab} value={tab.toLowerCase()}>{tab}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
        <>
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
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('executive corruption')}
                  className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Read Executive Corruption
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('analysis')}
                  className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
                >
                  Open Analysis
                </button>
              </div>
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
                    <p className="text-3xl font-bold">${heroOilPriceValue}<span className="text-sm font-normal text-slate-500 ml-2">/bbl</span></p>
                  </div>
                  <div className="h-px bg-slate-800" />
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Retirement Growth Delta</p>
                    <p className="text-3xl font-bold text-rose-400">{heroWealthDelta}%<span className="text-sm font-normal text-slate-500 ml-2">vs 2024 Q3</span></p>
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
        <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Hero cards sync from public sources on load and every {formatRefreshInterval(refreshIntervalMs)} while this page is open.
            </p>
            <p className="text-xs text-slate-400">
              Source cadence: oil price daily, energy CPI monthly, OPEC monthly, retirement assets quarterly.
            </p>
          </div>
          <button
            onClick={loadLiveMetrics}
            disabled={isRefreshingMetrics}
            className={cn(
              'inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition-colors',
              isRefreshingMetrics
                ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            )}
          >
            {isRefreshingMetrics ? 'Refreshing...' : 'Refresh now'}
          </button>
        </div>
        {isRefreshingMetrics && !liveMetrics && (
          <div className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            Syncing live data from OPEC, ICI, and FRED — this can take up to 15 seconds on first load…
          </div>
        )}
        {liveMetricsError && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Live metrics unavailable: {liveMetricsError}. Showing local fallback values.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <StatCard 
            title={cardOilConsumption?.title || 'Global Oil Consumption'} 
            value={cardOilConsumption?.displayValue || `${latest.oilConsumption}M`} 
            subValue={cardOilConsumption?.subValue || 'Barrels / Day'} 
            icon={Droplets} 
            trend={cardOilConsumption?.trend ?? 2.4}
            color="bg-blue-600"
            sourceLabel={cardOilConsumption?.sourceLabel || 'IEA Oil Market Report'}
            sourceHref={cardOilConsumption?.sourceHref || 'https://www.iea.org/reports/oil-market-report'}
            publishedAt={cardOilConsumption?.publishedAt}
            syncedAt={cardOilConsumption?.syncedAt}
            note={cardOilConsumption?.note}
            loading={isRefreshingMetrics && !liveMetrics}
          />
          <StatCard 
            title={cardOilPrice?.title || 'Crude Price Index'} 
            value={cardOilPrice?.displayValue || `$${latest.oilPrice}`} 
            subValue={cardOilPrice?.subValue || 'WTI Crude'} 
            icon={Zap} 
            trend={cardOilPrice?.trend ?? parseFloat(oilChange)}
            color="bg-amber-600"
            sourceLabel={cardOilPrice?.sourceLabel || 'FRED WTI Spot Price'}
            sourceHref={cardOilPrice?.sourceHref || 'https://fred.stlouisfed.org/series/DCOILWTICO'}
            publishedAt={cardOilPrice?.publishedAt}
            syncedAt={cardOilPrice?.syncedAt}
            note={cardOilPrice?.note}
            loading={isRefreshingMetrics && !liveMetrics}
          />
          <StatCard 
            title={cardTotalRetirement?.title || 'Total Retirement Assets'} 
            value={cardTotalRetirement?.displayValue || `$${latest.totalRetirementAssets}T`} 
            subValue={cardTotalRetirement?.subValue || 'US Total (401k/IRA)'} 
            icon={Wallet} 
            trend={cardTotalRetirement?.trend ?? parseFloat(wealthChange)}
            color="bg-indigo-600"
            sourceLabel={cardTotalRetirement?.sourceLabel || 'ICI Retirement Assets'}
            sourceHref={cardTotalRetirement?.sourceHref || 'https://www.ici.org/research/stats/retirement'}
            publishedAt={cardTotalRetirement?.publishedAt}
            syncedAt={cardTotalRetirement?.syncedAt}
            note={cardTotalRetirement?.note}
            loading={isRefreshingMetrics && !liveMetrics}
          />
          <StatCard 
            title={cardRetirementIndex?.title || 'Retirement Index'} 
            value={cardRetirementIndex?.displayValue || latest.retirementIndex} 
            subValue={cardRetirementIndex?.subValue || 'Growth Benchmark'} 
            icon={TrendingUp} 
            trend={cardRetirementIndex?.trend ?? parseFloat(wealthChange)}
            color="bg-emerald-600"
            sourceLabel={cardRetirementIndex?.sourceLabel || 'Modeled from ICI + WTI'}
            sourceHref={cardRetirementIndex?.sourceHref || 'https://www.ici.org/research/stats/retirement'}
            publishedAt={cardRetirementIndex?.publishedAt}
            syncedAt={cardRetirementIndex?.syncedAt}
            note={cardRetirementIndex?.note}
            loading={isRefreshingMetrics && !liveMetrics}
          />
          <StatCard 
            title={cardInflation?.title || 'Inflation Pressure'} 
            value={cardInflation?.displayValue || `${latest.inflationRate}%`} 
            subValue={cardInflation?.subValue || 'Energy Core'} 
            icon={AlertTriangle} 
            trend={cardInflation?.trend ?? 1.2}
            color="bg-rose-600"
            sourceLabel={cardInflation?.sourceLabel || 'BLS CPI Energy'}
            sourceHref={cardInflation?.sourceHref || 'https://www.bls.gov/cpi/'}
            publishedAt={cardInflation?.publishedAt}
            syncedAt={cardInflation?.syncedAt}
            note={cardInflation?.note}
            loading={isRefreshingMetrics && !liveMetrics}
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
        </>
        )}

        {activeTab === 'oil dynamics' && (
          <OilDynamics />
        )}

        {activeTab === 'retirement impact' && (
          <RetirementImpact />
        )}

        {activeTab === 'analysis' && (
          <Analysis />
        )}

        {activeTab === 'executive corruption' && (
          <ExecutiveCorruption />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-slate-400" />
            <div className="flex flex-col">
              <span className="text-slate-500 text-sm font-medium">Oil & Wealth Nexus Dashboard © 2026</span>
              <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest">A Middle-Class Empowerment Voice</span>
              <span className="text-slate-400 text-[10px] font-medium italic mt-0.5">Brought to you by Mike Cirigliano</span>
              {visitorStats && (
                <span className="text-slate-400 text-[10px] font-medium mt-1">
                  External visits tracked: {visitorStats.totalHits} total, {visitorStats.uniqueVisitors} unique visitors
                </span>
              )}
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
