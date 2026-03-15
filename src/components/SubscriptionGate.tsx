import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Sparkles, ArrowRight, CheckCircle2, X } from 'lucide-react';

// ─── Config ──────────────────────────────────────────────────────────────────
// Set your Lemon Squeezy checkout URL in .env as VITE_LS_CHECKOUT_URL
// e.g. https://your-store.lemonsqueezy.com/checkout/buy/your-variant-id
const CHECKOUT_URL = import.meta.env.VITE_LS_CHECKOUT_URL ?? '#';
const TOKEN_STORAGE_KEY = 'osn-subscriber-token';
const PRICE_DISPLAY = '$19 / month';
const ANNUAL_DISPLAY = '$149 / year — save $79';

// ─── Token validation ─────────────────────────────────────────────────────────
// After Lemon Squeezy webhook fires, your /api/verify-subscription.ts
// endpoint stores a signed token in localStorage. This checks for it.
function getSubscriberToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BenefitRow({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
      <span className="text-sm leading-6 text-slate-300">{text}</span>
    </li>
  );
}

interface SubscriptionModalProps {
  onClose: () => void;
}

export function SubscriptionModal({ onClose }: SubscriptionModalProps) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  const checkoutUrl =
    billing === 'annual'
      ? (import.meta.env.VITE_LS_CHECKOUT_URL_ANNUAL ?? CHECKOUT_URL)
      : CHECKOUT_URL;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative w-full max-w-lg rounded-[2.5rem] border border-slate-700 bg-slate-900 p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-1 text-slate-500 transition-colors hover:text-slate-300"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.26em] text-amber-400">
            Oil Savings Nexus Brief
          </p>
          <h2 className="text-2xl font-black leading-tight text-white">
            The Cannibalization<br />of Monroe — Continued
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Monthly policy analysis at the intersection of executive energy decisions 
            and your retirement account — written plainly, updated every edition.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mb-6 flex gap-2 rounded-2xl border border-slate-700 bg-slate-800 p-1">
          {(['monthly', 'annual'] as const).map((plan) => (
            <button
              key={plan}
              type="button"
              onClick={() => setBilling(plan)}
              className={`flex-1 rounded-xl py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                billing === plan
                  ? 'bg-amber-400 text-slate-900 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {plan === 'monthly' ? `Monthly · ${PRICE_DISPLAY}` : `Annual · ${ANNUAL_DISPLAY}`}
            </button>
          ))}
        </div>

        {/* Benefits */}
        <ul className="mb-8 space-y-2">
          <BenefitRow text="Full access to the current edition of the Monroe brief" />
          <BenefitRow text="Every new monthly edition — updated as executive policy shifts" />
          <BenefitRow text="Archive access to all prior editions while subscribed" />
          <BenefitRow text="Source notes and cited legislative documents included" />
          <BenefitRow text="Cancel anytime — no lock-in" />
        </ul>

        {/* CTA */}
        <a
          href={checkoutUrl}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-amber-400 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-900 shadow-lg transition-all hover:bg-amber-300 active:scale-95"
        >
          Subscribe Now
          <ArrowRight className="h-4 w-4" />
        </a>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          Secure checkout via Lemon Squeezy · Instant access · Cancel anytime
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Main gate ────────────────────────────────────────────────────────────────

interface SubscriptionGateProps {
  /** Content that renders freely — no gate */
  preview: React.ReactNode;
  /** Content that requires a subscription */
  gated: React.ReactNode;
}

export default function SubscriptionGate({ preview, gated }: SubscriptionGateProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check for token on mount and after returning from checkout
    const token = getSubscriberToken();
    if (token) setIsSubscribed(true);

    // Also listen for storage changes (token written by webhook redirect handler)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_STORAGE_KEY && e.newValue) {
        setIsSubscribed(true);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <>
      {/* Free preview — always visible */}
      {preview}

      {/* Gated content */}
      {isSubscribed ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {gated}
        </motion.div>
      ) : (
        <div className="relative mt-8">
          {/* Blurred ghost of gated content */}
          <div
            className="pointer-events-none select-none blur-sm opacity-40"
            aria-hidden="true"
          >
            {gated}
          </div>

          {/* Paywall overlay */}
          <div className="absolute inset-0 flex items-start justify-center pt-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto w-full max-w-md rounded-[2.5rem] border border-rose-200/60 bg-white/95 p-8 shadow-2xl backdrop-blur-md"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50">
                  <Lock className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-600">
                    Subscriber Content
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    The analysis continues below
                  </p>
                </div>
              </div>

              <p className="mb-6 text-sm leading-7 text-slate-600">
                The remaining sections of <em>The Cannibalization of Monroe</em> are available 
                to subscribers — including source-cited analysis updated each month as 
                executive energy policy evolves.
              </p>

              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <Sparkles className="h-4 w-4 flex-shrink-0 text-amber-600" />
                <p className="text-xs font-semibold text-amber-800">
                  Starting at {PRICE_DISPLAY} · Cancel anytime
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow transition-all hover:bg-slate-700 active:scale-95"
              >
                Continue Reading
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && <SubscriptionModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
}
