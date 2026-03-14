import React from 'react';
import { Building2, FileText, Home, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import PolicyDocumentCard from '../components/PolicyDocumentCard';
import { usePolicyResources } from '../hooks/usePolicyResources';

type PolicyResourcesProps = {
  onNavigateHome: () => void;
};

export default function PolicyResources({ onNavigateHome }: PolicyResourcesProps) {
  const { resources, showCredentialing, setShowCredentialing } = usePolicyResources();

  return (
    <div className="w-full">
      <section className="mb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="mb-4 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-700" />
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Policy Resources</h2>
          </div>
          <p className="max-w-4xl text-lg leading-relaxed text-slate-600">
            Reference briefs, source-backed public policy documents, and downloadable materials used in the Oil and Wealth Nexus analysis framework.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              <Home className="h-4 w-4" />
              Back To Hero Page
            </button>
            <button
              type="button"
              onClick={() => setShowCredentialing((current) => !current)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
            >
              {showCredentialing ? 'Hide Credentialing' : 'Show Credentialing'}
            </button>
          </div>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 rounded-[2rem] border border-blue-100 bg-blue-50 p-6"
      >
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-700" />
          <h3 className="text-lg font-bold text-blue-950">Support Pillars</h3>
        </div>
        <div className="grid gap-3 text-sm leading-7 text-blue-900 md:grid-cols-3">
          <p><span className="font-semibold">Transparency:</span> Publicly accessible materials and direct source links.</p>
          <p><span className="font-semibold">Credentialing:</span> Clear author, type, publication timing, and citation details.</p>
          <p><span className="font-semibold">Reader Utility:</span> Fast PDF access for policy review, sharing, and archival reference.</p>
        </div>
      </motion.section>

      {resources.length > 0 ? (
        <div className="space-y-8">
          {resources.map((resource) => (
            <PolicyDocumentCard
              key={resource.id}
              resource={resource}
              showCredentialing={showCredentialing}
            />
          ))}
        </div>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-500" />
            <h3 className="text-xl font-bold text-slate-900">No Resources Published Yet</h3>
          </div>
          <p className="text-sm leading-7 text-slate-600">
            Add PDF files to the public/docs directory and update the policy resources hook to publish them here.
          </p>
        </motion.section>
      )}
    </div>
  );
}
