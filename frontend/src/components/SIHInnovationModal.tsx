import React from 'react';
import { X, Award, CheckCircle2, ShieldCheck, Zap, QrCode, TrendingUp, Users, HeartHandshake } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface SIHInnovationModalProps {
  onClose: () => void;
}

export const SIHInnovationModal: React.FC<SIHInnovationModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1C1440]/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FFFDF9] rounded-3xl border-2 border-[#FFE4B5] shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1C1440] via-[#120C2B] to-[#450915] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD38A] text-[#1C1440] flex items-center justify-center font-black">
              <Award className="w-7 h-7 text-[#9C1A35]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFD38A]">
                  Smart India Hackathon 2026 • PS 26204
                </span>
                <span className="bg-[#7A1026] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Team: Commit Issues
                </span>
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-white mt-0.5">
                Raahi: Turning Tourism into a Game
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-xl text-white/80 hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Solution Snapshot */}
          <div className="p-4 rounded-2xl bg-[#FFF9F3] border border-[#FFA6B4]/40 space-y-2">
            <h4 className="font-display font-bold text-base text-[#1C1440] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7A1026]" />
              <span>Executive Solution Overview</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#120C2B] leading-relaxed">
              Raahi revolutionizes local tourism by converting traditional sightseeing into interactive, gamified cultural trails. Instead of static coupon portals, the game mechanics themselves serve as an autonomous demand-redistribution engine that disperses peak crowds to small artisans, women-led guilds, and heritage eateries.
            </p>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-white border-2 border-[#FFA6B4]/30 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#7A1026]">
                <Zap className="w-4 h-4" />
                <span>1. Autonomous Quest Engine</span>
              </div>
              <p className="text-xs text-[#1C1440]">
                Dynamically bundles generational potters, chai brewers, folk musicians, and heritage drivers into connected story trails with trivia, dialogue, and photo checkpoints.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#FFA6B4]/30 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#8A8635]">
                <Users className="w-4 h-4" />
                <span>2. Demand-Balancing Layer</span>
              </div>
              <p className="text-xs text-[#1C1440]">
                Live congestion monitoring detects bottlenecked monuments and automatically boosts XP & artisan voucher multipliers (up to 2.5x) to steer tourists to quiet nearby shops.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#FFA6B4]/30 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#E5A532]">
                <HeartHandshake className="w-4 h-4" />
                <span>3. Direct Local Economic Impact</span>
              </div>
              <p className="text-xs text-[#1C1440]">
                Direct token redemptions empower women-led craft cooperatives and revive endangered heritage arts without exploitative commissions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#FFA6B4]/30 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#120C2B]">
                <QrCode className="w-4 h-4" />
                <span>4. Rural Offline QR Protocol</span>
              </div>
              <p className="text-xs text-[#1C1440]">
                Cryptographic offline verification ensures 100% functionality in low-bandwidth rural alleys and remote heritage sanctuaries.
              </p>
            </div>

          </div>

          {/* Impact Metrics */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF9F3] to-[#FCEFD9] border border-[#FFE4B5]">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1C1440] mb-2">
              Target Stakeholder Outcomes
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2 bg-white rounded-xl">
                <span className="text-[10px] text-gray-500 font-bold block">Tourists</span>
                <span className="text-xs font-black text-[#7A1026]">Story-Driven Trips</span>
              </div>
              <div className="p-2 bg-white rounded-xl">
                <span className="text-[10px] text-gray-500 font-bold block">Artisans</span>
                <span className="text-xs font-black text-[#8A8635]">Fair Direct Income</span>
              </div>
              <div className="p-2 bg-white rounded-xl">
                <span className="text-[10px] text-gray-500 font-bold block">Tourism Boards</span>
                <span className="text-xs font-black text-[#120C2B]">Zero Overcrowding</span>
              </div>
              <div className="p-2 bg-white rounded-xl">
                <span className="text-[10px] text-gray-500 font-bold block">Economy</span>
                <span className="text-xs font-black text-[#E5A532]">Inclusive GDP</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FDF3EA] border-t border-[#FFA6B4]/30 text-center">
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-6 py-2.5 bg-[#7A1026] hover:bg-[#E85B70] text-white text-xs font-black rounded-xl shadow transition-all"
          >
            Close & Continue Exploring Quests
          </button>
        </div>

      </div>
    </div>
  );
};

function Sparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
