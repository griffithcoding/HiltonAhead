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

### Play 2 — Claim the social surface + run the calendar that's already written ($0, ~4 hrs/wk)

The content is sitting in `docs/sales-ops/content-calendar/social-rolling/` (4 weeks, current week = week-02-jun08-14) + `social-playbooks/`. Nothing has been posted because no accounts exist.

1. **Claim handles this week:** Instagram, Facebook, Pinterest, LinkedIn (`@hiltonahead` or nearest). Same NAP/bio from `data/brand.ts` everywhere, link to site.
2. **One commit:** populate `brand.ts` socials + `founder.ts` `sameAs` → every Person/Organization schema block on the site instantly gains KG anchors. Re-sync `llms.txt` per CLAUDE.md rule.
3. **Platform priority for a travel niche:** **Pinterest first** (it's a travel search engine with compounding pins, not a feed — "when to book Hilton Head" timeline, restaurant tier list, best-month chart are ready-made pins), Instagram second (Reels from existing photo assets), Facebook third (HHI visitor groups are where the planning questions actually get asked — answer, don't spam), LinkedIn last (B2B/partner surface, week-XX/linkedin.md files already drafted).
4. **Repurpose, don't create:** every post links to a tool or guide with UTM (`?utm_source=pinterest&utm_medium=social`). The GA4 instrumentation (84 files) already segments source.
5. **Cadence:** 3 posts/wk/platform max — the calendar files define them. Sustainability beats volume.

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
