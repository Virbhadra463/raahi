import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Compass, Sparkles } from 'lucide-react';

export default function RaahiFinds() {
  const fragments = [
    {
      id: 'find-1',
      title: 'A tiny workshop hidden behind a blue door.',
      location: 'Ghee Walon Ka Rasta, Jaipur Old City',
      coordinates: '26.9248° N, 75.8274° E',
      type: 'DISCOVERY DISPATCH #01',
      stamp: 'UNMAPPED WORKSHOP',
      image: '/landing_page_2/people-miss-out/local shop.jpg',
      annotation:
        'Look for the weathered turquoise archway beside the brass samovar. Inside, three generations carve seasoned teak wood blocks for indigo block printing. No signboard. Just the rhythmic tap of wooden mallets on stone.',
      rotation: -1.5,
      accent: 'border-[#1C1440]',
      tapeColor: 'bg-[#FFD38A]/70',
    },
    {
      id: 'find-2',
      title: 'A family recipe served from a small neighbourhood stall.',
      location: 'Corner of Chaupar Alley, 90-Year-Old Hearth',
      coordinates: 'VINTAGE TICKET · 1934 RECIPE',
      type: 'TASTE OF LIVING HERITAGE',
      stamp: 'SLOW COAL BREW',
      image: '/landing_page_2/people-miss-out/local shop2.jpg',
      annotation:
        'Simmered over babool wood charcoal in a hammered brass vessel. Panditji crushes ginger and green cardamom by hand. No tourist markup, no food blogger stickers — just the real taste the neighborhood wakes up to every morning.',
      rotation: 2,
      accent: 'border-[#7A1026]',
      tapeColor: 'bg-[#FF7A8D]/60',
    },
    {
      id: 'find-3',
      title: 'A local artist whose work never made it into the guidebook.',
      location: 'Courtyard Behind the Grain Mandi',
      coordinates: 'FIELD DISPATCH · 44 YEARS MASTERY',
      type: 'QUIET CUSTODIAN',
      stamp: 'OFF THE MAP',
      image: '/landing_page_2/people-miss-out/street.jpg',
      annotation:
        'Master Ramdas paints traditional motifs using natural river pigments and single-hair brushes. While tour buses idle on the highway, he shares stories of how royal courts once patronized his ancestors right on this stoop.',
      rotation: -1,
      accent: 'border-[#C98A2E]',
      tapeColor: 'bg-[#FFD38A]/70',
    },
  ];

  return (
    <section
      id="raahi-finds"
      className="py-24 sm:py-32 bg-[#FDF3EA] border-b-2 border-[#1C1440]/15 text-[#1C1440] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#7A1026] font-bold block mb-2">
            Section 03 · Wayfarer Fragments
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-[#1C1440] tracking-tight">
            RAAHI FINDS
          </h2>
          <p className="mt-2 text-base sm:text-lg text-[#1C1440]/75 font-serif italic">
            "Somewhere between the map and the street."
          </p>
        </div>

        {/* Travel-Journal Fragments Composition (Editorial & Tactile, NOT a SaaS grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-8 items-start">
          {fragments.map((frag, idx) => (
            <motion.div
              key={frag.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="relative group"
              style={{ transform: `rotate(${frag.rotation}deg)` }}
            >
              {/* Masking Tape / Paper Strip on top */}
              <div
                className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 ${frag.tapeColor} border border-[#1C1440]/20 z-30 shadow-xs backdrop-blur-xs`}
                style={{ transform: 'rotate(-2deg)' }}
              />

              {/* Journal Paper Scrap Card */}
              <div className="bg-[#FFFDF9] rounded-xl p-5 sm:p-6 border-2 border-[#1C1440]/25 shadow-md flex flex-col justify-between relative overflow-hidden">
                
                {/* Stamp & Dispatch Badge */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1C1440]/15">
                  <span className="font-mono text-[10px] text-[#1C1440]/60 font-bold uppercase tracking-wider">
                    {frag.type}
                  </span>
                  <span className="px-2 py-0.5 rounded border border-[#7A1026] text-[#7A1026] font-mono text-[9px] font-black uppercase tracking-widest bg-[#7A1026]/5">
                    {frag.stamp}
                  </span>
                </div>

                {/* Photo Clipping */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-[#EDE4D8] border border-[#1C1440]/20 mb-4 shadow-inner">
                  <img
                    src={frag.image}
                    alt={frag.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-[1.05]"
                  />
                  {/* Location label */}
                  <div className="absolute bottom-2 left-2 right-2 bg-[#0E0924]/85 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] text-[#FDF3EA] font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#FFD38A] shrink-0" />
                    <span className="truncate">{frag.location}</span>
                  </div>
                </div>

                {/* Finding Heading */}
                <h3 className="font-heading font-black text-lg sm:text-xl text-[#1C1440] leading-snug mb-3">
                  {frag.title}
                </h3>

                {/* Handwritten Journal Scrap Annotation */}
                <div className="bg-[#F8F2E6] p-4 rounded-lg border border-[#E0D3C1] relative mb-3">
                  <p className="font-handwriting font-bold text-sm sm:text-base text-[#1C1440]/90 leading-relaxed">
                    "{frag.annotation}"
                  </p>
                </div>

                {/* Perforated Footnote with Coordinates */}
                <div className="pt-2.5 border-t border-dashed border-[#1C1440]/20 flex items-center justify-between text-[10px] font-mono text-[#1C1440]/60">
                  <span>{frag.coordinates}</span>
                  <span className="font-handwriting font-bold text-xs text-[#7A1026]">
                    verified trail
                  </span>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
