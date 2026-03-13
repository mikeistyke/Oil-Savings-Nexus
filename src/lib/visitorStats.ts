export interface VisitorStatsResponse {
  totalHits: number;
  uniqueVisitors: number;
  lastHitAt: string | null;
  persistentStorage: boolean;
}

export interface RecordVisitRequest {
  path?: string;
  visitorId?: string;
}