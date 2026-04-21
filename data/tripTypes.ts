/**
 * Trip-type landing pages.
 *
 * Parallel to data/neighborhoods.ts but organized around the kind of trip
 * ("golf packages," "weddings") rather than the geographic pocket. These
 * target high-intent keywords that people search when they've already
 * decided on Hilton Head but not on a villa address.
 *
 * URL convention: each record maps to a top-level keyword-rich route,
 * e.g., /hilton-head-golf-packages. Top-level keeps the slug in the URL
 * for SEO weight instead of burying it under /trip-types/.
 */

import { photos } from './photos';

export type TripTypeLanding = {
  slug: string;
  /** Top-level route, e.g., "/hilton-head-golf-packages". */
  path: string;
  /** Display H1 (plain + italic trading lines, same convention as neighborhoods). */
  tagline: { plain: string; italic: string };
  /** SEO title used in <title>. */
  seoTitle: string;
  /** SEO meta description, under 158 chars. */
  metaDescription: string;
  keywords: string[];
  /** Short 1-2 sentence hero hook. */
  hook: string;
  /** Four reasons to choose us for this trip type. */
  reasons: Array<{ title: string; body: string }>;
  /** Best-for traveler segments. */
  bestFor: string[];
  /** Honest downsides paragraph. */
  tradeoffs: string;
  /** Hero image and supporting gallery (3 images). */
  hero: { src: string; alt: string };
  gallery: Array<{ src: string; alt: string; caption: string }>;
  /** Slug of the long-form blog post to link out to (if any). */
  blogPostSlug?: string;
};

export const tripTypes: TripTypeLanding[] = [
  {
    slug: 'golf-packages',
    path: '/hilton-head-golf-packages',
    tagline: {
      plain: 'Hilton Head golf packages,',
      italic: 'planned by someone who plays here.',
    },
    seoTitle: 'Hilton Head Golf Packages: Planned by a Local',
    metaDescription:
      'Custom Hilton Head golf trip packages. Harbour Town tee-time priority, Palmetto Dunes three-course mix, villas inside five minutes of first tee.',
    keywords: [
      'Hilton Head golf packages',
      'Hilton Head golf trip',
      'Harbour Town tee times',
      'Hilton Head golf vacation',
      'Sea Pines golf package',
      'Palmetto Dunes golf',
      'Hilton Head stay and play',
    ],
    hook:
      'Eight golf courses inside fifteen minutes, three of them national Top-100. We book the Harbour Town tee times that never surface on the resort\u2019s public page, negotiate villa rates with the partner operators, and land the whole group at first tee with time to stretch.',
    reasons: [
      {
        title: 'Harbour Town priority',
        body:
          'Sea Pines Resort villa guests get 120-day Harbour Town tee-time priority. We book villa + course as a package so your group actually lands on the first-tee sheet at RBC Heritage calibre.',
      },
      {
        title: 'Three courses on one plantation',
        body:
          'Palmetto Dunes runs Robert Trent Jones Oceanfront, Fazio, and Arthur Hills off one tee sheet. One log-in, three courses, and the drive between them is measured in minutes, not miles.',
      },
      {
        title: 'Villa-to-first-tee logistics',
        body:
          'We pick lodging inside the gate so the morning is a five-minute cart ride, not a twenty-minute drive through Cross Island traffic. Range time, breakfast, and beers on eighteen all make it.',
      },
      {
        title: 'Group pricing and pace',
        body:
          'Twelve-guy groups get grouped sensibly across handicap, with skin-game-friendly cart assignments. Afternoon reservations, dinner tee-off, the whole thing.',
      },
    ],
    bestFor: [
      'Six to twelve guys',
      'Spring and fall peak golf weather',
      'Mixed-skill corporate offsites',
      'Milestone birthday weekends',
    ],
    tradeoffs:
      'Summer gets humid and slow: tee times slide, pace is four and a half hours on a good day. Winter has two or three genuinely cold weeks. The sweet windows are mid-March to late May and mid-September to early December. We will tell you honestly if your dates are in a soft spot.',
    hero: photos.hero,
    gallery: [
      { ...photos.lighthouse, caption: 'Harbour Town, just past dusk' },
      { ...photos.bikePath,   caption: 'Cart path, Palmetto Dunes' },
      { ...photos.villa,      caption: 'A Sea Pines villa we book for golf groups' },
    ],
    blogPostSlug: 'hilton-head-golf-trip',
  },
  {
    slug: 'weddings',
    path: '/hilton-head-weddings',
    tagline: {
      plain: 'Hilton Head weddings,',
      italic: 'planned around the guest experience.',
    },
    seoTitle: 'Hilton Head Wedding Planning: Lodging, Logistics, Guests',
    metaDescription:
      'Hilton Head wedding weekends planned from the local side. Group lodging across 8 to 12 properties, airport shuttles, welcome bags, rehearsal logistics.',
    keywords: [
      'Hilton Head wedding planner',
      'Hilton Head wedding weekend',
      'Hilton Head destination wedding',
      'Sea Pines wedding',
      'Palmetto Bluff wedding guest lodging',
      'Hilton Head wedding group travel',
    ],
    hook:
      'We plan the lodging, the logistics, and the guest experience around your venue. Not the ceremony. Not the flowers. The parts that make a destination wedding feel like an actual vacation for the family and friends you just flew in from three time zones.',
    reasons: [
      {
        title: 'Lodging across eight to twelve properties',
        body:
          'One hotel block rarely works for 60 guests (kids, parents, your college roommate who brought three kids). We distribute across villas, resorts, and smaller inns so every household lands somewhere that fits.',
      },
      {
        title: 'We complement your venue planner',
        body:
          'Your Palmetto Bluff, Sea Pines, or private-estate planner owns the ceremony. We own what happens before and after: welcome dinner, rehearsal night, brunch the morning after, airport runs on Sunday.',
      },
      {
        title: 'Vendor relationships that already exist',
        body:
          'Transportation operators, welcome-bag suppliers, rehearsal-dinner holds at the restaurants that actually deliver. Twelve years of booking on this island compounds into a rolodex you cannot fake.',
      },
      {
        title: 'Three days of on-island concierge',
        body:
          'From Thursday night rehearsal through Sunday morning departures, someone is a text away when the flowers run late or cousin Dave\u2019s flight reroutes through Atlanta.',
      },
    ],
    bestFor: [
      'Forty to one hundred guest weddings',
      'Multi-day family-plus-friends weekends',
      'Rehearsal + welcome-night planning',
      'Group transportation and airport shuttles',
    ],
    tradeoffs:
      'We are not your ceremony planner. If you want one person running vows-through-cake, book a full-service wedding planner first and loop us in for lodging and logistics. We also don\u2019t do elopements or weddings under twenty guests; the coordination overhead does not match the payoff for groups that small.',
    hero: photos.dock,
    gallery: [
      { ...photos.harborBoats, caption: 'Shelter Cove marina rehearsal dinner' },
      { ...photos.villa,       caption: 'Family-block villa, Sea Pines' },
      { ...photos.mossOak,     caption: 'Lowcountry oaks, wedding portraits' },
    ],
  },
];

export function getTripTypeBySlug(slug: string): TripTypeLanding | undefined {
  return tripTypes.find((t) => t.slug === slug);
}
