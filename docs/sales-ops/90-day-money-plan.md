# Hilton Ahead — 90-Day Money Plan (cash this quarter, traffic-independent)

**Date:** 2026-06-02
**Owner:** William Griffith
**Goal:** $15–40k this quarter **without** waiting on SEO/traffic.
**Supersedes:** the Fora travel-agent route (~$12.6k/yr, hour-bound) — set aside.

---

## The reframe (why this plan, not more monetization)

Organic search = **~100 clicks/month (GSC).** At that volume, monetization is NOT the bottleneck — **demand is.** Every volume play (directory ads, affiliate scaling, Fora booking commission) is blocked until traffic moves, which is a 6–18 month game.

**Your scarce asset right now is William, not the website** — a 30-year local with authority + a network. So the money this quarter comes from **high-ticket, low-volume deals sourced through outbound + relationships**, where you only need a *handful* of conversions. The relocation/villa pages already exist — they're the *credibility close* when an outbound prospect googles you, not a traffic funnel.

---

## The 3-play stack

### 🐋 PLAY 1 — Real estate referral (the whale) → **Q3 cash, gated behind a license**
**Economics:** HHI homes $1M–$5M. Broker-to-broker referral = **25% of the buy-side commission.** One $1.5M closing → ~$37.5k commission → **~$9.4k to you.** 2–3/year = $20–30k.

**⚠️ LEGAL VERDICT (researched — see [`real-estate-referral-legal-SC.md`](./real-estate-referral-legal-SC.md)):** An **unlicensed** person **cannot** legally collect a per-closing real-estate referral fee in SC. Blocked by **SC Code §40-57-710** *and* **federal RESPA** (which overrides). Do NOT accept an unlicensed per-closing fee even if offered — it's the brokerage's license and your liability.

**The fix (Path A):** get a **SC referral license** → park it at a referral brokerage (e.g. ReferSC.com ~$45/yr) → referral fees become fully legal.
- Cost ~**$500–800** all-in (90hr course + exam + license); one closing pays it back ~12×.
- Timeline **4–10 weeks** to licensed → this is **Q3 cash, not this quarter.**

**This-quarter action:** **enroll in the SC pre-licensing course NOW** (online self-paced) so closings land in Q3. Then the brokerage call (legal framing in script below). Do not wait on traffic — start the license clock.

**Call targets (once you're licensing):** Charter One Realty · Collins Group Realty · Sea Pines Real Estate · Dunes Real Estate · Engel & Völkers Hilton Head · Daniel Ravenel Sotheby's.

### 💵 PLAY 2 — Concierge planning fee (cash now)
**Economics:** charge a **$500–$1,500 planning fee** per trip. Higher margin than any commission; charged regardless of where they book. **Stripe is already wired** (`/api/checkout` → `purchases`).

Suggested tiers:
| Tier | Fee | What they get |
|---|---|---|
| Trip Blueprint | $500 | Custom day-by-day itinerary + reservations list, delivered |
| Done-For-You Week | $1,000 | Blueprint + we make the bookings/reservations on your behalf |
| White-Glove | $1,500+ | Above + on-island concierge during the stay |

**Kill-switch:** will people pay for what felt free? **Cheapest test:** quote the fee to the **next 3 inbound trip leads.** Costs nothing. Possible cash this month.

### 📣 PLAY 3 — Warm outbound (the engine that feeds 1 & 2)
At 100 clicks/month, leads come from **you**, not Google. Use the existing `agent-sales` engine + your CEO/hospitality network.

**Cheapest test (week 1):** send **10 personal notes** to your network. Count replies = your real demand signal. Templates below.

---

## 90-day calendar

### Weeks 1–2 — Validate + set the license clock
- [ ] **Pull GA4 total sessions + `generate_lead` by `lead_type`** (sizes the pipeline).
- [ ] **Enroll in the SC real-estate pre-licensing course** (online self-paced) — starts the Q3 whale clock. ← do this now; it gates the biggest money
- [ ] **Define the 3 planning-fee tiers**; wire a Stripe payment link for each. ← this-quarter cash
- [ ] **Send 10 warm outbound notes** (network ask + relocation + trip-planning variants).
- [ ] (Optional) 15-min call with a SC real-estate attorney to confirm the referral-license structure.

### Weeks 3–6 — Run the plays
- [ ] Quote a planning fee to **every** inbound trip lead. Target: first paid fee.
- [ ] Convert outbound replies → 3–5 discovery calls (relocation, wedding, group, trip).
- [ ] Feed any relocation interest → brokerage partner (track each referral).
- [ ] Add a **soft relocation CTA** to `/move-to-hilton-head` + `/sell-or-rent-your-villa`: "Thinking of buying on HHI? I'll connect you with the right local agent and stay in your corner — free." (captures the few relocation visitors you do get.)

### Weeks 7–12 — Convert + compound
- [ ] Push referred buyers toward closings (real-estate timelines are 30–90d — referrals made early in the quarter can close inside it).
- [ ] Land 2–4 planning-fee trips.
- [ ] Open a **wedding / group-retreat** pipeline (longer cycle — start now, cash next quarter): 5 outbound to HHI wedding planners + 5 to corporate/golf-group organizers.
- [ ] Review what produced cash → double down next quarter.

---

## Scripts & templates

### Brokerage referral call (legal framing — once you're getting licensed)
> "Hi — I run Hilton Ahead, a Hilton Head travel + relocation consultancy, 30-year island resident. I talk to people relocating here before they have an agent. I'm getting my SC referral license and parking it at a referral brokerage so this is fully above-board. Once I'm licensed, would you take buyer referrals broker-to-broker at the standard 25%? And who on your team handles referral agreements?"

### Warm network note (the engine)
> "Hey [Name] — quick one. I've expanded Hilton Ahead beyond trip planning: I now help people **relocating to Hilton Head** get connected to the right agent + neighborhood, and I do **done-for-you trip planning** for big island vacations. If anyone in your world is moving to the Lowcountry or planning a major HHI trip, send them my way — I take great care of them. Who comes to mind?"

### Trip-planning fee pitch (to inbound leads)
> "Happy to plan this for you. The way it works: a [$500 Trip Blueprint / $1,000 Done-For-You] fee covers the custom itinerary, the reservations that book up weeks out, and my local picks you won't find online. Most clients say it pays for itself on the first dinner they'd otherwise have missed. Want me to start?"

### Relocation outbound (to feeder-metro movers)
> "Relocating to Hilton Head or Bluffton? Before you pick a neighborhood or an agent, talk to a 30-year local. I'll help you avoid the flood-zone streets, the wrong-side-of-278 commutes, and the HOA surprises — and connect you with the right agent. No cost to you."

---

## Kill-switch assumptions (test before scaling)
| Play | Riskiest assumption | Cheapest test |
|---|---|---|
| Real estate referral | SC allows unlicensed referral fees | One brokerage call (week 1) |
| Planning fee | People pay for previously-free advice | Quote next 3 inbound leads |
| Warm outbound | Your network holds high-ticket leads | 10 notes, count replies |

## Metrics (track weekly)
- Brokerage referral agreement signed? (Y/N)
- # relocation referrals sent → # under contract → # closed
- # planning fees sold + $ collected
- Outbound notes sent → replies → discovery calls → deals
- **This-quarter target: 1 referral closing + 3–4 planning fees + pipeline = $15–40k**

## Explicitly set aside (blocked on traffic — revisit when GA4 total > ~3k/mo)
- Directory / local advertising (needs audience to sell against)
- Affiliate scaling, Amazon volume
- Fora / travel-agent booking commission (linear, hour-bound)
- More SEO landing pages — *page count isn't the lever; authority + distribution is*

## Parallel background track (not this quarter's money, but start it)
Demand generation: backlinks/PR for domain authority + repurposing content into outbound/social. The site compounds while the network + outbound pays the bills now.
