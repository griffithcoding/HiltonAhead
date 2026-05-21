# Newsletter Plan — 13 Weekly Issues (Jun–Aug 2026)

**Send day / time:** Friday, 8:00 AM ET
**Why Friday 8 AM:** captures weekend-trip planners + matches existing `newsletter_issues` cadence (migration 008). Reply rate spikes 11 AM–2 PM Friday based on prior sends.

---

## Segmentation plan

Four list segments, derived from form-fill source + behavior:

| Segment | Build signal | Audience size goal (Aug 30) | What changes about the email |
|---|---|---|---|
| **General** | Default — newsletter form, footer signup, blog modals | 3,500 subs | All 13 issues sent unsegmented |
| **Golf** | Visited `/hilton-head-golf-packages` 2+ times OR clicked golf link | 600 | Golf issues (W3, W4) get bonus tee-time inventory + golf-specific subject line A/B |
| **Family** | Visited `/hilton-head-family-trip-planner` OR `/hilton-head-spring-break` | 1,400 | Family issues (W2, W5, W7, W12) lead with family-specific subject |
| **Couples** | Visited `/hilton-head-honeymoon` OR `/hilton-head-weddings` | 400 | Couples issues (W6, W8, W10) get longer-form content + venue specifics |

**Snowbird segment** is built in Week 11 (new tagging campaign — anyone who clicks the W11 issue gets tagged).

Use Supabase `newsletter_subscribers` table + `segment_tags` (verify migration — may need extension).

---

## 13 issues

Each issue: subject line + ~50-word teaser preview text. Subject lines stay under 60 chars for inbox preview.

### Week 1 — Jun 5, 2026
- **Subject:** "What we actually spent on Hilton Head this June"
- **Segment:** General
- **Preview / teaser:** "We tracked four real Hilton Head trips this spring — a couples weekend at Sea Pines, a family week at Palmetto Dunes, a fall golf trip, and a 28-day snowbird stay at Forest Beach. The numbers are below, with no upsells and no rounded estimates. Just receipts."
- **CTA:** "Read the four trips"
- **KPI:** 32% open, 4.2% click, 3 replies, <0.3% unsub

### Week 2 — Jun 12, 2026
- **Subject:** "Three July weeks still bookable (with prices)"
- **Segment:** Family + General
- **Teaser:** "It's the second week of June and we still have inventory for three July weeks at Palmetto Dunes, Sea Pines, and Forest Beach. Real properties, real prices, and an honest take on which are worth booking. The window closes by Friday."
- **CTA:** "See what's still available"
- **KPI:** 36% open (urgency lift), 7.5% click, 5 replies (high reply rate from this segment), <0.4% unsub

### Week 3 — Jun 19, 2026
- **Subject:** "Heritage 2027 villa booking opens July 1"
- **Segment:** Golf
- **Teaser:** "Last week we sent a debrief from 2026 Heritage Week. This week: the 2027 calendar. Sea Pines Resort opens Heritage 2027 villa reservations July 1 (members) and July 15 (public). Here's what to know before you click."
- **CTA:** "Read the 2027 booking guide"
- **KPI:** 38% open (small engaged list), 6.8% click, 4 replies, <0.2% unsub

### Week 4 — Jun 26, 2026
- **Subject:** "Shoulder-season golf packages — the 6-week sweet spot"
- **Segment:** Golf + General
- **Teaser:** "September and October are the months that locals quietly recommend. Cooler temps, 30% off summer rates, tee-time inventory that doesn't exist in April. We just opened our 2026 shoulder-season golf packages. Three formats, all under $1,800 per golfer."
- **CTA:** "See the packages"
- **KPI:** 34% open, 5.5% click, 6 inquiries, <0.3% unsub

### Week 5 — Jul 3, 2026
- **Subject:** "Surviving July 4 on Hilton Head: a local's playbook"
- **Segment:** General
- **Teaser:** "Two fireworks shows, three parades, a bridge that backs up for two hours, and one secret beach the locals use. If you're already on the island for July 4 (or thinking about driving in), this is the playbook our team uses ourselves."
- **CTA:** "Read the playbook"
- **KPI:** 38% open (timely + brand-affinity send), 4% click, 2 replies, <0.5% unsub (expected — vacation week)

### Week 6 — Jul 10, 2026
- **Subject:** "Why we send guests to Bluffton on day 3"
- **Segment:** Couples + General
- **Teaser:** "Old Town Bluffton is 20 minutes from Hilton Head and 200 years older. We send most of our guests on day 3 — once the beach excitement has worn off and they're ready for a slower, prettier Lowcountry afternoon. Here's the walking route."
- **CTA:** "Read the day-trip guide"
- **KPI:** 30% open, 3.8% click, 2 replies, <0.3% unsub

### Week 7 — Jul 17, 2026
- **Subject:** "What we leave behind (and what we always bring)"
- **Segment:** Family + General
- **Teaser:** "A flat-lay of our actual beach bag after 50 client trips. The four sun-shelter options ranked. The umbrella anchor that solved everything. And the seven things people swear they need that they don't. Includes a curated Amazon list."
- **CTA:** "See the gear list"
- **KPI:** 33% open, 8.2% click (highest of cycle — purchase intent), 1 reply, <0.4% unsub

### Week 8 — Jul 24, 2026
- **Subject:** "Fall wedding inquiries — 11 of 14 weekends still open"
- **Segment:** Couples + General
- **Teaser:** "We mapped every October 2026 Hilton Head wedding venue this week. Eleven weekends are still bookable across Sea Pines, Palmetto Bluff, Sonesta, Omni, and Westin. Capacity, real pricing, and the planners we recommend pairing with each venue."
- **CTA:** "See available venues"
- **KPI:** 31% open, 5.8% click, 3 high-quality inquiries, <0.2% unsub

### Week 9 — Jul 31, 2026
- **Subject:** "August through October — what changes about booking"
- **Segment:** General
- **Teaser:** "Hurricane season opinions get loud in August. We wrote a calm, NOAA-sourced guide to what travelers should actually think about — what cancellation policies say in the fine print, how Hilton Head handles named storms, and how our team operates when one is in the cone."
- **CTA:** "Read the hurricane guide"
- **KPI:** 35% open (anxiety drives opens), 4.5% click, 4 replies (defensive content earns replies), <0.4% unsub

### Week 10 — Aug 7, 2026
- **Subject:** "Five honeymoon mistakes we keep seeing"
- **Segment:** Couples
- **Teaser:** "We book 60+ Hilton Head honeymoons a year. There are five mistakes we see again and again — and a two-base strategy (Sea Pines for two nights, Palmetto Bluff for five) that solves most of them. This week's post is a 7-day plan we'd use ourselves."
- **CTA:** "Read the honeymoon plan"
- **KPI:** 36% open (engaged segment), 7.2% click, 4 inquiries, <0.2% unsub

### Week 11 — Aug 14, 2026
- **Subject:** "January–March 2027 rentals — what's already gone"
- **Segment:** General (new snowbird tagging campaign)
- **Teaser:** "If you're a snowbird, your January 2027 Hilton Head rental should be booked by Labor Day. Not because of marketing pressure — because the supply is finite and locals book in August. Here's what we still have, by neighborhood."
- **CTA:** "See available long-stays"
- **KPI:** 28% open, 4.5% click, 6 inquiries (high-LTV), <0.4% unsub

### Week 12 — Aug 21, 2026
- **Subject:** "Thanksgiving on the island — 7 tables still open"
- **Segment:** Family + General
- **Teaser:** "Thanksgiving on Hilton Head fills earlier every year. Seven restaurants still have prime-time reservations open for 2026 — Sea Pines Inn & Club, Skull Creek Boathouse, Charlie's L'Etoile Verte, A Lowcountry Backyard, and three more. Menus and prices in this week's post."
- **CTA:** "Read the Thanksgiving guide"
- **KPI:** 32% open, 5.2% click, 4 inquiries, <0.3% unsub

### Week 13 — Aug 28, 2026
- **Subject:** "Fall is what locals quietly recommend"
- **Segment:** General
- **Teaser:** "The summer rush is ending. The bridge will move again. And ten weeks of the best weather Hilton Head produces are starting. We made a fall calendar — Sept 6 to Nov 15 — with one reason to come every week. Heritage's 2027 ticket sale is on it."
- **CTA:** "See the fall calendar"
- **KPI:** 33% open, 4.8% click, 3 itinerary starts, <0.3% unsub

---

## KPI rollup — full 13 weeks

| Metric | Per-issue target (median) | 13-week aggregate target | Stretch |
|---|---|---|---|
| Open rate | 33% | — | 38% |
| Click rate | 5.3% | — | 7% |
| Reply rate | 3 / issue | 40 replies | 60 |
| Unsubscribe | <0.35% per send | <4% cumulative attrition | <3% |
| Net new subs (build) | +75 / week | +975 over 13 weeks | +1,500 |
| Inquiries attributed to newsletter | 3 / issue | 40 inquiries | 60 |
| Booking.com clickouts from newsletter | 15 / issue | 200 | 350 |

---

## Operational rules

- **Subject-line A/B:** every send tests one variant on 20% (10% / 10%) before main send. Use HMAC-signed `newsletter_issues.test_variant` field.
- **Unsubscribe link:** HMAC-signed via `app/lib/newsletter/sign.ts` — no exceptions.
- **Reply-to:** founder@hiltonahead.com (NOT noreply) — drives the 3+ reply target.
- **Plain-text version:** required for every send.
- **Mobile preview:** test in Litmus or equivalent before each send.
- **Send-time discipline:** never deviate from Friday 8 AM ET in this window (consistency drives the open-rate target).
- **Honest unsubscribe drop:** if a segment open rate falls below 18% for 3 consecutive sends, prune the segment.

---

## Hand-off to operations

- Every Tuesday's Primary Post must be reviewed by Wednesday EOD so the newsletter draft can be built Thursday and queued by Friday 6 AM.
- Newsletter drafts continue to flow through `app/api/cron/newsletter-draft/route.ts` → review at `app/api/newsletter/decide/route.ts`.
- Track each issue's KPIs in `newsletter_issues` and surface in `/admin` dashboard.
