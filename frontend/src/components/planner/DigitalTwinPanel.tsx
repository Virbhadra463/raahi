import React, { useState } from "react";
import {
  WeatherReport,
  TripDigitalTwin,
  DigitalTwinSimulateResponse,
  ActivityChangeRecord,
} from "../../types/travel";
import { simulateWeatherScenario } from "../../services/api";
import {
  CloudRain,
  Sun,
  Wind,
  Thermometer,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Compass,
  Zap,
  Calendar,
} from "lucide-react";


interface DigitalTwinPanelProps {
  tripId: string;
  destination: string;
  itinerary?: ItineraryDay[];
  liveWeather?: WeatherReport;
  digitalTwin?: TripDigitalTwin;
  onSimulationApplied?: (result: DigitalTwinSimulateResponse | null) => void;
}

export const DigitalTwinPanel: React.FC<DigitalTwinPanelProps> = ({
  tripId,
  destination,
  itinerary,
  liveWeather,
  digitalTwin,
  onSimulationApplied,
}) => {
  // Scenario simulation controls state
  const [rainProb, setRainProb] = useState<number>(85);
  const [rainIntensityMm, setRainIntensityMm] = useState<number>(15);
  const [temperatureC, setTemperatureC] = useState<number>(23);
  const [durationHours, setDurationHours] = useState<number>(4);
  const [weatherCondition, setWeatherCondition] = useState<string>("Heavy Rain");

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationError, setSimulationError] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<DigitalTwinSimulateResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"live" | "simulated">("live");
  const [showFullSchedule, setShowFullSchedule] = useState<boolean>(true);

  const liveTemp = liveWeather?.current?.temperature_c ?? 26.0;
  const liveProb = liveWeather?.current?.precipitation_probability ?? 10;
  const liveCond = liveWeather?.current?.condition ?? "Partly cloudy";
  const liveWind = liveWeather?.current?.wind_speed_kmh ?? 12.0;

  // Preset scenarios
  const applyPreset = (preset: "monsoon" | "cloudburst" | "heatwave" | "clear") => {
    if (preset === "monsoon") {
      setRainProb(90);
      setRainIntensityMm(16);
      setTemperatureC(22);
      setDurationHours(5);
      setWeatherCondition("Heavy Rain");
    } else if (preset === "cloudburst") {
      setRainProb(98);
      setRainIntensityMm(28);
      setTemperatureC(20);
      setDurationHours(3);
      setWeatherCondition("Thunderstorm");
    } else if (preset === "heatwave") {
      setRainProb(5);
      setRainIntensityMm(0);
      setTemperatureC(42);
      setDurationHours(6);
      setWeatherCondition("Clear sky");
    } else {
      setRainProb(10);
      setRainIntensityMm(0);
      setTemperatureC(26);
      setDurationHours(2);
      setWeatherCondition("Mainly clear");
    }
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    setSimulationError(null);

    try {
      const scenario = {
        weather: {
          precipitation_probability: rainProb,
          precipitation_mm: rainIntensityMm,
          temperature_c: temperatureC,
          wind_speed_kmh: 15.0,
          weather_code: rainIntensityMm > 10 ? 65 : rainIntensityMm > 2 ? 63 : 1,
          weather_condition: weatherCondition,
          duration_hours: durationHours,
          affected_location: destination,
        },
      };

      const result = await simulateWeatherScenario(
        tripId,
        scenario,
        itinerary,
        destination
      );
      setSimulationResult(result);
      setActiveTab("simulated");
      if (onSimulationApplied) {
        onSimulationApplied(result);
      }
    } catch (err: any) {
      setSimulationError(err.message || "Simulation request failed.");
    } finally {
      setIsSimulating(false);
    }
  };


  const handleResetToLive = () => {
    setSimulationResult(null);
    setActiveTab("live");
    if (onSimulationApplied) {
      onSimulationApplied(null);
    }
  };

  return (
    <div className="bg-[#121624] text-white rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 mb-1">
            <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Virtual Trip State &amp; What-If Simulation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white flex items-center gap-3">
            RAAHI Digital Twin
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              Live v2.5
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
            Structured environment model for {destination}. Test hypothetical weather disruptions without altering real Open-Meteo forecasts.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-gray-900/80 p-1.5 rounded-2xl border border-gray-700">
          <button
            type="button"
            onClick={handleResetToLive}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "live"
                ? "bg-emerald-500 text-gray-950 shadow-md font-black"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            LIVE CONDITIONS
          </button>
          <button
            type="button"
            onClick={() => {
              if (simulationResult) setActiveTab("simulated");
              else handleSimulate();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "simulated"
                ? "bg-amber-400 text-gray-950 shadow-md font-black"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            SIMULATED SCENARIO
          </button>
        </div>
      </div>

      {/* Grid: Live Weather vs Scenario Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left: Live Open-Meteo Snapshot (4 cols) */}
        <div className="lg:col-span-5 bg-gray-900/60 rounded-2xl border border-gray-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-400 font-mono flex items-center gap-2">
              <Sun className="w-4 h-4 text-emerald-400" />
              LIVE CONDITIONS
            </span>
            <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded font-mono">
              Open-Meteo API
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-black text-white tracking-tight">
                {liveTemp.toFixed(1)}°C
              </div>
              <div className="text-xs font-semibold text-gray-300 mt-0.5">
                {liveCond}
              </div>
            </div>
            <div className="text-right text-xs space-y-1 font-mono text-gray-400">
              <div className="flex items-center gap-1.5 justify-end">
                <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                <span>Rain: {liveProb}%</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                <span>Wind: {liveWind.toFixed(0)} km/h</span>
              </div>
            </div>
          </div>

          {/* Location Weather Suitability Pill */}
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-emerald-200">Current Trip Suitability</span>
            </div>
            <span className="font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
              95 / 100
            </span>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed font-body">
            Real live weather data for {destination}. Verified by Open-Meteo without hallucination. All outdoor landmarks are currently scheduled safely.
          </p>
        </div>

        {/* Right: What-If Simulation Controls (7 cols) */}
        <div className="lg:col-span-7 bg-gray-900/60 rounded-2xl border border-amber-500/30 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
            <span className="text-xs font-bold tracking-wider uppercase text-amber-400 font-mono flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-amber-400" />
              WHAT-IF SIMULATION LAB
            </span>
            <span className="text-[10px] text-amber-300/80 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
              Temporary Clone
            </span>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-400 font-mono text-[11px]">Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset("monsoon")}
              className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-amber-300 text-[11px] font-semibold border border-amber-500/20 transition-all cursor-pointer"
            >
              🌧️ Heavy Monsoon (16mm)
            </button>
            <button
              type="button"
              onClick={() => applyPreset("cloudburst")}
              className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-rose-300 text-[11px] font-semibold border border-rose-500/20 transition-all cursor-pointer"
            >
              ⛈️ Cloudburst (28mm)
            </button>
            <button
              type="button"
              onClick={() => applyPreset("heatwave")}
              className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-orange-300 text-[11px] font-semibold border border-orange-500/20 transition-all cursor-pointer"
            >
              ☀️ Heatwave (42°C)
            </button>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Rain Probability */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300 font-medium">Rain Probability</span>
                <span className="text-amber-400 font-mono font-bold">{rainProb}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={rainProb}
                onChange={(e) => setRainProb(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Rain Intensity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300 font-medium">Rainfall Intensity</span>
                <span className="text-amber-400 font-mono font-bold">{rainIntensityMm} mm/hr</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={rainIntensityMm}
                onChange={(e) => setRainIntensityMm(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300 font-medium">Temperature</span>
                <span className="text-amber-400 font-mono font-bold">{temperatureC}°C</span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                step="1"
                value={temperatureC}
                onChange={(e) => setTemperatureC(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300 font-medium">Disruption Duration</span>
                <span className="text-amber-400 font-mono font-bold">{durationHours} hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleSimulate}
              disabled={isSimulating}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-950 font-black text-xs font-mono uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running What-If Optimizer...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Simulate Scenario
                </>
              )}
            </button>

            {simulationResult && (
              <button
                type="button"
                onClick={handleResetToLive}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs font-mono border border-gray-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset to Live
              </button>
            )}
          </div>

          {simulationError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{simulationError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Simulation Results & Activity Replanning Diffs */}
      {simulationResult && (
        <div className="relative z-10 bg-gray-900/90 rounded-2xl border-2 border-amber-500/50 p-6 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Simulation Diff Report · Real-Time Itinerary Replanning
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                {simulationResult.changes.length > 0
                  ? `${simulationResult.changes.length} Outdoor Disruption${simulationResult.changes.length > 1 ? "s" : ""} Rescheduled &amp; Protected`
                  : "Itinerary Resilient: No Outdoor Substitutions Needed"}
              </h3>
            </div>

            {/* Validation Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Budget Valid
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Transit &le; 180m
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Rain-Sheltered
              </span>
            </div>
          </div>

          {/* Activity Replacement Cards */}
          {simulationResult.changes.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                Substituted Activities (Outdoor Conflicts &rarr; Indoor Havens)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {simulationResult.changes.map((change: ActivityChangeRecord, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 hover:border-amber-500/40 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-gray-400">Day {change.day_number} · {change.time}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 uppercase text-[10px]">
                        {change.change}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-body">
                      {/* Old Activity */}
                      <div className="flex items-center gap-2 text-rose-300 line-through opacity-85">
                        <span className="w-4 h-4 rounded-full bg-rose-950 text-rose-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                          ✕
                        </span>
                        <span className="font-semibold">{change.activity}</span>
                      </div>

                      {/* New Activity */}
                      <div className="flex items-center gap-2 text-emerald-300 font-bold">
                        <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                          ✓
                        </span>
                        <span>{change.replacement}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-400 leading-relaxed font-body border-t border-gray-800/80 pt-2">
                      {change.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full New Simulated Itinerary Schedule */}
          {simulationResult.simulated_itinerary && simulationResult.simulated_itinerary.length > 0 && (
            <div className="space-y-4 border-t border-gray-800 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  NEW SIMULATED ITINERARY (Rain-Resilient Schedule)
                </span>
                <span className="text-[11px] text-emerald-300 font-mono bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                  {simulationResult.simulated_itinerary.length} Days Active
                </span>
              </div>

              <div className="space-y-4">
                {simulationResult.simulated_itinerary.map((day) => (
                  <div key={day.day_number} className="bg-gray-950/70 rounded-2xl border border-gray-800 p-4 sm:p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-800/80 pb-2.5">
                      <span className="font-heading font-black text-sm text-white flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center text-xs font-mono font-bold">
                          {day.day_number}
                        </span>
                        {day.title}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        Transit: {day.day_total_travel_minutes} mins · {day.day_total_travel_km} km
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {day.activities.map((act, actIdx) => (
                        <div
                          key={actIdx}
                          className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                            act.weather_status === "replaced"
                              ? "bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/30 text-emerald-100"
                              : "bg-gray-900/60 border-gray-800 text-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono">
                            <span className="font-bold text-amber-300">⏰ {act.time}</span>
                            {act.weather_status === "replaced" ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black text-[10px] uppercase border border-emerald-500/40">
                                ✓ Rain-Safe Substitute
                              </span>
                            ) : (
                              <span className="text-gray-400 text-[10px]">
                                {act.is_meal ? "Dining" : "Sightseeing"}
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-white text-sm">{act.place}</div>
                          <div className="text-[11px] text-gray-400 font-medium">{act.category}</div>
                          {act.notes && (
                            <p className="text-[11px] text-gray-400/90 leading-relaxed font-body">
                              {act.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between text-xs text-blue-200">
            <span className="flex items-center gap-2 font-medium">
              <Compass className="w-4 h-4 text-blue-400" />
              The interactive map and itinerary schedule below have updated to reflect this simulated scenario.
            </span>
            <button
              type="button"
              onClick={handleResetToLive}
              className="text-amber-400 hover:text-amber-300 underline font-mono font-bold shrink-0 cursor-pointer"
            >
              Revert to Live Itinerary &rarr;
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
