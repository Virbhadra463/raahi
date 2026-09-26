import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Flame,
  Award,
  ArrowRight,
  QrCode,
  Camera,
  Compass,
  Check,
  RotateCcw,
  Zap,
  AlertTriangle
} from 'lucide-react';

export default function QuestFeed({
  quests,
  selectedCity,
  selectedVibes,
  crowdSimulated,
  setCrowdSimulated,
  credits,
  setCredits,
  questsCompleted,
  setQuestsCompleted,
  userLevel,
  acceptedQuests,
  setAcceptedQuests,
  completedQuests,
  setCompletedQuests
}) {
  const [activeVerificationQuest, setActiveVerificationQuest] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#FF7A8D', '#FFD38A', '#7A1026', '#1C1440', '#22C55E'],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Accept a quest
  const handleAccept = (questId) => {
    setAcceptedQuests((prev) => [...prev, questId]);
    showToast('✨ Quest Accepted! Follow the narrative clue to the secret location.');
  };

  // Open verification dialog
  const handleOpenVerification = (quest) => {
    setActiveVerificationQuest(quest);
  };

  // Complete and claim reward
  const handleCompleteVerification = () => {
    if (!activeVerificationQuest) return;

    const quest = activeVerificationQuest;
    const isAccepted = acceptedQuests.includes(quest.id);

    // Calculate dynamic reward based on crowding simulation
    let reward = quest.baseReward;
    if (crowdSimulated) {
      if (quest.isLandmark) {
        reward = quest.crowdedReward || 50;
      } else if (quest.isDynamicAlternative) {
        reward = quest.surgeReward || 280;
      }
    }

    setCredits((prev) => prev + reward);
    setQuestsCompleted((prev) => prev + 1);
    setCompletedQuests((prev) => [...prev, quest.id]);
    if (!isAccepted) {
      setAcceptedQuests((prev) => [...prev, quest.id]);
    }

    triggerConfetti();
    showToast(
      `🎉 Quest Completed! Earned +${reward} Raahi Credits. Next neighborhood mystery unlocked!`
    );
    setActiveVerificationQuest(null);
  };

  // Reset demo
  const handleResetDemo = () => {
    setCredits(180);
    setQuestsCompleted(1);
    setAcceptedQuests(['quest-1']);
    setCompletedQuests([]);
    setCrowdSimulated(true);
    showToast('Demo reset to initial state.');
  };

  return (
    <section id="quests-demo" className="py-24 bg-[#FAF5EE] border-b-2 border-zinc-200 relative text-signboard-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Live Player Dashboard */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-signboard-pink/20 border-2 border-signboard-pink/60 text-signboard-navy text-xs font-heading font-black uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4 text-carpet-maroon" />
              <span>Interactive Quest Simulation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-signboard-navy">
              Live Quest Feed & Footfall Engine
            </h2>
            <p className="mt-2 text-base text-signboard-navy/85 font-medium max-w-2xl">
              Experience the live game loop: Accept story clues, verify local arrival, earn Raahi Credits, and see how dynamic surge rewards prevent overcrowding.
            </p>
          </div>

          {/* Traveler Status HUD */}
          <div className="bg-signboard-navy text-parchment rounded-3xl p-5 sm:p-6 shadow-signboard border-2 border-marigold flex flex-wrap items-center justify-between sm:justify-start gap-6 lg:shrink-0">
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-marigold">
                Current Raahi Level
              </div>
              <div className="font-heading font-black text-lg sm:text-xl text-parchment flex items-center gap-2 mt-0.5">
                <span>{userLevel}</span>
                <span className="text-xs bg-marigold text-signboard-navy px-2.5 py-0.5 rounded-full font-black">
                  Tier {Math.floor(credits / 200) + 1}
                </span>
              </div>
            </div>

            <div className="h-9 w-[2px] bg-parchment/30 hidden sm:block" />

            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-marigold">
                Raahi Credits
              </div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-marigold flex items-baseline gap-1 mt-0.5">
                <span>{credits}</span>
                <span className="text-xs text-parchment font-bold">RC</span>
              </div>
            </div>

            <div className="h-9 w-[2px] bg-parchment/30 hidden sm:block" />

            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-marigold">
                Completed
              </div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-signboard-pink flex items-baseline gap-1 mt-0.5">
                <span>{questsCompleted}</span>
                <span className="text-xs text-parchment font-bold">quests</span>
              </div>
            </div>

            <button
              onClick={handleResetDemo}
              title="Reset Demo State"
              className="p-2.5 rounded-xl bg-parchment/15 hover:bg-parchment/30 text-parchment transition-colors ml-auto sm:ml-2 cursor-pointer border border-parchment/30"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Crowding Simulator Toggle */}
        <div className="mb-10 bg-white rounded-3xl p-6 sm:p-7 border-3 border-signboard-navy shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-start gap-4">
              <div className={`p-3.5 rounded-2xl ${crowdSimulated ? 'bg-orange-600 text-white' : 'bg-emerald-600 text-white'} shadow-md shrink-0 transition-colors`}>
                {crowdSimulated ? <Flame className="w-7 h-7 animate-bounce" /> : <Zap className="w-7 h-7" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-carpet-maroon">
                    Live Demand Engine Control
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-zinc-200 px-2.5 py-0.5 rounded text-zinc-800">
                    Adaptive Demand Balancing v1.0
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-signboard-navy mt-1">
                  Crowd-Balancing Surge Engine
                </h3>
                <p className="text-xs sm:text-sm text-signboard-navy/85 font-medium mt-1 max-w-2xl leading-relaxed">
                  {crowdSimulated
                    ? '🔥 Simulation ACTIVE: Primary landmark is experiencing peak congestion (45m wait). RAAHI dynamically slashes landmark rewards and boosts nearby artisan lanes to 2x Credits + treats.'
                    : '⚡ Normal Flow: Landmark footfall is evenly distributed. Normal baseline rewards apply across all routes.'}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-4 bg-zinc-50 p-3.5 rounded-2xl border-2 border-zinc-300 shrink-0 self-start md:self-auto">
              <span className="text-xs font-heading font-black text-signboard-navy">
                Simulate Crowding
              </span>
              <button
                onClick={() => setCrowdSimulated(!crowdSimulated)}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                  crowdSimulated ? 'bg-carpet-maroon' : 'bg-zinc-400'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                    crowdSimulated ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

          </div>

          {/* Educational Callout */}
          <div className="mt-5 pt-4 border-t-2 border-zinc-100 flex items-center gap-2 text-xs sm:text-sm font-semibold text-signboard-navy bg-amber-50/80 p-3.5 rounded-xl border border-amber-300">
            <span className="font-heading font-black text-carpet-maroon text-sm">Why this works:</span>
            <span>
              "When a spot gets crowded, RAAHI boosts rewards nearby instead of just showing a negative warning label — <strong>the incentive does the work</strong> and crowds disperse naturally."
            </span>
          </div>
        </div>

        {/* Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quests.map((quest) => {
            const isCompleted = completedQuests.includes(quest.id);
            const isAccepted = acceptedQuests.includes(quest.id);

            let currentReward = quest.baseReward;
            let surgeActive = false;
            let crowdPenalty = false;

            if (crowdSimulated) {
              if (quest.isLandmark) {
                currentReward = quest.crowdedReward || 50;
                crowdPenalty = true;
              } else if (quest.isDynamicAlternative) {
                currentReward = quest.surgeReward || 280;
                surgeActive = true;
              }
            }

            return (
              <motion.div
                key={quest.id}
                layout
                className={`bg-white rounded-3xl p-6 sm:p-7 border-3 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  surgeActive
                    ? 'border-marigold shadow-signboard-gold ring-4 ring-marigold/50 bg-gradient-to-b from-amber-50/30 to-white'
                    : crowdPenalty
                    ? 'border-red-400 shadow-md bg-red-50/20'
                    : isCompleted
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-sm'
                    : 'border-signboard-navy/20 hover:border-signboard-navy shadow-md'
                }`}
              >
                {/* Dynamic Status Badges */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  {surgeActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-marigold text-signboard-navy text-xs font-heading font-black tracking-wide shadow-sm animate-pulse border border-signboard-navy">
                      <Sparkles className="w-3.5 h-3.5 text-signboard-navy" />
                      <span>✨ Dynamic Bonus · 2x Credits</span>
                    </span>
                  ) : crowdPenalty ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-heading font-black border border-red-300">
                      <Flame className="w-3.5 h-3.5 text-red-600" />
                      <span>🔥 Crowded Right Now</span>
                    </span>
                  ) : isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-heading font-black border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Quest Completed</span>
                    </span>
                  ) : isAccepted ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-signboard-navy text-parchment text-xs font-heading font-black">
                      <Compass className="w-3.5 h-3.5 text-marigold animate-spin" />
                      <span>In Progress</span>
                    </span>
                  ) : (
                    <span className="text-xs font-heading font-black text-signboard-navy bg-zinc-100 px-3 py-1 rounded-md border border-zinc-300">
                      {quest.difficulty || 'Story Quest'}
                    </span>
                  )}

                  {/* Reward Pill */}
                  <div
                    className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full font-heading font-black text-xs sm:text-sm shadow-sm ${
                      surgeActive
                        ? 'bg-carpet-maroon text-marigold border border-marigold'
                        : crowdPenalty
                        ? 'bg-red-100 text-red-700 line-through decoration-red-600 font-bold'
                        : 'bg-marigold text-signboard-navy border border-signboard-navy'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>+{currentReward} RC</span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-heading font-black text-signboard-navy leading-snug mb-1">
                    {quest.title}
                  </h3>
                  <div className="text-xs font-bold text-carpet-maroon mb-4 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-carpet-maroon shrink-0" />
                    <span>{quest.location}</span>
                  </div>

                  {/* Narrative Clue Box */}
                  <div className="bg-[#FAF5EE] p-4 rounded-2xl border-2 border-zinc-200 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-signboard-navy/60 block mb-1">
                      Narrative Wayfarer Clue
                    </span>
                    <p className="font-handwriting font-bold text-signboard-navy text-sm sm:text-base leading-snug">
                      "{quest.narrativeClue}"
                    </p>
                  </div>

                  {/* Special Perk Callout if surge */}
                  {surgeActive && quest.bonusPerk && (
                    <div className="mb-4 bg-marigold/30 p-3 rounded-xl border-2 border-marigold text-xs font-black text-signboard-navy flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-terracotta shrink-0" />
                      <span>Special: {quest.bonusPerk}</span>
                    </div>
                  )}

                  {/* Crowd wait warning if crowded */}
                  {crowdPenalty && (
                    <div className="mb-4 bg-red-50 p-3 rounded-xl border border-red-300 text-xs font-bold text-red-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Current wait time: 45+ mins. High congestion area.</span>
                    </div>
                  )}

                  {/* Meta Tags */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-600 mb-6">
                    <span className="flex items-center gap-1 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-300">
                      <Clock className="w-3.5 h-3.5 text-terracotta" />
                      <span>{quest.timeEstimate}</span>
                    </span>
                    <span className="bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-300">
                      {quest.verificationMethod}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                  {isCompleted ? (
                    <div className="w-full py-3 px-4 rounded-full bg-emerald-100 text-emerald-900 font-heading font-black text-xs sm:text-sm text-center border-2 border-emerald-400 flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                      <span>Completed & Logged in Diary</span>
                    </div>
                  ) : isAccepted ? (
                    <button
                      onClick={() => handleOpenVerification(quest)}
                      className="w-full py-3 px-4 rounded-full bg-signboard-navy hover:bg-signboard-dark active:scale-95 text-marigold font-heading font-black text-xs sm:text-sm text-center shadow-signboard flex items-center justify-center gap-2 cursor-pointer transition-transform"
                    >
                      <span>Mark Complete & Verify</span>
                      <CheckCircle2 className="w-4 h-4 text-marigold stroke-[2.5]" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAccept(quest.id)}
                      className={`w-full py-3 px-4 rounded-full font-heading font-black text-xs sm:text-sm text-center shadow-signboard flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 ${
                        surgeActive
                          ? 'bg-marigold hover:bg-amber-300 text-signboard-navy'
                          : 'bg-white hover:bg-signboard-navy hover:text-parchment text-signboard-navy border-2 border-signboard-navy'
                      }`}
                    >
                      <span>Accept Quest</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Verification Simulation Modal */}
        <AnimatePresence>
          {activeVerificationQuest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-signboard-dark/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                className="bg-white text-signboard-navy w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border-3 border-signboard-navy relative"
              >
                <div className="flex items-center justify-between pb-4 border-b-2 border-zinc-200">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-carpet-maroon" />
                    <span className="font-heading font-black text-signboard-navy text-base sm:text-lg">
                      Verify & Claim Quest Rewards
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveVerificationQuest(null)}
                    className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-signboard-navy font-black cursor-pointer text-lg"
                  >
                    &times;
                  </button>
                </div>

                <div className="py-6 space-y-4">
                  <h3 className="font-heading font-black text-2xl text-signboard-navy">
                    {activeVerificationQuest.title}
                  </h3>
                  <p className="text-sm text-signboard-navy/85 font-medium">
                    {activeVerificationQuest.actionPrompt}
                  </p>

                  <div className="bg-[#FAF5EE] p-5 rounded-2xl border-2 border-zinc-200 space-y-3">
                    <div className="text-xs font-black text-signboard-navy uppercase tracking-wider">
                      Simulate Verification Method:
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 bg-white rounded-xl border-2 border-zinc-300 text-center flex flex-col items-center gap-1.5 cursor-pointer hover:border-marigold transition-colors shadow-sm">
                        <QrCode className="w-7 h-7 text-signboard-navy" />
                        <span className="text-xs font-bold text-signboard-navy">Merchant QR</span>
                        <span className="text-[10px] text-zinc-500 font-semibold">Scan at register</span>
                      </div>
                      <div className="p-3.5 bg-white rounded-xl border-2 border-zinc-300 text-center flex flex-col items-center gap-1.5 cursor-pointer hover:border-marigold transition-colors shadow-sm">
                        <Camera className="w-7 h-7 text-carpet-maroon" />
                        <span className="text-xs font-bold text-signboard-navy">Photo Stamp</span>
                        <span className="text-[10px] text-zinc-500 font-semibold">Snap secret spot</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-marigold/30 p-4 rounded-xl border-2 border-marigold">
                    <span className="text-xs font-heading font-black text-signboard-navy uppercase">
                      Reward Payout:
                    </span>
                    <span className="font-heading font-black text-lg text-carpet-maroon">
                      +{crowdSimulated && activeVerificationQuest.isDynamicAlternative ? activeVerificationQuest.surgeReward || 280 : activeVerificationQuest.baseReward} Raahi Credits
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-zinc-200">
                  <button
                    onClick={() => setActiveVerificationQuest(null)}
                    className="px-5 py-2.5 rounded-full text-xs font-heading font-black text-signboard-navy hover:bg-zinc-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCompleteVerification}
                    className="bg-carpet-maroon hover:bg-carpet-dark active:scale-95 text-parchment font-heading font-black text-sm px-6 py-2.5 rounded-full shadow-signboard flex items-center gap-2 cursor-pointer transition-transform"
                  >
                    <span>Confirm & Unlock Next</span>
                    <Sparkles className="w-4 h-4 text-marigold" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 z-50 bg-signboard-navy text-parchment px-6 py-4 rounded-2xl shadow-signboard border-2 border-marigold flex items-center gap-3 max-w-md"
            >
              <div className="w-9 h-9 rounded-full bg-marigold text-signboard-navy flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <p className="text-xs sm:text-sm font-bold leading-snug">
                {toastMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
