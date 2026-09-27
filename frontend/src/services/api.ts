import { ChatResponse, ChatMessage, TripListItem } from "../types/travel";


const API_BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
  "http://127.0.0.1:8000";

const LOCAL_STORAGE_TRIPS_KEY = "raahi_saved_trips_v2";
const LOCAL_STORAGE_DATA_PREFIX = "raahi_trip_data_v2_";

// Helper: load local trips
function getLocalTrips(): TripListItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Helper: save local trips
function saveLocalTrips(trips: TripListItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(trips));
  } catch (e) {
    console.warn("Could not save trips to localStorage:", e);
  }
}

export async function planTrip(
  message: string,
  sessionId?: string,
  tripName?: string,
  chatHistory?: ChatMessage[]
): Promise<ChatResponse> {
  const payload: any = { message };
  if (sessionId) payload.session_id = sessionId;
  if (tripName) payload.trip_name = tripName;
  if (chatHistory && chatHistory.length > 0) payload.chat_history = chatHistory;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.detail || `Backend server responded with status ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (e: any) {
    clearTimeout(timeoutId);
    if (e.name === "AbortError") {
      throw new Error("The backend planning request timed out after 2 minutes. Please check the backend server logs.");
    }
    throw new Error(e.message || "Failed to communicate with FastAPI backend server at http://127.0.0.1:8000.");
  }
}

export async function fetchTrips(): Promise<TripListItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${API_BASE_URL}/api/trips`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const serverTrips = await res.json();
      if (serverTrips && serverTrips.length > 0) {
        saveLocalTrips(serverTrips);
        return serverTrips;
      }
    }
  } catch {
    // Backend offline, use local storage
  }
  return getLocalTrips();
}

export async function createTrip(name: string, destination?: string): Promise<TripListItem> {
  const newTripId = `trip_${Date.now()}`;
  const localTripItem: TripListItem = {
    session_id: newTripId,
    name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    destination,
    message_count: 0,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/api/trips`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, destination }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const serverItem = await res.json();
      const current = getLocalTrips().filter((t) => t.session_id !== serverItem.session_id);
      saveLocalTrips([serverItem, ...current]);
      return serverItem;
    }
  } catch {
    // Backend offline, proceed with local trip item
  }

  const current = getLocalTrips().filter((t) => t.session_id !== newTripId);
  saveLocalTrips([localTripItem, ...current]);
  return localTripItem;
}

export async function fetchTripDetail(sessionId: string): Promise<{
  session_id: string;
  name: string;
  chat_history: ChatMessage[];
  response: ChatResponse | null;
}> {
  // Check local storage first
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_DATA_PREFIX}${sessionId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/api/trips/${sessionId}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      return res.json();
    }
  } catch {}

  const trips = getLocalTrips();
  const found = trips.find((t) => t.session_id === sessionId);
  return {
    session_id: sessionId,
    name: found?.name || "Trip Itinerary",
    chat_history: [],
    response: null,
  };
}

export async function renameTrip(sessionId: string, name: string): Promise<void> {
  const current = getLocalTrips().map((t) =>
    t.session_id === sessionId ? { ...t, name } : t
  );
  saveLocalTrips(current);

  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_DATA_PREFIX}${sessionId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      parsed.name = name;
      localStorage.setItem(`${LOCAL_STORAGE_DATA_PREFIX}${sessionId}`, JSON.stringify(parsed));
    }
  } catch {}

  try {
    await fetch(`${API_BASE_URL}/api/trips/${sessionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
  } catch {}
}

export async function deleteTrip(sessionId: string): Promise<void> {
  const current = getLocalTrips().filter((t) => t.session_id !== sessionId);
  saveLocalTrips(current);
  try {
    localStorage.removeItem(`${LOCAL_STORAGE_DATA_PREFIX}${sessionId}`);
  } catch {}

  try {
    await fetch(`${API_BASE_URL}/api/trips/${sessionId}`, {
      method: "DELETE",
    });
  } catch {}
}

export async function fetchDigitalTwin(tripId: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/digital-twin/${tripId}`);
  if (!res.ok) {
    throw new Error(`Failed to load Digital Twin: ${res.statusText}`);
  }
  return res.json();
}

export async function simulateWeatherScenario(
  tripId: string,
  scenario: any,
  itinerary?: any[],
  destination?: string,
  budget?: number
): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/digital-twin/simulate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trip_id: tripId,
      scenario,
      itinerary,
      destination,
      budget,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Simulation failed with status ${res.status}`);
  }
  return res.json();
}


