import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, MousePointerClick } from 'lucide-react';
import { motion } from 'motion/react';
import type { AffiliateAnalyticsResponse } from '../lib/affiliateClicks';

interface AffiliateAnalyticsProps {
  ownerKey: string | null;
}

function formatDateTime(value: string | null) {
  if (!value) {
    return 'No clicks recorded yet';
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function SummaryCard({ title, value, note }: { title: string; value: string | number; note?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{title}</p>
      <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
      {note && <p className="mt-2 text-xs text-slate-500">{note}</p>}
    </div>
  );
}

function RankingList({ title, rows }: { title: string; rows: Array<{ key: string; clicks: number }> }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <h3 className="mb-5 text-xl font-bold text-slate-900">{title}</h3>
      {!rows.length ? (
        <p className="text-sm text-slate-500">No click data yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.key} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-sm font-medium text-slate-700">{row.key}</p>
              <p className="text-sm font-black text-slate-900">{row.clicks}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function AffiliateAnalytics({ ownerKey }: AffiliateAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AffiliateAnalyticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadAnalytics = async () => {
    if (!ownerKey) {
      setError('Owner access key required.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/affiliate-clicks', {
        cache: 'no-store',
        headers: {
          'x-analytics-key': ownerKey,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Verify owner analytics key.');
        }

        throw new Error(`Affiliate analytics responded ${response.status}`);
      }

      const payload = await response.json() as AffiliateAnalyticsResponse;
      setAnalytics(payload);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load affiliate analytics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!ownerKey) {
      setAnalytics(null);
      setError('Owner access key required.');
      return;
    }

    loadAnalytics();
  }, [ownerKey]);

  const summary = useMemo(() => ({
    totalClicks: analytics?.totalClicks ?? 0,
    uniqueVisitors: analytics?.uniqueVisitors ?? 0,
    lastClickAt: analytics?.lastClickAt ?? null,
    persistentStorage: analytics?.persistentStorage ?? false,
  }), [analytics]);

  return (
    <div className="w-full">
      <section className="mb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="mb-4 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-indigo-600" />
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Affiliate Analytics</h2>
          </div>
          <p className="max-w-4xl text-lg leading-relaxed text-slate-600">
            Track which affiliate blocks and links are generating clicks directly from your site dashboard.
          </p>
        </motion.div>
      </section>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Storage: {summary.persistentStorage ? 'Persistent' : 'Ephemeral'}
        </div>
        <button
          type="button"
          onClick={loadAnalytics}
          disabled={isLoading || !ownerKey}
          className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MousePointerClick className="h-4 w-4" />
          {isLoading ? 'Refreshing...' : 'Refresh metrics'}
        </button>
      </div>

      {error && (
        <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <SummaryCard title="Total Affiliate Clicks" value={summary.totalClicks} />
        <SummaryCard title="Unique Visitors" value={summary.uniqueVisitors} />
        <SummaryCard title="Last Click" value={formatDateTime(summary.lastClickAt)} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <RankingList title="Top Pages" rows={analytics?.topPages ?? []} />
        <RankingList title="Top Blocks" rows={analytics?.topBlocks ?? []} />
        <RankingList title="Top Items" rows={analytics?.topItems ?? []} />
      </div>
    </div>
  );
}