import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, MapPin, CheckCircle, Info } from 'lucide-react';
import { CULTURAL_FASHION_DATA, CulturalAccessory, LocalMaker } from '../../data/culturalFashionData';
import { ThreeCulturalCharacter } from './ThreeCulturalCharacter';
import { LocalMakerModal } from './LocalMakerModal';

interface CulturalFashionExperienceModalProps {
  isOpen: boolean;
  initialStateId?: string;
  onClose: () => void;
  onJourneyUpdated?: (maker: LocalMaker) => void;
}

export const CulturalFashionExperienceModal: React.FC<CulturalFashionExperienceModalProps> = ({
  isOpen,
  initialStateId = 'rajasthan',
  onClose,
  onJourneyUpdated,
}) => {
  const [activeStateId, setActiveStateId] = useState<string>(initialStateId);
  const [selectedAccessoryId, setSelectedAccessoryId] = useState<string | null>(null);
  const [activeMaker, setActiveMaker] = useState<LocalMaker | null>(null);
  const [activeAccessoryForMaker, setActiveAccessoryForMaker] = useState<CulturalAccessory | null>(null);
  const [journeyMakers, setJourneyMakers] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync initial state if modal opens
  React.useEffect(() => {
    if (initialStateId && CULTURAL_FASHION_DATA[initialStateId]) {
      setActiveStateId(initialStateId);
      setSelectedAccessoryId(CULTURAL_FASHION_DATA[initialStateId].accessories[0]?.id || null);
    }
  }, [initialStateId, isOpen]);

  const currentState = CULTURAL_FASHION_DATA[activeStateId] || CULTURAL_FASHION_DATA['rajasthan'];

  // Default to first accessory if none selected
  const activeAccessory =
    currentState.accessories.find((a) => a.id === selectedAccessoryId) ||
    currentState.accessories[0];

  const handleSelectState = (stateId: string) => {
    setActiveStateId(stateId);
    const newState = CULTURAL_FASHION_DATA[stateId];
    if (newState && newState.accessories.length > 0) {
      setSelectedAccessoryId(newState.accessories[0].id);
    }
  };

  const handleOpenMaker = (acc: CulturalAccessory) => {
    setActiveAccessoryForMaker(acc);
    setActiveMaker(acc.maker);
  };

  const handleAddToJourney = (maker: LocalMaker) => {
    if (!journeyMakers.includes(maker.id)) {
      setJourneyMakers((prev) => [...prev, maker.id]);
      if (onJourneyUpdated) {
        onJourneyUpdated(maker);
      }
      setToastMessage(`✨ Added ${maker.name} to your Raahi Journey itinerary!`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0E0924] text-parchment animate-in fade-in duration-300">
      {/* Background warm subtle ambient wash */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#1C1440]/60 via-[#0E0924] to-[#0A0618] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8">
        
        {/* ================= TOP NAVIGATION BAR ================= */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-parchment/15">
          {/* Back button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs sm:text-sm font-heading font-black text-parchment/80 hover:text-marigold transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO LANDING</span>
          </button>

          {/* State Switcher Navigation */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {Object.values(CULTURAL_FASHION_DATA).map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectState(s.id)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activeStateId === s.id
                    ? 'bg-marigold text-signboard-navy shadow-signboard border border-signboard-navy'
                    : 'bg-white/5 hover:bg-white/10 text-parchment/70 hover:text-parchment border border-white/10'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Itinerary Counter */}
          <div className="text-[11px] font-mono font-bold text-marigold bg-[#1C1440] px-3 py-1.5 rounded-full border border-marigold/30 flex items-center gap-2 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{journeyMakers.length} MAKERS IN JOURNEY</span>
          </div>
        </header>

        {/* ================= MAIN EXPERIENCE SPLIT VIEW ================= */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6 sm:py-10">
          
          {/* LEFT / CENTER: Interactive 3D Character (Main Visual Focus) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center relative">
            
            {/* Header info */}
            <div className="mb-2">
              <div className="flex items-baseline gap-3">
                <h1 className="signboard-text text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide">
                  {currentState.name}
                </h1>
                <span className="text-marigold font-heading font-bold text-lg sm:text-xl">
                  {currentState.hindiName}
                </span>
              </div>
              <p className="font-handwriting font-bold text-marigold/90 text-base sm:text-lg mt-1">
                "{currentState.editorialQuote.replace('\n', ' ')}"
              </p>
              <p className="text-xs text-parchment/60 font-mono uppercase tracking-widest mt-1">
                {currentState.regionCraftNote}
              </p>
            </div>

            {/* The 3D Three.js Character Model Container */}
            <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] max-h-[640px] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent shadow-2xl flex items-center justify-center">
              <ThreeCulturalCharacter
                stateData={currentState}
                selectedAccessoryId={activeAccessory?.id || null}
                onSelectAccessory={(acc) => setSelectedAccessoryId(acc.id)}
              />
            </div>

            {/* Micro subtitle note */}
            <p className="text-[11px] font-serif italic text-parchment/50 text-center mt-3">
              "Refined collectible cultural figure · Mouse-reactive 3D viewpoint and regional plinth."
            </p>
          </div>

          {/* RIGHT COLUMN: "THE DETAILS" (Vertical Information Column) */}
          <div className="lg:col-span-5 xl:col-span-4 bg-[#1C1440]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-marigold/40 shadow-signboard flex flex-col justify-between self-stretch">
            
            <div>
              {/* Column Title */}
              <div className="pb-4 mb-6 border-b border-marigold/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-marigold font-bold block mb-1">
                    CRAFT ANATOMY
                  </span>
                  <h2 className="font-heading font-black text-2xl sm:text-3xl text-parchment tracking-tight">
                    THE DETAILS
                  </h2>
                </div>
                <Sparkles className="w-5 h-5 text-marigold" />
              </div>

              {/* Text-Based Interactive Hotspots List */}
              <div className="space-y-2 mb-6 max-h-[280px] overflow-y-auto pr-1">
                {currentState.accessories.map((acc) => {
                  const isSelected = activeAccessory?.id === acc.id;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => setSelectedAccessoryId(acc.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-marigold text-signboard-navy border-marigold shadow-md font-black translate-x-1'
                          : 'bg-white/5 hover:bg-white/10 text-parchment/80 border-white/10 font-bold'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-heading tracking-wide uppercase">
                        {acc.name}
                      </span>
                      <span
                        className={`text-[11px] font-medium ${
                          isSelected ? 'text-signboard-navy/80' : 'text-parchment/40'
                        }`}
                      >
                        {acc.localName}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Accessory Detailed Story Card */}
              {activeAccessory && (
                <motion.div
                  key={activeAccessory.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0E0924] rounded-2xl p-5 border border-marigold/30 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-marigold font-mono">
                    <span>{activeAccessory.localName}</span>
                    <span className="font-bold">INSPECTED</span>
                  </div>

                  <h3 className="font-heading font-black text-lg text-parchment">
                    {activeAccessory.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-parchment/80 font-medium leading-relaxed">
                    {activeAccessory.description}
                  </p>

                  <p className="font-serif italic text-xs text-parchment/65 border-t border-white/10 pt-2.5 leading-snug">
                    "{activeAccessory.culturalSignificance}"
                  </p>

                  {/* FIND THE MAKER Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenMaker(activeAccessory)}
                      className="w-full bg-marigold hover:bg-amber-300 active:scale-95 text-signboard-navy font-heading font-black text-xs sm:text-sm py-3 px-4 rounded-xl shadow-signboard flex items-center justify-center gap-2 cursor-pointer transition-transform border border-signboard-navy"
                    >
                      <span>FIND THE MAKER</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Cultural Footnote */}
            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-parchment/50 flex items-center justify-between">
              <span>AUTHENTIC LOCAL GUILDS</span>
              <span className="text-marigold">ZERO COMMISSIONS</span>
            </div>

          </div>

        </main>

        {/* ================= FOOTER BREADCRUMB ================= */}
        <footer className="pt-4 border-t border-parchment/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-parchment/60 font-mono">
          <div>
            CULTURE &rarr; CRAFT &rarr; MAKER &rarr; LOCAL BUSINESS &rarr; ADD TO JOURNEY
          </div>
          <div>
            © 2026 Raahi Cultural Archives · All traditional regional outfits verified with guild masters.
          </div>
        </footer>

      </div>

      {/* Local Business Connection Panel (Modal) */}
      <LocalMakerModal
        isOpen={activeMaker !== null}
        maker={activeMaker}
        accessory={activeAccessoryForMaker}
        onClose={() => setActiveMaker(null)}
        onAddToJourney={handleAddToJourney}
        isAddedToJourney={activeMaker ? journeyMakers.includes(activeMaker.id) : false}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-[#FDF6E9] text-[#120D31] px-6 py-4 rounded-2xl shadow-2xl border-2 border-[#7A1026] flex items-center gap-3 max-w-md"
          >
            <div className="w-8 h-8 rounded-full bg-[#7A1026] text-[#FFD38A] flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-bold leading-snug">
              {toastMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
