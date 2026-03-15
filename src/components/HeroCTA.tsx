import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, TrendingDown, BookOpen } from 'lucide-react';




  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-10 md:p-14"
      >
        {/* Background texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #fff 0px,
              #fff 1px,
              transparent 1px,
              transparent 12px
            )`,
          }}
        />

        {/* Amber glow accent */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />

        <div className="relative z-10 grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
          {/* Left — copy */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-500/20">
                <TrendingDown className="h-4 w-4 text-rose-400" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-rose-400">
                The Analysis Goes Deeper
              </p>
            </div>

            <h2 className="mb-4 text-3xl font-black leading-tight text-white md:text-4xl">
              The Cannibalization<br />
              <span className="text-amber-400">of Monroe</span>
            </h2>

            <p className="max-w-lg text-base leading-8 text-slate-400">
              A monthly brief tracking how executive energy policy is quietly 
              eroding middle-class retirement wealth — with source-cited analysis 
              updated every edition as the policy shifts.
            </p>

            {/* Stats row */}
            <div className="mt-8 flex flex-wrap gap-8">
              <div>
                <p className="text-2xl font-black text-amber-400">$19</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Per Month</p>
              </div>
              <div className="w-px bg-slate-700" />
              <div>
                <p className="text-2xl font-black text-amber-400">$149</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Per Year</p>
              </div>
              <div className="w-px bg-slate-700" />
              <div>
                <p className="text-2xl font-black text-white">Monthly</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">New Editions</p>
              </div>
            </div>
          </div>

          {/* Right — CTA */}
          <div className="flex flex-col gap-4 md:min-w-[220px]">

            <a
              href="#analysis"
              className="group flex items-center justify-center gap-3 rounded-2xl bg-amber-400 px-8 py-5 text-sm font-black uppercase tracking-[0.18em] text-slate-900 shadow-lg transition-all hover:bg-amber-300 active:scale-95"
            >
              <BookOpen className="h-4 w-4" />
              Read the Brief
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>

            <p className="text-center text-[11px] font-medium text-slate-600">
              Cancel anytime · Instant access
            </p>
          </div>
        </div>
      </motion.section>


    </>
  );
}
