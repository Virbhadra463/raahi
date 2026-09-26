import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, CheckCircle2, X } from 'lucide-react';

interface JourneyBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (customPrompt?: string) => void;
}

export const JourneyBuilderModal: React.FC<JourneyBuilderModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [duration, setDuration] = useState('3-day');
  const [pace, setPace] = useState('Balanced');
  const [interests, setInterests] = useState<string[]>([
    'Crafts & artisans',
    'Street food',
  ]);
  const [group, setGroup] = useState('Solo');
  const [budget, setBudget] = useState('Mid-range');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const toggleInterest = (val: string) => {
    setInterests((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  };

  const handleStartBuilding = () => {
    setIsGenerating(true);
    setGenerationStep(0);
  };

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < 3) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            const prompt = `Plan a ${duration} trip in Maharashtra for a ${group} traveler with ${pace} pace, focusing on ${interests.join(', ')} with a ${budget} budget. Include itinerary, stays, top attractions, and local food.`;
            onComplete(prompt);
          }, 800);
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isGenerating, onComplete, duration, group, pace, interests, budget]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E0924]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#FDF6E9] text-[#120D31] rounded-3xl p-6 sm:p-9 shadow-2xl border-2 border-[#120D31] relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        {!isGenerating && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#120D31]/5 hover:bg-[#120D31]/10 flex items-center justify-center text-[#120D31] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {!isGenerating ? (
          <div>
            {/* Tag */}
            <span className="inline-block text-[10px] font-extrabold tracking-wider px-3.5 py-1 rounded-full bg-[#7D1921]/10 text-[#7D1921] uppercase mb-2">
              PERSONALIZE YOUR TRAIL
            </span>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#120D31] tracking-tight">
              Tell Raahi how you want to explore
            </h2>
            <p className="text-xs sm:text-sm text-[#120D31]/65 mt-1.5 mb-7 font-medium leading-relaxed">
              Answer a few quick questions and Raahi will design a route around them — not the other way around.
            </p>

            <div className="space-y-6">
              {/* Question 1: Duration */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-[#120D31] block mb-2.5">
                  How much time do you have?
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Half day · ~3 hrs', 'Full day · 6–8 hrs', 'Multi-day trail'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full border-2 transition-all cursor-pointer ${
                        duration === d
                          ? 'bg-[#120D31] text-[#F9D48B] border-[#120D31] shadow-sm'
                          : 'bg-[#120D31]/4 text-[#120D31] border-[#120D31]/15 hover:border-[#120D31]/30'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Pace */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-[#120D31] block mb-2.5">
                  Pick your pace
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Relaxed', 'Balanced', 'Packed'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPace(p)}
                      className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full border-2 transition-all cursor-pointer ${
                        pace === p
                          ? 'bg-[#120D31] text-[#F9D48B] border-[#120D31] shadow-sm'
                          : 'bg-[#120D31]/4 text-[#120D31] border-[#120D31]/15 hover:border-[#120D31]/30'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Interests */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-[#120D31] block mb-1">
                  What pulls you in? <span className="font-semibold text-xs text-[#120D31]/50 normal-case">(pick a few)</span>
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    'Crafts & artisans',
                    'Street food',
                    'Folklore & stories',
                    'Architecture',
                    'Night markets',
                    'Spiritual sites',
                    'Photography spots',
                  ].map((item) => {
                    const selected = interests.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full border-2 transition-all cursor-pointer ${
                          selected
                            ? 'bg-[#120D31] text-[#F9D48B] border-[#120D31] shadow-sm'
                            : 'bg-[#120D31]/4 text-[#120D31] border-[#120D31]/15 hover:border-[#120D31]/30'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 4: Travel Group */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-[#120D31] block mb-2.5">
                  Who's coming along?
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Solo', 'Couple', 'Family', 'Friends'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGroup(g)}
                      className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full border-2 transition-all cursor-pointer ${
                        group === g
                          ? 'bg-[#120D31] text-[#F9D48B] border-[#120D31] shadow-sm'
                          : 'bg-[#120D31]/4 text-[#120D31] border-[#120D31]/15 hover:border-[#120D31]/30'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 5: Budget */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-[#120D31] block mb-2.5">
                  Budget style
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Budget', 'Mid-range', 'Premium'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudget(b)}
                      className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full border-2 transition-all cursor-pointer ${
                        budget === b
                          ? 'bg-[#120D31] text-[#F9D48B] border-[#120D31] shadow-sm'
                          : 'bg-[#120D31]/4 text-[#120D31] border-[#120D31]/15 hover:border-[#120D31]/30'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-6 border-t-2 border-[#120D31]/10">
              <button
                type="button"
                onClick={handleStartBuilding}
                className="w-full bg-[#F9D48B] hover:bg-[#fedd9b] active:scale-[0.98] text-[#171009] font-heading font-black py-4 rounded-2xl text-base transition-transform shadow-signboard flex items-center justify-center gap-2 cursor-pointer border-2 border-[#120D31]"
              >
                <span>Build My Journey</span>
                <Sparkles className="w-5 h-5 text-[#7D1921]" />
              </button>
            </div>
          </div>
        ) : (
          /* Generating State */
          <div className="py-10 px-2 flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#7D1921]/40 animate-spin" style={{ animationDuration: '6s' }} />
              <Compass className="w-12 h-12 text-[#7D1921] animate-pulse" />
            </div>

            <p className="font-heading font-black uppercase tracking-[0.25em] text-xs text-[#7D1921] mb-2">
              Crafting Your Trail
            </p>
            <h3 className="text-2xl font-black text-[#120D31] mb-8 leading-snug max-w-sm">
              Matching your answers to real streets and artisans
            </h3>

            <div className="w-full max-w-sm space-y-3 text-left">
              {[
                'Reading your pace & interests',
                'Mapping quiet stepwells & alleys',
                'Balancing live crowd levels',
                'Reserving artisan slots',
              ].map((stepText, idx) => {
                const isPassed = generationStep >= idx;
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all duration-300 ${
                      isPassed
                        ? 'bg-white border-[#7D1921]/30 opacity-100 shadow-sm'
                        : 'bg-white/40 border-transparent opacity-30'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 shrink-0 ${
                        isPassed ? 'text-[#7D1921]' : 'text-zinc-400'
                      }`}
                    />
                    <span className="text-xs sm:text-sm font-bold text-[#120D31]">
                      {stepText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
