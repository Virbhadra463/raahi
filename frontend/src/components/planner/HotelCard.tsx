"use client";

import React from "react";
import { HotelItem } from "../../types/travel";
import { Hotel, Star, MapPin, ExternalLink, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";

interface HotelCardProps {
  hotels?: HotelItem[];
  hotel?: HotelItem;
  alternateHotels?: HotelItem[];
}

export const HotelCard: React.FC<HotelCardProps> = (props: HotelCardProps = {}) => {
  const hotelsList: HotelItem[] =
    props.hotels && props.hotels.length > 0
      ? props.hotels
      : ([props.hotel, ...(props.alternateHotels || [])].filter(Boolean) as HotelItem[]);

  if (!hotelsList || hotelsList.length === 0) return null;

  const topHotel = hotelsList[0];
  const otherHotels = hotelsList.slice(1, 4);

  return (
    <div className="w-full bg-[#FFFDF9] rounded-3xl shadow-bollywood-lg border-2 sm:border-3 border-signboard-navy p-6 sm:p-8 space-y-6 text-signboard-navy relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-signboard-navy/15 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-carpet-maroon text-marigold flex items-center justify-center shadow-xs">
            <Hotel className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-signboard-navy text-base sm:text-lg">
              Heritage Stays &amp; Haveli Choice
            </h3>
            <p className="text-[11px] text-signboard-navy/60 font-semibold">
              Curated for landmark proximity, safety, and price tolerance
            </p>
          </div>
        </div>

        <span className="stamp-badge text-carpet-maroon border-carpet-maroon bg-carpet-maroon/10">
          Ranked by Budget &amp; Proximity
        </span>
      </div>

      {/* Top Ranked Hotel Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-parchment/70 border-2 border-signboard-navy/15 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-heading font-black text-carpet-maroon uppercase tracking-wide flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-terracotta" /> Prime Choice
              </span>
              <div className="flex items-center gap-1 text-[#C98A2E] text-xs font-heading font-black bg-marigold/30 border border-marigold px-2 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 fill-[#E5A532] text-[#E5A532]" />
                <span>{topHotel.rating}</span>
                {(topHotel.reviews_count || topHotel.reviews) && (
                  <span className="text-signboard-navy/50 font-medium">
                    ({topHotel.reviews_count || topHotel.reviews})
                  </span>
                )}
              </div>
              {topHotel.hotel_class && (
                <span className="text-[11px] font-heading font-bold px-2 py-0.5 rounded bg-signboard-navy/10 text-signboard-navy">
                  {topHotel.hotel_class}-Star Class
                </span>
              )}
              {topHotel.free_cancellation && (
                <span className="text-[11px] font-heading font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Free Cancellation
                </span>
              )}
            </div>
            <h4 className="text-lg font-heading font-black text-signboard-navy mt-1.5">
              {topHotel.name}
            </h4>
            <div className="flex items-center gap-1 text-xs text-signboard-navy/70 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-carpet-maroon" />
              <span>
                {topHotel.distance_km > 0
                  ? `${topHotel.distance_km} km from ${topHotel.distance_reference}`
                  : topHotel.location || topHotel.distance_reference}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-2xl font-display font-black text-carpet-maroon">
              ₹{topHotel.price_per_night.toLocaleString()}
            </div>
            <div className="text-[11px] text-signboard-navy/60 font-medium">per night / room</div>
            {topHotel.total_price && (
              <div className="text-[11px] text-signboard-navy/70 font-bold">
                Total: ₹{topHotel.total_price.toLocaleString()}
              </div>
            )}
            <div className="mt-2.5 flex flex-wrap sm:justify-end gap-2">
              <a
                href={topHotel.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-carpet-maroon hover:bg-carpet-light text-white text-xs font-heading font-black uppercase tracking-wider shadow-bollywood border-2 border-carpet-maroon transition-all cursor-pointer"
              >
                <span>Book Stay</span>
                <ExternalLink className="w-3.5 h-3.5 text-marigold" />
              </a>
              {topHotel.directions_url && (
                <a
                  href={topHotel.directions_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-signboard-navy bg-marigold hover:bg-amber-300 text-signboard-navy text-xs font-heading font-black uppercase tracking-wider shadow-bollywood transition-all"
                  title="View on Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5 text-carpet-maroon" />
                  <span>Map</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Explainable Rationale */}
        <div className="text-xs text-signboard-navy/90 bg-white p-3.5 rounded-xl border-2 border-signboard-navy/10 leading-relaxed font-body font-medium">
          <span className="font-heading font-black text-signboard-navy">Why this stay was selected: </span>
          {topHotel.rationale}
        </div>

        {/* Real Provider Booking Comparison Options */}
        {topHotel.booking_options && topHotel.booking_options.length > 0 && (
          <div className="pt-2 border-t-2 border-signboard-navy/10 space-y-2">
            <span className="text-[11px] font-heading font-black text-signboard-navy/60 uppercase tracking-wider">
              Compare Booking Providers:
            </span>
            <div className="flex flex-wrap gap-2">
              {topHotel.booking_options.slice(0, 4).map((opt, i) => (
                <a
                  key={i}
                  href={opt.booking_url || topHotel.booking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-signboard-navy/20 bg-white text-xs font-heading font-bold hover:border-carpet-maroon transition-colors shadow-xs"
                >
                  <span className="text-signboard-navy">{opt.source}</span>
                  {opt.price && (
                    <span className="text-carpet-maroon font-black">
                      ₹{Math.round(opt.price).toLocaleString()}
                    </span>
                  )}
                  <ExternalLink className="w-3 h-3 text-signboard-navy/40" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Amenities Chips */}
        {topHotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {topHotel.amenities.slice(0, 6).map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-heading font-bold bg-white text-signboard-navy border border-signboard-navy/15"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {amenity}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Alternative Options */}
      {otherHotels.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-xs font-heading font-black text-signboard-navy/70 uppercase tracking-wider">
            Alternative Stay Choices:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {otherHotels.map((hotel, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border-2 border-signboard-navy/15 bg-white flex justify-between items-center text-xs"
              >
                <div>
                  <div className="font-heading font-black text-signboard-navy">{hotel.name}</div>
                  <div className="text-[11px] text-signboard-navy/60 font-medium">
                    {hotel.distance_km > 0 ? `${hotel.distance_km} km away · ` : ""}★ {hotel.rating}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-black text-carpet-maroon">
                    ₹{hotel.price_per_night.toLocaleString()}
                  </div>
                  <a
                    href={hotel.booking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-heading font-bold text-carpet-maroon hover:underline flex items-center justify-end gap-1 mt-0.5"
                  >
                    Details <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
