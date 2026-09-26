import React from 'react';
import { Compass, BookOpen, Lock, Sparkles, ArrowRight, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface QuestsViewProps {
  onResumeStory: () => void;
}

export const QuestsView: React.FC<QuestsViewProps> = ({ onResumeStory }) => {
  const handleResume = () => {
    playClickSound();
    onResumeStory();
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-12 text-[#1C1440]">
      {/* Editorial Header */}
      <div className="border-b border-[#E8DAC9] pb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#7A1026] uppercase font-bold block mb-1">
            THE NARRATIVE CORRIDOR
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#1C1440]">
            The Quests of Raahi
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-[#1C1440]/75 mt-1 max-w-xl">
            "A quest is not a chore to complete. It is a story you step inside with your own two feet."
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FAF5EE] border border-[#E8DAC9] px-3.5 py-2 text-xs font-mono font-bold text-[#7A1026]">
          <BookOpen className="w-4 h-4" />
          <span>ONE ACTIVE STORY</span>
        </div>
      </div>

      {/* THE ONE ACTIVE STORY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-mono tracking-widest text-[#7A1026] font-bold">
            ACTIVE NARRATIVE IN PROGRESS
          </span>
          <span className="text-xs font-mono text-[#1C1440]/60 font-semibold">
            Jaipur Walled City · Sector 4
          </span>
        </div>

        <div className="border-2 border-[#1C1440] bg-[#FFFDF9] p-6 sm:p-10 shadow-[6px_6px_0px_#1C1440] relative overflow-hidden">
          {/* Subtle Watermark Stamp */}
          <div className="absolute top-6 right-6 border border-[#7A1026]/40 text-[#7A1026] text-[9px] font-mono tracking-widest px-2 py-0.5 uppercase hidden sm:block">
            IN PROGRESS · CHAPTER 01
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Story Image */}
            <div className="lg:col-span-5 relative h-64 sm:h-72 overflow-hidden border-2 border-[#1C1440] bg-zinc-100">
              <img
                src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80"
                alt="Jaipur Alley"
                className="w-full h-full object-cover filter contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1440]/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFD38A] block">
                  Current Waypoint
                </span>
                <p className="font-heading font-black text-lg leading-tight">
                  Ghee Walon Ka Rasta
                </p>
              </div>
            </div>

            {/* Right: Narrative Details & Progress Bar */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A1026] font-bold block mb-1">
                  CHAPTER 01
                </span>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#1C1440] leading-tight">
                  THE DOOR THAT ISN'T ON THE MAP
                </h2>
                <p className="font-serif italic text-sm text-[#1C1440]/80 mt-1">
                  "There is a doorway somewhere in the old city that most visitors walk straight past."
                </p>
              </div>

              {/* Progress Bar (80%) */}
              <div className="space-y-2 bg-[#FAF5EE] p-4 border border-[#E8DAC9]">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-[#7A1026]">CHAPTER PROGRESS</span>
                  <span className="text-[#1C1440]">80% COMPLETED</span>
                </div>
                <div className="w-full h-3 bg-white border border-[#1C1440]/30 overflow-hidden">
                  <div className="h-full bg-[#7A1026] w-[80%] transition-all duration-500" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-serif italic text-[#1C1440]/70 pt-1">
                  <span>Current Clue: Met Master Ramdas Prajapati</span>
                  <span>Pending: Next Chapter Verification</span>
                </div>
              </div>

              {/* Active Clue Snippet */}
              <div className="border-l-3 border-[#C98A2E] bg-[#FFFBF0] p-4 text-xs font-serif text-[#1C1440]">
                <strong className="block font-mono text-[10px] uppercase text-[#C98A2E] mb-0.5">
                  LATEST FIELD OBSERVATION:
                </strong>
                "He told me: the wood remembers the tree, and the dye remembers the river. His answer points toward a lane behind the old market..."
              </div>

              {/* Resume Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleResume}
                  className="bg-[#7A1026] hover:bg-[#9C1A35] active:scale-98 text-[#FFD38A] font-heading font-black text-sm px-8 py-4 rounded-sm border border-[#450915] flex items-center gap-3 transition-all cursor-pointer shadow-sm uppercase tracking-wider"
                >
                  <span>RESUME JOURNEY</span>
                  <ArrowRight className="w-4 h-4 text-[#FFD38A]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPCOMING & LOCKED CHAPTERS */}
      <div className="space-y-4 pt-4 border-t border-[#E8DAC9]">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-mono tracking-widest text-[#7A1026] font-bold">
            FUTURE STORY CHAPTERS
          </span>
          <span className="text-xs text-[#1C1440]/60 font-serif italic">
            Complete the current story to unlock
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chapter 02 (Locked) */}
          <div className="border border-[#E8DAC9] bg-white p-6 relative flex flex-col justify-between space-y-4 opacity-80 hover:opacity-100 transition-opacity">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A1026] font-bold">
                  CHAPTER 02
                </span>
                <span className="inline-flex items-center gap-1 bg-[#FAF5EE] text-[#7A1026] px-2 py-0.5 text-[10px] font-mono uppercase font-bold border border-[#E8DAC9]">
                  <Lock className="w-3 h-3" /> LOCKED
                </span>
              </div>
              <h3 className="font-heading font-black text-xl text-[#1C1440]">
                THE PLACE BEHIND THE STORY
              </h3>
              <p className="font-serif italic text-xs sm:text-sm text-[#1C1440]/75 leading-relaxed">
                "An indigo-stained stone terrace hidden behind the temple spires. The dyers spread river-soaked cotton under the mid-day sun."
              </p>
            </div>

            <div className="pt-4 border-t border-[#E8DAC9] flex items-center justify-between text-xs font-mono text-[#1C1440]/60">
              <span>Jaipur Riverbank Guilds</span>
              <span className="text-[#7A1026] font-semibold">Unlocks after Chapter 01</span>
            </div>
          </div>

          {/* Chapter 03 (Locked) */}
          <div className="border border-[#E8DAC9] bg-white p-6 relative flex flex-col justify-between space-y-4 opacity-80 hover:opacity-100 transition-opacity">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A1026] font-bold">
                  CHAPTER 03
                </span>
                <span className="inline-flex items-center gap-1 bg-[#FAF5EE] text-[#7A1026] px-2 py-0.5 text-[10px] font-mono uppercase font-bold border border-[#E8DAC9]">
                  <Lock className="w-3 h-3" /> LOCKED
                </span>
              </div>
              <h3 className="font-heading font-black text-xl text-[#1C1440]">
                THE WEAVER'S WHISPER
              </h3>
              <p className="font-serif italic text-xs sm:text-sm text-[#1C1440]/75 leading-relaxed">
                "The rhythmic wooden clack of handlooms working through the night. A family preserving a royal weaving pattern since 1856."
              </p>
            </div>

            <div className="pt-4 border-t border-[#E8DAC9] flex items-center justify-between text-xs font-mono text-[#1C1440]/60">
              <span>Amer Stepwell Colony</span>
              <span className="text-[#7A1026] font-semibold">Unlocks after Chapter 02</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
