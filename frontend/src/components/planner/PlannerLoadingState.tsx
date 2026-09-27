"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  MapPin,
  Hotel,
  Navigation,
  Compass,
  CheckCircle2,
  Loader2,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface PlannerLoadingStateProps {
  prompt?: string;
  onSkipToDraft?: () => void;
}

const PIPELINE_STEPS = [
  {
    id: "extraction",
    title: "Decoding Trip Requirements",
    detail: "Analyzing destination, duration, budget cap, travel party, and dietary preferences.",
    icon: Sparkles,
  },
  {
    id: "osm_landmarks",
    title: "Searching OSM Landmarks & Food Spots",
    detail: "Querying OpenStreetMap Overpass for geocoded monuments, bazaars, and authentic eateries.",
    icon: MapPin,
  },
  {
    id: "stays",
    title: "Curating Heritage Stays & Haveli Choice",
    detail: "Ranking accommodation options by landmark proximity, verified safety, and price tolerance.",
    icon: Hotel,
  },
  {
    id: "osrm_routes",
    title: "Calculating OSRM Road Legs & Transit Times",
    detail: "Computing turn-by-turn driving durations and daily transit buffers via routing engine.",
    icon: Navigation,
  },
  {
    id: "synthesis",
    title: "Synthesizing Schedule & Budget Balance",
    detail: "Optimizing hour-by-hour timeline, enforcing strict budget invariant, and setting reserve buffer.",
    icon: Compass,
  },
  {
    id: "dispatch",
    title: "Polishing Verified Royal Blueprint",
    detail: "Assembling interactive route waypoints, day itineraries, and expedition summary.",
    icon: CheckCircle2,
  },
];

const CULTURAL_FACTS = [
  "Did you know? Jaipur's iconic Hawa Mahal has 953 honeycomb windows designed to channel cooling desert breezes.",
  "Raahi computes real OSRM road geometries so your travel durations are realistic, never generic approximations.",
  "Deterministic budget balancing allocates safety buffers so you avoid unexpected travel expense spikes.",
  "Maharashtra's Ajanta Caves date back to the 2nd century BCE and feature ancient rock-cut Buddhist masterpieces.",
  "Goa's Latin Quarter (Fontainhas) preserves UNESCO heritage architecture with narrow terracotta-tiled alleys.",
];

export const PlannerLoadingState: React.FC<PlannerLoadingStateProps> = ({
  prompt,
  onSkipToDraft,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  // Step progression timer (every 4 seconds)
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < PIPELINE_STEPS.length - 1 ? prev + 1 : prev));
    }, 4200);

    return () => clearInterval(stepInterval);
  }, []);

  // Elapsed seconds timer
  useEffect(() => {
    const elapsedInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(elapsedInterval);
  }, []);

  // Rotating cultural facts
  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % CULTURAL_FACTS.length);
    }, 7000);

    return () => clearInterval(factInterval);
  }, []);

  const progressPercent = Math.min(
    95,
    Math.round(((currentStepIndex + 1) / PIPELINE_STEPS.length) * 85 + (elapsedSeconds % 10) * 1)
  );

  return (
    <div className="w-full bg-[#FFFDF9] rounded-3xl shadow-bollywood-lg border-2 sm:border-3 border-signboard-navy p-6 sm:p-8 space-y-6 text-signboard-navy relative overflow-hidden transition-all animate-fadeIn">
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-carpet-maroon via-marigold to-signboard-navy" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-signboard-navy/15 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="stamp-badge text-carpet-maroon border-carpet-maroon bg-carpet-maroon/10 inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-carpet-maroon animate-ping" />
              Multi-Agent AI Pipeline
            </span>
            <span className="text-xs text-signboard-navy/60 font-heading font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-carpet-maroon" />
              Elapsed: {elapsedSeconds}s
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-signboard-navy mt-1.5 tracking-tight flex items-center gap-2.5">
            <span>Crafting Your Royal Blueprint</span>
            <Loader2 className="w-5 h-5 text-carpet-maroon animate-spin" />
          </h2>
          <p className="text-xs sm:text-sm text-signboard-navy/70 font-medium mt-0.5">
            Querying live OpenStreetMap Overpass nodes, calculating real OSRM road transit, and balancing budget.
          </p>
        </div>

        {prompt && (
          <div className="bg-parchment/80 rounded-2xl px-4 py-2.5 border border-signboard-navy/15 max-w-sm self-start sm:self-auto">
            <span className="text-[10px] font-heading font-black text-carpet-maroon uppercase tracking-wider block">
              Active Request
            </span>
            <span className="text-xs font-heading font-bold text-signboard-navy line-clamp-2">
              "{prompt}"
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-heading font-black">
          <span className="text-carpet-maroon flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span>
              Stage {currentStepIndex + 1} of {PIPELINE_STEPS.length}: {PIPELINE_STEPS[currentStepIndex].title}
            </span>
          </span>
          <span className="text-signboard-navy/60 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-parchment rounded-full overflow-hidden border-2 border-signboard-navy/20 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-carpet-maroon via-marigold to-carpet-maroon transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step-by-Step Multi-Agent Pipeline Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
        {PIPELINE_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isPending = idx > currentStepIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3 relative overflow-hidden ${
                isDone
                  ? "bg-emerald-50/70 border-emerald-500/40 text-signboard-navy"
                  : isCurrent
                  ? "bg-amber-50/90 border-marigold shadow-bollywood scale-[1.02] text-signboard-navy"
                  : "bg-white/50 border-signboard-navy/10 text-signboard-navy/40 opacity-70"
              }`}
            >
              {/* Icon Status Badge */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs transition-colors ${
                  isDone
                    ? "bg-emerald-600 text-white"
                    : isCurrent
                    ? "bg-carpet-maroon text-marigold animate-pulse"
                    : "bg-signboard-navy/10 text-signboard-navy/40"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-heading font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-signboard-navy/5 text-signboard-navy/70">
                    Step {idx + 1}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-heading font-bold text-carpet-maroon animate-pulse">
                      Processing...
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[10px] font-heading font-bold text-emerald-700">
                      Verified ✓
                    </span>
                  )}
                </div>
                <h4 className={`text-xs font-heading font-black leading-snug ${isCurrent ? "text-carpet-maroon" : ""}`}>
                  {step.title}
                </h4>
                <p className="text-[11px] leading-relaxed text-signboard-navy/70 font-medium">
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cultural Trivia & Safety Note */}
      <div className="p-4 rounded-2xl bg-parchment/90 border border-signboard-navy/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-marigold/40 text-carpet-maroon flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-signboard-navy/80 font-body font-medium">
            <strong className="text-signboard-navy font-heading font-black">Expedition Dispatch: </strong>
            <span className="italic">{CULTURAL_FACTS[factIndex]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
