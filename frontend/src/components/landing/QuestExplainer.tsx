import React from 'react';
import { motion } from 'framer-motion';
import { HOW_IT_WORKS_STEPS } from '../../data/landing/quests';
import { Sparkles, Map, HeartHandshake, Award } from 'lucide-react';

const iconMap = {
  Sparkles: Sparkles,
  Map: Map,
  HeartHandshake: HeartHandshake,
  Award: Award,
};

export default function QuestExplainer() {
  return (
    <section id="how-it-works" className="py-24 bg-white border-b-2 border-zinc-200 text-signboard-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase font-black tracking-widest text-carpet-maroon bg-carpet-maroon/15 px-3.5 py-1.5 rounded-full border border-carpet-maroon/30">
            The RAAHI Method · The 4-Step Journey
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-signboard-navy mt-3">
            How a Quest Unfolds
          </h2>
          <p className="mt-3 text-base text-signboard-navy/85 font-medium">
            A 4-step story engine designed to replace rigid itineraries with spontaneous, rewarding exploration.
          </p>
        </div>

        {/* 4 Steps Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Icon = iconMap[step.icon] || Sparkles;

            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="bg-[#FAF5EE] rounded-3xl p-6 border-3 border-zinc-200 hover:border-signboard-navy transition-all duration-200 hover:shadow-xl flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Step watermarked number */}
                <div className="absolute top-2 right-4 text-5xl font-display font-black text-zinc-300 select-none pointer-events-none group-hover:text-marigold/40 transition-colors">
                  {step.step}
                </div>

                <div>
                  {/* Top indicator & icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-signboard-navy text-marigold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-heading font-black text-carpet-maroon bg-white px-3 py-1 rounded-md border-2 border-zinc-200">
                      Step {step.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-black text-signboard-navy mb-1 group-hover:text-carpet-maroon transition-colors">
                    {step.title}
                  </h3>
                  <div className="text-xs font-black text-terracotta uppercase tracking-wider mb-3">
                    {step.subtitle}
                  </div>

                  <p className="text-xs sm:text-sm text-signboard-navy/85 font-medium leading-relaxed mb-4">
                    {step.desc}
                  </p>
                </div>

                {/* Example box */}
                <div className="mt-4 pt-3 border-t-2 border-zinc-200 bg-white p-3.5 rounded-2xl border">
                  <span className="text-[10px] uppercase font-black text-signboard-navy/60 tracking-wider block mb-1">
                    Real-World Example
                  </span>
                  <p className="font-handwriting font-bold text-xs sm:text-sm text-signboard-navy">
                    {step.example}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quest Loop Formula */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-signboard-navy text-parchment px-7 py-3.5 rounded-full text-xs sm:text-sm font-heading font-black shadow-signboard border-2 border-marigold">
            <span className="text-marigold">PLAY</span>
            <span>&rarr;</span>
            <span className="text-signboard-pink">EXPLORE</span>
            <span>&rarr;</span>
            <span className="text-parchment">DISCOVER</span>
            <span>&rarr;</span>
            <span className="text-emerald-400">SPEND LOCALLY</span>
            <span>&rarr;</span>
            <span className="text-marigold">EARN</span>
            <span>&rarr;</span>
            <span className="text-parchment">CONTINUE</span>
          </div>
        </div>

      </div>
    </section>
  );
}
