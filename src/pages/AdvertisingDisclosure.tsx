import React from 'react';
import { BadgeDollarSign, Home, Megaphone } from 'lucide-react';
import { motion } from 'motion/react';

type AdvertisingDisclosureProps = {
  onNavigateHome: () => void;
};

export default function AdvertisingDisclosure({ onNavigateHome }: AdvertisingDisclosureProps) {
  return (
    <div className="w-full">
      <section className="mb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="mb-4 flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-amber-600" />
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Advertising Disclosure</h2>
          </div>
          <p className="max-w-4xl text-lg leading-relaxed text-slate-600">
            This site may monetize through display advertising, affiliate partnerships, and sponsored commercial placements.
          </p>
          <button
            type="button"
            onClick={onNavigateHome}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <Home className="h-4 w-4" />
            Back To Hero Page
          </button>
        </motion.div>
      </section>

      <div className="space-y-8">
        {[
          {
            title: 'Display Advertising',
            body: 'This site may show advertising served by third-party providers such as Google AdSense. Ad placement, personalization, and delivery may vary by reader, region, device, and provider policies.',
          },
          {
            title: 'Affiliate Relationships',
            body: 'Some links on this site may be affiliate links, including Amazon Associates links. If a reader clicks and later purchases through one of those links, the site owner may earn a commission at no additional cost to the reader.',
          },
          {
            title: 'Editorial Independence',
            body: 'Opinions, essays, and analysis published on this site are editorial content. Monetization relationships do not guarantee favorable coverage, and the presence of a paid or affiliate link should not be interpreted as a claim of endorsement beyond the stated recommendation.',
          },
          {
            title: 'Sponsored Content',
            body: 'If sponsored content or paid partnerships are introduced, they should be labeled clearly so readers can distinguish them from independent commentary and analysis.',
          },
        ].map((section) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <BadgeDollarSign className="h-5 w-5 text-amber-600" />
              <h3 className="text-xl font-bold text-slate-900">{section.title}</h3>
            </div>
            <p className="text-base leading-8 text-slate-700">{section.body}</p>
          </motion.section>
        ))}
      </div>
    </div>
  );
}