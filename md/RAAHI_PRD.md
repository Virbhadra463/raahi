# RAAHI
### Tourism · Product Requirements Document · Prototype V1

> **"हर गली एक कहानी है" — Every lane has a story**

A gamified travel companion for India, painted in the colours of a highway dhaba signboard and a grandmother's carpet — turning tourists into *raahi* (राही, "travellers on the path") who explore real streets, meet real people, and put real money into the local economy.

**Tags:** Quest-driven travel · Local-first economy · Crowd & footfall balancing · Scroll-native storytelling

**Core loop:** `Play → Explore → Discover → Spend Locally → Earn → Continue`

*Concept adapted from the "Destination Quest" tourism note · v1.0 · Basic Prototype Scope*

---

## 01 · Brand & Vision

### The Idea, in One Line

RAAHI is not a tourism app that added a game. It's a game *painted onto* a real trip — using signboard-bright visuals, hand-painted typography and street-level storytelling to pull tourists off the "top-10 checklist" and into the actual texture of a place: its bazaars, its artisans, its dhabas, its back lanes.

The name comes from **राही (raahi)** — Hindi/Urdu for "wayfarer" or "one who walks the path." It sets the emotional register for the whole product: not a tourist ticking boxes, but a traveller earning a story.

### Why This Visual Identity

**The rug (background system)**
- Deep red/maroon Persian-carpet motif used as the base atmosphere of the site — evokes a dhaba, a haveli courtyard, a home.
- Used full-bleed on hero/landing sections and as a texture accent on section dividers — never behind long text blocks, to protect readability.
- Paired with a navy-ink overlay so content "floats" above it like a painted signboard at night.

**The signboard wordmark**
- RAAHI is set in a thick, hand-painted slab style — pink/coral fill, navy outline, soft drop shadow — echoing hand-painted Bollywood-era shop and movie signboards.
- This treatment is reserved for the logo and hero headlines only; body copy uses a clean grotesque (Poppins) so the product still reads as usable software, not just a poster.

> **Design principle:** nostalgic, hand-painted *surface*; modern, fast, frictionless *product*. The rug and the signboard font create warmth and place; the actual UI underneath stays clean so quests are easy to read and act on.

### Core Loop

```
PLAY → EXPLORE → DISCOVER → SPEND LOCALLY → EARN → CONTINUE
```

---

## 02 · Problem

### What's Actually Broken Today

**Tourists**
- Default to the same famous, top-rated spots everyone else visits
- Never discover the hidden / locally authentic side of a place
- Trips collapse into "visit → photo → leave"
- Planning means hopping across five different apps and blogs
- No itinerary adapts to crowding, weather or real-time conditions

**Local businesses & artisans**
- Little to no marketing budget or digital presence
- Genuinely good shops stay invisible to tourists walking right past them
- Demand is unpredictable, day to day

**Hotels & homestays**
- Reduced to "a place to sleep," with no natural hook into local experiences
- Need more direct bookings, longer stays, better guest engagement

**Local transport**
- Waits on unpredictable tourist movement instead of knowing where demand is
- Never integrated into the itinerary itself

**Tourism boards**
- Footfall concentrates on a handful of famous sites → overcrowding, traffic, strain
- Revenue distributes unevenly; nearby areas see almost none of it

> **The pattern underneath all five problems:** everyone — tourist, shopkeeper, hotel, driver, and city — is operating on incomplete, undistributed information about where interest and footfall actually are. RAAHI's job is to route both.

---

## 03 · Solution

### RAAHI Quests — From Checklist to Journey

Instead of a static "Top 10 places" list, RAAHI builds each traveller a personal, story-driven quest line — and every completed quest quietly redistributes footfall, spend and attention across five stakeholder groups at once.

| Stakeholder | What they get from RAAHI |
|---|---|
| Tourist ("Raahi") | A personalised, surprising, low-effort trip that feels like a story, not a spreadsheet |
| Local businesses | Real footfall, visibility, and measurable demand from tourists already nearby |
| Hotels / homestays | Higher engagement, longer stays, and a natural bridge into local experiences via "Quest Hubs" |
| Local transport | Predictable, forecastable demand instead of waiting on luck |
| Tourism boards | Live crowd data and destination-level intelligence to manage overcrowding |

### The Quest Loop

1. **Pick your vibe** — Fun & Chill, Adventure, Culture & History, Foodie, Nature, Photography, Family, Budget Explorer, Learn & Explore. Multi-select — e.g. "Culture + Food + Photography."
2. **Get a story-driven quest line** — not a flat itinerary, but a sequence: a landmark at 10am, a local breakfast at noon, an artisan meeting at 2pm, a hidden viewpoint at 4pm, a sunset ritual at 6pm.
3. **Accept a quest** — e.g. "Find the 100-year-old haveli hidden behind the spice market," worth Raahi Credits.
4. **Follow narrative clues** — turn-by-turn navigation wrapped in storytelling ("look for the red-roofed building beside the old bazaar") instead of a flat pin-drop.
5. **Do the real-world action** — discover a hidden spot, try local food, learn a story and answer a question, support a local business, or explore an under-visited attraction.
6. **Verify & earn** — QR scan, merchant confirmation, GPS check-in, or photo verification; credits + progress unlock instantly, and the next nearby quest appears.

### Dynamic Quests — The Crowd-Control Engine

| Without RAAHI | With RAAHI |
|---|---|
| Tourist arrives at a landmark, finds it overcrowded | System detects crowding in real time |
| Waits in a queue, or leaves disappointed | Surfaces higher-reward quests nearby — a hidden trail, a village walk, an artisan lane |
| Same problem repeats tomorrow; nearby shops see zero footfall | Tourists follow the incentive, not a warning label — crowd disperses on its own |

> Crowding → dynamic reward → redistribution → more local footfall. This is the mechanism, not decoration — it's the same demand-balancing logic from the underlying tourism concept note, wired directly into the reward engine.

---

## 04 · Design Language

### Visual & Motion System

**Palette**

*Primary*
- Carpet Maroon — `#7A1026`
- Signboard Navy — `#1C1440`
- Marigold Gold — `#FFD38A`

*Accent*
- Signboard Pink — `#FF7A8D`
- Parchment Cream — `#FDF3EA`
- Terracotta — `#C98A2E`

**Typography**
- **Display / wordmark / hero headlines:** hand-painted slab (Alfa Slab One or equivalent), pink fill with navy outline & soft shadow — reserved for the RAAHI logo and big moments (hero line, level-up moments, quest-complete banners).
- **Section headers / quest cards:** a rounded, friendly bold display (Baloo) — playful without tipping into "kids' app."
- **Body / UI / forms:** Poppins — clean and highly legible on both the rug background and plain cards.
- **Handwritten accents:** a marker-style script (Kalam) for "diary" captions on polaroids and quest notes — reinforces the scrapbook feeling.

**Imagery direction**
- Hero and section backgrounds: the red carpet/rug motif, used full-bleed with a dark gradient overlay for text contrast — never diluted into generic stock texture.
- Hero illustrated ambient-motion market scene (bazaar stall, pottery, cycle-rickshaw, cat, brass pots) as a short looping video — see Section 5 for exact placement.
- Scroll-triggered hanging polaroid strip of Indian culture shots — temples, street food, festivals, handicrafts, transport — pinned to a string with a clothes-peg, swinging slightly on scroll.
- Quest-card thumbnails and location photography should favour warm, golden-hour, slightly grainy tones to match the rug/signboard palette rather than cool corporate photography.

*Reference frame from the supplied ambient market-motion clip — used as the partial-height hero video on the landing page (see Section 5).*

---

## 05 · Landing Page Spec

### The First Screen

**Layout, top to bottom**

| Zone | Spec |
|---|---|
| Nav bar | Transparent over rug background; RAAHI wordmark (small) left, "Start My Journey" pill button right. |
| Hero | Full-bleed dark rug background. Left: eyebrow + headline in signboard font ("Har Gali Ek Kahani Hai") + one-line subhead + CTA. Right / lower-half: the ambient market video plays inside a contained frame — roughly 55–65% of viewport width, ~45% of viewport height — not full-bleed, so it reads as a "window into the street" rather than a background wash. Rounded corners, thin navy border, subtle drop shadow so it feels like a painted frame hung on the rug. |
| Prompt strip | "What kind of story do you want to create?" — single input / vibe-picker teaser, echoing Section 4 of the quest flow. |
| Scroll section 1 — Polaroid clothesline | A horizontal "string" (SVG line) crosses the section; 5–7 polaroid photos of Indian culture (temple, dhaba, rickshaw, festival colour, handicraft) are clipped to it with tiny peg icons. As the user scrolls into view, each polaroid animates in with a slight rotation + drop, as if just pinned up, staggered ~100ms apart. |
| Scroll section 2 — Problem → Solution | Short, punchy restatement of Section 2/3 above, two or three cards. |
| Scroll section 3 — How a quest works | 4-step horizontal or stacked flow (Accept → Follow clues → Do the thing → Earn & unlock next) with light iconography. |
| Stakeholder strip | Five small cards — Tourist / Business / Hotel / Transport / Tourism board — each one line of value. |
| Footer CTA | Rug background returns; wordmark large, "Start My Journey" repeated, social/contact. |

> **Motion principle:** the rug is the only element that's ever "loud." Everything the user actually interacts with (buttons, quest cards, forms) sits on clean cream or white panels above it — so the page feels rich and cultural without becoming hard to read or slow to use.

---

## 06 · Prototype Scope

### What's In the Basic Prototype (v1)

**In scope**

**Build**
- Landing page: hero with framed video, polaroid scroll section, problem/solution, quest-flow explainer, stakeholder strip, footer
- "Plan your trip" form (destination, duration, party, vibe multi-select) — static/mock destinations (start with 1–2, e.g. Jaipur / Shimla)
- Mock quest feed: 4–6 sample quests with clue text, reward credits, a "complete quest" button (mock verification)
- Simple progress state: credits earned, quests completed, a level label — kept in local component state, no auth required
- Responsive down to mobile (single-column, video hero shrinks but stays "framed," not full-bleed)

**Not in v1**
- Real GPS/QR verification, payments, or live business dashboards
- Login/auth, backend, or persisted user accounts
- Tourism-board live dashboard (mock a single static screenshot/section instead)
- Real destination data beyond the 1–2 seeded demo cities
- Dynamic crowd-detection logic — can be simulated with a toggle ("simulate crowding") for the demo

### Success Criteria for the Prototype

- A reviewer can land on the page, understand the concept in under 10 seconds from the hero alone
- Scrolling feels alive (polaroid reveal, section transitions) without feeling gimmicky or slow
- The quest loop (accept → clue → complete → reward → next quest) is demoable end-to-end with mock data
- Visual identity is unmistakably distinct from generic travel-app templates

> **Next:** Pair this PRD with the RAAHI Antigravity build prompt to scaffold the working prototype.

---

*RAAHI · Confidential Concept Document · Prepared September 2026*
