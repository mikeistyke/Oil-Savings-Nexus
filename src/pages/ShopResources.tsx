import React from 'react';
import { BookOpen, ShoppingCart, WalletCards } from 'lucide-react';
import { motion } from 'motion/react';
import AdSlot from '../components/AdSlot';
import AffiliateRecommendations from '../components/AffiliateRecommendations';

const AMAZON_AFFILIATE_TAG = import.meta.env.VITE_AMAZON_AFFILIATE_TAG;
const ADSENSE_SHOP_SLOT = import.meta.env.VITE_ADSENSE_SHOP_SLOT;

const macroEnergyItems = [
  {
    title: 'Oil geopolitics and energy security library',
    description: 'Books and references for understanding producer-state risk, shipping chokepoints, and energy diplomacy.',
    searchTerm: 'oil geopolitics energy security books',
    cta: 'Browse energy security resources',
  },
  {
    title: 'Commodity cycles and inflation analysis',
    description: 'Material focused on commodity shocks, inflation pass-through, and household purchasing power impacts.',
    searchTerm: 'commodity cycles inflation books',
    cta: 'Browse inflation and commodity titles',
  },
];

const householdWealthItems = [
  {
    title: 'Retirement resilience and risk-management guides',
    description: 'Practical long-term planning resources for readers protecting portfolios through volatile macro cycles.',
    searchTerm: 'retirement risk management investing books',
    cta: 'Browse retirement planning resources',
  },
  {
    title: 'Behavioral investing and decision-making books',
    description: 'Decision frameworks for navigating risk-off periods and emotionally charged markets.',
    searchTerm: 'behavioral finance investing books',
    cta: 'Browse behavioral finance titles',
  },
];

export default function ShopResources() {
  return (
    <div className="w-full">
      <section className="mb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="mb-4 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-amber-600" />
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Shop Resources</h2>
          </div>
          <p className="max-w-4xl text-lg leading-relaxed text-slate-600">
            Curated reading lists for energy markets, macro volatility, and retirement resilience. Purchases through eligible links may support the site at no additional cost to readers.
          </p>
        </motion.div>
      </section>

      {!AMAZON_AFFILIATE_TAG && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 rounded-[2rem] border border-amber-200 bg-amber-50 p-6"
        >
          <p className="text-sm font-semibold text-amber-800">
            Affiliate tag not configured yet. Add VITE_AMAZON_AFFILIATE_TAG in environment settings to activate storefront links.
          </p>
        </motion.section>
      )}

      <div className="mb-10 grid gap-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-slate-900">Energy and Macro Intelligence</h3>
          </div>
          <p className="mb-6 text-sm leading-7 text-slate-600">
            For readers following policy shocks, oil supply dynamics, and commodity-driven inflation scenarios.
          </p>
          <AffiliateRecommendations title="Energy and Macro Picks" items={macroEnergyItems} />
        </motion.section>

        <AdSlot slot={ADSENSE_SHOP_SLOT} label="Advertisement" />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-3">
            <WalletCards className="h-5 w-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-slate-900">Household Wealth and Portfolio Durability</h3>
          </div>
          <p className="mb-6 text-sm leading-7 text-slate-600">
            For readers building long-run strategy under uncertainty, inflation drift, and volatile risk sentiment.
          </p>
          <AffiliateRecommendations title="Retirement and Investing Picks" items={householdWealthItems} />
        </motion.section>
      </div>
    </div>
  );
}