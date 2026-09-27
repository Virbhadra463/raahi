"use client";

import React, { useState } from "react";
import { TripListItem } from "../../types/travel";
import {
  Compass,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  MapPin,
  Calendar,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface TripBarProps {
  trips: TripListItem[];
  activeTripId: string | null;
  onSelectTrip: (sessionId: string) => void;
  onCreateTripClick: () => void;
  onRenameTrip: (sessionId: string, newName: string) => void;
  onDeleteTrip: (sessionId: string) => void;
}

export const TripBar: React.FC<TripBarProps> = ({
  trips,
  activeTripId,
  onSelectTrip,
  onCreateTripClick,
  onRenameTrip,
  onDeleteTrip,
}) => {
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleStartRename = (t: TripListItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTripId(t.session_id);
    setEditingName(t.name);
  };

  const handleSaveRename = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingName.trim()) {
      onRenameTrip(sessionId, editingName.trim());
    }
    setEditingTripId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTripId(null);
  };

  return (
    <div className="w-full bg-[#FFFDF9] rounded-3xl shadow-bollywood-lg border-2 sm:border-3 border-signboard-navy p-5 sm:p-6 transition-all space-y-4 text-signboard-navy">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-signboard-navy/15 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-carpet-maroon text-marigold flex items-center justify-center font-bold shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-sm text-signboard-navy flex items-center gap-2">
              <span>My Saved Expeditions</span>
              <span className="text-[11px] font-heading font-bold px-2.5 py-0.5 rounded-full bg-marigold/40 text-carpet-maroon border border-marigold">
                {trips.length} {trips.length === 1 ? "journey" : "journeys"}
              </span>
            </h3>
            <p className="text-[11px] text-signboard-navy/60 font-medium">
              Click any trip to view its verified stops, stay bookings, and interactive map.
            </p>
          </div>
        </div>

        {/* Create a Trip Button */}
        <button
          type="button"
          onClick={onCreateTripClick}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-marigold hover:bg-amber-300 active:scale-95 text-signboard-navy font-heading font-black text-xs uppercase tracking-wider shadow-bollywood border-2 border-signboard-navy transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Expedition</span>
        </button>
      </div>

      {/* Trips Horizontal Tabs / Cards */}
      {trips.length === 0 ? (
        <div className="py-6 text-center text-xs text-signboard-navy/60 space-y-1 font-medium">
          <p>No saved trips yet. Click <strong>New Expedition</strong> or use the prompt above to plan your journey!</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
          {trips.map((trip) => {
            const isActive = trip.session_id === activeTripId;
            const isEditing = editingTripId === trip.session_id;

            return (
              <div
                key={trip.session_id}
                onClick={() => !isEditing && onSelectTrip(trip.session_id)}
                className={`group relative shrink-0 rounded-2xl px-4 py-3 transition-all cursor-pointer border-2 flex flex-col justify-between gap-2 min-w-[210px] max-w-[270px] ${
                  isActive
                    ? "bg-signboard-navy text-parchment border-signboard-navy shadow-bollywood"
                    : "bg-parchment/60 hover:bg-parchment text-signboard-navy border-signboard-navy/20 hover:border-signboard-navy/50 shadow-xs"
                }`}
              >
                {/* Header row: Title + Actions */}
                <div className="flex items-center justify-between gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full text-xs font-heading font-bold px-2 py-1 rounded-lg border-2 border-marigold bg-white text-signboard-navy focus:outline-none"
                      />
                      <button
                        onClick={(e) => handleSaveRename(trip.session_id, e)}
                        className="text-emerald-500 hover:text-emerald-400 p-1 rounded hover:bg-white/10"
                        title="Save rename"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                      <button
                        onClick={handleCancelRename}
                        className="text-parchment/60 hover:text-parchment p-1 rounded hover:bg-white/10"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 truncate">
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-marigold shrink-0 animate-ping" />
                        )}
                        <h4
                          className={`text-xs font-heading font-black truncate tracking-wide ${
                            isActive ? "text-parchment" : "text-signboard-navy"
                          }`}
                          title={trip.name}
                        >
                          {trip.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => handleStartRename(trip, e)}
                          title="Rename expedition"
                          className={`p-1 rounded transition-colors ${
                            isActive
                              ? "text-parchment/70 hover:text-marigold hover:bg-white/10"
                              : "text-signboard-navy/50 hover:text-signboard-navy hover:bg-signboard-navy/10"
                          }`}
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete expedition "${trip.name}"?`)) {
                              onDeleteTrip(trip.session_id);
                            }
                          }}
                          title="Delete expedition"
                          className={`p-1 rounded transition-colors ${
                            isActive
                              ? "text-rose-300 hover:text-rose-200 hover:bg-white/10"
                              : "text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          }`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Subtitle / Details */}
                <div className="flex items-center justify-between text-[10px] font-semibold">
                  <div className="flex items-center gap-1.5 truncate">
                    {trip.destination ? (
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className={`w-3 h-3 shrink-0 ${isActive ? "text-marigold" : "text-carpet-maroon"}`} />
                        <span className={`truncate ${isActive ? "text-parchment/80" : "text-signboard-navy/70"}`}>
                          {trip.destination}
                        </span>
                      </span>
                    ) : (
                      <span className={isActive ? "text-parchment/60" : "text-signboard-navy/50"}>
                        Custom Trail
                      </span>
                    )}
                    {trip.duration_days && (
                      <span className={isActive ? "text-marigold font-bold" : "text-carpet-maroon font-bold"}>
                        · {trip.duration_days}d
                      </span>
                    )}
                  </div>

                  {isActive ? (
                    <span className="px-2 py-0.5 rounded-full bg-marigold text-signboard-navy font-heading font-black text-[9px] uppercase tracking-wider shrink-0 border border-signboard-navy/40">
                      Active
                    </span>
                  ) : (
                    trip.message_count > 0 && (
                      <span className="flex items-center gap-1 text-signboard-navy/50 shrink-0 font-bold">
                        <MessageSquare className="w-3 h-3" />
                        <span>{trip.message_count}</span>
                      </span>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
