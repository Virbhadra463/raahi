import React, { useState } from 'react';
import { MapPin, Clock, Award, Compass, ShoppingBag, Plus, Check, X, ArrowRight } from 'lucide-react';
import { LocalMaker, CulturalAccessory } from '../../data/culturalFashionData';

interface LocalMakerModalProps {
  isOpen: boolean;
  maker: LocalMaker | null;
  accessory: CulturalAccessory | null;
  onClose: () => void;
  onAddToJourney: (maker: LocalMaker) => void;
  isAddedToJourney: boolean;
}

export const LocalMakerModal: React.FC<LocalMakerModalProps> = ({
  isOpen,
  maker,
  accessory,
  onClose,
  onAddToJourney,
  isAddedToJourney,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'directions'>('details');

  if (!isOpen || !maker || !accessory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E0924]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#FFFDF9] text-[#1C1440] rounded-3xl p-6 sm:p-9 shadow-2xl border-2 border-[#1C1440] relative overflow-hidden max-h-[92vh] overflow-y-auto"
        style={{ boxShadow: '0 25px 60px -15px rgba(28, 20, 64, 0.45)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#1C1440]/5 hover:bg-[#1C1440]/10 flex items-center justify-center text-[#1C1440] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Culture -> Craft -> Maker Lineage Breadcrumb */}
        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#7A1026] mb-3 bg-[#7A1026]/10 px-3 py-1 rounded-full border border-[#7A1026]/20">
          <span>{maker.state}</span>
          <span>&rarr;</span>
          <span>{accessory.name}</span>
          <span>&rarr;</span>
          <span>VERIFIED LOCAL MAKER</span>
        </div>

        {/* Artisan & Business Heading */}
        <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#1C1440] leading-tight">
          {maker.name}
        </h2>
        <p className="text-xs sm:text-sm font-bold text-[#7A1026] mt-1 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 shrink-0 text-[#C98A2E]" />
          <span>{maker.artisanTitle}</span>
        </p>

        {/* Location & Map Coordinates Bar */}
        <div className="bg-[#FAF5EE] rounded-2xl p-4 border border-[#E8DAC9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#7A1026] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#1C1440]">{maker.address}</p>
              <p className="text-[11px] font-mono text-[#1C1440]/60 mt-0.5">{maker.coordinates}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1C1440]/75 bg-white px-3 py-1 rounded-lg border border-[#E8DAC9] shrink-0 self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-[#C98A2E]" />
            <span>{maker.visitingHours}</span>
          </div>
        </div>

        {/* Story Snippet in Kalam Handwriting Font */}
        <div className="bg-[#FFF9F3] border-l-4 border-[#7A1026] p-4 rounded-r-2xl mb-6 shadow-xs">
          <p className="font-handwriting font-bold text-sm sm:text-base text-[#1C1440] leading-relaxed">
            {maker.storySnippet}
          </p>
        </div>

        {/* Detailed Artisan Craft Note */}
        <div className="space-y-3 mb-6 text-xs sm:text-sm text-[#1C1440]/85 font-medium leading-relaxed">
          <p>{maker.description}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-bold text-[#1C1440]/60">Preserving:</span>
            <span className="font-bold text-[#7A1026] bg-[#7A1026]/10 px-2.5 py-0.5 rounded-md">
              {maker.craft}
            </span>
            <span className="text-[#1C1440]/40">•</span>
            <span className="font-mono text-[11px] text-[#1C1440]/70 font-semibold">
              {maker.heritageYears}
            </span>
          </div>
        </div>

        {/* Walk / Visit Street Clue Drawer */}
        {activeTab === 'directions' && (
          <div className="p-4 rounded-2xl bg-[#0E0924] text-[#FDF3EA] mb-6 space-y-2 border border-[#FFD38A]/40 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-mono text-[#FFD38A]">
              <span>RAAHI STREET NAVIGATION CLUE</span>
              <span>100% DIRECT VISIT</span>
            </div>
            <p className="font-handwriting font-bold text-sm sm:text-base text-white">
              "Walk into {maker.location}. Ask the chai stall owner near the arched threshold for {maker.name}. No touts, no tourist surcharge — mention you are travelling on the Raahi trail."
            </p>
          </div>
        )}

        {/* The 3 Core Actions: VISIT, SHOP, ADD TO JOURNEY */}
        <div className="pt-4 border-t-2 border-[#1C1440]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'directions' ? 'details' : 'directions')}
              className={`px-4 py-2.5 rounded-full text-xs font-heading font-black border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'directions'
                  ? 'bg-[#1C1440] text-[#FFD38A] border-[#1C1440]'
                  : 'bg-white hover:bg-zinc-100 text-[#1C1440] border-[#1C1440]/30'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{activeTab === 'directions' ? 'Hide Clue' : 'VISIT'}</span>
            </button>

            <button
              onClick={() => {
                alert(`Redirecting to direct verified artisan contact: ${maker.name} (${maker.location})`);
              }}
              className="px-4 py-2.5 rounded-full text-xs font-heading font-black border-2 border-[#1C1440]/30 bg-white hover:bg-zinc-100 text-[#1C1440] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>SHOP</span>
            </button>
          </div>

          <button
            onClick={() => onAddToJourney(maker)}
            className={`px-6 py-3 rounded-full text-xs sm:text-sm font-heading font-black shadow-signboard transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isAddedToJourney
                ? 'bg-emerald-700 text-white border-2 border-emerald-900'
                : 'bg-marigold hover:bg-amber-300 text-signboard-navy border-2 border-signboard-navy active:scale-95'
            }`}
          >
            {isAddedToJourney ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>ADDED TO JOURNEY</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>ADD TO JOURNEY</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
