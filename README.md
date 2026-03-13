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

On Vercel, analytics are ephemeral unless you set a persistent path:

1. `AFFILIATE_DB_PATH` for affiliate analytics
2. `VISITOR_DB_PATH` for visitor metrics

### Environment Variables Used

1. `VITE_AMAZON_AFFILIATE_TAG`
2. `VITE_ADSENSE_OVERVIEW_SLOT`
3. `VITE_ADSENSE_ESSAY_SLOT`
4. `VITE_ADSENSE_SHOP_SLOT`
5. `AFFILIATE_DB_PATH` (optional for durable affiliate analytics)
6. `VISITOR_DB_PATH` (optional for durable visitor metrics)
