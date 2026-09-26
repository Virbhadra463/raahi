import React, { useState } from 'react';
import { Compass, MapPin, Sparkles, ArrowRight, AlertTriangle, ShieldCheck, CheckCircle2, Eye, Filter } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface MapSpot {
  id: string;
  name: string;
  type: 'red' | 'green' | 'yellow' | 'blue';
  category: string;
  location: string;
  coords: { x: number; y: number }; // percentage on map (0-100)
  story: string;
  crowdDetail?: string;
  questConnection: string;
  image: string;
  coinsReward?: number;
}

const MAP_SPOTS: MapSpot[] = [
  // RED: Crowded area
  {
    id: 'spot-hawa-mahal',
    name: 'Hawa Mahal Main Gate & Courtyard',
    type: 'red',
    category: 'Congested Monument Gate',
    location: 'Badi Chaupar Avenue',
    coords: { x: 26, y: 38 },
    story: 'Tour buses have unloaded 90 visitors. The queue stretches 55 minutes under the direct sun with heavy crowd bottlenecking at the stone ticket grille.',
    crowdDetail: '94% Congestion · 55 min wait · Peak Chokepoint',
    questConnection: 'Triggers automated RAAHI reroute to Ghee Walon Ka Rasta (180m away).',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'spot-amer-elephant',
    name: 'Amer Fort Suraj Pol Elephant Gate',
    type: 'red',
    category: 'High-Density Choke',
    location: 'Amer Ridge Ascent',
    coords: { x: 74, y: 22 },
    story: 'Severe vehicle congestion on ramparts. Visitors are funneled through single-file stone gates with zero shade.',
    crowdDetail: '89% Congestion · 40 min delay · Noisy Queue',
    questConnection: 'Diversion available to Kheri Stepwell & Water Walk.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80',
  },

  // GREEN: Recommended hidden experience
  {
    id: 'spot-ghee-walon',
    name: "Ghee Walon Ka Rasta & Panditji's Chai",
    type: 'green',
    category: 'Recommended Hidden Trail',
    location: 'Lane 2, Old Market Rear',
    coords: { x: 38, y: 52 },
    story: 'A serene lane where brass samovars simmer over babool coals. Pandit Kishan-ji serves saffron chai in unglazed clay kulhads using a family recipe created in 1934.',
    crowdDetail: '0 min wait · Serene breeze · 100% direct vendor spend',
    questConnection: 'Earn +30 bonus Raahi Coins by following this quiet bypass.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    coinsReward: 30,
  },
  {
    id: 'spot-kumhar-potters',
    name: 'Kumhargram Terracotta Colony',
    type: 'green',
    category: 'Recommended Hidden Artisan Guild',
    location: 'Riverbed Lane, South Gate',
    coords: { x: 62, y: 78 },
    story: 'Watch generational potters spin riverbed clay on slow wheels. The micro-pores naturally cool drinking water without any electricity.',
    crowdDetail: 'Tranquil · 4 artisan families working in open courtyard',
    questConnection: 'Unlocks the "Earth Sculptor" heritage stamp and craft discount.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80',
    coinsReward: 40,
  },

  // YELLOW: Active quest
  {
    id: 'spot-door-quest',
    name: "The Door That Isn't On The Map",
    type: 'yellow',
    category: 'Active Story Quest',
    location: 'Indigo Archway, Haveli #4',
    coords: { x: 44, y: 32 },
    story: 'An unmarked weathered indigo doorway. Behind the carved limestone lintel lies the rosewood carving workbench of Master Ramdas.',
    crowdDetail: 'Active Quest Chapter · Secret doorway discovery',
    questConnection: 'Current chapter: Solve the three doors puzzle to locate the 3rd-generation maker.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80',
    coinsReward: 50,
  },
  {
    id: 'spot-spice-quest',
    name: 'The Lost Saffron Grinder',
    type: 'yellow',
    category: 'Active Story Quest',
    location: 'Old Spice Market Rear Steps',
    coords: { x: 80, y: 64 },
    story: 'Follow the sensory scent of roasted cardamom and dried pomegranate to locate the oldest spice pestle in the city.',
    crowdDetail: 'Next story chapter ready to explore',
    questConnection: 'Unlocks the second clue leading to the indigo dyeing terrace.',
    image: 'https://images.unsplash.com/photo-1609137144822-446738d87a41?w=600&auto=format&fit=crop&q=80',
    coinsReward: 45,
  },

  // BLUE: Already discovered
  {
    id: 'spot-master-ramdas',
    name: 'Master Ramdas Woodblock Printing Studio',
    type: 'blue',
    category: 'Discovered Living Heritage',
    location: 'Haveli Courtyard #4',
    coords: { x: 50, y: 44 },
    story: 'You unlocked this maker! Master Ramdas shared the quote: "The wood remembers the tree, and the dye remembers the river."',
    crowdDetail: 'Verified Memory · Travel stamp collected',
    questConnection: 'Completed in Chapter 01. Inscribed in your travel journal.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'spot-sun-brick',
    name: 'Sun-Warmed Brick Terrace',
    type: 'blue',
    category: 'Discovered Sanctuary',
    location: 'Upper Haveli Steps',
    coords: { x: 18, y: 68 },
    story: 'Quiet rooftop overlooking the pink sandstone domes. A third-generation family sun-dries hand-dyed cotton here.',
    crowdDetail: 'Verified Memory · Pinned in My Journey',
    questConnection: 'Discovered during your morning walk down the quieter road.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80',
  },
];

interface InteractiveTourismMapProps {
  onStartQuest: (questTitle: string) => void;
}

export const InteractiveTourismMap: React.FC<InteractiveTourismMapProps> = ({ onStartQuest }) => {
  const [selectedSpot, setSelectedSpot] = useState<MapSpot>(MAP_SPOTS[4]); // Default yellow active quest
  const [activeFilter, setActiveFilter] = useState<'all' | 'red' | 'green' | 'yellow' | 'blue'>('all');

  const filteredSpots = MAP_SPOTS.filter((spot) => {
    if (activeFilter === 'all') return true;
    return spot.type === activeFilter;
  });

  const getMarkerColor = (type: MapSpot['type']) => {
    switch (type) {
      case 'red':
        return '#C81E38'; // Red: Crowded
      case 'green':
        return '#15803D'; // Green: Recommended hidden experience
      case 'yellow':
        return '#D97706'; // Yellow: Active quest
      case 'blue':
        return '#2563EB'; // Blue: Already discovered
    }
  };

  const getMarkerLabel = (type: MapSpot['type']) => {
    switch (type) {
      case 'red':
        return 'CROWDED AREA';
      case 'green':
        return 'RECOMMENDED HIDDEN EXP.';
      case 'yellow':
        return 'ACTIVE QUEST';
      case 'blue':
        return 'ALREADY DISCOVERED';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4 text-[#1C1440]">
      {/* Header */}
      <div className="border-b border-[#E8DAC9] pb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#7A1026] uppercase font-bold block mb-1">
            SPATIAL STORY MAP · OLD CITY PRECINCT
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#1C1440]">
            Interactive Tourism Map
          </h1>
          <p className="font-serif italic text-sm text-[#1C1440]/70 mt-1 max-w-xl">
            Live pulse of the city. Navigate away from tourist choke points toward authentic generational stories.
          </p>
        </div>

        {/* 4-Color Legend */}
        <div className="bg-[#FAF5EE] border border-[#E8DAC9] p-3 rounded-sm flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#C81E38] inline-block" />
            <span className="text-[#C81E38]">RED: Crowded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#15803D] inline-block" />
            <span className="text-[#15803D]">GREEN: Hidden Exp.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#D97706] inline-block" />
            <span className="text-[#D97706]">YELLOW: Active Quest</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#2563EB] inline-block" />
            <span className="text-[#2563EB]">BLUE: Discovered</span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-mono font-bold text-[#1C1440]/60 uppercase tracking-wider mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter Map:
        </span>
        {[
          { id: 'all', label: 'All Places' },
          { id: 'red', label: 'Crowded Bottlenecks' },
          { id: 'green', label: 'Hidden Trails' },
          { id: 'yellow', label: 'Active Quests' },
          { id: 'blue', label: 'Discovered' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              playClickSound();
              setActiveFilter(f.id as any);
            }}
            className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all cursor-pointer border ${
              activeFilter === f.id
                ? 'bg-[#7A1026] text-white border-[#450915]'
                : 'bg-white text-[#1C1440] border-[#E8DAC9] hover:bg-[#FAF5EE]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Map Canvas + Story Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* The Interactive Map (SVG based paper-map) */}
        <div className="lg:col-span-7 bg-[#F7F2E7] border-2 border-[#1C1440] p-4 sm:p-6 relative min-h-[460px] overflow-hidden shadow-sm flex flex-col justify-between">
          {/* Subtle Paper Grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#1C1440 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[400px] z-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Street Network Lines */}
              <line x1="10" y1="40" x2="90" y2="40" stroke="#E8DAC9" strokeWidth="4" />
              <line x1="30" y1="15" x2="30" y2="85" stroke="#E8DAC9" strokeWidth="3" />
              <line x1="70" y1="15" x2="70" y2="85" stroke="#E8DAC9" strokeWidth="3.5" />
              <line x1="30" y1="40" x2="70" y2="75" stroke="#E8DAC9" strokeWidth="2.5" />
              <line x1="45" y1="20" x2="85" y2="50" stroke="#E8DAC9" strokeWidth="2" />

              {/* Red Choke Area Highlight */}
              <rect x="22" y="34" width="16" height="12" fill="#E85B70" opacity="0.25" rx="1" />

              {/* Green Alternative Trail Dashed Line */}
              <path
                d="M 30 40 Q 40 60 62 78"
                fill="none"
                stroke="#15803D"
                strokeWidth="0.8"
                strokeDasharray="2 1.5"
              />
            </svg>

            {/* Interactive Pins Overlay */}
            {filteredSpots.map((spot) => {
              const isSelected = selectedSpot?.id === spot.id;
              const color = getMarkerColor(spot.type);

              return (
                <div
                  key={spot.id}
                  onClick={() => {
                    playClickSound();
                    setSelectedSpot(spot);
                  }}
                  style={{
                    left: `${spot.coords.x}%`,
                    top: `${spot.coords.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute z-20 cursor-pointer group"
                >
                  <div
                    style={{
                      backgroundColor: color,
                      boxShadow: isSelected ? '0 0 0 4px #1C1440' : '0 2px 6px rgba(0,0,0,0.3)',
                    }}
                    className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center transition-transform ${
                      isSelected ? 'scale-125' : 'hover:scale-115'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </div>

                  {/* Tooltip Tag */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-7 bg-[#1C1440] text-white px-2 py-0.5 text-[9px] font-mono tracking-wider whitespace-nowrap rounded-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                    {spot.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Footnote */}
          <div className="relative z-10 pt-3 border-t border-[#E8DAC9] flex items-center justify-between text-[11px] font-mono text-[#1C1440]/60">
            <span>Jaipur Walled City Grid · Sector 4</span>
            <span className="text-[#7A1026] font-bold">Click any colored marker to reveal story</span>
          </div>
        </div>

        {/* Story & Quest Connection Panel (Right Drawer) */}
        <div className="lg:col-span-5 bg-white border-2 border-[#1C1440] p-6 sm:p-7 space-y-5 shadow-[4px_4px_0px_#1C1440]">
          {selectedSpot ? (
            <>
              {/* Type Badge */}
              <div className="flex items-center justify-between border-b border-[#E8DAC9] pb-3">
                <span
                  style={{ color: getMarkerColor(selectedSpot.type) }}
                  className="text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span
                    style={{ backgroundColor: getMarkerColor(selectedSpot.type) }}
                    className="w-2.5 h-2.5 rounded-full inline-block"
                  />
                  {getMarkerLabel(selectedSpot.type)}
                </span>
                <span className="text-[10px] font-mono text-[#1C1440]/60">
                  {selectedSpot.category}
                </span>
              </div>

              {/* Photo */}
              <div className="relative h-44 w-full overflow-hidden bg-zinc-100 border border-[#E8DAC9]">
                <img
                  src={selectedSpot.image}
                  alt={selectedSpot.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-[#1C1440]/90 text-white px-2 py-0.5 text-[9px] font-mono uppercase">
                  {selectedSpot.location}
                </div>
              </div>

              {/* Title & Story Narrative */}
              <div className="space-y-2">
                <h3 className="font-heading font-black text-xl text-[#1C1440] leading-tight">
                  {selectedSpot.name}
                </h3>
                <p className="font-serif italic text-sm text-[#1C1440]/80 leading-relaxed">
                  "{selectedSpot.story}"
                </p>
              </div>

              {/* Crowd / Telemetry Note */}
              {selectedSpot.crowdDetail && (
                <div className="bg-[#FAF5EE] border-l-3 border-[#7A1026] p-3 text-xs font-mono text-[#1C1440]">
                  <strong className="block text-[10px] text-[#7A1026] uppercase">
                    Crowd Telemetry:
                  </strong>
                  {selectedSpot.crowdDetail}
                </div>
              )}

              {/* Quest Connection Box */}
              <div className="border border-[#C98A2E] bg-[#FFFDF9] p-3.5 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C98A2E] font-bold block">
                  Quest Connection
                </span>
                <p className="text-xs text-[#1C1440] font-medium leading-snug">
                  {selectedSpot.questConnection}
                </p>
                {selectedSpot.coinsReward && (
                  <span className="inline-block text-[10px] font-mono text-[#15803D] font-bold mt-1">
                    +{selectedSpot.coinsReward} Raahi Coins Reward
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  onStartQuest(selectedSpot.name);
                }}
                className="w-full bg-[#7A1026] hover:bg-[#9C1A35] text-[#FFD38A] font-heading font-black text-xs py-3.5 rounded-sm border border-[#450915] flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer shadow-sm transition-all"
              >
                <span>DISCOVER THIS STORY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="p-8 text-center text-xs font-mono text-[#1C1440]/60">
              Select any place on the map above to inspect its living story.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
