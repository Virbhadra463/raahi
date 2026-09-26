"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Compass, MapPin, Send } from "lucide-react";

interface PromptBoxProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const SAMPLE_PROMPTS = [
  {
    title: "Jaipur Royal Heritage (₹12k)",
    prompt:
      "Plan a 3-day cultural tour of Jaipur for 2 people with ₹12,000 budget. Interested in Amber Fort, City Palace, Johari Bazaar artisan jewelry, authentic Dal Baati Churma, and a comfortable haveli stay.",
  },
  {
    title: "Varanasi Ghats & Weavers (₹8k)",
    prompt:
      "I want a 2-day spiritual & artisan trail in Varanasi under ₹8,000. Morning boat ride at Assi Ghat, Banarasi silk handloom weaver visits, local kachori jalebi, and peaceful walking pace.",
  },
  {
    title: "Goa Culture & Coastal (₹15k)",
    prompt:
      "Planning a 4-day trip to Goa exploring Portuguese Latin quarters in Fontainhas, spice plantations, beach sunsets, and coastal seafood with ₹15,000 budget.",
  },
  {
    title: "Shirdi Pilgrimage (₹10k)",
    prompt:
      "4 days in Shirdi with parents under ₹10,000. Decent hotel near Sai Baba Temple, pure vegetarian thali meals, peaceful darshan, and relaxed transit.",
  },
];

export const PromptBox: React.FC<PromptBoxProps> = ({ onSubmit, isLoading, placeholder }) => {
  const [prompt, setPrompt] = useState(
    "Plan a 3-day cultural tour of Jaipur for 2 people with ₹12,000 budget. Interested in Amber Fort, City Palace, Johari Bazaar artisan jewelry, authentic Dal Baati Churma, and a comfortable haveli stay."
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <div className="w-full bg-[#FFFDF9] rounded-3xl shadow-bollywood border-2 sm:border-3 border-signboard-navy p-5 sm:p-7 transition-all text-signboard-navy relative overflow-hidden">
      {/* Decorative Top Accent Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-signboard-navy/10">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-carpet-maroon text-marigold flex items-center justify-center shadow-xs">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: "14s" }} />
          </span>
          <div>
            <span className="text-xs uppercase font-heading font-black tracking-widest text-carpet-maroon">
              AI Story &amp; Route Architect
            </span>
            <span className="hidden sm:inline text-xs text-signboard-navy/60 font-semibold ml-2">
              · Verified OSM Coordinates &amp; OSRM Road Transit
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-marigold/30 text-carpet-maroon border border-marigold font-heading font-black text-xs">
          <Sparkles className="w-3.5 h-3.5 text-terracotta" />
          <span>Real Route Engine</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            placeholder={
              placeholder ||
              "Describe your dream trip: destination, duration, budget, food preferences, travel party, and pace..."
            }
            className="w-full p-4 sm:p-4.5 rounded-2xl border-2 border-signboard-navy/20 bg-parchment/60 focus:bg-white text-signboard-navy placeholder:text-signboard-navy/40 focus:outline-none focus:border-carpet-maroon focus:ring-2 focus:ring-carpet-maroon/20 font-body text-xs sm:text-sm font-medium resize-none transition-all shadow-inner leading-relaxed"
          />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-1">
          {/* Sample Chips */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <span className="text-xs text-signboard-navy/70 font-heading font-black uppercase tracking-wider">
              Ideas:
            </span>
            {SAMPLE_PROMPTS.map((sp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(sp.prompt)}
                disabled={isLoading}
                className="text-xs px-3 py-1 rounded-xl bg-parchment hover:bg-marigold/40 text-signboard-navy font-heading font-bold border border-marigold/60 hover:border-marigold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                ✨ {sp.title}
              </button>
            ))}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full lg:w-auto px-7 py-3 rounded-xl bg-carpet-maroon hover:bg-carpet-light active:scale-95 text-white font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-carpet-maroon shadow-bollywood transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-marigold" />
                <span>Crafting Itinerary...</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 text-marigold" />
                <span>Generate Royal Itinerary</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
