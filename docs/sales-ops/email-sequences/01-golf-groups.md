# Golf Groups — Cold Email Sequence v1

## Segment profile
Men 38–62, 6–16 handicap, organizing an annual trip for 4–16 buddies. Decision-maker is usually one alpha planner who has run the trip for 3+ years and is sick of juggling a tee-sheet spreadsheet, a flaky house rental, and four guys who text "what's the dinner plan." Trip-up: they book Harbour Town for the Saturday and discover too late that the front-nine carts run an hour behind, the Tuesday-Wednesday rates were half the Friday-Saturday rate, and nobody booked the Quarterdeck for 12 at 7pm.

## Sequence: 5-touch cold + 3-touch nurture

---

**Touch 1 (Day 0)** — Opener
Subject: Harbour Town tee times for {{trip_month}}
Day offset: 0
Word count: 118

{{first_name}} —

You're the guy who runs the {{group_name}} trip. I know because nobody else in the group ever wants to do it.

Quick FYI for whatever you're planning next: Harbour Town Golf Links opens its public tee sheet 90 days out and the 10am-1pm windows on Tuesday and Wednesday gap out first. Atlantic Dunes and Heron Point are the under-priced sister tracks at Sea Pines — same caliber, half the green fee.

If your trip is in {{trip_month}}, the 90-day window for the prime slots is closing soon.

Not pitching anything. Just thought you should have the date.

— Will, Hilton Ahead

CTA: None (value-first)
Sign-off: — Will, Hilton Ahead

---

**Touch 2 (Day 5)** — Specific mistake to avoid
Subject: The trip mistake I see 4 out of 5 groups make
Day offset: 5
Word count: 134

{{first_name}} —

Most planners book the courses first, then scramble for the house. Backwards.

A 12-person villa in Sea Pines that walks to Harbour Town goes for around $1,100/night in shoulder season and double that during Heritage week. The good ones — Forsythia Lane, the inner-loop streets near the Plantation Club — book 6–9 months out. Tee times you can still grab at 60 days. The right house at 60 days, you're left with the highway-side rentals and a 25-minute cart ride to the first tee.

Two other things groups blow:
1. Booking dinner. Skull Creek Boathouse for 12 on a Saturday is a 3-week ask.
2. Heritage week (mid-April). Beautiful tournament. Terrible week to play unless you have credentials.

— Will, Hilton Ahead

CTA: None
Sign-off: — Will, Hilton Ahead

---

**Touch 3 (Day 12)** — Hard ask
Subject: Run your {{trip_month}} trip past me
Day offset: 12
Word count: 78

{{first_name}} —

I run Hilton Ahead — we plan custom HHI trips, including 8–16 person golf weeks. Villa, tee times at Harbour Town / Atlantic Dunes / Heron Point / May River, dinner reservations, transport from {{nearest_airport}}.

If you want a 20-minute call to pressure-test your dates and lineup, here's my link:
https://calendly.com/hiltonahead/30min

No fee for the consult.

— Will, Hilton Ahead

CTA: Calendly booking
Sign-off: — Will, Hilton Ahead

---

**Touch 4 (Day 25)** — Breakup
Subject: Should I close the file?
Day offset: 25
Word count: 56

{{first_name}} —

I'll stop chasing if the {{trip_month}} trip is already booked or shelved. Just hit reply with "done" or "later" and I'll close the file cleanly.

If you want me back in {{next_year}}, say so and I'll diary it.

— Will, Hilton Ahead

CTA: Reply with done / later / next year
Sign-off: — Will, Hilton Ahead

---

**Touch 5 (Day 60)** — Re-engagement, new angle
Subject: May River + the under-the-radar Bluffton play
Day offset: 60
Word count: 96

{{first_name}} —

New angle for the {{group_name}} trip: skip the Sea Pines-only itinerary and do a hybrid week with one night in Palmetto Bluff. May River Golf Club is the best private-feeling track within 30 minutes of HHI, and the Montage rooms let you walk to dinner at Octagon or Buffalo's.

Two-course-a-day groups can stage out of a Sea Pines villa Monday–Thursday, then move to Bluffton Friday night. It changes the trip from "another HHI week" to a story.

Worth a 20-minute call?

— Will, Hilton Ahead

CTA: Calendly
Sign-off: — Will, Hilton Ahead

---

**Nurture 1 (Day +3 from engagement)** — Answer + insight
Subject: Re: your question on {{question_topic}}
Day offset: +3
Word count: 130

{{first_name}} —

Direct answer to your question on {{question_topic}}:

{{answer_paragraph}}

Related thing worth knowing: tee times at the Sea Pines tracks (Harbour Town, Atlantic Dunes, Heron Point) all share the same Sea Pines booking engine, but the staff will hold a same-day swap if one of your guys flames out at lunch. Just call the bag room directly, not the central line. Saves the $50 cancellation per head.

For a {{group_size}}-person group, I'd lean toward two 4-somes off the back-nine tee box and a third group rolling 30 minutes later — keeps the pace honest and the bar tab synchronized.

Holler with the next question.

— Will, Hilton Ahead

CTA: Reply with follow-up
Sign-off: — Will, Hilton Ahead

---

**Nurture 2 (Day +10)** — Soft Calendly
Subject: 20 minutes on the phone?
Day offset: +10
Word count: 84

{{first_name}} —

You've been kicking the {{trip_month}} trip around. Easiest next step is 20 minutes by phone — I'll run you through tee-time availability, three villa options at your budget, and a draft dinner lineup.

Nothing committed on the call. You'll just walk away knowing whether HHI is the right call versus Pinehurst or Kiawah for the group.

https://calendly.com/hiltonahead/30min

— Will, Hilton Ahead

CTA: Calendly
Sign-off: — Will, Hilton Ahead

---

**Nurture 3 (Day +21)** — Sample itinerary PDF
Subject: Sample 7-day golf itinerary, real numbers
Day offset: +21
Word count: 92

{{first_name}} —

Attached is the actual 7-day itinerary we ran for a 12-person group out of {{feeder_city}} last spring. Real villa, real courses, real dinner spots, real per-head cost ($2,850 all-in including villa, tee times, food, transport — not including flights).

PDF: {{sample_itinerary_url}}

Useful for benchmarking what you're getting quoted elsewhere. The dinner-reservation list at the back is the part most planners underestimate.

Reply if you want the same thing built for {{group_name}}.

— Will, Hilton Ahead

CTA: Reply / Calendly
Sign-off: — Will, Hilton Ahead

---

## Personalization tokens
- `{{first_name}}` — planner's first name
- `{{trip_month}}` — target trip month (e.g., "April")
- `{{group_name}}` — informal group label (e.g., "Tarheel Open" or "the boys")
- `{{group_size}}` — headcount
- `{{feeder_city}}` — origin metro (Atlanta, Charlotte, etc.)
- `{{nearest_airport}}` — SAV, CHS, or HHH
- `{{next_year}}` — calendar year for re-diary
- `{{question_topic}}` — topic from prior reply
- `{{answer_paragraph}}` — custom answer text
- `{{sample_itinerary_url}}` — PDF link
- `{{unsubscribe_url}}` — one-click unsubscribe

## Segment-specific Calls-to-Action
- Primary CTA: https://hiltonahead.com/trip-types/golf-packages
- Secondary CTA: https://hiltonahead.com/itinerary (full intake form)
- Breakup CTA: Reply to email
- Re-engagement CTA: https://calendly.com/hiltonahead/30min

## Compliance footer

```
You're getting this because you organize a Hilton Head golf trip and we publish HHI tee-sheet and villa intel for trip planners.

Unsubscribe one-click: {{unsubscribe_url}}
Hilton Ahead Travel Co · Hilton Head Island, SC 29928
hello@hiltonahead.com
```

## A/B test plan

### Variable 1: Subject line on Touch 1
- Arm A: "Harbour Town tee times for {{trip_month}}"
- Arm B: "Your {{trip_month}} HHI trip — one date you should know"

Hypothesis: Specific course name beats vague urgency for golf planners. Measure open rate.

### Variable 2: Sender name
- Arm A: "Will Griffith"
- Arm B: "Will at Hilton Ahead"

Hypothesis: First-name-only triggers fewer spam filters and signals peer-to-peer rather than vendor outreach. Measure reply rate.
