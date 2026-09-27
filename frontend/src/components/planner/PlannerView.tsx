import React, { useState, useEffect, useRef } from "react";
import {
  planTrip,
  fetchTrips,
  createTrip,
  fetchTripDetail,
  renameTrip,
  deleteTrip,
} from "../../services/api";
import { ChatResponse, ChatMessage, TripListItem, DigitalTwinSimulateResponse } from "../../types/travel";

import { TripBar } from "./TripBar";
import { CreateTripModal } from "./CreateTripModal";
import { ConversationView } from "./ConversationView";
import { PromptBox } from "./PromptBox";
import { TripOverview } from "./TripOverview";
import { CostBreakdown } from "./CostBreakdown";
import { HotelCard } from "./HotelCard";
import { FlightCard } from "./FlightCard";
import { ItineraryTimeline } from "./ItineraryTimeline";
import { TripMap } from "./TripMap";
import { PlannerLoadingState } from "./PlannerLoadingState";
import { DigitalTwinPanel } from "./DigitalTwinPanel";
import { exportItineraryToWord } from "../../utils/exportDocx";
import { ErrorBoundary } from "../common/ErrorBoundary";

import {
  Sparkles,
  AlertCircle,
  Database,
  Compass,
  Layers,
  MapPin,
  CheckCircle2
} from "lucide-react";

const STORAGE_TRIPS_KEY = "raahi_saved_trips_v2";
const STORAGE_ACTIVE_TRIP_ID = "raahi_active_trip_id_v2";
const STORAGE_TRIP_DATA_PREFIX = "raahi_trip_data_v2_";

interface StoredTripData {
  session_id: string;
  name: string;
  chat_history: ChatMessage[];
  response: ChatResponse | null;
}

interface PlannerViewProps {
  initialPrompt?: string;
  onExploreQuests?: () => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  initialPrompt,
  onExploreQuests,
}) => {
  const [trips, setTrips] = useState<TripListItem[]>([]);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [activeTripData, setActiveTripData] = useState<StoredTripData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasTriggeredInitial, setHasTriggeredInitial] = useState(false);
  const [userName, setUserName] = useState<string>("Raahi Traveler");
  const [activePrompt, setActivePrompt] = useState<string>("");
  const [simulationResult, setSimulationResult] = useState<DigitalTwinSimulateResponse | null>(null);

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("raahi_auth_user");
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        if (parsed.name) setUserName(parsed.name);
      }
    } catch {}
  }, []);

  // 1. Initial Load from LocalStorage & backend sync
  useEffect(() => {
    try {
      const storedTripsStr = localStorage.getItem(STORAGE_TRIPS_KEY);
      const storedActiveId = localStorage.getItem(STORAGE_ACTIVE_TRIP_ID);

      let initialTrips: TripListItem[] = [];
      if (storedTripsStr) {
        initialTrips = JSON.parse(storedTripsStr);
        setTrips(initialTrips);
      }

      if (initialTrips.length > 0) {
        const targetId =
          storedActiveId && initialTrips.some((t) => t.session_id === storedActiveId)
            ? storedActiveId
            : initialTrips[0].session_id;

        setActiveTripId(targetId);
        loadTripState(targetId);
      } else {
        fetchTrips().then((serverTrips) => {
          if (serverTrips && serverTrips.length > 0) {
            setTrips(serverTrips);
            setActiveTripId(serverTrips[0].session_id);
            loadTripState(serverTrips[0].session_id);
            localStorage.setItem(STORAGE_TRIPS_KEY, JSON.stringify(serverTrips));
          }
        });
      }
    } catch (e) {
      console.error("Error loading stored trips:", e);
    }
  }, []);

  const lastPromptRef = useRef<string | null>(null);

  // Trigger initial prompt if passed
  useEffect(() => {
    if (initialPrompt && initialPrompt !== lastPromptRef.current && !isLoading) {
      lastPromptRef.current = initialPrompt;
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const loadTripState = async (sessionId: string) => {
    try {
      const cached = localStorage.getItem(`${STORAGE_TRIP_DATA_PREFIX}${sessionId}`);
      if (cached) {
        const parsed: StoredTripData = JSON.parse(cached);
        setActiveTripData(parsed);
      } else {
        const serverDetail = await fetchTripDetail(sessionId);
        const data: StoredTripData = {
          session_id: serverDetail.session_id,
          name: serverDetail.name,
          chat_history: serverDetail.chat_history || [],
          response: serverDetail.response || null,
        };
        setActiveTripData(data);
        localStorage.setItem(`${STORAGE_TRIP_DATA_PREFIX}${sessionId}`, JSON.stringify(data));
      }
    } catch (err) {
      console.warn("Could not load trip detail from backend:", err);
    }
  };

  const handleSelectTrip = (sessionId: string) => {
    if (sessionId === activeTripId) return;
    setActiveTripId(sessionId);
    localStorage.setItem(STORAGE_ACTIVE_TRIP_ID, sessionId);
    loadTripState(sessionId);
    setError(null);
  };

  const handleCreateTrip = async (name: string, destination?: string) => {
    let createdSessionId = "";
    try {
      const newTripItem = await createTrip(name, destination);
      createdSessionId = newTripItem.session_id;
      const updatedTrips = [newTripItem, ...trips];
      setTrips(updatedTrips);
      setActiveTripId(newTripItem.session_id);
      localStorage.setItem(STORAGE_TRIPS_KEY, JSON.stringify(updatedTrips));
      localStorage.setItem(STORAGE_ACTIVE_TRIP_ID, newTripItem.session_id);

      const freshData: StoredTripData = {
        session_id: newTripItem.session_id,
        name: newTripItem.name,
        chat_history: [],
        response: null,
      };
      setActiveTripData(freshData);
      localStorage.setItem(
        `${STORAGE_TRIP_DATA_PREFIX}${newTripItem.session_id}`,
        JSON.stringify(freshData)
      );
      setError(null);
    } catch {
      createdSessionId = `trip_${Date.now()}`;
      const fallbackItem: TripListItem = {
        session_id: createdSessionId,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        destination,
        message_count: 0,
      };
      const updatedTrips = [fallbackItem, ...trips];
      setTrips(updatedTrips);
      setActiveTripId(createdSessionId);
      localStorage.setItem(STORAGE_TRIPS_KEY, JSON.stringify(updatedTrips));
      localStorage.setItem(STORAGE_ACTIVE_TRIP_ID, createdSessionId);

      const freshData: StoredTripData = {
        session_id: createdSessionId,
        name,
        chat_history: [],
        response: null,
      };
      setActiveTripData(freshData);
      localStorage.setItem(`${STORAGE_TRIP_DATA_PREFIX}${createdSessionId}`, JSON.stringify(freshData));
    }

    // Automatically trigger itinerary planning for the new trip if destination or name given
    const targetPlace = destination?.trim() || name.trim();
    if (targetPlace) {
      const prompt = `Plan a 3-day itinerary for ${targetPlace} with top attractions, local food, and stays.`;
      handleSendMessage(prompt, createdSessionId, name);
    }
  };

  const handleRenameTrip = async (sessionId: string, newName: string) => {
    const updatedTrips = trips.map((t) =>
      t.session_id === sessionId ? { ...t, name: newName } : t
    );
    setTrips(updatedTrips);
    localStorage.setItem(STORAGE_TRIPS_KEY, JSON.stringify(updatedTrips));

    if (activeTripData && activeTripData.session_id === sessionId) {
      const updatedData = { ...activeTripData, name: newName };
      setActiveTripData(updatedData);
      localStorage.setItem(`${STORAGE_TRIP_DATA_PREFIX}${sessionId}`, JSON.stringify(updatedData));
    }

    try {
      await renameTrip(sessionId, newName);
    } catch (e) {
      console.warn("Backend rename failed, saved locally:", e);
    }
  };

  const handleDeleteTrip = async (sessionId: string) => {
    const updatedTrips = trips.filter((t) => t.session_id !== sessionId);
    setTrips(updatedTrips);
    localStorage.setItem(STORAGE_TRIPS_KEY, JSON.stringify(updatedTrips));
    localStorage.removeItem(`${STORAGE_TRIP_DATA_PREFIX}${sessionId}`);

    if (activeTripId === sessionId) {
      if (updatedTrips.length > 0) {
        const nextActive = updatedTrips[0].session_id;
        setActiveTripId(nextActive);
        localStorage.setItem(STORAGE_ACTIVE_TRIP_ID, nextActive);
        loadTripState(nextActive);
      } else {
        setActiveTripId(null);
        setActiveTripData(null);
        localStorage.removeItem(STORAGE_ACTIVE_TRIP_ID);
      }
    }

    try {
      await deleteTrip(sessionId);
    } catch (e) {
      console.warn("Backend delete failed, removed locally:", e);
    }
  };

  const handleSendMessage = async (
    message: string,
    overrideSessionId?: string,
    overrideTripName?: string
  ) => {
    setIsLoading(true);
    setError(null);
    setActivePrompt(message);

    let currentSessionId = overrideSessionId || activeTripId;
    let currentTripName = overrideTripName || activeTripData?.name || "Active Trip";

    if (!currentSessionId) {
      currentSessionId = `trip_${Date.now()}`;
      currentTripName = "Personalized Trip Plan";
      const newTripItem: TripListItem = {
        session_id: currentSessionId,
        name: currentTripName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        message_count: 0,
      };
      const updatedTrips = [newTripItem, ...trips];
      setTrips(updatedTrips);
      setActiveTripId(currentSessionId);
      localStorage.setItem(STORAGE_TRIPS_KEY, JSON.stringify(updatedTrips));
      localStorage.setItem(STORAGE_ACTIVE_TRIP_ID, currentSessionId);
    } else if (overrideSessionId) {
      setActiveTripId(overrideSessionId);
      localStorage.setItem(STORAGE_ACTIVE_TRIP_ID, overrideSessionId);
    }

    const currentHistory = overrideSessionId ? [] : (activeTripData?.chat_history || []);

    try {
      const responseData = await planTrip(
        message,
        currentSessionId,
        currentTripName,
        currentHistory
      );

      const returnedSessionId = responseData.session_id || currentSessionId;
      const returnedTripName = responseData.trip_name || currentTripName;

      const newHistory: ChatMessage[] =
        responseData.chat_history && responseData.chat_history.length > 0
          ? responseData.chat_history
          : [
              ...currentHistory,
              {
                role: "user",
                content: message,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
              {
                role: "assistant",
                content: responseData.message,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ];

      const newTripData: StoredTripData = {
        session_id: returnedSessionId,
        name: returnedTripName,
        chat_history: newHistory,
        response: responseData,
      };

      setActiveTripData(newTripData);
      localStorage.setItem(
        `${STORAGE_TRIP_DATA_PREFIX}${returnedSessionId}`,
        JSON.stringify(newTripData)
      );

      setTrips((prevTrips) => {
        const exists = prevTrips.some((t) => t.session_id === returnedSessionId);
        let next: TripListItem[];
        if (exists) {
          next = prevTrips.map((t) =>
            t.session_id === returnedSessionId
              ? {
                  ...t,
                  name: returnedTripName,
                  destination: responseData.trip.destination,
                  duration_days: responseData.trip.duration_days,
                  budget: responseData.trip.budget,
                  message_count: newHistory.length,
                  updated_at: new Date().toISOString(),
                }
              : t
          );
        } else {
          next = [
            {
              session_id: returnedSessionId,
              name: returnedTripName,
              destination: responseData.trip.destination,
              duration_days: responseData.trip.duration_days,
              budget: responseData.trip.budget,
              message_count: newHistory.length,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            ...prevTrips,
          ];
        }
        localStorage.setItem(STORAGE_TRIPS_KEY, JSON.stringify(next));
        return next;
      });
    } catch (err: any) {
      setError(
        err.message ||
          "Unable to connect to the backend server. Please ensure FastAPI is running at http://127.0.0.1:8000."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const currentResponse = activeTripData?.response;
  const currentChatHistory = activeTripData?.chat_history || [];
  const currentTripName = activeTripData?.name || "Active Trip";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-signboard-navyDeep via-signboard-navy to-carpet-maroon p-6 sm:p-8 rounded-3xl border-2 sm:border-3 border-marigold/40 shadow-bollywood-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5 text-parchment relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-marigold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-heading font-black uppercase tracking-widest text-marigold mb-1.5">
            <Sparkles className="w-4 h-4 text-terracotta" />
            <span>AI Dynamic Story &amp; Route Architect</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-parchment tracking-tight">
            Royal Itinerary &amp; Travel Planner
          </h1>
          <p className="text-xs sm:text-sm text-parchment/80 mt-1.5 max-w-2xl leading-relaxed font-body font-medium">
            Real OSRM road calculations, verified OpenStreetMap landmark geocoding, flight booking options, haveli choices, and deterministic budget optimization.
          </p>
        </div>
      </div>

      {/* 2. Trip Management Bar */}
      <TripBar
        trips={trips}
        activeTripId={activeTripId}
        onSelectTrip={handleSelectTrip}
        onCreateTripClick={() => {
          setActiveTripId(null);
          setActiveTripData(null);
        }}
        onRenameTrip={handleRenameTrip}
        onDeleteTrip={handleDeleteTrip}
      />

      {/* 3. Hero Prompt Box if no trip or empty history */}
      {(!activeTripData || currentChatHistory.length === 0) && (
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-9 border-2 sm:border-3 border-signboard-navy text-signboard-navy shadow-bollywood-lg space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="stamp-badge text-carpet-maroon border-carpet-maroon bg-carpet-maroon/10">
              Interactive Trip Blueprint · Step 1
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-signboard-navy tracking-tight mt-1">
              Welcome, {userName.split(' ')[0]}! Where would you like to travel?
            </h2>
            <p className="text-xs sm:text-sm text-signboard-navy/70 leading-relaxed font-body font-medium">
              Describe your destination, duration, budget, travel party, and food preferences. Our AI planner will calculate real road transit, match budget stays, and craft an hour-by-hour itinerary.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <PromptBox
              onSubmit={handleSendMessage}
              isLoading={isLoading}
              placeholder="e.g., 4 days in Mumbai under ₹5000, vegetarian food, solo traveller..."
            />
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
              <span className="text-signboard-navy/70 font-heading font-black uppercase tracking-wider text-[11px]">
                Quick suggestions:
              </span>
              {[
                "3 days in Jaipur under ₹12,000",
                "2 days in Varanasi heritage walk",
                "4 days in Goa with beach & culture",
                "3 days in Kochi & Munnar tea trails",
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(suggestion)}
                  disabled={isLoading}
                  className="px-3 py-1 rounded-full bg-parchment hover:bg-marigold/40 active:scale-95 text-signboard-navy font-heading font-bold border border-marigold transition-all cursor-pointer text-[11px] shadow-xs"
                >
                  ✨ {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Error Alert */}
      {error && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/20 border-2 border-rose-500/50 text-rose-900 text-sm flex items-start gap-3 shadow-sm font-body">
          <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-heading font-black text-rose-950">Error Generating Itinerary: </span>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* 5. Multi-Agent Step-by-Step Loading Pipeline */}
      {isLoading && (
        <PlannerLoadingState
          prompt={activePrompt}
        />
      )}

      {/* 6. Active Trip Layout */}
      {!isLoading && currentResponse && (
        <ErrorBoundary fallbackTitle="Unable to display trip details">
          <div className="space-y-6">
            {/* Top Row: Trip Overview & Cost Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-2 flex">
                {currentResponse.trip && (
                  <TripOverview
                    trip={currentResponse.trip}
                    tripName={currentTripName}
                    relaxations={
                      currentResponse.relaxation_notes
                        ? [currentResponse.relaxation_notes]
                        : (currentResponse as any).relaxation_applied
                    }
                    onDownloadWord={() => exportItineraryToWord(currentResponse)}
                  />
                )}
              </div>
              <div className="flex">
                <CostBreakdown
                  cost={currentResponse.estimated_cost || (currentResponse as any).cost_breakdown}
                  budget={currentResponse.trip?.budget}
                />
              </div>
            </div>

            {/* Flights & Hotels Row */}
            {(() => {
              const flightsList =
                currentResponse.flights && currentResponse.flights.length > 0
                  ? currentResponse.flights
                  : [(currentResponse as any).flight_booking].filter(Boolean);
              const hotelsList =
                currentResponse.hotels && currentResponse.hotels.length > 0
                  ? currentResponse.hotels
                  : [
                      (currentResponse as any).hotel_booking,
                      ...((currentResponse as any).alternate_hotels || []),
                    ].filter(Boolean);

              const hasFlights = flightsList.length > 0;
              const hasHotels = hotelsList.length > 0;

              if (!hasFlights && !hasHotels) return null;

              if (hasFlights && hasHotels) {
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <FlightCard flights={flightsList} />
                    <HotelCard hotels={hotelsList} />
                  </div>
                );
              }

              return (
                <div className="w-full">
                  {hasFlights && <FlightCard flights={flightsList} />}
                  {hasHotels && <HotelCard hotels={hotelsList} />}
                </div>
              );
            })()}

            {/* RAAHI Digital Twin & What-If Weather Simulation Lab */}
            {currentResponse.session_id && currentResponse.trip && (
              <DigitalTwinPanel
                tripId={currentResponse.session_id}
                destination={currentResponse.trip.destination}
                itinerary={currentResponse.itinerary}
                liveWeather={currentResponse.weather}
                digitalTwin={currentResponse.digital_twin}
                onSimulationApplied={(res) => setSimulationResult(res)}
              />
            )}


            {/* Interactive Route Map */}
            {(() => {
              const activeItinerary = simulationResult
                ? simulationResult.simulated_itinerary
                : currentResponse.itinerary;

              return activeItinerary && activeItinerary.length > 0 ? (
                <TripMap
                  itinerary={activeItinerary}
                  hotels={
                    currentResponse.hotels && currentResponse.hotels.length > 0
                      ? currentResponse.hotels
                      : (currentResponse as any).hotel_booking
                      ? [(currentResponse as any).hotel_booking]
                      : []
                  }
                  destination={currentResponse.trip?.destination}
                  isSimulated={Boolean(simulationResult)}
                />
              ) : null;
            })()}

            {/* Multi-Day Timeline & AI Conversation Row */}
            {(() => {
              const activeItinerary = simulationResult
                ? simulationResult.simulated_itinerary
                : currentResponse.itinerary;

              return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {activeItinerary && activeItinerary.length > 0 && (
                      <ItineraryTimeline
                        itinerary={activeItinerary}
                      />
                    )}
                  </div>
                  <div>
                    <div className="sticky top-24 space-y-4">
                      <ConversationView
                        chatHistory={currentChatHistory}
                        tripName={currentTripName}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>
        </ErrorBoundary>
      )}

      {/* Create Trip Modal */}
      {isCreateModalOpen && (
        <CreateTripModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateTrip}
          onCreateTrip={handleCreateTrip}
        />
      )}
    </div>
  );
};
