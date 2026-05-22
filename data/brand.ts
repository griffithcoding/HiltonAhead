/**
 * SINGLE SOURCE OF TRUTH for all brand-surface values.
 * Every brand name / color / domain / CTA target lives here.
 */
export const brand = {
  name: 'Hilton Ahead',
  legalName: 'Hilton Ahead Travel Co.',
  domain: 'hiltonahead.com',
  url: 'https://www.hiltonahead.com',

  tagline: 'Hilton Head, the way the locals book it.',
  shortDescription:
    "A locally-run travel consultancy for Hilton Head Island. Villas chosen by porch and shade. Tee times sequenced by tide. Dinner reservations at the tables that catch the last ten minutes of light. The trip you'd plan if you'd lived here for thirty years.",

  seoTitle: 'Hilton Head Travel, Planned the Way the Locals Book It',
  seoDescription:
    'Custom Hilton Head itineraries from a thirty-year island resident. Villas chosen by porch and shade, tee times sequenced by tide, reservations at the tables locals quietly keep. Skip the tourist research tax.',

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
