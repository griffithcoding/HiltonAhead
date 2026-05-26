/**
 * Affiliate program registry — single source of truth for partner IDs and
 * deeplink shapes. Every affiliate link rendered on the site flows through
 * `withAffiliateParams()` in `app/lib/affiliates.ts`, which reads this
 * registry and stamps the right tracking parameter on the URL.
 *
 * Adding a program:
 *   1. Apply to the affiliate program (see plan: i-want-to-make-snoopy-seahorse).
 *   2. Add an env var with your tracking ID (e.g. AFFILIATE_BOOKING_AID=12345).
 *   3. Add a row below pointing to the env var.
 *   4. Use <AffiliateCard programId="..."> or <AffiliateLink programId="..."> in pages.
 *
 * Per FTC + Google guidance, every outbound affiliate link MUST carry
 * rel="sponsored nofollow". The components handle that automatically — do
 * not bypass them.
 */

export type AffiliateProgramId =
  | 'booking'
  | 'expedia'
  | 'vrbo'
  | 'viator'
  | 'getyourguide'
  | 'golfnow'
  | 'amazon'
  | 'marriott'
  | 'allianz'
  | 'hertz'
  | 'petermillar';

export interface AffiliateProgram {
  id: AffiliateProgramId;
  /** Human-readable label for admin UI / disclosures. */
  name: string;
  /** Short label for inline link copy ("Book on Booking.com"). */
  shortName: string;
  /** Primary domain — for disclosure copy + URL validation. */
  brandDomain: string;
  /**
   * Env var holding the tracking ID. Until it's set the helper falls back to
   * passing the raw URL through (no tracking, but the link still works).
   */
  trackingIdEnv: string;
  /**
   * Optional placement-specific tracking IDs. Maps a placement-prefix key to
   * an env var name. When a component passes `placement="blog/post-slug"`,
   * `withAffiliateParams()` checks each key here against the placement
   * string (case-insensitive prefix match). First match wins; if none match
   * (or no placement is passed), the helper falls back to `trackingIdEnv`.
   *
   * Amazon uses this to split clicks across per-surface tracking IDs (blog,
   * FAQ, local directory, newsletter) within the same Associates account so
   * surface-level attribution shows up in Amazon's earnings reports without
   * needing multiple accounts.
   */
  placementTagEnv?: Record<string, string>;
  /**
   * URL parameter the network expects the tracking ID under.
   *   booking.com → aid
   *   expedia/vrbo → siteid (EPS) / camref (Impact)
   *   viator → pid (or mcid)
   *   getyourguide → partner_id
   *   golfnow (Impact)→ irgwc=1 + clickid (handled by Impact deeplink)
   *   amazon → tag
   */
  trackingParam: string;
  /**
   * Optional extra static query params merged onto every deeplink. Used for
   * networks that require a "label" or "campaign" alongside the ID.
   */
  staticParams?: Record<string, string>;
  /**
   * Optional fallback "browse" deeplink the AffiliateCard uses when no
   * specific deeplink is passed (e.g. "Browse Hilton Head hotels on Booking").
   */
  defaultDeeplink?: string;
  /** One-line value prop shown on cards. */
  pitch: string;
}

export const AFFILIATE_PROGRAMS: Record<AffiliateProgramId, AffiliateProgram> = {
  booking: {
    id: 'booking',
    name: 'Booking.com',
    shortName: 'Booking.com',
    brandDomain: 'booking.com',
    trackingIdEnv: 'AFFILIATE_BOOKING_AID',
    trackingParam: 'aid',
    defaultDeeplink:
      'https://www.booking.com/searchresults.html?ss=Hilton+Head+Island%2C+SC',
    pitch: 'Hotels and resorts on Hilton Head — free cancellation on most stays.',
  },
  expedia: {
    id: 'expedia',
    name: 'Expedia',
    shortName: 'Expedia',
    brandDomain: 'expedia.com',
    trackingIdEnv: 'AFFILIATE_EXPEDIA_SITEID',
    trackingParam: 'siteid',
    defaultDeeplink:
      'https://www.expedia.com/Hotel-Search?destination=Hilton+Head+Island%2C+SC',
    pitch: 'Bundle a flight + hotel and save on package rates.',
  },
  vrbo: {
    id: 'vrbo',
    name: 'Vrbo',
    shortName: 'Vrbo',
    brandDomain: 'vrbo.com',
    trackingIdEnv: 'AFFILIATE_VRBO_SITEID',
    trackingParam: 'siteid',
    defaultDeeplink:
      'https://www.vrbo.com/search?q=Hilton+Head+Island%2C+SC',
    pitch: 'Whole-house rentals — best for families and groups.',
  },
  viator: {
    id: 'viator',
    name: 'Viator (Tripadvisor)',
    shortName: 'Viator',
    brandDomain: 'viator.com',
    trackingIdEnv: 'AFFILIATE_VIATOR_PID',
    trackingParam: 'pid',
    defaultDeeplink:
      'https://www.viator.com/Hilton-Head-tours/d4319',
    pitch: 'Tours, dolphin cruises, and activities — instant confirmation.',
  },
  getyourguide: {
    id: 'getyourguide',
    name: 'GetYourGuide',
    shortName: 'GetYourGuide',
    brandDomain: 'getyourguide.com',
    trackingIdEnv: 'AFFILIATE_GETYOURGUIDE_PARTNER_ID',
    trackingParam: 'partner_id',
    defaultDeeplink:
      'https://www.getyourguide.com/hilton-head-island-l171841/',
    pitch: 'Activities and small-group tours, mobile tickets.',
  },
  golfnow: {
    id: 'golfnow',
    name: 'GolfNow',
    shortName: 'GolfNow',
    brandDomain: 'golfnow.com',
    trackingIdEnv: 'AFFILIATE_GOLFNOW_CAMREF',
    trackingParam: 'camref',
    staticParams: { irgwc: '1' },
    defaultDeeplink:
      'https://www.golfnow.com/tee-times/area/2106-hilton-head-sc-tee-times',
    pitch: 'Tee times across Harbour Town, Palmetto Dunes, Sea Pines and more.',
  },
  marriott: {
    id: 'marriott',
    name: 'Marriott Bonvoy',
    shortName: 'Marriott',
    brandDomain: 'marriott.com',
    trackingIdEnv: 'AFFILIATE_MARRIOTT_AID',
    trackingParam: 'camref',
    staticParams: { irgwc: '1' },
    defaultDeeplink:
      'https://www.marriott.com/search/findHotels.mi?destinationAddress.destination=Hilton+Head+Island%2C+SC&searchType=InCity',
    pitch:
      'Marriott Vacation Club villas + the Westin on Hilton Head — Bonvoy points eligible.',
  },
  allianz: {
    id: 'allianz',
    name: 'Allianz Travel Insurance',
    shortName: 'Allianz',
    brandDomain: 'allianztravelinsurance.com',
    trackingIdEnv: 'AFFILIATE_ALLIANZ_CAMREF',
    trackingParam: 'camref',
    staticParams: { irgwc: '1' },
    defaultDeeplink: 'https://www.allianztravelinsurance.com/',
    pitch:
      'Travel insurance for your trip — covers cancellation, medical, and baggage delay.',
  },
  hertz: {
    id: 'hertz',
    name: 'Hertz',
    shortName: 'Hertz',
    brandDomain: 'hertz.com',
    trackingIdEnv: 'AFFILIATE_HERTZ_CAMREF',
    trackingParam: 'camref',
    staticParams: { irgwc: '1' },
    defaultDeeplink: 'https://www.hertz.com/rentacar/reservation/',
    pitch:
      'Rental cars from Savannah/Hilton Head airports — book ahead for peak weeks.',
  },
  petermillar: {
    id: 'petermillar',
    name: 'Peter Millar',
    shortName: 'Peter Millar',
    brandDomain: 'petermillar.com',
    trackingIdEnv: 'AFFILIATE_PETERMILLAR_CAMREF',
    trackingParam: 'camref',
    staticParams: { irgwc: '1' },
    defaultDeeplink: 'https://www.petermillar.com/',
    pitch:
      'Heritage-week-ready apparel — golf, lifestyle, and event-week plaids.',
  },
  amazon: {
    id: 'amazon',
    name: 'Amazon',
    shortName: 'Amazon',
    brandDomain: 'amazon.com',
    trackingIdEnv: 'AFFILIATE_AMAZON_TAG',
    /**
     * Per-surface attribution. Each maps to a separately-created Amazon
     * Associates tracking ID that rolls up to the same account. The keys
     * are matched against the `placement` prop on AffiliateCard/Link via
     * case-insensitive prefix match — e.g. `placement="blog/spring-break"`
     * resolves to AFFILIATE_AMAZON_TAG_BLOG.
     */
    placementTagEnv: {
      blog: 'AFFILIATE_AMAZON_TAG_BLOG',
      faq: 'AFFILIATE_AMAZON_TAG_FAQ',
      local: 'AFFILIATE_AMAZON_TAG_LOCAL',
      newsletter: 'AFFILIATE_AMAZON_TAG_NEWSLETTER',
      trip: 'AFFILIATE_AMAZON_TAG_TRIP', // NEW — packing list, future trip-intent surfaces
    },
    trackingParam: 'tag',
    pitch: 'Beach gear, packing essentials, and recommended reading.',
  },
};

export function getProgram(id: AffiliateProgramId): AffiliateProgram {
  return AFFILIATE_PROGRAMS[id];
}

export const ALL_AFFILIATE_PROGRAMS = Object.values(AFFILIATE_PROGRAMS);
