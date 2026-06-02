/**
 * Single source of truth for the partner Realtor surfaced on real estate
 * trend sections. Update here when the referral partner is signed.
 *
 * The intake EMAIL is read from process.env.REAL_ESTATE_PARTNER_EMAIL at
 * request time (see app/api/real-estate-inquiry/route.ts) — NOT from this file —
 * so the partnership can change without a deploy.
 */

export type RealEstatePartner = {
  /** Display name, or a generic label until a partner is signed. */
  name: string;
  /** Whether a real partner is configured (controls CTA copy). */
  active: boolean;
  brokerage?: string;
  licenseNumber?: string;
  headshotSrc?: string;
  bio: string;
  calendlyUrl?: string;
};

export const realEstatePartner: RealEstatePartner = {
  name: 'Our Hilton Head real estate partner',
  active: false,
  bio: 'We connect serious buyers and sellers with a vetted, full-time Hilton Head Island Realtor who knows these neighborhoods street by street.',
};
