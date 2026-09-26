"use client";

import React, { useState } from "react";
import { ItineraryDay } from "../../types/travel";
import {
  CalendarDays,
  Clock,
  Car,
  MapPin,
  Utensils,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface ItineraryTimelineProps {
  itinerary: ItineraryDay[];
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ itinerary }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (!itinerary || itinerary.length === 0) return null;

  const currentDay = itinerary[selectedDayIndex] || itinerary[0];

  return (
    <div className="bg-[#FFFDF9] rounded-3xl shadow-bollywood-lg border-2 sm:border-3 border-signboard-navy p-6 sm:p-8 space-y-6 text-signboard-navy relative overflow-hidden">
      {/* Top Header & Day Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-signboard-navy/15 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-carpet-maroon text-marigold flex items-center justify-center shadow-xs">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-signboard-navy text-base sm:text-xl">
              Daily Cultural Expedition Log
            </h3>
            <p className="text-[11px] text-signboard-navy/60 font-semibold">
              Hour-by-hour sequence with real OSRM road transit buffers
            </p>
          </div>
        </div>

        {/* Day Selector Tabs Styled as Vintage Ticket Stubs */}
        <div className="flex flex-wrap gap-2 bg-parchment p-1.5 rounded-2xl border border-signboard-navy/15">
          {itinerary.map((day, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedDayIndex(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
                selectedDayIndex === idx
                  ? "bg-carpet-maroon text-white shadow-bollywood border-2 border-carpet-maroon"
                  : "text-signboard-navy hover:bg-marigold/30 border-2 border-transparent"
              }`}
            >
              Day {day.day_number}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Day Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-parchment border-2 border-signboard-navy/15 shadow-xs">
        <div>
          <div className="text-xs font-heading font-black text-carpet-maroon uppercase tracking-wider">
            Day {currentDay.day_number} {currentDay.date ? `· ${currentDay.date}` : ""}
          </div>
          <h4 className="text-lg font-heading font-black text-signboard-navy mt-0.5">
            {currentDay.title}
          </h4>
        </div>
        <div className="flex items-center gap-2 text-xs font-heading font-bold text-signboard-navy/80 bg-white px-3 py-1.5 rounded-xl border border-signboard-navy/15 self-start md:self-auto shadow-xs">
          <Car className="w-3.5 h-3.5 text-carpet-maroon" />
          <span>
            Total road travel today: <strong>{currentDay.day_total_travel_minutes} mins</strong> ({currentDay.day_total_travel_km} km)
          </span>
        </div>
      </div>

      {/* Chronological Timeline */}
      <div className="relative pl-7 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-carpet-maroon/30 before:border-r-2 before:border-dashed before:border-carpet-maroon/40">
        {currentDay.activities.map((act, idx) => (
          <div key={idx} className="relative group">
            {/* Dot on line */}
            <div
              className={`absolute -left-[35px] sm:-left-[39px] top-2 w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] text-white font-bold ${
                act.is_meal
                  ? "bg-[#F09367]"
                  : idx === 0
                  ? "bg-carpet-maroon"
                  : "bg-signboard-navy"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            {/* Travel transit alert between stops */}
            {act.travel_from_previous_minutes > 0 && (
              <div className="inline-flex items-center gap-1.5 text-[11px] text-signboard-navy font-heading font-bold bg-marigold/30 px-3 py-1 rounded-full mb-3 border border-marigold shadow-xs">
                <Car className="w-3 h-3 text-carpet-maroon" />
                <span>
                  {act.travel_from_previous_minutes} mins transit ({act.travel_distance_km} km)
                </span>
              </div>
            )}

            <div className="p-4 sm:p-5 rounded-2xl border-2 border-signboard-navy/15 bg-white hover:border-signboard-navy/35 transition-all shadow-xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-signboard-navy text-marigold font-mono text-xs font-black flex items-center gap-1 shadow-xs">
                    <Clock className="w-3 h-3 text-marigold" />
                    {act.time}
                  </span>
                  <h5 className="font-heading font-black text-signboard-navy text-base sm:text-lg">
                    {act.place}
                  </h5>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-signboard-navy/60 font-semibold font-body">
                    {act.duration_minutes} mins
                  </span>
                  {act.is_meal && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-carpet-maroon/10 text-carpet-maroon text-[11px] font-heading font-black flex items-center gap-1 border border-carpet-maroon/30">
                      <Utensils className="w-3 h-3" /> Food Stop
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-lg bg-marigold/30 text-signboard-navy text-[11px] font-heading font-bold border border-marigold">
                    {act.category}
                  </span>
                </div>
              </div>

              {act.notes && (
                <p className="text-xs sm:text-sm text-signboard-navy/80 leading-relaxed font-body font-medium">
                  {act.notes}
                </p>
              )}

              {act.accessibility && act.accessibility !== "Accessibility information unavailable" && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-heading font-bold pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{act.accessibility}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
