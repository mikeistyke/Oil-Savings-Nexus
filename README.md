<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/910a1870-4f4f-4720-9d52-686f04f1e609

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Monetization Analytics

This project includes first-party affiliate click tracking and an in-app analytics page.

### Where To View Affiliate Metrics

Open the app and navigate to the `Affiliate Analytics` tab in the top menu or footer links.

The analytics page now requires an owner key prompt and validates access server-side.

The page shows:

1. Total affiliate clicks
2. Unique visitors who clicked affiliate links
3. Last click timestamp
4. Top pages by clicks
5. Top recommendation blocks by clicks
6. Top clicked item titles

### How Click Tracking Works

Affiliate cards in these areas send click events to `/api/affiliate-clicks`:

1. Overview page reader resources
2. Executive Corruption page further reading
3. Shop Resources page recommendation blocks

### Storage Notes

By default, local/Node hosting persists analytics to SQLite in `data/affiliate-analytics.db`.

On Vercel, the recommended durable option is KV-backed analytics using these environment variables:

1. `KV_REST_API_URL`
2. `KV_REST_API_TOKEN`

If KV is not configured, analytics are ephemeral unless you set a persistent path:

1. `AFFILIATE_DB_PATH` for affiliate analytics
2. `VISITOR_DB_PATH` for visitor metrics

### Environment Variables Used

1. `VITE_AMAZON_AFFILIATE_TAG`
2. `VITE_ADSENSE_OVERVIEW_SLOT`
3. `VITE_ADSENSE_ESSAY_SLOT`
4. `VITE_ADSENSE_SHOP_SLOT`
5. `AFFILIATE_DB_PATH` (optional for durable affiliate analytics)
6. `VISITOR_DB_PATH` (optional for durable visitor metrics)
7. `AFFILIATE_ANALYTICS_KEY` (required to restrict affiliate analytics to owner access)
8. `KV_REST_API_URL` (recommended for durable Vercel analytics)
9. `KV_REST_API_TOKEN` (recommended for durable Vercel analytics)

### Owner-Only Access Setup

To lock affiliate analytics so only you can view it:

1. Set `AFFILIATE_ANALYTICS_KEY` in your hosting environment (for example, Vercel Project Settings → Environment Variables).
2. For durable hosted analytics on Vercel, connect Vercel KV and ensure `KV_REST_API_URL` and `KV_REST_API_TOKEN` are available.
3. Redeploy.
4. In the site UI, click `Affiliate Analytics` and enter that key when prompted.

Notes:

1. `AFFILIATE_ANALYTICS_KEY` is server-side only and should not use a `VITE_` prefix.
2. Affiliate click recording (`POST /api/affiliate-clicks`) stays public so normal readers can still generate click data.

## Policy Resources Update (March 2026)

This release adds a dedicated `Policy Resources` experience for source-backed policy documents.

### New Page

1. Added a new `Policy Resources` tab/page in the app shell.
2. Added a `Back To Hero Page` action on the policy page.
3. Added a `Show Credentialing` / `Hide Credentialing` toggle.

### New Document Asset

1. Converted and published the legislative brief as a web-served PDF:
   - `public/docs/EIA_Legislative_Brief_Cirigliano.pdf`
2. The original DOCX source remains in:
   - `docs/EIA_Legislative_Brief_Cirigliano.docx`

### Standard Credentialing Included

Each policy document card now displays:

1. Document type
2. Author
3. Publication date
4. Primary source context
5. Suggested citation

### React Architecture Additions

1. New page component: `src/pages/PolicyResources.tsx`
2. New reusable card component: `src/components/PolicyDocumentCard.tsx`
3. New data/state hook: `src/hooks/usePolicyResources.ts`

### Navigation And Hero-Return Updates

1. Added `Policy Resources` to the top tab nav and footer links.
2. Added explicit `Home` link in footer quick links.
3. Updated footer icon links that previously pointed to `#` so they route back to the hero/overview page.
4. Added hero-return buttons to legal pages:
   - `src/pages/PrivacyPolicy.tsx`
   - `src/pages/AdvertisingDisclosure.tsx`
