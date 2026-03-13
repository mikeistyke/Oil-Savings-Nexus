import XLSX from 'xlsx';

export const LIVE_REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000;
const SERVER_CACHE_TTL_MS = 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 5000;

type MetricKey = 'oilConsumption' | 'oilPrice' | 'totalRetirementAssets' | 'retirementIndex' | 'inflationPressure';

export interface LiveMetric {
  title: string;
  value: number;
  displayValue: string;
  subValue: string;
  trend: number;
  sourceLabel: string;
  sourceHref: string;
  sourceFrequency: string;
  publishedAt: string;
  syncedAt: string;
  note?: string;
}

export interface LiveMetricsResponse {
  syncedAt: string;
  refreshIntervalMs: number;
  metrics: Record<MetricKey, LiveMetric>;
}

let cachedResponse: LiveMetricsResponse | null = null;
let cachedAt = 0;

export async function getLiveMetrics(): Promise<LiveMetricsResponse> {
  if (cachedResponse && Date.now() - cachedAt < SERVER_CACHE_TTL_MS) {
    return cachedResponse;
  }

  const syncedAt = new Date().toISOString();

  const [wtiMetric, inflationMetric, oilDemandMetric, retirementMetrics] = await Promise.all([
    safeMetric(() => getWtiMetric(syncedAt), {
      title: 'Crude Price Index',
      value: 0,
      displayValue: 'N/A',
      subValue: 'WTI Crude',
      trend: 0,
      sourceLabel: 'FRED WTI Spot Price',
      sourceHref: 'https://fred.stlouisfed.org/series/DCOILWTICO',
      sourceFrequency: 'Daily',
      publishedAt: 'Unavailable',
      syncedAt,
      note: 'Live fetch failed; retry on next sync cycle.',
    }),
    safeMetric(() => getInflationMetric(syncedAt), {
      title: 'Inflation Pressure',
      value: 0,
      displayValue: 'N/A',
      subValue: 'Energy CPI YoY',
      trend: 0,
      sourceLabel: 'FRED CPI Energy Index',
      sourceHref: 'https://fred.stlouisfed.org/series/CPIENGSL',
      sourceFrequency: 'Monthly',
      publishedAt: 'Unavailable',
      syncedAt,
      note: 'Live fetch failed; retry on next sync cycle.',
    }),
    safeMetric(() => getOilDemandMetric(syncedAt), {
      title: 'Global Oil Consumption',
      value: 0,
      displayValue: 'N/A',
      subValue: 'Barrels / Day',
      trend: 0,
      sourceLabel: 'OPEC MOMR Appendix',
      sourceHref: 'https://www.opec.org/monthly-oil-market-report.html',
      sourceFrequency: 'Monthly',
      publishedAt: 'Unavailable',
      syncedAt,
      note: 'Live fetch failed; retry on next sync cycle.',
    }),
    safeRetirementMetrics(syncedAt),
  ]);

  const response: LiveMetricsResponse = {
    syncedAt,
    refreshIntervalMs: LIVE_REFRESH_INTERVAL_MS,
    metrics: {
      oilConsumption: oilDemandMetric,
      oilPrice: wtiMetric,
      totalRetirementAssets: retirementMetrics.totalRetirementAssets,
      retirementIndex: retirementMetrics.retirementIndex,
      inflationPressure: inflationMetric,
    },
  };

  cachedResponse = response;
  cachedAt = Date.now();

  return response;
}

async function getWtiMetric(syncedAt: string): Promise<LiveMetric> {
  // Race FRED and Stooq simultaneously — whichever answers first wins.
  type FredResult = { source: 'fred'; rows: Array<{ date: string; value: number }> };
  type StooqResult = { source: 'stooq'; quote: { open: number; close: number; dateLabel: string } };

  const result = await Promise.any<FredResult | StooqResult>([
    fetchFredSeries('DCOILWTICO').then((rows) => ({ source: 'fred' as const, rows })),
    fetchStooqCrudeQuote().then((quote) => ({ source: 'stooq' as const, quote })),
  ]);

  if (result.source === 'fred') {
    const latest = result.rows.at(-1);
    const prior = result.rows.at(Math.max(result.rows.length - 22, 0));
    if (!latest || !prior) throw new Error('WTI series did not contain enough observations.');
    return {
      title: 'Crude Price Index',
      value: latest.value,
      displayValue: `$${latest.value.toFixed(2)}`,
      subValue: 'WTI Crude',
      trend: percentChange(latest.value, prior.value),
      sourceLabel: 'FRED WTI Spot Price',
      sourceHref: 'https://fred.stlouisfed.org/series/DCOILWTICO',
      sourceFrequency: 'Daily',
      publishedAt: formatDateLabel(latest.date),
      syncedAt,
      note: 'Trend compares the latest close with roughly one trading month earlier.',
    };
  } else {
    const { open, close, dateLabel } = result.quote;
    return {
      title: 'Crude Price Index',
      value: close,
      displayValue: `$${close.toFixed(2)}`,
      subValue: 'CL.F Futures (proxy)',
      trend: percentChange(close, open),
      sourceLabel: 'Stooq CL.F Daily Quote',
      sourceHref: 'https://stooq.com/q/l/?s=cl.f',
      sourceFrequency: 'Daily',
      publishedAt: dateLabel,
      syncedAt,
      note: 'Fallback source used when FRED WTI is temporarily unavailable.',
    };
  }
}

async function getInflationMetric(syncedAt: string): Promise<LiveMetric> {
  const rows = await fetchFredSeries('CPIENGSL');
  const latest = rows.at(-1);
  const yearAgo = rows.at(Math.max(rows.length - 13, 0));
  const previousMonth = rows.at(Math.max(rows.length - 2, 0));
  const previousYearBase = rows.at(Math.max(rows.length - 14, 0));

  if (!latest || !yearAgo || !previousMonth || !previousYearBase) {
    throw new Error('Energy CPI series did not contain enough observations.');
  }

  const yearOverYear = ((latest.value / yearAgo.value) - 1) * 100;
  const previousYearOverYear = ((previousMonth.value / previousYearBase.value) - 1) * 100;

  return {
    title: 'Inflation Pressure',
    value: yearOverYear,
    displayValue: `${yearOverYear.toFixed(1)}%`,
    subValue: 'Energy CPI YoY',
    trend: round1(yearOverYear - previousYearOverYear),
    sourceLabel: 'FRED CPI Energy Index',
    sourceHref: 'https://fred.stlouisfed.org/series/CPIENGSL',
    sourceFrequency: 'Monthly',
    publishedAt: formatMonthLabel(latest.date),
    syncedAt,
    note: 'Computed as year-over-year change in the CPI Energy index.',
  };
}

async function getOilDemandMetric(syncedAt: string): Promise<LiveMetric> {
  const workbookUrl = await getLatestOpecAppendixUrl();
  const workbook = XLSX.read(await fetchBuffer(workbookUrl), { type: 'buffer' });
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets['Table 11 - 1'], { header: 1, defval: '' }) as Array<Array<string | number>>;
  const demandRow = rows.find((row) => String(row[1] || '').includes('Total world demand'));

  if (!demandRow) {
    throw new Error('Could not find OPEC total world demand row.');
  }

  const annual2025 = Number(demandRow[4]);
  const annual2026 = Number(demandRow[9]);
  const publishedAt = formatSlugDate(workbookUrl, 'appendix-');

  return {
    title: 'Global Oil Consumption',
    value: annual2026,
    displayValue: `${annual2026.toFixed(2)}M`,
    subValue: 'Barrels / Day',
    trend: percentChange(annual2026, annual2025),
    sourceLabel: 'OPEC MOMR Appendix',
    sourceHref: 'https://www.opec.org/monthly-oil-market-report.html',
    sourceFrequency: 'Monthly',
    publishedAt,
    syncedAt,
    note: 'Uses OPEC 2026 world-demand estimate versus the published 2025 average.',
  };
}

async function getRetirementMetrics(syncedAt: string): Promise<{
  totalRetirementAssets: LiveMetric;
  retirementIndex: LiveMetric;
}> {
  const workbookPayload = await getLatestIciWorkbookPayload();
  const workbook = XLSX.read(workbookPayload.buffer, { type: 'buffer' });
  const table1 = XLSX.utils.sheet_to_json(workbook.Sheets['Table 1'], { header: 1, defval: '' }) as Array<Array<string | number>>;
  const table7 = XLSX.utils.sheet_to_json(workbook.Sheets['Table 7'], { header: 1, defval: '' }) as Array<Array<string | number>>;
  const table9 = XLSX.utils.sheet_to_json(workbook.Sheets['Table 9'], { header: 1, defval: '' }) as Array<Array<string | number>>;

  const latestTotalRow = findLatestPeriodRow(table1);
  const baselineRow = findPeriodRow(table1, '2024:Q3');
  const previousTotalRow = findPreviousPeriodRow(table1, latestTotalRow[0] as string);
  const latest401kRow = findLatestPeriodRow(table7);
  const latestIraRow = findLatestPeriodRow(table9);

  const totalAssets = Number(latestTotalRow[8]) / 1000;
  const baselineTotalAssets = Number(baselineRow[8]) / 1000;
  const previousTotalAssets = Number(previousTotalRow[8]) / 1000;
  const iraAssets = Number(latestIraRow[10]) / 1000;
  const k401Assets = Number(latest401kRow[5]) / 1000;
  const retirementIndex = (totalAssets / baselineTotalAssets) * 100;
  const retirementTrend = percentChange(totalAssets, previousTotalAssets);
  const quarterLabel = String(latestTotalRow[0]).replace(':', ' ');

  return {
    totalRetirementAssets: {
      title: 'Total Retirement Assets',
      value: totalAssets,
      displayValue: `$${totalAssets.toFixed(1)}T`,
      subValue: 'US Total (401k/IRA)',
      trend: retirementTrend,
      sourceLabel: 'ICI US Retirement Market',
      sourceHref: workbookPayload.url,
      sourceFrequency: 'Quarterly',
      publishedAt: quarterLabel,
      syncedAt,
      note: `Latest published quarter includes IRA assets of $${iraAssets.toFixed(1)}T and 401(k) assets of $${k401Assets.toFixed(1)}T.`,
    },
    retirementIndex: {
      title: 'Retirement Index',
      value: retirementIndex,
      displayValue: retirementIndex.toFixed(1),
      subValue: 'Growth Benchmark',
      trend: round1(retirementIndex - 100),
      sourceLabel: 'Computed from ICI Table 1',
      sourceHref: workbookPayload.url,
      sourceFrequency: 'Quarterly',
      publishedAt: quarterLabel,
      syncedAt,
      note: 'Formula: 100 × (current total retirement assets / 2024 Q3 total retirement assets).',
    },
  };
}

async function getLatestIciWorkbookPayload(): Promise<{ url: string; buffer: Buffer }> {
  const currentYear = new Date().getFullYear();
  const candidates: string[] = [];

  for (let year = currentYear; year >= currentYear - 2; year -= 1) {
    const yearToken = String(year).slice(-2);
    for (let quarter = 4; quarter >= 1; quarter -= 1) {
      candidates.push(`https://www.ici.org/statistical-report/ret_${yearToken}_q${quarter}_data.xls`);
    }
  }

  // Ensure the known-good URL is always included.
  if (!candidates.includes('https://www.ici.org/statistical-report/ret_25_q3_data.xls')) {
    candidates.push('https://www.ici.org/statistical-report/ret_25_q3_data.xls');
  }

  // Fetch all candidates in parallel; pick the most-recent (lowest index) success.
  const results = await Promise.allSettled(
    candidates.map(async (url, idx) => {
      const buffer = await fetchBuffer(url);
      return { url, buffer, idx };
    }),
  );

  const best = results
    .filter((r): r is PromiseFulfilledResult<{ url: string; buffer: Buffer; idx: number }> => r.status === 'fulfilled')
    .sort((a, b) => a.value.idx - b.value.idx)[0];

  if (best) return { url: best.value.url, buffer: best.value.buffer };

  throw new Error('Could not locate a published ICI retirement workbook URL.');
}

async function fetchFredSeries(seriesId: string): Promise<Array<{ date: string; value: number }>> {
  const csv = await fetchText(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${seriesId}`, 0);
  return csv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const [date, rawValue] = line.split(',');
      return { date, value: Number(rawValue) };
    })
    .filter((row) => row.date && Number.isFinite(row.value));
}

async function fetchText(url: string, retries = 0): Promise<string> {
  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= retries) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'text/plain,text/html,application/json,*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed for ${url}: ${response.status}`);
      }

      return response.text();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown fetch text error');
      attempt += 1;
    }
  }

  throw lastError || new Error(`Request failed for ${url}`);
}

async function fetchBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': '*/*',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

function findLatestPeriodRow(rows: Array<Array<string | number>>): Array<string | number> {
  const periodRows = rows.filter((row) => /^\d{4}(:Q[1-4])?$/.test(String(row[0] || '')));
  if (periodRows.length === 0) {
    throw new Error('No period rows found in workbook table.');
  }
  return periodRows.at(-1)!;
}

function findPreviousPeriodRow(rows: Array<Array<string | number>>, period: string): Array<string | number> {
  const periodRows = rows.filter((row) => /^\d{4}(:Q[1-4])?$/.test(String(row[0] || '')));
  const index = periodRows.findIndex((row) => String(row[0]) === period);
  if (index <= 0) {
    throw new Error(`Could not find previous period row for ${period}.`);
  }
  return periodRows[index - 1];
}

function findPeriodRow(rows: Array<Array<string | number>>, period: string): Array<string | number> {
  const match = rows.find((row) => String(row[0] || '') === period);
  if (!match) {
    throw new Error(`Could not find period row ${period}.`);
  }
  return match;
}

function percentChange(current: number, previous: number): number {
  return round1(((current - previous) / previous) * 100);
}

function round1(value: number): number {
  return Number(value.toFixed(1));
}

function formatDateLabel(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatMonthLabel(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

function formatSlugDate(url: string, marker: string): string {
  const slug = url.split('/').pop() || '';
  const cleaned = slug.replace('.xlsx', '');
  const token = cleaned.includes(marker) ? cleaned.split(marker)[1] : cleaned;
  const [month, year] = token.split('-').slice(-2);
  if (!month || !year) {
    return token;
  }
  return `${capitalize(month)} ${year}`;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

async function getLatestOpecAppendixUrl(): Promise<string> {
  const now = new Date();
  const candidates: string[] = [];

  for (let offset = 0; offset < 6; offset += 1) {
    const candidateDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const month = candidateDate.toLocaleString('en-US', { month: 'long' }).toLowerCase();
    const year = candidateDate.getFullYear();
    candidates.push(`https://www.opec.org/assets/assetdb/momr-appendix-${month}-${year}.xlsx`);
  }

  // Probe all candidates in parallel; return the first reachable URL.
  try {
    return await Promise.any(
      candidates.map(async (url) => {
        if (await canFetch(url)) return url;
        throw new Error(`Not reachable: ${url}`);
      }),
    );
  } catch {
    throw new Error('Could not locate a recent OPEC appendix workbook.');
  }
}

async function canFetch(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': '*/*',
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function safeRetirementMetrics(syncedAt: string): Promise<{
  totalRetirementAssets: LiveMetric;
  retirementIndex: LiveMetric;
}> {
  try {
    return await getRetirementMetrics(syncedAt);
  } catch {
    return {
      totalRetirementAssets: {
        title: 'Total Retirement Assets',
        value: 0,
        displayValue: 'N/A',
        subValue: 'US Total (401k/IRA)',
        trend: 0,
        sourceLabel: 'ICI US Retirement Market',
        sourceHref: 'https://www.ici.org/research/stats/retirement',
        sourceFrequency: 'Quarterly',
        publishedAt: 'Unavailable',
        syncedAt,
        note: 'Live fetch failed; retry on next sync cycle.',
      },
      retirementIndex: {
        title: 'Retirement Index',
        value: 0,
        displayValue: 'N/A',
        subValue: 'Growth Benchmark',
        trend: 0,
        sourceLabel: 'Computed from ICI Table 1',
        sourceHref: 'https://www.ici.org/research/stats/retirement',
        sourceFrequency: 'Quarterly',
        publishedAt: 'Unavailable',
        syncedAt,
        note: 'Formula requires live ICI totals: current total / 2024 Q3 total × 100.',
      },
    };
  }
}

async function safeMetric(getMetric: () => Promise<LiveMetric>, fallback: LiveMetric): Promise<LiveMetric> {
  try {
    return await getMetric();
  } catch {
    return fallback;
  }
}

async function fetchStooqCrudeQuote(): Promise<{ open: number; close: number; dateLabel: string }> {
  const line = (await fetchText('https://stooq.com/q/l/?s=cl.f', 1)).trim();
  const [symbol, dateRaw, _timeRaw, openRaw, _highRaw, _lowRaw, closeRaw] = line.split(',');

  const open = Number(openRaw);
  const close = Number(closeRaw);

  if (!symbol || !Number.isFinite(open) || !Number.isFinite(close)) {
    throw new Error('Invalid Stooq crude quote response.');
  }

  const dateLabel = /^\d{8}$/.test(dateRaw)
    ? `${dateRaw.slice(0, 4)}-${dateRaw.slice(4, 6)}-${dateRaw.slice(6, 8)}`
    : dateRaw;

  return { open, close, dateLabel };
}