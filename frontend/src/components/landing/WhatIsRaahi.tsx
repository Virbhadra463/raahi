import React from 'react';
import { motion } from 'framer-motion';

export default function WhatIsRaahi() {
  return (
    <section
      id="what-is-raahi"
      className="py-24 sm:py-32 bg-[#FDF3EA] border-b-2 border-[#1C1440]/15 text-[#1C1440] relative"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-14">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#7A1026] font-bold block mb-2">
            Section 01 · The Name
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-[#1C1440] tracking-tight">
            SO, WHAT IS RAAHI?
          </h2>
        </div>

        {/* Dictionary-Style Editorial Treatment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#FFFDF9] border-2 border-[#1C1440]/20 rounded-2xl p-8 sm:p-12 shadow-sm relative overflow-hidden"
          style={{
            boxShadow: '4px 4px 0px rgba(28, 20, 64, 0.08)',
          }}
        >
          {/* Subtle Hindi Watermark in Background */}
          <div className="absolute right-4 -bottom-6 text-8xl sm:text-9xl font-heading font-black text-[#1C1440]/[0.03] select-none pointer-events-none">
            राही
          </div>

          {/* Dictionary Header */}
          <div className="border-b-2 border-[#1C1440]/10 pb-6 mb-8">
            <div className="flex flex-wrap items-baseline gap-3 sm:gap-4">
              <span className="font-heading font-black text-4xl sm:text-5xl text-[#1C1440] tracking-tight">
                raahi
              </span>
              <span className="font-mono text-base sm:text-lg text-[#7A1026] font-medium tracking-wide">
                /ˈraːɦiː/
              </span>
              <span className="text-xs sm:text-sm font-serif italic text-[#1C1440]/60">
                noun
              </span>
            </div>
            
            <p className="font-serif italic text-lg sm:text-xl text-[#1C1440]/85 mt-4 leading-snug">
              "a traveller; one who takes the road."
            </p>
          </div>

          {/* Editorial Explanation */}
          <div className="space-y-4 text-base sm:text-lg text-[#1C1440]/85 font-normal leading-relaxed">
            <p>
              Raahi helps travellers experience a city beyond the places everyone already knows, while still allowing them to visit the famous places they came for.
            </p>
            <p className="text-sm sm:text-base text-[#1C1440]/70 leading-relaxed">
              Every city in India lives in two rhythms — the grand monuments that fill the postcards, and the quiet lanes where life actually unfolds over copper tea kettles, block-print tables, and conversations that guidebooks never print. Raahi simply walks between both.
            </p>
          </div>

          {/* Footnote / Field annotation */}
          <div className="mt-8 pt-5 border-t border-[#1C1440]/10 flex items-center justify-between text-xs text-[#1C1440]/55 font-mono">
            <span>ETYMOLOGY · HINDUSTANI (राह / RAAH = PATH)</span>
            <span className="font-handwriting font-bold text-sm text-[#7A1026]">
              field note #01
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
