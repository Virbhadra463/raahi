"use client";

import React from "react";
import { FlightItem } from "../../types/travel";
import { Plane, Clock, ArrowRight, ExternalLink, Sparkles } from "lucide-react";

interface FlightCardProps {
  flights?: FlightItem[];
  flight?: FlightItem;
  origin?: string;
  destination?: string;
}

export const FlightCard: React.FC<FlightCardProps> = (props: FlightCardProps = {}) => {
  const flightList: FlightItem[] =
    props.flights && props.flights.length > 0
      ? props.flights
      : ([props.flight].filter(Boolean) as FlightItem[]);

  if (!flightList || flightList.length === 0) return null;

  const bestFlight = flightList[0];
  const otherFlights = flightList.slice(1, 4);

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "--:--";
    return timeStr.replace(/:\d{2}$/, "");
  };

  return (
    <div className="w-full bg-[#FFFDF9] rounded-3xl shadow-bollywood-lg border-2 sm:border-3 border-signboard-navy p-6 sm:p-8 space-y-6 text-signboard-navy relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-signboard-navy/15 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-signboard-navy text-parchment flex items-center justify-center shadow-xs">
            <Plane className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-signboard-navy text-base sm:text-lg">
              Air Charter &amp; Flight Links
            </h3>
            <p className="text-[11px] text-signboard-navy/60 font-semibold">
              Live route options matched to your budget window
            </p>
          </div>
        </div>

        <span className="stamp-badge text-carpet-maroon border-carpet-maroon bg-carpet-maroon/10">
          Ranked by Price &amp; Stops
        </span>
      </div>

      {/* Best Match Boarding Card */}
      <div className="p-5 rounded-2xl bg-parchment/70 border-2 border-signboard-navy/15 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading font-black text-carpet-maroon uppercase tracking-wide flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-terracotta" /> Best Transit Deal
              </span>
              <span className="text-[11px] font-heading font-bold px-2 py-0.5 rounded-md bg-marigold/40 text-signboard-navy border border-marigold">
                {bestFlight.stops === 0 ? "Non-stop" : `${bestFlight.stops} stop(s)`}
              </span>
              {bestFlight.class_type && (
                <span className="text-[11px] font-semibold text-signboard-navy/60">
                  {bestFlight.class_type}
                </span>
              )}
            </div>
            <h4 className="text-lg font-heading font-black text-signboard-navy mt-1">
              {bestFlight.airline} {bestFlight.flight_number ? `(${bestFlight.flight_number})` : ""}
            </h4>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-2xl font-display font-black text-carpet-maroon">
              ₹{bestFlight.price.toLocaleString()}
            </div>
            <div className="text-[11px] text-signboard-navy/60 font-medium">per passenger ticket</div>
            {bestFlight.booking_url && (
              <a
                href={bestFlight.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-carpet-maroon hover:bg-carpet-light text-white text-xs font-heading font-black uppercase tracking-wider shadow-bollywood border-2 border-carpet-maroon transition-all cursor-pointer"
              >
                <span>Book Flight</span>
                <ExternalLink className="w-3.5 h-3.5 text-marigold" />
              </a>
            )}
          </div>
        </div>

        {/* Flight Route & Timing */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-signboard-navy/10 shadow-xs">
          <div className="text-left">
            <div className="text-lg font-display font-black text-signboard-navy">
              {bestFlight.departure_airport.id || "DEP"}
            </div>
            <div className="text-xs font-mono font-bold text-carpet-maroon">
              {formatTime(bestFlight.departure_airport.time)}
            </div>
            <div className="text-[11px] text-signboard-navy/60 font-semibold truncate max-w-[140px]">
              {bestFlight.departure_airport.name || "Departure"}
            </div>
          </div>

          <div className="flex flex-col items-center px-4">
            <div className="text-[11px] text-signboard-navy font-heading font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-carpet-maroon" />
              <span>
                {Math.floor(bestFlight.duration_minutes / 60)}h {bestFlight.duration_minutes % 60}m
              </span>
            </div>
            <div className="flex items-center gap-1.5 my-1.5">
              <div className="w-8 sm:w-12 h-[2px] bg-signboard-navy/30" />
              <Plane className="w-4 h-4 text-carpet-maroon rotate-90" />
              <div className="w-8 sm:w-12 h-[2px] bg-signboard-navy/30" />
            </div>
            <span className="text-[10px] font-heading font-black text-signboard-navy/60 uppercase tracking-wider">
              {bestFlight.stops === 0 ? "Direct Airway" : `${bestFlight.stops} Transit Stop`}
            </span>
          </div>

          <div className="text-right">
            <div className="text-lg font-display font-black text-signboard-navy">
              {bestFlight.arrival_airport.id || "ARR"}
            </div>
            <div className="text-xs font-mono font-bold text-carpet-maroon">
              {formatTime(bestFlight.arrival_airport.time)}
            </div>
            <div className="text-[11px] text-signboard-navy/60 font-semibold truncate max-w-[140px]">
              {bestFlight.arrival_airport.name || "Arrival"}
            </div>
          </div>
        </div>

        {/* Explainable Rationale */}
        <div className="text-xs text-signboard-navy/90 bg-white p-3.5 rounded-xl border-2 border-signboard-navy/10 leading-relaxed font-body font-medium">
          <span className="font-heading font-black text-signboard-navy">Selection Rationale: </span>
          {bestFlight.rationale}
        </div>
      </div>

      {/* Other Flight Options */}
      {otherFlights.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-xs font-heading font-black text-signboard-navy/70 uppercase tracking-wider">
            Alternative Air Options:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherFlights.map((fl, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border-2 border-signboard-navy/15 bg-white flex justify-between items-center text-xs"
              >
                <div>
                  <div className="font-heading font-black text-signboard-navy">{fl.airline}</div>
                  <div className="text-[11px] text-signboard-navy/60 font-medium">
                    {fl.duration_minutes}m · {fl.stops === 0 ? "Non-stop" : `${fl.stops} stop`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-black text-carpet-maroon">
                    ₹{fl.price.toLocaleString()}
                  </div>
                  {fl.booking_url && (
                    <a
                      href={fl.booking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-heading font-bold text-carpet-maroon hover:underline flex items-center justify-end gap-1 mt-0.5"
                    >
                      Book <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
