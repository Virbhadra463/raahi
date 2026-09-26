import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface FinalStatementProps {
  onStartWanderingClick: () => void;
}

export default function FinalStatement({ onStartWanderingClick }: FinalStatementProps) {
  return (
    <section className="py-28 sm:py-36 bg-[#120C2B] text-parchment text-center relative overflow-hidden border-t-4 border-marigold">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-radial from-[#7A1026]/30 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* Minimal Stamp Eyebrow */}
        <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-marigold font-bold px-3.5 py-1 rounded-full border border-marigold/40 bg-marigold/10 mb-8 inline-block">
          The Wayfarer's Truth
        </span>

        {/* The Final Statement Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-parchment max-w-3xl"
        >
          THE CITY IS BIGGER<br />THAN ITS CHECKLIST.
        </motion.h2>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-serif italic text-lg sm:text-xl md:text-2xl text-parchment/85 mt-6 mb-10 max-w-xl leading-relaxed"
        >
          See the places you came for.<br />
          Discover the places you didn't know to look for.
        </motion.p>

        {/* Final Statement CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <button
            onClick={onStartWanderingClick}
            className="bg-marigold hover:bg-amber-300 active:scale-95 text-signboard-navy font-heading font-black text-base sm:text-lg px-9 py-4 rounded-full shadow-signboard-lg hover:shadow-signboard transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer group border-2 border-signboard-navy"
          >
            <span>START WANDERING</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform stroke-[2.5]" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
