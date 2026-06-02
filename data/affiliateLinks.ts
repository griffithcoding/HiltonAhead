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
  | 'petermillar'
  | 'southwest';

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
   *   expedia/vrbo (Partnerize) → camref (also wrapped via prf.hn — see linkPattern)
   *   viator → pid (or mcid)
   *   getyourguide → partner_id
   *   golfnow / marriott / allianz / hertz / petermillar (Impact) → camref + irgwc=1
   *   amazon → tag
   */
  trackingParam: string;
  /**
   * How `withAffiliateParams()` stamps the tracking ID onto the URL.
   *
   * - 'query-stamp' (default): append `?trackingParam=trackingId` plus any
   *   staticParams to the destination URL. Used by Booking, Amazon, Viator,
   *   GetYourGuide, and most Impact programs (GolfNow, Marriott, etc.).
   *
   * - 'partnerize-wrap': wrap the destination through Partnerize's redirect
   *   service. Output shape: `https://prf.hn/click/camref:ID/destination:ENCODED_URL`.
   *   Used by Expedia + Vrbo (and any future Partnerize-network programs).
   *   When the tracking ID env var is unset, the helper passes the raw
   *   destination URL through unchanged — same as query-stamp behavior.
   *
   * - 'prebuilt-link': the program's "tracking ID" env var holds a COMPLETE,
   *   pre-generated tracking link (e.g. an Impact vanity redirect like
   *   `https://swa.eyjo.net/yZ9j72`). There are no params to stamp and no
   *   deeplink to construct — the helper returns the env var value as-is, or
   *   falls back to the committed `defaultDeeplink`, then the brand homepage.
   *   Used by single-destination programs where the network only hands you a
   *   finished link (Southwest/Points.com, Hilton Honors, etc.).
   */
  linkPattern?: 'query-stamp' | 'partnerize-wrap' | 'prebuilt-link';
  /**
   * Optional extra static query params merged onto every deeplink. Used for
   * networks that require a "label" or "campaign" alongside the ID.
   * Ignored when `linkPattern: 'partnerize-wrap'`.
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
    // Expedia migrated to Partnerize in 2024. Tracking is via camref (publisher
    // ID), wrapped through prf.hn — NOT the legacy EPS siteid stamping pattern.
    trackingIdEnv: 'AFFILIATE_EXPEDIA_CAMREF',
    trackingParam: 'camref',
    linkPattern: 'partnerize-wrap',
    defaultDeeplink:
      'https://www.expedia.com/Hotel-Search?destination=Hilton+Head+Island%2C+SC',
    pitch: 'Bundle a flight + hotel and save on package rates.',
  },
  vrbo: {
    id: 'vrbo',
    name: 'Vrbo',
    shortName: 'Vrbo',
    brandDomain: 'vrbo.com',
    // Vrbo is Expedia Group → same Partnerize publisher ID works on both
    // domains. We keep the env var separate for future-proofing in case the
    // networks split, but the value is typically identical to Expedia's.
    trackingIdEnv: 'AFFILIATE_VRBO_CAMREF',
    trackingParam: 'camref',
    linkPattern: 'partnerize-wrap',
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
  southwest: {
    id: 'southwest',
    name: 'Southwest Airlines (Rapid Rewards)',
    shortName: 'Southwest',
    brandDomain: 'southwest.com',
    // Impact / Points.com hands you a finished vanity tracking link, not a
    // deeplink to stamp. The env var holds that full URL; `defaultDeeplink`
    // carries the same link committed so the card earns even before the env
    // var is set in Vercel. Rotate by editing either one.
    // VERIFY: confirm the link's destination in Impact's "Create a link" tool
    // points to the Rapid Rewards "Buy Points" flow — that is the only action
    // the Points.com program pays commission on (flight bookings earn $0).
    trackingIdEnv: 'AFFILIATE_SOUTHWEST_LINK',
    trackingParam: '', // unused for prebuilt-link
    linkPattern: 'prebuilt-link',
    defaultDeeplink: 'https://swa.eyjo.net/yZ9j72',
    pitch:
      'Southwest flies nonstop into Savannah/Hilton Head (SAV) — two free checked bags and no change fees. Short on points for an award flight? Buy or top up Rapid Rewards.',
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
