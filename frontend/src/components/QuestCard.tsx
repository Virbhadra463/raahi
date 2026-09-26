import React from 'react';
import { Quest } from '../types';
import { Clock, Zap, Coins, MapPin, ArrowRight, Flame } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface QuestCardProps {
  quest: Quest;
  onSelect: (quest: Quest) => void;
  isCompleted?: boolean;
}

const CATEGORY_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  artisan:  { label: 'Artisan',  color: '#fff',     bg: '#7A1026', border: '#E85B70' },
  food:     { label: 'Cuisine',  color: '#1C1440',  bg: '#E5A532', border: '#E5A532' },
  heritage: { label: 'Heritage', color: '#fff',     bg: '#120C2B', border: '#450915' },
  nature:   { label: 'Nature',   color: '#fff',     bg: '#889063', border: '#8A8635' },
  night:    { label: 'Night',    color: '#FFD38A',  bg: '#1C1440', border: '#120C2B' },
};

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: '#889063',
  Moderate: '#E5A532',
  Adventurer: '#7A1026',
};

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onSelect, isCompleted = false }) => {
  const cat = CATEGORY_META[quest.category] ?? CATEGORY_META.artisan;
  const diffColor = DIFFICULTY_COLOR[quest.difficulty] ?? '#7A1026';

  return (
    <div
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(174,67,30,0.18)] ${
        quest.isCrowdBalancingBoosted
          ? 'shadow-[0_4px_20px_rgba(206,90,67,0.2)] ring-2 ring-[#F09367]/50'
          : 'shadow-[0_2px_12px_rgba(33,1,0,0.08)]'
      }`}
      style={{ border: `1.5px solid ${quest.isCrowdBalancingBoosted ? '#F09367' : '#FFA6B4'}33` }}
    >
      {/* ─── HERO IMAGE ─── */}
      <div className="relative h-48 overflow-hidden bg-[#FCEFD9]">
        <img
          src={quest.heroImage}
          alt={quest.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1440]/85 via-[#1C1440]/15 to-transparent" />

        {/* Warli left-edge decoration strip */}
        <div
          className="absolute top-0 left-0 w-1.5 h-full"
          style={{ background: `linear-gradient(to bottom, ${cat.bg}, ${cat.border})` }}
        />

        {/* Category stamp — top left */}
        <div className="absolute top-3 left-4">
          <span
            className="stamp-badge"
            style={{ background: cat.bg, color: cat.color, borderColor: cat.border }}
          >
            {cat.label}
          </span>
        </div>

        {/* Boost badge — top right */}
        {quest.isCrowdBalancingBoosted && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#FFD38A] text-[#1C1440] px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border border-[#E5A532] shadow">
            <Flame className="w-3 h-3 fill-[#7A1026] text-[#7A1026]" />
            {quest.crowdMultiplier}× Boost
          </div>
        )}

        {/* Completed tick — top right */}
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-[#889063] text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide">
            ✓ Done
          </div>
        )}

        {/* Bottom info row */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-medium text-white/90 bg-black/35 backdrop-blur-sm px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-[#FFD38A]" />
            {quest.estimatedTime}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-white/90 bg-black/35 backdrop-blur-sm px-2 py-0.5 rounded-md">
            <MapPin className="w-3 h-3 text-[#F09367]" />
            {quest.stops.length} stops
          </span>
          <span
            className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md"
            style={{ color: diffColor, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          >
            {quest.difficulty}
          </span>
        </div>
      </div>

      {/* ─── CARD BODY ─── */}
      <div className="flex-1 flex flex-col p-4 gap-3">

        {/* Title + tagline */}
        <div>
          <h3 className="font-[Poppins] font-bold text-[1rem] leading-snug text-[#1C1440] group-hover:text-[#7A1026] transition-colors">
            {quest.title}
          </h3>
          <p className="text-[11px] font-medium text-[#8A8635] mt-0.5 italic">{quest.tagline}</p>
          <p className="text-[11px] text-[#120C2B]/75 mt-1.5 line-clamp-2 leading-relaxed">{quest.description}</p>
        </div>

        {/* Milestone trail dots */}
        <div className="flex items-center gap-1.5 overflow-hidden">
          {quest.stops.slice(0, 4).map((stop, i) => (
            <React.Fragment key={stop.id}>
              <div className="flex items-center gap-1 shrink-0">
                <span
                  className="w-2 h-2 rounded-full border-2"
                  style={{ borderColor: cat.bg, background: i === 0 ? cat.bg : 'transparent' }}
                />
                <span className="text-[10px] font-semibold text-[#120C2B] truncate max-w-[60px]">{stop.name.split(' ')[0]}</span>
              </div>
              {i < Math.min(quest.stops.length, 4) - 1 && (
                <div className="flex-1 h-px bg-[#FFA6B4]/50 min-w-[8px]" />
              )}
            </React.Fragment>
          ))}
          {quest.stops.length > 4 && (
            <span className="text-[10px] text-[#8A8635] font-semibold shrink-0">+{quest.stops.length - 4}</span>
          )}
        </div>

        {/* ─── FOOTER ─── */}
        <div className="flex items-center justify-between pt-3 border-t border-[#FFA6B4]/20 mt-auto">
          {/* Rewards */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs font-bold text-[#7A1026]">
              <Zap className="w-3.5 h-3.5 fill-[#7A1026]" />
              +{quest.totalXp} XP
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-[#9C1A35]">
              <Coins className="w-3.5 h-3.5 text-[#E5A532]" />
              +{quest.totalCoins}
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={() => { playClickSound(); onSelect(quest); }}
            className="btn-terracotta text-[11px] py-2 px-3.5 rounded-lg"
          >
            {isCompleted ? 'Replay' : 'Begin'}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
