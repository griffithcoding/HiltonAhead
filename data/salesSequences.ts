/**
 * Sales email sequence catalog.
 *
 * One TypeScript module mirroring the source-of-truth markdown sequences in
 * docs/sales-ops/email-sequences/*.md. The sequenceEngine reads from this
 * catalog at runtime to render and dispatch each touch via Resend.
 *
 * Conventions:
 *   - id format:        `<segment>-<variant>-v1`            (e.g. 'golf-cold-v1')
 *   - segment slugs:    'golf' | 'family' | 'couples' | 'honeymoon' | 'snowbird' | 'wedding' | 'corporate'
 *   - variants:         'cold' (5 touches) or 'nurture' (3 touches)
 *   - dayOffset (cold): days from sequence_started_at (touch 1 = 0)
 *   - dayOffset (nurture): days from sequence_started_at; the engine resets the
 *                          anchor to "now" when flipping a prospect from cold
 *                          to nurture after an engagement signal
 *
 * Merge fields use {{double_curly}} tokens. The set of supported tokens is
 * fixed (see MergeField below) — anything the docs use that isn't in that
 * union renders as a literal "(not provided)" placeholder via renderTouch.
 *
 * There is also one fallback sequence ('general-cold-v1') for prospects whose
 * segment can't be inferred — leans into curiosity + neighborhood orientation
 * and only escalates to a Calendly ask on touch 3.
 */

export type MergeField =
  | 'first_name'
  | 'feeder_city'
  | 'nearest_airport'
  | 'kid_ages'
  | 'country_club'
  | 'unsubscribe_url'
  | 'sender_name';

export type SequenceSegment =
  | 'golf'
  | 'family'
  | 'couples'
  | 'honeymoon'
  | 'snowbird'
  | 'wedding'
  | 'corporate'
  | 'general';

export type SequenceVariant = 'cold' | 'nurture';

export interface SequenceTouch {
  step: number; // 1..N
  dayOffset: number; // days from sequence_started_at
  channel: 'email';
  subject: string; // may include {{merge_fields}}
  body: string; // plain text, may include {{merge_fields}}
  ctaUrl: string; // canonical hiltonahead.com URL (or calendly), may contain {{utm}}
  isBreakup?: boolean;
}

export interface Sequence {
  id: string;
  segment: SequenceSegment;
  variant: SequenceVariant;
  name: string;
  touches: SequenceTouch[];
}

// ---------------------------------------------------------------------------
// Shared signoffs / CTAs
// ---------------------------------------------------------------------------

const SIGNOFF = `— {{sender_name}}, Hilton Ahead`;
const CALENDLY = 'https://calendly.com/hiltonahead/30min';

// Canonical site URLs — keep in sync with the markdown CTAs. Hostnames are
// composed from brand.url at render time when {{utm}} is appended.
const URLS = {
  golfPrimary: 'https://www.hiltonahead.com/trip-types/golf-packages',
  familyPrimary: 'https://www.hiltonahead.com/trip-types/family-trip-planner',
  couplesPrimary: 'https://www.hiltonahead.com/trip-types/oceanfront-villas',
  honeymoonPrimary: 'https://www.hiltonahead.com/trip-types/honeymoon',
  snowbirdPrimary: 'https://www.hiltonahead.com/trip-types/winter-rental',
  weddingPrimary: 'https://www.hiltonahead.com/trip-types/weddings',
  corporatePrimary: 'https://www.hiltonahead.com/itinerary',
  generalPrimary: 'https://www.hiltonahead.com/blog',
  itinerary: 'https://www.hiltonahead.com/itinerary',
};

// ---------------------------------------------------------------------------
// 01 — Golf Groups (cold + nurture)
// ---------------------------------------------------------------------------

const GOLF_COLD: Sequence = {
  id: 'golf-cold-v1',
  segment: 'golf',
  variant: 'cold',
  name: 'Golf Groups — 5-touch cold',
  touches: [
    {
      step: 1,
      dayOffset: 0,
      channel: 'email',
      subject: 'Harbour Town tee times — your next HHI trip',
      body: `{{first_name}} —

You're the guy who runs the trip. I know because nobody else in the group ever wants to do it.

Quick FYI for whatever you're planning next: Harbour Town Golf Links opens its public tee sheet 90 days out and the 10am-1pm windows on Tuesday and Wednesday gap out first. Atlantic Dunes and Heron Point are the under-priced sister tracks at Sea Pines — same caliber, half the green fee.

If your trip is coming up, the 90-day window for the prime slots is closing soon.

Not pitching anything. Just thought you should have the date.

${SIGNOFF}`,
      ctaUrl: URLS.golfPrimary,
    },
    {
      step: 2,
      dayOffset: 5,
      channel: 'email',
      subject: 'The trip mistake I see 4 out of 5 groups make',
      body: `{{first_name}} —

Most planners book the courses first, then scramble for the house. Backwards.

A 12-person villa in Sea Pines that walks to Harbour Town goes for around $1,100/night in shoulder season and double that during Heritage week. The good ones — Forsythia Lane, the inner-loop streets near the Plantation Club — book 6–9 months out. Tee times you can still grab at 60 days. The right house at 60 days, you're left with the highway-side rentals and a 25-minute cart ride to the first tee.

Two other things groups blow:
1. Booking dinner. Skull Creek Boathouse for 12 on a Saturday is a 3-week ask.
2. Heritage week (mid-April). Beautiful tournament. Terrible week to play unless you have credentials.

${SIGNOFF}`,
      ctaUrl: URLS.golfPrimary,
    },
    {
      step: 3,
      dayOffset: 12,
      channel: 'email',
      subject: 'Run your golf trip past me',
      body: `{{first_name}} —

I run Hilton Ahead — we plan custom HHI trips, including 8–16 person golf weeks. Villa, tee times at Harbour Town / Atlantic Dunes / Heron Point / May River, dinner reservations, transport from {{nearest_airport}}.

If you want a 20-minute call to pressure-test your dates and lineup, here's my link:
${CALENDLY}

No fee for the consult.

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
    {
      step: 4,
      dayOffset: 25,
      channel: 'email',
      subject: 'Should I close the file?',
      body: `{{first_name}} —

I'll stop chasing if the trip is already booked or shelved. Just hit reply with "done" or "later" and I'll close the file cleanly.

If you want me back next year, say so and I'll diary it.

${SIGNOFF}`,
      ctaUrl: URLS.itinerary,
      isBreakup: true,
    },
    {
      step: 5,
      dayOffset: 60,
      channel: 'email',
      subject: 'May River + the under-the-radar Bluffton play',
      body: `{{first_name}} —

New angle for the trip: skip the Sea Pines-only itinerary and do a hybrid week with one night in Palmetto Bluff. May River Golf Club is the best private-feeling track within 30 minutes of HHI, and the Montage rooms let you walk to dinner at Octagon or Buffalo's.

Two-course-a-day groups can stage out of a Sea Pines villa Monday–Thursday, then move to Bluffton Friday night. It changes the trip from "another HHI week" to a story.

Worth a 20-minute call?

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
  ],
};

const GOLF_NURTURE: Sequence = {
  id: 'golf-nurture-v1',
  segment: 'golf',
  variant: 'nurture',
  name: 'Golf Groups — 3-touch nurture',
  touches: [
    {
      step: 1,
      dayOffset: 3,
      channel: 'email',
      subject: 'Follow-up — the tee-time swap trick most groups miss',
      body: `{{first_name}} —

Picking up from where we left off.

One thing worth knowing: tee times at the Sea Pines tracks (Harbour Town, Atlantic Dunes, Heron Point) all share the same Sea Pines booking engine, but the staff will hold a same-day swap if one of your guys flames out at lunch. Just call the bag room directly, not the central line. Saves the $50 cancellation per head.

For a typical group, I'd lean toward two 4-somes off the back-nine tee box and a third group rolling 30 minutes later — keeps the pace honest and the bar tab synchronized.

Holler with the next question.

${SIGNOFF}`,
      ctaUrl: URLS.golfPrimary,
    },
    {
      step: 2,
      dayOffset: 10,
      channel: 'email',
      subject: '20 minutes on the phone?',
      body: `{{first_name}} —

You've been kicking the trip around. Easiest next step is 20 minutes by phone — I'll run you through tee-time availability, three villa options at your budget, and a draft dinner lineup.

Nothing committed on the call. You'll just walk away knowing whether HHI is the right call versus Pinehurst or Kiawah for the group.

${CALENDLY}

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
    {
      step: 3,
      dayOffset: 21,
      channel: 'email',
      subject: 'Sample 7-day golf itinerary, real numbers',
      body: `{{first_name}} —

Here's the actual 7-day itinerary we ran for a 12-person group out of {{feeder_city}} last spring. Real villa, real courses, real dinner spots, real per-head cost ($2,850 all-in including villa, tee times, food, transport — not including flights).

Read the breakdown: ${URLS.golfPrimary}

Useful for benchmarking what you're getting quoted elsewhere. The dinner-reservation list at the back is the part most planners underestimate.

Reply if you want the same thing built for your group.

${SIGNOFF}`,
      ctaUrl: URLS.golfPrimary,
    },
  ],
};

// ---------------------------------------------------------------------------
// 02 — Families (cold + nurture)
// ---------------------------------------------------------------------------

const FAMILY_COLD: Sequence = {
  id: 'family-cold-v1',
  segment: 'family',
  variant: 'cold',
  name: 'Families — 5-touch cold',
  touches: [
    {
      step: 1,
      dayOffset: 0,
      channel: 'email',
      subject: 'HHI with kids {{kid_ages}} — two things that matter',
      body: `{{first_name}} —

Two things that matter for a family trip to Hilton Head with kids {{kid_ages}}:

1. Beach access. "Walk to the beach" in a listing can mean a 4-minute walk through palmettos or a 12-minute golf-cart ride past the security gate. Sea Pines beachfront villas on South Beach are the genuine 90-second walk. Palmetto Dunes is also walkable. Coligny-adjacent rentals get you to the public beach but the cart-path traffic with a stroller is real.

2. Rain-day plan. HHI has 6–9 rainy afternoons a year between Memorial Day and Labor Day. You want a plan that isn't "drive to Bluffton Tanger Outlets." We use the Sandbox children's museum, the Coastal Discovery Museum, and a Harbour Town pirate cruise.

Not pitching. Just orienting.

${SIGNOFF}`,
      ctaUrl: URLS.familyPrimary,
    },
    {
      step: 2,
      dayOffset: 5,
      channel: 'email',
      subject: 'Lawton Stables, Coligny, and the Tuesday rain',
      body: `{{first_name}} —

Three things families miss on a first HHI trip:

Lawton Stables. The pony rides for kids under 8 sell out 3 weeks ahead in summer. They release the week's slots on Sunday at 8am. If you're targeting late June or July, that booking goes in the calendar now.

Coligny on a Saturday. Coligny Beach Park is the easy public-access option but Saturday afternoon in summer is a circus — circular parking lot, the pool deck behind Frosty Frog packed, a 35-minute wait at Skull Creek. Better play: hit Coligny on a Tuesday or Thursday, and do your Saturday dinner at Old Oyster Factory or Hudson's on Skull Creek with a 5:30 reservation.

Easter and 4th of July week. Both are sold out and double-priced. Avoid unless your dates can't flex.

${SIGNOFF}`,
      ctaUrl: URLS.familyPrimary,
    },
    {
      step: 3,
      dayOffset: 12,
      channel: 'email',
      subject: 'Pressure-test your HHI week',
      body: `{{first_name}} —

I run Hilton Ahead — custom HHI itineraries for families. We do villa booking (vetted Sea Pines / Palmetto Dunes / Harbour Town inventory), kid-friendly dinner reservations, Lawton Stables and dolphin-cruise slots, plus a rain-day playbook tuned to {{kid_ages}}.

20 minutes by phone to pressure-test your dates and budget:
${CALENDLY}

No fee for the call.

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
    {
      step: 4,
      dayOffset: 25,
      channel: 'email',
      subject: 'Closing the file?',
      body: `{{first_name}} —

I'll stop chasing if the family trip is booked or shelved. Hit reply with "done" or "later" and I'll close it cleanly.

If next year is more realistic, say so and I'll diary it for you next winter.

${SIGNOFF}`,
      ctaUrl: URLS.itinerary,
      isBreakup: true,
    },
    {
      step: 5,
      dayOffset: 60,
      channel: 'email',
      subject: 'The shoulder-season HHI nobody tells you about',
      body: `{{first_name}} —

If summer dates aren't holding together, the under-the-radar window is the last week of September through mid-October. Water's still 78°. Beach is half-empty. The 6-night villa rates drop 30–40%. Schools are back in session but a strategic Thursday-pickup, fly-out-Friday plan turns 4 missed school days into the best family week of the year.

Worth a conversation about whether your work / school calendar can accommodate?

${CALENDLY}

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
  ],
};

const FAMILY_NURTURE: Sequence = {
  id: 'family-nurture-v1',
  segment: 'family',
  variant: 'nurture',
  name: 'Families — 3-touch nurture',
  touches: [
    {
      step: 1,
      dayOffset: 3,
      channel: 'email',
      subject: 'Follow-up — the Sea Pines bike-rental move',
      body: `{{first_name}} —

Picking up the thread.

Related insight for a family: the Sea Pines Plantation gate fee (around $9/car/week, free for renters) buys you private-beach access, the Forest Preserve trails, and the bike-path network. If two of your kids are bike-age, renting four bikes from Hilton Head Outfitters for the week is the single move that turns the trip from "OK" to "kid still talks about it." Palmetto Dunes has its own trail network and lagoon-kayak access — different vibe, similar good idea.

Holler with whatever's next.

${SIGNOFF}`,
      ctaUrl: URLS.familyPrimary,
    },
    {
      step: 2,
      dayOffset: 10,
      channel: 'email',
      subject: 'A 20-minute call to lock the week',
      body: `{{first_name}} —

We've gone back and forth on the dates. Easiest next step is 20 minutes on the phone — I'll show you three villa options at your budget, talk through the rain-day plan for {{kid_ages}}, and you'll know whether to pull the trigger or wait.

Zero pressure on the call.

${CALENDLY}

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
    {
      step: 3,
      dayOffset: 21,
      channel: 'email',
      subject: 'A real family week, by the hour',
      body: `{{first_name}} —

Here's a 7-day HHI itinerary we built for a family of 5 (kids 6, 9, 12) out of {{feeder_city}} last June. Real villa (South Beach Sea Pines), real dinner reservations, real rain-day backup for the Wednesday squall, real bike-rental and Lawton Stables slots. All-in cost on page 6.

See it: ${URLS.familyPrimary}

Useful as a sanity check on what you're getting quoted by VRBO + winging it.

${SIGNOFF}`,
      ctaUrl: URLS.familyPrimary,
    },
  ],
};

// ---------------------------------------------------------------------------
// 03 — Couples & Anniversaries (cold + nurture)
// ---------------------------------------------------------------------------

const COUPLES_COLD: Sequence = {
  id: 'couples-cold-v1',
  segment: 'couples',
  variant: 'cold',
  name: 'Couples & Anniversaries — 5-touch cold',
  touches: [
    {
      step: 1,
      dayOffset: 0,
      channel: 'email',
      subject: 'HHI for two — the right side of the island',
      body: `{{first_name}} —

For a couples weekend or anniversary trip, HHI splits into three different islands:

South Beach / Sea Pines. Oceanfront condos, walk to Harbour Town for the Quarterdeck sunset, bike paths everywhere. The honeymoon-without-saying-honeymoon side.

Shelter Cove / Palmetto Dunes. More upscale, less foot traffic, the Inn at Harbour Town is the nicest hotel on the island. Walk-to-pier dinner at Hudson's, kayak from your back door.

Off-island Palmetto Bluff. Technically Bluffton, but Montage Palmetto Bluff is the closest HHI gets to a Greenbrier-quality couples weekend. River instead of beach. Different trip.

If you're considering a trip for two, the side of the island you pick determines whether the week feels like a reset or a logistics exercise.

${SIGNOFF}`,
      ctaUrl: URLS.couplesPrimary,
    },
    {
      step: 2,
      dayOffset: 5,
      channel: 'email',
      subject: 'The dinner reservations you should be making now',
      body: `{{first_name}} —

The single move that separates a great HHI couples trip from a fine one is the dinner cadence.

For a 4-night trip, the rotation that works:

- Night 1. Skull Creek Boathouse upper deck at sunset. Easy, casual, dolphin sightings. Book the upstairs not the downstairs.
- Night 2. Hudson's on Skull Creek. The 6pm reservation hits golden hour over the docks.
- Night 3. The destination dinner. Either Old Fort Pub (Hilton Head Plantation), Charlie's L'Etoile Verte (the Forsythia Lane French spot, locals' favorite), or — if you want the splurge — a drive to Bluffton for Octagon at Montage.
- Night 4. Quarterdeck at Harbour Town for sunset. This one books 30+ days out for primetime.

Charlie's takes phone reservations only and only on the day-of for some seatings. Worth knowing.

${SIGNOFF}`,
      ctaUrl: URLS.couplesPrimary,
    },
    {
      step: 3,
      dayOffset: 12,
      channel: 'email',
      subject: 'Anniversary trip — 20 minutes?',
      body: `{{first_name}} —

I run Hilton Ahead — custom HHI trips, including couples weekends and anniversary trips. Villa or hotel curation (oceanfront vs. resort vs. Palmetto Bluff), dinner reservation lockup, spa booking, sunrise charter or sunset cruise — all included.

20 minutes on the phone to pressure-test dates and budget:
${CALENDLY}

No fee for the consult.

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
    {
      step: 4,
      dayOffset: 25,
      channel: 'email',
      subject: 'Closing the file?',
      body: `{{first_name}} —

I'll stop chasing if the trip is locked in elsewhere or off the table. Reply "done" or "later" and I'll close cleanly.

If the anniversary date is firm but the trip date is sliding, say so and I'll keep you on the calendar.

${SIGNOFF}`,
      ctaUrl: URLS.itinerary,
      isBreakup: true,
    },
    {
      step: 5,
      dayOffset: 60,
      channel: 'email',
      subject: 'Mid-October — the secret HHI week',
      body: `{{first_name}} —

If the dates didn't land, the underrated couples window is the second and third weeks of October. Water still 75°, beach quiet, oceanfront villa rates down 35%, no kids anywhere, and dinner reservations open up.

Heritage tournament week (mid-April) is loud and crowded. Easter is packed. Mid-October is the opposite — and the photography light at the Sea Pines beachfront in late afternoon is the best of the year.

Worth a 20-minute call.

${CALENDLY}

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
  ],
};

const COUPLES_NURTURE: Sequence = {
  id: 'couples-nurture-v1',
  segment: 'couples',
  variant: 'nurture',
  name: 'Couples & Anniversaries — 3-touch nurture',
  touches: [
    {
      step: 1,
      dayOffset: 3,
      channel: 'email',
      subject: 'Follow-up — the sunrise kayak nobody advertises',
      body: `{{first_name}} —

Picking up the thread.

Related thing worth knowing for an anniversary trip: the Inn at Harbour Town runs a sunrise champagne kayak with Outside Hilton Head — 6:45am launch from the Sea Pines lagoon, two-person tandem, returned by 9am. It's not on the website. You ask the front desk. We can pre-arrange it. It's the kind of detail that makes the trip a story instead of a vacation.

The Montage in Palmetto Bluff has a similar wow-factor option on the May River side — sunrise pontoon to Daufuskie for breakfast at the Old Daufuskie Crab Co.

Holler with the next question.

${SIGNOFF}`,
      ctaUrl: URLS.couplesPrimary,
    },
    {
      step: 2,
      dayOffset: 10,
      channel: 'email',
      subject: '20 minutes to lock the trip',
      body: `{{first_name}} —

We've been kicking the anniversary trip around. Easiest next step is 20 minutes on the phone — I'll show you two oceanfront options at your budget and the dinner rotation we'd build for the four nights.

You'll know on the call whether it's the right fit.

${CALENDLY}

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
    {
      step: 3,
      dayOffset: 21,
      channel: 'email',
      subject: 'A real anniversary week — sample itinerary',
      body: `{{first_name}} —

Here's the 5-night HHI itinerary we ran for a couple celebrating their 25th out of {{feeder_city}} last fall. South Beach Sea Pines oceanfront 2BR, dinner rotation, sunrise kayak, spa block at Heavenly Spa at the Westin, and a final-night drive to Octagon at Palmetto Bluff. All-in cost on page 5.

See it: ${URLS.couplesPrimary}

Useful as a sanity check on what an itinerary of this caliber actually costs.

${SIGNOFF}`,
      ctaUrl: URLS.couplesPrimary,
    },
  ],
};

// ---------------------------------------------------------------------------
// 04 — Honeymooners (cold + nurture)
// ---------------------------------------------------------------------------

const HONEYMOON_COLD: Sequence = {
  id: 'honeymoon-cold-v1',
  segment: 'honeymoon',
  variant: 'cold',
  name: 'Honeymooners — 5-touch cold',
  touches: [
    {
      step: 1,
      dayOffset: 0,
      channel: 'email',
      subject: 'Honeymoon at HHI — three things to know',
      body: `{{first_name}} —

Quick orientation if HHI is on the honeymoon shortlist:

1. Skip the villa rental, book a hotel or boutique inn. Inn at Harbour Town (Sea Pines), The Westin (Port Royal), Sonesta Resort, or the Inn & Club at Harbour Town for the walk-to-Quarterdeck setup. Villas sleep 8 and feel empty for two.

2. Pick your week carefully. Avoid Heritage week (mid-April) — the island fills with golf fans. Avoid graduation weekends (mid-May, late May) at the resort hotels — they fill with extended families. Mid-October and the second week of November are the secret.

3. Don't fly to SAV unless your flight is direct. HHH (Hilton Head Airport) has American direct from Charlotte and DC, which is the real shortcut.

${SIGNOFF}`,
      ctaUrl: URLS.honeymoonPrimary,
    },
    {
      step: 2,
      dayOffset: 5,
      channel: 'email',
      subject: 'The honeymoon mistake — and the move that fixes it',
      body: `{{first_name}} —

The mistake: booking a 5-night HHI honeymoon and trying to do all of it on the island. By night 3 you've eaten at the same three places and the trip plateaus.

The move: split nights between Sea Pines and Palmetto Bluff.

Nights 1–3: Inn at Harbour Town or oceanfront condo at South Beach. Walk to Quarterdeck at sunset, bike the Sea Pines paths, beach mornings.

Nights 4–5: Drive 35 minutes to Palmetto Bluff. Stay at Montage. Dinner at Octagon, breakfast at Buffalo's, river kayak with Outside Bluffton.

It changes the trip from "we did Hilton Head" to "we did the Lowcountry." Photography is dramatically better — beach light vs. live-oak alley light vs. May River sunrise — and the wedding party photo album has range.

We can build either side, or both.

${SIGNOFF}`,
      ctaUrl: URLS.honeymoonPrimary,
    },
    {
      step: 3,
      dayOffset: 12,
      channel: 'email',
      subject: 'Honeymoon plan — 20 minutes?',
      body: `{{first_name}} —

I run Hilton Ahead — custom HHI and Lowcountry honeymoon itineraries. Inn / hotel booking, dinner reservations at Charlie's L'Etoile Verte, Old Fort Pub, Octagon at Montage, plus sunrise charters, couples spa, and the post-ceremony day-after brunch if you need it.

20 minutes on the phone to pressure-test dates, hotels, and budget:
${CALENDLY}

No fee for the consult.

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
    {
      step: 4,
      dayOffset: 25,
      channel: 'email',
      subject: 'Closing the file?',
      body: `{{first_name}} —

I'll stop chasing if the honeymoon is booked elsewhere or off the table for now. Reply "done" or "later" and I'll close cleanly.

Congratulations on the wedding either way.

${SIGNOFF}`,
      ctaUrl: URLS.itinerary,
      isBreakup: true,
    },
    {
      step: 5,
      dayOffset: 60,
      channel: 'email',
      subject: 'One-year-anniversary trip back to HHI',
      body: `{{first_name}} —

If the honeymoon went somewhere else, file this for the one-year anniversary.

The first-anniversary trip to HHI is a real category — couples come back for a 3-night Sea Pines weekend, do the Quarterdeck sunset reservation, and frame the photo. Mid-October is the perfect week for it: beach quiet, water warm, oceanfront condo rates 35% below summer.

If you're still on the honeymoon search and timing slipped, I'm still here too.

${CALENDLY}

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
  ],
};

const HONEYMOON_NURTURE: Sequence = {
  id: 'honeymoon-nurture-v1',
  segment: 'honeymoon',
  variant: 'nurture',
  name: 'Honeymooners — 3-touch nurture',
  touches: [
    {
      step: 1,
      dayOffset: 3,
      channel: 'email',
      subject: 'Follow-up — the front-desk turn-down secret',
      body: `{{first_name}} —

Picking up the thread.

Related insight for the honeymoon: the Inn at Harbour Town does a turn-down service that includes a custom champagne note if the front desk knows it's a honeymoon. They don't advertise it. We pre-arrange it with the GM and it shows up on night one.

The Montage at Palmetto Bluff has its own version — a sunrise-river-boat for two that doesn't appear on any booking page. Same play: we ask in advance and it's on the schedule.

These are the kinds of details that make the honeymoon photo album range from "nice" to "framed."

Holler with whatever's next.

${SIGNOFF}`,
      ctaUrl: URLS.honeymoonPrimary,
    },
    {
      step: 2,
      dayOffset: 10,
      channel: 'email',
      subject: '20 minutes to lock the honeymoon',
      body: `{{first_name}} —

You've been kicking the dates around. Easiest next step is 20 minutes on the phone — I'll show you the Inn at Harbour Town vs. Montage at Palmetto Bluff comparison at your budget, plus the dinner rotation for the week.

You'll know on the call whether it's the right call.

${CALENDLY}

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
    {
      step: 3,
      dayOffset: 21,
      channel: 'email',
      subject: 'A real honeymoon week — sample itinerary',
      body: `{{first_name}} —

Here's the 6-night Lowcountry honeymoon we built for a couple out of {{feeder_city}} last May. Three nights at the Inn at Harbour Town (Sea Pines), three nights at Montage (Palmetto Bluff), full dinner lineup, sunrise charter, couples spa block, photographer on day 3 at the Sea Pines lighthouse, and the day-six Bluffton departure brunch. Full cost on page 6.

See it: ${URLS.honeymoonPrimary}

Useful as a benchmark for what a real Lowcountry honeymoon actually runs.

${SIGNOFF}`,
      ctaUrl: URLS.honeymoonPrimary,
    },
  ],
};

// ---------------------------------------------------------------------------
// 05 — Snowbirds (cold + nurture)
// ---------------------------------------------------------------------------

const SNOWBIRD_COLD: Sequence = {
  id: 'snowbird-cold-v1',
  segment: 'snowbird',
  variant: 'cold',
  name: 'Snowbirds — 5-touch cold',
  touches: [
    {
      step: 1,
      dayOffset: 0,
      channel: 'email',
      subject: 'Winter rental on HHI — what to know before you book',
      body: `{{first_name}} —

The HHI long-term winter rental market is different from the week-long vacation market and most platforms don't differentiate.

Three things that matter:

1. Inventory. The good 8–12-week winter rentals come out in August and lock by October. By December, what's left is the back-of-Sea-Pines stuff that was passed over.

2. Heat. A surprising number of older HHI villas have under-spec HVAC for sustained cold snaps. January can drop into the 30s overnight. Check the unit, check the heat pump age, check the windows.

3. Club access. Sea Pines Country Club, Long Cove, Wexford — guest play is restricted and most require a member sponsor. The play-as-you-go scene at Sea Pines public tracks (Atlantic Dunes, Heron Point) is the better fit for most winter renters.

${SIGNOFF}`,
      ctaUrl: URLS.snowbirdPrimary,
    },
    {
      step: 2,
      dayOffset: 5,
      channel: 'email',
      subject: 'HHI in February — the move and the trap',
      body: `{{first_name}} —

February on HHI is the dark-horse winter month. Water's cold, beach is empty, but the weather is 60-72° most days, the golf is dry, the dinner reservations open up, and the population on-island is half what it is in March.

The trap: most snowbird rentals are priced flat from January through March. February gets you 90% of March's weather at the same rate. Better play is to ask the owner for a Jan-March three-month block and negotiate 10–15% off the gross because it's still pre-season.

Best villas for snowbirds:

- South Forest Beach (walk to beach, walk to dinner, light traffic)
- Palmetto Dunes lagoon-front (kayak from your back door)
- Long Cove (if you have the member connect)
- Hilton Head Plantation (Old Fort Pub is a 3-minute drive)

${SIGNOFF}`,
      ctaUrl: URLS.snowbirdPrimary,
    },
    {
      step: 3,
      dayOffset: 12,
      channel: 'email',
      subject: 'Pressure-test your snowbird rental',
      body: `{{first_name}} —

I run Hilton Ahead — we vet winter rentals, handle the lease negotiation, line up the country club guest access (or membership reciprocity if your home club has one), and run on-island concierge for the months you're here. Dinner reservations, grocery delivery, dishwasher repair, the works.

20 minutes by phone to pressure-test what you're looking at:
${CALENDLY}

No fee for the consult.

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
    {
      step: 4,
      dayOffset: 25,
      channel: 'email',
      subject: 'Closing the file?',
      body: `{{first_name}} —

I'll stop chasing if the winter is locked in elsewhere or shelved.

Reply "done," "later," or "next year" and I'll handle it cleanly.

If you're still gathering options, hit reply with what you've narrowed to.

${SIGNOFF}`,
      ctaUrl: URLS.itinerary,
      isBreakup: true,
    },
    {
      step: 5,
      dayOffset: 60,
      channel: 'email',
      subject: 'HHI vs. Naples vs. Vero — honest take',
      body: `{{first_name}} —

If you're cross-shopping HHI against the Florida Gulf Coast, the honest framing:

HHI wins on golf course density, dinner scene, and walkability. Naples wins on January-February warmth (consistently 5–8° warmer) and the airport. Vero is the wash — quieter than HHI, smaller than Naples, dependent on whether you golf.

If golf is the trip's center of gravity, HHI is the right call. If beach-warm in February is the center of gravity, Naples is.

Happy to talk through either honestly.

${CALENDLY}

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
  ],
};

const SNOWBIRD_NURTURE: Sequence = {
  id: 'snowbird-nurture-v1',
  segment: 'snowbird',
  variant: 'nurture',
  name: 'Snowbirds — 3-touch nurture',
  touches: [
    {
      step: 1,
      dayOffset: 3,
      channel: 'email',
      subject: 'Follow-up — the off-platform rate trick',
      body: `{{first_name}} —

Picking up the thread.

Related thing worth knowing for an extended HHI stay: most of the Sea Pines and Palmetto Dunes property managers will negotiate a sub-market monthly rate if asked — but only by phone, never by the booking platform. The platform contracts lock the owner into a fee schedule; a direct call to the management company unlocks both the rate and the option for January–February pre-paid maintenance (HVAC service, pressure-wash, hot tub inspection) before you arrive.

We make those calls on behalf of clients. Worth knowing the lever exists either way.

For golf access from {{country_club}}, ask your pro about Sea Pines reciprocity — it's a phone call from your pro to theirs and a low-friction yes more often than not.

${SIGNOFF}`,
      ctaUrl: URLS.snowbirdPrimary,
    },
    {
      step: 2,
      dayOffset: 10,
      channel: 'email',
      subject: '20 minutes to lock the winter',
      body: `{{first_name}} —

You've been weighing the winter block. Easiest next step is 20 minutes by phone — I'll walk you through three vetted long-stay villas at your budget and the country club guest-access options from {{country_club}}.

The good 10-week winter blocks are largely gone by mid-October.

${CALENDLY}

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
    {
      step: 3,
      dayOffset: 21,
      channel: 'email',
      subject: 'A real winter — sample 10-week breakdown',
      body: `{{first_name}} —

Here's the actual 10-week winter rental package we ran for a couple out of {{feeder_city}} last January–March. Palmetto Dunes lagoon-front 3BR villa, Sea Pines reciprocity through their home club, weekly housekeeping, grocery setup for arrival, dinner reservation rotation for the first two weeks, and on-island concierge contact. All-in (rent + management) on page 7.

See it: ${URLS.snowbirdPrimary}

Useful as a benchmark for what an extended stay actually costs when managed right.

${SIGNOFF}`,
      ctaUrl: URLS.snowbirdPrimary,
    },
  ],
};

// ---------------------------------------------------------------------------
// 06 — Wedding Parties (cold + nurture)
// ---------------------------------------------------------------------------

const WEDDING_COLD: Sequence = {
  id: 'wedding-cold-v1',
  segment: 'wedding',
  variant: 'cold',
  name: 'Wedding Parties — 5-touch cold',
  touches: [
    {
      step: 1,
      dayOffset: 0,
      channel: 'email',
      subject: 'HHI / Palmetto Bluff wedding — guest concierge gap',
      body: `{{first_name}} —

Congratulations on the wedding planning. Quick note on a gap most HHI / Palmetto Bluff weddings hit:

The venue handles the ceremony and reception. The wedding planner handles the day-of run-of-show. But neither owns the 3-day guest experience for the 150 people flying in — the Thursday-night dinner recommendations, the Friday-morning beach plan, the welcome-bag drop at five different villas, the Saturday-morning golf for the groomsmen, the Sunday brunch overflow.

That's the gap we fill. Guest concierge for HHI / Bluffton wedding weekends. Welcome bag delivery, dinner reservation blocks at Skull Creek / Hudson's / Old Oyster Factory, group golf at Atlantic Dunes or May River, shuttle coordination, and a single point of contact for the wedding party's parents when something breaks.

${SIGNOFF}`,
      ctaUrl: URLS.weddingPrimary,
    },
    {
      step: 2,
      dayOffset: 5,
      channel: 'email',
      subject: 'The Thursday-night dinner problem',
      body: `{{first_name}} —

Specific scenario most HHI wedding parties hit:

It's Thursday. 80 of the 150 guests have arrived. There's no formal dinner planned — that's Friday and Saturday. By 5pm Thursday, the bride's phone has 14 texts asking where to eat. By 7pm, 30 people are at Skull Creek waiting 90 minutes for a table that doesn't exist because the host didn't know they were coming, and another 30 are split between the Coligny strip and Hudson's.

Three things fix it:

1. Pre-block a 60-person semi-private space at one of the two HHI restaurants that can actually host it (Skull Creek upstairs, Hudson's deck, or the Sea Pines Beach Club for a barefoot buffet).
2. Send the guest concierge sheet 14 days before the wedding with three approved Thursday-night restaurants by neighborhood.
3. Stand up a single contact line for the night.

${SIGNOFF}`,
      ctaUrl: URLS.weddingPrimary,
    },
    {
      step: 3,
      dayOffset: 12,
      channel: 'email',
      subject: 'HHI / PB wedding weekend support — 20 minutes?',
      body: `{{first_name}} —

I run Hilton Ahead — we provide guest concierge support for HHI / Palmetto Bluff weddings. Welcome bags, dinner blocks, rehearsal-dinner logistics, group golf at Atlantic Dunes / Heron Point / May River, transportation coordination, and a single line of contact for the weekend.

We work alongside your wedding planner, not against them. The planner runs the wedding. We run the guest weekend.

20 minutes by phone:
${CALENDLY}

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
    {
      step: 4,
      dayOffset: 25,
      channel: 'email',
      subject: 'Closing the file?',
      body: `{{first_name}} —

I'll stop chasing if the wedding weekend support is covered elsewhere or no longer needed.

Reply "covered" or "later" and I'll close cleanly.

If guest logistics are still a question mark, hit reply and I'll lay out what we typically handle.

${SIGNOFF}`,
      ctaUrl: URLS.itinerary,
      isBreakup: true,
    },
    {
      step: 5,
      dayOffset: 60,
      channel: 'email',
      subject: 'Honeymoon side of the equation',
      body: `{{first_name}} —

If the wedding weekend support is locked in, the other side of the same conversation is the honeymoon.

We build Lowcountry honeymoons that start the morning after the wedding — Inn at Harbour Town or Montage at Palmetto Bluff (or a 3-night split between the two), dinner reservations, sunrise charter, couples spa.

Worth 20 minutes if the honeymoon hasn't been planned yet.

${CALENDLY}

If the wedding date has slipped, holler with the new date and I'll re-diary.

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
  ],
};

const WEDDING_NURTURE: Sequence = {
  id: 'wedding-nurture-v1',
  segment: 'wedding',
  variant: 'nurture',
  name: 'Wedding Parties — 3-touch nurture',
  touches: [
    {
      step: 1,
      dayOffset: 3,
      channel: 'email',
      subject: 'Follow-up — the Sea Pines gate bottleneck',
      body: `{{first_name}} —

Picking up the thread.

Related thing worth knowing for the weekend: the Sea Pines security gate becomes a real bottleneck for guest arrivals on Friday afternoon. If 80 guests are arriving between 3-6pm to villas inside Sea Pines, the gate queue stacks 20 cars deep and the welcome bag delivery window gets blown.

The fix: we get a temporary commercial gate pass and stage the welcome bag drop Thursday afternoon before the rush. Same trick works for the rehearsal-dinner shuttle if the dinner is outside Sea Pines.

For the rehearsal dinner specifically — most HHI venues that can host 60+ are Old Oyster Factory, Sea Pines Beach Club, Frasers Tavern at the Inn at Harbour Town, or a private estate buyout. Each has a different lock-in window.

${SIGNOFF}`,
      ctaUrl: URLS.weddingPrimary,
    },
    {
      step: 2,
      dayOffset: 10,
      channel: 'email',
      subject: '20 minutes to map the weekend',
      body: `{{first_name}} —

You've been working the logistics. Easiest next step is 20 minutes on the phone — I'll walk you through what we typically own (guest concierge, welcome bags, Thursday and Sunday dinners, group golf, transport coordination) and where the seams are with your wedding planner.

You'll know on the call whether we're a fit.

${CALENDLY}

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
    {
      step: 3,
      dayOffset: 21,
      channel: 'email',
      subject: 'A real wedding weekend — sample run sheet',
      body: `{{first_name}} —

Here's the actual guest-weekend run sheet we ran for a 165-person Palmetto Bluff wedding last October. Thursday welcome dinner at Old Oyster Factory (62 guests), Friday morning beach setup at Sea Pines, Friday afternoon groomsmen golf at May River (16 players), welcome bag drop logistics for 88 villas, Sunday brunch overflow at Buffalo's. Full budget breakdown on page 8.

See it: ${URLS.weddingPrimary}

Useful as a benchmark for what end-to-end guest concierge support actually involves.

${SIGNOFF}`,
      ctaUrl: URLS.weddingPrimary,
    },
  ],
};

// ---------------------------------------------------------------------------
// 07 — Corporate Retreats (cold + nurture)
// ---------------------------------------------------------------------------

const CORPORATE_COLD: Sequence = {
  id: 'corporate-cold-v1',
  segment: 'corporate',
  variant: 'cold',
  name: 'Corporate Retreats — 5-touch cold',
  touches: [
    {
      step: 1,
      dayOffset: 0,
      channel: 'email',
      subject: 'HHI corporate retreat — venue framing',
      body: `{{first_name}} —

If a Hilton Head corporate retreat is in scope, the venue decision is the single highest-leverage call you'll make.

Four real options, ranked by attendee experience per dollar:

1. Sea Pines Resort (Inn at Harbour Town + Plantation Club). Walk to Quarterdeck, group golf at Harbour Town / Atlantic Dunes / Heron Point. Mid-range cost, top-quartile experience.

2. Palmetto Bluff (Montage). Best-in-class venue, river setting, May River golf. Cost is 60-80% higher than Sea Pines.

3. Westin Hilton Head. Solid meeting space, oceanfront, banquet-default vibe. Best price-per-head if attendee experience is secondary.

4. Omni Oceanfront. Similar to Westin, beachfront, larger plenary capacity.

For most leadership-team-sized retreats, options 1 and 2 are the conversation. Options 3 and 4 are the budget fallback.

${SIGNOFF}`,
      ctaUrl: URLS.corporatePrimary,
    },
    {
      step: 2,
      dayOffset: 5,
      channel: 'email',
      subject: 'The retreat mistake I see most often',
      body: `{{first_name}} —

The mistake: booking a corporate retreat around the meeting space and treating the off-hours programming as an afterthought.

Real-world failure: 28 sales leaders fly in on Sunday, sit in a Westin ballroom for two 8-hour days of strategy, and the only group activity is an open-bar reception with a buffet. Day 3 they fly home. Net memorable moment: zero. The retreat costs $4,200/head and produces no story.

The fix: build the retreat around two genuine experiences. The first is dinner at Quarterdeck at Harbour Town — sunset, lighthouse, group photo, real cocktails. The second is half-day group golf at Atlantic Dunes (or a fishing charter, or a sailing race in Calibogue Sound) so the non-golfers have an option.

Suddenly the retreat is a story. Attendees mention it in the recruiting pipeline for a year.

${SIGNOFF}`,
      ctaUrl: URLS.corporatePrimary,
    },
    {
      step: 3,
      dayOffset: 12,
      channel: 'email',
      subject: '20 minutes on the retreat?',
      body: `{{first_name}} —

I run Hilton Ahead — we handle corporate retreats on HHI and Palmetto Bluff end-to-end. Venue sourcing and contract negotiation, group golf, off-site dinners (Quarterdeck buyout, Old Fort Pub private room, Octagon at Montage), transportation, attendee welcome packs, on-island contact for the days the retreat is live.

We work for groups up to 80. Above 80, the Westin or Omni become the only options.

20 minutes by phone:
${CALENDLY}

No fee for the consult.

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
    {
      step: 4,
      dayOffset: 25,
      channel: 'email',
      subject: 'Closing the file?',
      body: `{{first_name}} —

I'll stop chasing if the retreat is locked in or shelved.

Reply "booked," "later," or "next quarter" and I'll close cleanly.

If it's still up in the air, hit reply with what you're stuck on.

${SIGNOFF}`,
      ctaUrl: URLS.itinerary,
      isBreakup: true,
    },
    {
      step: 5,
      dayOffset: 60,
      channel: 'email',
      subject: 'Sales kickoff next quarter?',
      body: `{{first_name}} —

If the leadership offsite is past, the next planning window is the sales kickoff or board retreat next quarter.

The under-the-radar HHI window for Q1 corporate retreats is mid-January through mid-February. Weather averages 60°, golf is open, restaurants have actual availability, and room rates at the Westin and Inn at Harbour Town are 25–35% below peak.

Worth 20 minutes if SKO planning is starting now.

${CALENDLY}

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
  ],
};

const CORPORATE_NURTURE: Sequence = {
  id: 'corporate-nurture-v1',
  segment: 'corporate',
  variant: 'nurture',
  name: 'Corporate Retreats — 3-touch nurture',
  touches: [
    {
      step: 1,
      dayOffset: 3,
      channel: 'email',
      subject: 'Follow-up — the Quarterdeck buyout window',
      body: `{{first_name}} —

Picking up the thread.

Related thing worth knowing for a leadership retreat: the Quarterdeck at Harbour Town will do a full buyout for groups of 40+ on Sunday or Monday nights with 60+ days notice. Tuesday-Saturday they won't do a full buyout but will hold the upper deck for 24-30 guests. Difference matters for the photo and the cocktail flow.

For golf, the move with a mixed-handicap group is to play Atlantic Dunes (more forgiving than Harbour Town for high-handicap attendees) and let the better golfers walk to Harbour Town for the back-9 if they want — they're across the parking lot from each other.

The Westin's meeting-space contract has flexibility on F&B minimums if asked. Most planners don't ask.

${SIGNOFF}`,
      ctaUrl: URLS.corporatePrimary,
    },
    {
      step: 2,
      dayOffset: 10,
      channel: 'email',
      subject: '20 minutes to scope the retreat',
      body: `{{first_name}} —

You've been working the retreat. Easiest next step is 20 minutes by phone — I'll walk you through three venue scenarios at your budget, the off-hours programming, and the rough timeline for venue lock and contract.

You'll know on the call whether we're a fit.

${CALENDLY}

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
    {
      step: 3,
      dayOffset: 21,
      channel: 'email',
      subject: 'A real retreat — sample run-of-show + budget',
      body: `{{first_name}} —

Here's the actual run-of-show and budget for a 32-person leadership offsite we ran for a PE-backed services firm out of {{feeder_city}} last March. Inn at Harbour Town for housing, two full days of meeting space, Quarterdeck dinner buyout for Tuesday, Atlantic Dunes group golf for Wednesday afternoon, sunset sail with Calibogue Cruises for Thursday, full transport from SAV. All-in cost per attendee on page 7.

See it: ${URLS.corporatePrimary}

Useful as a benchmark for retreat budgeting and programming density.

${SIGNOFF}`,
      ctaUrl: URLS.corporatePrimary,
    },
  ],
};

// ---------------------------------------------------------------------------
// 08 — General / Unknown fallback (cold only — nurture promotes to a segment)
// ---------------------------------------------------------------------------

const GENERAL_COLD: Sequence = {
  id: 'general-cold-v1',
  segment: 'general',
  variant: 'cold',
  name: 'General Fallback — 5-touch cold',
  touches: [
    {
      step: 1,
      dayOffset: 0,
      channel: 'email',
      subject: 'Hilton Head — orient before you book',
      body: `{{first_name}} —

Quick orientation before you book a Hilton Head trip:

The island isn't one place. It's South Beach (the family-and-couples Sea Pines side), Palmetto Dunes (the upscale walkable resort), Forest Beach (the public-beach Coligny anchor), and Hilton Head Plantation (the quiet north end). Each is a different trip. Picking wrong is the most common HHI mistake — you book a 4BR villa near the highway and discover the beach is a 12-minute walk past the gate.

Two pieces worth reading before you commit:

1. The Sea Pines vs. Palmetto Dunes breakdown.
2. The HHI restaurants you should reserve before you fly.

Not pitching anything yet. Just thought you should have the map.

${SIGNOFF}`,
      ctaUrl: URLS.generalPrimary,
    },
    {
      step: 2,
      dayOffset: 5,
      channel: 'email',
      subject: 'Three HHI mistakes nobody warns you about',
      body: `{{first_name}} —

Three things first-time HHI planners blow:

1. Booking the villa before the dinner reservations. Skull Creek and Hudson's both fill 2–3 weeks ahead for weekend nights. You want the dinner cadence locked before you pick the week.

2. Picking Heritage week (mid-April) because it sounds prestigious. It's a tournament. The island fills with golf fans, room rates double, and dinner reservations vanish. Mid-October has 85% of the weather, none of the crowd.

3. Driving from Atlanta and skipping the back-island routes. The Highway 278 corridor stacks up Friday afternoon. The Cross Island Parkway shortcut saves you 25 minutes.

I'll send a few more like this over the next couple weeks.

${SIGNOFF}`,
      ctaUrl: URLS.generalPrimary,
    },
    {
      step: 3,
      dayOffset: 12,
      channel: 'email',
      subject: 'What kind of HHI trip is it?',
      body: `{{first_name}} —

So I can stop guessing — what kind of trip is this?

- Golf with the boys?
- Family week with kids?
- Anniversary or couples weekend?
- Honeymoon?
- Wedding logistics?
- Corporate offsite?
- 8+ weeks of winter rental?

Hit reply with one line. I'll send the playbook that actually fits.

If none of those — just say "general." There's a playbook for that too.

${SIGNOFF}`,
      ctaUrl: URLS.itinerary,
    },
    {
      step: 4,
      dayOffset: 25,
      channel: 'email',
      subject: 'Closing the file?',
      body: `{{first_name}} —

I'll stop chasing if the HHI trip is booked or shelved. Reply "done" or "later" and I'll close cleanly.

If the timing slipped, say so and I'll diary it.

${SIGNOFF}`,
      ctaUrl: URLS.itinerary,
      isBreakup: true,
    },
    {
      step: 5,
      dayOffset: 60,
      channel: 'email',
      subject: 'Mid-October — the cleanest HHI week of the year',
      body: `{{first_name}} —

If your spring/summer dates didn't lock, the underrated window is the second and third weeks of October.

Water's still 75°. Beach is half-empty. Villa rates are 30–40% below summer. Restaurants have walk-in availability. The light at the Sea Pines beachfront is the best of the year.

Schools are back in session, but if a 4-day weekend works, the week is unmatched.

20 minutes by phone if you want to talk through dates and budget:
${CALENDLY}

${SIGNOFF}`,
      ctaUrl: CALENDLY,
    },
  ],
};

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

export const SEQUENCES: Sequence[] = [
  GOLF_COLD,
  GOLF_NURTURE,
  FAMILY_COLD,
  FAMILY_NURTURE,
  COUPLES_COLD,
  COUPLES_NURTURE,
  HONEYMOON_COLD,
  HONEYMOON_NURTURE,
  SNOWBIRD_COLD,
  SNOWBIRD_NURTURE,
  WEDDING_COLD,
  WEDDING_NURTURE,
  CORPORATE_COLD,
  CORPORATE_NURTURE,
  GENERAL_COLD,
];

const SEQUENCES_BY_ID = new Map<string, Sequence>(
  SEQUENCES.map((s) => [s.id, s]),
);

export function getSequence(id: string): Sequence | undefined {
  return SEQUENCES_BY_ID.get(id);
}

/**
 * Resolve a sequence by segment + variant. Falls back to the general cold
 * sequence for unknown / unmapped segments; falls back to undefined if the
 * caller asks for a nurture variant for the general fallback (we promote
 * generals into a real segment before nurturing).
 */
export function getSequenceForSegment(
  segment: string,
  variant: SequenceVariant,
): Sequence | undefined {
  const seg = segment.toLowerCase() as SequenceSegment;
  const direct = SEQUENCES.find((s) => s.segment === seg && s.variant === variant);
  if (direct) return direct;
  if (variant === 'cold') return GENERAL_COLD;
  return undefined;
}
