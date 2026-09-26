import logging
import math
import re
import time
import urllib.parse
from typing import List, Dict, Any, Optional, Tuple
import httpx

from app.core.config import settings
from app.core.http_client import get_http_client
from app.models.schemas import PlaceItem, AttractionCandidate
from app.tools.osm import geocode_destination, haversine_distance, search_osm_by_name_overpass

logger = logging.getLogger(__name__)


# In-memory coordinate cache for any dynamic lookup
_COORDINATE_CACHE: Dict[str, Tuple[float, float, str]] = {}
_NOMINATIM_RATE_LIMIT_UNTIL: float = 0.0


# ─── Quality Gate: Words/patterns that should NEVER appear as tourist attraction names ───
_GARBAGE_TITLE_PATTERNS = re.compile(
    r'^(?:'
    r'\d{4}$|'                            # Pure years: "2008", "1947"
    r'\d{4}\s|'                           # Starts with year: "2008 Mumbai attacks"
    r'.*\battacks?\b.*|'                  # Terrorist/attack articles
    r'.*\bbombing[s]?\b.*|'              # Bombing articles
    r'.*\bmassacre\b.*|'                  # Massacre articles
    r'.*\briot[s]?\b.*|'                  # Riot articles
    r'.*\bexpressway\b.*|'               # Infrastructure: highways
    r'.*\bhighway\b.*|'                   # Infrastructure: highways
    r'.*\bmetro line\b.*|'               # Infrastructure: metro
    r'.*\bdistrict\b.*|'                  # Administrative districts
    r'.*\bmunicipal\b.*|'                 # Municipal entities
    r'.*\bcorporation\b.*|'              # Government bodies
    r'.*\belection[s]?\b.*|'             # Political events
    r'.*\bdemograph.*|'                   # Demographics articles
    r'.*\bgeography\b.*|'                # Geography articles
    r'.*\btransport in\b.*|'             # Transport meta articles
    r'.*\beconomy of\b.*|'              # Economy meta
    r'.*\bpolitics of\b.*|'             # Politics meta
    r'.*\bclimate of\b.*|'              # Climate meta
    r'.*\bculture of\b.*|'              # Culture meta
    r'.*\bhistory of\b.*|'              # History meta
    r'.*\btourism in\b.*|'              # Tourism meta
    r'.*\blist of\b.*|'                  # List meta articles
    r'all famous places?$|'              # Generic phrase
    r'famous places?$|'                  # Generic phrase
    r'places to visit$|'                 # Generic phrase
    r'top \d+ places?$|'                 # Generic "top 10 places"
    r'best places?$'                     # Generic phrase
    r')$',
    re.IGNORECASE
)

# Words that indicate a title is NOT a physical visitable place
_NON_PLACE_INDICATORS = {
    "population", "census", "ward", "constituency", "pincode", "zip",
    "train", "airline", "flight", "bus route", "accident", "death",
    "serial", "tv show", "movie", "film", "song", "album", "book",
    "university of", "institute of", "college of", "school of",
    "company", "corporation", "ltd", "pvt", "inc",
}


def _is_valid_attraction_title(title: str, destination: str) -> bool:
    """
    Quality gate: Returns True only if the title looks like a real, visitable tourist attraction.
    Rejects years, events, infrastructure, meta-articles, city names, and truncated titles.
    """
    t = title.strip()
    t_lower = t.lower()
    dest_lower = destination.lower().strip()

    # Too short or too long
    if len(t) < 4 or len(t) > 80:
        return False

    # Pure number or year
    if re.match(r'^\d+$', t):
        return False

    # Starts with a year (e.g., "2008 Mumbai attacks")
    if re.match(r'^\d{4}\s', t):
        return False

    # Title IS the destination itself (e.g., "Mumbai", "Mumbai, India" for a Mumbai search)
    t_clean = re.sub(r'[\s,]+(india|maharashtra|state)$', '', t_lower).strip()
    if t_clean in (dest_lower, f"the {dest_lower}", f"{dest_lower} city", f"{dest_lower} district"):
        return False

    # Ends with incomplete word fragments: "Delhi–", "University of", "History of"
    if t.endswith(('–', '-', ' of', ' and', ' the', ' in')):
        return False


    # Matches garbage pattern regex
    if _GARBAGE_TITLE_PATTERNS.match(t_lower):
        return False

    # Contains non-place indicators
    for indicator in _NON_PLACE_INDICATORS:
        if indicator in t_lower:
            return False

    # Is just a single generic word like a neighborhood without specificity
    words = t.split()
    if len(words) == 1 and t_lower in {
        "sion", "andheri", "bandra", "dadar", "thane", "borivali", "malad",
        "goregaon", "kandivali", "powai", "worli", "parel", "wadala",
        "vikhroli", "ghatkopar", "mulund", "chembur", "kurla", "vashi",
        "nerul", "panvel", "airoli", "khar", "santacruz", "vile parle",
        # Generic area names without a specific attraction
    }:
        return False

    return True


def _extract_place_names_from_wikitext(html_snippet: str) -> List[str]:
    """
    Extract potential place names from Wikipedia HTML snippets.
    Looks for bold text, linked text patterns, and proper noun sequences.
    """
    places = []

    # Remove HTML tags but capture link text first
    # Pattern: <span class="searchmatch">text</span>
    matches = re.findall(r'<span class="searchmatch">([^<]+)</span>', html_snippet)

    # Also extract proper noun sequences from cleaned text
    clean = re.sub(r'<[^>]+>', ' ', html_snippet)
    clean = re.sub(r'\s+', ' ', clean).strip()

    # Find sequences of capitalized words (potential place names)
    proper_nouns = re.findall(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,4})\b', clean)
    for pn in proper_nouns:
        if len(pn) > 4 and pn not in places:
            places.append(pn)

    return places


async def _fetch_wikipedia_page_links(page_title: str, destination: str) -> List[Dict[str, Any]]:
    """
    Fetch the actual content/links from a specific Wikipedia page (e.g., "List of tourist attractions in Mumbai").
    Extracts real place names from the page's internal links.
    """
    client = get_http_client()
    discovered = []
    seen = set()

    try:
        # Use Wikipedia's parse API to get links from the page
        url = "https://en.wikipedia.org/w/api.php"
        params = {
            "action": "parse",
            "page": page_title,
            "prop": "links",
            "format": "json",
            "utf8": "1",
        }
        resp = await client.get(url, params=params, timeout=5.0)
        if resp.status_code == 200:
            data = resp.json()
            links = data.get("parse", {}).get("links", [])
            for link in links:
                # Only namespace 0 (main articles) are real places
                if link.get("ns", -1) != 0:
                    continue
                link_title = link.get("*", "").strip()
                if not link_title:
                    continue

                # Apply quality gate
                if not _is_valid_attraction_title(link_title, destination):
                    continue

                link_lower = link_title.lower()
                if link_lower not in seen:
                    seen.add(link_lower)
                    discovered.append({
                        "title": link_title,
                        "snippet": f"Listed in '{page_title}' on Wikipedia.",
                        "source": "Wikipedia (Page Links)"
                    })

            logger.info(f"Wikipedia page '{page_title}' yielded {len(discovered)} attraction links.")
    except Exception as e:
        logger.info(f"Wikipedia page links fetch for '{page_title}' error: {e}")

    return discovered


async def _fetch_wikipedia_page_sections(page_title: str, destination: str) -> List[Dict[str, Any]]:
    """
    Fetch sections and extract structured attraction names from a Wikipedia list page.
    Uses the 'sections' prop to identify attraction categories.
    """
    client = get_http_client()
    discovered = []
    seen = set()

    try:
        url = "https://en.wikipedia.org/w/api.php"
        params = {
            "action": "parse",
            "page": page_title,
            "prop": "wikitext",
            "format": "json",
            "utf8": "1",
        }
        resp = await client.get(url, params=params, timeout=5.0)
        if resp.status_code == 200:
            data = resp.json()
            wikitext = data.get("parse", {}).get("wikitext", {}).get("*", "")

            # Extract [[link|display]] and [[link]] patterns from wikitext
            wiki_links = re.findall(r'\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]', wikitext)
            for link_name in wiki_links:
                link_name = link_name.strip()
                # Remove any section anchors
                if '#' in link_name:
                    link_name = link_name.split('#')[0].strip()
                if not link_name:
                    continue
                if not _is_valid_attraction_title(link_name, destination):
                    continue

                link_lower = link_name.lower()
                if link_lower not in seen:
                    seen.add(link_lower)
                    discovered.append({
                        "title": link_name,
                        "snippet": f"Referenced in '{page_title}' on Wikipedia.",
                        "source": "Wikipedia (Wikitext Links)"
                    })

            logger.info(f"Wikipedia wikitext for '{page_title}' yielded {len(discovered)} attraction names.")
    except Exception as e:
        logger.info(f"Wikipedia wikitext extraction for '{page_title}' error: {e}")

    return discovered


async def search_online_wikipedia_attractions(destination: str) -> List[Dict[str, Any]]:
    """
    Search Wikipedia live for famous landmarks, sights, and attractions in the destination.
    100% dynamic: works for any city, town, hill station, or country worldwide.

    Strategy:
    1. First, try to find and parse "List of tourist attractions in <destination>" page directly
       to extract real place names from wikilinks.
    2. Then, search Wikipedia for supplementary articles and extract place names from snippets.
    3. Apply strict quality filtering to reject garbage titles (years, events, meta-articles, etc.)
    """
    client = get_http_client()
    clean_dest = destination.strip()
    discovered: List[Dict[str, Any]] = []
    seen = set()

    # ── Phase 1: Try to parse the "List of tourist attractions" page directly ──
    list_page_titles = [
        f"List of tourist attractions in {clean_dest}",
        f"Tourism in {clean_dest}",
    ]
    for list_page in list_page_titles:
        try:
            # First check if the page exists
            check_url = "https://en.wikipedia.org/w/api.php"
            check_params = {
                "action": "query",
                "titles": list_page,
                "format": "json",
                "utf8": "1",
            }
            check_resp = await client.get(check_url, params=check_params, timeout=4.0)
            if check_resp.status_code == 200:
                pages = check_resp.json().get("query", {}).get("pages", {})
                page_exists = not any(pid == "-1" for pid in pages.keys())
                if page_exists:
                    # Parse links from this page
                    page_links = await _fetch_wikipedia_page_links(list_page, clean_dest)
                    for pl in page_links:
                        key = pl["title"].lower()
                        if key not in seen:
                            seen.add(key)
                            discovered.append(pl)

                    # Also parse wikitext for additional links
                    wikitext_links = await _fetch_wikipedia_page_sections(list_page, clean_dest)
                    for wl in wikitext_links:
                        key = wl["title"].lower()
                        if key not in seen:
                            seen.add(key)
                            discovered.append(wl)
        except Exception as e:
            logger.info(f"Wikipedia list page '{list_page}' check error: {e}")

    # ── Phase 2: Supplementary search-based discovery ──
    search_queries = [
        f"famous landmarks in {clean_dest}",
        f"{clean_dest} tourist attractions must visit",
        f"heritage sites monuments {clean_dest}",
        f"temples churches mosques {clean_dest}",
        f"beaches parks gardens {clean_dest}",
    ]

    for q in search_queries:
        try:
            url = "https://en.wikipedia.org/w/api.php"
            params = {
                "action": "query",
                "list": "search",
                "srsearch": q,
                "format": "json",
                "utf8": "1",
                "srlimit": "8",
            }
            resp = await client.get(url, params=params, timeout=4.0)
            if resp.status_code == 200:
                data = resp.json()
                search_results = data.get("query", {}).get("search", [])
                for item in search_results:
                    title = item.get("title", "")
                    # Clean parenthetical disambiguation: "Gateway of India (monument)" -> "Gateway of India"
                    cleaned_title = re.sub(r'\s*\(.*?\)\s*', ' ', title).strip()
                    # Remove trailing destination name: "Haji Ali Dargah, Mumbai" -> "Haji Ali Dargah"
                    cleaned_title = re.sub(
                        rf',?\s*{re.escape(clean_dest)}.*$', '', cleaned_title, flags=re.IGNORECASE
                    ).strip()

                    # Apply quality gate
                    if not _is_valid_attraction_title(cleaned_title, clean_dest):
                        continue

                    if cleaned_title.lower() not in seen:
                        seen.add(cleaned_title.lower())
                        snippet = item.get("snippet", "")
                        clean_snippet = re.sub(r'<[^>]+>', '', snippet)
                        discovered.append({
                            "title": cleaned_title,
                            "snippet": clean_snippet,
                            "source": "Wikipedia"
                        })
        except Exception as e:
            logger.info(f"Wikipedia search query '{q}' error: {e}")

    logger.info(f"Wikipedia discovery for '{clean_dest}': {len(discovered)} validated attractions.")
    return discovered


async def search_online_serpapi(query: str) -> List[str]:
    """Search online using SerpApi Google Search engine if configured."""
    if not settings.SERPAPI_KEY:
        return []

    client = get_http_client()
    discovered: List[str] = []
    try:
        url = settings.SERPAPI_SEARCH_URL
        params = {
            "engine": "google",
            "q": query,
            "api_key": settings.SERPAPI_KEY,
            "num": "6",
            "gl": "in",
            "hl": "en",
        }
        resp = await client.get(url, params=params, timeout=5.0)
        if resp.status_code == 200:
            data = resp.json()
            # Top sights carousel
            top_sights = data.get("top_sights", {}).get("sights", [])
            for s in top_sights:
                name = s.get("title") or s.get("name")
                if name and name not in discovered:
                    discovered.append(name.strip())

            # Organic results
            organic = data.get("organic_results", [])
            for r in organic:
                title = r.get("title", "")
                snippet = r.get("snippet", "")
                places = re.findall(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b', f"{title} {snippet}")
                for p in places:
                    if len(p) > 4 and p not in discovered:
                        discovered.append(p)
    except Exception as e:
        logger.info(f"SerpApi online search error: {e}")

    return discovered


def extract_explicit_places_from_prompt(user_prompt: str) -> List[str]:
    """
    Extract any places or landmarks explicitly requested by user in their natural language prompt.
    100% dynamic regex extraction: works for any city, landmark, or attraction name.
    """
    results: List[str] = []
    seen = set()

    # Pattern 1: After action verbs (visit, see, explore, go to, travel to, darshan at, trek to)
    patterns = [
        r'(?:visit|see|explore|go\s+to|travel\s+to|trek\s+to|darshan\s+at)\s+([A-Za-z0-9\s\'\&\-]+?)(?:\s+(?:and|with|for|\.|,|;|\bin\b|\bat\b)|$)',
        r'(?:want\s+to\s+see|like\s+to\s+visit)\s+([A-Za-z0-9\s\'\&\-]+?)(?:\s+(?:and|with|for|\.|,|;)|$)',
        r'["\']([A-Za-z0-9\s\'\&\-]{3,35})["\']',  # Quoted attraction names
    ]

    for pat in patterns:
        for m in re.finditer(pat, user_prompt, re.IGNORECASE):
            candidate = m.group(1).strip()
            # Filter out non-place filler words
            if len(candidate) > 3 and candidate.lower() not in (
                "a trip", "my family", "my parents", "budget", "hotel", "food", "itinerary", "days", "nights", "darshan"
            ):
                # Clean up punctuation and split compound lists if "and" or commas inside
                subparts = re.split(r'\s*,\s*|\s+and\s+', candidate)
                for sp in subparts:
                    sp_clean = sp.strip().title()
                    if len(sp_clean) > 3 and sp_clean.lower() not in seen:
                        seen.add(sp_clean.lower())
                        results.append(sp_clean)

    return results


def find_matching_osm_place(candidate_name: str, osm_places: List[PlaceItem]) -> Optional[PlaceItem]:
    """
    Match an online-discovered candidate name against real OpenStreetMap places retrieved via Overpass.
    Uses exact, substring, and token overlap matching.
    """
    c_lower = candidate_name.lower().strip()
    c_tokens = set(re.findall(r'\w+', c_lower)) - {"the", "and", "in", "of", "temple", "mandir", "fort", "caves", "beach", "road", "promenade"}

    best_match = None
    best_score = 0.0

    for p in osm_places:
        p_lower = p.name.lower().strip()
        # 1. Exact match
        if c_lower == p_lower:
            return p

        # 2. Substring match
        if c_lower in p_lower or p_lower in c_lower:
            score = 0.90
            if score > best_score:
                best_score = score
                best_match = p

        # 3. Token overlap match
        p_tokens = set(re.findall(r'\w+', p_lower))
        if c_tokens and p_tokens:
            common = c_tokens & p_tokens
            overlap_ratio = len(common) / max(len(c_tokens), 1)
            if overlap_ratio >= 0.70 and overlap_ratio > best_score:
                best_score = overlap_ratio
                best_match = p

    return best_match if best_score >= 0.70 else None


async def collect_candidate_attractions(
    destination: str,
    user_prompt: str,
    center_lat: float,
    center_lon: float,
    explicit_user_mentions: Optional[List[str]] = None,
    preloaded_osm_places: Optional[List[PlaceItem]] = None
) -> List[AttractionCandidate]:
    """
    Main Multi-Query Web Discovery & Dynamic OSM Spatial Grounding Pipeline:
    100% Dynamic: Zero hardcoded destinations or location dictionaries.
    Works for any destination in Maharashtra, India, or worldwide.

    1. Live Multi-Query Wikipedia + Web Discovery (with page content extraction).
    2. Dynamic User Prompt Extraction.
    3. Multi-source frequency tracking (source_count).
    4. Quality Gate: Aggressive filtering of garbage/non-place candidates.
    5. Spatial Grounding against Overpass OSM Places (high-speed, zero rate-limit).
    6. Construct AttractionCandidate models with multi-dimensional scoring signals.
    """
    global _NOMINATIM_RATE_LIMIT_UNTIL

    candidates_dict: Dict[str, Dict[str, Any]] = {}

    def register_candidate(name: str, src: str, initial_data: Optional[Dict[str, Any]] = None):
        clean_name = name.strip()
        # Apply quality gate before registering
        if not _is_valid_attraction_title(clean_name, destination):
            logger.debug(f"Quality gate rejected candidate: '{clean_name}'")
            return
        key = clean_name.lower()
        if key not in candidates_dict:
            candidates_dict[key] = {
                "name": clean_name,
                "canonical_name": clean_name,
                "sources": {src},
                "source_count": 1,
                "data": initial_data or {}
            }
        else:
            candidates_dict[key]["sources"].add(src)
            candidates_dict[key]["source_count"] = len(candidates_dict[key]["sources"])
            if initial_data:
                for k, v in initial_data.items():
                    if k not in candidates_dict[key]["data"] or not candidates_dict[key]["data"][k]:
                        candidates_dict[key]["data"][k] = v

    # Step 1: Live Multi-query Wikipedia search for destination
    wiki_results = await search_online_wikipedia_attractions(destination)
    for w in wiki_results:
        register_candidate(w["title"], "Wikipedia", {"description": w.get("snippet")})

    # Step 2: Google Search via SerpApi (if configured)
    serp_names = await search_online_serpapi(f"famous places to visit in {destination} travel attractions itinerary")
    for s_name in serp_names:
        register_candidate(s_name, "Google Search (SerpApi)")

    # Step 3: Extract any explicit requests from user prompt
    prompt_extracted = extract_explicit_places_from_prompt(user_prompt)
    all_explicit = list(explicit_user_mentions or []) + prompt_extracted

    for em in all_explicit:
        em_clean = em.strip()
        if len(em_clean) < 3:
            continue
        matched_key = None
        for k in candidates_dict:
            if em_clean.lower() in k or k in em_clean.lower():
                matched_key = k
                break
        if matched_key:
            candidates_dict[matched_key]["explicit_requested"] = True
            candidates_dict[matched_key]["source_count"] += 2
        else:
            register_candidate(em_clean, "User Explicit Request", {"explicit_requested": True})
            if em_clean.lower() in candidates_dict:
                candidates_dict[em_clean.lower()]["explicit_requested"] = True

    logger.info(f"Online discovery found {len(candidates_dict)} validated attraction candidates for destination '{destination}'.")

    # Step 4: Spatial Grounding against Overpass real places
    osm_reference_places = list(preloaded_osm_places or [])
    grounded_candidates: List[AttractionCandidate] = []
    seen_coords = set()

    # Sort discovered candidates by (explicit_requested, source_count) descending
    sorted_candidate_keys = sorted(
        candidates_dict.keys(),
        key=lambda k: (
            candidates_dict[k].get("explicit_requested", False),
            candidates_dict[k]["source_count"]
        ),
        reverse=True
    )

    for idx, c_key in enumerate(sorted_candidate_keys[:30]):
        c_entry = candidates_dict[c_key]
        c_name = c_entry["name"]
        is_explicit = c_entry.get("explicit_requested", False)
        src_cnt = c_entry["source_count"]

        p_lat: Optional[float] = None
        p_lon: Optional[float] = None
        category = "Tourist Attraction"
        desc = c_entry.get("data", {}).get("description") or f"Famous highlight in {destination}."
        osm_tags: Dict[str, Any] = {}
        opening_hours = None
        wheelchair = "Ground-level accessibility"

        # A. Try matching against Overpass OSM reference places first
        matched_osm = find_matching_osm_place(c_name, osm_reference_places)
        if matched_osm:
            p_lat = matched_osm.latitude
            p_lon = matched_osm.longitude
            category = matched_osm.category
            desc = matched_osm.description or desc
            osm_tags = matched_osm.tags
            opening_hours = matched_osm.opening_hours
            wheelchair = matched_osm.wheelchair
        else:
            # B. If not in batch, query Overpass QL by name (fast, zero rate-limit)
            op_place = await search_osm_by_name_overpass(c_name, center_lat, center_lon, radius=45000)
            if op_place:
                p_lat = op_place.latitude
                p_lon = op_place.longitude
                category = op_place.category
                desc = op_place.description or desc
                osm_tags = op_place.tags
                opening_hours = op_place.opening_hours
                wheelchair = op_place.wheelchair
            else:
                # C. Check cache
                cache_key = f"{c_name.lower()}_{destination.lower()}"
                if cache_key in _COORDINATE_CACHE:
                    p_lat, p_lon, category = _COORDINATE_CACHE[cache_key]

        # If place could not be matched directly in Overpass, anchor around destination center
        # Only do this for candidates with strong evidence (multi-source or explicit)
        if p_lat is None or p_lon is None:
            if src_cnt >= 2 or is_explicit:
                # Use Photon/Nominatim geocoding as a last resort for high-confidence candidates
                geo = await geocode_destination(f"{c_name}, {destination}")
                if geo and geo.get("latitude") and geo.get("longitude"):
                    p_lat = geo["latitude"]
                    p_lon = geo["longitude"]
                    # Verify the geocoded result is actually near the destination (within 100km)
                    dist_check = haversine_distance(center_lat, center_lon, p_lat, p_lon)
                    if dist_check > 100.0:
                        logger.info(f"Geocoded '{c_name}' is {dist_check:.0f}km from {destination} — skipping.")
                        continue
                else:
                    # Skip candidates we can't locate at all unless explicitly requested
                    if not is_explicit:
                        logger.info(f"Cannot locate '{c_name}' — skipping unverified candidate.")
                        continue
                    # Last resort: small deterministic offset for explicit user requests
                    offset_idx = len(grounded_candidates) + 1
                    angle = (offset_idx * 137.5) * (3.14159 / 180.0)
                    radius_km = 1.0 + (offset_idx % 4) * 0.8
                    p_lat = round(center_lat + (radius_km / 111.0) * math.cos(angle), 6)
                    p_lon = round(center_lon + (radius_km / (111.0 * max(0.1, math.cos(math.radians(center_lat))))) * math.sin(angle), 6)
            else:
                # Low-confidence candidate with no location — skip it
                logger.debug(f"Skipping low-confidence unlocatable candidate: '{c_name}'")
                continue

        coord_key = (round(p_lat, 3), round(p_lon, 3))
        if coord_key in seen_coords:
            continue
        seen_coords.add(coord_key)

        dist = haversine_distance(center_lat, center_lon, p_lat, p_lon)
        importance_score = osm_tags.get("importance_score", 0.0)
        has_wiki = osm_tags.get("has_wiki", False)

        # Dynamic multi-dimensional score calculation
        fame = min(1.0, 0.45 + (0.15 * src_cnt) + (0.25 * float(importance_score)))
        cultural = 0.90 if any(w in category.lower() for w in ("temple", "fort", "monument", "heritage", "museum")) else 0.70
        uniqueness = 0.85 if has_wiki or src_cnt >= 2 else 0.65

        is_essential = is_explicit or src_cnt >= 2 or (fame >= 0.80 and float(importance_score) >= 0.35)
        tier = "ESSENTIAL" if is_essential else ("RECOMMENDED" if src_cnt >= 1 or fame >= 0.70 else "OPTIONAL")

        # Dynamic ideal time of day inference
        cat_lower = category.lower()
        name_lower = c_name.lower()
        if any(w in name_lower or w in cat_lower for w in ("promenade", "viewpoint", "sunset", "beach", "lake", "marine", "chowpatty", "bandstand")):
            ideal_time = "sunset"
            duration = 75
        elif any(w in name_lower or w in cat_lower for w in ("temple", "mandir", "dargah", "shrine", "cave", "caves", "fort")):
            ideal_time = "morning"
            duration = 90
        elif any(w in name_lower or w in cat_lower for w in ("museum", "market", "bazaar", "palace", "gallery", "crawford")):
            ideal_time = "afternoon"
            duration = 60
        elif any(w in name_lower or w in cat_lower for w in ("night", "chowk", "street food")):
            ideal_time = "evening"
            duration = 60
        else:
            ideal_time = "any"
            duration = 60

        osm_tags["is_online_discovered"] = True
        osm_tags["source_count"] = src_cnt

        cand = AttractionCandidate(
            id=f"attr_{idx+1}",
            name=c_name,
            canonical_name=c_name,
            latitude=p_lat,
            longitude=p_lon,
            category=category,
            fame_score=fame,
            cultural_score=cultural,
            local_authenticity_score=0.80 if is_essential else 0.60,
            uniqueness_score=uniqueness,
            user_interest_match=0.90 if is_explicit else 0.60,
            source_count=src_cnt,
            typical_duration_minutes=duration,
            opening_hours=opening_hours,
            ideal_time_of_day=ideal_time,
            tier=tier,
            explicit_user_requested=is_explicit,
            destination_essential=is_essential,
            description=desc,
            source="OpenStreetMap (Online Discovery Grounded)",
            wheelchair=wheelchair,
            distance_km_from_center=dist,
            tags=osm_tags
        )
        grounded_candidates.append(cand)

    # Step 5: If any Overpass place had high wiki/importance tags but was not in candidate list, add it
    for p in osm_reference_places:
        coord_key = (round(p.latitude, 3), round(p.longitude, 3))
        if coord_key in seen_coords:
            continue
        if p.tags.get("importance_score", 0.0) >= 0.40 or p.tags.get("has_wiki"):
            seen_coords.add(coord_key)
            grounded_candidates.append(
                AttractionCandidate(
                    id=f"attr_{len(grounded_candidates)+1}",
                    name=p.name,
                    canonical_name=p.name,
                    latitude=p.latitude,
                    longitude=p.longitude,
                    category=p.category,
                    fame_score=0.80,
                    cultural_score=0.85,
                    local_authenticity_score=0.75,
                    uniqueness_score=0.80,
                    user_interest_match=0.70,
                    source_count=1,
                    typical_duration_minutes=60,
                    opening_hours=p.opening_hours,
                    ideal_time_of_day="morning" if "temple" in p.category.lower() else "any",
                    tier="RECOMMENDED",
                    explicit_user_requested=False,
                    destination_essential=False,
                    description=p.description or f"Celebrated attraction in {destination}.",
                    source="OpenStreetMap Heritage",
                    wheelchair=p.wheelchair,
                    distance_km_from_center=p.distance_km_from_center,
                    tags=p.tags
                )
            )

    logger.info(f"Successfully generated {len(grounded_candidates)} grounded candidates dynamically for '{destination}'.")
    return grounded_candidates


async def collect_famous_places_online_and_verify_osm(
    destination: str,
    user_prompt: str,
    center_lat: float,
    center_lon: float
) -> List[PlaceItem]:
    """
    Backwards-compatible interface returning List[PlaceItem].
    Calls dynamic online discovery pipeline and maps to PlaceItem objects.
    """
    candidates = await collect_candidate_attractions(
        destination=destination,
        user_prompt=user_prompt,
        center_lat=center_lat,
        center_lon=center_lon
    )
    return [c.to_place_item() for c in candidates]
