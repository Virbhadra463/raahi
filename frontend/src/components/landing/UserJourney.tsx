import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  TrendingUp,
  Store,
  Users,
  Award,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Flame,
  Coffee,
  QrCode
} from 'lucide-react';

export default function UserJourney() {
  const [activeStep, setActiveStep] = useState(0);

  const journeySteps = [
    {
      stepNumber: '01',
      time: '08:30 AM',
      phase: 'The Dynamic Divert',
      headline: 'Avoiding the Tourist Queue Bottleneck',
      location: 'Badi Chaupar, Old Jaipur',
      story: 'Aarav and Tanya arrive at Hawa Mahal. A tour bus has just unloaded 80 tourists; the entry line stretches 55 minutes out under the blazing sun. Normal travel apps would leave them stuck waiting in line.',
      raahiIntervention: 'RAAHI’s crowd engine senses the choke point and sends a live story cue: "Breeze windows are choked (55 min queue). Divert 180m into Ghee Walon Ka Rasta for 2x Raahi Credits + Panditji’s famous saffron kulhad chai on the house!"',
      metrics: {
        timeSaved: '55 Mins Saved',
        crowdImpact: '-14% Monument Strain',
        bonus: '+280 RC Dynamic Bonus'
      },
      badge: 'Crowd Balancing in Action',
      icon: Flame,
      color: 'border-orange-400 bg-orange-50'
    },
    {
      stepNumber: '02',
      time: '08:50 AM',
      phase: 'Narrative Navigation',
      headline: 'Story-Driven Clues Over Cold GPS Pins',
      location: 'Ghee Walon Ka Rasta Lane',
      story: 'Instead of staring downward at a generic blue GPS dot on Google Maps, RAAHI tells a sensory street story: "Walk past the silver leaf foil hammerers. Look for the peeling turquoise archway beside the brass samovar steaming with crushed cardamom and roasted cloves."',
      raahiIntervention: 'The travellers look UP at 150-year-old carved sandstone jharokhas, greet local shopkeepers, and follow aromas instead of phone screens.',
      metrics: {
        experience: 'Sensory Exploration',
        clueAccuracy: 'Turn-by-turn Lore',
        discoveries: '3 Hidden Courtyards'
      },
      badge: 'Heritage Story Navigation',
      icon: Compass,
      color: 'border-blue-400 bg-blue-50'
    },
    {
      stepNumber: '03',
      time: '09:15 AM',
      phase: 'The Real Connection',
      headline: 'Meeting Kishan-ji & Tasting Living Heritage',
      location: "Panditji's 90-Year-Old Chai Hearth",
      story: 'They reach Pandit Kishan-ji’s tiny shop, operating on this corner since 1934. Kishan-ji boils milk over slow babool wood coals and serves two clay kulhads spiced with saffron and fresh almonds.',
      raahiIntervention: 'Kishan-ji chats with them: "My grandfather served chai to the royal polo players who rode through this lane." They meet Master Ramdas, a 4th-generation woodblock printer taking his morning tea break beside them.',
      metrics: {
        humanTouch: '4th-Gen Family Recipe',
        authenticity: 'Zero Tourist Markup',
        atmosphere: 'Wood-fired Hearth'
      },
      badge: 'Local Cultural Immersion',
      icon: Coffee,
      color: 'border-amber-400 bg-amber-50'
    },
    {
      stepNumber: '04',
      time: '09:35 AM',
      phase: 'Verification & Direct Spend',
      headline: 'Zero-Fee Payment & Instant Wayfarer Reward',
      location: 'Kishan-ji’s Wooden Counter',
      story: 'Aarav pays ₹60 directly to Kishan-ji via UPI. Kishan-ji taps his wooden carved RAAHI QR token at the till. Aarav taps "Mark Complete" in the RAAHI app and scans the merchant token.',
      raahiIntervention: 'Boom! Celebratory confetti triggers on Aarav’s phone. He unlocks +280 Raahi Credits (surged from 140 RC). Kishan-ji keeps 100% of the payment with zero aggregator commission or middleman fees.',
      metrics: {
        directSpend: '₹60 to Local Artisan',
        platformFee: '₹0 Commission',
        creditsEarned: '+280 RC to Wallet'
      },
      badge: '100% Local Retention',
      icon: QrCode,
      color: 'border-emerald-400 bg-emerald-50'
    },
    {
      stepNumber: '05',
      time: '10:00 AM',
      phase: 'The Next Chapter Unlocks',
      headline: 'The Discovery Loop Continues',
      location: 'Haveli #4 Handloom Workshop',
      story: 'The quest is completed, but the journey never dead-ends. RAAHI detects Aarav’s interest in textiles and immediately unlocks the next nearby chapter: "Master Ramdas was charmed by your conversation over tea. His 120-year-old indigo block printing workshop across the alley is open — go stamp your own khadi bookmark."',
      raahiIntervention: 'Aarav and Tanya walk 20 meters across the stone alley to create a handcrafted keepsake. The virtuous loop is complete: Play → Explore → Discover → Spend Locally → Earn → Continue.',
      metrics: {
        loopStatus: 'Loop Active',
        nextStop: 'Haveli #4 Workshop',
        retention: 'Half-Day Trail Extended'
      },
      badge: 'Organic Story Chain',
      icon: Sparkles,
      color: 'border-pink-400 bg-pink-50'
    }
  ];

  const current = journeySteps[activeStep];
  const StepIcon = current.icon;

  return (
    <section id="user-journey" className="py-24 bg-white border-b-2 border-zinc-200 text-signboard-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-carpet-maroon/15 border border-carpet-maroon/30 text-carpet-maroon text-xs font-heading font-black uppercase tracking-widest mb-3">
            <Sparkles className="w-4 h-4 text-terracotta" />
            <span>End-to-End User Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-signboard-navy">
            A Day in the Life of a Raahi
          </h2>
          <p className="mt-3 text-base text-signboard-navy/85 font-medium">
            Walk step-by-step through Aarav and Tanya’s real morning in Jaipur — see how RAAHI transforms a frustrating 50-minute queue into an unforgettable local memory.
          </p>
        </div>

        {/* 5-Step Horizontal Timeline Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          {journeySteps.map((step, idx) => (
            <button
              key={step.stepNumber}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                activeStep === idx
                  ? 'bg-signboard-navy text-parchment border-signboard-navy shadow-lg scale-102'
                  : 'bg-[#FAF5EE] hover:bg-zinc-100 text-signboard-navy border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-black font-mono px-2 py-0.5 rounded ${
                  activeStep === idx ? 'bg-marigold text-signboard-navy' : 'bg-zinc-200 text-zinc-700'
                }`}>
                  {step.time}
                </span>
                <span className={`text-[11px] font-bold ${activeStep === idx ? 'text-signboard-pink' : 'text-zinc-500'}`}>
                  Step {step.stepNumber}
                </span>
              </div>
              <div className="font-heading font-black text-xs sm:text-sm line-clamp-1">
                {step.phase}
              </div>
            </button>
          ))}
        </div>

        {/* Active Journey Stage Detailed Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#FAF5EE] rounded-3xl p-6 sm:p-10 border-3 border-signboard-navy shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Column: Narrative Details */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-carpet-maroon text-parchment text-xs font-heading font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Phase {current.stepNumber} · {current.time}
                </span>
                <span className="bg-white text-signboard-navy border-2 border-zinc-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-carpet-maroon" />
                  <span>{current.location}</span>
                </span>
                <span className="text-xs font-bold text-terracotta bg-amber-100/70 border border-amber-300 px-3 py-1 rounded-full">
                  {current.badge}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-heading font-black text-signboard-navy">
                {current.headline}
              </h3>

              {/* What Happens (The Reality) */}
              <div className="bg-white p-5 rounded-2xl border-2 border-zinc-200 shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-signboard-navy/60 block mb-1.5">
                  The Real-World Situation
                </span>
                <p className="text-sm sm:text-base text-signboard-navy/90 font-medium leading-relaxed">
                  {current.story}
                </p>
              </div>

              {/* RAAHI’s Smart Mechanism */}
              <div className="bg-signboard-navy text-parchment p-5 rounded-2xl border-2 border-marigold/60 shadow-md">
                <span className="text-[11px] font-black uppercase tracking-wider text-marigold block mb-1.5">
                  RAAHI Intelligent Travel Intervention
                </span>
                <p className="font-handwriting text-base sm:text-lg text-parchment leading-snug">
                  "{current.raahiIntervention}"
                </p>
              </div>

              {/* Next/Prev Step Controls */}
              <div className="flex items-center justify-between pt-4">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className={`px-5 py-2.5 rounded-full text-xs font-heading font-black border-2 border-signboard-navy transition-all ${
                    activeStep === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-zinc-200 cursor-pointer'
                  }`}
                >
                  &larr; Previous Stage
                </button>

                <div className="text-xs font-black text-signboard-navy">
                  Step {activeStep + 1} of {journeySteps.length}
                </div>

                <button
                  disabled={activeStep === journeySteps.length - 1}
                  onClick={() => setActiveStep((prev) => Math.min(journeySteps.length - 1, prev + 1))}
                  className={`bg-marigold hover:bg-amber-300 text-signboard-navy px-6 py-2.5 rounded-full text-xs font-heading font-black shadow-signboard border-2 border-signboard-navy transition-all flex items-center gap-1.5 ${
                    activeStep === journeySteps.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-95'
                  }`}
                >
                  <span>Next Stage</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Right Column: Live Proof & Key Metrics Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border-3 border-signboard-navy shadow-lg flex flex-col justify-between space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-zinc-200">
                <div className="w-12 h-12 rounded-2xl bg-carpet-maroon text-marigold flex items-center justify-center border-2 border-marigold shadow-md shrink-0">
                  <StepIcon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-carpet-maroon">
                    Stage Telemetry
                  </div>
                  <div className="text-base font-heading font-black text-signboard-navy">
                    {current.phase}
                  </div>
                </div>
              </div>

              {/* 3 Metric Pills */}
              <div className="space-y-3">
                {Object.entries(current.metrics).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border-2 border-zinc-200 text-xs sm:text-sm"
                  >
                    <span className="font-bold text-zinc-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span className="font-heading font-black text-carpet-maroon text-sm sm:text-base">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Educational Takeaway */}
              <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 text-xs font-semibold text-signboard-navy leading-relaxed">
                <strong className="text-carpet-maroon font-heading block mb-1">
                  Why this beats traditional tourism:
                </strong>
                Instead of draining city resources at congested bottlenecks, RAAHI converts travel demand into distributed micro-economy fuel.
              </div>

              {/* Quick Action to Demo */}
              <a
                href="#quests-demo"
                className="w-full py-3 rounded-full bg-signboard-navy hover:bg-signboard-dark text-marigold font-heading font-black text-xs text-center shadow-signboard flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
              >
                <span>Try This Quest In The Live Demo</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
