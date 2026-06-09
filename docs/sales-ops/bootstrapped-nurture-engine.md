# Bootstrapped Nurture Engine — No Calls, No SaaS

**Date:** 2026-06-09
**Decision owner:** William
**Companion docs:** `docs/seo/backlink-engine-v2.md` (authority), `docs/sales-ops/90-day-money-plan.md` (revenue), `docs/sales-ops/content-calendar/social-rolling/` (posts, already written)

---

## The actual question

"Do I need to buy Klaviyo/Mailchimp/HubSpot to nurture leads without phone calls?"

**No. You already built the automated email program you think you need to buy.** The repo contains a self-hosted sequence engine that SaaS vendors charge $300+/mo for:

| Capability | Where it already lives | State |
|---|---|---|
| Automated follow-up sequences (+5d/+10d) | `app/api/cron/lead-sequence-tick` + migration `024_lead_email_engine.sql` | **Live** for `itinerary_requests` + `leads` |
| Open/click/bounce pixel tracking | `lead_email_events`, `outreach_email_events` | Live |
| Reply detection + auto-stop | `lead-reply-poll` cron, `last_received_at` trigger | Live |
| Per-lead kill switch | `sequence_active` column | Live |
| Newsletter drafting | `newsletter-draft` cron + `/api/newsletter/decide` | Live |
| CAN-SPAM / HMAC unsubscribe | `lib/outreach/compliance.ts`, `newsletter/sign.ts` | Live |
| Sending | Resend (`app/lib/email.ts`) | Live |

**The one real hole** (documented in migration 024 itself): `newsletter_subscribers` is *intentionally excluded* — "no send model exists." You capture emails and then never email them. Hot leads get nurtured; the warm list rots. That's the gap, and it's ~2 dev days, not a SaaS contract.

**Resend economics (bootstrapped math):** free tier = 3,000 emails/mo, 100/day. Sequences are trickle sends — fine indefinitely. Newsletter blasts hit the 100/day wall at ~100 subscribers per issue-day; batch a 400-sub issue over 4 days, or pay Resend $20/mo at ~1,000+ subs. That $20 is the entire future tooling bill. Klaviyo at the same list size is $45–60/mo for features you've already built.

---

## Authority scorecard (seo-authority-playbook, 2026-06-09)

| Phase | Grade | State |
|---|---|---|
| 1 · Technical | **A-** | Titles, canonicals, 308 consolidation, sitemap, LLM robots allowlist — shipped (PRs #69/#70) |
| 2 · E-E-A-T / Entity | **C** | Person/Org schema shipped BUT `founder.ts` `sameAs: []` and all `brand.ts` socials are **empty strings** — the Knowledge Graph entity has zero external anchors. GBP unclaimed/unverified. |
| 3 · Content clusters | **A-** | Weather 12-pager, golf, neighborhoods, tools, tier lists; cannibalization fixed; per-page schema comprehensive |
| 4 · Backlinks | **D** | DR 0 (verified via Ahrefs). Engine built, v2 strategy committed (`cd91767`), **zero sends executed** |
| 5 · LLM / GEO | **B+** | llms.txt, TL;DR blocks, QuickFacts, Speakable, FAQ direct-answers — shipped. LLM referrer tracking: verify in GA4. |

The Phase 2 "C" and the social ask in this plan are **the same task**: claiming the social handles populates `sameAs`, which upgrades every schema block already shipped. One commit, two wins.

---

## The plan — three plays, ranked

### Play 1 — Wire the warm loop you already own (~2 dev days, $0/mo)

Build the missing send model for `newsletter_subscribers`, mirroring the proven `lead-sequence-tick` pattern:

1. **Migration `026`** (verified next free number): add `last_send_at`, `sequence_active`, `welcome_step` to `newsletter_subscribers`; create `newsletter_email_events` mirroring `lead_email_events`.
2. **Welcome sequence** — `newsletter-sequence-tick` cron, three steps:
   - **Day 0:** "The 5 pages locals actually use" (best-time guide, tide chart, tier lists, itinerary builder). Establish: this list is island intelligence, not promos.
   - **Day 4:** Seasonal pick (pull from `data/months.ts` for current month) + one QuickFact. Soft link to a tool.
   - **Day 12:** The $450 itinerary pitch, framed as "when you're ready" — single CTA to `/itinerary`. Sequence ends; subscriber rolls into the monthly newsletter.
3. **Monthly newsletter cadence** — the `newsletter-draft` cron already drafts; commit to **1 issue/month shipped** (decide-flow already exists). Batch sends to respect 100/day.
4. **Reuse, don't rebuild:** HMAC unsubscribe (`sign.ts`), pixel events (copy 024 pattern), `pickSenderAdminEmail`.

**No phone calls anywhere in this loop.** Replies land in the existing inbox (`lead-reply-poll` pattern); answer by email. Calendly link in signature for the few who *want* to talk — their choice, not a gate.

### Play 2 — Launch the social surface ($0, ~4 hrs/wk) — runbook, not advice

Everything needed already exists in-repo. The decisions are made; this is execution:

- **Handle (decided in `brand.ts` comments):** `@hiltonaheadtravel`. **Platforms:** Pinterest, Instagram, Facebook, LinkedIn. **Skip TikTok + Twitter** — `brand.ts` documents why (wrong audience for the price point). The calendar's `tiktok.md` / `youtube-shorts.md` files are deprioritized; recycle their reel scripts into IG Reels later.
- **Per-platform playbooks:** `docs/sales-ops/social-playbooks/` — the Pinterest playbook alone contains the username, 160-char bio copy, 12 board names, posting windows, and **20 ready-to-pin pieces**.
- **Per-week post copy:** `social-rolling/week-NN/` — 7 platform files per week with full captions, hashtags, image briefs, UTM-tagged CTAs, and posting times. Current week: `week-02-jun08-14` (theme: last-call July villas; first post was slotted Tue Jun 9, 7:15am).

**Launch sequence (one week, ~6 hrs total):**

| Day | Action | Source |
|---|---|---|
| 1 (~90 min) | Claim `@hiltonaheadtravel` on Pinterest (business acct) + Instagram (business) + Facebook Page + LinkedIn Company Page. Bio = Pinterest playbook's 160-char copy; photo = `brand.logo` mark on Glass Aqua; link = deep page per playbook, not bare homepage | `social-playbooks/`, `data/brand.ts` |
| 2 (~1 hr, dev) | **The sameAs commit:** fill `brand.ts` `social.{instagram,facebook,linkedin}` + add `pinterest`; fill `founder.ts` `sameAs` (his personal LinkedIn at minimum); add Pinterest domain-claim meta tag to `app/layout.tsx`; re-sync `public/llms.txt` + `llms-full.txt` (CLAUDE.md rule — they don't auto-sync). Every Person/Organization schema block on the site gains KG anchors the moment this deploys. | `data/brand.ts:65`, `data/founder.ts:37` |
| 3 (~1 hr) | Create the 12 Pinterest boards from the playbook list; pin the first 5 of the 20 ready-made pieces (tier list, when-to-book timeline, Sea Pines vs Palmetto Dunes, best-month chart, cost-of-trip) | Pinterest playbook §boards, §ready-to-pin |
| 4 (~45 min) | Post IG #1 + FB cross-post from `week-02/instagram.md` (the July-availability carousel — copy, hashtags, 8-slide brief, all written) | `week-02-jun08-14/` |
| 5 (~30 min) | LinkedIn post from `week-02/linkedin.md`; answer 2 questions in HHI visitor Facebook groups linking a guide (answer first, link second — never spam) | `week-02/`, `week-02/facebook.md` |
| 6–7 | Nothing. The bar is sustainability, not launch-week heroics. | — |

**Steady state (the Sunday 30-min batch + ~3 hrs/wk):**
- **Pinterest 5 pins/wk** — the playbook says 15–20; that's a team cadence, not a solo one. Five compounding pins beat twenty abandoned ones; scale only if Month-2 analytics earn it. Work down the 20-piece list, then 1 pin per new/updated guide.
- **Instagram 3/wk + Facebook cross-post** — straight from the week files (they're already written through week-04, Jun 28).
- **LinkedIn 1/wk** — the file exists per week.
- **Reddit** (`week-NN/reddit.md` exists): answer-mining only — r/hiltonhead and trip-planning threads, cite the guide when it genuinely answers. No self-promo posts.
- Every link carries the calendar's UTM convention (`utm_source=instagram&utm_medium=organic&utm_campaign=weekNN-*`) — GA4 source segmentation is already instrumented; lead source flows into the CRM.

**Two E-E-A-T riders while you're in there:** `founder.imagePath` is empty — shoot one decent headshot, wire it (Person schema + bylines need a face). `founder.sameAs` should list William's *personal* profiles; `brand.social` lists the company's. Both feed different schema entities — don't cross them.

**Calendar gap to watch:** the rolling calendar ends at `week-04-jun22-28`. Drafting weeks 05–08 before Jun 22 is a content task (reuse `02-post-briefs.md` system) — put it on the week-3 Sunday batch or the engine stalls at exactly the moment the habit forms.

### Play 3 — One gated lead magnet to bridge social → list (1 dev day, after 1+2)

Social warms; the magnet converts. Pick ONE: **"The Hilton Head Booking Calendar"** (when to book each thing, by month — data already exists in `months.ts` + the best-time guide). Gate behind the existing `NewsletterSignup` component with `source="booking-calendar"`. PDF or print-CSS page. Subscribers enter the Play-1 welcome sequence automatically.

### Rejected — buying email SaaS now

Paying $45–60/mo for deliverability + automation you already own, before the list justifies it. **Revisit trigger:** list > 1,500 subs or >2 hrs/mo lost to send-batching → Resend paid ($20/mo) first, SaaS only if visual campaign editing starts mattering.

---

## Pre-mortem

- **Socials abandoned by week 3** — the classic death. Early warning: week-03 calendar files unposted by Jun 19. Mitigation: 30-min Sunday batch-schedule session; if even that fails, cut to Pinterest only (pins compound without a feed to feed).
- **Welcome sequence reads as spam** — kill signal: unsubscribe rate > 2% per send. Fix: more island intelligence, less pitch; the Day-12 CTA is the only ask.
- **Send-model build balloons** — guardrail: it's a mirror of migration 024 + one cron. If it's exceeding 3 days, scope crept — cut pixel tracking from v1, ship sends only.
- **Resend daily cap bites early** — only matters past ~400 subs/issue. Batch or pay $20. Non-event until it's a good problem.

## 30 / 60 / 90 (measured by William, first Sunday of each month)

| Day | Targets |
|---|---|
| 30 | Welcome sequence live; 4 handles claimed; `sameAs` populated + committed; 9–12 posts shipped; subscriber baseline recorded |
| 60 | Booking-calendar magnet live; first monthly issue sent to full list; social sessions visible in GA4 by source; list +50% over baseline |
| 90 | List ≥ 250; 2 issues shipped; ≥ 1 itinerary request attributed to email or social UTM; decide: scale Pinterest or kill weakest platform |

**Relationship to the backlink engine:** this is the *demand* side of the same flywheel — backlink-engine-v2 builds authority → organic visitors land → magnet + list capture them → sequence warms them → itinerary requests close by email. No cold calls at any stage. Same CRM, same Resend, same $0.
