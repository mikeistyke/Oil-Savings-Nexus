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

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

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
