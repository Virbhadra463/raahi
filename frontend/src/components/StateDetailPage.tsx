import React, { useState, useMemo } from 'react';
import { IndiaState, Quest, ArtisanVendor } from '../types';
import { STATE_SPECIFIC_QUESTS } from '../data/indiaData';
import { QUESTS, ARTISAN_VENDORS } from '../data/mockData';
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  Clock,
  Coins,
  ShieldCheck,
  Flame,
  Layers,
  Award,
  ChevronRight,
  Gift,
  Compass,
  CheckCircle2,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface StateDetailPageProps {
  state: IndiaState;
  onBackToMap: () => void;
  onStartQuest: (quest: Quest) => void;
  userCompletedQuests: string[];
}

export const StateDetailPage: React.FC<StateDetailPageProps> = ({
  state,
  onBackToMap,
  onStartQuest,
  userCompletedQuests
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Quests for this state
  const stateQuests = useMemo(() => {
    // 1. Check in STATE_SPECIFIC_QUESTS
    const directQuests = STATE_SPECIFIC_QUESTS.filter((q) => q.stateId === state.id);
    // 2. Check in main QUESTS
    const mainQuests = QUESTS.filter((q) => q.stateId === state.id);
    
    // Combine unique by id
    const combined = [...directQuests];
    mainQuests.forEach((mq) => {
      if (!combined.some((q) => q.id === mq.id)) {
        combined.push(mq);
      }
    });

    // If state has no quests yet, generate an authentic fallback quest for this specific state
    if (combined.length === 0) {
      const generated: Quest = {
        id: `quest-${state.id}-heritage`,
        stateId: state.id,
        stateName: state.name,
        title: `${state.name} Heritage & GI Craft Trail`,
        tagline: `Discover centuries of ${state.culturalHighlights.giCrafts[0] || 'indigenous'} craftsmanship in ${state.capital}`,
        description: `Immerse yourself in ${state.name}'s living cultural heritage. Follow old artisan guild routes, taste signature ${state.culturalHighlights.delicacies[0] || 'delicacies'}, and support local master craftspeople.`,
        category: 'artisan',
        difficulty: 'Easy',
        estimatedTime: '45 mins',
        totalXp: 350,
        totalCoins: 120,
        heroImage: state.heroImage,
        coords3D: state.coords3D,
        isCrowdBalancingBoosted: !!state.crowdAlert?.hasAlert,
        crowdMultiplier: state.crowdAlert?.multiplier || 1.5,
        crowdReason: state.crowdAlert?.hasAlert
          ? `⚡ ${state.crowdAlert.multiplier}X CROWD BOOSTER: Redirecting traffic away from overcrowded hotspots to historic artisan clusters!`
          : undefined,
        highlightArtisan: `${state.culturalHighlights.giCrafts[0] || 'Handloom'} Master Guild`,
        badgeReward: {
          id: `badge-${state.id}-explorer`,
          name: `${state.name} Heritage Seeker`,
          icon: 'Sparkles',
          color: state.colorHex,
          description: `Completed authentic heritage exploration in ${state.name}.`
        },
        stops: [
          {
            id: `stop-${state.id}-1`,
            name: `${state.capital} Historic Craft Guild Quarter`,
            category: 'artisan',
            description: `Visit traditional workshops creating authentic ${state.culturalHighlights.giCrafts.join(', ')}.`,
            historicalFact: `${state.name} has preserved these artisan techniques across generations of guild masters.`,
            artisanName: `Generational Guild Master of ${state.culturalHighlights.giCrafts[0] || 'Handicrafts'}`,
            location: `Old Bazaar, ${state.capital}`,
            lat: state.coords3D[0] * 5 + 20,
            lng: state.coords3D[1] * 5 + 75,
            challengeType: 'dialogue',
            artisanDialogue: {
              speaker: 'Master Artisan',
              quote: `"Our hands remember what books forget. Every thread and clay curve carries the spirit of ${state.name}."`,
              actionPrompt: `Learn the signature technique of ${state.culturalHighlights.giCrafts[0] || 'local craft'} and verify your check-in!`
            },
            rewardXp: 150,
            rewardCoins: 50,
            image: state.heroImage
          },
          {
            id: `stop-${state.id}-2`,
            name: `The ${state.culturalHighlights.delicacies[0] || 'Traditional'} Culinary Hearth`,
            category: 'food',
            description: `Savor slow-cooked local recipes made with authentic regional spices and wood-fired ovens.`,
            historicalFact: `Culinary traditions in ${state.name} date back hundreds of years using locally farmed seasonal ingredients.`,
            location: `Heritage Food Arcade, ${state.capital}`,
            lat: state.coords3D[0] * 5 + 20.02,
            lng: state.coords3D[1] * 5 + 75.02,
            challengeType: 'trivia',
            trivia: {
              question: `Which famous GI craft or art form originates in ${state.name}?`,
              options: [
                state.culturalHighlights.giCrafts[0] || 'Handloom',
                'Generic Plastic Souvenirs',
                'Factory Printed Goods',
                'Standard Synthetic Fabric'
              ],
              correctIndex: 0,
              explanation: `${state.culturalHighlights.giCrafts[0] || 'This craft'} is an official Geographical Indication (GI) protected treasure of ${state.name}!`
            },
            rewardXp: 200,
            rewardCoins: 70,
            image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80'
          }
        ]
      };
      combined.push(generated);
    }

    return combined;
  }, [state]);

  const filteredQuests = useMemo(() => {
    if (selectedCategory === 'all') return stateQuests;
    return stateQuests.filter((q) => q.category === selectedCategory);
  }, [stateQuests, selectedCategory]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => {
            playClickSound();
            onBackToMap();
          }}
          className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-[#E85B70] text-white border border-white/20 font-bold text-xs sm:text-sm flex items-center gap-2 backdrop-blur-md transition-all shadow-md group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to 3D India Map</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-[#FFD38A]">
          <span>India</span>
          <ChevronRight className="w-3.5 h-3.5 text-white/50" />
          <span>{state.zone} Zone</span>
          <ChevronRight className="w-3.5 h-3.5 text-white/50" />
          <span className="text-white bg-[#7A1026] px-2.5 py-0.5 rounded-full border border-[#FFD38A]">
            {state.name}
          </span>
        </div>
      </div>

      {/* State Hero Cultural Banner */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-[#E5A532] shadow-2xl bg-[#1C1440] text-white">
        
        {/* Background Image with warm Cultural Gradient */}
        <div className="absolute inset-0">
          <img
            src={state.heroImage}
            alt={state.name}
            className="w-full h-full object-cover opacity-35 scale-105 transform hover:scale-100 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1440] via-[#450915]/85 to-[#1C1440]/95" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-6">
          
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#7A1026] text-white border border-[#FFD38A]">
              {state.type} • {state.zone} Zone
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white backdrop-blur-md border border-white/20">
              Capital: {state.capital}
            </span>
            {state.crowdAlert?.hasAlert && (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#F59E0B] text-[#1C1440] border border-[#FFD38A] flex items-center gap-1.5 shadow-lg">
                <Flame className="w-4 h-4 text-[#E85B70] animate-bounce" />
                {state.crowdAlert.multiplier}x Crowd Balancing XP Active
              </span>
            )}
          </div>

          {/* Main Title & Description */}
          <div className="space-y-2 max-w-3xl">
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              {state.name}
            </h1>
            <p className="text-sm sm:text-base text-[#FFD38A] font-medium leading-relaxed">
              {state.description}
            </p>
          </div>

          {/* Cultural Highlights Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* GI Crafts */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#FFD38A] uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#FFB300]" />
                <span>Protected GI Crafts</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {state.culturalHighlights.giCrafts.map((craft, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#450915]/60 text-white border border-[#FFD38A]/40"
                  >
                    {craft}
                  </span>
                ))}
              </div>
            </div>

            {/* Delicacies */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#FFD38A] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#FFB300]" />
                <span>Culinary Heritage</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {state.culturalHighlights.delicacies.map((delicacy, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#E85B70]/60 text-white border border-[#FFD38A]/40"
                  >
                    {delicacy}
                  </span>
                ))}
              </div>
            </div>

            {/* Living Traditions */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#FFD38A] uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[#FFB300]" />
                <span>Living Folk Lore</span>
              </div>
              <p className="text-xs text-white/90 font-medium line-clamp-2">
                {state.culturalHighlights.traditions.join(' • ')}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Category Filter Tabs for State Quests */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="font-display font-black text-2xl text-[#1C1440]">
            Available Quests in {state.name} ({filteredQuests.length})
          </h2>
          <p className="text-xs text-[#120C2B] font-semibold">
            Complete stops, meet verified artisans, and earn official state explorer badges!
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['all', 'artisan', 'heritage', 'food', 'night', 'nature'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playClickSound();
                setSelectedCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#E85B70] to-[#E65100] text-white shadow-md border border-[#FFD38A]'
                  : 'bg-white text-[#1C1440] hover:bg-[#FFD38A]/30 border border-[#FFD38A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quests Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredQuests.map((quest) => {
          const isCompleted = userCompletedQuests.includes(quest.id);

          return (
            <div
              key={quest.id}
              className={`rounded-3xl overflow-hidden border-2 transition-all flex flex-col justify-between shadow-xl ${
                quest.isCrowdBalancingBoosted
                  ? 'border-[#F59E0B] bg-gradient-to-b from-[#FFF9F3] to-white ring-2 ring-[#FFB300]/50'
                  : 'border-[#FFD38A] bg-white'
              }`}
            >
              {/* Quest Image Header */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src={quest.heroImage}
                  alt={quest.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badges on Image */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#7A1026] text-white border border-[#FFD38A] shadow-md">
                    {quest.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
                    {quest.difficulty}
                  </span>
                </div>

                {quest.isCrowdBalancingBoosted && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F59E0B] text-[#1C1440] border border-white flex items-center gap-1 shadow-lg animate-pulse">
                    <Flame className="w-3.5 h-3.5 text-[#E85B70]" />
                    <span>{quest.crowdMultiplier || 1.8}x Crowd Multiplier</span>
                  </div>
                )}

                {/* Bottom of Image: Title */}
                <div className="absolute bottom-3 inset-x-3 text-white">
                  <h3 className="font-display font-black text-lg sm:text-xl leading-snug drop-shadow-md">
                    {quest.title}
                  </h3>
                </div>
              </div>

              {/* Quest Details Body */}
              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-[#1C1440]/80 font-medium leading-relaxed">
                    {quest.description}
                  </p>

                  {/* Highlights & Crowd reason */}
                  {quest.crowdReason && (
                    <div className="p-3 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-xs font-bold text-[#450915] flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#E85B70] shrink-0" />
                      <span>{quest.crowdReason}</span>
                    </div>
                  )}

                  {/* Key Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#FFD38A]/20 border border-[#FFD38A]/50 text-xs font-bold text-[#1C1440]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#7A1026]" />
                      <span>{quest.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#450915]">
                      <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>+{quest.totalXp} XP</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#E85B70]">
                      <Coins className="w-3.5 h-3.5 text-[#FFB300]" />
                      <span>+{quest.totalCoins} Coins</span>
                    </div>
                  </div>

                  {/* Stops preview */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-[#120C2B] tracking-wider">
                      {quest.stops.length} Interactive Stops along this trail:
                    </span>
                    <div className="space-y-1">
                      {quest.stops.map((stop, idx) => (
                        <div
                          key={stop.id}
                          className="text-xs text-[#1C1440] font-medium flex items-center gap-2 pl-1"
                        >
                          <span className="w-4 h-4 rounded-full bg-[#450915] text-white text-[9px] font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="truncate">{stop.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Launch Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      playClickSound();
                      onStartQuest(quest);
                    }}
                    className={`w-full py-3.5 px-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg border-2 ${
                      isCompleted
                        ? 'bg-[#8A8635] text-white border-[#FFD38A]'
                        : 'bg-gradient-to-r from-[#E85B70] via-[#E65100] to-[#FFB300] text-white border-[#FFD38A] hover:brightness-110 hover:scale-[1.01]'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Replay Completed Quest (+Bonus Coins)</span>
                      </>
                    ) : (
                      <>
                        <Compass className="w-4 h-4" />
                        <span>Start Quest with 3D GPS Guide</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Verified Local Artisan Guilds of the Region */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#1C1440] via-[#120C2B] to-[#450915] text-white border-2 border-[#E5A532] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FFB300]" />
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FFD38A]">
                Direct Economic Support
              </span>
            </div>
            <h3 className="font-display font-black text-2xl text-white">
              Master Artisan Guilds of {state.name}
            </h3>
          </div>
          <span className="text-xs text-[#FFD38A] font-bold">
            100% of Token Vouchers go directly to artisan families
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {ARTISAN_VENDORS.slice(0, 2).map((artisan) => (
            <div
              key={artisan.id}
              className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-4"
            >
              <img
                src={artisan.image}
                alt={artisan.name}
                className="w-16 h-16 rounded-xl object-cover border border-[#FFD38A] shrink-0"
              />
              <div className="space-y-1">
                <h4 className="font-display font-black text-sm text-white">
                  {artisan.name}
                </h4>
                <p className="text-xs text-[#FFD38A] font-medium">{artisan.craft}</p>
                <div className="flex items-center gap-2 pt-1 text-[10px] font-bold text-white/80">
                  <Gift className="w-3 h-3 text-[#FFB300]" />
                  <span>{artisan.voucherDiscount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
