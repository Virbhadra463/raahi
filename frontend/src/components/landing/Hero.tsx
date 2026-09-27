import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles } from 'lucide-react';
import { POLAROIDS } from '../../data/landing/quests';

interface HeroProps {
  onExploreClick: () => void;
  onStartJourneyClick?: () => void;
  onOpenPlanner?: () => void;
}

export default function Hero({ onExploreClick }: HeroProps) {
  return (
    <section className="relative min-h-[92vh] bg-rug-pattern flex flex-col justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden text-parchment border-b-4 border-signboard-navy">
      {/* Dark gradient overlay for crystal readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-signboard-dark/90 via-transparent to-signboard-dark/50 pointer-events-none" />

      {/* Main Hero Showcase (Two Columns) */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10 pt-4">
        
        {/* Left Column: Hero Narrative Copy */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="lg:col-span-6 flex flex-col text-left space-y-6"
        >
          {/* Signboard Headline */}
          <h1 className="signboard-text-lg text-4xl sm:text-5xl md:text-6xl xl:text-7xl leading-[1.1] tracking-wide pt-2">
            Har Gali Ek<br className="hidden sm:inline" /> Kahani Hai
          </h1>

          {/* One-line subhead */}
          <p className="text-base sm:text-lg text-parchment/90 font-medium leading-relaxed max-w-xl drop-shadow-sm">
            A travel companion that turns every street into a quest — and every quest into real money for the people who live there.
          </p>

          {/* CTA: Explore Button only (directs to AI Trip Planner) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreClick}
              className="bg-marigold hover:bg-amber-300 active:scale-95 text-signboard-navy font-heading font-black text-base sm:text-lg px-8 py-3.5 rounded-full shadow-signboard-lg hover:shadow-signboard transition-all duration-150 flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>Explore</span>
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform stroke-[2.5]" />
            </button>
          </div>
        </motion.div>

        {/* Right Column: Enlarged Video Player for Tablet & Desktop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="lg:col-span-6 flex flex-col items-center justify-center w-full"
        >
          {/* Framed Container */}
          <div className="relative w-full max-w-[580px] md:max-w-[680px] lg:max-w-[740px] mx-auto group">
            {/* Ornate Frame Outer Border */}
            <div className="p-3 sm:p-4 bg-signboard-navy rounded-[28px] shadow-framed-video border-3 border-marigold/60 transition-transform duration-300 group-hover:scale-[1.01]">
              
              {/* Inner Frame with Video */}
              <div className="relative overflow-hidden rounded-[20px] bg-signboard-dark border-2 border-marigold/30 aspect-[16/10] w-full min-h-[260px] sm:min-h-[340px] md:min-h-[400px]">
                <video
                  src="/assets/hero-market.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover object-center"
                />

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-signboard-dark/70 via-transparent to-transparent pointer-events-none" />

                {/* Live street tag */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2 bg-signboard-dark/95 backdrop-blur-md px-4 py-2 rounded-full border border-marigold/60 shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-heading font-black text-parchment tracking-wide">
                      Live Street Atmosphere · Jaipur Bazaar
                    </span>
                  </div>

                  <span className="text-[11px] uppercase font-black tracking-widest text-marigold bg-signboard-navy px-3.5 py-1.5 rounded-full border border-marigold/40 hidden sm:inline shadow-md">
                    Window to Real India
                  </span>
                </div>
              </div>
            </div>

            {/* Frame Hanging Pin */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-marigold border-2 border-signboard-navy shadow-md flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-carpet-maroon" />
              </div>
            </div>

            {/* Caption beneath framed video */}
            <p className="font-handwriting font-bold text-parchment text-base sm:text-lg text-center mt-3 tracking-wide drop-shadow-sm">
              "Bazaar lane behind the clocktower — brass pots, sweet tea, and cats on sun-warmed bricks."
            </p>
          </div>
        </motion.div>

      </div>

      {/* Hanging Polaroid Clothesline Section */}
      <div className="max-w-7xl mx-auto w-full mt-16 pt-12 border-t-2 border-marigold/20 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-marigold/20 border border-marigold/50 text-marigold text-xs font-heading font-black uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 text-marigold" />
            <span>Footnotes From The Street · Real Wayfarer Memories</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-heading font-black text-parchment">
            Every Lane Remembers What Guidebooks Miss
          </h3>
        </div>

        {/* The Clothesline Wire / String (SVG) */}
        <div className="relative w-full h-8 -mb-4 z-20 pointer-events-none">
          <svg
            className="w-full h-8 overflow-visible"
            viewBox="0 0 1200 32"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0,12 Q300,26 600,16 T1200,12"
              stroke="#FFD38A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="5 3"
              className="opacity-90"
            />
          </svg>
        </div>

        {/* Polaroid Cards Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 relative z-10 pt-2">
          {POLAROIDS.map((item, index) => {
            const initialRotation = item.rotation * 2;
            const targetRotation = item.rotation;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -30, rotate: initialRotation }}
                animate={{ opacity: 1, y: 0, rotate: targetRotation }}
                transition={{
                  type: 'spring',
                  stiffness: 180,
                  damping: 14,
                  delay: index * 0.1,
                }}
                whileHover={{
                  scale: 1.05,
                  rotate: 0,
                  zIndex: 30,
                  transition: { duration: 0.2 },
                }}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Wooden Clothes Peg Graphic */}
                <div className="relative -mb-3 z-30 flex flex-col items-center">
                  <div className="w-4 h-7 rounded-sm bg-amber-800 border-2 border-amber-950 shadow-md flex flex-col justify-between py-1 items-center">
                    <div className="w-2.5 h-0.5 bg-amber-600 rounded-full" />
                    <div className="w-2 h-2 rounded-full bg-zinc-300 border border-zinc-600 shadow-inner" />
                    <div className="w-2.5 h-0.5 bg-amber-950" />
                  </div>
                </div>

                {/* Polaroid Frame */}
                <div className="bg-white p-3.5 pb-5 rounded-sm polaroid-shadow border-2 border-zinc-200 w-full max-w-[240px] sm:max-w-none transition-shadow group-hover:shadow-2xl">
                  
                  {/* Photo Container */}
                  <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 rounded-xs border border-zinc-300 mb-3">
                    <img
                      src={item.src}
                      alt={item.caption}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-[1.05] saturate-[1.1]"
                    />
                    
                    {/* Location / vibe tag */}
                    <div className="absolute top-2 left-2 bg-signboard-dark/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-heading font-black text-parchment border border-marigold/30">
                      {item.tag}
                    </div>
                  </div>

                  {/* Handwritten Caption in Kalam font */}
                  <div className="px-1 text-center space-y-1">
                    <p className="font-handwriting font-bold text-signboard-navy text-sm sm:text-base leading-tight">
                      {item.caption}
                    </p>
                    <p className="font-handwriting text-zinc-700 text-xs leading-snug line-clamp-2 font-semibold">
                      "{item.note}"
                    </p>
                  </div>

                  {/* Stamped authenticity date */}
                  <div className="mt-2.5 pt-2 border-t border-zinc-200 flex items-center justify-between text-[9px] text-zinc-500 font-mono font-bold">
                    <span>RAAHI #{index + 101}</span>
                    <span className="text-emerald-700 font-black uppercase">Verified</span>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
