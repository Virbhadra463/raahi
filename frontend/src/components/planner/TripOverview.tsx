"use client";

import React from "react";
import { TripSummary } from "../../types/travel";
import { MapPin, Calendar, Wallet, Users, Heart, ShieldCheck, Utensils, Sparkles, FileDown } from "lucide-react";

interface TripOverviewProps {
  trip: TripSummary;
  tripName?: string;
  message?: string;
  relaxations?: string[];
  onDownloadWord?: () => Promise<void> | void;
}

export const TripOverview: React.FC<TripOverviewProps> = ({
  trip,
  tripName,
  message,
  relaxations,
  onDownloadWord,
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async () => {
    if (!onDownloadWord) return;
    try {
      setIsDownloading(true);
      await onDownloadWord();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-[#FFFDF9] rounded-3xl shadow-bollywood-lg border-2 sm:border-3 border-signboard-navy p-6 sm:p-8 space-y-6 text-signboard-navy relative overflow-hidden w-full h-full flex flex-col justify-between">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-signboard-navy/15 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="stamp-badge text-carpet-maroon border-carpet-maroon bg-carpet-maroon/10">
              Verified Royal Blueprint
            </span>
            <span className="text-xs text-signboard-navy/60 font-heading font-bold">
              Real OSRM &amp; OSM Geocoding
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-signboard-navy mt-1 tracking-tight">
            {tripName || trip?.destination || "Expedition"} Itinerary
          </h2>
          <p className="text-xs sm:text-sm text-signboard-navy/70 font-medium mt-0.5">
            Personalized route schedule optimized for budget, cultural density, and transit comfort.
          </p>
        </div>

        {onDownloadWord && (
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-carpet-maroon hover:bg-carpet-light active:scale-95 text-white font-heading font-black text-xs uppercase tracking-wider shadow-bollywood border-2 border-carpet-maroon transition-all cursor-pointer self-start sm:self-auto shrink-0 disabled:opacity-50"
            title="Download full verified itinerary as Microsoft Word document (.docx)"
          >
            <FileDown className="w-4 h-4 text-marigold" />
            <span>{isDownloading ? "Generating Word..." : "Download Itinerary (.docx)"}</span>
          </button>
        )}
      </div>

      {/* Highlights Metrics Ribbon */}
      <div className="flex flex-wrap gap-2.5">
        <div className="flex items-center gap-2 px-3.5 py-2 bg-parchment rounded-xl border border-signboard-navy/15 text-xs font-heading font-bold text-signboard-navy shadow-xs">
          <Calendar className="w-4 h-4 text-carpet-maroon" />
          <span>
            {trip?.duration_days || 1} Days ({Math.max(1, (trip?.duration_days || 1) - 1)} Nights)
          </span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 bg-marigold/30 rounded-xl border border-marigold text-xs font-heading font-bold text-signboard-navy shadow-xs">
          <Wallet className="w-4 h-4 text-carpet-maroon" />
          <span>₹{(trip?.budget || 0).toLocaleString()} Total Budget</span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 bg-parchment rounded-xl border border-signboard-navy/15 text-xs font-heading font-bold text-signboard-navy shadow-xs">
          <Users className="w-4 h-4 text-signboard-navy" />
          <span>
            {trip?.travellers || 1} {(trip?.travellers || 1) === 1 ? "Traveler" : "Travelers"}
            {trip?.traveller_types?.length > 0 && ` (${trip.traveller_types.join(", ")})`}
          </span>
        </div>

        {trip?.food_preferences?.length > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-[#F09367]/20 rounded-xl border border-[#F09367]/50 text-xs font-heading font-bold text-signboard-navy shadow-xs">
            <Utensils className="w-4 h-4 text-carpet-maroon" />
            <span>{trip.food_preferences.join(", ")}</span>
          </div>
        )}
      </div>

      {/* AI Narrative Summary */}
      {(message || relaxations) && (
        <div className="bg-parchment/80 border-2 border-marigold/60 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed text-signboard-navy whitespace-pre-line shadow-xs font-body font-medium">
          <div className="flex items-center gap-1.5 text-xs font-heading font-black text-carpet-maroon uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span>Planner's Dispatch</span>
          </div>
          {message}
          {relaxations && relaxations.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-signboard-navy/10 text-xs font-heading font-bold text-carpet-maroon">
              <strong>Smart Route Adjustments:</strong> {relaxations.join(", ")}
            </div>
          )}
        </div>
      )}

      {/* Constraints & Preferences Tags */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-parchment/60 border border-signboard-navy/15">
          <div className="w-8 h-8 rounded-xl bg-carpet-maroon/10 text-carpet-maroon flex items-center justify-center shrink-0 mt-0.5">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-heading font-black uppercase tracking-wider text-signboard-navy/60">
              Interests &amp; Vibes
            </div>
            <div className="text-xs font-heading font-bold text-signboard-navy capitalize mt-0.5">
              {trip?.interests?.join(", ") || "Heritage, Temples & Cuisine"}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-parchment/60 border border-signboard-navy/15">
          <div className="w-8 h-8 rounded-xl bg-signboard-navy/10 text-signboard-navy flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-heading font-black uppercase tracking-wider text-signboard-navy/60">
              Pace &amp; Transit
            </div>
            <div className="text-xs font-heading font-bold text-signboard-navy capitalize mt-0.5">
              {trip?.pace || "Balanced"} pace (optimized road legs)
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-parchment/60 border border-signboard-navy/15">
          <div className="w-8 h-8 rounded-xl bg-marigold/40 text-carpet-maroon flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-heading font-black uppercase tracking-wider text-signboard-navy/60">
              Base Stay Landmark
            </div>
            <div className="text-xs font-heading font-bold text-signboard-navy mt-0.5">
              Near {trip?.accommodation_preferences?.near || "Central Heritage Core"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
