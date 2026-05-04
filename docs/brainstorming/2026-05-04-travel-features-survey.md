# Travel-Site Feature Roadmap — Hilton Ahead

**Date:** 2026-05-04
**Goal:** Survey of best-in-class travel-site applications, ranked for fit on Hilton Ahead's flat-fee editorial-consultant brand. Bias: **conversion (browser → lead)**.

## Scoring lens

- **Conversion** — pulls visitor to itinerary form, Calendly call, or newsletter
- **Brand fit** — matches flat-fee, founder-voiced, local-expert identity (not OTA)
- **Effort** — solo Next.js dev hours, given existing stack (Supabase, Resend, Stripe, Calendly)

---

## TIER 1 — Build next (high conversion × low–medium effort × strong brand fit)

### 1. Villa / stay matchmaker quiz
**What:** 5-question quiz → top 3 villa picks, each with William's one-paragraph reasoning. CTA: "Get full availability for these 3" → /itinerary form pre-filled with the picks.
**Inputs:** party size, view priority, walk-to-beach, golf-on-property, budget band.
**Why it converts:** picking is fun (Plum Guide, Tinder mechanics); pre-fills lead form with strong intent signal; turns vague browsers into qualified leads in <90 sec.
**Conversion: H | Brand fit: H | Effort: L**
**Inspiration:** Plum Guide "Find your match", Hipcamp quiz, Mr & Mrs Smith Style Match.

### 2. Save-this-trip builder ("Trip Sketch")
**What:** Browse neighborhood / restaurant / activity cards on one page. Click a card to add it to "your sketch". "Save sketch" emails a branded PDF + creates a Supabase lead row.
**Why it converts:** turns passive browsing into a tangible artifact; email capture happens at "save", not at "form" — lower commitment than itinerary, higher than newsletter; the saved PDF is a re-engagement asset (drip emails).
**Conversion: H | Brand fit: H | Effort: M**
**Inspiration:** Roadtrippers planner, Wanderlog, Visit California Trip Planner.

### 3. AI itinerary draft → human-refined hand-off
**What:** Chat or short-form intake → Claude/GPT generates a 4-day draft → CTA: "Want William to perfect this for you?" sends draft + lead to /api/itinerary.
**Why it converts:** Layla, Mindtrip, Wonderplan are devouring travel SEO. You don't beat them on AI — you reposition: AI is the intern, founder is the judgment. Honest framing: "AI drafts. William perfects. Same flat fee."
**Conversion: H | Brand fit: M–H (depends entirely on framing) | Effort: M**
**Inspiration:** Layla.ai, Mindtrip — but flipped: their AI replaces humans, yours hands off TO a human.

### 4. Neighborhood comparator
**What:** Pick 2–3 neighborhoods → side-by-side table with founder ratings (walkability, beach, golf, family-fit, quietness, dining-walk) plus photo strip and one-line "best for".
**Why it converts:** "Sea Pines vs Palmetto Dunes" is the #1 question every Hilton Head trip starts with. Currently scattered across your /hilton-head/* pages — a direct comparator earns the long-tail SEO AND drops users at a CTA at the right moment.
**Conversion: M–H | Brand fit: H | Effort: L**
**Inspiration:** Wirecutter comparison tables, Plum Guide neighborhood compare.

### 5. Best-dates calendar heatmap
**What:** Pick trip type → calendar where each day is shaded green / yellow / red on weather + crowds + price patterns. Hover for "why this color". CTA: "Lock these dates in".
**Why it converts:** Hopper-style decision aid without the Hopper-style scumminess. Hilton Head is heavily seasonal (hurricane edge, golf shoulder, family summer) — this is genuinely useful, not gimmicky.
**Conversion: M–H | Brand fit: H | Effort: M**
**Inspiration:** Hopper "Watch a flight" calendar, Google Flights date grid.

---

## TIER 2 — Build after Tier 1 (medium impact or higher effort, still worth it)

### 6. Real-client itinerary archive (pseudonymized)
**What:** 8–12 real itineraries with names changed and dates fuzzed: "The Patel family, late March, 4 nights, $X total." Format: hour-by-hour timeline + "what they loved / what they'd skip." CTA per archive: "Want one like this?"
**Why:** trust-building beats testimonials — shows the WORK, not the praise.
**Conversion: M–H | Brand fit: H | Effort: M**
**Inspiration:** Indagare member trip reports, Original Travel case studies.

### 7. Cost-vs-DIY honesty calculator (upgrade existing TripCalculator)
**What:** Current calculator gives trip-cost band + your fee. Add: "DIY research time you'd spend: ~X hours" + "Likely $ saved on rate negotiation: ~$Y." Brutally honest — explicitly says "if your trip is under $5k, DIY usually wins on time."
**Why:** trust through honesty. Doubles down on the "flat fee, not commissions" angle.
**Conversion: M | Brand fit: H | Effort: L**
**Inspiration:** Wirecutter "is it worth it" framing.

### 8. Tide × sunset × tee-time planner
**What:** Pick a date in your trip → tide chart for the day, golden hour by location, suggested tee times, sunset-watching spot. SEO long-tail: "best low tide hilton head april", "sunset time sea pines".
**Why:** pure utility. Earns backlinks. Locks in "the local-knowledge site" reputation. Niche but ownable.
**Conversion: M (assist, not closer) | Brand fit: H | Effort: M**
**Inspiration:** TideForecast utility, but editorial.

### 9. Interactive island map with founder annotations
**What:** Mapbox/Leaflet map of Hilton Head + Bluffton + Daufuskie. Click a pin → William's voice note (audio + transcript): "Don't bother with X beach in summer — walk to Y instead, here's why."
**Why:** differentiating editorial showpiece. Audio is rare on travel sites. Insider voice IS your product.
**Conversion: M | Brand fit: H | Effort: H** (audio recording, transcripts, Mapbox tiles, mobile UX)
**Inspiration:** Atlas Obscura map UI, Resy city guides.

---

## TIER 3 — Skip or defer

| # | Feature | Why skip / defer |
|---|---------|------------------|
| 10 | Day-in-the-life scroll-driven simulator | High effort, lower conversion. Partly addressed by `/stories`. Defer. |
| 11 | Packing list generator | Tiny conversion lift. Roll up into matchmaker quiz output instead of a standalone tool. |
| 12 | Live restaurant / tee-time availability API peek | Glue maintenance hell — owners change platforms constantly. v2 only. |
| 13 | Mobile app | No. Web handles this fine at your scale. |
| 14 | UGC reviews | Wrong fit. You're the expert — reviews dilute. |
| 15 | Loyalty program | Premature. Revisit at 2,000+ customers. |

---

## Top-3 recommendation (build in this order)

1. **Villa matchmaker quiz** (Tier 1 #1) — fastest to ship, highest conversion-per-effort, generates clean lead-intent data.
2. **Trip Sketch builder** (Tier 1 #2) — sticky daily surface; lower-commitment lead capture than the form, builds an asset (PDF) for re-engagement.
3. **AI draft → human refine** (Tier 1 #3) — defensive moat against AI-itinerary startups eating your SEO; reframes AI as your intern, not your competitor.

After top 3 ships: re-evaluate against actual conversion data before picking from Tier 2.
