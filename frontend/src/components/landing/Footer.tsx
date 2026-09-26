import React from 'react';
import { Compass, Sparkles, ArrowUp } from 'lucide-react';

export default function Footer({ onStartClick }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-rug-footer text-parchment pt-20 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden border-t-4 border-signboard-navy">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Signboard Logo & Hindi Script */}
        <div className="mb-4">
          <span className="signboard-text-lg text-5xl sm:text-6xl md:text-7xl tracking-wider block">
            RAAHI
          </span>
          <span className="font-heading font-extrabold text-marigold text-lg sm:text-xl tracking-widest uppercase mt-2 block drop-shadow-md">
            "हर गली एक कहानी है" — Every lane has a story
          </span>
        </div>

        {/* The Core Loop Banner */}
        <div className="my-8 max-w-3xl mx-auto">
          <p className="text-xs uppercase font-black tracking-widest text-parchment mb-3">
            The Virtuous Tourism Loop
          </p>
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-signboard-dark/95 backdrop-blur-md px-7 py-3.5 rounded-full text-xs sm:text-sm font-heading font-black border-2 border-marigold shadow-signboard">
            <span className="text-marigold">PLAY</span>
            <span className="text-parchment/60">&rarr;</span>
            <span className="text-signboard-pink">EXPLORE</span>
            <span className="text-parchment/60">&rarr;</span>
            <span className="text-parchment">DISCOVER</span>
            <span className="text-parchment/60">&rarr;</span>
            <span className="text-emerald-400">SPEND LOCALLY</span>
            <span className="text-parchment/60">&rarr;</span>
            <span className="text-marigold">EARN</span>
            <span className="text-parchment/60">&rarr;</span>
            <span className="text-parchment">CONTINUE</span>
          </div>
        </div>

        {/* Final CTA Button */}
        <div className="mb-12">
          <button
            onClick={onStartClick}
            className="bg-marigold hover:bg-amber-300 active:scale-95 text-signboard-navy font-heading font-black text-base sm:text-lg px-10 py-4 rounded-full shadow-signboard-lg hover:shadow-signboard transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>Start My Journey</span>
            <Compass className="w-6 h-6 group-hover:rotate-45 transition-transform stroke-[2.5]" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-full max-w-4xl h-[2px] bg-parchment/30 my-6" />

        {/* Links & Attribution */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-parchment">
          <div className="flex items-center gap-4">
            <a href="#what-is-raahi" className="hover:text-marigold transition-colors">What is Raahi?</a>
            <span>·</span>
            <a href="#raahi-book" className="hover:text-marigold transition-colors">The Raahi Book</a>
            <span>·</span>
            <a href="#raahi-finds" className="hover:text-marigold transition-colors">Raahi Finds</a>
            <span>·</span>
            <a href="#take-a-piece" className="hover:text-marigold transition-colors">Take a Piece</a>
          </div>

          <div className="flex items-center gap-2 text-parchment font-medium">
            <span>RAAHI Travel Companion · India Heritage Edition</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-marigold transition-colors text-xs font-heading font-black cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        <div className="mt-8 text-xs text-parchment font-mono">
          © 2026 RAAHI (राही) · Made for the authentic streets, dhabas, and artisans of India.
        </div>

      </div>
    </footer>
  );
}
