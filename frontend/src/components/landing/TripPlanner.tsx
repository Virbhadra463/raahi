import React from 'react';
import { DESTINATIONS, DURATIONS, PARTIES, VIBES } from '../../data/landing/quests';
import { Sparkles, MapPin, Clock, Users, Check, ArrowDown } from 'lucide-react';

export default function TripPlanner({
  selectedCity,
  setSelectedCity,
  selectedDuration,
  setSelectedDuration,
  selectedParty,
  setSelectedParty,
  selectedVibes,
  toggleVibe,
  onGenerateTrail
}) {
  return (
    <section id="planner" className="relative -mt-10 z-20 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl border-3 border-signboard-navy shadow-2xl p-6 sm:p-8 text-signboard-navy">
        
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-zinc-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-black tracking-widest text-carpet-maroon bg-carpet-maroon/15 px-3 py-1 rounded-md">
                Interactive Trip Blueprint
              </span>
              <span className="text-xs text-signboard-navy/80 font-bold">Curated Route Engine · Step 1</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-signboard-navy mt-1.5">
              What kind of story do you want to create?
            </h2>
            <p className="text-sm text-signboard-navy/80 font-medium mt-0.5">
              Customize your route parameters to tailor the story-driven quests below.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-black text-carpet-maroon bg-marigold/40 px-3.5 py-2 rounded-full border border-marigold">
            <Sparkles className="w-4 h-4 text-terracotta" />
            <span>AI Dynamic Story Router</span>
          </div>
        </div>

        {/* Input Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          
          {/* Destination */}
          <div className="space-y-2">
            <label className="text-xs font-black text-signboard-navy uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-carpet-maroon" />
              <span>1. Choose Destination</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DESTINATIONS.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  className={`px-3.5 py-3 rounded-xl text-left border-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedCity === city.id
                      ? 'bg-signboard-navy text-parchment border-signboard-navy shadow-md'
                      : 'bg-zinc-50 hover:bg-zinc-100 text-signboard-navy border-zinc-300'
                  }`}
                >
                  <div className="font-heading font-black">{city.name}</div>
                  <div className={`text-[10px] font-semibold truncate ${selectedCity === city.id ? 'text-marigold' : 'text-zinc-500'}`}>
                    {city.state}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-xs font-black text-signboard-navy uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-carpet-maroon" />
              <span>2. Quest Duration</span>
            </label>
            <div className="space-y-2">
              {DURATIONS.map((dur) => (
                <button
                  key={dur.id}
                  onClick={() => setSelectedDuration(dur.id)}
                  className={`w-full px-4 py-2.5 rounded-xl text-left border-2 text-xs sm:text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                    selectedDuration === dur.id
                      ? 'bg-carpet-maroon text-parchment border-carpet-maroon shadow-md'
                      : 'bg-zinc-50 hover:bg-zinc-100 text-signboard-navy border-zinc-300'
                  }`}
                >
                  <span>{dur.label}</span>
                  {selectedDuration === dur.id && <Check className="w-4 h-4 text-marigold stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Party Size */}
          <div className="space-y-2">
            <label className="text-xs font-black text-signboard-navy uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-carpet-maroon" />
              <span>3. Travel Party</span>
            </label>
            <div className="space-y-2">
              {PARTIES.map((party) => (
                <button
                  key={party.id}
                  onClick={() => setSelectedParty(party.id)}
                  className={`w-full px-4 py-2.5 rounded-xl text-left border-2 text-xs sm:text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                    selectedParty === party.id
                      ? 'bg-signboard-navy text-parchment border-signboard-navy shadow-md'
                      : 'bg-zinc-50 hover:bg-zinc-100 text-signboard-navy border-zinc-300'
                  }`}
                >
                  <span>{party.label}</span>
                  {selectedParty === party.id && <Check className="w-4 h-4 text-marigold stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Vibes Multi-select */}
        <div className="mt-6 pt-5 border-t-2 border-zinc-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <label className="text-xs font-black text-signboard-navy uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-carpet-maroon" />
              <span>4. Pick Your Vibes (Multi-select)</span>
            </label>
            <span className="text-xs text-signboard-navy font-bold">
              {selectedVibes.length} selected · Click any vibe pill to filter quests below
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {VIBES.map((vibe) => {
              const isSelected = selectedVibes.includes(vibe.id);
              return (
                <button
                  key={vibe.id}
                  onClick={() => toggleVibe(vibe.id)}
                  className={`px-4 py-2 rounded-full text-xs font-heading font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-signboard-pink text-signboard-navy border-2 border-signboard-navy shadow-signboard scale-105'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-signboard-navy border-2 border-zinc-300'
                  }`}
                >
                  <span>{vibe.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-signboard-navy stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trail action button */}
        <div className="mt-7 pt-5 border-t-2 border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-signboard-navy">
            Selected Trail: <strong className="text-carpet-maroon capitalize text-sm">{selectedCity}</strong> ·{' '}
            <span>{DURATIONS.find((d) => d.id === selectedDuration)?.label}</span> ·{' '}
            <span>{PARTIES.find((p) => p.id === selectedParty)?.label}</span>
          </div>

          <button
            onClick={onGenerateTrail}
            className="w-full sm:w-auto bg-signboard-navy hover:bg-signboard-dark active:scale-95 text-parchment font-heading font-black text-sm px-7 py-3 rounded-full shadow-signboard flex items-center justify-center gap-2 cursor-pointer transition-transform"
          >
            <span>Explore Matching Quests</span>
            <ArrowDown className="w-4 h-4 text-marigold animate-bounce stroke-[3]" />
          </button>
        </div>

      </div>
    </section>
  );
}
