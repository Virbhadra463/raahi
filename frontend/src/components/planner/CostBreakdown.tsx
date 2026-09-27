"use client";

import React from "react";
import { EstimatedCost } from "../../types/travel";
import { Coins, Hotel, Utensils, Car, Ticket, PiggyBank, Sparkles } from "lucide-react";

interface CostBreakdownProps {
  cost?: EstimatedCost | null;
  budget?: number;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = (props: CostBreakdownProps = {}) => {
  const cost = props?.cost || (props as any)?.cost_breakdown || (props as any)?.estimated_cost;
  const budgetProp = props?.budget;

  if (!cost || typeof cost !== "object") {
    return (
      <div className="bg-[#FFFDF9] rounded-3xl shadow-bollywood-lg border-2 sm:border-3 border-signboard-navy p-6 sm:p-8 space-y-3 text-center text-signboard-navy w-full h-full flex flex-col justify-center">
        <div className="w-12 h-12 rounded-2xl bg-marigold/30 text-carpet-maroon mx-auto flex items-center justify-center">
          <Coins className="w-6 h-6" />
        </div>
        <h4 className="font-heading font-black text-sm text-signboard-navy uppercase tracking-wider">
          Budget Tracker
        </h4>
        <p className="text-xs text-signboard-navy/60 font-medium">
          Cost breakdown will compute automatically as your itinerary is crafted.
        </p>
      </div>
    );
  }

  const accom = Number(cost?.accommodation || 0);
  const food = Number(cost?.food || 0);
  const transport = Number(cost?.transport || 0);
  const activities = Number(cost?.activities || 0);
  const total = Number(cost?.total || (accom + food + transport + activities));
  const totalBudget = Number(cost?.budget || budgetProp || (total > 0 ? total : 10000));
  const remaining = Number(cost?.remaining_budget ?? Math.max(0, totalBudget - total));

  const safeTotalBudget = totalBudget > 0 ? totalBudget : 1;
  const accomPercent = Math.min(100, Math.round((accom / safeTotalBudget) * 100));
  const foodPercent = Math.min(100, Math.round((food / safeTotalBudget) * 100));
  const transportPercent = Math.min(100, Math.round((transport / safeTotalBudget) * 100));
  const activitiesPercent = Math.min(100, Math.round((activities / safeTotalBudget) * 100));
  const remainingPercent = Math.max(0, 100 - (accomPercent + foodPercent + transportPercent + activitiesPercent));

  return (
    <div className="bg-[#FFFDF9] rounded-3xl shadow-bollywood-lg border-2 sm:border-3 border-signboard-navy p-6 sm:p-8 space-y-6 text-signboard-navy relative overflow-hidden w-full h-full flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-signboard-navy/15 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-carpet-maroon text-marigold flex items-center justify-center shadow-xs">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-signboard-navy text-base sm:text-lg">
              Royal Treasury &amp; Budget
            </h3>
            <p className="text-[11px] text-signboard-navy/60 font-semibold">
              Deterministic multi-agent expenditure allocation
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-signboard-navy/60 font-heading font-bold uppercase tracking-wider block">
            Estimated / Cap
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-display font-black text-carpet-maroon">
              ₹{total.toLocaleString()}
            </span>
            <span className="text-xs text-signboard-navy/50 font-bold">
              / ₹{totalBudget.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Spice Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-4 bg-parchment rounded-full overflow-hidden flex gap-1 p-0.5 border-2 border-signboard-navy/20 shadow-inner">
          <div
            style={{ width: `${accomPercent}%` }}
            className="bg-[#E5A532] h-full rounded-full transition-all"
            title={`Stay: ₹${accom}`}
          />
          <div
            style={{ width: `${foodPercent}%` }}
            className="bg-[#F09367] h-full rounded-full transition-all"
            title={`Food: ₹${food}`}
          />
          <div
            style={{ width: `${transportPercent}%` }}
            className="bg-[#1C1440] h-full rounded-full transition-all"
            title={`Transit: ₹${transport}`}
          />
          <div
            style={{ width: `${activitiesPercent}%` }}
            className="bg-[#7A1026] h-full rounded-full transition-all"
            title={`Activities: ₹${activities}`}
          />
          <div
            style={{ width: `${remainingPercent}%` }}
            className="bg-[#059669] h-full rounded-full transition-all"
            title={`Emergency Reserve: ₹${remaining}`}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-heading font-bold text-signboard-navy/60 px-1">
          <span>₹0</span>
          <span>Target Budget: ₹{totalBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* Breakdown Items Matrix - Spacious 2-Column Grid */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Stay */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border-2 border-[#E5A532]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-amber-900 font-heading font-black">
            <span className="flex items-center gap-1.5">
              <Hotel className="w-4 h-4 text-[#E5A532]" />
              <span>Stay</span>
            </span>
            <span className="text-[11px] text-signboard-navy/60 font-bold">{accomPercent}%</span>
          </div>
          <div className="text-lg font-display font-black text-signboard-navy mt-1.5">
            ₹{accom.toLocaleString()}
          </div>
        </div>

        {/* Food */}
        <div className="p-3.5 rounded-2xl bg-orange-50/80 border-2 border-[#F09367]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-orange-900 font-heading font-black">
            <span className="flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-[#F09367]" />
              <span>Food</span>
            </span>
            <span className="text-[11px] text-signboard-navy/60 font-bold">{foodPercent}%</span>
          </div>
          <div className="text-lg font-display font-black text-signboard-navy mt-1.5">
            ₹{food.toLocaleString()}
          </div>
        </div>

        {/* Transit */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-[#1C1440]/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-signboard-navy font-heading font-black">
            <span className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-signboard-navy" />
              <span>Transit</span>
            </span>
            <span className="text-[11px] text-signboard-navy/60 font-bold">{transportPercent}%</span>
          </div>
          <div className="text-lg font-display font-black text-signboard-navy mt-1.5">
            ₹{transport.toLocaleString()}
          </div>
        </div>

        {/* Activities / Heritage */}
        <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-[#7A1026]/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-rose-900 font-heading font-black">
            <span className="flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-[#7A1026]" />
              <span>Heritage</span>
            </span>
            <span className="text-[11px] text-signboard-navy/60 font-bold">{activitiesPercent}%</span>
          </div>
          <div className="text-lg font-display font-black text-signboard-navy mt-1.5">
            ₹{activities.toLocaleString()}
          </div>
        </div>

        {/* Reserve Buffer - Full Width Card */}
        <div className="col-span-2 p-3.5 rounded-2xl bg-emerald-50/90 border-2 border-emerald-400/60 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-xs">
              <PiggyBank className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <div className="text-xs text-emerald-950 font-heading font-black leading-tight">
                Emergency Reserve
              </div>
              <div className="text-[10px] text-emerald-800 font-semibold">
                Unallocated safety buffer
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-display font-black text-signboard-navy">
              ₹{remaining.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-800 font-bold">{remainingPercent}% savings</div>
          </div>
        </div>
      </div>
    </div>
  );
};
