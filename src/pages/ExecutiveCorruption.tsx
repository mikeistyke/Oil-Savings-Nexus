import React from 'react';
import { FileText, Landmark, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import EssaySection from '../components/EssaySection';
import { ExecutiveCorruptionProvider } from '../context/ExecutiveCorruptionContext';
import { useExecutiveCorruption } from '../hooks/useExecutiveCorruption';

function ExecutiveCorruptionContent() {
  const { title, byline, intro, thesis, sections, sources } = useExecutiveCorruption();

  return (
    <div className="w-full">
      <section className="mb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="mb-4 flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-rose-600" />
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{title}</h2>
          </div>
          <p className="max-w-4xl text-lg leading-relaxed text-slate-600">
            {intro}
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{byline}</p>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 rounded-[2.5rem] border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-amber-50 p-8 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <Landmark className="mt-1 h-6 w-6 flex-shrink-0 text-rose-600" />
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-rose-600">Working Thesis</p>
            <p className="max-w-4xl text-lg leading-8 text-slate-800">{thesis}</p>
          </div>
        </div>
      </motion.section>

      <div className="mb-12 grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <EssaySection key={section.id} section={section} emphasizeLeadWord={index === 0} />
          ))}
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-fit rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-lg xl:sticky xl:top-28"
        >
          <div className="mb-6 flex items-center gap-3">
            <FileText className="h-5 w-5 text-amber-400" />
            <h3 className="text-xl font-bold">Source Notes</h3>
          </div>
          <div className="space-y-5">
            {sources.map((source) => (
              <div key={source.id} className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-400">{source.id} {source.category}</p>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-sm font-semibold leading-6 text-white underline decoration-slate-500 underline-offset-4"
                >
                  {source.label}
                </a>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">{source.organization} • {source.year}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{source.note}</p>
              </div>
            ))}
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

export default function ExecutiveCorruption() {
  return (
    <ExecutiveCorruptionProvider>
      <ExecutiveCorruptionContent />
    </ExecutiveCorruptionProvider>
  );
}