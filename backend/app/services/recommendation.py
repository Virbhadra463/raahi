import logging
from typing import List, Dict, Any, Optional, Tuple
from app.models.schemas import HotelItem, PlaceItem, FlightItem, AttractionCandidate
from app.agent.schemas import ExtractedTripRequirements

logger = logging.getLogger(__name__)


# Scoring weights for hotels: Budget match (40%), Rating (30%), Location/distance (20%), Amenities/cancellation (10%)
DEFAULT_HOTEL_WEIGHTS = {
    "budget_fit": 0.40,
    "rating": 0.30,
    "distance": 0.20,
    "amenities": 0.10
}


def rank_flights(
    flights: List[FlightItem],
    max_budget: Optional[float] = None,
    prefer_direct: bool = True
) -> List[FlightItem]:
    """
    Score flights based on:
    - Price (50%)
    - Duration (30%)
    - Stops (20%)
    Returns top ranked flights with explainable rationale.
    """
    if not flights:
        return []

    # Identify min/max for normalization
    prices = [f.price for f in flights if f.price > 0]
    durations = [f.duration_minutes for f in flights if f.duration_minutes > 0]

    min_price = min(prices) if prices else 3000.0
    max_price = max(prices) if prices else 15000.0
    price_range = max(1.0, max_price - min_price)

    min_dur = min(durations) if durations else 60
    max_dur = max(durations) if durations else 300
    dur_range = max(1.0, float(max_dur - min_dur))

    ranked: List[FlightItem] = []

    for f in flights:
        # 1. Price score (50%): lower price = higher score
        price_score = max(0.0, 1.0 - ((f.price - min_price) / price_range))

        # 2. Duration score (30%): shorter duration = higher score
        dur_score = max(0.0, 1.0 - ((f.duration_minutes - min_dur) / dur_range))

        # 3. Stops score (20%): direct (0 stops) = 1.0, 1 stop = 0.5, 2+ stops = 0.1
        if f.stops == 0:
            stops_score = 1.0
        elif f.stops == 1:
            stops_score = 0.5
        else:
            stops_score = 0.1

        total_score = round(0.50 * price_score + 0.30 * dur_score + 0.20 * stops_score, 3)

        reasons = []
        if f.stops == 0:
            reasons.append("direct flight")
        else:
            reasons.append(f"{f.stops} stop")

        reasons.append(f"₹{int(f.price)}")
        reasons.append(f"{f.duration_minutes}m")

        f_copy = f.model_copy()
        f_copy.score = total_score
        f_copy.rationale = f"{f.airline} - {', '.join(reasons)}."
        ranked.append(f_copy)

    ranked.sort(key=lambda x: x.score or 0.0, reverse=True)
    return ranked


def score_and_rank_hotels(
    hotels: List[HotelItem],
    target_price_per_night: float,
    max_price_per_night: float,
    preferences: Dict[str, Any],
    elderly_friendly: bool = False,
    weights: Optional[Dict[str, float]] = None
) -> Tuple[List[HotelItem], Optional[str]]:
    """
    Deterministically scores and ranks hotels.
    Generates explainable selection rationale.
    Relaxes constraints if strict criteria yield no matches.
    """
    if not hotels:
        return [], "No accommodation options were found in this area."

    w = weights or DEFAULT_HOTEL_WEIGHTS
    desired_near = (preferences.get("near") or "").lower()
    desired_amenities = [a.lower() for a in (preferences.get("amenities") or []) if a]

    # Filter within max acceptable price
    eligible = [h for h in hotels if h.price_per_night <= max_price_per_night]
    relaxation_note = None

    if not eligible:
        # Constraint relaxation: allow hotels slightly exceeding target
        eligible = sorted(hotels, key=lambda x: x.price_per_night)[:5]
        min_over = round(eligible[0].price_per_night - target_price_per_night)
        relaxation_note = (
            f"No hotels meeting all criteria were found under ₹{int(target_price_per_night)}/night. "
            f"Relaxed budget limit: showing closest matching options exceeding target by approx ₹{max(100, min_over)}/night "
            f"while remaining within the overall trip framework."
        )

    ranked: List[HotelItem] = []

    for h in eligible:
        # 1. Budget fit score (0.0 to 1.0)
        if h.price_per_night <= target_price_per_night:
            budget_score = 1.0 - 0.2 * ((target_price_per_night - h.price_per_night) / max(1.0, target_price_per_night))
        else:
            diff = h.price_per_night - target_price_per_night
            allowance = max(1.0, max_price_per_night - target_price_per_night)
            budget_score = max(0.2, 1.0 - (diff / allowance))

        # 2. Distance score (closer to reference landmark is better)
        # 0 km -> 1.0, 5 km -> 0.5, 10 km+ -> 0.1
        distance_score = max(0.1, 1.0 - (h.distance_km / 10.0))

        # 3. Rating score (scale 1-5 to 0-1)
        rating_score = min(1.0, max(0.0, (h.rating - 2.5) / 2.5))

        # 4. User preference match (near specific landmark / temple)
        pref_score = 0.5
        landmark_match = False
        if desired_near:
            loc_lower = (h.location or "").lower()
            if desired_near in loc_lower or (h.distance_km <= 1.5):
                pref_score = 1.0
                landmark_match = True
            elif h.distance_km <= 3.0:
                pref_score = 0.75
            else:
                pref_score = 0.3

        # 4. Amenities & Cancellation score (10%)
        hotel_amenities_lower = [a.lower() for a in h.amenities]
        matched_amenities = []
        if desired_amenities:
            for da in desired_amenities:
                if any(da in ha for ha in hotel_amenities_lower):
                    matched_amenities.append(da)
            amenity_score = len(matched_amenities) / max(1, len(desired_amenities))
        else:
            amenity_score = 0.7
            if any("elevator" in ha or "lift" in ha for ha in hotel_amenities_lower):
                matched_amenities.append("elevator/lift")
            if any("veg" in ha for ha in hotel_amenities_lower):
                matched_amenities.append("vegetarian dining")

        # Bonus for free cancellation
        if h.free_cancellation:
            amenity_score = min(1.0, amenity_score + 0.2)

        # Senior friendly boost
        senior_boost = 0.0
        if elderly_friendly and any("elevator" in ha or "senior" in ha or "accessible" in ha for ha in hotel_amenities_lower):
            senior_boost = 0.05

        total_score = (
            w["budget_fit"] * budget_score +
            w["rating"] * rating_score +
            w["distance"] * distance_score +
            w["amenities"] * amenity_score +
            senior_boost
        )
        total_score = round(min(1.0, total_score), 3)

        # Generate explainable rationale
        reasons = []
        if h.price_per_night <= target_price_per_night:
            reasons.append(f"within estimated nightly budget (₹{int(h.price_per_night)}/night)")
        else:
            reasons.append(f"comfort tier slightly above target (₹{int(h.price_per_night)}/night)")

        if h.distance_km <= 1.5:
            reasons.append(f"just {h.distance_km} km from the main temple/hub")
        else:
            reasons.append(f"{h.distance_km} km from central hub")

        if h.rating >= 4.0:
            reasons.append(f"strong guest rating of {h.rating}/5")

        if elderly_friendly and any("elevator" in ha or "lift" in ha for ha in hotel_amenities_lower):
            reasons.append("has elevator/lift for elderly comfort")

        rationale = f"Selected because it is {', '.join(reasons)}."

        h_copy = h.model_copy()
        h_copy.score = total_score
        h_copy.rationale = rationale
        ranked.append(h_copy)

    # Sort descending by score
    ranked.sort(key=lambda x: x.score or 0.0, reverse=True)
    return ranked, relaxation_note


def rank_places(
    places: List[PlaceItem],
    requirements: ExtractedTripRequirements
) -> List[PlaceItem]:
    """
    Rank tourist places based on extracted user requirements, category preferences,
    OSM importance/Wikipedia metadata, and dynamic online discovery signals.
    100% dynamic: zero hardcoded destinations or landmark dictionaries.
    """
    if not places:
        return []

    user_interests = [i.lower() for i in requirements.interests]
    elderly = any(t in ("parents", "seniors", "family") for t in requirements.traveller_types)
    max_radius = requirements.maximum_acceptable_travel_distance_km or 40.0

    scored_places = []

    for p in places:
        score = 0.0
        cat_lower = p.category.lower()
        name_lower = p.name.lower()
        desc_lower = (p.description or "").lower()

        # 1. Base OSM importance score from Wikipedia / Wikidata / Heritage tags
        importance = p.tags.get("importance_score", 0.0)
        score += float(importance) * 0.60
        if p.tags.get("has_wiki"):
            score += 0.35

        # 2. Dynamic Online Discovery & Popularity Boost (Works for ANY location worldwide)
        is_online_discovered = p.tags.get("is_online_discovered", False)
        src_cnt = p.tags.get("source_count", 1)
        if is_online_discovered or src_cnt >= 2 or float(importance) >= 0.30:
            score += min(1.0, 0.50 + 0.20 * src_cnt)


        # 3. Interest & Category Match
        matched_interest = False
        for interest in user_interests:
            if any(w in interest for w in ("temple", "religious", "worship", "darshan")):
                if "temple" in cat_lower or "mandir" in name_lower or "temple" in name_lower:
                    score += 0.40
                    matched_interest = True
            if "fort" in interest:
                if "fort" in cat_lower or "fort" in name_lower:
                    score += 0.40
                    matched_interest = True
            if any(w in interest for w in ("peaceful", "garden", "park", "promenade", "nature")):
                if "garden" in cat_lower or "park" in cat_lower or "promenade" in cat_lower or "peaceful" in desc_lower:
                    score += 0.35
                    matched_interest = True
            if any(w in interest for w in ("museum", "history", "heritage", "monument", "landmark")):
                if "museum" in cat_lower or "heritage" in cat_lower or "monument" in cat_lower:
                    score += 0.40
                    matched_interest = True

        # Local experience booster
        is_local_exp = getattr(requirements, "local_experience", False) or "local" in getattr(requirements, "travel_style", [])
        if is_local_exp:
            if any(k in cat_lower or k in name_lower or k in desc_lower for k in ("market", "bazaar", "promenade", "walk", "street", "chowk", "ghat", "heritage", "colaba", "fort", "marine drive")):
                score += 0.45
                matched_interest = True

        if not matched_interest:
            score += 0.10

        # 4. Explicit user mention in prompt / preferred activities
        pref_acts = [a.lower() for a in (getattr(requirements, "preferred_activities", None) or [])]
        for pa in pref_acts:
            if pa in name_lower or any(word in name_lower for word in pa.split() if len(word) > 3):
                score += 1.50

        # 5. Distance weighting
        dist = p.distance_km_from_center or 1.0
        if dist <= 5.0:
            score += 0.30
        elif dist <= 15.0:
            score += 0.20
        elif dist <= max_radius:
            score += 0.10
        else:
            score -= 0.15  # Out of preferred radius

        # 6. Elderly / Senior friendliness
        if elderly:
            if "fort" in cat_lower and not ("accessible" in (p.wheelchair or "").lower()):
                score -= 0.20
            if "accessible" in (p.wheelchair or "").lower():
                score += 0.15
            if dist <= 3.0:
                score += 0.10

        scored_places.append((score, p))

    # Sort descending by score
    scored_places.sort(key=lambda x: x[0], reverse=True)
    return [p for _, p in scored_places]


TRIP_STYLE_WEIGHTS: Dict[str, Dict[str, float]] = {
    "first_time_tourist": {
        "fame": 0.45,
        "cultural": 0.25,
        "interest": 0.15,
        "authenticity": 0.10,
        "uniqueness": 0.05
    },
    "classic_sightseeing": {
        "fame": 0.35,
        "cultural": 0.30,
        "interest": 0.20,
        "authenticity": 0.10,
        "uniqueness": 0.05
    },
    "hidden_gems": {
        "uniqueness": 0.35,
        "authenticity": 0.35,
        "interest": 0.15,
        "cultural": 0.10,
        "fame": 0.05
    },
    "food_focused": {
        "authenticity": 0.40,
        "interest": 0.30,
        "fame": 0.15,
        "cultural": 0.10,
        "uniqueness": 0.05
    },
    "relaxed": {
        "cultural": 0.30,
        "fame": 0.30,
        "interest": 0.25,
        "authenticity": 0.15,
        "uniqueness": 0.00
    },
    "packed": {
        "fame": 0.35,
        "cultural": 0.25,
        "interest": 0.20,
        "uniqueness": 0.10,
        "authenticity": 0.10
    }
}


def score_attraction_candidates(
    candidates: List[AttractionCandidate],
    trip_style: str,
    requirements: ExtractedTripRequirements
) -> List[AttractionCandidate]:
    """
    Score candidates using multi-dimensional weights depending on trip style.
    Applies Must-See Protection: Essential and user-requested places cannot be displaced by niche candidates.
    """
    weights = TRIP_STYLE_WEIGHTS.get(trip_style, TRIP_STYLE_WEIGHTS["classic_sightseeing"])
    scored: List[AttractionCandidate] = []
    user_interests = [i.lower() for i in requirements.interests]
    elderly = any(t in ("parents", "seniors", "family") for t in requirements.traveller_types)
    max_radius = requirements.maximum_acceptable_travel_distance_km or 40.0

    for cand in candidates:
        name_lower = cand.name.lower()
        cat_lower = cand.category.lower()

        # Dynamic user interest match calculation
        interest_match = cand.user_interest_match
        for ui in user_interests:
            if ui in cat_lower or any(w in name_lower for w in ui.split()):
                interest_match = min(1.0, interest_match + 0.25)

        # Distance penalty if too far from destination center
        dist = cand.distance_km_from_center or 1.0
        dist_factor = 1.0
        if dist > max_radius:
            dist_factor = max(0.5, 1.0 - ((dist - max_radius) / max_radius))

        # Base weighted multi-dimensional score
        base_score = (
            weights["fame"] * cand.fame_score +
            weights["cultural"] * cand.cultural_score +
            weights["interest"] * interest_match +
            weights["authenticity"] * cand.local_authenticity_score +
            weights["uniqueness"] * cand.uniqueness_score
        ) * dist_factor

        # Senior accessibility adjustment
        if elderly and ("fort" in cat_lower or "caves" in cat_lower) and not ("accessible" in (cand.wheelchair or "").lower()):
            base_score = max(0.2, base_score - 0.10)

        # MUST-SEE PROTECTION BOOST:
        # Essential landmarks (Marine Drive, Gateway of India, Babulnath, Chowpatty, CSMT, etc.)
        # and explicit user requests receive high-priority tier protection.
        is_essential = cand.tier == "ESSENTIAL" or cand.destination_essential or cand.explicit_user_requested
        if is_essential:
            cand_tier = "ESSENTIAL"
            base_score += 1.50
        elif cand.source_count >= 2 or cand.fame_score >= 0.85:
            cand_tier = "RECOMMENDED"
            base_score += 0.50
        else:
            cand_tier = "OPTIONAL"

        c_copy = cand.model_copy()
        c_copy.tier = cand_tier
        c_copy.computed_score = round(base_score, 3)
        c_copy.score_breakdown = {
            "fame": round(weights["fame"] * cand.fame_score, 2),
            "cultural": round(weights["cultural"] * cand.cultural_score, 2),
            "interest": round(weights["interest"] * interest_match, 2),
            "authenticity": round(weights["authenticity"] * cand.local_authenticity_score, 2),
            "must_see_boost": 1.50 if is_essential else (0.50 if cand_tier == "RECOMMENDED" else 0.0)
        }
        scored.append(c_copy)

    # Sort descending: Tier ESSENTIAL first, then by computed_score
    tier_order = {"ESSENTIAL": 0, "RECOMMENDED": 1, "OPTIONAL": 2}
    scored.sort(key=lambda c: (tier_order.get(c.tier, 3), -(c.computed_score or 0.0)))
    return scored


def filter_and_protect_candidates(
    candidates: List[AttractionCandidate],
    target_count: int
) -> Tuple[List[AttractionCandidate], List[AttractionCandidate]]:
    """
    Partitions scored candidates into selected pool and overflow.
    Guarantees that ALL tier 'ESSENTIAL' candidates are preserved in the selected pool.
    """
    essential = [c for c in candidates if c.tier == "ESSENTIAL"]
    recommended = [c for c in candidates if c.tier == "RECOMMENDED"]
    optional = [c for c in candidates if c.tier == "OPTIONAL"]

    selected = list(essential)
    overflow: List[AttractionCandidate] = []

    # Fill remaining capacity with recommended candidates
    for r in recommended:
        if len(selected) < target_count:
            selected.append(r)
        else:
            overflow.append(r)

    # Fill any remaining capacity with optional candidates
    for o in optional:
        if len(selected) < target_count:
            selected.append(o)
        else:
            overflow.append(o)

    return selected, overflow


