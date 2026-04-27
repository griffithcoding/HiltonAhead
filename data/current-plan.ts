/**
 * The current operational plan for Hilton Ahead Travel Co.
 *
 * Renders in the right-sidebar of /admin/(gated). Updated by the
 * `summary-plan` skill at the end of working sessions, or hand-edited
 * when priorities shift.
 *
 * Editorial intent: this is an honest, current view of what's blocking,
 * what's next, and what's on the longer-arc roadmap. Don't pad it,
 * don't aspirational-list. If a thing is done, mark it `done` (or
 * delete it). If a thing is uncertain, put it under `strategic` not `next`.
 */

export type PlanItemPriority =
  | 'blocker' // can't proceed without resolution; user-action required
  | 'waiting' // decision waiting on user; no other progress blocked
  | 'next' // concrete step for next working session
  | 'short-term' // 1-2 weeks, approved direction
  | 'strategic'; // longer-arc, interest expressed but not committed

export type PlanItemStatus = 'pending' | 'in-progress' | 'done';

export interface PlanItem {
  /** Stable ID — referenced by `blockedBy` on dependent items. */
  id: string;
  text: string;
  /** Optional one-line elaboration. */
  detail?: string;
  priority: PlanItemPriority;
  status: PlanItemStatus;
  /** "5 min", "1 week", "ongoing". */
  estimate?: string;
  /** External link (Vercel, Supabase, Resend dashboards) or internal path. */
  link?: string;
  /** ID of an item that must be done first. */
  blockedBy?: string;
}

export interface ShippedItem {
  text: string;
  /** Short commit SHA. */
  commit?: string;
  /** File count for context. */
  files?: number;
}

export interface CurrentPlan {
  updatedAt: string; // YYYY-MM-DD
  generatedFrom: string; // session slug for traceability
  /** Recently shipped — last session or two only, history > 2 weeks should be deleted. */
  shipped: ShippedItem[];
  items: PlanItem[];
}

// ============================================================================
// THE PLAN
// ============================================================================

export const currentPlan: CurrentPlan = {
  updatedAt: '2026-04-26',
  generatedFrom: 'session-2026-04-26-newsletter-mvp',

  shipped: [
    {
      text: 'Newsletter MVP — cron + render + send + unsubscribe + DB migration',
      commit: '781cb1f',
      files: 14,
    },
    { text: 'CEO call-down skill (project-level)' },
    { text: 'Agent-sales skill (project-level)' },
    { text: 'Summary-plan skill (project-level)' },
    { text: 'Right-sidebar plan view in /admin/(gated)', commit: '66e4dff' },
    { text: 'Mobile responsive overhaul — header drawer, scaled typography', commit: '925fe39' },
    {
      text:
        'Pizza, Transportation, Home-Services directories + pizza tier-list blog post',
    },
  ],

  items: [
    // ——— BLOCKERS — user action required ————————————————————————————————
    {
      id: 'env-vars-vercel',
      text: 'Set 4 env vars in Vercel (Production scope)',
      detail:
        'CRON_SECRET, NEWSLETTER_SIGNING_SECRET, NEWSLETTER_FROM_EMAIL, SUPABASE_SERVICE_ROLE_KEY',
      priority: 'blocker',
      status: 'pending',
      estimate: '10 min',
      link: 'https://vercel.com/dashboard',
    },
    {
      id: 'apply-migration-008',
      text: 'Apply migration 008 in Supabase SQL editor',
      detail:
        'Creates newsletter_issues table; adds unsubscribe_token to subscribers.',
      priority: 'blocker',
      status: 'pending',
      estimate: '2 min',
      link: 'https://supabase.com/dashboard',
    },
    {
      id: 'verify-resend-domain',
      text: 'Verify hiltonahead.com in Resend',
      detail:
        'Add SPF + DKIM + DMARC records at Bluehost. Switch alias to newsletter@hiltonahead.com after Verified.',
      priority: 'blocker',
      status: 'pending',
      estimate: '30 min + DNS propagation',
      link: 'https://resend.com/domains',
    },

    // ——— NEXT — concrete steps after blockers clear —————————————————————
    {
      id: 'redeploy-vercel',
      text: 'Redeploy latest Production deployment so new env vars apply',
      priority: 'next',
      status: 'pending',
      estimate: '2 min',
      blockedBy: 'env-vars-vercel',
    },
    {
      id: 'test-cron-curl',
      text: 'Test cron via Invoke-RestMethod with Bearer CRON_SECRET',
      detail: 'Expect a 200 response + an approval email to wgriffith1218@gmail.com.',
      priority: 'next',
      status: 'pending',
      estimate: '5 min',
      blockedBy: 'redeploy-vercel',
    },
    {
      id: 'gmail-filter',
      text: 'Add Gmail filter so [Approval needed] emails skip spam',
      priority: 'next',
      status: 'pending',
      estimate: '2 min',
    },

    // ——— WAITING — decision required, no other progress blocked ——————————
    {
      id: 'stripe-decision',
      text: 'Decide: Stripe self-serve checkout, or invoice-and-pay for v1',
      detail:
        'Self-serve unlocks Compass + Charter retainer + B2B Listed/Featured auto-renewal. Invoice-only ships faster.',
      priority: 'waiting',
      status: 'pending',
    },

    // ——— SHORT-TERM (1-2 weeks, approved) ————————————————————————————
    {
      id: 'wire-pricing-tiers',
      text: 'Wire pricing tiers on /services and /partners',
      detail:
        'Compass $295 / Charter $895+7% / Heritage $2,500+10% / Listed $600 / Featured $1,800 / Signature $4,800.',
      priority: 'short-term',
      status: 'pending',
      estimate: '~1 week',
      blockedBy: 'stripe-decision',
    },
    {
      id: 'when-to-book-calendar',
      text: 'Build "When to Book Hilton Head" interactive calendar',
      detail:
        'Lead-magnet, gated by email. Pulls from data/months.ts + data/events.ts.',
      priority: 'short-term',
      status: 'pending',
      estimate: '~1 week',
    },
    {
      id: 'columbia-outreach-organic',
      text: 'Columbia SC outreach campaign — bootstrap version, $0 cash',
      detail:
        'Manual cold email + LinkedIn organic + Reddit + FB groups + /from/columbia page. 30-50 leads / 90 days target.',
      priority: 'short-term',
      status: 'pending',
      estimate: '8-12 hrs/week ongoing',
    },

    // ——— STRATEGIC BACKLOG — interest expressed, no commitment yet ————————
    {
      id: 'fishing-charters-directory',
      text: 'Fishing charters directory + blog post',
      detail:
        '~5K monthly searches, $400-$1,200 per booking. Captains pay 10-15% commission and $600-1,800/yr placement. Tier 1 in CEO brainstorm.',
      priority: 'strategic',
      status: 'pending',
      estimate: 'quick win (<3 days)',
    },
    {
      id: 'dolphin-tours-directory',
      text: 'Dolphin tours / eco-tours directory',
      detail:
        '~4K monthly searches, near-100% transactional intent. FareHarbor affiliate commissions.',
      priority: 'strategic',
      status: 'pending',
      estimate: 'quick win (<3 days)',
    },
    {
      id: 'dog-friendly-mega-post',
      text: 'Dog-friendly Hilton Head mega-post + filter overlay',
      detail:
        '8K+ combined monthly searches across "dog friendly beaches/restaurants/rentals". Evergreen, low competition. Strong email-list builder.',
      priority: 'strategic',
      status: 'pending',
      estimate: 'quick win (<3 days)',
    },
    {
      id: 'wedding-vendors-hub',
      text: 'Wedding vendors hub (photographers, florists, DJs, planners)',
      detail:
        'HHI does 800+ weddings/yr at avg $50K+. Vendors will pay $2,400-$4,800/yr for top placement.',
      priority: 'strategic',
      status: 'pending',
      estimate: 'moderate (1-2 weeks)',
    },
    {
      id: 'itinerary-builder-tool',
      text: 'Interactive itinerary-builder tool (5-question quiz → emailed PDF)',
      detail:
        'Highest single conversion lever — 8-15% close vs 1-2% for static pages. Direct funnel to concierge service.',
      priority: 'strategic',
      status: 'pending',
      estimate: 'substantial (1+ month)',
    },
    {
      id: 'feeder-city-pages',
      text: '12 /from/[city] landing pages',
      detail:
        'Atlanta · Charlotte · Raleigh-Durham · DC · NYC · Boston · Philadelphia · Cincinnati · Nashville · Cleveland · Greenville · Columbia.',
      priority: 'strategic',
      status: 'pending',
    },
    {
      id: 'state-of-hh-report',
      text: 'Annual "State of Hilton Head Travel" report (PDF, press-bait)',
      priority: 'strategic',
      status: 'pending',
    },
    {
      id: 'whitelabel-boutique-hotels',
      text: 'White-label trip planning for 8-12 boutique hotels',
      detail:
        'Approach Sonesta, Inn at Harbour Town, Marriott Surfwatch, Disney villas. $30-80K ARR per signed hotel.',
      priority: 'strategic',
      status: 'pending',
    },
    {
      id: 'pinterest-engine',
      text: 'Pinterest infographic engine — HH Restaurant Tier List flagship',
      priority: 'strategic',
      status: 'pending',
    },
    {
      id: 'newsletter-v2',
      text: 'Newsletter v2 — admin UI, double opt-in, segmentation by interests[]',
      priority: 'strategic',
      status: 'pending',
    },
    {
      id: 'agent-sales-scaling-rule',
      text: 'Reinvest 30-50% of organic-booked revenue into Meta ad test',
      detail:
        'Trigger only after 5 trips booked from organic outreach. No ad spend before that.',
      priority: 'strategic',
      status: 'pending',
    },
  ],
};

// ============================================================================
// helpers
// ============================================================================

export function getActiveItems(): PlanItem[] {
  return currentPlan.items.filter((i) => i.status !== 'done');
}

export function groupByPriority(): Record<PlanItemPriority, PlanItem[]> {
  const out: Record<PlanItemPriority, PlanItem[]> = {
    blocker: [],
    waiting: [],
    next: [],
    'short-term': [],
    strategic: [],
  };
  for (const item of getActiveItems()) {
    out[item.priority].push(item);
  }
  return out;
}
