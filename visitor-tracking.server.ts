import Database from 'better-sqlite3';
import { createHash } from 'crypto';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { tmpdir } from 'os';
import type { VisitorStatsResponse } from './src/lib/visitorStats.js';

interface RecordVisitParams {
  path?: string;
  visitorId?: string;
  ipAddress?: string;
  userAgent?: string;
}

let database: Database.Database | null = null;

function getDatabasePath() {
  if (process.env.VISITOR_DB_PATH) {
    return process.env.VISITOR_DB_PATH;
  }

  if (process.env.VERCEL) {
    return join(tmpdir(), 'oil-wealth-nexus', 'visitor-analytics.db');
  }

  return join(process.cwd(), 'data', 'visitor-analytics.db');
}

function isPersistentStorage() {
  return !process.env.VERCEL || Boolean(process.env.VISITOR_DB_PATH);
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
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor_id TEXT NOT NULL,
      ip_hash TEXT,
      path TEXT NOT NULL,
      user_agent TEXT,
      visited_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_visits_visitor_id ON visits(visitor_id);
    CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at);
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

function resolveVisitorId({ visitorId, ipAddress, userAgent }: RecordVisitParams) {
  if (visitorId) {
    return visitorId;
  }

  const fallbackIdentity = `${normalizeIpAddress(ipAddress)}|${userAgent ?? ''}`;
  return sha256(fallbackIdentity || 'anonymous');
}

function isBot(userAgent?: string) {
  if (!userAgent) {
    return false;
  }

  return /bot|spider|crawl|preview|slurp|wget|curl/i.test(userAgent);
}

export function getVisitorStats(): VisitorStatsResponse {
  const db = getDatabase();
  const stats = db.prepare(`
    SELECT
      COUNT(*) as totalHits,
      COUNT(DISTINCT visitor_id) as uniqueVisitors,
      MAX(visited_at) as lastHitAt
    FROM visits
  `).get() as {
    totalHits: number;
    uniqueVisitors: number;
    lastHitAt: string | null;
  };

  return {
    totalHits: stats.totalHits ?? 0,
    uniqueVisitors: stats.uniqueVisitors ?? 0,
    lastHitAt: stats.lastHitAt ?? null,
    persistentStorage: isPersistentStorage(),
  };
}

export function recordVisit(params: RecordVisitParams): VisitorStatsResponse {
  if (isBot(params.userAgent)) {
    return getVisitorStats();
  }

  const db = getDatabase();
  const visitorId = resolveVisitorId(params);
  const ipHash = params.ipAddress ? sha256(normalizeIpAddress(params.ipAddress)) : null;

  db.prepare(`
    INSERT INTO visits (visitor_id, ip_hash, path, user_agent, visited_at)
    VALUES (@visitorId, @ipHash, @path, @userAgent, @visitedAt)
  `).run({
    visitorId,
    ipHash,
    path: params.path || '/',
    userAgent: params.userAgent ?? '',
    visitedAt: new Date().toISOString(),
  });

  return getVisitorStats();
}