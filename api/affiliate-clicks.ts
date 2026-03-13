import type { IncomingMessage, ServerResponse } from 'http';
import { getAffiliateAnalytics, recordAffiliateClick } from '../affiliate-clicks.server.js';
import type { RecordAffiliateClickRequest } from '../src/lib/affiliateClicks.js';

function getAnalyticsKey(req: IncomingMessage) {
  const headerValue = req.headers['x-analytics-key'];
  if (Array.isArray(headerValue)) {
    return headerValue[0] ?? '';
  }

  return headerValue ?? '';
}

function isOwnerAuthorized(req: IncomingMessage) {
  const expected = process.env.AFFILIATE_ANALYTICS_KEY?.trim();
  if (!expected) {
    return false;
  }

  return getAnalyticsKey(req).trim() === expected;
}

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

function toRecordAffiliateClickRequest(payload: Record<string, unknown>): RecordAffiliateClickRequest {
  return {
    pageId: typeof payload.pageId === 'string' ? payload.pageId : '',
    blockId: typeof payload.blockId === 'string' ? payload.blockId : '',
    itemTitle: typeof payload.itemTitle === 'string' ? payload.itemTitle : '',
    destinationUrl: typeof payload.destinationUrl === 'string' ? payload.destinationUrl : '',
    visitorId: typeof payload.visitorId === 'string' ? payload.visitorId : undefined,
  };
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      if (!isOwnerAuthorized(req)) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: 'Unauthorized affiliate analytics access.' }));
        return;
      }

      res.end(JSON.stringify(await getAffiliateAnalytics()));
      return;
    }

    if (req.method === 'POST') {
      const rawPayload = await readJsonBody(req);
      const payload = toRecordAffiliateClickRequest(rawPayload);

      if (!payload.pageId || !payload.blockId || !payload.itemTitle || !payload.destinationUrl) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: 'Missing required affiliate click fields.' }));
        return;
      }

      const stats = await recordAffiliateClick({
        ...payload,
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
      message: error instanceof Error ? error.message : 'Unknown affiliate-clicks error',
    }));
  }
}