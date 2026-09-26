import React from 'react';
import { motion } from 'framer-motion';
import { STAKEHOLDERS } from '../../data/landing/quests';
import { Compass, Store, Building2, Car, Landmark, ArrowUpRight } from 'lucide-react';

const iconMap = {
  Compass: Compass,
  Store: Store,
  Building2: Building2,
  Car: Car,
  Landmark: Landmark,
};

export default function Stakeholders() {
  return (
    <section id="stakeholders" className="py-24 bg-[#FAF5EE] border-b-2 border-zinc-200 text-signboard-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase font-black tracking-widest text-terracotta bg-marigold/30 px-3.5 py-1.5 rounded-full border border-terracotta/40">
            Shared Value · Ecosystem Impact
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-signboard-navy mt-3">
            Everyone Wins When Footfall Moves
          </h2>
          <p className="mt-3 text-base text-signboard-navy/85 font-medium">
            Every completed quest quietly redistributes spend, visibility, and attention across five stakeholder groups at once.
          </p>
        </div>

        {/* 5 Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {STAKEHOLDERS.map((item, index) => {
            const Icon = iconMap[item.icon] || Compass;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-5 border-3 border-zinc-200 hover:border-carpet-maroon hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Role & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-signboard-navy text-marigold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-carpet-maroon bg-carpet-maroon/10 px-2 py-0.5 rounded border border-carpet-maroon/20">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-heading font-black text-signboard-navy mb-0.5">
                    {item.role}
                  </h3>
                  <div className="text-xs font-black text-terracotta mb-3">
                    {item.title}
                  </div>

                  {/* Benefit statement */}
                  <p className="text-xs text-signboard-navy/85 leading-relaxed font-medium">
                    {item.benefit}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t-2 border-zinc-100 flex items-center justify-between text-xs font-black text-signboard-navy group-hover:text-carpet-maroon transition-colors">
                  <span>Stakeholder #{index + 1}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
