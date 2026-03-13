import type { IncomingMessage, ServerResponse } from 'http';
import { getVisitorStats, recordVisit } from '../visitor-tracking.server.js';
import type { RecordVisitRequest } from '../src/lib/visitorStats.js';

function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => {
      if (!chunks.length) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function getIpAddress(req: IncomingMessage) {
  const forwarded = req.headers['x-forwarded-for'];

  if (Array.isArray(forwarded)) {
    return forwarded[0];
  }

  return forwarded ?? req.socket.remoteAddress ?? '';
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      res.end(JSON.stringify(getVisitorStats()));
      return;
    }

    if (req.method === 'POST') {
      const payload = await readJsonBody(req) as RecordVisitRequest;
      const stats = recordVisit({
        path: payload.path,
        visitorId: payload.visitorId,
        ipAddress: getIpAddress(req),
        userAgent: req.headers['user-agent'] ?? '',
      });

      res.end(JSON.stringify(stats));
      return;
    }

    res.statusCode = 405;
    res.end(JSON.stringify({ message: 'Method not allowed' }));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({
      message: error instanceof Error ? error.message : 'Unknown visitor-stats error',
    }));
  }
}