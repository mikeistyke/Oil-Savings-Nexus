/**
 * Production Express server.
 * Used when deploying to Railway, Render, Heroku, or any Node.js host.
 * Run with:  npm start
 */
import express from 'express';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { getLiveMetrics } from './live-metrics.server.js';
import { getVisitorStats, recordVisit } from './visitor-tracking.server.js';
import { getAffiliateAnalytics, recordAffiliateClick } from './affiliate-clicks.server.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());

// ── Live metrics API ────────────────────────────────────────────────────────
app.get('/api/live-metrics', async (_req, res) => {
  try {
    const payload = await getLiveMetrics();
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=7200');
    res.json(payload);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown live-metrics error',
    });
  }
});

app.get('/api/visitor-stats', (_req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.json(getVisitorStats());
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown visitor-stats error',
    });
  }
});

app.post('/api/visitor-stats', (req, res) => {
  try {
    const stats = recordVisit({
      path: req.body?.path,
      visitorId: req.body?.visitorId,
      ipAddress: req.headers['x-forwarded-for']?.toString() ?? req.socket.remoteAddress ?? '',
      userAgent: req.headers['user-agent'] ?? '',
    });

    res.setHeader('Cache-Control', 'no-store');
    res.json(stats);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown visitor-stats error',
    });
  }
});

app.get('/api/affiliate-clicks', (_req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.json(getAffiliateAnalytics());
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown affiliate-clicks error',
    });
  }
});

app.post('/api/affiliate-clicks', (req, res) => {
  try {
    if (!req.body?.pageId || !req.body?.blockId || !req.body?.itemTitle || !req.body?.destinationUrl) {
      res.status(400).json({ message: 'Missing required affiliate click fields.' });
      return;
    }

    const analytics = recordAffiliateClick({
      pageId: req.body.pageId,
      blockId: req.body.blockId,
      itemTitle: req.body.itemTitle,
      destinationUrl: req.body.destinationUrl,
      visitorId: req.body.visitorId,
      ipAddress: req.headers['x-forwarded-for']?.toString() ?? req.socket.remoteAddress ?? '',
      userAgent: req.headers['user-agent'] ?? '',
    });

    res.setHeader('Cache-Control', 'no-store');
    res.json(analytics);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown affiliate-clicks error',
    });
  }
});

// ── Static SPA files ────────────────────────────────────────────────────────
const distDir = join(__dirname, 'dist');
app.use(express.static(distDir));

// SPA fallback – all non-API routes serve index.html
app.get('*', (_req, res) => {
  res.sendFile(join(distDir, 'index.html'));
});

// ── Start ───────────────────────────────────────────────────────────────────
const port = Number(process.env.PORT ?? 3000);
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
