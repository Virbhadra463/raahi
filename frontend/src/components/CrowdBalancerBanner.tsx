import React from 'react';
import { CROWD_HOTSPOTS, QUESTS } from '../data/mockData';
import { Quest } from '../types';
import { ArrowRight, Users, Navigation } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface CrowdBalancerBannerProps {
  onSelectQuest: (quest: Quest) => void;
}

export const CrowdBalancerBanner: React.FC<CrowdBalancerBannerProps> = ({ onSelectQuest }) => {
  const primaryAlert = CROWD_HOTSPOTS[0];
  const targetQuest = QUESTS.find((q) => q.id === primaryAlert.redirectedQuestId) || QUESTS[0];

  const congestionBar = Math.min(100, primaryAlert.currentCongestionPercent);

  return (
    <div
      className="relative overflow-hidden rounded-2xl text-white"
      style={{
        backgroundImage: "url('/warli-bg.jpg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
      }}
    >
      {/* Dark maroon overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(139, 9, 2, 0.88)' }} />

      {/* White warli accent strip on left */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#FFD38A] via-[#F09367] to-[#7A1026]" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-5 sm:p-6 pl-6 sm:pl-7">

        {/* Left: Alert info */}
        <div className="flex items-start gap-4 flex-1">
          {/* Live indicator block */}
          <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
            <span className="w-3 h-3 rounded-full bg-[#F09367] animate-live-dot" />
            <span
              className="text-[8px] font-black uppercase tracking-widest text-[#FFD38A]"
              style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)', letterSpacing: '0.2em' }}
            >
              LIVE
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="stamp-badge bg-[#FFD38A] text-[#1C1440] border-[#E5A532]">
                Demand Balancer
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#FFA6B4]">
                <Users className="w-3 h-3" />
                {primaryAlert.name}
              </span>
            </div>

            <h3 className="font-[Poppins] font-bold text-lg sm:text-xl leading-tight tracking-tight">
              {primaryAlert.waitTimeMinutes}m Queue at{' '}
              <span className="text-[#FFD38A]">{primaryAlert.name}</span>
              {' '}— Skip it, earn{' '}
              <span className="text-[#F09367] font-black">{primaryAlert.bonusMultiplier}× XP</span>
            </h3>

            <p className="text-[11px] text-white/75 leading-relaxed max-w-xl">
              {primaryAlert.artisanHighlight} — Smart crowd-redistribution protocol active.
            </p>

            {/* Congestion bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden max-w-[200px]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${congestionBar}%`,
                    background: congestionBar > 80 ? '#7A1026' : congestionBar > 60 ? '#E5A532' : '#889063',
                  }}
                />
              </div>
              <span className="text-[10px] font-bold text-[#FFA6B4]">{congestionBar}% full</span>
            </div>
          </div>
        </div>

        {/* Right: Large multiplier display + CTA */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          {/* Big number */}
          <div className="text-right hidden sm:block">
            <div
              className="font-black leading-none"
              style={{ fontSize: '3.5rem', color: 'rgba(254,206,121,0.15)', lineHeight: 1 }}
            >
              ×{primaryAlert.bonusMultiplier}
            </div>
          </div>

          <button
            onClick={() => { playClickSound(); onSelectQuest(targetQuest); }}
            className="btn-gold flex items-center gap-2 whitespace-nowrap"
          >
            <Navigation className="w-4 h-4" />
            Divert Trail (+{targetQuest.totalXp} XP)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
