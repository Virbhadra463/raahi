import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Check } from 'lucide-react';

export default function RaahiBook() {
  const thingsWeGoFor = [
    'Famous landmarks',
    'Iconic viewpoints',
    'Historic monuments',
    'Popular restaurants',
    'Famous markets',
    'Must-see attractions',
    'Places already on the map',
  ];

  const thingsWeLookFor = [
    'Little lanes',
    'Local artists',
    'Local artisans',
    'Small family-run businesses',
    'Neighbourhood cafés and food stalls',
    'Local stories',
    'Places tourists usually walk past',
    'Unexpected discoveries',
  ];

  return (
    <section
      id="raahi-book"
      className="py-24 sm:py-32 bg-[#FAF5EE] border-b-2 border-[#1C1440]/15 text-[#1C1440] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#7A1026] font-bold block mb-2">
            Section 02 · The Field Journal
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-[#1C1440] tracking-tight">
            THE RAAHI BOOK
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#1C1440]/75 font-medium">
            A few things we look for along the way.
          </p>
        </div>

        {/* Physical Travel Book / Open Journal Container */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Book Leather / Hardbound Outer Cover Matting */}
          <div className="p-3 sm:p-5 md:p-6 bg-[#381B1D] rounded-3xl sm:rounded-[36px] shadow-2xl border-4 border-[#240F11] relative">
            
            {/* Bookmark Ribbon Peeking from Top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 sm:w-8 h-10 sm:h-14 bg-[#FF7A8D] rounded-b-md shadow-md z-30 flex items-end justify-center pb-1">
              <div className="w-0 h-0 border-l-[12px] sm:border-l-[16px] border-l-transparent border-r-[12px] sm:border-r-[16px] border-r-transparent border-b-[8px] sm:border-b-[10px] border-b-[#381B1D]" />
            </div>

            {/* Open Book Spread (Two Pages with Center Crease) */}
            <div className="bg-[#FFFDF7] rounded-2xl sm:rounded-[28px] border-2 border-[#E8DAC9] grid grid-cols-1 md:grid-cols-2 relative overflow-hidden shadow-inner">
              
              {/* Center Binding Crease & Gutter Shadow (Hidden on Mobile) */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/[0.08] via-black/[0.18] to-transparent z-20 pointer-events-none" />
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#D4C3AF] z-20 pointer-events-none shadow-sm" />

              {/* ================= LEFT PAGE: THINGS WE GO FOR ================= */}
              <div className="p-6 sm:p-8 md:p-10 lg:p-12 border-b md:border-b-0 md:border-r border-[#E8DAC9] relative flex flex-col justify-between bg-[radial-gradient(#e5d8c5_0.75px,transparent_0.75px)] [background-size:16px_16px]">
                
                {/* Page Header */}
                <div>
                  <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-[#1C1440]/15">
                    <span className="font-mono text-[10px] text-[#1C1440]/50 tracking-widest uppercase">
                      CHAPTER I · THE MAP
                    </span>
                    <span className="font-handwriting text-xs text-[#7A1026] font-bold">
                      p. 42
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#1C1440] tracking-tight mb-2">
                    THINGS WE GO FOR
                  </h3>
                  <p className="font-handwriting text-sm sm:text-base text-[#7A1026] font-bold mb-6">
                    "The icons that drew us to the road in the first place."
                  </p>

                  {/* Bullet List */}
                  <ul className="space-y-2.5 mb-8">
                    {thingsWeGoFor.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#1C1440]/90">
                        <span className="w-4 h-4 rounded-full bg-[#1C1440]/10 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-[#1C1440] stroke-[3]" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Left Page Photo Clippings (from public/digital-book/people-visit/) */}
                <div className="mt-4 pt-6 border-t border-[#1C1440]/10">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#1C1440]/50 mb-3">
                    ARCHIVE PRINTS · LANDMARKS
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Photo 1: Taj Mahal */}
                    <div className="relative group bg-white p-1 rounded shadow-md border border-[#E8DAC9] rotate-[-2deg] hover:rotate-0 transition-transform">
                      <div className="aspect-[4/3] overflow-hidden rounded-xs bg-[#EDE4D8]">
                        <img
                          src="/digital-book/people-visit/taj mahal.jpg"
                          alt="Taj Mahal"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-handwriting text-[9px] sm:text-[10px] font-bold text-center block mt-1 text-[#1C1440]/80 truncate">
                        Agra
                      </span>
                    </div>

                    {/* Photo 2: Jaipur */}
                    <div className="relative group bg-white p-1 rounded shadow-md border border-[#E8DAC9] rotate-[2deg] hover:rotate-0 transition-transform">
                      <div className="aspect-[4/3] overflow-hidden rounded-xs bg-[#EDE4D8]">
                        <img
                          src="/digital-book/people-visit/jaipur.jpg"
                          alt="Jaipur Monument"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-handwriting text-[9px] sm:text-[10px] font-bold text-center block mt-1 text-[#1C1440]/80 truncate">
                        Hawa Mahal
                      </span>
                    </div>

                    {/* Photo 3: Agra Fort */}
                    <div className="relative group bg-white p-1 rounded shadow-md border border-[#E8DAC9] rotate-[-1deg] hover:rotate-0 transition-transform">
                      <div className="aspect-[4/3] overflow-hidden rounded-xs bg-[#EDE4D8]">
                        <img
                          src="/digital-book/people-visit/agra.jpg"
                          alt="Agra Red Fort"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-handwriting text-[9px] sm:text-[10px] font-bold text-center block mt-1 text-[#1C1440]/80 truncate">
                        Agra Fort
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ================= RIGHT PAGE: THINGS WE LOOK FOR ================= */}
              <div className="p-6 sm:p-8 md:p-10 lg:p-12 relative flex flex-col justify-between bg-[radial-gradient(#e5d8c5_0.75px,transparent_0.75px)] [background-size:16px_16px]">
                
                {/* Page Header */}
                <div>
                  <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-[#1C1440]/15">
                    <span className="font-mono text-[10px] text-[#7A1026] tracking-widest uppercase font-bold">
                      CHAPTER II · THE STREET
                    </span>
                    <span className="font-handwriting text-xs text-[#7A1026] font-bold">
                      p. 43
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#7A1026] tracking-tight mb-2">
                    THINGS WE LOOK FOR
                  </h3>
                  <p className="font-handwriting text-sm sm:text-base text-[#1C1440]/80 font-bold mb-6">
                    "The quiet discoveries that give a street its soul."
                  </p>

                  {/* Bullet List */}
                  <ul className="space-y-2.5 mb-8">
                    {thingsWeLookFor.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#1C1440]/90">
                        <span className="w-4 h-4 rounded-full bg-[#7A1026]/10 flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7A1026]" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Page Photo Clippings (from public/digital-book/people-miss-out/) */}
                <div className="mt-4 pt-6 border-t border-[#1C1440]/10">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#7A1026] mb-3 font-bold">
                    FIELD DISPATCHES · THE MOHALLAS
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Photo 1: Local shop */}
                    <div className="relative group bg-white p-1 rounded shadow-md border border-[#E8DAC9] rotate-[2deg] hover:rotate-0 transition-transform">
                      <div className="aspect-[4/3] overflow-hidden rounded-xs bg-[#EDE4D8]">
                        <img
                          src="/digital-book/people-miss-out/local shop.jpg"
                          alt="Local shop artisan"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-handwriting text-[9px] sm:text-[10px] font-bold text-center block mt-1 text-[#7A1026] truncate">
                        Corner Dukaan
                      </span>
                    </div>

                    {/* Photo 2: Second shop */}
                    <div className="relative group bg-white p-1 rounded shadow-md border border-[#E8DAC9] rotate-[-2deg] hover:rotate-0 transition-transform">
                      <div className="aspect-[4/3] overflow-hidden rounded-xs bg-[#EDE4D8]">
                        <img
                          src="/digital-book/people-miss-out/local shop2.jpg"
                          alt="Local family artisan shop"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-handwriting text-[9px] sm:text-[10px] font-bold text-center block mt-1 text-[#7A1026] truncate">
                        Generations
                      </span>
                    </div>

                    {/* Photo 3: Street atmosphere */}
                    <div className="relative group bg-white p-1 rounded shadow-md border border-[#E8DAC9] rotate-[1deg] hover:rotate-0 transition-transform">
                      <div className="aspect-[4/3] overflow-hidden rounded-xs bg-[#EDE4D8]">
                        <img
                          src="/digital-book/people-miss-out/street.jpg"
                          alt="Living street alley"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-handwriting text-[9px] sm:text-[10px] font-bold text-center block mt-1 text-[#7A1026] truncate">
                        Little Alley
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Inscription Ribbon / Journal Philosophy */}
            <div className="mt-5 text-center px-4">
              <p className="font-serif italic text-sm sm:text-base text-[#FDF3EA]/90 tracking-wide">
                "We go for the famous places, but we also look for what lies beyond them."
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
