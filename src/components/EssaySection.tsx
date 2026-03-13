import React from 'react';
import { motion } from 'motion/react';
import type { ExecutiveCorruptionSection } from '../content/executiveCorruption';

interface EssaySectionProps {
  section: ExecutiveCorruptionSection;
  emphasizeLeadWord?: boolean;
}

function renderLeadParagraph(paragraph: string) {
  const [firstWord, ...rest] = paragraph.split(' ');
  const restText = rest.join(' ');

  return (
    <>
      <span className="mr-2 text-5xl font-black leading-none text-slate-900 md:text-6xl">{firstWord}</span>
      <span>{restText}</span>
    </>
  );
}

export default function EssaySection({ section, emphasizeLeadWord = false }: EssaySectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
    >
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-rose-600">{section.eyebrow}</p>
      <h3 className="mb-5 text-2xl font-bold text-slate-900">{section.heading}</h3>
      <div className="space-y-4">
        {section.body.map((paragraph, index) => (
          <p key={paragraph} className="text-base leading-8 text-slate-700">
            {emphasizeLeadWord && index === 0 ? renderLeadParagraph(paragraph) : paragraph}
          </p>
        ))}
      </div>
      <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
        Cited: {section.citations.join(' ')}
      </p>
    </motion.section>
  );
}