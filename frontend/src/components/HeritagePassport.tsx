import React, { useState } from 'react';
import { UserProfile, UserBadge } from '../types';
import { ALL_BADGES } from '../data/mockData';
import { ThreeBadgeViewer } from './ThreeBadgeViewer';
import { Trophy, Sparkles, Footprints, DollarSign, Leaf, Lock, Flame } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface HeritagePassportProps {
  user: UserProfile;
}

export const HeritagePassport: React.FC<HeritagePassportProps> = ({ user }) => {
  const [selectedBadge, setSelectedBadge] = useState<UserBadge>(ALL_BADGES[0]);

  const ranks = [
    { level: 1, title: 'Novice Wanderer',      emoji: '🪨' },
    { level: 2, title: 'Street Scout',          emoji: '🧭' },
    { level: 3, title: 'Cultural Pathfinder',   emoji: '🗺️' },
    { level: 4, title: 'Trail Master',           emoji: '🏛️' },
    { level: 5, title: 'Heritage Guardian',      emoji: '🦚' },
  ];

  const xpPercent = Math.min(100, Math.round((user.currentXp / user.xpToNextLevel) * 100));

  return (
    <div className="space-y-8 animate-float-up">

      {/* ─── PASSPORT HERO ─── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          backgroundImage: "url('/warli-bg.jpg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      >
        {/* Dark maroon overlay */}
        <div className="absolute inset-0" style={{ background: 'rgba(33, 1, 0, 0.87)' }} />
        {/* Gold border-bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#450915] via-[#E5A532] to-[#FFD38A]" />
        {/* Left stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#FFD38A] to-[#E5A532]" />

        <div className="relative z-10 p-6 sm:p-8 pl-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

            {/* Avatar + Name */}
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-xl object-cover border-2 border-[#FFD38A] shadow-[3px_3px_0px_#450915]"
                />
                <span className="absolute -bottom-2 -right-2 bg-[#7A1026] text-[#FFD38A] text-[9px] font-black px-2 py-0.5 rounded-full border-2 border-white">
                  Lvl {user.level}
                </span>
              </div>

              <div>
                <span className="stamp-badge bg-[#FFD38A] text-[#1C1440] border-[#E5A532] mb-2 inline-flex">
                  Digital Cultural Passport · #RH-2026-IN
                </span>
                <h2 className="font-[Poppins] font-black text-2xl sm:text-3xl text-white leading-tight">
                  {user.name}
                </h2>
                <p className="text-[11px] text-[#FFA6B4] font-medium mt-0.5">
                  {user.title} · {user.streakDays}-day streak
                  <Flame className="inline w-3.5 h-3.5 fill-[#F09367] text-[#F09367] ml-1" />
                </p>
                {/* XP bar */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-36 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#F09367] to-[#FFD38A] transition-all duration-700"
                      style={{ width: `${xpPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/60 font-medium">{user.currentXp} / {user.xpToNextLevel} XP</span>
                </div>
              </div>
            </div>

            {/* Quick stats — editorial big numbers */}
            <div className="flex items-center gap-4 flex-wrap">
              {[
                { label: 'Quests', value: user.completedQuestIds.length, color: '#F09367' },
                { label: 'Badges', value: `${user.unlockedBadges.length}/${ALL_BADGES.length}`, color: '#FFD38A' },
                { label: 'Impact', value: `$${user.localImpactDollars}`, color: '#FFA6B4' },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-3 min-w-[80px]">
                  <div className="font-black text-2xl leading-none" style={{ color }}>{value}</div>
                  <div className="text-[9px] uppercase tracking-widest text-white/50 font-semibold mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── CONTENT GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sustainable Impact */}
        <div className="bg-white rounded-2xl border border-[#FFA6B4]/30 shadow-[0_2px_12px_rgba(33,1,0,0.06)] overflow-hidden">
          {/* Top band */}
          <div className="h-1.5 bg-gradient-to-r from-[#889063] to-[#8A8635]" />
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#889063]" />
              <h3 className="font-[Poppins] font-bold text-sm text-[#1C1440] uppercase tracking-wide">
                Your Local Impact
              </h3>
            </div>

            {[
              {
                icon: DollarSign,
                color: '#7A1026',
                bg: '#FFF9F3',
                title: `$${user.localImpactDollars}.00`,
                sub: 'To women artisan guilds',
              },
              {
                icon: Footprints,
                color: '#889063',
                bg: '#F0F4E8',
                title: `${user.stepsWalked.toLocaleString()} steps`,
                sub: 'Zero-emission exploration',
              },
              {
                icon: Trophy,
                color: '#E5A532',
                bg: '#FFFBF0',
                title: '2 Sites De-congested',
                sub: 'Smart reroute contribution',
              },
            ].map(({ icon: Icon, color, bg, title, sub }) => (
              <div
                key={title}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#FFA6B4]/20 transition-all hover:shadow-sm"
                style={{ background: bg }}
              >
                <div className="p-2 rounded-lg" style={{ background: color + '20' }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1C1440]">{title}</div>
                  <div className="text-[10px] text-[#120C2B]">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Badge Cabinet */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#FFA6B4]/30 shadow-[0_2px_12px_rgba(33,1,0,0.06)] overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-[#7A1026] to-[#E5A532]" />
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#E5A532]" />
                <h3 className="font-[Poppins] font-bold text-sm text-[#1C1440] uppercase tracking-wide">
                  3D Heritage Trophy Cabinet
                </h3>
              </div>
              <span className="text-[10px] text-[#8A8635] font-medium">Click badge → inspect in 3D</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
              {/* 3D viewer */}
              <div className="bg-gradient-to-b from-[#FFF9F3] to-[#FCEFD9] rounded-xl p-4 border border-[#F09367]/30 flex flex-col items-center">
                <ThreeBadgeViewer
                  colorHex={selectedBadge.color}
                  badgeName={selectedBadge.name}
                  isUnlocked={user.unlockedBadges.some((b) => b.id === selectedBadge.id)}
                />
                <p className="text-[11px] text-center text-[#120C2B] mt-2 font-medium leading-snug max-w-[200px]">
                  {selectedBadge.description}
                </p>
              </div>

              {/* Badge grid */}
              <div className="grid grid-cols-2 gap-2">
                {ALL_BADGES.map((badge) => {
                  const isUnlocked = user.unlockedBadges.some((b) => b.id === badge.id);
                  const isSelected = selectedBadge.id === badge.id;
                  return (
                    <button
                      key={badge.id}
                      onClick={() => { playClickSound(); setSelectedBadge(badge); }}
                      className={`p-2.5 rounded-xl text-left transition-all flex items-start gap-2 border ${
                        isSelected
                          ? 'border-[#7A1026] bg-[#FFF9F3] shadow-[2px_2px_0px_#7A1026]'
                          : isUnlocked
                          ? 'border-[#FFA6B4]/40 bg-white hover:border-[#F09367] hover:-translate-y-px'
                          : 'border-[#e5e7eb] bg-[#f9fafb] opacity-55'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                        style={{ background: isUnlocked ? badge.color : '#9CA3AF' }}
                      >
                        {isUnlocked
                          ? <Sparkles className="w-3.5 h-3.5 text-white" />
                          : <Lock className="w-3 h-3 text-white" />}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-semibold text-[10px] text-[#1C1440] truncate leading-tight">{badge.name}</p>
                        <p className="text-[9px] text-[#120C2B] truncate">{badge.category}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rank ladder */}
            <div className="mt-5 pt-4 border-t border-[#FFA6B4]/20">
              <p className="text-[10px] font-bold text-[#8A8635] uppercase tracking-widest mb-3">Traveler Mastery Tiers</p>
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {ranks.map((r, i) => {
                  const isCurrent = user.level === r.level;
                  const isPassed = user.level > r.level;
                  return (
                    <React.Fragment key={r.level}>
                      <div
                        className={`shrink-0 flex flex-col items-center p-2.5 rounded-xl min-w-[80px] border transition-all ${
                          isCurrent
                            ? 'bg-[#7A1026] text-white border-[#E85B70] shadow-[2px_2px_0px_#450915]'
                            : isPassed
                            ? 'bg-[#FFD38A]/30 text-[#1C1440] border-[#FFE4B5]'
                            : 'bg-white text-[#9CA3AF] border-[#e5e7eb]'
                        }`}
                      >
                        <span className="text-lg">{r.emoji}</span>
                        <span className="text-[8px] font-black uppercase tracking-wider mt-0.5 opacity-70">Lvl {r.level}</span>
                        <span className="text-[9px] font-bold text-center leading-tight mt-0.5">{r.title}</span>
                      </div>
                      {i < ranks.length - 1 && (
                        <div className={`h-px w-4 shrink-0 ${isPassed || isCurrent ? 'bg-[#7A1026]' : 'bg-[#e5e7eb]'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
