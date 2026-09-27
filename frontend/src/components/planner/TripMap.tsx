"use client";

import React, { useEffect, useRef, useState } from "react";
import { ItineraryDay, HotelItem } from "../../types/travel";
import {
  MapPin,
  Navigation,
  Layers,
  ExternalLink,
  Utensils,
  Hotel,
  Calendar,
  Compass,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

interface TripMapProps {
  itinerary: ItineraryDay[];
  hotels?: HotelItem[];
  destination?: string;
  isSimulated?: boolean;
}

interface MapLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  dayNumber?: number;
  time?: string;
  duration?: number;
  notes?: string;
  isMeal?: boolean;
  isHotel?: boolean;
  color: string;
  stepNumber?: number;
  weatherSuitability?: number;
  weatherStatus?: "recommended" | "affected" | "replaced";
  weatherCondition?: string;
  exposure?: "indoor" | "outdoor" | "mixed";
}

const DAY_COLORS = [
  "#7A1026", // Day 1 - Carpet Maroon
  "#C98A2E", // Day 2 - Amber Gold
  "#1C1440", // Day 3 - Signboard Navy
  "#E85B70", // Day 4 - Rose Pink
  "#059669", // Day 5 - Emerald
  "#0891b2", // Day 6 - Cyan
  "#F59E0B", // Day 7 - Marigold Bright
];

export const TripMap: React.FC<TripMapProps> = ({
  itinerary,
  hotels,
  destination,
  isSimulated = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const polylinesLayerRef = useRef<any>(null);
  const markersMapRef = useRef<{ [key: string]: any }>({});

  const [selectedDay, setSelectedDay] = useState<number | "all">("all");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Extract all valid mapped locations
  const locations: MapLocation[] = [];

  // 1. Hotel marker
  if (hotels && hotels.length > 0) {
    const primaryHotel = hotels[0];
    if (primaryHotel.latitude && primaryHotel.longitude) {
      locations.push({
        id: "hotel_primary",
        name: primaryHotel.name,
        latitude: primaryHotel.latitude,
        longitude: primaryHotel.longitude,
        category: "Selected Accommodation",
        notes: primaryHotel.rationale || primaryHotel.location,
        isHotel: true,
        color: "#7A1026", // Deep maroon for hotel
        weatherSuitability: 100,
        weatherStatus: "recommended",
        weatherCondition: "Sheltered stay",
        exposure: "indoor"
      });
    }
  }

  // 2. Activities from each itinerary day
  itinerary.forEach((day) => {
    let step = 1;
    day.activities.forEach((act, actIdx) => {
      if (act.latitude && act.longitude) {
        const isReturn = act.place.toLowerCase().includes("return to") || act.category.includes("Rest & Dinner");
        const color = DAY_COLORS[(day.day_number - 1) % DAY_COLORS.length];

        locations.push({
          id: `day_${day.day_number}_act_${actIdx}`,
          name: act.place,
          latitude: act.latitude,
          longitude: act.longitude,
          category: act.category,
          dayNumber: day.day_number,
          time: act.time,
          duration: act.duration_minutes,
          notes: act.notes,
          isMeal: act.is_meal || act.category.toLowerCase().includes("restaurant"),
          color,
          stepNumber: isReturn ? undefined : step++,
          weatherSuitability: act.weather_suitability ?? 95,
          weatherStatus: act.weather_status ?? "recommended",
          weatherCondition: act.weather_condition,
          exposure: act.exposure,
        });
      }
    });
  });

  // Filter locations according to selected day
  const filteredLocations = locations.filter((loc) => {
    if (selectedDay === "all") return true;
    if (loc.isHotel) return true;
    return loc.dayNumber === selectedDay;
  });

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) return;

      const defaultCenter: [number, number] =
        locations.length > 0
          ? [locations[0].latitude, locations[0].longitude]
          : [18.5204, 73.8567]; // Maharashtra center default

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        subdomains: ["a", "b", "c"],
      }).addTo(map);

      L.control
        .attribution({ position: "bottomright" })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>')
        .addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      polylinesLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      setIsMapReady(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & Polylines when filtered locations or selected day change
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      const markersLayer = markersLayerRef.current;
      const polylinesLayer = polylinesLayerRef.current;

      markersLayer.clearLayers();
      polylinesLayer.clearLayers();
      markersMapRef.current = {};

      if (filteredLocations.length === 0) return;

      const bounds = L.latLngBounds([]);

      // 1. Draw route connecting lines for each day
      const dayGroups: { [key: number]: [number, number][] } = {};
      filteredLocations.forEach((loc) => {
        if (loc.dayNumber) {
          if (!dayGroups[loc.dayNumber]) dayGroups[loc.dayNumber] = [];
          dayGroups[loc.dayNumber].push([loc.latitude, loc.longitude]);
        }
      });

      Object.entries(dayGroups).forEach(([dayNum, points]) => {
        if (points.length >= 2) {
          const color = DAY_COLORS[(parseInt(dayNum) - 1) % DAY_COLORS.length];
          L.polyline(points, {
            color,
            weight: 4,
            opacity: 0.85,
            dashArray: isSimulated ? "4, 6" : "7, 9",
          }).addTo(polylinesLayer);
        }
      });

      // 2. Add Markers with Custom Indian Stamp Pin HTML
      filteredLocations.forEach((loc) => {
        bounds.extend([loc.latitude, loc.longitude]);

        // Weather status badge indicator ring
        let borderStyle = "border: 2px solid white;";
        let statusBadge = "";
        if (loc.weatherStatus === "replaced") {
          borderStyle = "border: 2.5px solid #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);";
          statusBadge = `<span style="position: absolute; top: -6px; right: -6px; background: #10b981; color: #000; font-size: 8px; font-weight: 900; border-radius: 9999px; padding: 1px 3px;">✓</span>`;
        } else if (loc.weatherStatus === "affected") {
          borderStyle = "border: 2.5px solid #f43f5e; box-shadow: 0 0 10px rgba(244, 63, 94, 0.6);";
          statusBadge = `<span style="position: absolute; top: -6px; right: -6px; background: #f43f5e; color: #fff; font-size: 8px; font-weight: 900; border-radius: 9999px; padding: 1px 3px;">!</span>`;
        }

        const iconHtml = loc.isHotel
          ? `<div style="background-color: ${loc.color}; ${borderStyle} position: relative;" class="w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-white text-xs font-bold">
              <span style="font-size: 13px;">🏨</span>
              ${statusBadge}
             </div>`
          : loc.isMeal
          ? `<div style="background-color: ${loc.color}; border: 2.5px solid #FFD38A; position: relative;" class="w-7 h-7 rounded-full shadow-md flex items-center justify-center text-white text-xs font-bold">
              <span style="font-size: 11px;">🍽️</span>
              ${statusBadge}
             </div>`
          : `<div style="background-color: ${loc.color}; ${borderStyle} position: relative;" class="w-7 h-7 rounded-full shadow-md flex items-center justify-center text-white text-xs font-black font-mono">
              ${loc.stepNumber || "•"}
              ${statusBadge}
             </div>`;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-leaflet-marker",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        });

        const marker = L.marker([loc.latitude, loc.longitude], {
          icon: customIcon,
          title: loc.name,
        }).addTo(markersLayer);

        const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${loc.name} ${destination || ""}`
        )}`;

        const suitabilityScore = loc.weatherSuitability ?? 95;
        const suitabilityColor = suitabilityScore >= 70 ? "#059669" : suitabilityScore >= 50 ? "#d97706" : "#e11d48";

        const popupContent = `
          <div style="font-family: 'Poppins', sans-serif; min-width: 220px; padding: 4px; color: #1C1440;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 4px;">
              <span style="background-color: ${loc.color}; color: #FDF3EA; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; text-transform: uppercase;">
                ${loc.isHotel ? "ACCOMMODATION" : `DAY ${loc.dayNumber}${loc.stepNumber ? ` · STOP ${loc.stepNumber}` : ""}`}
              </span>
              <span style="background-color: ${suitabilityColor}20; color: ${suitabilityColor}; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; border: 1px solid ${suitabilityColor}40;">
                Suitability: ${suitabilityScore}/100
              </span>
            </div>

            <h4 style="margin: 3px 0 1px 0; font-size: 14px; font-weight: 800; color: #1C1440; font-family: 'Baloo 2', sans-serif;">${loc.name}</h4>
            <div style="font-size: 11px; color: #7A1026; font-weight: 600;">${loc.category} ${loc.exposure ? `· ${loc.exposure.toUpperCase()}` : ""}</div>

            ${loc.weatherCondition ? `
              <div style="background: #F4EAE0; border-radius: 6px; padding: 4px 6px; margin: 5px 0; font-size: 10px; color: #450915; font-weight: 600;">
                🌦️ ${loc.weatherCondition}
              </div>
            ` : ""}

            ${loc.weatherStatus === "replaced" ? `
              <div style="background: #D1FAE5; color: #065F46; border-radius: 6px; padding: 3px 6px; margin: 4px 0; font-size: 10px; font-weight: 700;">
                ✓ Rain-safe alternative added in simulation
              </div>
            ` : ""}

            ${loc.notes ? `<p style="margin: 5px 0 8px 0; font-size: 11px; color: #450915; line-height: 1.4;">${loc.notes}</p>` : ""}
            <div style="border-top: 1.5px solid #E8DAC9; margin-top: 6px; padding-top: 6px; display: flex; justify-content: flex-end;">
              <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" style="color: #7A1026; font-size: 11px; font-weight: 800; text-decoration: none; display: flex; align-items: center; gap: 4px;">
                Open in Google Maps ↗
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersMapRef.current[loc.id] = marker;

        marker.on("click", () => {
          setSelectedLocationId(loc.id);
        });
      });

      if (bounds.isValid()) {

        map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
      }
    });
  }, [filteredLocations.length, selectedDay, isMapReady]);

  const handleSelectLocation = (loc: MapLocation) => {
    setSelectedLocationId(loc.id);
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([loc.latitude, loc.longitude], 15, {
      duration: 1.2,
    });
    const marker = markersMapRef.current[loc.id];
    if (marker) {
      marker.openPopup();
    }
  };

  const handleRecenter = () => {
    if (!mapInstanceRef.current || filteredLocations.length === 0) return;
    import("leaflet").then((L) => {
      const bounds = L.latLngBounds(
        filteredLocations.map((l) => [l.latitude, l.longitude])
      );
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [45, 45] });
      }
    });
  };

  if (locations.length === 0) return null;

  return (
    <div className="w-full bg-[#FFFDF9] border-2 sm:border-3 border-signboard-navy rounded-3xl shadow-bollywood-lg overflow-hidden flex flex-col transition-all text-signboard-navy">
      {/* Header & Controls */}
      <div className="p-5 sm:p-6 border-b-2 border-signboard-navy/15 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-parchment/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-carpet-maroon text-marigold shadow-xs">
              <Compass className="w-5 h-5" />
            </span>
            <h3 className="text-base sm:text-lg font-heading font-black text-signboard-navy">
              Interactive Route &amp; Stop Map
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-marigold/40 text-carpet-maroon font-heading font-bold border border-marigold">
              {filteredLocations.length} locations
            </span>
          </div>
          <p className="text-xs text-signboard-navy/70 mt-1 font-medium">
            Explore daily heritage waypoints, authentic food breaks, and hotel base.
          </p>
        </div>

        {/* Day Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-heading font-black">
          <button
            type="button"
            onClick={() => setSelectedDay("all")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedDay === "all"
                ? "bg-signboard-navy text-parchment border-2 border-signboard-navy shadow-bollywood"
                : "bg-white text-signboard-navy border-2 border-signboard-navy/20 hover:bg-parchment"
            }`}
          >
            All Days
          </button>
          {itinerary.map((day) => (
            <button
              key={day.day_number}
              type="button"
              onClick={() => setSelectedDay(day.day_number)}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedDay === day.day_number
                  ? "bg-carpet-maroon text-white border-2 border-carpet-maroon shadow-bollywood"
                  : "bg-white text-signboard-navy border-2 border-signboard-navy/20 hover:bg-parchment"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    DAY_COLORS[(day.day_number - 1) % DAY_COLORS.length],
                }}
              />
              <span>Day {day.day_number}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={handleRecenter}
            className="p-2 rounded-xl bg-white text-signboard-navy border-2 border-signboard-navy/20 hover:bg-parchment transition-all cursor-pointer ml-1 shadow-xs"
            title="Recenter Map View"
          >
            <Navigation className="w-4 h-4 text-carpet-maroon" />
          </button>
        </div>
      </div>

      {/* Main Map Body with Side Location Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[460px] h-[520px]">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-3 relative h-full w-full">
          <div ref={mapContainerRef} className="h-full w-full z-0" />
        </div>

        {/* Scrollable Locations Side List */}
        <div className="lg:col-span-1 border-t-2 lg:border-t-0 lg:border-l-2 border-signboard-navy/15 bg-parchment/40 overflow-y-auto p-3 space-y-2">
          <div className="text-[11px] font-heading font-black text-carpet-maroon uppercase tracking-wider px-1 pb-1">
            {selectedDay === "all" ? "All Route Stops" : `Day ${selectedDay} Waypoints`}
          </div>

          <div className="space-y-2">
            {filteredLocations.map((loc) => {
              const isSelected = selectedLocationId === loc.id;
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelectLocation(loc)}
                  className={`w-full text-left p-3 rounded-2xl border-2 transition-all flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? "bg-marigold/30 border-carpet-maroon shadow-bollywood"
                      : "bg-white border-signboard-navy/15 hover:border-signboard-navy/40 shadow-xs"
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-0.5 shadow-xs"
                    style={{ backgroundColor: loc.color }}
                  >
                    {loc.isHotel ? "🏨" : loc.isMeal ? "🍽️" : loc.stepNumber || "•"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-heading font-black text-xs text-signboard-navy truncate">
                        {loc.name}
                      </span>
                      {loc.time && (
                        <span className="text-[10px] text-carpet-maroon shrink-0 font-mono font-bold">
                          {loc.time}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-signboard-navy/70 truncate mt-0.5 font-medium">
                      {loc.category}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="p-3.5 bg-parchment border-t-2 border-signboard-navy/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-signboard-navy/70 px-5">
        <div className="flex flex-wrap items-center gap-3 font-heading font-bold">
          <span className="text-signboard-navy font-black">Route Legend:</span>
          {hotels && hotels.length > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-carpet-maroon inline-block" />
              <span>Base Haveli / Stay</span>
            </span>
          )}
          {itinerary.map((day) => (
            <span key={day.day_number} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{
                  backgroundColor:
                    DAY_COLORS[(day.day_number - 1) % DAY_COLORS.length],
                }}
              />
              <span>Day {day.day_number} Route</span>
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <span>🍽️</span>
            <span>Local Street Food Break</span>
          </span>
        </div>

        <div className="text-[10px] font-heading font-bold text-signboard-navy/60">
          Click any stop or marker to view details &amp; open directions
        </div>
      </div>
    </div>
  );
};
