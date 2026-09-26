import React, { useState } from 'react';
import { Quest, QuestStop, UserProfile } from '../types';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  MapPin,
  Sparkles,
  Coins,
  Zap,
  ChevronRight,
  QrCode,
  Camera,
  MessageSquare,
  HelpCircle,
  Award,
  Navigation,
  ShieldCheck,
  RotateCcw,
  Compass
} from 'lucide-react';
import { playClickSound, playCoinSound, playQuestCompleteFanfare, playStampSound } from '../utils/audio';
import { ThreeBadgeViewer } from './ThreeBadgeViewer';

interface ActiveQuestModalProps {
  quest: Quest;
  onClose: () => void;
  onCompleteQuest: (quest: Quest, earnedXp: number, earnedCoins: number) => void;
  user: UserProfile;
}

export const ActiveQuestModal: React.FC<ActiveQuestModalProps> = ({
  quest,
  onClose,
  onCompleteQuest,
  user
}) => {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [selectedTriviaOption, setSelectedTriviaOption] = useState<number | null>(null);
  const [triviaSubmitted, setTriviaSubmitted] = useState(false);
  const [triviaCorrect, setTriviaCorrect] = useState(false);
  const [dialogueCompleted, setDialogueCompleted] = useState(false);
  const [photoVerified, setPhotoVerified] = useState(false);
  const [gpsVerified, setGpsVerified] = useState(false);
  const [showOfflineQr, setShowOfflineQr] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentStop = quest.stops[currentStopIndex];
  const totalStops = quest.stops.length;
  const progressPercent = Math.round(((currentStopIndex + (isFinished ? 1 : 0)) / totalStops) * 100);

  // Trigger celebration on final complete
  const handleFinalFinish = () => {
    setIsFinished(true);
    playQuestCompleteFanfare();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F09367', '#7A1026', '#E5A532', '#120C2B', '#FFD38A']
    });
    onCompleteQuest(quest, quest.totalXp, quest.totalCoins);
  };

  const handleNextStop = () => {
    playCoinSound();
    if (currentStopIndex < totalStops - 1) {
      setCurrentStopIndex((prev) => prev + 1);
      // Reset stop interaction states
      setSelectedTriviaOption(null);
      setTriviaSubmitted(false);
      setTriviaCorrect(false);
      setDialogueCompleted(false);
      setPhotoVerified(false);
      setGpsVerified(false);
      setShowOfflineQr(false);
    } else {
      handleFinalFinish();
    }
  };

  const handleVerifyGps = () => {
    playClickSound();
    setGpsVerified(true);
  };

  const handleVerifyPhoto = () => {
    playClickSound();
    setPhotoVerified(true);
  };

  const handleSelectTrivia = (idx: number) => {
    if (triviaSubmitted) return;
    playClickSound();
    setSelectedTriviaOption(idx);
  };

  const handleSubmitTrivia = () => {
    if (selectedTriviaOption === null || !currentStop.trivia) return;
    setTriviaSubmitted(true);
    const correct = selectedTriviaOption === currentStop.trivia.correctIndex;
    setTriviaCorrect(correct);
    if (correct) {
      playCoinSound();
    }
  };

  const isStopCompleted = () => {
    if (currentStop.challengeType === 'trivia') return triviaSubmitted && triviaCorrect;
    if (currentStop.challengeType === 'dialogue') return dialogueCompleted;
    if (currentStop.challengeType === 'photo') return photoVerified;
    if (currentStop.challengeType === 'checkin') return gpsVerified;
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#1C1440]/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl border-2 border-[#FFE4B5] shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#FFF9F3] to-[#FCEFD9] px-6 py-4 border-b border-[#FFA6B4]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7A1026] text-white flex items-center justify-center font-black">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7A1026]">
                Active Quest Session • {quest.category.toUpperCase()}
              </span>
              <h3 className="font-display font-black text-lg text-[#1C1440] line-clamp-1">{quest.title}</h3>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-xl text-[#120C2B] hover:bg-[#FFA6B4]/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2.5 bg-[#FDF3EA] border-b border-[#FFA6B4]/20 flex items-center justify-between text-xs font-bold text-[#120C2B]">
          <span>
            Milestone {Math.min(currentStopIndex + 1, totalStops)} of {totalStops}: {currentStop?.name}
          </span>
          <span className="text-[#7A1026] font-black">{progressPercent}% Completed</span>
        </div>
        <div className="w-full h-1.5 bg-[#FCEFD9]">
          <div
            className="h-full bg-gradient-to-r from-[#F09367] via-[#7A1026] to-[#450915] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Victory Screen when completed */}
        {isFinished ? (
          <div className="p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="inline-flex p-3 rounded-full bg-[#FFD38A]/40 border-2 border-[#FFD38A]">
              <Award className="w-12 h-12 text-[#7A1026] animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#7A1026]">
                Quest Trail Accomplished!
              </span>
              <h2 className="font-display font-black text-3xl text-[#1C1440] mt-1">
                Congratulations, {user.name}!
              </h2>
              <p className="text-sm text-[#120C2B] mt-2 max-w-md mx-auto">
                You successfully connected with local artisans, revived cultural storytelling, and earned your 3D digital heritage trophy!
              </p>
            </div>

            {/* 3D Badge Reward Preview */}
            <div className="bg-gradient-to-b from-[#FFF9F3] to-[#FCEFD9] p-4 rounded-3xl border-2 border-[#F09367] max-w-sm mx-auto shadow-inner">
              <ThreeBadgeViewer
                colorHex={quest.badgeReward.color}
                badgeName={quest.badgeReward.name}
                isUnlocked={true}
              />
              <p className="text-xs text-[#120C2B] mt-1 italic">
                "{quest.badgeReward.description}"
              </p>
            </div>

            {/* Rewards Summary */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-3.5 bg-[#FFF9F3] rounded-2xl border border-[#FFA6B4]/40 text-center">
                <span className="text-xs text-[#8A8635] font-bold">XP Gained</span>
                <div className="text-2xl font-black text-[#7A1026] flex items-center justify-center gap-1 mt-1">
                  <Zap className="w-5 h-5 fill-[#7A1026]" />
                  <span>+{quest.totalXp}</span>
                </div>
              </div>
              <div className="p-3.5 bg-[#FFF9F3] rounded-2xl border border-[#FFA6B4]/40 text-center">
                <span className="text-xs text-[#8A8635] font-bold">T-Coins Earned</span>
                <div className="text-2xl font-black text-[#9C1A35] flex items-center justify-center gap-1 mt-1">
                  <Coins className="w-5 h-5 text-[#E5A532] fill-[#FFD38A]" />
                  <span>+{quest.totalCoins}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#7A1026] hover:bg-[#E85B70] text-white font-black text-sm rounded-2xl shadow-xl transition-all"
            >
              Collect Rewards & View Passport
            </button>
          </div>
        ) : (
          /* Active Stop Gameplay Body */
          <div className="p-6 space-y-5">
            {/* Stop Hero & Description */}
            <div className="relative h-44 rounded-2xl overflow-hidden bg-[#FCEFD9] border border-[#FFA6B4]/30">
              <img
                src={currentStop.image}
                alt={currentStop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#7A1026] px-2 py-0.5 rounded-md">
                  {currentStop.category}
                </span>
                <h4 className="font-display font-black text-lg mt-1">{currentStop.name}</h4>
                <div className="flex items-center gap-2 text-xs text-[#FFD38A] mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F09367]" />
                  <span>{currentStop.location}</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#1C1440] leading-relaxed">
              {currentStop.description}
            </p>

            {/* Cultural Fact Box */}
            <div className="p-3.5 rounded-2xl bg-[#FFF9F3] border border-[#FFE4B5] text-xs text-[#120C2B] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#F09367] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1C1440]">Heritage Insight: </strong>
                {currentStop.historicalFact}
              </div>
            </div>

            {/* Challenge / Interaction Component based on type */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#FFA6B4]/40 space-y-3">
              {/* TRIVIA CHALLENGE */}
              {currentStop.challengeType === 'trivia' && currentStop.trivia && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-[#7A1026] uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4" />
                    <span>Cultural Trivia Challenge</span>
                  </div>
                  <h5 className="font-bold text-sm text-[#1C1440]">{currentStop.trivia.question}</h5>

                  <div className="space-y-2">
                    {currentStop.trivia.options.map((opt, idx) => {
                      const isSelected = selectedTriviaOption === idx;
                      let btnStyle = 'bg-[#FDF3EA] border-[#FFE4B5] text-[#1C1440] hover:border-[#7A1026]';
                      if (isSelected) {
                        btnStyle = 'bg-[#FFD38A] border-[#7A1026] text-[#1C1440] font-bold';
                      }
                      if (triviaSubmitted) {
                        if (idx === currentStop.trivia?.correctIndex) {
                          btnStyle = 'bg-green-100 border-green-500 text-green-900 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-red-100 border-red-500 text-red-900 line-through';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectTrivia(idx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {triviaSubmitted && idx === currentStop.trivia?.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {!triviaSubmitted ? (
                    <button
                      disabled={selectedTriviaOption === null}
                      onClick={handleSubmitTrivia}
                      className="w-full py-2.5 bg-[#7A1026] hover:bg-[#E85B70] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition-all"
                    >
                      Submit Cultural Answer (+{currentStop.rewardXp} XP)
                    </button>
                  ) : (
                    <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-xs text-green-800">
                      <strong>Mastery Fact:</strong> {currentStop.trivia.explanation}
                    </div>
                  )}
                </div>
              )}

              {/* DIALOGUE WITH MASTER ARTISAN */}
              {currentStop.challengeType === 'dialogue' && currentStop.artisanDialogue && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-[#8A8635] uppercase tracking-wider">
                    <MessageSquare className="w-4 h-4" />
                    <span>Living Heritage Dialogue with {currentStop.artisanDialogue.speaker}</span>
                  </div>

                  <blockquote className="p-3.5 rounded-xl bg-[#FFF9F3] border-l-4 border-[#7A1026] italic text-xs text-[#1C1440] leading-relaxed">
                    {currentStop.artisanDialogue.quote}
                  </blockquote>

                  <p className="text-xs text-[#120C2B]">
                    {currentStop.artisanDialogue.actionPrompt}
                  </p>

                  <button
                    onClick={() => {
                      playCoinSound();
                      setDialogueCompleted(true);
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                      dialogueCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-[#7A1026] hover:bg-[#E85B70] text-white shadow'
                    }`}
                  >
                    {dialogueCompleted ? '✓ Dialogue Completed (+XP Claimed)' : 'Record Artisan Exchange & Collect Check-in'}
                  </button>
                </div>
              )}

              {/* GPS CHECK-IN */}
              {currentStop.challengeType === 'checkin' && (
                <div className="space-y-3 text-center py-2">
                  <div className="flex items-center justify-center gap-2 text-xs font-black text-[#7A1026] uppercase tracking-wider">
                    <Navigation className="w-4 h-4" />
                    <span>Location Verified Check-in</span>
                  </div>
                  <p className="text-xs text-[#120C2B]">
                    Simulating GPS coordinates: 12 meters from {currentStop.name}.
                  </p>
                  <button
                    onClick={handleVerifyGps}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      gpsVerified
                        ? 'bg-green-600 text-white'
                        : 'bg-[#7A1026] hover:bg-[#E85B70] text-white shadow'
                    }`}
                  >
                    {gpsVerified ? '✓ GPS Confirmed at Location' : 'Tap to Verify Local Check-in (+XP)'}
                  </button>
                </div>
              )}

              {/* PHOTO CHALLENGE */}
              {currentStop.challengeType === 'photo' && (
                <div className="space-y-3 text-center py-2">
                  <div className="flex items-center justify-center gap-2 text-xs font-black text-[#E5A532] uppercase tracking-wider">
                    <Camera className="w-4 h-4" />
                    <span>Heritage Memory Photo Snap</span>
                  </div>
                  <p className="text-xs text-[#120C2B]">
                    Snap or upload a photo of the local architecture or craft to add to your traveler passport.
                  </p>
                  <button
                    onClick={handleVerifyPhoto}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      photoVerified
                        ? 'bg-green-600 text-white'
                        : 'bg-[#7A1026] hover:bg-[#E85B70] text-white shadow'
                    }`}
                  >
                    {photoVerified ? '✓ Photo Verified & Stamped' : 'Snap & Verify Monument Photo'}
                  </button>
                </div>
              )}
            </div>

            {/* Offline QR Code Fallback (SIH Slide 4 feature) */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowOfflineQr(!showOfflineQr)}
                className="text-[11px] font-bold text-[#8A8635] hover:underline flex items-center gap-1"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showOfflineQr ? 'Hide Offline QR' : 'Low Connectivity? Show Offline QR Pass'}</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-[#7A1026]">
                <Zap className="w-3.5 h-3.5" />
                <span>+{currentStop.rewardXp} XP • +{currentStop.rewardCoins} Coins</span>
              </div>
            </div>

            {showOfflineQr && (
              <div className="p-4 bg-[#1C1440] text-white rounded-2xl text-center space-y-2 animate-in fade-in">
                <div className="w-28 h-28 bg-white p-2 mx-auto rounded-xl flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-black" />
                </div>
                <div className="text-xs font-bold text-[#FFD38A]">
                  Offline Signature: RH-OFFLINE-{quest.id.slice(0, 5)}-{currentStop.id}
                </div>
                <p className="text-[10px] text-gray-300 max-w-xs mx-auto">
                  Local artisans can scan this offline cryptographic QR code without internet to authenticate your visit!
                </p>
              </div>
            )}

            {/* Footer Navigation Button */}
            <div className="pt-3 border-t border-[#FFA6B4]/30 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  playClickSound();
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl border border-[#FFA6B4]/40 text-xs font-bold text-[#120C2B] hover:bg-[#FCEFD9]"
              >
                Save & Exit
              </button>

              <button
                disabled={!isStopCompleted()}
                onClick={handleNextStop}
                className="px-6 py-3 bg-[#7A1026] hover:bg-[#E85B70] disabled:opacity-40 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-1.5"
              >
                <span>{currentStopIndex === totalStops - 1 ? 'Complete Quest & Claim Trophy' : 'Next Milestone Stop'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
