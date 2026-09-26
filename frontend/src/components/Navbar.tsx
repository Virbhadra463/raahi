import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Compass, Flame, Coins, Trophy, Volume2, VolumeX, Store, Activity, Map, Award, X, Menu, Sparkles, ArrowLeft } from 'lucide-react';
import { playClickSound, setSoundMuted } from '../utils/audio';

export type AppTab = 'planner' | 'india-map' | 'state-detail' | 'quests' | '3d-district' | 'crowd' | 'artisans' | 'passport';

interface NavbarProps {
  user: UserProfile;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onOpenSIHModal: () => void;
  selectedStateName?: string;
  onBackToLanding?: () => void;
}

const NAV_ITEMS: readonly { id: AppTab; label: string; icon: React.FC<any>; dot?: boolean; highlight?: boolean }[] = [
  { id: 'planner', label: 'AI Planner', icon: Sparkles, highlight: true },
  { id: 'india-map', label: 'Map', icon: Compass },
  { id: 'quests', label: 'Quests', icon: Map },
  { id: 'crowd', label: 'Crowds', icon: Activity, dot: true },
  { id: 'artisans', label: 'Artisans', icon: Store },
  { id: 'passport', label: 'Passport', icon: Trophy },
] as const;

export const Navbar: React.FC<NavbarProps> = ({
  user, activeTab, setActiveTab, isMuted, setIsMuted, onOpenSIHModal, selectedStateName, onBackToLanding
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const xpPercent = Math.min(100, Math.round((user.currentXp / user.xpToNextLevel) * 100));

  const handleTabClick = (tab: typeof activeTab) => {
    playClickSound();
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    setSoundMuted(next);
    if (!next) playClickSound();
  };

  const isQuestActive = activeTab === 'state-detail' || activeTab === 'quests';

  return (
    <header className="sticky top-0 z-40 bg-signboard-dark/95 backdrop-blur-md border-b-2 border-marigold/30 shadow-bollywood-lg">
      {/* Top accent line — marigold gradient */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-carpet via-marigold to-carpet" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] gap-4">

          {/* ─── LOGO & LANDING LINK ─── */}
          <button
            onClick={() => {
              if (onBackToLanding) {
                playClickSound();
                onBackToLanding();
              } else {
                handleTabClick('india-map');
              }
            }}
            className="flex items-center gap-2.5 shrink-0 group cursor-pointer"
            title="Return to Landing Page"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-carpet shadow-bollywood group-hover:shadow-bollywood-gold group-hover:-translate-x-px group-hover:-translate-y-px transition-all border-2 border-marigold/50">
              <Compass className="w-5 h-5 text-marigold" />
            </div>
            <div className="hidden sm:block leading-none text-left">
              <div className="signboard-text text-[1.5rem] leading-none tracking-wide uppercase group-hover:text-marigold transition-colors">
                RAAHI
              </div>
              <div className="text-[10px] font-medium text-parchment/60 tracking-widest uppercase mt-0.5 font-body">
                Gamified Heritage Tourism
              </div>
            </div>
          </button>

          {/* ─── DESKTOP NAV ─── */}
          <nav className="hidden lg:flex items-center gap-1 bg-signboard-navy/60 backdrop-blur-sm rounded-2xl p-1 border border-marigold/20">
            {NAV_ITEMS.map(({ id, label, icon: Icon, dot, highlight }) => {
              const active = id === 'quests' ? isQuestActive : activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => handleTabClick(id)}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-marigold text-signboard-navy shadow-bollywood border-2 border-signboard-navy'
                      : highlight
                      ? 'bg-[#7A1026] text-[#FFD38A] border border-[#FFD38A]/40 hover:bg-[#9C1A35]'
                      : 'text-parchment/70 hover:bg-signboard-navyDeep hover:text-parchment'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-signboard-navy' : highlight ? 'text-[#FFD38A]' : 'text-marigold/60'}`} />
                  <span>{id === 'quests' && selectedStateName ? selectedStateName.split(' ')[0] : label}</span>
                  {dot && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-signboard-pink rounded-full border-2 border-signboard-dark animate-live-dot" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ─── RIGHT STATS + CONTROLS ─── */}
          <div className="flex items-center gap-2">

            {/* Coins + Streak chip */}
            <div className="flex items-center gap-2 bg-signboard-navy/60 backdrop-blur-sm border border-marigold/30 rounded-xl px-3 py-1.5">
              <span className="flex items-center gap-1 text-xs font-bold text-marigold">
                <Coins className="w-3.5 h-3.5 text-marigold" />
                {user.coins}
              </span>
              <span className="w-px h-3.5 bg-marigold/30" />
              <span className="flex items-center gap-0.5 text-xs font-bold text-signboard-pink">
                <Flame className="w-3.5 h-3.5 fill-signboard-pink text-signboard-pink" />
                {user.streakDays}d
              </span>
            </div>

            {/* Avatar + XP — desktop only */}
            <button
              onClick={() => handleTabClick('passport')}
              className="hidden md:flex items-center gap-2 bg-signboard-navy/60 backdrop-blur-sm border border-marigold/20 rounded-xl pl-1.5 pr-3 py-1 hover:border-marigold transition-colors group"
            >
              <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover border-2 border-marigold" />
                <span className="absolute -bottom-1 -right-1 bg-carpet text-marigold text-[8px] font-black px-1 rounded-full border border-marigold leading-none py-0.5">
                  L{user.level}
                </span>
              </div>
              <div className="text-left">
                <div className="text-[11px] font-semibold text-parchment leading-none">{user.name.split(' ')[0]}</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-16 h-1.5 bg-signboard-navyDeep rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-marigold-deep to-marigold rounded-full transition-all duration-500" style={{ width: `${xpPercent}%` }} />
                  </div>
                  <span className="text-[9px] text-parchment/50 font-semibold">{xpPercent}%</span>
                </div>
              </div>
            </button>

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-signboard-navy/60 border border-marigold/20 text-parchment/70 hover:bg-signboard-navyDeep hover:text-marigold transition-all"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-marigold" />}
            </button>

            {/* SIH badge */}
            <button
              onClick={() => { playClickSound(); onOpenSIHModal(); }}
              className="hidden sm:flex items-center gap-1 px-3 py-2 bg-carpet hover:bg-carpet-light text-marigold font-black text-[11px] rounded-xl transition-all uppercase tracking-wider shadow-bollywood border-2 border-marigold/50"
            >
              <Award className="w-3.5 h-3.5" />
              SIH
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-signboard-navy/60 border border-marigold/20 text-parchment"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ─── MOBILE DROPDOWN NAV ─── */}
        {mobileOpen && (
          <div className="lg:hidden pb-3 border-t border-marigold/20 pt-2 flex flex-wrap gap-1.5">
            {NAV_ITEMS.map(({ id, label, icon: Icon, dot }) => {
              const active = id === 'quests' ? isQuestActive : activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => handleTabClick(id as typeof activeTab)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wide uppercase transition-all ${
                    active
                      ? 'bg-marigold text-signboard-navy border-2 border-signboard-navy shadow-bollywood'
                      : 'bg-signboard-navy/60 text-parchment/70 border border-marigold/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {dot && <span className="w-1.5 h-1.5 bg-signboard-pink rounded-full animate-live-dot" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
