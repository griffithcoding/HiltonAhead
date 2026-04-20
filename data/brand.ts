/**
 * SINGLE SOURCE OF TRUTH for all brand-surface values.
 * Every brand name / color / domain / CTA target lives here.
 */
export const brand = {
  name: 'Hilton Ahead',
  legalName: 'Hilton Ahead Travel Co.',
  domain: 'hiltonahead.com',
  url: 'https://hiltonahead.com',

  tagline: 'Your local insider for Hilton Head travel.',
  shortDescription:
    'A locally-run travel consulting service that plans your Hilton Head trip end-to-end — villas, tee times, dinner reservations, and the 10 things only locals know about.',

  seoTitle: 'Hilton Head Travel Consulting — Planned by a Local',
  seoDescription:
    'Custom Hilton Head itineraries built by a local insider. Villa booking, tee times, dinner reservations, and on-island concierge. Skip the tourist traps.',

  colors: {
    /** Sunset coral — the one sharp accent in the Lowcountry palette. */
    primary: '#C44A2B',
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

  social: {
    instagram: '',
    facebook: '',
  },

  analytics: {
    gaId: '',
    gtmId: '',
  },
} as const;

export type Brand = typeof brand;
