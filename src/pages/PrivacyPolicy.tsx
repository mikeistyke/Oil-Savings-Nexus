import React from 'react';
import { Home, Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

type PrivacyPolicyProps = {
  onNavigateHome: () => void;
};

export default function PrivacyPolicy({ onNavigateHome }: PrivacyPolicyProps) {
  return (
    <div className="w-full">
      <section className="mb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-indigo-600" />
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Privacy Policy</h2>
          </div>
          <p className="max-w-4xl text-lg leading-relaxed text-slate-600">
            This site uses analytics, monetization tools, and interactive content. This page explains what information may be collected and how it is used.
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
            title: 'Information We Collect',
            body: 'This site may collect basic technical information such as page visits, approximate traffic volume, browser details, device type, and referral data. If advertising is enabled, third-party ad providers may also use cookies or similar technologies subject to their own policies.',
          },
          {
            title: 'How Information Is Used',
            body: 'Traffic and engagement data are used to understand which pages are being read, improve content quality, monitor site performance, and support monetization through advertising or affiliate relationships.',
          },
          {
            title: 'Advertising And Affiliate Programs',
            body: 'This site may participate in advertising and affiliate programs, including Google AdSense and Amazon Associates. Those providers may collect data as described in their own privacy and cookie policies. Readers should review those third-party policies directly for current details.',
          },
          {
            title: 'Data Retention',
            body: 'Site-level traffic information is retained only as long as reasonably necessary for performance monitoring, readership analysis, and monetization reporting. This site is not intended to collect sensitive personal information from readers.',
          },
          {
            title: 'Contact',
            body: 'If readers have questions about this policy, advertising practices, or affiliate disclosures, they should use the site owner contact information provided elsewhere on the site or repository.',
          },
        ].map((section) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <Lock className="h-5 w-5 text-slate-500" />
              <h3 className="text-xl font-bold text-slate-900">{section.title}</h3>
            </div>
            <p className="text-base leading-8 text-slate-700">{section.body}</p>
          </motion.section>
        ))}
      </div>
    </div>
  );
}