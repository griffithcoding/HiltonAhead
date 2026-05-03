/**
 * Direct-sponsorship inventory — display ad slots sold to local businesses.
 *
 * Three SKUs map here:
 *   - Featured Pin     → top-of-category card on /local/[industry] pages
 *   - Story Sponsor    → top-of-story branded block
 *   - Page Display     → topical-page banner (e.g. wedding venue on /hilton-head-weddings)
 *
 * Data is static for v1 — when rotation needs outpace the file (multiple
 * sponsors per slot per month), promote to the `sponsorships` table per
 * the plan. Until then, editing this file is the sales workflow.
 *
 * Unsold slots fall back to a "Your business here" house ad linking to
 * /advertise — the SponsorSlot component handles that automatically.
 */

export type SponsorSurface =
  | 'local-industry'   // /local/[industry] page header
  | 'story'            // top of a /stories/[slug] page
  | 'topic-page';      // any topical landing page (weddings, golf, etc.)

export interface SponsorshipSlot {
  /** Unique, URL-safe slot id used in tracking + page placements. */
  id: string;
  surface: SponsorSurface;
  /** Friendly description for the admin/sales side. */
  label: string;
}

export interface ActiveSponsorship {
  slotId: string;
  /** Internal sponsor id — short slug like 'palmetto-bay-yacht'. */
  sponsorId: string;
  /** Brand name shown on the ad. */
  sponsorName: string;
  /** Headline copy on the ad block (max ~50 chars). */
  headline: string;
  /** Supporting line (max ~120 chars). */
  body: string;
  /** Destination URL — outbound, will carry rel="sponsored nofollow". */
  url: string;
  /** Optional logo URL. Renders as text-only when omitted. */
  logoUrl?: string;
  /** ISO date — slot becomes active. */
  startAt: string;
  /** ISO date — slot expires. */
  endAt: string;
}

/**
 * Defined inventory. Add a slot here, then drop <SponsorSlot id="..."> on
 * the page. Pages with no slot defined here render a fallback ad to /advertise.
 */
export const SPONSORSHIP_SLOTS: SponsorshipSlot[] = [
  {
    id: 'local-restaurants-pin',
    surface: 'local-industry',
    label: 'Top pin on /local/restaurants',
  },
  {
    id: 'local-golf-pin',
    surface: 'local-industry',
    label: 'Top pin on /local/golf',
  },
  {
    id: 'local-weddings-pin',
    surface: 'local-industry',
    label: 'Top pin on /local/weddings',
  },
  {
    id: 'local-spas-wellness-pin',
    surface: 'local-industry',
    label: 'Top pin on /local/spas-wellness',
  },
  {
    id: 'topic-weddings-banner',
    surface: 'topic-page',
    label: 'Banner on /hilton-head-weddings',
  },
  {
    id: 'topic-golf-banner',
    surface: 'topic-page',
    label: 'Banner on /hilton-head-golf-packages',
  },
  {
    id: 'topic-honeymoon-banner',
    surface: 'topic-page',
    label: 'Banner on /hilton-head-honeymoon',
  },
];

/**
 * Active sponsor bookings. Empty by default — house ad ("Your business here")
 * fires until rows exist here. Add a row when a deal is signed and Stripe
 * payment clears.
 */
export const ACTIVE_SPONSORSHIPS: ActiveSponsorship[] = [];

export function getSlot(id: string): SponsorshipSlot | undefined {
  return SPONSORSHIP_SLOTS.find((s) => s.id === id);
}

export function getActiveSponsor(slotId: string, now: Date = new Date()): ActiveSponsorship | undefined {
  return ACTIVE_SPONSORSHIPS.find((s) => {
    if (s.slotId !== slotId) return false;
    const start = new Date(s.startAt);
    const end = new Date(s.endAt);
    return start <= now && now <= end;
  });
}
