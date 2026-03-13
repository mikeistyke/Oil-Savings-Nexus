import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  label?: string;
  className?: string;
}

const ADSENSE_CLIENT = 'ca-pub-8397847516131978';

export default function AdSlot({
  slot,
  format = 'auto',
  label = 'Advertisement',
  className = '',
}: AdSlotProps) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!slot || initializedRef.current) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      initializedRef.current = true;
    } catch (error) {
      console.error('[adsense] ad slot init failed:', error);
    }
  }, [slot]);

  if (!slot) {
    return null;
  }

  return (
    <section className={`rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm ${className}`.trim()}>
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <ins
        className="adsbygoogle block min-h-[120px] w-full overflow-hidden rounded-xl bg-slate-50"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </section>
  );
}