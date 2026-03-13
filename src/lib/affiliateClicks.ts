export interface RecordAffiliateClickRequest {
  pageId: string;
  blockId: string;
  itemTitle: string;
  destinationUrl: string;
  visitorId?: string;
}

export interface AffiliateClickPoint {
  key: string;
  clicks: number;
}

export interface AffiliateAnalyticsResponse {
  totalClicks: number;
  uniqueVisitors: number;
  lastClickAt: string | null;
  topPages: AffiliateClickPoint[];
  topBlocks: AffiliateClickPoint[];
  topItems: AffiliateClickPoint[];
  persistentStorage: boolean;
}