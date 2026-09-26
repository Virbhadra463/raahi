import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Navbar } from './components/Navbar';
import { ThreeIndiaMap } from './components/ThreeIndiaMap';
import { IndiaMapCanvas } from './components/IndiaMapCanvas';
import { StateDetailPage } from './components/StateDetailPage';
import { CrowdBalancerBanner } from './components/CrowdBalancerBanner';
import { QuestCard } from './components/QuestCard';
import { ThreeDistrictViewer } from './components/ThreeDistrictViewer';
import { CrowdHeatmapView } from './components/CrowdHeatmapView';
import { ArtisanMarketplace } from './components/ArtisanMarketplace';
import { HeritagePassport } from './components/HeritagePassport';
import { ActiveQuestModal } from './components/ActiveQuestModal';
import { SIHInnovationModal } from './components/SIHInnovationModal';
import { PlannerView } from './components/planner/PlannerView';

// Landing Page Components
import LandingNavbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import WhatIsRaahi from './components/landing/WhatIsRaahi';
import RaahiBook from './components/landing/RaahiBook';
import RaahiFinds from './components/landing/RaahiFinds';
import FinalStatement from './components/landing/FinalStatement';
import TakeAPieceOfThePlace from './components/landing/TakeAPieceOfThePlace';
import Footer from './components/landing/Footer';
import { AuthModal } from './components/landing/AuthModal';
import { JourneyBuilderModal } from './components/landing/JourneyBuilderModal';
import { CulturalFashionExperienceModal } from './components/culturalFashion/CulturalFashionExperienceModal';
import { LocalMaker } from './data/culturalFashionData';
import { QUESTS, INITIAL_USER_PROFILE, ALL_BADGES } from './data/mockData';
import { ALL_INDIA_STATES, STATE_SPECIFIC_QUESTS } from './data/indiaData';
import { Quest, QuestCategory, UserProfile, ArtisanVendor, IndiaState } from './types';
import {
  Search,
  Filter,
  Sparkles,
  MapPin,
  Compass,
  Award,
  Flame,
  Zap,
  CheckCircle,
  Layers,
  ArrowRight,
  ShieldAlert,
  Globe2,
  TrendingUp,
  Store,
  ChevronRight
} from 'lucide-react';
import { playClickSound, playCoinSound } from './utils/audio';

export default function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [activeTab, setActiveTab] = useState<
    'planner' | 'india-map' | 'state-detail' | 'quests' | '3d-district' | 'crowd' | 'artisans' | 'passport'
  >('india-map');
  const [selectedState, setSelectedState] = useState<IndiaState>(ALL_INDIA_STATES[0]); // Default Rajasthan
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Easy' | 'Moderate' | 'Adventurer'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSIHModal, setShowSIHModal] = useState<boolean>(false);
  const [bannerAlertDismissed, setBannerAlertDismissed] = useState<boolean>(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [journeyModalOpen, setJourneyModalOpen] = useState<boolean>(false);
  const [culturalExperienceOpen, setCulturalExperienceOpen] = useState<boolean>(false);
  const [selectedCulturalState, setSelectedCulturalState] = useState<string>('rajasthan');
  const [initialPlannerPrompt, setInitialPlannerPrompt] = useState<string | undefined>();
  const [currentUserSession, setCurrentUserSession] = useState<{ name: string; email?: string } | null>(null);

  // Load saved user from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('raahi_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) {
          setCurrentUserSession(parsed);
          setUser((prev) => ({
            ...prev,
            name: parsed.name,
          }));
        }
      }
    } catch (e) {
      console.warn("Could not read auth user from localStorage:", e);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('raahi_auth_user');
    } catch {}
    setCurrentUserSession(null);
    setUser(INITIAL_USER_PROFILE);
  };

  const handleOpenPlanner = (customPrompt?: string) => {
    playClickSound();
    setInitialPlannerPrompt(customPrompt);
    setView('app');
    setActiveTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const questListRef = useRef<HTMLDivElement>(null);

  // GSAP animation on tab changes and quest list render
  useEffect(() => {
    if (questListRef.current) {
      gsap.fromTo(
        questListRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [activeTab, selectedCategory, searchQuery, difficultyFilter]);

  // Combine all quests (mock + state-specific)
  const allAvailableQuests: Quest[] = React.useMemo(() => {
    const combined = [...QUESTS];
    STATE_SPECIFIC_QUESTS.forEach((sq) => {
      if (!combined.some((q) => q.id === sq.id)) {
        combined.push(sq);
      }
    });
    return combined;
  }, []);

  // Handle State Selection from 3D Map -> Redirect to State Quests Page
  const handleSelectState = (state: IndiaState) => {
    setSelectedState(state);
    setActiveTab('state-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Quest Completion
  const handleCompleteQuest = (quest: Quest, earnedXp: number, earnedCoins: number) => {
    setUser((prev) => {
      const newXp = prev.currentXp + earnedXp;
      let newLevel = prev.level;
      let xpForNext = prev.xpToNextLevel;

      if (newXp >= prev.xpToNextLevel) {
        newLevel += 1;
        xpForNext = prev.xpToNextLevel + 1200;
      }

      // Add badge if not yet unlocked
      const newUnlockedBadges = [...prev.unlockedBadges];
      const targetBadge = ALL_BADGES.find((b) => b.id === quest.badgeReward.id);
      if (targetBadge && !newUnlockedBadges.some((b) => b.id === targetBadge.id)) {
        newUnlockedBadges.push({
          ...targetBadge,
          unlockedAt: new Date().toISOString().split('T')[0],
          is3dUnlocked: true
        });
      }

      const newCompletedIds = prev.completedQuestIds.includes(quest.id)
        ? prev.completedQuestIds
        : [...prev.completedQuestIds, quest.id];

      return {
        ...prev,
        level: newLevel,
        currentXp: newXp,
        xpToNextLevel: xpForNext,
        coins: prev.coins + earnedCoins,
        completedQuestIds: newCompletedIds,
        unlockedBadges: newUnlockedBadges,
        localImpactDollars: prev.localImpactDollars + Math.round(earnedCoins / 6),
        stepsWalked: prev.stepsWalked + 1850
      };
    });
  };

  // Handle Voucher Redemption
  const handleRedeemVoucher = (vendor: ArtisanVendor) => {
    if (user.coins < vendor.tokenCost) return;

    setUser((prev) => ({
      ...prev,
      coins: prev.coins - vendor.tokenCost,
      redeemedVouchers: [
        ...prev.redeemedVouchers,
        {
          id: `vouch-${Date.now()}`,
          artisanName: vendor.name,
          discount: vendor.voucherDiscount,
          code: `RH-${vendor.craft.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString().split('T')[0]
        }
      ],
      localImpactDollars: prev.localImpactDollars + Math.round(vendor.tokenCost / 4)
    }));
  };

  // Filtered Quests for 'quests' tab
  const filteredQuests = allAvailableQuests.filter((quest) => {
    const matchesCategory = selectedCategory === 'all' || quest.category === selectedCategory;
    const matchesDifficulty = difficultyFilter === 'all' || quest.difficulty === difficultyFilter;
    const matchesSearch =
      quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quest.stateName && quest.stateName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (quest.highlightArtisan && quest.highlightArtisan.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartApp = () => {
    setView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#FDF3EA] text-[#1C1440] flex flex-col font-body selection:bg-[#FFD38A] selection:text-[#1C1440]">
        <LandingNavbar
          onLoginClick={() => setAuthModal('login')}
          onRegisterClick={() => setAuthModal('register')}
          onExploreClick={handleStartApp}
          onStartJourneyClick={() => setJourneyModalOpen(true)}
          onOpenPlanner={() => handleOpenPlanner()}
          currentUser={currentUserSession}
          onLogout={handleLogout}
        />
        <Hero
          onExploreClick={handleStartApp}
          onStartJourneyClick={() => setJourneyModalOpen(true)}
          onOpenPlanner={() => handleOpenPlanner()}
        />
        <WhatIsRaahi />
        <RaahiBook />
        <RaahiFinds />
        <TakeAPieceOfThePlace
          onOpenExperience={(stateId) => {
            setSelectedCulturalState(stateId);
            setCulturalExperienceOpen(true);
          }}
        />
        <FinalStatement onStartWanderingClick={() => setJourneyModalOpen(true)} />
        <Footer onStartClick={() => setJourneyModalOpen(true)} />

        <AuthModal
          isOpen={authModal !== null}
          initialMode={authModal || 'login'}
          onClose={() => setAuthModal(null)}
          onSuccess={(authData) => {
            setAuthModal(null);
            if (authData?.name) {
              setCurrentUserSession(authData);
              setUser((prev) => ({
                ...prev,
                name: authData.name,
              }));
            }
            // Navigate directly to planner with stored user session
            setView('app');
            setActiveTab('planner');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSwitchToJourney={() => {
            setAuthModal(null);
            setJourneyModalOpen(true);
          }}
        />

        <JourneyBuilderModal
          isOpen={journeyModalOpen}
          onClose={() => setJourneyModalOpen(false)}
          onComplete={(prompt) => {
            setJourneyModalOpen(false);
            handleOpenPlanner(prompt);
          }}
        />

        <CulturalFashionExperienceModal
          isOpen={culturalExperienceOpen}
          initialStateId={selectedCulturalState}
          onClose={() => setCulturalExperienceOpen(false)}
          onJourneyUpdated={(maker: LocalMaker) => {
            setUser((prev) => ({
              ...prev,
              coins: prev.coins + 50,
            }));
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-signboard-dark text-parchment flex flex-col font-body selection:bg-marigold selection:text-signboard-navy"
         style={{ background: 'linear-gradient(160deg, #0E0924 0%, #1C1440 50%, #120C2B 100%)' }}>
      {/* Navigation Bar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenSIHModal={() => setShowSIHModal(true)}
        onBackToLanding={() => {
          playClickSound();
          setView('landing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        selectedStateName={selectedState?.name}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* 0. AI ITINERARY PLANNER */}
        {activeTab === 'planner' && (
          <PlannerView
            initialPrompt={initialPlannerPrompt}
            onExploreQuests={() => {
              playClickSound();
              setActiveTab('quests');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 1. INDIA MAP */}
        {activeTab === 'india-map' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {!bannerAlertDismissed && (
              <CrowdBalancerBanner
                onSelectQuest={(q) => {
                  playClickSound();
                  setActiveQuest(q);
                }}
              />
            )}

            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 border-b border-marigold/30 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-signboard-pink mb-1">
                  <Sparkles className="w-4 h-4 text-marigold" />
                  <span>Interactive India Map Explorer</span>
                </div>
                <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-parchment tracking-tight">
                  Gamified Indian Cultural Trails &amp; Quests
                </h1>
                <p className="text-xs sm:text-sm text-parchment/70 mt-1.5 max-w-3xl leading-relaxed">
                  Click any state on the map below to unlock regional folklore quests, meet generational GI craft artisans, taste indigenous recipes, and earn verified heritage explorer badges.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-3 bg-signboard-dark/80 backdrop-blur rounded-2xl border-2 border-marigold shadow-bollywood flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-carpet text-marigold flex items-center justify-center font-black text-base shadow">
                    36
                  </div>
                  <div className="text-xs leading-tight">
                    <p className="font-black text-marigold">States &amp; UTs Mapped</p>
                    <p className="text-parchment/70 font-bold">100% Interactive</p>
                  </div>
                </div>
              </div>
            </div>

            <IndiaMapCanvas
              onSelectState={handleSelectState}
              selectedStateId={selectedState?.id}
            />

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-black text-2xl text-parchment">
                    Popular State Heritage Quests
                  </h2>
                  <p className="text-xs text-parchment/60 font-semibold">
                    Select a featured cultural zone or start a live crowd-boosted trail
                  </p>
                </div>
                <button
                  onClick={() => { playClickSound(); setActiveTab('quests'); }}
                  className="text-xs font-black text-marigold hover:text-signboard-pink flex items-center gap-1.5 group transition-colors"
                >
                  <span>Browse All Trails</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ALL_INDIA_STATES.slice(0, 4).map((state) => (
                  <div
                    key={state.id}
                    onClick={() => { playClickSound(); handleSelectState(state); }}
                    className="group cursor-pointer rounded-2xl overflow-hidden bg-signboard-navy border-2 border-marigold/40 hover:border-marigold shadow-bollywood hover:shadow-bollywood-gold transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img src={state.heroImage} alt={state.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-signboard-dark/90 via-transparent to-transparent" />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-carpet text-marigold border border-marigold/50">
                        {state.zone} Zone
                      </div>
                      <div className="absolute bottom-2 inset-x-2 text-white">
                        <h3 className="font-display font-black text-lg drop-shadow">{state.name}</h3>
                      </div>
                    </div>
                    <div className="p-3.5 space-y-2">
                      <p className="text-xs text-parchment/70 font-semibold line-clamp-2">{state.tagline}</p>
                      <div className="flex flex-wrap gap-1">
                        {state.culturalHighlights.giCrafts.slice(0, 2).map((craft, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-marigold/10 text-marigold border border-marigold/30">
                            {craft}
                          </span>
                        ))}
                      </div>
                      <div className="pt-2 flex items-center justify-between text-xs font-black text-signboard-pink">
                        <span>Enter Quests</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 2. STATE DETAIL */}
        {activeTab === 'state-detail' && selectedState && (
          <StateDetailPage
            state={selectedState}
            onBackToMap={() => { playClickSound(); setActiveTab('india-map'); }}
            onStartQuest={(quest) => { playClickSound(); setActiveQuest(quest); }}
            userCompletedQuests={user.completedQuestIds}
          />
        )}

        {/* 3. QUESTS CATALOG */}
        {activeTab === 'quests' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {!bannerAlertDismissed && (
              <CrowdBalancerBanner
                onSelectQuest={(q) => { playClickSound(); setActiveQuest(q); }}
              />
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-marigold/30 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-signboard-pink mb-1">
                  <Sparkles className="w-4 h-4 text-marigold" />
                  <span>All Regional Cultural Quests ({filteredQuests.length})</span>
                </div>
                <h1 className="font-display font-black text-3xl sm:text-4xl text-parchment tracking-tight">Pan-India Heritage Trails Catalog</h1>
                <p className="text-xs sm:text-sm text-parchment/70 mt-1 max-w-2xl">
                  Turn your walk into a treasure trail. Connect with master artisans, solve folklore trivia, beat crowded queues, and unlock collectible badges.
                </p>
              </div>
              <button
                onClick={() => { playClickSound(); setActiveTab('india-map'); }}
                className="px-4 py-2.5 bg-marigold text-signboard-navy font-heading font-black text-xs rounded-2xl border-2 border-signboard-navy transition-all flex items-center gap-2 self-start md:self-auto shrink-0 shadow-bollywood hover:shadow-bollywood-lg active:scale-95"
              >
                <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
                <span>Open India Map</span>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-signboard-navyDeep/80 backdrop-blur p-4 rounded-3xl border border-marigold/20 shadow-sm">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'All Story Trails' },
                  { id: 'artisan', label: 'Artisans & Handloom' },
                  { id: 'food', label: 'Spices & Cuisine' },
                  { id: 'heritage', label: 'Monuments & Stepwells' },
                  { id: 'night', label: 'Night Puppetry & Bazaars' },
                  { id: 'nature', label: 'Sacred Banyan & Rivers' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { playClickSound(); setSelectedCategory(cat.id as QuestCategory); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-marigold text-signboard-navy shadow-bollywood border-2 border-signboard-navy'
                        : 'bg-signboard-dark/60 text-parchment/70 hover:bg-signboard-navy hover:text-parchment border border-marigold/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-4 h-4 text-marigold absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search state, craft, city..."
                    className="w-full pl-9 pr-3 py-2 bg-signboard-dark/60 rounded-xl text-xs font-semibold border border-marigold/20 focus:outline-none focus:ring-2 focus:ring-marigold text-parchment placeholder:text-parchment/40"
                  />
                </div>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value as any)}
                  className="bg-signboard-dark/60 border border-marigold/20 rounded-xl px-3 py-2 text-xs font-bold text-parchment focus:outline-none focus:ring-2 focus:ring-marigold"
                >
                  <option value="all">All Levels</option>
                  <option value="Easy">Easy Walk</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Adventurer">Adventurer</option>
                </select>
              </div>
            </div>

            {filteredQuests.length > 0 ? (
              <div ref={questListRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    isCompleted={user.completedQuestIds.includes(quest.id)}
                    onSelect={(q) => { playClickSound(); setActiveQuest(q); }}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-signboard-navyDeep/80 rounded-3xl border border-marigold/20 space-y-3">
                <p className="text-base font-bold text-parchment">No trails match your search filter</p>
                <p className="text-xs text-parchment/60">Try adjusting category chips or search keywords.</p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setDifficultyFilter('all'); }}
                  className="px-4 py-2 bg-marigold text-signboard-navy text-xs font-black rounded-xl shadow-bollywood border-2 border-signboard-navy"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. 3D DISTRICT EXPLORER */}
        {activeTab === '3d-district' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-signboard-navyDeep/80 backdrop-blur p-6 rounded-3xl border border-marigold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-signboard-pink mb-1">
                  <Sparkles className="w-4 h-4 text-marigold" />
                  <span>Real-time Three.js WebGL Engine</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-parchment">
                  3D Living Heritage Island &amp; Spatial Quest Navigator
                </h2>
                <p className="text-xs sm:text-sm text-parchment/70 mt-1 max-w-2xl">
                  Rotate the 3D district model to discover hidden artisan alleys, water stepwells, banyan sanctuaries, and night markets.
                </p>
              </div>
              <span className="px-3 py-1 bg-marigold text-signboard-navy text-xs font-black rounded-xl border-2 border-signboard-navy shadow-bollywood">
                WebGL Active • 60 FPS
              </span>
            </div>
            <ThreeDistrictViewer onSelectQuest={(q) => { playClickSound(); setActiveQuest(q); }} />
          </div>
        )}

        {/* 5. CROWD BALANCER */}
        {activeTab === 'crowd' && (
          <CrowdHeatmapView onSelectQuest={(q) => { playClickSound(); setActiveQuest(q); }} />
        )}

        {/* 6. ARTISAN MARKETPLACE */}
        {activeTab === 'artisans' && (
          <ArtisanMarketplace user={user} onRedeemVoucher={handleRedeemVoucher} />
        )}

        {/* 7. HERITAGE PASSPORT */}
        {activeTab === 'passport' && (
          <HeritagePassport user={user} />
        )}

      </main>

      {/* Folk Art Divider Strip */}
      <div className="relative mt-16 overflow-hidden" style={{ height: '90px', background: 'linear-gradient(90deg, #7A1026 0%, #1C1440 50%, #7A1026 100%)' }}>
        <div className="relative z-10 h-full flex items-center justify-center gap-6 px-6">
          <span className="text-marigold font-heading font-black text-base sm:text-xl tracking-widest uppercase drop-shadow-lg">
            🎨 Preserving India's Living Folk Art Traditions
          </span>
          <span className="hidden sm:block text-parchment/80 text-sm font-bold">• Warli • Madhubani • Pattachitra • Gond •</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="warli-footer text-parchment border-t-4 border-marigold py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left relative z-10">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="signboard-text text-2xl tracking-wide uppercase">RAAHI</span>
              <span className="text-[10px] bg-carpet text-marigold px-2 py-0.5 rounded-full font-bold border border-marigold">
                SIH 2026 #26204
              </span>
            </div>
            <p className="text-xs text-parchment/60 max-w-md">
              Boosting Cultural Tourism &amp; Smart Crowd Balancing across 28 States &amp; 8 UTs • Team Commit Issues
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-marigold">
            <button onClick={() => setActiveTab('india-map')} className="hover:text-signboard-pink transition-colors">India Map</button>
            <span>•</span>
            <button onClick={() => setShowSIHModal(true)} className="hover:text-signboard-pink transition-colors">SIH Architecture</button>
            <span>•</span>
            <button onClick={() => setActiveTab('quests')} className="hover:text-signboard-pink transition-colors">Quest Engine</button>
            <span>•</span>
            <button onClick={() => setActiveTab('crowd')} className="hover:text-signboard-pink transition-colors">Demand-Balancing</button>
            <span>•</span>
            <button onClick={() => setActiveTab('artisans')} className="hover:text-signboard-pink transition-colors">Artisan Hub</button>
          </div>
          <div className="text-xs text-marigold/60 font-medium">© 2026 Raahi India. Crafted with the Bollywood Signboard Palette.</div>
        </div>
      </footer>

      {activeQuest && (
        <ActiveQuestModal
          quest={activeQuest}
          user={user}
          onClose={() => setActiveQuest(null)}
          onCompleteQuest={handleCompleteQuest}
        />
      )}

      {showSIHModal && (
        <SIHInnovationModal onClose={() => setShowSIHModal(false)} />
      )}
    </div>
  );
}
