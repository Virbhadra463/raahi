import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import { CULTURAL_FASHION_DATA } from '../../data/culturalFashionData';

interface TakeAPieceOfThePlaceProps {
  onOpenExperience: (stateId: string) => void;
}

export default function TakeAPieceOfThePlace({ onOpenExperience }: TakeAPieceOfThePlaceProps) {
  const [selectedStateId, setSelectedStateId] = useState<string>('rajasthan');

  const states = [
    { id: 'rajasthan', label: 'RAJASTHAN', subLabel: 'राजस्थान' },
    { id: 'maharashtra', label: 'MAHARASHTRA', subLabel: 'महाराष्ट्र' },
    { id: 'tamil-nadu', label: 'TAMIL NADU', subLabel: 'तमिलनाडु' },
    { id: 'gujarat', label: 'GUJARAT', subLabel: 'गुजरात' },
  ];

  const currentData = CULTURAL_FASHION_DATA[selectedStateId] || CULTURAL_FASHION_DATA['rajasthan'];

  return (
    <section
      id="take-a-piece"
      className="py-28 sm:py-36 bg-[#FDF6EE] border-b-2 border-[#1C1440]/15 text-[#1C1440] relative overflow-hidden transition-colors duration-500"
    >
      {/* Very subtle Indian floral block-print pattern overlay (at 3.5% opacity) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] bg-repeat"
        style={{
          backgroundImage: `url('/dress-to-impress/dress to impress background.jpg')`,
          backgroundSize: '480px auto',
        }}
      />

      {/* Delicate regional border print framing top and bottom */}
      <div className="absolute top-0 inset-x-0 h-1 bg-[repeating-linear-gradient(90deg,#7A1026_0,#7A1026_8px,transparent_8px,transparent_16px)] opacity-30" />
      <div className="absolute bottom-0 inset-x-0 h-1 bg-[repeating-linear-gradient(90deg,#7A1026_0,#7A1026_8px,transparent_8px,transparent_16px)] opacity-30" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Understated Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#7A1026] font-bold block mb-3">
            Section 04 · Living Craft & Attire
          </span>

          <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl text-[#1C1440] tracking-tight leading-[1.05]">
            TAKE A PIECE<br />OF THE PLACE
          </h2>

          <p className="font-serif italic text-lg sm:text-xl text-[#7A1026] mt-4 font-normal">
            “Some souvenirs are bought. Others are discovered.”
          </p>

          <p className="text-xs sm:text-sm text-[#1C1440]/70 font-medium max-w-lg mx-auto mt-2 leading-relaxed">
            Discover the craft, clothing and traditions that make every place its own.
          </p>
        </div>

        {/* Elegant Horizontal Destination Selector (Text Navigation, NOT rounded cards) */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-12 pb-8 border-b border-[#1C1440]/15 overflow-x-auto scrollbar-none">
          {states.map((st, idx) => {
            const isSelected = selectedStateId === st.id;
            return (
              <React.Fragment key={st.id}>
                <button
                  onClick={() => setSelectedStateId(st.id)}
                  className={`group flex flex-col items-center py-2 transition-all cursor-pointer whitespace-nowrap relative ${
                    isSelected ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-80'
                  }`}
                >
                  <span className="font-heading font-black text-sm sm:text-base md:text-lg tracking-wider text-[#1C1440]">
                    {st.label}
                  </span>
                  <span className="text-[10px] font-serif italic text-[#7A1026] -mt-0.5">
                    {st.subLabel}
                  </span>

                  {/* Understated editorial marker under active state */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeStateUnderline"
                      className="absolute -bottom-[33px] w-6 h-[3px] bg-[#7A1026] rounded-full"
                    />
                  )}
                </button>

                {idx < states.length - 1 && (
                  <span className="text-[#1C1440]/20 font-serif select-none hidden sm:inline">
                    ·
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Dynamic Regional Editorial Content (Changes per state) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedStateId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="pt-12 sm:pt-16 max-w-4xl mx-auto flex flex-col items-center text-center"
          >
            {/* Fine topographic/geographic detail marker */}
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-widest text-[#1C1440]/50 uppercase mb-6 bg-[#1C1440]/[0.03] px-4 py-1.5 rounded-full border border-[#1C1440]/10">
              <Compass className="w-3.5 h-3.5 text-[#7A1026]" />
              <span>{currentData.regionCraftNote}</span>
            </div>

            {/* Short Editorial Quote */}
            <h3 className="font-serif italic font-normal text-2xl sm:text-3xl md:text-4xl text-[#1C1440] leading-snug whitespace-pre-line max-w-2xl">
              "{currentData.editorialQuote}"
            </h3>

            {/* Supporting Micro-copy */}
            <p className="mt-6 text-sm sm:text-base text-[#1C1440]/75 font-normal leading-relaxed max-w-2xl">
              {currentData.subCopy}
            </p>

            {/* Subtle CTA: DISCOVER THE MAKERS → */}
            <div className="mt-10">
              <button
                onClick={() => onOpenExperience(selectedStateId)}
                className="group inline-flex items-center gap-3 text-xs sm:text-sm font-heading font-black tracking-widest uppercase text-[#7A1026] hover:text-[#1C1440] py-3 px-6 rounded-full border-2 border-[#7A1026] hover:border-[#1C1440] hover:bg-[#7A1026]/5 transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
              >
                <span>DISCOVER THE MAKERS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform stroke-[2.5]" />
              </button>
            </div>

            {/* Subtle disclaimer */}
            <span className="text-[10px] font-mono text-[#1C1440]/40 tracking-wider uppercase mt-5">
              Interactive 3D Cultural Craft Archive & Itinerary Integrator
            </span>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
