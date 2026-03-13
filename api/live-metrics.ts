import type { IncomingMessage, ServerResponse } from 'http';
import { getLiveMetrics } from '../live-metrics.server.js';

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  try {
    const payload = await getLiveMetrics();
    res.setHeader('Content-Type', 'application/json');
    // Allow CDN to cache for 1 h; serve stale for up to 2 h while revalidating
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    res.end(JSON.stringify(payload));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        message: error instanceof Error ? error.message : 'Unknown live-metrics error',
      }),
    );
  }
}
