/**
 * Content definitions for /itinerary-packs/[pack] landing pages.
 *
 * Each ItineraryPack maps a URL slug to a tier slug + all marketing copy.
 * Add new packs here to expand the catalog; no route changes needed.
 */

export interface ItineraryPack {
  /** URL segment: /itinerary-packs/{urlSlug} */
  urlSlug: string;
  /** Maps to TierSlug in data/pricing.ts */
  tierSlug: string;
  /** H1 and page title */
  title: string;
  tagline: string;
  priceDisplay: string;
  priceUsd: number;
  /** e.g. "5-day" */
  duration: string;
  /** e.g. "~20 pages" */
  pages: string;
  /** Bullet list of what the pack includes */
  includes: string[];
  /** Preview section headers — shows "what's inside" without giving it away */
  previewSections: string[];
  /** 2–3 sentence pitch paragraph */
  pitch: string;
  /** Testimonial or social-proof blurb (optional) */
  socialProof?: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  /** Hero image src (Unsplash CDN) */
  heroImage: { src: string; alt: string };
}

export const itineraryPacks: ItineraryPack[] = [
  {
    urlSlug: 'couples-hilton-head',
    tierSlug: 'itinerary-pack-couples',
    title: 'Couples Hilton Head Itinerary Pack',
    tagline: 'Five days. Zero stress. Every detail curated for two.',
    priceDisplay: '$49',
    priceUsd: 49,
    duration: '5-day',
    pages: '~20 pages',
    includes: [
      'Day-by-day itinerary — morning, afternoon, and evening for all 5 days',
      'Top restaurant picks with best dishes, dress code, and reservation timing',
      'Best beaches by mood: romantic, lively, secluded, and sunset-worthy',
      'Sunset spots ranked by ease of access and crowd level',
      'Spa + wellness picks — couples massages, yoga on the beach',
      'Hidden gems most visitors never find',
      'Packing checklist tailored to Hilton Head weather and activities',
      'Tides + beach conditions cheat-sheet',
    ],
    previewSections: [
      'Day 1: Arrival + Harbour Town golden hour',
      'Day 2: Beach morning · Old Town Bluffton lunch · sunset cocktails',
      'Day 3: Water activities · spa afternoon · rooftop dinner',
      'Day 4: Sea Pines Forest Preserve · farm-to-table dinner',
      'Day 5: Last morning swim · best brunch · departure checklist',
      'Our top 10 restaurants (table reservations + best dishes)',
      'Beaches ranked by couple-friendliness',
      'Packing list + tides guide',
    ],
    pitch:
      'Stop spending hours on TripAdvisor rabbit holes. This pack was written by a Hilton Head travel specialist who has sent hundreds of couples to the island — it contains the exact picks and sequencing used in premium $895 custom itineraries, distilled into a ready-to-use PDF you can download instantly and start using today.',
    socialProof:
      '"We used this for our anniversary trip and it was perfect. Every restaurant recommendation was spot-on, and the day-by-day structure meant we never wasted a morning deciding what to do." — Sarah M., Charleston',
    seoTitle: 'Couples Hilton Head Itinerary — 5-Day PDF Guide | Hilton Ahead',
    metaDescription:
      'A complete 5-day Hilton Head couples itinerary: day-by-day plan, top restaurants, romantic beaches, sunset spots, and hidden gems — instant PDF download for $49.',
    keywords: [
      'hilton head couples itinerary',
      'hilton head romantic getaway',
      'hilton head 5 day itinerary',
      'hilton head travel guide PDF',
      'hilton head trip planner couples',
    ],
    heroImage: {
      src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
      alt: 'Couples on Hilton Head beach at sunset',
    },
  },
  {
    urlSlug: 'golf-hilton-head',
    tierSlug: 'itinerary-pack-golf',
    title: 'Hilton Head Golf Itinerary Pack',
    tagline: 'Four rounds, the best courses, zero logistics headaches.',
    priceDisplay: '$49',
    priceUsd: 49,
    duration: '4-day',
    pages: '~18 pages',
    includes: [
      '4-day golf-focused itinerary with tee times, courses, and daily schedule',
      'Course-by-course breakdown: Harbour Town, Palmetto Dunes, Sea Pines Country Club, and more',
      'Tee-time booking strategy — when to book, morning vs. afternoon, shoulder season tips',
      'Post-round dining picks organized by which course you just played',
      'Caddie policy, cart rules, and dress code cheat-sheet for each course',
      'Best clubhouse bars + 19th hole traditions per course',
      'Where to stay based on which courses you\'re playing',
      'Packing list for a golf trip: what to bring, what to rent on-island',
    ],
    previewSections: [
      'Day 1: Arrival round at Palmetto Dunes (Robert Trent Jones)',
      'Day 2: Harbour Town Golf Links — tips, caddies, and what to expect',
      'Day 3: Sea Pines Country Club + Ocean Course comparison',
      'Day 4: Best finishing round + departure logistics',
      'Course comparison table: price, difficulty, scenery, caddie availability',
      'Tee-time booking calendar and best windows by month',
      'Post-round dining guide — one per course',
      'What to pack + what to rent on the island',
    ],
    pitch:
      'Hilton Head has more than 20 courses and the logistics can be overwhelming — which courses to prioritize, when to book, whether to take a caddie, where to eat after. This pack is the planning shortcut written by someone who has played them all and knows exactly what\'s worth your time and money.',
    socialProof:
      '"Saved me hours of research. The course comparison table alone was worth $49." — Mike T., Atlanta',
    seoTitle: 'Hilton Head Golf Itinerary — 4-Day Course Guide PDF | Hilton Ahead',
    metaDescription:
      'A complete 4-day Hilton Head golf itinerary: course breakdowns, tee-time strategy, post-round dining, and packing list — instant PDF download for $49.',
    keywords: [
      'hilton head golf itinerary',
      'hilton head golf trip planning',
      'harbour town golf links guide',
      'palmetto dunes golf courses',
      'hilton head golf packages DIY',
    ],
    heroImage: {
      src: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1600&q=80',
      alt: 'Golf course at Hilton Head Island',
    },
  },
];

export function getPackByUrlSlug(slug: string): ItineraryPack | undefined {
  return itineraryPacks.find((p) => p.urlSlug === slug);
}

export function getPackByTierSlug(slug: string): ItineraryPack | undefined {
  return itineraryPacks.find((p) => p.tierSlug === slug);
}
