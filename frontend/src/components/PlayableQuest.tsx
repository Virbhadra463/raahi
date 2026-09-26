import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, MapPin, ArrowRight, Check, AlertTriangle, Sparkles, RefreshCw, Volume2, ShieldCheck, BookOpen } from 'lucide-react';
import { playClickSound, playCoinSound } from '../utils/audio';

interface PlayableQuestProps {
  onComplete: (earnedCoins: number, storyTitle: string) => void;
  onGoToJourney: () => void;
}

// 8 Interactive Moments:
// 1: ENTERING THE JOURNEY
// 2: THE STORY & CLUE 01
// 3: EXPLORATION MAP
// 4: THE CITY CHANGES (CROWD CHANGE & REROUTE)
// 5: USER DECISION (THREE DOORS)
// 6: LOCAL HUMAN DISCOVERY (YOU FOUND THE MAKER)
// 7: VERIFICATION (QUIET CONFIRMATION)
// 8: QUEST COMPLETE (STORY COMPLETE & NEXT CHAPTER)

export const PlayableQuest: React.FC<PlayableQuestProps> = ({ onComplete, onGoToJourney }) => {
  const [moment, setMoment] = useState<number>(1);
  const [chosenDoor, setChosenDoor] = useState<'red' | 'blue' | 'yellow' | null>(null);
  const [hasHeardStory, setHasHeardStory] = useState<boolean>(false);
  const [verifiedSteps, setVerifiedSteps] = useState({
    location: false,
    storyUnlocked: false,
    progress: false,
  });

  const nextMoment = () => {
    playClickSound();
    setMoment((prev) => Math.min(8, prev + 1));
  };

  const handleDoorSelect = (door: 'red' | 'blue' | 'yellow') => {
    playClickSound();
    setChosenDoor(door);
  };

  const handleVerifySequence = () => {
    playClickSound();
    setMoment(7);
    // Simulate quiet background verification
    setTimeout(() => {
      setVerifiedSteps((prev) => ({ ...prev, location: true }));
    }, 400);
    setTimeout(() => {
      setVerifiedSteps((prev) => ({ ...prev, storyUnlocked: true }));
    }, 900);
    setTimeout(() => {
      setVerifiedSteps((prev) => ({ ...prev, progress: true }));
    }, 1400);
    setTimeout(() => {
      playCoinSound();
      onComplete(50, "The Door That Isn't On The Map");
      setMoment(8);
    }, 2100);
  };

  const resetQuest = () => {
    playClickSound();
    setMoment(1);
    setChosenDoor(null);
    setHasHeardStory(false);
    setVerifiedSteps({ location: false, storyUnlocked: false, progress: false });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 text-[#1C1440]">
      {/* Chapter Indicator Bar */}
      <div className="flex items-center justify-between border-b border-[#E8DAC9] pb-4 mb-8 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7A1026]" />
          <span className="font-bold text-[#7A1026] uppercase tracking-widest">
            STORY QUEST · CHAPTER 01
          </span>
        </div>
        <div className="flex items-center gap-3 text-[#1C1440]/60">
          <span className="font-bold">MOMENT 0{moment} / 08</span>
          <button
            onClick={resetQuest}
            title="Restart quest"
            className="hover:text-[#7A1026] transition-colors cursor-pointer p-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ========================================================
            MOMENT 01: ENTERING THE JOURNEY
            Quiet transition into the RAAHI world
        ======================================================== */}
        {moment === 1 && (
          <motion.div
            key="moment-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="border border-[#E8DAC9] bg-white p-6 sm:p-10 relative overflow-hidden">
              {/* Destination Photo */}
              <div className="relative h-[340px] sm:h-[420px] w-full overflow-hidden bg-zinc-100 border border-[#E8DAC9]">
                <img
                  src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=80"
                  alt="Jaipur Old City Alley"
                  className="w-full h-full object-cover object-center filter contrast-[1.03] brightness-[0.96]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0924]/85 via-transparent to-black/20" />

                {/* Top Location Stamp */}
                <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 border border-[#1C1440]/20 text-[10px] font-mono tracking-widest text-[#1C1440] uppercase font-bold">
                  JAIPUR · 14 OCTOBER · 10:42 AM
                </div>

                {/* Handwritten Note in Kalam font */}
                <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-md bg-[#FAF5EE]/95 border border-[#C98A2E]/50 p-4 shadow-md rotate-[-0.5deg]">
                  <p className="font-handwriting font-bold text-base sm:text-lg text-[#1C1440] leading-snug">
                    "Let's take the road less travelled. The main fort road is already choked with tour buses."
                  </p>
                  <span className="block text-[10px] font-mono text-[#7A1026] mt-1 uppercase tracking-wider font-bold">
                    — Field Journal Entry #104
                  </span>
                </div>
              </div>

              {/* Invitation */}
              <div className="mt-8 pt-6 border-t border-[#E8DAC9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono tracking-[0.2em] text-[#7A1026] uppercase font-bold block mb-1">
                    YOUR STORY AWAITS.
                  </span>
                  <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#1C1440]">
                    The Door That Isn't On The Map
                  </h2>
                </div>

                <button
                  onClick={nextMoment}
                  className="bg-[#7A1026] hover:bg-[#9C1A35] active:scale-98 text-[#FFD38A] font-heading font-black text-sm px-9 py-4 rounded-sm border border-[#450915] flex items-center gap-3 transition-all cursor-pointer shadow-sm uppercase tracking-wider self-stretch sm:self-auto justify-center"
                >
                  <span>ENTER</span>
                  <ArrowRight className="w-4 h-4 text-[#FFD38A]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================
            MOMENT 02: THE STORY & CLUE 01
            Clean editorial spread, printed paper clue
        ======================================================== */}
        {moment === 2 && (
          <motion.div
            key="moment-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="border border-[#E8DAC9] bg-[#FAF5EE] p-8 sm:p-14 space-y-8 relative">
              {/* Paper Watermark Stamp */}
              <div className="absolute top-6 right-6 border border-[#C98A2E]/40 text-[#C98A2E] text-[10px] font-mono tracking-widest px-2.5 py-1 uppercase rotate-3 font-bold">
                RAAHI CLUE 01/03
              </div>

              {/* Headline & Story Prologue */}
              <div className="space-y-3 max-w-2xl">
                <span className="text-[11px] font-mono tracking-[0.25em] text-[#7A1026] uppercase font-bold block">
                  CHAPTER 01
                </span>
                <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#1C1440] leading-tight tracking-tight">
                  THE DOOR THAT ISN'T ON THE MAP
                </h1>
                <p className="font-serif text-lg sm:text-xl text-[#1C1440]/80 italic leading-relaxed pt-2">
                  "There is a doorway somewhere in the old city that most visitors walk straight past."
                </p>
              </div>

              {/* The Physical Paper Clue */}
              <div className="bg-white border-2 border-[#1C1440] p-6 sm:p-8 relative shadow-[4px_4px_0px_#1C1440] max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 bg-[#7A1026] rounded-full" />
                  <span className="text-xs font-mono uppercase tracking-widest text-[#7A1026] font-bold">
                    YOUR FIRST CLUE:
                  </span>
                </div>
                <blockquote className="font-serif font-bold text-xl sm:text-2xl text-[#1C1440] leading-snug">
                  "Find the shop where the same craft has been made for three generations."
                </blockquote>
                <div className="mt-4 pt-3 border-t border-[#E8DAC9] flex items-center justify-between text-xs font-handwriting text-[#1C1440]/70">
                  <span>~ Listen for the sound of teakwood blocks tapping</span>
                  <span className="font-mono text-[10px] text-[#7A1026] font-bold">Jaipur Walled City</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={nextMoment}
                  className="bg-[#7A1026] hover:bg-[#9C1A35] active:scale-98 text-white font-heading font-black text-sm px-8 py-4 rounded-sm border border-[#450915] flex items-center gap-3 transition-all cursor-pointer shadow-sm uppercase tracking-wider"
                >
                  <span>FOLLOW THE CLUE</span>
                  <ArrowRight className="w-4 h-4 text-[#FFD38A]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================
            MOMENT 03: MAP
            Transition from story into exploration
        ======================================================== */}
        {moment === 3 && (
          <motion.div
            key="moment-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="border border-[#E8DAC9] bg-white p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E8DAC9] pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A1026] font-bold">
                    MOMENT 03 · TRANSITION INTO EXPLORATION
                  </span>
                  <h3 className="font-heading font-black text-2xl text-[#1C1440]">
                    Old City Precinct Map
                  </h3>
                </div>
                <div className="text-xs font-handwriting text-[#7A1026] font-bold">
                  "Physical map inside your travel journal"
                </div>
              </div>

              {/* Tactile SVG Map */}
              <div className="relative bg-[#F7F2E7] border-2 border-[#1C1440] p-4 sm:p-6 overflow-hidden min-h-[360px] flex flex-col justify-between">
                {/* Background Grid Texture */}
                <div className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#1C1440 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Map Graphic (Street network) */}
                <svg className="w-full h-64 overflow-visible" viewBox="0 0 600 240">
                  {/* Street network paths */}
                  <line x1="50" y1="120" x2="550" y2="120" stroke="#E8DAC9" strokeWidth="14" strokeLinecap="round" />
                  <line x1="180" y1="30" x2="180" y2="210" stroke="#E8DAC9" strokeWidth="12" strokeLinecap="round" />
                  <line x1="380" y1="30" x2="380" y2="210" stroke="#E8DAC9" strokeWidth="10" strokeLinecap="round" />
                  <line x1="180" y1="120" x2="380" y2="50" stroke="#E8DAC9" strokeWidth="8" strokeLinecap="round" />

                  {/* Planned path in gold/maroon dashed */}
                  <path
                    d="M 100 120 L 180 120 L 260 85 L 380 50"
                    fill="none"
                    stroke="#7A1026"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                  />

                  {/* Landmark: Badi Chaupar */}
                  <rect x="35" y="90" width="80" height="30" fill="#FFF" stroke="#1C1440" strokeWidth="1.5" />
                  <text x="75" y="108" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1C1440">
                    Badi Chaupar
                  </text>

                  {/* Landmark: Brass Bazaar */}
                  <rect x="150" y="160" width="70" height="25" fill="#FFF" stroke="#1C1440" strokeWidth="1.5" />
                  <text x="185" y="176" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1C1440">
                    Brass Bazaar
                  </text>

                  {/* YOU ARE HERE Pin */}
                  <circle cx="100" cy="120" r="7" fill="#7A1026" stroke="#FFF" strokeWidth="2" />
                  <circle cx="100" cy="120" r="14" fill="none" stroke="#7A1026" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  <text x="100" y="145" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7A1026">
                    YOU ARE HERE
                  </text>

                  {/* Destination Clue Target Pin */}
                  <circle cx="380" cy="50" r="7" fill="#FFD38A" stroke="#1C1440" strokeWidth="2" />
                  <text x="380" y="35" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1C1440">
                    ? 3rd-Gen Shop
                  </text>
                </svg>

                {/* Handwritten Field Annotation */}
                <div className="bg-white/95 border border-[#C98A2E] p-3 max-w-sm rounded-sm text-xs font-handwriting space-y-0.5 mt-2 shadow-xs">
                  <p className="font-bold text-[#7A1026]">
                    "Smells like roasted cloves and wet sandstone. Turn past the blue archway."
                  </p>
                  <p className="text-[10px] text-[#1C1440]/60 font-mono">
                    Estimated 280 paces ahead · 4 minutes walk
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex justify-between items-center">
                <span className="text-xs text-[#1C1440]/60 font-serif italic">
                  Walking down Badi Chaupar toward the craft quarter...
                </span>
                <button
                  onClick={nextMoment}
                  className="bg-[#7A1026] hover:bg-[#9C1A35] active:scale-98 text-white font-heading font-black text-sm px-8 py-3.5 rounded-sm border border-[#450915] flex items-center gap-2.5 transition-all cursor-pointer uppercase tracking-wider shadow-sm"
                >
                  <span>WALK DOWN THE LANE</span>
                  <ArrowRight className="w-4 h-4 text-[#FFD38A]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================
            MOMENT 04: THE CITY CHANGES
            Crowd balancing in action without technical jargon
        ======================================================== */}
        {moment === 4 && (
          <motion.div
            key="moment-4"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="border-2 border-[#7A1026] bg-[#FAF5EE] p-6 sm:p-8 space-y-6">
              {/* Event Announcement */}
              <div className="flex items-center gap-3 bg-[#7A1026] text-[#FFD38A] p-4 rounded-sm">
                <AlertTriangle className="w-5 h-5 text-[#FFD38A] shrink-0" />
                <div className="leading-tight">
                  <span className="text-[10px] font-mono tracking-widest uppercase block text-white/80">
                    REAL-TIME OBSERVATION
                  </span>
                  <h3 className="font-heading font-black text-lg sm:text-xl text-[#FFD38A] uppercase tracking-wide">
                    THE CITY JUST CHANGED.
                  </h3>
                </div>
              </div>

              {/* Narrative explanation */}
              <div className="space-y-2">
                <p className="font-serif italic text-lg sm:text-xl text-[#1C1440] leading-relaxed">
                  "This road is filling up."
                </p>
                <p className="font-heading font-bold text-base text-[#7A1026]">
                  RAAHI found another way.
                </p>
              </div>

              {/* Map Showing Crowd Congestion vs Hidden Artisan Lane */}
              <div className="relative bg-[#F7F2E7] border border-[#1C1440] p-4 overflow-hidden rounded-sm">
                <svg className="w-full h-56" viewBox="0 0 600 220">
                  {/* Choked Main Road (in Red) */}
                  <line x1="80" y1="70" x2="480" y2="70" stroke="#E85B70" strokeWidth="16" strokeLinecap="round" opacity="0.4" />
                  <text x="280" y="55" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#9C1A35">
                    ⚠ ROAD FILLING UP (Heavy Bottleneck)
                  </text>

                  {/* Secret Alternative Path (Artisan Lane in Emerald) */}
                  <path
                    d="M 80 70 L 160 150 L 340 160 L 440 90 L 480 70"
                    fill="none"
                    stroke="#1A6B5E"
                    strokeWidth="4"
                    strokeDasharray="6 3"
                  />

                  <circle cx="80" cy="70" r="7" fill="#7A1026" stroke="#FFF" strokeWidth="2" />
                  <text x="80" y="95" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1C1440">
                    You
                  </text>

                  {/* Hidden Artisan Alley Marker */}
                  <rect x="220" y="145" width="140" height="28" fill="#FFF" stroke="#1A6B5E" strokeWidth="1.5" />
                  <text x="290" y="163" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1A6B5E">
                    ★ THE ARTISAN LANE
                  </text>
                </svg>

                {/* Reward Incentive Card */}
                <div className="absolute bottom-3 right-3 bg-white border border-[#1A6B5E] p-3 text-xs shadow-sm">
                  <span className="text-[10px] font-mono text-[#1A6B5E] font-bold block uppercase">
                    Off-Peak Diversion
                  </span>
                  <span className="font-heading font-black text-[#1C1440] block">
                    THE ARTISAN LANE
                  </span>
                  <span className="text-[#C98A2E] font-black text-xs">
                    +30 RAAHI
                  </span>
                </div>
              </div>

              {/* Reroute Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-xs font-handwriting text-[#1C1440]/80">
                  "There's something worth finding here."
                </p>

                <button
                  onClick={nextMoment}
                  className="bg-[#1A6B5E] hover:bg-[#135046] active:scale-98 text-white font-heading font-black text-sm px-8 py-3.5 rounded-sm border border-[#0D3830] flex items-center gap-2.5 transition-all cursor-pointer uppercase tracking-wider shadow-sm"
                >
                  <span>TAKE THE OTHER ROAD</span>
                  <ArrowRight className="w-4 h-4 text-[#FFD38A]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================
            MOMENT 05: USER DECISION
            Three architectural doors: RED, BLUE, YELLOW
        ======================================================== */}
        {moment === 5 && (
          <motion.div
            key="moment-5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="border border-[#E8DAC9] bg-white p-6 sm:p-10 space-y-6">
              <div>
                <span className="text-[11px] font-mono tracking-[0.2em] text-[#7A1026] uppercase font-bold block mb-1">
                  MOMENT 05 · A MEANINGFUL CHOICE
                </span>
                <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#1C1440]">
                  Three doors.
                </h2>
                <p className="font-serif italic text-base sm:text-lg text-[#1C1440]/80 mt-1">
                  "Which one belongs to the story?"
                </p>
              </div>

              {/* Three Distinct Doors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Red Door */}
                <div
                  onClick={() => handleDoorSelect('red')}
                  className={`border-2 p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-between ${
                    chosenDoor === 'red'
                      ? 'border-[#9C1A35] bg-[#FFF5F5] ring-2 ring-[#9C1A35] shadow-md'
                      : 'border-[#E8DAC9] bg-[#FAF5EE] hover:border-[#9C1A35]'
                  }`}
                >
                  <div className="w-16 h-28 bg-[#7A1026] border-2 border-[#450915] rounded-t-sm mb-3 shadow-inner flex flex-col justify-between py-2 items-center">
                    <div className="w-4 h-4 rounded-full border border-[#FFD38A]/50 mt-2" />
                    <div className="w-2 h-2 rounded-full bg-[#FFD38A]" />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-base text-[#7A1026] uppercase">
                      RED
                    </h4>
                    <p className="text-[11px] text-[#1C1440]/70 font-serif mt-1">
                      Carved teakwood with brass studs.
                    </p>
                  </div>
                </div>

                {/* Blue Door */}
                <div
                  onClick={() => handleDoorSelect('blue')}
                  className={`border-2 p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-between ${
                    chosenDoor === 'blue'
                      ? 'border-[#1A6B5E] bg-[#F0F7F6] ring-2 ring-[#1A6B5E] shadow-md'
                      : 'border-[#E8DAC9] bg-[#FAF5EE] hover:border-[#1A6B5E]'
                  }`}
                >
                  <div className="w-16 h-28 bg-[#1A6B5E] border-2 border-[#0E4239] rounded-t-sm mb-3 shadow-inner flex flex-col justify-between py-2 items-center">
                    <div className="w-4 h-4 rounded-full border border-[#FFD38A]/50 mt-2" />
                    <div className="w-2 h-2 rounded-full bg-[#FFD38A]" />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-base text-[#1A6B5E] uppercase">
                      BLUE
                    </h4>
                    <p className="text-[11px] text-[#1C1440]/70 font-serif mt-1">
                      Weathered indigo archway with dry marigolds.
                    </p>
                  </div>
                </div>

                {/* Yellow Door */}
                <div
                  onClick={() => handleDoorSelect('yellow')}
                  className={`border-2 p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-between ${
                    chosenDoor === 'yellow'
                      ? 'border-[#C98A2E] bg-[#FFFBF0] ring-2 ring-[#C98A2E] shadow-md'
                      : 'border-[#E8DAC9] bg-[#FAF5EE] hover:border-[#C98A2E]'
                  }`}
                >
                  <div className="w-16 h-28 bg-[#E5A532] border-2 border-[#8C6218] rounded-t-sm mb-3 shadow-inner flex flex-col justify-between py-2 items-center">
                    <div className="w-4 h-4 rounded-full border border-[#1C1440]/50 mt-2" />
                    <div className="w-2 h-2 rounded-full bg-[#1C1440]" />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-base text-[#C98A2E] uppercase">
                      YELLOW
                    </h4>
                    <p className="text-[11px] text-[#1C1440]/70 font-serif mt-1">
                      Sun-bleached sandstone with terracotta urns.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Reaction Based on Choice */}
              {chosenDoor && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 border border-[#1C1440] bg-[#FAF5EE] text-[#1C1440] space-y-2"
                >
                  {chosenDoor === 'blue' && (
                    <>
                      <span className="text-[10px] font-mono uppercase text-[#1A6B5E] font-bold block">
                        YOUR INSTINCT WAS RIGHT.
                      </span>
                      <p className="font-serif italic text-base leading-relaxed">
                        "You've unlocked the Weaver's Trail. Behind the indigo arch, the rhythmic tap-tap of a rosewood carver echoes through the stone courtyard."
                      </p>
                    </>
                  )}
                  {chosenDoor === 'red' && (
                    <>
                      <span className="text-[10px] font-mono uppercase text-[#7A1026] font-bold block">
                        NOT THIS ONE.
                      </span>
                      <p className="font-serif italic text-base leading-relaxed">
                        "But you noticed something else... An old grain merchant looks up from his ledgers and smiles: 'Looking for Ramdas, the block printer? Go three steps past the blue archway on your left.'"
                      </p>
                    </>
                  )}
                  {chosenDoor === 'yellow' && (
                    <>
                      <span className="text-[10px] font-mono uppercase text-[#C98A2E] font-bold block">
                        NOT THIS ONE.
                      </span>
                      <p className="font-serif italic text-base leading-relaxed">
                        "But you noticed something else... Freshly ground cinnamon floats into the alley. The merchant hands you a cardamom seed: 'The wood carver is just across through the indigo door.'"
                      </p>
                    </>
                  )}
                </motion.div>
              )}

              {/* Action */}
              <div className="pt-2 flex justify-end">
                <button
                  disabled={!chosenDoor}
                  onClick={nextMoment}
                  className={`font-heading font-black text-sm px-8 py-3.5 rounded-sm border uppercase tracking-wider transition-all flex items-center gap-2 ${
                    chosenDoor
                      ? 'bg-[#7A1026] hover:bg-[#9C1A35] text-[#FFD38A] border-[#450915] cursor-pointer shadow-sm'
                      : 'bg-zinc-200 text-zinc-400 border-zinc-300 cursor-not-allowed'
                  }`}
                >
                  <span>STEP INSIDE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================
            MOMENT 06: LOCAL HUMAN DISCOVERY
            Authentic portrait of Master Ramdas (the turbaned artisan!)
        ======================================================== */}
        {moment === 6 && (
          <motion.div
            key="moment-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="border border-[#E8DAC9] bg-white p-6 sm:p-10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* Large Artisan Portrait */}
                <div className="sm:col-span-5 relative h-80 sm:h-96 overflow-hidden bg-zinc-100 border-2 border-[#1C1440]">
                  <img
                    src="/master-ramdas.jpg"
                    alt="Master Ramdas"
                    className="w-full h-full object-cover object-center filter contrast-[1.05]"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#7A1026] text-white text-[9px] font-mono uppercase px-2 py-0.5 tracking-widest font-bold">
                    3RD GENERATION ARTISAN
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-white/95 p-2 text-center border border-[#1C1440]/20">
                    <p className="font-heading font-bold text-sm text-[#1C1440]">
                      Master Ramdas Prajapati
                    </p>
                    <p className="text-[10px] text-[#7A1026] font-mono font-bold">
                      Hand-Carved Teakwood Blocks · 42 Years
                    </p>
                  </div>
                </div>

                {/* Story Prompt */}
                <div className="sm:col-span-7 space-y-5">
                  <div>
                    <span className="text-[11px] font-mono tracking-[0.2em] text-[#7A1026] uppercase font-bold block mb-1">
                      MOMENT 06 · HUMAN DISCOVERY
                    </span>
                    <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#1C1440]">
                      YOU FOUND THE MAKER.
                    </h2>
                  </div>

                  <p className="font-serif italic text-base text-[#1C1440]/80 leading-relaxed">
                    "Before you continue, ask them one question:"
                  </p>

                  <div className="bg-[#FAF5EE] border-l-4 border-[#7A1026] p-4">
                    <p className="font-serif font-bold text-xl text-[#7A1026]">
                      "Who taught you this craft?"
                    </p>
                  </div>

                  {!hasHeardStory ? (
                    <button
                      onClick={() => {
                        playClickSound();
                        setHasHeardStory(true);
                      }}
                      className="bg-[#7A1026] hover:bg-[#9C1A35] text-[#FFD38A] font-heading font-black text-xs px-6 py-3.5 rounded-sm border border-[#450915] flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                    >
                      <span>I HEARD THE STORY</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pt-1"
                    >
                      {/* Story Fragment Unlocked Card */}
                      <div className="border border-[#C98A2E] bg-[#FFFBF0] p-4 text-xs font-serif leading-relaxed text-[#1C1440]">
                        <span className="font-mono text-[9px] text-[#C98A2E] uppercase tracking-widest font-bold block mb-1">
                          STORY FRAGMENT FOUND · CLUE 02 / 03
                        </span>
                        <p className="italic font-medium text-sm sm:text-base">
                          "'My grandfather sat on this very neem-wood bench in 1948. He told me: the wood remembers the tree, and the dye remembers the river.' His answer points toward a lane behind the old market..."
                        </p>
                      </div>

                      <button
                        onClick={handleVerifySequence}
                        className="bg-[#1A6B5E] hover:bg-[#135046] text-white font-heading font-black text-xs px-7 py-3.5 rounded-sm border border-[#0D3830] flex items-center gap-2 uppercase tracking-wider cursor-pointer shadow-sm"
                      >
                        <span>CONTINUE</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#FFD38A]" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================
            MOMENT 07: VERIFICATION
            Simulate real-world verification subtly behind the scenes
        ======================================================== */}
        {moment === 7 && (
          <motion.div
            key="moment-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border border-[#E8DAC9] bg-white p-10 sm:p-14 text-center space-y-6 max-w-lg mx-auto"
          >
            <div className="w-12 h-12 rounded-full border-2 border-[#7A1026] text-[#7A1026] mx-auto flex items-center justify-center animate-spin">
              <Compass className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-black text-2xl text-[#1C1440]">
                Recording Your Footsteps...
              </h3>
              <p className="font-serif italic text-xs text-[#1C1440]/60">
                Quietly confirming your presence in the old alley
              </p>
            </div>

            <div className="space-y-2.5 text-left bg-[#FAF5EE] p-5 border border-[#E8DAC9] text-xs font-mono">
              <div className={`flex items-center gap-2.5 transition-opacity ${verifiedSteps.location ? 'opacity-100 text-emerald-800 font-bold' : 'opacity-40'}`}>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>✓ PLACE DISCOVERED</span>
              </div>
              <div className={`flex items-center gap-2.5 transition-opacity ${verifiedSteps.storyUnlocked ? 'opacity-100 text-emerald-800 font-bold' : 'opacity-40'}`}>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>✓ STORY UNLOCKED</span>
              </div>
              <div className={`flex items-center gap-2.5 transition-opacity ${verifiedSteps.progress ? 'opacity-100 text-emerald-800 font-bold' : 'opacity-40'}`}>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>✓ MEMORY INSCRIBED IN TRAVEL JOURNAL</span>
              </div>
            </div>

            <p className="text-xs font-handwriting text-[#7A1026] font-bold">
              "RAAHI knows you were here."
            </p>
          </motion.div>
        )}

        {/* ========================================================
            MOMENT 08: QUEST COMPLETE
            Story Complete, travel stamp, next chapter opens
        ======================================================== */}
        {moment === 8 && (
          <motion.div
            key="moment-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="border-2 border-[#1C1440] bg-[#FAF5EE] p-8 sm:p-12 space-y-8 relative overflow-hidden shadow-[6px_6px_0px_#1C1440]">
              {/* Top Travel Stamp */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8DAC9] pb-6">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#7A1026] uppercase font-bold block mb-1">
                    STORY COMPLETE
                  </span>
                  <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#1C1440]">
                    THE DOOR THAT ISN'T ON THE MAP
                  </h1>
                </div>

                {/* Inked Travel Stamp */}
                <div className="border-2 border-[#7A1026] text-[#7A1026] p-3.5 text-center uppercase tracking-widest font-mono text-[9px] rotate-2 bg-white/70 shadow-xs">
                  <div className="font-black text-xs">RAAHI VERIFIED</div>
                  <div>JAIPUR HERITAGE</div>
                  <div className="text-emerald-800 font-black">+50 RAAHI</div>
                </div>
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold text-[#1C1440]">
                <div className="bg-white p-3.5 border border-[#E8DAC9] flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                  <span>Hidden location discovered</span>
                </div>
                <div className="bg-white p-3.5 border border-[#E8DAC9] flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                  <span>Local story unlocked</span>
                </div>
                <div className="bg-white p-3.5 border border-[#E8DAC9] flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                  <span>Local experience completed</span>
                </div>
              </div>

              {/* Next Chapter Card */}
              <div className="bg-white border-l-4 border-[#C98A2E] p-6 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C98A2E] font-bold block">
                  ONE STORY ENDS. ANOTHER ONE JUST OPENED.
                </span>
                <span className="text-xs font-mono text-[#7A1026] font-bold block">
                  NEXT CHAPTER
                </span>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-[#1C1440]">
                  THE PLACE BEHIND THE STORY
                </h3>
                <p className="font-serif italic text-sm text-[#1C1440]/80">
                  "Master Ramdas gave you a stamped parchment that points toward the indigo dyeing terrace behind the temple."
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={onGoToJourney}
                  className="w-full sm:w-auto bg-[#7A1026] hover:bg-[#9C1A35] text-[#FFD38A] font-heading font-black text-xs px-8 py-4 rounded-sm border border-[#450915] flex items-center justify-center gap-3 uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  <span>CONTINUE &amp; VIEW MEMORY</span>
                  <ArrowRight className="w-4 h-4 text-[#FFD38A]" />
                </button>

                <button
                  onClick={resetQuest}
                  className="w-full sm:w-auto bg-white hover:bg-zinc-100 text-[#1C1440] font-heading font-black text-xs px-6 py-4 rounded-sm border border-[#E8DAC9] flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                >
                  <span>REPLAY CHAPTER</span>
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
