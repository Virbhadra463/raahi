import React from 'react';
import { UserProfile } from '../types';
import { Compass, MapPin, Sparkles, BookOpen, Clock, Award, Check } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface MyJourneyViewProps {
  user: UserProfile;
  onExploreQuests: () => void;
}

export const MyJourneyView: React.FC<MyJourneyViewProps> = ({ user, onExploreQuests }) => {
  return (
    <div className="max-w-5xl mx-auto py-6 space-y-12 text-[#1C1440]">
      {/* Journal Cover Header */}
      <div className="border-b-2 border-[#E8DAC9] pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#7A1026] uppercase font-bold">
              DIGITAL TRAVEL SCRAPBOOK
            </span>
            <span className="text-xs text-[#1C1440]/40">·</span>
            <span className="text-xs font-mono text-[#1C1440]/60">VOLUME I · 2026</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#1C1440] tracking-tight">
            Memories of the Road
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-[#1C1440]/75 mt-1 max-w-xl">
            "We do not travel to check boxes on a list. We travel so the quiet corners of the world remain alive inside us."
          </p>
        </div>

        {/* Travel Stats — Handcrafted, not corporate */}
        <div className="flex items-center gap-4 bg-[#FAF5EE] border border-[#E8DAC9] p-4 rounded-sm shrink-0">
          <div className="text-center px-3 border-r border-[#E8DAC9]">
            <span className="font-heading font-black text-2xl text-[#7A1026] block leading-none">
              {user.completedQuestIds.length + 1}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#1C1440]/70">
              Stories Unlocked
            </span>
          </div>
          <div className="text-center px-3 border-r border-[#E8DAC9]">
            <span className="font-heading font-black text-2xl text-[#C98A2E] block leading-none">
              4
            </span>
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#1C1440]/70">
              Makers Met
            </span>
          </div>
          <div className="text-center px-3">
            <span className="font-heading font-black text-2xl text-[#1A6B5E] block leading-none">
              {user.coins}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#1C1440]/70">
              Raahi Coins
            </span>
          </div>
        </div>
      </div>

      {/* Scrapbook Section: JAIPUR · DAY 01 */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-[#E8DAC9] pb-3">
          <div className="flex items-center gap-3">
            <span className="bg-[#7A1026] text-white px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider">
              JAIPUR · DAY 01
            </span>
            <span className="text-xs text-[#1C1440]/60 font-serif italic">
              14 October · Old Walled City
            </span>
          </div>
          <span className="text-xs font-handwriting text-[#7A1026] font-bold">
            "The day we chose the quieter path"
          </span>
        </div>

        {/* Memory Grid 1: Polaroids, Stamps, Notes */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Polaroid 1: The Lane */}
          <div className="md:col-span-4 bg-white p-3.5 pb-6 border-2 border-[#E8DAC9] shadow-sm rotate-[-1.5deg] hover:rotate-0 transition-transform">
            <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 mb-3 border border-[#E8DAC9]">
              <img
                src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80"
                alt="Jaipur Alley"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-handwriting text-center text-sm font-bold text-[#1C1440]">
              "I followed the quieter road."
            </p>
            <span className="block text-center font-mono text-[9px] text-[#1C1440]/50 mt-1 uppercase">
              10:42 AM · Badi Chaupar Alley
            </span>
          </div>

          {/* Center Column: Inked Travel Stamp + Story Fragment */}
          <div className="md:col-span-4 space-y-6 flex flex-col items-center justify-center pt-4">
            {/* Hand-Stamped Travel Stamp */}
            <div className="border-3 border-[#7A1026] p-4 text-center text-[#7A1026] rotate-2 bg-[#FFFDF9] shadow-xs max-w-[240px] w-full">
              <div className="border border-dashed border-[#7A1026] p-3 space-y-1">
                <span className="font-mono text-[9px] tracking-widest block uppercase font-bold">
                  OFFICIAL WAYFARER STAMP
                </span>
                <h4 className="font-heading font-black text-sm uppercase tracking-wide">
                  THE DOOR THAT ISN'T ON THE MAP
                </h4>
                <div className="text-[10px] font-mono text-[#7A1026]/80 pt-1">
                  OLD CITY CRAFT GUILD · VERIFIED
                </div>
              </div>
            </div>

            {/* Field Note Snippet */}
            <div className="bg-[#FAF5EE] border-l-3 border-[#C98A2E] p-4 text-xs font-serif italic text-[#1C1440]/90 leading-relaxed w-full">
              "When the tour buses pulled into the main street, we turned into Ghee Walon Ka Rasta. You could hear birds in the neem trees that you never hear on the main road."
            </div>
          </div>

          {/* Polaroid 2: The Maker */}
          <div className="md:col-span-4 bg-white p-3.5 pb-6 border-2 border-[#E8DAC9] shadow-sm rotate-[2deg] hover:rotate-0 transition-transform">
            <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 mb-3 border border-[#E8DAC9]">
              <img
                src="/master-ramdas.jpg"
                alt="Master Ramdas"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-handwriting text-center text-sm font-bold text-[#1C1440]">
              "Met a third-generation artisan."
            </p>
            <span className="block text-center font-mono text-[9px] text-[#1C1440]/50 mt-1 uppercase">
              11:15 AM · Master Ramdas Workshop
            </span>
          </div>

        </div>

        {/* Unlocked Story Fragment Quote Banner */}
        <div className="bg-[#FFFDF9] border border-[#1C1440] p-6 sm:p-8 space-y-3 relative shadow-[3px_3px_0px_#1C1440]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C98A2E]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#C98A2E] font-bold">
              Story Fragment Inscribed
            </span>
          </div>
          <blockquote className="font-serif font-bold text-lg sm:text-xl text-[#1C1440] italic leading-snug">
            "The wood remembers the tree, and the dye remembers the river. When you press the block into the cloth, you are not stamping ink. You are stamping sixty years of my father's breath."
          </blockquote>
          <span className="block text-xs font-mono text-[#7A1026] font-semibold">
            — Master Ramdas, 3rd-Gen Woodblock Printer, Jaipur
          </span>
        </div>
      </div>

      {/* Section: People & Experiences Met Along the Way */}
      <div className="space-y-6 pt-6 border-t-2 border-[#E8DAC9]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#7A1026] font-bold block">
              LIVING HERITAGE DIRECTORY
            </span>
            <h3 className="font-heading font-black text-2xl text-[#1C1440]">
              People &amp; Makers You Connected With
            </h3>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onExploreQuests();
            }}
            className="text-xs font-bold text-[#7A1026] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Play Next Chapter</span>
            <span>&rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: 'Master Ramdas Prajapati',
              craft: 'Hand-Carved Teakwood Printing',
              place: 'Lane 4, Haveli Courtyard',
              quote: '"Ask the block where it wants to sit."',
              status: 'Verified Encounter',
              img: '/master-ramdas.jpg',
            },
            {
              name: 'Pandit Kishan-ji',
              craft: 'Slow-Fire Saffron Kulhad Chai',
              place: 'Ghee Walon Ka Rasta Hearth',
              quote: '"Boiled over babool coals since 1934."',
              status: 'Verified Encounter',
              img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80',
            },
            {
              name: 'Soniya Devi & Guild',
              craft: 'Natural Madder & Turmeric Dyeing',
              place: 'Indigo Vat Terrace #2',
              quote: '"Colors that never fade in monsoon water."',
              status: 'Discovered in Chapter 02',
              img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&auto=format&fit=crop&q=80',
            },
          ].map((person, idx) => (
            <div
              key={idx}
              className="border border-[#E8DAC9] bg-white p-4 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={person.img}
                  alt={person.name}
                  className="w-12 h-12 object-cover border border-[#E8DAC9]"
                />
                <div>
                  <h4 className="font-heading font-black text-sm text-[#1C1440]">
                    {person.name}
                  </h4>
                  <p className="text-[10px] text-[#7A1026] font-mono">
                    {person.craft}
                  </p>
                </div>
              </div>

              <p className="font-serif italic text-xs text-[#1C1440]/80">
                {person.quote}
              </p>

              <div className="pt-2 border-t border-[#E8DAC9] flex items-center justify-between text-[9px] font-mono">
                <span className="text-[#1C1440]/60">{person.place}</span>
                <span className="text-emerald-800 font-bold uppercase flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  {person.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
