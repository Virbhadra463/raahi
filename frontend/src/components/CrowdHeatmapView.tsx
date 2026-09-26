import React, { useState } from 'react';
import { CROWD_HOTSPOTS, QUESTS } from '../data/mockData';
import { Quest, CrowdHotspot } from '../types';
import { Activity, Users, Zap, Clock, ShieldCheck, ArrowUpRight, Filter, AlertTriangle, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface CrowdHeatmapViewProps {
  onSelectQuest: (quest: Quest) => void;
}

export const CrowdHeatmapView: React.FC<CrowdHeatmapViewProps> = ({ onSelectQuest }) => {
  const [selectedHotspot, setSelectedHotspot] = useState<CrowdHotspot>(CROWD_HOTSPOTS[0]);
  const [filterMode, setFilterMode] = useState<'all' | 'critical' | 'moderate'>('all');

  const filteredHotspots = CROWD_HOTSPOTS.filter((spot) => {
    if (filterMode === 'critical') return spot.currentCongestionPercent >= 85;
    if (filterMode === 'moderate') return spot.currentCongestionPercent < 85;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFF9F3] p-6 rounded-3xl border border-[#FFA6B4]/40">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-black uppercase tracking-wider text-[#7A1026]">
            <Activity className="w-4 h-4" />
            <span>AI Demand-Balancing & Congestion Dispatcher</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1C1440]">
            Live Crowd Density & Dynamic Quest Incentives
          </h2>
          <p className="text-sm text-[#120C2B] mt-1 max-w-2xl">
            When iconic monuments reach peak capacity, Raahi increases XP and artisan voucher multipliers to smoothly reroute foot traffic to nearby local artisans, eateries, and cultural hubs.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'all' ? 'bg-[#7A1026] text-white shadow-sm' : 'bg-white text-[#120C2B] border border-[#FFA6B4]/40'
            }`}
          >
            All Zones ({CROWD_HOTSPOTS.length})
          </button>
          <button
            onClick={() => setFilterMode('critical')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'critical' ? 'bg-[#E85B70] text-white shadow-sm' : 'bg-white text-[#120C2B] border border-[#FFA6B4]/40'
            }`}
          >
            High Congestion
          </button>
        </div>
      </div>

      {/* Grid of Hotspots vs Off-Peak Quests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Hotspots List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#120C2B] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#7A1026]" />
            <span>Monitored Tourist Zones</span>
          </h3>

          <div className="space-y-3">
            {filteredHotspots.map((spot) => {
              const isSelected = selectedHotspot.id === spot.id;
              const isCritical = spot.currentCongestionPercent >= 85;

              return (
                <button
                  key={spot.id}
                  onClick={() => {
                    playClickSound();
                    setSelectedHotspot(spot);
                  }}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border-2 ${
                    isSelected
                      ? 'bg-[#FDF3EA] border-[#7A1026] shadow-md ring-2 ring-[#7A1026]/20'
                      : 'bg-white border-[#FFA6B4]/30 hover:border-[#F09367]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-[#1C1440] line-clamp-1">{spot.name}</h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isCritical
                          ? 'bg-[#450915] text-white'
                          : 'bg-[#FFD38A] text-[#1C1440]'
                      }`}
                    >
                      {spot.currentCongestionPercent}% Full
                    </span>
                  </div>

                  {/* Congestion Bar */}
                  <div className="w-full h-2 bg-[#FCEFD9] rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isCritical ? 'bg-gradient-to-r from-[#7A1026] to-[#450915]' : 'bg-[#F59E0B]'
                      }`}
                      style={{ width: `${spot.currentCongestionPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-[#120C2B]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#E85B70]" />
                      ~{spot.waitTimeMinutes}m Entry Line
                    </span>
                    <span className="font-extrabold text-[#7A1026] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      {spot.bonusMultiplier}x Quest Multiplier
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic Reroute Simulation Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#FFFDF9] via-[#FFF9F3] to-[#FCEFD9] rounded-3xl p-6 border-2 border-[#FFE4B5] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#FFA6B4]/30">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#7A1026] text-white">
                  <Zap className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-display font-black text-xl text-[#1C1440]">
                    Incentivized Cultural Diversion
                  </h4>
                  <p className="text-xs text-[#8A8635] font-semibold">
                    Target: {selectedHotspot.name}
                  </p>
                </div>
              </div>

              <div className="bg-[#FFD38A] text-[#1C1440] px-3.5 py-1.5 rounded-xl text-xs font-black border border-[#E5A532] flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#9C1A35]" />
                <span>ACTIVE {selectedHotspot.bonusMultiplier}X MULTIPLIER</span>
              </div>
            </div>

            {/* Comparison Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              {/* Overcrowded Option */}
              <div className="bg-white/80 p-4 rounded-2xl border border-red-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#450915] mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Overcrowded Main Gate</span>
                </div>
                <h5 className="font-bold text-sm text-[#1C1440]">{selectedHotspot.name}</h5>
                <ul className="mt-3 space-y-1.5 text-xs text-[#120C2B]">
                  <li>• Estimated waiting time: <strong className="text-red-700">{selectedHotspot.waitTimeMinutes} mins</strong></li>
                  <li>• Congestion level: <strong className="text-red-700">{selectedHotspot.currentCongestionPercent}%</strong></li>
                  <li>• Standard Quest XP: 100 XP (No Bonus)</li>
                  <li>• High noise, congested photography</li>
                </ul>
              </div>

              {/* Rerouted Artisan Trail Option */}
              <div className="bg-[#FDF3EA] p-4 rounded-2xl border-2 border-[#7A1026] shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#7A1026] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-bl-xl">
                  Recommended
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#7A1026] mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Raahi Verified Local Trail</span>
                </div>
                <h5 className="font-bold text-sm text-[#1C1440]">{selectedHotspot.redirectedQuestName}</h5>
                <ul className="mt-3 space-y-1.5 text-xs text-[#1C1440]">
                  <li>• Walking distance: <strong>350m (4 mins on foot)</strong></li>
                  <li>• Immediate access: <strong>0 min waiting</strong></li>
                  <li>• Rewarded XP: <strong className="text-[#7A1026]">{Math.round(200 * selectedHotspot.bonusMultiplier)} XP ({selectedHotspot.bonusMultiplier}x)</strong></li>
                  <li>• Includes <strong>20% off direct artisan craft vouchers</strong></li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 border border-[#FFA6B4]/40 text-xs text-[#120C2B]">
              <strong className="text-[#1C1440]">SIH Impact Note:</strong> By choosing the diverted quest trail, you directly support local artisan family livelihoods and help city tourism boards prevent dangerous crowd stampedes and bottle-necking.
            </div>
          </div>

          {/* Action Trigger */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#FFA6B4]/30">
            <div className="text-xs text-[#8A8635] font-bold">
              ✦ Ready to earn bonus rewards and explore authentic crafts?
            </div>
            <button
              onClick={() => {
                const q = QUESTS.find((item) => item.id === selectedHotspot.redirectedQuestId) || QUESTS[0];
                playClickSound();
                onSelectQuest(q);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#7A1026] hover:bg-[#E85B70] text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Launch Reroute Trail</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
