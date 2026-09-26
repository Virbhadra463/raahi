"use client";

import React, { useState } from "react";
import { Plus, X, Compass, MapPin, Sparkles } from "lucide-react";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (name: string, destination?: string) => void;
  onCreateTrip?: (name: string, destination?: string) => void;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onCreateTrip,
}) => {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const createFn = onCreate || onCreateTrip;
    if (createFn) {
      createFn(name.trim(), destination.trim() || undefined);
    }
    setName("");
    setDestination("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E0924]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FDF6E9] text-signboard-navy rounded-3xl p-7 sm:p-8 shadow-2xl border-3 border-signboard-navy relative overflow-hidden"
        style={{ boxShadow: "0 25px 50px -12px rgba(18, 13, 49, 0.45)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-signboard-navy/5 hover:bg-signboard-navy/10 flex items-center justify-center text-signboard-navy transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-carpet-maroon text-marigold flex items-center justify-center shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-heading font-black text-carpet-maroon uppercase tracking-widest block">
              Raahi Expeditions
            </span>
            <h3 className="font-heading font-black text-xl text-signboard-navy">
              Create New Journey
            </h3>
          </div>
        </div>

        <p className="text-xs text-signboard-navy/70 mb-5 font-medium leading-relaxed">
          Name your trip and set an optional primary destination to automatically generate a verified day-by-day itinerary.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-heading font-black text-signboard-navy uppercase tracking-wider block">
              Journey Name <span className="text-carpet-maroon">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal Jaipur Trails, Varanasi Ghats..."
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-signboard-navy/20 bg-white text-signboard-navy placeholder:text-signboard-navy/40 focus:outline-none focus:border-carpet-maroon focus:ring-2 focus:ring-carpet-maroon/20 font-body text-sm font-medium transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-heading font-black text-signboard-navy uppercase tracking-wider block">
              Target Destination <span className="text-signboard-navy/50 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-carpet-maroon absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Jaipur, Varanasi, Goa, Shirdi..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-signboard-navy/20 bg-white text-signboard-navy placeholder:text-signboard-navy/40 focus:outline-none focus:border-carpet-maroon focus:ring-2 focus:ring-carpet-maroon/20 font-body text-sm font-medium transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-heading font-bold text-signboard-navy/70 hover:text-signboard-navy hover:bg-signboard-navy/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 rounded-xl bg-carpet-maroon hover:bg-carpet-light active:scale-95 disabled:opacity-50 text-white text-xs font-heading font-black uppercase tracking-wider shadow-bollywood border-2 border-carpet-maroon transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Journey</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
