import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';

export default function ProblemSolution() {
  const cards = [
    {
      title: "Tourists see the same 10 places",
      brokenLabel: "The Broken Loop",
      brokenDesc: "Default to generic TripAdvisor lists. Trips collapse into 'visit → selfie → leave' without ever discovering the hidden heartbeat of a city.",
      solutionTitle: "Personalised Quest Lines",
      solutionDesc: "Narrative quests that pull you into artisan courtyards, heritage kitchens, and stories guidebooks never print.",
      border: "border-red-300"
    },
    {
      title: "Local businesses stay invisible",
      brokenLabel: "The Broken Loop",
      brokenDesc: "Incredible 80-year-old brass carvers, sweetmakers, and weavers have zero ad budget while thousands of tourists walk right past their lane.",
      solutionTitle: "Direct Measurable Footfall",
      solutionDesc: "Quests route travellers directly to their doorsteps, turning curious wanderers into paying patrons who spend locally.",
      border: "border-amber-300"
    },
    {
      title: "Landmarks choke with crowds",
      brokenLabel: "The Broken Loop",
      brokenDesc: "Footfall concentrates on 2–3 bottlenecks, causing traffic snarls, long queues, and exhausted tourists while nearby areas starve.",
      solutionTitle: "Incentive-Driven Crowd Balancing",
      solutionDesc: "Dynamic rewards boost credits on nearby quiet lanes in real time — crowds disperse willingly without negative warning labels.",
      border: "border-emerald-300"
    }
  ];

  return (
    <section id="problem" className="py-24 bg-[#FAF5EE] border-b-2 border-zinc-200 relative text-signboard-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase font-black tracking-widest text-carpet-maroon bg-carpet-maroon/15 px-3.5 py-1.5 rounded-full border border-carpet-maroon/30">
            The Problem Today · What's Actually Broken
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-signboard-navy mt-3">
            Tourism Is Trapped in a 10-Spot Bubble
          </h2>
          <p className="mt-3 text-base text-signboard-navy/85 font-medium">
            Everyone is operating on incomplete, undistributed information. RAAHI routes both interest and footfall.
          </p>
        </div>

        {/* 3 Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`bg-white rounded-3xl p-6 sm:p-7 border-3 ${card.border} shadow-md flex flex-col justify-between hover:shadow-xl transition-all`}
            >
              <div>
                {/* Broken state */}
                <div className="flex items-center gap-2 text-xs font-black text-red-700 uppercase tracking-wider mb-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{card.brokenLabel}</span>
                </div>
                <h3 className="text-xl font-heading font-black text-signboard-navy mb-3">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-signboard-navy/80 font-medium leading-relaxed mb-6 bg-red-50 p-3.5 rounded-xl border border-red-200">
                  {card.brokenDesc}
                </p>

                {/* Divider arrow */}
                <div className="flex items-center justify-center my-3">
                  <div className="h-[2px] flex-1 bg-zinc-200" />
                  <span className="px-3 text-xs font-heading font-black uppercase tracking-wider text-carpet-maroon bg-zinc-100 py-1 rounded-md">
                    Enter RAAHI
                  </span>
                  <div className="h-[2px] flex-1 bg-zinc-200" />
                </div>

                {/* Solution state */}
                <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1 pt-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{card.solutionTitle}</span>
                </div>
                <p className="text-xs sm:text-sm text-signboard-navy/90 font-medium leading-relaxed bg-emerald-50 p-3.5 rounded-xl border border-emerald-300">
                  {card.solutionDesc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-zinc-100 flex items-center justify-between text-xs font-black text-carpet-maroon">
                <span>Value Loop #{i + 1}</span>
                <span className="flex items-center gap-1 font-heading">
                  Active in prototype <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* PRD Synthesis Banner */}
        <div className="mt-12 bg-signboard-navy text-parchment p-6 sm:p-8 rounded-3xl shadow-signboard border-2 border-marigold flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-carpet-maroon border border-marigold shrink-0">
              <TrendingUp className="w-7 h-7 text-marigold" />
            </div>
            <div>
              <span className="text-xs uppercase font-black tracking-widest text-marigold">
                Core Redistribution Insight
              </span>
              <p className="text-sm sm:text-base font-normal mt-1 text-parchment leading-snug">
                "Crowding &rarr; dynamic reward &rarr; redistribution &rarr; more local footfall. This is the mechanism, not decoration — wired directly into the RAAHI reward engine."
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <a
              href="#quests-demo"
              className="bg-marigold hover:bg-amber-300 active:scale-95 text-signboard-navy font-heading font-black text-xs sm:text-sm px-6 py-3 rounded-full shadow-md flex items-center gap-2 transition-transform cursor-pointer"
            >
              <span>Test Crowd Toggle Below</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
