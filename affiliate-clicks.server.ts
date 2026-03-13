import Database from 'better-sqlite3';
import { createHash } from 'crypto';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { tmpdir } from 'os';
import { hasKvRestStorage, parseSortedSetResult, runKvCommand } from './kv-rest.server.js';
import type { AffiliateAnalyticsResponse, RecordAffiliateClickRequest } from './src/lib/affiliateClicks.js';

interface RecordAffiliateClickParams extends RecordAffiliateClickRequest {
  ipAddress?: string;
  userAgent?: string;
}

let database: Database.Database | null = null;

function getDatabasePath() {
  if (process.env.AFFILIATE_DB_PATH) {
    return process.env.AFFILIATE_DB_PATH;
  }

  if (process.env.VERCEL) {
    return join(tmpdir(), 'oil-wealth-nexus', 'affiliate-analytics.db');
  }

  return join(process.cwd(), 'data', 'affiliate-analytics.db');
}

function isPersistentStorage() {
  return hasKvRestStorage() || !process.env.VERCEL || Boolean(process.env.AFFILIATE_DB_PATH);
}

function getDatabase() {
  if (database) {
    return database;
  }

  const databasePath = getDatabasePath();
  mkdirSync(dirname(databasePath), { recursive: true });

  database = new Database(databasePath);
  database.pragma('journal_mode = WAL');
  database.exec(`
    CREATE TABLE IF NOT EXISTS affiliate_clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor_id TEXT NOT NULL,
      ip_hash TEXT,
      page_id TEXT NOT NULL,
      block_id TEXT NOT NULL,
      item_title TEXT NOT NULL,
      destination_url TEXT NOT NULL,
      user_agent TEXT,
      clicked_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_visitor_id ON affiliate_clicks(visitor_id);
    CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_page_id ON affiliate_clicks(page_id);
    CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_block_id ON affiliate_clicks(block_id);
    CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_item_title ON affiliate_clicks(item_title);
    CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at);
  `);

  return database;
}

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function normalizeIpAddress(ipAddress?: string) {
  if (!ipAddress) {
    return '';
  }

  return ipAddress.split(',')[0]?.trim() ?? '';
}

function resolveVisitorId(params: RecordAffiliateClickParams) {
  if (params.visitorId) {
    return params.visitorId;
  }

  const fallbackIdentity = `${normalizeIpAddress(params.ipAddress)}|${params.userAgent ?? ''}`;
  return sha256(fallbackIdentity || 'anonymous');
}

function isBot(userAgent?: string) {
  if (!userAgent) {
    return false;
  }

  return /bot|spider|crawl|preview|slurp|wget|curl/i.test(userAgent);
}

function queryTopBy(field: 'page_id' | 'block_id' | 'item_title', alias: string) {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT ${field} as key, COUNT(*) as clicks
    FROM affiliate_clicks
    GROUP BY ${field}
    ORDER BY clicks DESC
    LIMIT 8
  `).all() as Array<{ key: string; clicks: number }>;

  return rows.map((row) => ({
    key: row.key || alias,
    clicks: row.clicks,
  }));
}

async function getAffiliateAnalyticsFromKv(): Promise<AffiliateAnalyticsResponse> {
  const [totalClicks, uniqueVisitors, lastClickAt, topPagesRaw, topBlocksRaw, topItemsRaw] = await Promise.all([
    runKvCommand<number>(['GET', 'analytics:affiliate:totalClicks']),
    runKvCommand<number>(['SCARD', 'analytics:affiliate:uniqueVisitors']),
    runKvCommand<string | null>(['GET', 'analytics:affiliate:lastClickAt']),
    runKvCommand<unknown>(['ZREVRANGE', 'analytics:affiliate:topPages', 0, 7, 'WITHSCORES']),
    runKvCommand<unknown>(['ZREVRANGE', 'analytics:affiliate:topBlocks', 0, 7, 'WITHSCORES']),
    runKvCommand<unknown>(['ZREVRANGE', 'analytics:affiliate:topItems', 0, 7, 'WITHSCORES']),
  ]);

  return {
    totalClicks: Number(totalClicks ?? 0),
    uniqueVisitors: Number(uniqueVisitors ?? 0),
    lastClickAt: lastClickAt ?? null,
    topPages: parseSortedSetResult(topPagesRaw),
    topBlocks: parseSortedSetResult(topBlocksRaw),
    topItems: parseSortedSetResult(topItemsRaw),
    persistentStorage: true,
  };
}

export async function getAffiliateAnalytics(): Promise<AffiliateAnalyticsResponse> {
  if (hasKvRestStorage()) {
    return getAffiliateAnalyticsFromKv();
  }

  const db = getDatabase();
  const overview = db.prepare(`
    SELECT
      COUNT(*) as totalClicks,
      COUNT(DISTINCT visitor_id) as uniqueVisitors,
      MAX(clicked_at) as lastClickAt
    FROM affiliate_clicks
  `).get() as {
    totalClicks: number;
    uniqueVisitors: number;
    lastClickAt: string | null;
  };

  return {
    totalClicks: overview.totalClicks ?? 0,
    uniqueVisitors: overview.uniqueVisitors ?? 0,
    lastClickAt: overview.lastClickAt ?? null,
    topPages: queryTopBy('page_id', 'page'),
    topBlocks: queryTopBy('block_id', 'block'),
    topItems: queryTopBy('item_title', 'item'),
    persistentStorage: isPersistentStorage(),
  };
}

export async function recordAffiliateClick(params: RecordAffiliateClickParams): Promise<AffiliateAnalyticsResponse> {
  if (isBot(params.userAgent)) {
    return getAffiliateAnalytics();
  }

  if (hasKvRestStorage()) {
    const visitorId = resolveVisitorId(params);
    const clickedAt = new Date().toISOString();

    await Promise.all([
      runKvCommand(['INCR', 'analytics:affiliate:totalClicks']),
      runKvCommand(['SADD', 'analytics:affiliate:uniqueVisitors', visitorId]),
      runKvCommand(['SET', 'analytics:affiliate:lastClickAt', clickedAt]),
      runKvCommand(['ZINCRBY', 'analytics:affiliate:topPages', 1, params.pageId]),
      runKvCommand(['ZINCRBY', 'analytics:affiliate:topBlocks', 1, params.blockId]),
      runKvCommand(['ZINCRBY', 'analytics:affiliate:topItems', 1, params.itemTitle]),
    ]);

    return getAffiliateAnalyticsFromKv();
  }

  const db = getDatabase();
  const visitorId = resolveVisitorId(params);
  const ipHash = params.ipAddress ? sha256(normalizeIpAddress(params.ipAddress)) : null;

  db.prepare(`
    INSERT INTO affiliate_clicks (
      visitor_id,
      ip_hash,
      page_id,
      block_id,
      item_title,
      destination_url,
      user_agent,
      clicked_at
    )
    VALUES (
      @visitorId,
      @ipHash,
      @pageId,
      @blockId,
      @itemTitle,
      @destinationUrl,
      @userAgent,
      @clickedAt
    )
  `).run({
    visitorId,
    ipHash,
    pageId: params.pageId,
    blockId: params.blockId,
    itemTitle: params.itemTitle,
    destinationUrl: params.destinationUrl,
    userAgent: params.userAgent ?? '',
    clickedAt: new Date().toISOString(),
  });

  return getAffiliateAnalytics();
}