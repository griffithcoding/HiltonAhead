/**
 * Heritage Week 2027 sponsor slots.
 *
 * Four category-exclusive slots tied to the Apr 12–18, 2027 RBC
 * Heritage tournament window. Pricing and benefits live alongside
 * the standard tier model in `data/partners.ts` (the Heritage tier
 * is added there). This module tracks which slots are taken so the
 * /sponsor/heritage-2027 landing page can show live status.
 *
 * Update entries here as inquiries advance through the funnel:
 *   open → reserved (deposit / verbal commit) → confirmed (paid).
 *
 * Categories are intentionally narrow — exclusivity is the product.
 */

export type HeritageSlotStatus = 'open' | 'reserved' | 'confirmed';
export type HeritageCategory =
  | 'lodging'
  | 'golf'
  | 'dining'
  | 'transportation';

export type HeritageSlot = {
  category: HeritageCategory;
  label: string;
  /** Short, audience-facing pitch for the slot. */
  pitch: string;
  status: HeritageSlotStatus;
  /** Sponsor brand name once filled. */
  sponsor?: string;
  /** Optional sponsor URL for the live page. */
  sponsorUrl?: string;
};

export const HERITAGE_TOURNAMENT = {
  start: '2027-04-12',
  end: '2027-04-18',
  /** Sponsor placement window — month of April 2027. */
  windowStart: '2027-04-01',
  windowEnd: '2027-04-30',
  kitDeliveryMonth: 'February 2027',
} as const;

export const heritageSlots: ReadonlyArray<HeritageSlot> = [
  {
    category: 'lodging',
    label: 'Lodging partner',
    pitch:
      'Featured villa or resort property in the kit’s lodging section. Direct booking link with attribution.',
    status: 'open',
  },
  {
    category: 'golf',
    label: 'Golf / tee-times partner',
    pitch:
      'Featured stay-and-play package or tee-time concierge in the kit’s tee-times section.',
    status: 'open',
  },
  {
    category: 'dining',
    label: 'Dining / reservations partner',
    pitch:
      'Featured restaurant in the kit’s dinner-priority list. Premium positioning above the public ranking.',
    status: 'open',
  },
  {
    category: 'transportation',
    label: 'Transportation / concierge partner',
    pitch:
      'Featured car service, driver, or full-service concierge for Heritage-week logistics.',
    status: 'open',
  },
];

export function getOpenHeritageSlots(): HeritageSlot[] {
  return heritageSlots.filter((s) => s.status === 'open');
}

/** Audience proof — used by the sponsor landing page ROI calculator. */
export const HERITAGE_AUDIENCE = {
  kitSubscribersTarget: 3000,
  organicMonthlyVisitors: 18000,
  newsletterSubscribers: 2400,
} as const;
