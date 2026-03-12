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
  metrics: {
    oilConsumption: LiveMetric;
    oilPrice: LiveMetric;
    totalRetirementAssets: LiveMetric;
    retirementIndex: LiveMetric;
    inflationPressure: LiveMetric;
  };
}