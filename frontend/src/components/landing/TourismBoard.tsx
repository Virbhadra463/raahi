import React from 'react';
import { Landmark, TrendingUp, Users, ShieldAlert, ArrowUpRight, BarChart3, Radio } from 'lucide-react';

export default function TourismBoard() {
  const metrics = [
    {
      label: 'Footfall Diverted to Local Lanes',
      value: '38.4%',
      change: '+14.2% vs yesterday',
      positive: true,
      desc: 'Tourists steered away from jammed choke points'
    },
    {
      label: 'Direct Local Economy Spend',
      value: '₹4,82,500',
      change: '100% direct to vendors',
      positive: true,
      desc: 'Zero intermediary commission extracted'
    },
    {
      label: 'Active Wayfarers on Route',
      value: '1,420',
      change: '88 active quest trails',
      positive: true,
      desc: 'Distributed across 16 micro-neighborhoods'
    },
    {
      label: 'Landmark Bottleneck Reduction',
      value: '-52 mins',
      change: 'Avg queue time dropped',
      positive: true,
      desc: 'Relieved civic pressure & traffic congestion'
    }
  ];

  const zoneFeed = [
    {
      zone: 'Sector 1 · Hawa Mahal & Chaupar',
      status: 'Relieved',
      statusColor: 'bg-emerald-900/90 text-emerald-300 border-emerald-500',
      action: 'Automatic crowd surge diverted 160 tourists into Ghee Walon Ka Rasta.',
      time: '3m ago'
    },
    {
      zone: 'Sector 3 · Gopalji Handloom Alley',
      status: 'Active Flow',
      statusColor: 'bg-blue-900/90 text-blue-300 border-blue-500',
      action: '48 visitors completed Weaver Ramdas diary quest; 32 textile purchases verified.',
      time: '11m ago'
    },
    {
      zone: 'Sector 4 · Khari Baoli Spice Quarter',
      status: 'Dynamic Surge 2x',
      statusColor: 'bg-amber-900/90 text-amber-300 border-amber-500',
      action: 'Bonus incentives activated to spread visitor footfall toward rooftop spice terraces.',
      time: '24m ago'
    }
  ];

  return (
    <section id="tourism-board" className="py-24 bg-white border-b-2 border-zinc-200 text-signboard-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase font-black tracking-widest text-signboard-navy bg-zinc-100 px-3.5 py-1.5 rounded-full border-2 border-zinc-300">
            Civic Platform · Destination Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-signboard-navy mt-3">
            City Custodians See the Real Footfall Shift
          </h2>
          <p className="mt-3 text-base text-signboard-navy/85 font-medium">
            A live command interface for city tourism boards, civic administrators, and local merchant associations to manage carrying capacity in real time.
          </p>
        </div>

        {/* Intelligence Monitor Card */}
        <div className="bg-signboard-dark rounded-3xl p-6 sm:p-10 shadow-2xl border-3 border-marigold text-parchment relative overflow-hidden">
          
          {/* Top terminal bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b-2 border-zinc-700/60 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-carpet-maroon text-marigold flex items-center justify-center border-2 border-marigold shrink-0">
                <Landmark className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-marigold">
                    RAAHI · DESTINATION INTELLIGENCE NETWORK
                  </span>
                  <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-400 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-600">
                    <Radio className="w-3 h-3 animate-pulse" />
                    LIVE TELEMETRY
                  </span>
                </div>
                <div className="text-base sm:text-lg font-heading font-black text-parchment mt-0.5">
                  Jaipur Walled City Civic Jurisdiction · Pilot Node #01
                </div>
              </div>
            </div>

            <div className="text-xs font-mono text-parchment bg-signboard-navy px-4 py-2 rounded-xl border border-marigold/40">
              Auto-balancing algorithm: <span className="text-emerald-400 font-bold">ACTIVE</span>
            </div>
          </div>

          {/* 4 Metric Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((m, i) => (
              <div
                key={i}
                className="bg-signboard-navy rounded-2xl p-5 border-2 border-marigold/40 flex flex-col justify-between"
              >
                <div className="text-xs font-black text-parchment uppercase tracking-wider mb-2">
                  {m.label}
                </div>
                <div>
                  <div className="text-3xl font-heading font-black text-marigold tracking-tight mb-1">
                    {m.value}
                  </div>
                  <div className="text-xs text-emerald-400 font-black mb-2">
                    {m.change}
                  </div>
                  <div className="text-xs text-parchment font-medium leading-snug">
                    {m.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Real-time event log */}
          <div className="bg-signboard-navy rounded-2xl p-6 border-2 border-marigold/40">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-marigold" />
                <span className="text-xs sm:text-sm font-heading font-black uppercase tracking-wider text-parchment">
                  Live Dynamic Redistribution Activity
                </span>
              </div>
              <span className="text-xs font-mono text-parchment font-bold">Refreshed: 30s ago</span>
            </div>

            <div className="space-y-3">
              {zoneFeed.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-signboard-dark border border-zinc-700 text-xs sm:text-sm gap-2 text-parchment"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-heading font-black border ${item.statusColor}`}>
                      {item.status}
                    </span>
                    <strong className="text-parchment font-heading font-bold text-sm">
                      {item.zone}
                    </strong>
                  </div>
                  <div className="text-parchment font-normal sm:text-right flex-1 sm:px-4">
                    {item.action}
                  </div>
                  <div className="text-xs font-mono text-marigold shrink-0 font-bold">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
