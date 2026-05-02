/**
 * SINGLE SOURCE OF TRUTH for all brand-surface values.
 * Every brand name / color / domain / CTA target lives here.
 */
export const brand = {
  name: 'Hilton Ahead',
  legalName: 'Hilton Ahead Travel Co.',
  domain: 'hiltonahead.com',
  url: 'https://www.hiltonahead.com',

  tagline: 'Your local insider for Hilton Head travel.',
  shortDescription:
    'A locally-run travel consulting service for Hilton Head. Villas, tee times, dinner reservations, and the 10 things only locals know about.',

  seoTitle: 'Hilton Head Travel Consulting, Planned by a Local',
  seoDescription:
    'Custom Hilton Head itineraries built by a local insider. Villa booking, tee times, dinner reservations, and on-island concierge. Skip the tourist traps.',

  colors: {
    /** Glass aqua — the signature color of the Pristine Caribbean palette.
     *  Used for the OG image accent + browser theme-color meta. */
    primary: '#7BD8E0',
  },

  logo: {
    src: '/logo/hilton-ahead-mark.svg',
    alt: 'Hilton Ahead',
  },

  cta: {
    /** Internal route for the itinerary request form. All CTAs on the site route here. */
    bookingPagePath: '/itinerary',
    label: 'Plan my trip',
  },

  contact: {
    email: 'hello@hiltonahead.com',
    phone: '',
    location: 'Hilton Head Island, SC',
  },

  /**
   * Booking / scheduling URLs.
   * Update `calendly.url` after creating the Calendly account with
   * `hiltonahead@gmail.com`. The 30-min discovery call slug is a convention —
   * use whatever path Calendly generates for the event type.
   */
  scheduling: {
    calendly: {
      /** Set to your full Calendly event URL once created. */
      url: 'https://calendly.com/hiltonahead/30min',
      label: 'Book a 30-min discovery call',
    },
  },

  /**
   * Social account URLs feed schema.org `sameAs` for brand consolidation
   * across the knowledge graph. Leave empty until the account is claimed
   * and live — empty strings are filtered out before they hit the schema.
   *
   * Recommended handle: @hiltonaheadtravel (Instagram, LinkedIn).
   * Skipping TikTok and Twitter — wrong audience for the price point.
   */
  social: {
    instagram: '',
    facebook: '',
    linkedin: '',
  },

  analytics: {
    gaId: '',
    gtmId: '',
  },
} as const;

export type Brand = typeof brand;
