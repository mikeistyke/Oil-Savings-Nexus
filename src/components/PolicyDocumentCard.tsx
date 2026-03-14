import React from 'react';
import { Download, ExternalLink, FileBadge2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { PolicyResource } from '../hooks/usePolicyResources';

type PolicyDocumentCardProps = {
  resource: PolicyResource;
  showCredentialing: boolean;
};

export default function PolicyDocumentCard({
  resource,
  showCredentialing,
}: PolicyDocumentCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
            <FileBadge2 className="h-3.5 w-3.5" />
            Policy Resource
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{resource.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{resource.summary}</p>
        </div>
      </div>

      {showCredentialing && (
        <div className="mb-6 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-700 md:grid-cols-2">
          <p>
            <span className="font-semibold text-slate-900">Document Type:</span> {resource.credential}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Published:</span> {resource.publishedOn}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Author:</span> {resource.author}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Primary Source Context:</span> {resource.sourceAgency}
          </p>
          <p className="md:col-span-2">
            <span className="font-semibold text-slate-900">Suggested Citation:</span> {resource.citation}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <a
          href={resource.fileHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          <ExternalLink className="h-4 w-4" />
          View PDF
        </a>
        <a
          href={resource.fileHref}
          download
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </a>
      </div>
    </motion.article>
  );
}
