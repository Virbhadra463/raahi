import React, { useState } from 'react';
import { Compass, MapPin, Sparkles, ArrowRight, BookOpen, Check } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface DiscoverViewProps {
  onStartStory: (destination: string, storyType: string) => void;
}

const DESTINATIONS = [
  {
    id: 'jaipur',
    name: 'JAIPUR',
    sub: 'Rajasthan · The Walled Pink City',
    tagline: 'Terracotta archways, secret haveli courtyards, and generational block printers.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
    availableStories: 3,
    era: '1727 AD'
  },
  {
    id: 'shimla',
    name: 'SHIMLA',
    sub: 'Himachal Pradesh · The Deodar Ridges',
    tagline: 'Old cedar wood library steps, hidden mountain paths, and colonial tea houses.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80',
    availableStories: 2,
    era: '1864 AD'
  },
  {
    id: 'kerala',
    name: 'KERALA',
    sub: 'Malabar Coast · Spice Waterways',
    tagline: 'Wood-fired spice hearths, temple percussionists, and serene canal bridges.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
    availableStories: 3,
    era: '1498 AD'
  },
  {
    id: 'uttarakhand',
    name: 'UTTARAKHAND',
    sub: 'Garhwal Hills · Sacred Confluences',
    tagline: 'Carved cedar shrines, whistling pine gullies, and quiet Himalayan riverbanks.',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&auto=format&fit=crop&q=80',
    availableStories: 2,
    era: 'Vedic Times'
  },
];

const STORY_THEMES = [
  { id: 'CRAFT', label: 'CRAFT', detail: 'Generational makers, block printers & terracotta wheels' },
  { id: 'FOOD', label: 'FOOD', detail: 'Century-old recipes, slow wood fires & clay kulhads' },
  { id: 'CULTURE', label: 'CULTURE', detail: 'Folklore, living stepwells & hidden courtyard traditions' },
  { id: 'HIDDEN HISTORY', label: 'HIDDEN HISTORY', detail: 'Unmarked doors, haveli archives & forgotten stepwells' },
  { id: 'QUIET PLACES', label: 'QUIET PLACES', detail: 'Sunlight on old haveli bricks & tranquil courtyards' },
  { id: 'LOCAL LIFE', label: 'LOCAL LIFE', detail: 'Mohalla stories, flower markets & morning tea conversations' },
];

export const DiscoverView: React.FC<DiscoverViewProps> = ({ onStartStory }) => {
  const [selectedDestination, setSelectedDestination] = useState<string>('jaipur');
  const [selectedTheme, setSelectedTheme] = useState<string>('CRAFT');

  const chosenDest = DESTINATIONS.find((d) => d.id === selectedDestination) || DESTINATIONS[0];

  const handleLaunch = () => {
    playClickSound();
    onStartStory(selectedDestination, selectedTheme);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-4 text-[#1C1440]">
      {/* Editorial Header */}
      <div className="border-b border-[#E8DAC9] pb-8 text-center sm:text-left flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#7A1026] block mb-2">
            The Beginning of Every Journey
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#1C1440] tracking-tight">
            Where Do You Want Your Story To Begin?
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-[#1C1440]/75 mt-2 max-w-2xl">
            "A story never begins at the monument gate. It begins in the quiet lane that leads away from it."
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-[#FAF5EE] border border-[#E8DAC9] px-4 py-2 rounded-sm text-xs font-bold text-[#7A1026]">
          <BookOpen className="w-4 h-4 text-[#7A1026]" />
          <span>4 Living Regions Available</span>
        </div>
      </div>

      {/* Destination Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-widest text-[#7A1026]">
            1. Select A Story Realm
          </span>
          <span className="text-xs text-[#1C1440]/60 font-medium">Click to select city</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DESTINATIONS.map((dest) => {
            const isSelected = selectedDestination === dest.id;
            return (
              <div
                key={dest.id}
                onClick={() => {
                  playClickSound();
                  setSelectedDestination(dest.id);
                }}
                className={`group cursor-pointer border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'border-[#7A1026] bg-[#FAF5EE] ring-2 ring-[#7A1026]/40 shadow-sm'
                    : 'border-[#E8DAC9] bg-white hover:border-[#7A1026]/60'
                }`}
              >
                <div className="relative h-44 overflow-hidden bg-zinc-100">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter saturate-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1440]/80 via-transparent to-transparent" />
                  <div className="absolute top-2.5 right-2.5">
                    {isSelected && (
                      <span className="bg-[#7A1026] text-[#FFD38A] p-1 rounded-sm block shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#FFD38A] block">
                      {dest.era}
                    </span>
                    <h3 className="font-heading font-black text-xl tracking-wide leading-tight">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-[#7A1026] uppercase tracking-wide">
                      {dest.sub}
                    </p>
                    <p className="text-xs text-[#1C1440]/80 mt-1 leading-relaxed line-clamp-2">
                      {dest.tagline}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#E8DAC9]/80 flex items-center justify-between text-[11px] font-semibold text-[#1C1440]/60">
                    <span>{dest.availableStories} Chapters</span>
                    <span className="text-[#7A1026] font-bold group-hover:translate-x-0.5 transition-transform">
                      {isSelected ? 'Selected' : 'Select'} &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Story Theme Selector */}
      <div className="space-y-4 pt-4 border-t border-[#E8DAC9]">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-widest text-[#7A1026]">
            2. What Kind Of Story Do You Want?
          </span>
          <span className="text-xs text-[#1C1440]/60 font-medium">Choose your curiosity</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {STORY_THEMES.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  playClickSound();
                  setSelectedTheme(theme.id);
                }}
                className={`p-4 text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#7A1026] bg-[#7A1026] text-white shadow-sm'
                    : 'border-[#E8DAC9] bg-white hover:bg-[#FAF5EE] text-[#1C1440]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-black text-sm tracking-wide">
                      {theme.label}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#FFD38A] stroke-[3]" />}
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      isSelected ? 'text-white/80' : 'text-[#1C1440]/70'
                    }`}
                  >
                    {theme.detail}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Launch Story Action Card */}
      <div className="border-2 border-[#7A1026] bg-[#FAF5EE] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[4px_4px_0px_#7A1026]">
        <div className="space-y-1.5 max-w-xl">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A1026] font-bold block">
            {chosenDest.name} · {selectedTheme}
          </span>
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#1C1440]">
            Your story begins here.
          </h3>
          <p className="font-serif italic text-sm sm:text-base text-[#1C1440]/80">
            "A doorway in the old city precinct. If you listen closely, you will hear the rhythmic tap of a third-generation teakwood carver."
          </p>
        </div>

        <button
          onClick={handleLaunch}
          className="bg-[#7A1026] hover:bg-[#9C1A35] active:scale-98 text-[#FFD38A] font-heading font-black text-sm px-9 py-4 rounded-sm border border-[#450915] flex items-center gap-3 transition-all cursor-pointer shadow-sm shrink-0 uppercase tracking-wider"
        >
          <span>START A JOURNEY</span>
          <ArrowRight className="w-4 h-4 text-[#FFD38A]" />
        </button>
      </div>
    </div>
  );
};
