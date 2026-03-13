import React from 'react';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import type { RecordAffiliateClickRequest } from '../lib/affiliateClicks';

interface AffiliateItem {
  title: string;
  description: string;
  searchTerm: string;
  cta: string;
}

interface AffiliateRecommendationsProps {
  title?: string;
  items: AffiliateItem[];
  pageId: string;
  blockId: string;
}

const AMAZON_AFFILIATE_TAG = import.meta.env.VITE_AMAZON_AFFILIATE_TAG;

function buildAmazonUrl(searchTerm: string) {
  const params = new URLSearchParams({
    k: searchTerm,
  });

  if (AMAZON_AFFILIATE_TAG) {
    params.set('tag', AMAZON_AFFILIATE_TAG);
  }

  return `https://www.amazon.com/s?${params.toString()}`;
}

export default function AffiliateRecommendations({
  title = 'Recommended Reading',
  items,
  pageId,
  blockId,
}: AffiliateRecommendationsProps) {
  const trackClick = (payload: RecordAffiliateClickRequest) => {
    try {
      const body = JSON.stringify(payload);

      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon('/api/affiliate-clicks', blob);
        return;
      }

      void fetch('/api/affiliate-clicks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
        keepalive: true,
      });
    } catch (error) {
      console.error('[affiliate-clicks] tracking failed:', error);
    }
  };

  if (!AMAZON_AFFILIATE_TAG || !items.length) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8 shadow-sm"
    >
      <div className="mb-6 flex items-center gap-3">
        <ShoppingBag className="h-5 w-5 text-amber-700" />
        <div>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600">
            These links may earn a commission at no extra cost to readers.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <a
            key={item.title}
            href={buildAmazonUrl(item.searchTerm)}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-amber-200 bg-white p-5 transition-shadow hover:shadow-md"
            onClick={() => trackClick({
              pageId,
              blockId,
              itemTitle: item.title,
              destinationUrl: buildAmazonUrl(item.searchTerm),
            })}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-bold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                <p className="mt-4 text-sm font-semibold text-amber-700">{item.cta}</p>
              </div>
              <ExternalLink className="mt-1 h-4 w-4 flex-shrink-0 text-amber-700" />
            </div>
          </a>
        ))}
      </div>
    </motion.section>
  );
}