import React from 'react';
import { motion } from 'framer-motion';
import { POLAROIDS } from '../../data/landing/quests';
import { Sparkles } from 'lucide-react';

export default function PolaroidStrip() {
  return (
    <section id="story" className="py-24 bg-[#FAF5EE] overflow-hidden relative border-b-2 border-zinc-200 text-signboard-navy">
      
      {/* Section Header */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-carpet-maroon/15 border border-carpet-maroon/30 text-carpet-maroon text-xs font-heading font-black uppercase tracking-widest mb-3">
          <Sparkles className="w-4 h-4 text-terracotta" />
          <span>Footnotes from the Street</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-signboard-navy">
          Every Street Remembers What Guidebooks Miss
        </h2>
        <p className="mt-3 text-base text-signboard-navy/85 font-medium max-w-2xl mx-auto">
          Pinned memories from real wayfarers across India. Real conversations, family recipes, sunrise chants, and forgotten courtyards.
        </p>
      </div>

      {/* Hanging Clothesline String Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* The Clothesline Wire / String */}
        <div className="relative w-full h-8 -mb-4 z-20 pointer-events-none">
          <svg
            className="w-full h-8 overflow-visible"
            viewBox="0 0 1200 32"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0,12 Q300,26 600,16 T1200,12"
              stroke="#1C1440"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="5 3"
              className="opacity-80"
            />
          </svg>
        </div>

        {/* Polaroid Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 relative z-10 pt-2">
          {POLAROIDS.map((item, index) => {
            const initialRotation = item.rotation * 2;
            const targetRotation = item.rotation;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -45, rotate: initialRotation }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotate: targetRotation,
                  transition: {
                    type: 'spring',
                    stiffness: 180,
                    damping: 14,
                    delay: index * 0.1,
                  },
                }}
                viewport={{ once: true, margin: '-50px' }}
                whileHover={{
                  scale: 1.05,
                  rotate: 0,
                  zIndex: 30,
                  transition: { duration: 0.2 },
                }}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Wooden Clothes Peg Graphic */}
                <div className="relative -mb-3 z-30 flex flex-col items-center">
                  <div className="w-4 h-7 rounded-sm bg-amber-800 border-2 border-amber-950 shadow-md flex flex-col justify-between py-1 items-center">
                    <div className="w-2.5 h-0.5 bg-amber-600 rounded-full" />
                    <div className="w-2 h-2 rounded-full bg-zinc-300 border border-zinc-600 shadow-inner" />
                    <div className="w-2.5 h-0.5 bg-amber-950" />
                  </div>
                </div>

                {/* Polaroid Frame */}
                <div className="bg-white p-3.5 pb-6 rounded-sm polaroid-shadow border-2 border-zinc-200 w-full max-w-[240px] sm:max-w-none transition-shadow group-hover:shadow-2xl">
                  
                  {/* Photo Container */}
                  <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 rounded-xs border border-zinc-300 mb-3.5">
                    <img
                      src={item.src}
                      alt={item.caption}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-[1.05] saturate-[1.1]"
                    />
                    
                    {/* Location / vibe tag */}
                    <div className="absolute top-2 left-2 bg-signboard-dark/90 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-heading font-black text-parchment border border-marigold/30">
                      {item.tag}
                    </div>
                  </div>

                  {/* Handwritten Caption in Kalam font */}
                  <div className="px-1 text-center space-y-1.5">
                    <p className="font-handwriting font-bold text-signboard-navy text-base leading-tight">
                      {item.caption}
                    </p>
                    <p className="font-handwriting text-zinc-700 text-xs sm:text-sm leading-snug line-clamp-2 font-semibold">
                      "{item.note}"
                    </p>
                  </div>

                  {/* Stamped authenticity date */}
                  <div className="mt-3 pt-2.5 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-500 font-mono font-bold">
                    <span>RAAHI #{index + 101}</span>
                    <span className="text-emerald-700 font-black uppercase">Verified</span>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom micro-prompt */}
        <div className="text-center mt-12">
          <span className="inline-block font-handwriting font-bold text-signboard-navy text-base sm:text-lg bg-amber-50 px-6 py-2 rounded-full border border-amber-300 shadow-sm">
            ~ "A real journey is measured in friends made and chai shared, not miles clocked." ~
          </span>
        </div>

      </div>
    </section>
  );
}
