# Spec: Ship the 9 Dormant Tools as Money Pages

**Date:** 2026-05-28
**Author:** William Griffith (with Claude Opus 4.8)
**Track:** #1 from [the monetization opportunity map](./2026-05-28-monetization-apps-brainstorm.md). Posture: **fastest cash this month.**
**Status:** Design — pending user review → `gsd-ultraplan-phase`.

---

## Goal

Deploy the 9 fully-built interactive tools in `components/tools/` (today wired only to `PostBody.tsx`, no exact-match landing pages) as **6 new standalone SEO money pages + 2 embeds**, each carrying lead capture (newsletter) + affiliate monetization + GEO (TL;DR/Speakable/FAQ schema). Maximize ranking surface; reuse 100% of existing infrastructure.

### Success criteria
1. Six new routes return 200 and render their tool: `/hilton-head-tides`, `/hilton-head-tee-times`, `/hilton-head-golf-courses`, `/hilton-head-stay-and-play`, `/hilton-head-hurricane-season`, `/best-time-to-visit-hilton-head`.
2. `LiveWeather` embedded on `/hilton-head-weather`; `HeritageCountdown` embedded on `/guides/2027-rbc-heritage`.
3. Every new page renders: a `.tldr-block`, ≥3-item FAQ with `getFaqSchema` + `getSpeakableSchema`, `AffiliateDisclosure`, ≥1 `AffiliateCard`, and a `NewsletterSignup`.
4. All 6 routes registered in `data/nav.ts`, `data/footerLinks.ts`, and `app/sitemap.ts`. Sitemap also gains the previously-missing `/itinerary-packs/[pack]`, `/move-to-hilton-head`, `/sell-or-rent-your-villa`.
5. `getWebSiteSchema()` emits `potentialAction` (SearchAction) again.
6. `npm run typecheck` + `npm run lint` clean. Async server tools (tides/weather/hurricane) render live data with graceful fallback.

### Out of scope (separate tracks in the opportunity map)
AI Trip-Planner Concierge (#6), dining/OpenTable monetization (#2), lodging aggregator pages (#4), relocation cluster (#7). The broad TL;DR rollout across 32 blog posts is deferred — this spec only adds TL;DR to the **new** pages.

---

## Verified ground truth (do not re-investigate)

- **All 9 tools are READY-TO-WIRE.** No missing API keys (NOAA/NWS public, keyless), no empty data, no TODOs. Data deps populated: `data/golfCourses.ts` (12 courses; fields `tier`, `access`, `peakFeeUsd`, `stayAndPlayFeeUsd`, `scenery`, `bookingUrl`, `mapPos`, `heritageVenue`, `slug`, `shortName`), `data/months.ts` (12 months, 30-yr NOAA), `app/lib/{tides,weather,hurricane}.ts`.
- **Tool types:** `TideForecast`, `LiveWeather`, `HurricaneStatus` = async server components (have fallbacks; `HurricaneStatus` renders null off-season). `TeeTimeFinder`, `CourseMatchQuiz`, `StayAndPlayEstimator`, `TripWindowFinder` = `'use client'`. `CourseMap`, `HeritageCountdown` = server (`HeritageCountdown` takes `variant: 'banner'|'inline'`, hardcoded 2027-04-12→18).
- **Page shell to clone:** `app/cost-of-hilton-head-trip/page.tsx`.
- **Reusable components:** `generatePageMetadata`, `getBreadcrumbSchema`, `getFaqSchema`, `getSpeakableSchema`, `getSportsActivityLocationSchema`, `getItemListSchema` (all in `app/lib/metadata.ts`); `SectionHead` (`components/ui/Ornament.tsx`); `Header`, `Footer`, `FinalCta` (`components/sections/`); `NewsletterSignup` (`components/NewsletterSignup.tsx` — props `{source, variant:'card'|'inline'|'compact', heading?, body?}`, POSTs `/api/newsletter`); `AffiliateCard` + `AffiliateDisclosure` (`components/affiliate/`); `withAffiliateParams(programId, deeplink?, placement?)` (`app/lib/affiliates.ts`).
- **Valid affiliate `programId`s:** booking, expedia, vrbo, viator, getyourguide, golfnow, amazon, marriott, allianz, hertz, petermillar.
- **Speakable contract:** page MUST render a real DOM node per selector. Use `.tldr-block` + `.faq-answer`.
- **No `/tools` hub exists** — pages live at top-level routes (matches site convention).

---

## Architecture

Each page is a **thin shell** (per CLAUDE.md convention) over a tool component + a per-page content module in `data/`. No new infra, no new deps, no new DB tables, no new API routes.

```
app/<route>/page.tsx        ← thin shell: metadata + schema + layout + composes tool
data/tools/<route>.ts       ← page copy: hero text, TL;DR string, FAQ[], affiliate card config
components/tools/<Tool>.tsx  ← EXISTING, unchanged (props already satisfied)
```

**Standard page shell (every new page):**
```
generatePageMetadata({ title, description, path, keywords })
JSON-LD: getBreadcrumbSchema + getFaqSchema + getSpeakableSchema([".tldr-block",".faq-answer"])
        (+ golf pages: getSportsActivityLocationSchema / getItemListSchema)
<Header/>
<SectionHead number eyebrow plain italic/>
<aside class="tldr-block"> … direct answer … </aside>   ← GEO
<TheTool/>                                                ← Suspense-wrapped if async server
<section> FAQ (each answer in .faq-answer) </section>
<AffiliateDisclosure variant="inline"/>
<AffiliateCard programId=… placement="<route>/<program>" …/>  (1–3)
<NewsletterSignup source="tool-page/<route>" variant="inline"/>
<FinalCta/><Footer/>
```

**Content-in-data rule:** hero copy, TL;DR text, and FAQ Q/A pairs live in `data/tools/<route>.ts`, not inline JSX.

---

## The pages

### Golf cluster (cross-linked; GolfNow live)

**P1 — `/hilton-head-tee-times`**
- Tool: `TeeTimeFinder`. Schema: Breadcrumb + FAQ + Speakable.
- Affiliate: `golfnow` cards (per-course `bookingUrl` from `data/golfCourses.ts`), placement `tee-times/golfnow`.
- Lead: `NewsletterSignup source="tool-page/tee-times"`.
- Keywords: "hilton head tee times", "book tee times hilton head", "hilton head golf tee times".
- Cross-link: golf-courses, stay-and-play, `/hilton-head-golf-packages`.

**P2 — `/hilton-head-golf-courses`**
- Tools: `CourseMap` + `CourseMatchQuiz`. Schema: Breadcrumb + FAQ + Speakable + `getItemListSchema` (course list) + `getSportsActivityLocationSchema` (per course).
- Affiliate: `golfnow`, placement `golf-courses/golfnow`.
- Keywords: "hilton head golf courses", "best golf courses hilton head", "which hilton head golf course".

**P3 — `/hilton-head-stay-and-play`**
- Tool: `StayAndPlayEstimator`. Schema: Breadcrumb + FAQ + Speakable.
- Affiliate: `booking` + `vrbo` (lodging) + `golfnow` (rounds), placement `stay-and-play/<program>`. Estimator already links to `/itinerary` → Charter upsell.
- Keywords: "hilton head stay and play", "hilton head golf package cost", "stay and play hilton head".
- Cross-link to `/hilton-head-golf-packages` (editorial offer page) — distinct "calculator" intent; add reciprocal link so they reinforce rather than compete.

### Weather / timing cluster (cross-linked)

**P4 — `/hilton-head-tides`**
- Tool: `TideForecast` (async server, Suspense + fallback). Schema: Breadcrumb + FAQ + Speakable.
- Affiliate: `allianz` ("lock a refundable stay around the tides") + `booking`/`vrbo`, placement `tides/<program>`.
- Lead: newsletter — this is peak "planning right now" intent.
- Keywords: "hilton head tides", "hilton head tide chart", "tide times hilton head".

**P5 — `/hilton-head-hurricane-season`**
- Tool: `HurricaneStatus` (async server; renders status in-season, evergreen guide copy off-season). Schema: Breadcrumb + FAQ + Speakable.
- Affiliate: **`allianz` travel insurance is the hero** (highest-fit category) + `booking` refundable rates, placement `hurricane-season/<program>`.
- Keywords: "hilton head hurricane season", "is hilton head safe hurricane season", "when is hurricane season hilton head".

**P6 — `/best-time-to-visit-hilton-head`**
- Tool: `TripWindowFinder`. Schema: Breadcrumb + FAQ + Speakable.
- Affiliate: `booking`/`vrbo` ("book the cheapest window") + `allianz`, placement `best-time/<program>`.
- Keywords: "best time to visit hilton head", "cheapest time hilton head", "when to visit hilton head".
- **Cross-link:** update the existing "best time to visit" blog post to link here; keep blog post as long-form, this page as the interactive tool + booking. Distinct canonical URLs, distinct intent.

### Embeds (no new routes)

**E1 — `LiveWeather`** → top of existing `/hilton-head-weather` (strengthens the weather hub; no competing "today" page → avoids self-cannibalization). Add Amazon seasonal-gear card + `allianz`.
**E2 — `HeritageCountdown`** → existing `/guides/2027-rbc-heritage` (`variant="banner"`).

---

## Folded-in cheap wins (promised regardless)

- **Sitemap completeness** (`app/sitemap.ts`): add the 6 new routes + `/itinerary-packs/[pack]` entries (the **$49 paid products, currently unindexed**) + `/move-to-hilton-head` + `/sell-or-rent-your-villa`. New money pages priority 0.85–0.9.
- **SearchAction** (`app/lib/metadata.ts`): re-add `potentialAction` to `getWebSiteSchema()` → `${siteUrl}/search?q={search_term_string}`. Update the now-stale comment in `CLAUDE.md`.

---

## Monetization summary

| Page | Primary affiliate | Secondary | Lead | Upsell |
|---|---|---|---|---|
| tee-times | golfnow | — | newsletter | — |
| golf-courses | golfnow | — | newsletter | — |
| stay-and-play | booking/vrbo | golfnow | — | /itinerary (Charter) |
| tides | allianz | booking/vrbo | newsletter | — |
| hurricane-season | **allianz** | booking | newsletter | — |
| best-time | booking/vrbo | allianz | newsletter | — |

Affiliate links pass through untracked if env IDs are unset (no breakage). FTC `rel="sponsored nofollow"` is enforced by the components; `AffiliateDisclosure` required on every page.

---

## Sequencing (fastest cash)

1. **Wave 1:** `/hilton-head-tides` + `/hilton-head-tee-times` (highest intent; GolfNow live). Ship + sitemap + SearchAction.
2. **Wave 2:** `/hilton-head-golf-courses` + `/hilton-head-stay-and-play` (complete golf cluster).
3. **Wave 3:** `/hilton-head-hurricane-season` + `/best-time-to-visit-hilton-head` + embeds E1/E2.

---

## Testing & verification

- `npm run typecheck` + `npm run lint` clean after each wave.
- Each new route: 200 + tool renders + `.tldr-block` and `.faq-answer` present (Speakable contract).
- Async server tools: verify live data renders and the fallback path renders when the upstream API is unreachable.
- Affiliate: with env IDs set, `AffiliateCard` href carries the tracking param / Partnerize `pubref` (`<route>/<program>`); with IDs unset, raw URL.
- Newsletter submit hits `/api/newsletter` and returns `{ok:true}`.
- Optional Playwright smoke spec (`tests/`) hitting the 6 routes.
- Browser verification via preview tools on at least tides + tee-times.

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Keyword cannibalization (stay-and-play vs golf-packages; best-time page vs blog post) | Distinct intents + reciprocal cross-links + correct canonicals. LiveWeather kept as embed, not a competing "/weather-today" page. |
| Thin pages from over-splitting | Each page pairs the tool with TL;DR + FAQ + affiliate context; golf-courses combines map + quiz to stay substantive. |
| Async tool live-data failure (NOAA/NWS down) | Existing graceful fallbacks; Suspense boundaries. |
| Affiliate IDs not yet approved | Links pass through untracked; no UX breakage. Track approval separately. |
| `HurricaneStatus` null off-season | Page wraps it with evergreen seasonal guide copy so the route is never empty. |

---

## Open assumptions (flag if wrong)
1. The existing "best time to visit" content is a blog post (not already a standalone money page).
2. `/hilton-head-golf-packages` is editorial/offer-style (so the stay-and-play *calculator* page is complementary, not duplicative).
3. Newsletter (`/api/newsletter`) is the desired lead-capture surface for these pages (vs. the itinerary form).
