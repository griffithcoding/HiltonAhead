# Content Plan — hiltonahead.com
**Date:** April 24, 2026  
**Goal:** Page-1 rankings for high-volume Hilton Head travel queries  
**Horizon:** Q2–Q3 2026 (20 target pages over ~12 weeks)

> ⚠️ Volumes are estimates. KD = keyword difficulty (0–100 scale, estimated). Rank = estimated current position based on content inventory review (no GSC data confirmed). Opportunity score = demand × feasibility × business alignment.

---

## Strategy Overview

Hilton Ahead's winning lane is **opinionated local expert content that tourism boards can't write and OTAs won't bother to write.** The official VCB (hiltonheadisland.org) controls generic destination queries at DA 50+. You can't beat them head-on on "things to do hilton head" in the short term. 

**Beat them by going specific where they can't:**
- "Sea Pines is better for X type of traveler than Palmetto Dunes" (verdict content)
- "Here's which charter company to book and what you'll catch in May" (specific activity guides)
- "Here's the exact route from Charlotte and what to do on the way" (drive-market content)
- "Here's what to do with your dog on the island, including the beach leash rules by season" (niche planning content)

**Content type distribution for this plan:**
- 11 new blog posts (data/posts.ts)
- 4 new/strengthened trip-type landing pages (data/tripTypes.ts)
- 3 existing posts to optimize (no new page, just edits)
- 2 structural/schema fixes (no content, dev-only)

---

## Target Pages — Ordered by Opportunity Score

### Tier 1: Ship Now (highest opportunity, lowest competition, fastest to rank)

---

#### 1. Hilton Head Fishing Guide
**Slug:** `hilton-head-fishing-guide`  
**Target keyword:** "hilton head fishing" (est. 1,200–1,800/mo)  
**Secondary keywords:** hilton head fishing charters, inshore fishing hilton head, hilton head shark fishing, hilton head offshore fishing, best time to fish hilton head  
**KD:** ~20 (est.)  
**Current rank:** Not ranking (no page exists)  
**Intent:** Informational + Transactional (charter booking)  
**Competitor gap:** fishingbooker.com ranks here with booking-focused content; no editorial guide from any HHI travel site  
**Category:** Activities  
**Internal links TO this post:** Shelter Cove neighborhood page (marina anchor), things-to-do post, on-island concierge service page  
**Internal links FROM this post:** Shelter Cove neighborhood page, services page (concierge), 3-day itinerary  
**Schema additions:** HowTo (how to book a charter), FAQPage  
**CTA:** "We book charters as part of our concierge service" → `/itinerary`  

**Outline:**
- Intro: Hilton Head's fishing scene in one paragraph (specifics: Broad Creek, May River, Atlantic access)
- H2: Inshore fishing (redfish, flounder, sheepshead, trout — best in fall)
- H2: Offshore fishing (mahi, tuna, wahoo, king mackerel — best in summer)
- H2: Shark fishing (species, season May–Sep, what to expect)
- H2: Best months by target species (table format)
- H2: Charter companies worth booking (tier list: Shelter Cove Marina operators, Broad Creek)
- H2: What it costs (price table: 2hr inshore vs 4hr vs full-day offshore)
- H2: Fishing without a charter (where from the shore or kayak)
- FAQ block: Is a license required? Can kids fish? Best time of year?

**Publish order:** #1 (draft complete in this PR)

---

#### 2. Dog-Friendly Hilton Head Guide
**Slug:** `hilton-head-dog-friendly-guide`  
**Target keyword:** "hilton head dog friendly" (est. 800–1,200/mo)  
**Secondary keywords:** dog friendly hilton head beach, hilton head pet friendly rentals, hilton head dog park, can dogs go on hilton head beach  
**KD:** ~15 (est.)  
**Current rank:** Not ranking  
**Intent:** Planning (pre-trip)  
**Competitor gap:** Rental company filter pages and a thin tourism board page dominate; no actual guide  
**Category:** Activities  
**Internal links TO this post:** Family trip planner page, things-to-do post, Forest Beach neighborhood page (Coligny dog-friendly vibes)  
**Internal links FROM this post:** Forest Beach neighborhood page, Sea Pines neighborhood page (forest preserve trails), Shelter Cove (community park)  
**Schema additions:** FAQPage (beach rules), HowTo  
**CTA:** "We find pet-friendly villas with fenced yards" → `/itinerary`  

**Outline:**
- Intro: The verdict — HHI is legitimately dog-friendly with caveats
- H2: Beach rules (seasonal breakdown: Oct 1–Mar 31 = any time on-leash; Apr 1–Memorial Day = 10am–5pm leash; Memorial Day–Sep 30 = no dogs on beach during day → early morning/evening only)
- H2: Dog parks and off-leash areas (Chaplin Community Park, Sea Pines Forest Preserve trails, Shelter Cove Community Park)
- H2: Dog-friendly restaurants and bars (outdoor patios: The Salty Dog Cafe, Hudson's Seafood House, several Coligny Plaza spots)
- H2: Pet-friendly accommodation (what to look for in villa listings, typical pet fees, best neighborhoods for dogs)
- H2: Vet and emergency vet locations on the island
- H2: What to bring for your dog (tide chart, booties for hot pavement, fresh water)
- FAQ block

**Publish order:** #2 (draft complete in this PR)

---

#### 3. Hilton Head Weekend Getaway Guide (from Charlotte, Atlanta & Savannah)
**Slug:** `hilton-head-weekend-getaway`  
**Target keyword:** "hilton head weekend getaway" (est. 1,000–1,500/mo)  
**Secondary keywords:** charlotte to hilton head, atlanta to hilton head road trip, hilton head weekend trip, savannah and hilton head weekend, hilton head 2 day itinerary  
**KD:** ~20 (est.)  
**Current rank:** Not ranking  
**Intent:** Planning  
**Competitor gap:** Charlotte Magazine and Atlanta Magazine have 300-word articles; no comprehensive guide exists  
**Category:** Planning  
**Internal links TO this post:** 3-day itinerary post, services page  
**Internal links FROM this post:** 3-day itinerary post, best places to stay post, best restaurants post  
**Schema additions:** HowTo (how to plan the trip), FAQPage  
**CTA:** "Tell us your dates and we'll plan the rest" → `/itinerary`  

**Outline:**
- Intro: Why Hilton Head is the perfect long weekend (distance, pace, season agnosticism)
- H2: Getting there — Charlotte (4.5 hr route, I-26 to I-95 to US-278; Bluffton stop-off)
- H2: Getting there — Atlanta (4 hr route, I-75 to I-16 to I-95 to US-278; Savannah option)
- H2: Getting there — Savannah (45 min; best for a Savannah + HHI combo trip)
- H2: The perfect 2-night itinerary (Friday arrival → Saturday full day → Sunday morning departure)
- H2: The perfect 3-night itinerary (add golf morning, dolphin tour afternoon)
- H2: Where to stay for a weekend (recommendations: mid-island beats south-end for 2-night trips)
- H2: What to eat (three meals: casual Friday night, Saturday brunch + seafood dinner, Sunday coffee)
- FAQ block: Best time of year for a long weekend? Can you do HHI without a car?

**Publish order:** #3 (draft complete in this PR)

---

#### 4. Hilton Head Dolphin Tour Guide
**Slug:** `hilton-head-dolphin-tours`  
**Target keyword:** "hilton head dolphin tours" (est. 1,500–2,500/mo)  
**Secondary keywords:** best dolphin tour hilton head, hilton head dolphin watching, hilton head boat tours, dolphin cruise hilton head  
**KD:** ~25 (est.)  
**Current rank:** Not ranking  
**Intent:** Transactional  
**Competitor gap:** Tour operator pages and GetYourGuide dominate; editorial guide missing  
**Category:** Activities  
**Publish order:** #4 (next sprint)

**Outline:**
- Intro: Bottlenose dolphins in Calibogue Sound — what makes HHI special
- H2: Types of tours (catamaran sunset cruise vs. Zodiac zodiac vs. kayak)
- H2: Best operators (tier list with prices, boat size, kid-friendliness)
- H2: Best time of year (spring and fall best; summer crowds, winter is quiet but they're there)
- H2: What to bring + tips for spotting dolphins
- H2: Combining dolphin tour with other activities
- FAQ block

---

#### 5. Hilton Head Kayaking Guide  
**Slug:** `hilton-head-kayaking-guide`  
**Target keyword:** "hilton head kayaking" (est. 800–1,200/mo)  
**Secondary keywords:** kayaking hilton head, hilton head paddleboarding, hilton head bioluminescence kayaking, sea turtle kayak hilton head  
**KD:** ~18 (est.)  
**Current rank:** Not ranking  
**Intent:** Informational + Transactional  
**Competitor gap:** Kayak rental companies have thin content; editorial gap  
**Category:** Activities  
**Publish order:** #5 (next sprint)

**Outline:**
- H2: Where to kayak (Calibogue Sound, Broad Creek, Sea Pines lagoon, Shelter Cove)
- H2: Bioluminescence kayaking (seasonal, May–September, best guides)
- H2: Tour vs. rental (when each makes sense)
- H2: Best operators and prices
- FAQ block

---

### Tier 2: This Quarter (high-value, moderate effort)

---

#### 6. Harbour Town Guide
**Slug:** `harbour-town-hilton-head-guide`  
**Target keyword:** "harbour town hilton head" (est. 2,000–3,000/mo)  
**Secondary keywords:** harbour town marina, harbour town lighthouse, sea pines marina, harbour town restaurants, harbour town shopping  
**KD:** ~30 (est.)  
**Current rank:** Indirect coverage via Sea Pines post; not a standalone target  
**Intent:** Informational + navigational  
**Format:** Blog post with neighbourhood-style layout  
**Publish order:** #6

**Outline:**
- Intro: What Harbour Town actually is (a marina village within Sea Pines — not a neighborhood, a destination)
- H2: The lighthouse (visiting, climbing, views, kids)
- H2: Dining at Harbour Town (Quarterdeck, Crazy Crab, The Crazy Crab — specifics)
- H2: Shopping and galleries
- H2: Boating and watersports from the marina
- H2: RBC Heritage — why Harbour Town in April is special
- H2: Staying near Harbour Town (which villa buildings)
- FAQ: Is Harbour Town free? Parking? Best time to visit?

---

#### 7. What to Pack for Hilton Head
**Slug:** `what-to-pack-hilton-head`  
**Target keyword:** "what to pack for hilton head" (est. 400–600/mo)  
**KD:** ~8 (est.)  
**Current rank:** Not ranking  
**Intent:** Informational (pre-trip)  
**Format:** Lightweight blog post (600–800 words), listicle-friendly  
**Publish order:** #7  

**Outline:**
- Beach gear (reef-safe sunscreen specifically — HHI has rules), beach cart, umbrella
- Golf gear (if applicable)
- Clothing by season (spring = layers; summer = light linen; fall = light jacket evenings)
- Biking (no need to bring bike — rent; bring a helmet or not — rules are loose)
- What to leave home (overpacking warnings)
- Quick-reference packing list (table)

---

#### 8. Hilton Head in October
**Slug:** `hilton-head-in-october`  
**Target keyword:** "hilton head in october" (est. 800–1,200/mo)  
**Secondary keywords:** hilton head fall, hilton head october weather, visiting hilton head october  
**KD:** ~20 (est.)  
**Current rank:** Thin in best-time-to-visit post; not a standalone rank  
**Intent:** Informational (seasonal planning)  
**Format:** Medium blog post (1,000–1,200 words)  
**Publish order:** #8  

**Outline:**
- Weather in October (highs 70s–80s, lows 60s, very low rainfall)
- Why October is arguably the best month (beach space, no crowds, warm water, full restaurant/activity schedule)
- What's open vs. closed (most things still open; some tour operators slow down mid-October)
- Events in October (if any)
- Rates vs. summer (significant drop in villa prices)
- What to do specifically in October (fishing = bull redfish peak season; biking without heat; beach without crowds)
- 3-day October itinerary

---

#### 9. Hilton Head vs. Outer Banks Comparison
**Slug:** `hilton-head-vs-outer-banks`  
**Target keyword:** "hilton head vs outer banks" (est. 1,500–2,000/mo)  
**KD:** ~25 (est.)  
**Current rank:** Not ranking  
**Intent:** Informational (comparison/decision)  
**Format:** Comparison post, same structure as Hilton Head vs. Myrtle Beach  
**Publish order:** #9  

**Outline:**
- Quick verdict table (weather, golf, families, nightlife, price, vibe)
- H2: The case for Hilton Head
- H2: The case for Outer Banks
- H2: Families — which wins (both strong, different reasons)
- H2: Golfers — clear HHI win
- H2: Budget travelers — OBX edges it
- H2: Couples — depends on vibe
- Verdict paragraph

---

#### 10. Budget Hilton Head Vacation Guide
**Slug:** `hilton-head-on-a-budget`  
**Target keyword:** "budget hilton head vacation" (est. 600–900/mo)  
**KD:** ~15 (est.)  
**Current rank:** Not ranking  
**Intent:** Informational  
**Format:** Blog post with pricing tables  
**Publish order:** #10  

**Outline:**
- Intro: HHI has a reputation as expensive — it doesn't have to be
- H2: When to go to save money (September, January–February, non-holiday weeks)
- H2: Where to stay on a budget (Forest Beach neighborhood, weekly villa vs. nightly hotel math)
- H2: Free activities (biking trails, beaches, Sea Pines Forest Preserve, Pinckney Island NWR)
- H2: Affordable dining (table: Coligny Beach spots, grocery-cooking in villas)
- H2: Budget itinerary (3 days, under $500/person including accommodation)
- Pricing reference table (weekly villa rental by season)

---

### Tier 3: Next Quarter (strategic, higher effort)

---

#### 11. Hilton Head Anniversary / Couples Activities
**Slug:** `hilton-head-couples-activities`  
**Target keyword:** "hilton head couples activities" (est. 600–900/mo)  
**Secondary keywords:** hilton head anniversary trip, romantic things to do hilton head  
**KD:** ~18 (est.)  
**Note:** Distinct from honeymoon content (not newlyweds; established couples, milestone anniversaries)  
**Publish order:** #11  

---

#### 12. Getting to Hilton Head Island (Transportation Guide)
**Slug:** `getting-to-hilton-head`  
**Target keyword:** "getting to hilton head island" (est. 600–900/mo)  
**Secondary keywords:** hilton head airport, savannah to hilton head, closest airport hilton head  
**KD:** ~15 (est.)  
**Publish order:** #12  

---

#### 13. Hilton Head Corporate Retreat / Group Travel
**Slug:** Trip-type page — `/hilton-head-corporate-retreats`  
**Target keyword:** "hilton head corporate retreat" (est. 200–400/mo)  
**Secondary keywords:** hilton head group events, hilton head team retreat, hilton head meeting venues  
**KD:** ~10 (est.)  
**Note:** Low volume but high LTV; aligns with Group & Family Trips service  
**Publish order:** #13  

---

#### 14. Hilton Head Snowbirds Guide (strengthen Batch E work)
**Slug:** `hilton-head-snowbirds`  
**Target keyword:** "hilton head snowbirds" / "hilton head winter rental" (est. 300–500/mo each)  
**KD:** ~12 (est.)  
**Note:** Batch E added content — needs a full dedicated post, not just a section  
**Publish order:** #14  

---

#### 15. Bluffton SC Guide (expand existing Bluffton trip-type page)
**Slug:** `/bluffton-travel-planner` (exists) → expand significantly  
**Target keyword:** "bluffton sc things to do" (est. 800–1,200/mo)  
**KD:** ~20 (est.)  
**Note:** Page exists but is likely thin vs. dedicated travel guides; expand to 1,200+ words  
**Publish order:** #15  

---

### Pages to Optimize (No New Content, Just Edits)

| Page | Current issue | Fix | Effort |
|------|--------------|-----|--------|
| `best-time-to-visit-hilton-head` | H2 structure doesn't match "hilton head in [month]" queries | Add month-specific H2s: "Hilton Head in October," "Visiting Hilton Head in April" etc. | 1 hr |
| `hilton-head-vs-myrtle-beach` | Missing comparison schema; thin on price table | Add ItemList schema; add price comparison table (villa cost, activity cost, restaurants) | 1.5 hrs |
| `hilton-head-3-day-itinerary` | No HowTo schema; intro doesn't target "hilton head 3 day itinerary" in first 100 words | Add HowTo schema; rewrite first paragraph | 30 min |

---

## Publish Order & Calendar

| # | Title | Slug | Sprint | Est. Hours |
|---|-------|------|--------|-----------|
| 1 | Hilton Head Fishing Guide | `hilton-head-fishing-guide` | Now (in PR) | 4 |
| 2 | Dog-Friendly Hilton Head Guide | `hilton-head-dog-friendly-guide` | Now (in PR) | 3 |
| 3 | Hilton Head Weekend Getaway | `hilton-head-weekend-getaway` | Now (in PR) | 4 |
| 4 | Dolphin Tour Guide | `hilton-head-dolphin-tours` | Week 2 | 3 |
| 5 | Kayaking Guide | `hilton-head-kayaking-guide` | Week 2 | 2.5 |
| 6 | Harbour Town Guide | `harbour-town-hilton-head-guide` | Week 3 | 4 |
| 7 | What to Pack | `what-to-pack-hilton-head` | Week 3 | 1.5 |
| 8 | Hilton Head in October | `hilton-head-in-october` | Week 4 | 2.5 |
| 9 | HH vs. Outer Banks | `hilton-head-vs-outer-banks` | Week 5 | 4 |
| 10 | Budget Guide | `hilton-head-on-a-budget` | Week 6 | 3 |
| 11 | Couples Activities | `hilton-head-couples-activities` | Week 7 | 3 |
| 12 | Getting to HHI | `getting-to-hilton-head` | Week 8 | 2 |
| 13 | Corporate Retreats (trip-type page) | `/hilton-head-corporate-retreats` | Week 9 | 2 |
| 14 | Snowbirds Guide | `hilton-head-snowbirds` | Week 10 | 3 |
| 15 | Bluffton Expansion | `/bluffton-travel-planner` | Week 10 | 2 |

---

## Internal Link Architecture

### New links to add when publishing each post

| New post | Links FROM | Links TO |
|----------|-----------|---------|
| Fishing guide | Shelter Cove page, things-to-do post | Shelter Cove page, services (concierge), 3-day itinerary |
| Dog-friendly guide | Family trip planner page, Forest Beach page | Forest Beach page, Sea Pines page (forest preserve), Shelter Cove page |
| Weekend getaway | Services page | 3-day itinerary, best places to stay, best restaurants |
| Dolphin tours | Things-to-do post, family trip planner | 3-day itinerary, Shelter Cove page (marina) |
| Kayaking | Things-to-do post, Shelter Cove page | Shelter Cove page (lagoon kayaking), bioluminescence note in winter guide |
| Harbour Town | Sea Pines neighborhood page, golf packages page | Sea Pines post, RBC Heritage post, romantic restaurants post |
| What to pack | Best-time-to-visit post, 3-day itinerary | Best-time-to-visit, getting-to-HHI (when published) |

### Silo structure (existing + planned)

```
Homepage
├── /services → anchor: all content bottom CTAs
├── /itinerary → anchor: all "book now" / "plan my trip" CTAs
│
├── NEIGHBORHOODS CLUSTER
│   ├── /hilton-head/sea-pines
│   │   └── → /blog/sea-pines-guide
│   │   └── → /hilton-head-golf-packages
│   │   └── → [harbour-town guide when published]
│   ├── /hilton-head/palmetto-dunes
│   │   └── → /blog/palmetto-dunes-guide
│   ├── /hilton-head/forest-beach
│   │   └── → /blog/forest-beach-guide
│   │   └── → [dog-friendly guide]
│   └── /hilton-head/shelter-cove
│       └── → /blog/shelter-cove-guide
│       └── → [fishing guide]
│       └── → [dolphin tours]
│
├── ACTIVITIES CLUSTER (gap to fill)
│   ├── /blog/hilton-head-things-to-do-ranked-2026 (pillar)
│   │   └── → [fishing guide]
│   │   └── → [dolphin tours]
│   │   └── → [kayaking guide]
│   ├── [fishing guide] ←→ Shelter Cove
│   ├── [dolphin tours] ←→ Shelter Cove
│   └── [kayaking guide] ←→ Shelter Cove + Sea Pines lagoon
│
├── PLANNING CLUSTER
│   ├── /blog/hilton-head-3-day-itinerary (pillar)
│   ├── /blog/hilton-head-7-day-itinerary
│   ├── [weekend getaway] → 3-day itinerary
│   ├── [what to pack] → best-time-to-visit
│   └── [getting to HHI]
│
├── GOLF CLUSTER
│   ├── /hilton-head-golf-packages (pillar)
│   ├── /blog/hilton-head-golf-trip
│   ├── /blog/hilton-head-golf-courses-ranked
│   └── [harbour town guide] → golf packages
│
└── ROMANTIC TRAVEL CLUSTER
    ├── /hilton-head-honeymoon (pillar)
    ├── /blog/hilton-head-romantic-restaurants
    └── [couples activities] (planned)
```

---

## Meta Title & Description Recommendations

### Posts with confirmed on-page issues (rewrite first)

| Page | Current title | Recommended title | Recommended meta description |
|------|-------------|-------------------|------------------------------|
| `best-time-to-visit-hilton-head` | "Best Time to Visit Hilton Head Island" | "Best Time to Visit Hilton Head Island (Month-by-Month Guide)" | "When should you go? We break down every month: crowds, prices, weather, and which activities are in peak season. No fluff — just the honest month-by-month guide." |
| `hilton-head-vs-myrtle-beach` | "Hilton Head vs Myrtle Beach" | "Hilton Head vs. Myrtle Beach: An Honest Comparison (2026)" | "We've spent real time in both. Here's the verdict on beaches, golf, families, cost, and nightlife — so you can stop second-guessing and book." |
| `hilton-head-3-day-itinerary` | "Hilton Head 3-Day Itinerary" | "The Best Hilton Head 3-Day Itinerary (Locals' Version, 2026)" | "Three days on Hilton Head done right: where to stay, what to eat, which tee time to book, and what most visitors miss. Built by people who live here." |

---

*Volumes estimated from web research. Actual difficulty and ranking data requires GSC + Ahrefs/SEMrush connection.*
