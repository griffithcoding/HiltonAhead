# Lead-Gen Play — Hilton Head Vacation Rental Managers

**Date:** 2026-06-02
**Owner:** William Griffith
**Model:** Sell local property managers **flat featured-placement advertising** on hiltonahead.com. **You're a local media company, not a rental broker.**
**Status:** Build the asset now; monetize as traffic grows. Not this-quarter cash.

---

## ⚠️ Legal structure (non-negotiable — confirm with a SC real-estate attorney)

SC real-estate law (§40-57) + RESPA: **brokers** may be paid referral fees; **property managers and unlicensed persons may not.** Renting real estate for a fee is licensed activity. SC REALTORS publicly warns against paying referral fees to unlicensed folks.

| Structure | Legal? | Why |
|---|---|---|
| **Flat featured-placement / sponsorship fee** (monthly, non-contingent) | ✅ **Use this** | It's advertising — the PM buys a placement, not a transaction. Same as Vrbo/Airbnb listings. |
| Per-lead / per-inquiry fee | ⚠️ Gray | Defensible as advertising if non-contingent, but real-estate-adjacent in SC. **Attorney sign-off required.** |
| Per-booking commission | ❌ Avoid | Contingent on a rental transaction → looks like brokering → license risk. |
| Per-referral fee | ❌ Avoid | SC flags referral fees to unlicensed persons as risky. |

**Rule: flat advertising only. Never tie the fee to a specific booking or referral.** Brand the placement "Featured Partner" / "Sponsored" (you already do affiliate disclosure — same pattern).

---

## Why this vertical works (when traffic comes)

- **PMs make MORE on a direct booking** than an OTA booking (no 15% Vrbo/Booking cut) → strong incentive to pay to capture direct-booking intent.
- You have the **adjacent content** (lodging + neighborhood pages) and the **buyer intent** (people choosing a villa).
- It reuses this session's build instead of starting from zero.

## The machine you already have (reuse, don't rebuild)

| Asset | Role in this play |
|---|---|
| **Villa Match Quiz** | The match/lead engine — quiz results surface the *featured* local manager (= ad placement) |
| **`directory_events` table + tracking** | Logs impressions/clicks per PM → your monthly **proof-of-value report** (the sales tool) |
| **`/local/vacation-rentals`** directory category | Featured-partner slots |
| **lodging + neighborhood pages** (`/hilton-head-oceanfront-villas`, `/hilton-head/[slug]`, etc.) | Ad inventory — "Featured villa manager for Sea Pines" etc. |
| **`/advertise`, `/local/get-featured`, business inquiry/claim pipeline** | Onboarding + billing entry point |
| **`/admin/directory` dashboard** | Per-PM stats to report + price against |
| **vacation-rentals hub** (already designed) | The content surface this monetization layers onto |

**Net new build is small:** a "Featured Villa Manager" placement slot (data-driven), wired to track via `directory_events`, surfaced on lodging pages + Villa Match results.

## Partners to seed (real HHI managers — verify current + outreach)

Palmetto Dunes Resort PM · Beach Properties of Hilton Head · The Vacation Company · Sunset Rentals · Island Time HHI · Vacation Homes of Hilton Head · Destination Vacation HHI · Sea Pines Resort rentals · Vacasa (HHI).

## Pricing ladder (all flat / advertising)

1. **Seed (now):** FREE featured placement for **2–3 PMs.** Goal = accumulate `directory_events` proof, not revenue.
2. **Convert (once proof exists):** flat **$100–$250/mo** featured placement (start low at low traffic; raise with proof). Premium for **exclusive-per-neighborhood**.
3. **Scale (as traffic grows):** raise flat fees, add neighborhood/category exclusives, multiple advertisers.
- **Never** per-booking or per-referral. Flat only.

## The proof mechanic (your edge)

Most directories can't prove value. You can: `directory_events` already logs clicks/UTM per business. Monthly: *"You received N profile views + M outbound clicks from hiltonahead.com — here's the data. Featured placement is $X/mo."* Data closes the sale and justifies raises.

---

## Phased rollout

### Phase 0 — Legal + setup (week 1)
- [ ] Confirm the **flat-advertising structure** with a SC real-estate attorney (cheap/free consult). Get the "advertising, not brokering/referral" read in writing.
- [ ] Draft a one-page **flat featured-placement agreement** (monthly, non-contingent, cancel-anytime).

### Phase 1 — Build the slot (reuses existing infra)
- [ ] `data/rentalManagers.ts` (or extend `localBusinesses.ts`) — featured PM partners + neighborhoods served.
- [ ] **Featured Villa Manager** component — surfaced on lodging + neighborhood pages and in **Villa Match Quiz results**.
- [ ] Wire clicks/impressions through `directory_events` (per-PM `businessId`) — reuse `trackDirectoryEvent` + `withDirectoryUtm`.
- [ ] Confirm `/admin/directory` shows per-PM stats (it aggregates `directory_events` already).

### Phase 2 — Seed + prove (weeks 2–8)
- [ ] Onboard 2–3 PMs FREE. Pitch: *"Featured placement in front of pre-trip travelers choosing a villa, free while I prove it out — you'll get the tracking data monthly."*
- [ ] Send monthly proof reports from `directory_events`.

### Phase 3 — Convert + grow (as traffic builds)
- [ ] Convert seeded PMs to flat monthly fees once the data justifies it.
- [ ] Add exclusivity tiers; expand to more neighborhoods.
- [ ] Every new lodging/neighborhood page = more ad inventory → compounds.

---

## Honest constraints
- **Traffic-gated.** Flat-ad value scales with audience; at 100 clicks/mo it's small. This is asset-building, not Q2 cash. Pair with a real traffic lever.
- **Legal gating.** Stay flat-advertising. The moment a fee touches a specific booking/referral, you're in §40-57 territory.
- **Don't cannibalize blindly.** You also run Vrbo/Booking affiliate on these pages. Decide per page: affiliate (OTA) vs featured-PM (direct). PMs may object to OTA links beside their placement — sort exclusivity in the agreement.

## Metrics
- # PMs seeded → # converted to paid
- `directory_events` per PM (views, outbound clicks) — the proof
- $ MRR from featured placements
- Inventory: # pages carrying a featured-PM slot

## First action
**Confirm the flat-advertising structure with a SC real-estate attorney**, then **build the Featured Villa Manager slot** (small — reuses Villa Match + `directory_events`) and **seed 2–3 PMs free.** Revenue follows traffic + proof.
