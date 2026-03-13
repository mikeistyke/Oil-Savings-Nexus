import React from 'react';
import { motion } from 'motion/react';
import type { ExecutiveCorruptionSection } from '../content/executiveCorruption';

interface EssaySectionProps {
  section: ExecutiveCorruptionSection;
}

export default function EssaySection({ section }: EssaySectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
    >
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-rose-600">{section.eyebrow}</p>
      <h3 className="mb-5 text-2xl font-bold text-slate-900">{section.heading}</h3>
      <div className="space-y-4">
        {section.body.map((paragraph) => (
          <p key={paragraph} className="text-base leading-8 text-slate-700">
            {paragraph}
          </p>
        ))}
      </div>
      <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
        Cited: {section.citations.join(' ')}
      </p>
    </motion.section>
  );
}