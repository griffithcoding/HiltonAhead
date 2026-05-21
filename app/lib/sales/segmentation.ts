/**
 * Sales-prospect segmentation.
 *
 * Pure inference — no DB calls, no side effects, no env reads. Maps the raw
 * signals attached to a prospect (campaign slug, landing URL, intake notes,
 * party shape, UTM content) to one of the canonical sales_segment values.
 *
 * Rules apply in priority order; first match wins. Confidence is the count of
 * independent matches divided by 4 (capped at 1). `signals` is a debug array
 * — passed straight into sales_touches.metadata so the admin dashboard can
 * show why a prospect was bucketed where they were.
 *
 * Add a new segment by:
 *   1. Adding the slug to Segment + SEGMENT_LIST
 *   2. Wiring the campaign-slug, page-path, and keyword-regex hints below
 *   3. Adding a matching sequence entry in data/salesSequences.ts
 */

export type Segment =
  | 'golf'
  | 'family'
  | 'couples'
  | 'honeymoon'
  | 'snowbird'
  | 'wedding'
  | 'corporate'
  | 'unknown';

export const SEGMENT_LIST: ReadonlyArray<Segment> = [
  'golf',
  'family',
  'couples',
  'honeymoon',
  'snowbird',
  'wedding',
  'corporate',
  'unknown',
];

export interface SegmentSignals {
  email?: string;
  fullName?: string;
  intakeNotes?: string;
  sourcePage?: string; // landing path, e.g. '/hilton-head-golf-packages'
  sourceCampaign?: string; // campaign slug
  partySize?: number;
  age?: number;
  kids?: boolean;
  utmContent?: string;
}

export interface SegmentResult {
  segment: Segment;
  confidence: number;
  signals: string[];
}

// ---------------------------------------------------------------------------
// Rule banks
// ---------------------------------------------------------------------------

/** campaign-slug-substring → segment */
const CAMPAIGN_HINTS: ReadonlyArray<[RegExp, Exclude<Segment, 'unknown'>]> = [
  [/golf/i, 'golf'],
  [/wedding|bridal|bachelorette/i, 'wedding'],
  [/honeymoon/i, 'honeymoon'],
  [/family|spring-break|easter|thanksgiving/i, 'family'],
  [/couples|anniversary/i, 'couples'],
  [/snowbird|winter|long-stay/i, 'snowbird'],
  [/corporate|retreat|offsite|sko|kickoff/i, 'corporate'],
];

/** landing-path → segment */
const PAGE_HINTS: ReadonlyArray<[RegExp, Exclude<Segment, 'unknown'>]> = [
  [/\/hilton-head-golf-packages/i, 'golf'],
  [/\/trip-types\/golf-packages/i, 'golf'],
  [/\/hilton-head-weddings|\/hilton-head-wedding-inquiry/i, 'wedding'],
  [/\/trip-types\/weddings/i, 'wedding'],
  [/\/hilton-head-family-trip-planner/i, 'family'],
  [/\/trip-types\/family-trip-planner/i, 'family'],
  [/\/hilton-head-spring-break/i, 'family'],
  [/\/hilton-head-thanksgiving/i, 'family'],
  [/\/hilton-head-honeymoon/i, 'honeymoon'],
  [/\/trip-types\/honeymoon/i, 'honeymoon'],
  [/\/hilton-head-winter-rental/i, 'snowbird'],
  [/\/trip-types\/winter-rental/i, 'snowbird'],
  [/\/hilton-head-anniversary|\/trip-types\/oceanfront-villas/i, 'couples'],
  [/\/hilton-head-corporate|\/trip-types\/corporate/i, 'corporate'],
];

/**
 * Keyword regex bank. Order matters only in that higher-specificity patterns
 * (wedding, honeymoon, snowbird) are listed first so a "wife"-style couples
 * keyword doesn't pre-empt a clearer honeymoon signal.
 */
const KEYWORD_HINTS: ReadonlyArray<[RegExp, Exclude<Segment, 'unknown'>]> = [
  [/\b(wedding|bachelorette|bridal|ceremony|reception|elopement|bridesmaid|groomsmen)\b/i, 'wedding'],
  [/\b(honeymoon|just married|newlywed|wedding night)\b/i, 'honeymoon'],
  [/\b(corporate|company retreat|offsite|off-site|conference|team building|sales kickoff|sko|board retreat|leadership offsite)\b/i, 'corporate'],
  [/\b(snowbird|winter rental|january|february|extended stay|monthly rental|retiree|retired|long-stay|long stay|10 weeks|three months)\b/i, 'snowbird'],
  [/\b(golf|tee time|harbour town|heritage|fourball|foursome|may river golf|atlantic dunes|heron point)\b/i, 'golf'],
  [/\b(kids|children|toddler|babysit|nanny|stroller|car seat|kid friendly|kid-friendly|pony rides|lawton stables|sandbox museum|family of)\b/i, 'family'],
  [/\b(anniversary|just the two of us|wife|husband|partner|couples weekend|date night)\b/i, 'couples'],
];

// ---------------------------------------------------------------------------
// Inference
// ---------------------------------------------------------------------------

/**
 * Infer a sales_segment from whatever signals are available. Priority order:
 *   1. sourceCampaign slug hints
 *   2. sourcePage path hints
 *   3. intakeNotes keyword scan
 *   4. partySize + kids shape hints
 *   5. fallback 'unknown'
 *
 * Multiple rules can match — first match decides the segment, but every
 * matching signal contributes to confidence and is appended to the signals
 * array. Confidence is matches/4 capped at 1.
 */
export function inferSegment(s: SegmentSignals): SegmentResult {
  const signals: string[] = [];
  let segment: Segment = 'unknown';

  // 1) Campaign slug — strongest single signal: the operator already labeled it.
  if (s.sourceCampaign) {
    for (const [re, seg] of CAMPAIGN_HINTS) {
      if (re.test(s.sourceCampaign)) {
        if (segment === 'unknown') segment = seg;
        signals.push(`source_campaign=${s.sourceCampaign}->${seg}`);
        break;
      }
    }
  }

  // 2) Landing-page path.
  if (s.sourcePage) {
    for (const [re, seg] of PAGE_HINTS) {
      if (re.test(s.sourcePage)) {
        if (segment === 'unknown') segment = seg;
        signals.push(`source_page=${s.sourcePage}->${seg}`);
        break;
      }
    }
  }

  // 3) Intake-notes keyword scan. Can fire multiple times — each adds
  //    confidence; first match wins the segment if nothing earlier matched.
  if (s.intakeNotes && s.intakeNotes.length > 0) {
    for (const [re, seg] of KEYWORD_HINTS) {
      const m = s.intakeNotes.match(re);
      if (m) {
        if (segment === 'unknown') segment = seg;
        signals.push(`keyword=${m[0].toLowerCase()}->${seg}`);
      }
    }
  }

  // 4) Party-shape hints — least specific, used only when we have nothing else.
  if (typeof s.partySize === 'number' && Number.isFinite(s.partySize)) {
    if (s.partySize >= 8) {
      // Big party — could be golf or wedding. Don't override an earlier match.
      if (segment === 'unknown') {
        segment = 'golf'; // golf is the more common "8+ planners" case
        signals.push(`party_size=${s.partySize}->golf(default)`);
      } else {
        signals.push(`party_size=${s.partySize}`);
      }
    } else if (s.partySize <= 2) {
      if (segment === 'unknown') {
        segment = 'couples';
        signals.push(`party_size=${s.partySize}->couples`);
      } else {
        signals.push(`party_size=${s.partySize}`);
      }
    } else if (s.partySize >= 3 && s.partySize <= 6 && s.kids) {
      if (segment === 'unknown') {
        segment = 'family';
        signals.push(`party_size=${s.partySize}+kids->family`);
      } else {
        signals.push(`party_size=${s.partySize}+kids`);
      }
    }
  } else if (s.kids === true && segment === 'unknown') {
    segment = 'family';
    signals.push('kids=true->family');
  }

  // 5) UTM content tag — softest signal, only logged.
  if (s.utmContent) {
    signals.push(`utm_content=${s.utmContent}`);
  }

  const confidence =
    segment === 'unknown'
      ? 0
      : Math.min(1, signals.filter((x) => x.includes('->')).length / 4);

  return { segment, confidence, signals };
}

// ---------------------------------------------------------------------------
// Row adapter — maps a sales_prospects row into SegmentSignals
// ---------------------------------------------------------------------------

/**
 * Shape of the columns we read off sales_prospects. Loose typing on purpose
 * — every call site reads from supabase which returns unknown-ish data.
 */
export interface ProspectRowLike {
  email?: string | null;
  full_name?: string | null;
  source_notes?: string | null;
  source_campaign_slug?: string | null;
  party_size_guess?: number | null;
  enrichment_data?: Record<string, unknown> | null;
}

/**
 * Map a sales_prospects row (plus its source-campaign slug, joined separately)
 * to the SegmentSignals contract.
 *
 * The row alone doesn't carry landing-page or UTM context; the capture route
 * is the place to thread those through. This adapter is mostly used by an
 * admin-side "re-segment" action that re-runs inference against a stored row.
 */
export function inferSegmentFromProspectRow(
  row: ProspectRowLike,
  extras?: { sourcePage?: string; utmContent?: string },
): SegmentResult {
  return inferSegment({
    email: row.email ?? undefined,
    fullName: row.full_name ?? undefined,
    intakeNotes: row.source_notes ?? undefined,
    sourceCampaign: row.source_campaign_slug ?? undefined,
    partySize: row.party_size_guess ?? undefined,
    sourcePage: extras?.sourcePage,
    utmContent: extras?.utmContent,
  });
}
