import React from 'react';
import { Compass, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { playClickSound } from '../../utils/audio';

interface ShortConceptProps {
  onExploreClick: () => void;
}

export default function ShortConcept({ onExploreClick }: ShortConceptProps) {
  const handleExplore = () => {
    playClickSound();
    onExploreClick();
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF5EE] text-[#1C1440] border-t-2 border-b-2 border-[#E8DAC9]">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Editorial Eyebrow & Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#7A1026] uppercase font-bold block">
            THE RAAHI MANIFESTO
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-[#1C1440] tracking-tight">
            Not A Guidebook. A Living Story.
          </h2>
          <p className="font-serif italic text-base sm:text-lg text-[#1C1440]/75 leading-relaxed">
            "When everyone follows the same ten pins on a map, cities choke and stories die. RAAHI guides your footsteps where memory still lives."
          </p>
        </div>

        {/* 3 Clean Editorial Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Principle 01 */}
          <div className="border border-[#E8DAC9] bg-white p-6 sm:p-7 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A1026] font-bold block">
                01 · THE UNMAPPED LANE
              </span>
              <h3 className="font-heading font-black text-lg text-[#1C1440]">
                Sensory Clues Over Cold GPS Pins
              </h3>
              <p className="text-xs sm:text-sm text-[#1C1440]/75 font-serif leading-relaxed">
                Follow the scent of babool coals, the sound of teakwood blocks tapping, and turquoise doorways that guidebooks never print.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8DAC9] text-[10px] font-mono text-[#7A1026] uppercase font-semibold">
              Narrative Exploration
            </div>
          </div>

          {/* Principle 02 */}
          <div className="border border-[#E8DAC9] bg-white p-6 sm:p-7 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A1026] font-bold block">
                02 · LIVING CITY BALANCE
              </span>
              <h3 className="font-heading font-black text-lg text-[#1C1440]">
                Footsteps Naturally Diverted
              </h3>
              <p className="text-xs sm:text-sm text-[#1C1440]/75 font-serif leading-relaxed">
                When a monument choke point swells, RAAHI dynamically reveals a quiet artisan trail with boosted wayfarer tokens.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8DAC9] text-[10px] font-mono text-[#7A1026] uppercase font-semibold">
              Subtle Crowd Balancing
            </div>
          </div>

          {/* Principle 03 */}
          <div className="border border-[#E8DAC9] bg-white p-6 sm:p-7 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A1026] font-bold block">
                03 · HUMAN ENCOUNTER
              </span>
              <h3 className="font-heading font-black text-lg text-[#1C1440]">
                Direct Spend to Generational Makers
              </h3>
              <p className="text-xs sm:text-sm text-[#1C1440]/75 font-serif leading-relaxed">
                Meet 3rd-generation woodblock printers, clay kulhad potters, and weavers. 100% of rewards flow directly to local families.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8DAC9] text-[10px] font-mono text-[#7A1026] uppercase font-semibold">
              Zero Aggregator Markups
            </div>
          </div>
        </div>

        {/* Quiet Editorial Callout & Explore Invitation */}
        <div className="border-2 border-[#1C1440] bg-[#FFFDF9] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[4px_4px_0px_#1C1440]">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#7A1026] font-bold block">
              EXPERIENCE RAAHI NOW
            </span>
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#1C1440]">
              Ready to leave the tourist trail behind?
            </h3>
            <p className="font-serif italic text-sm text-[#1C1440]/80">
              Enter the product to choose your destination, receive your first clue, and meet the makers.
            </p>
          </div>

          <button
            onClick={handleExplore}
            className="bg-[#7A1026] hover:bg-[#9C1A35] active:scale-98 text-[#FFD38A] font-heading font-black text-sm px-9 py-4 rounded-sm border border-[#450915] flex items-center gap-3 transition-all cursor-pointer shadow-sm shrink-0 uppercase tracking-wider"
          >
            <span>EXPLORE RAAHI</span>
            <Compass className="w-5 h-5 text-[#FFD38A]" />
          </button>
        </div>
      </div>
    </section>
  );
}
