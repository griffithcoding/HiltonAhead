import { brand } from '@/data/brand';

export type SearchableDocType =
  | 'page'
  | 'post'
  | 'story'
  | 'business'
  | 'industry'
  | 'event'
  | 'faq'
  | 'neighborhood'
  | 'month'
  | 'service'
  | 'partner'
  | 'trip-type'
  | 'property';

export type SearchableDoc = {
  id: string;
  type: SearchableDocType;
  title: string;
  url: string;
  body: string;
  tags: string[];
  weight: number;
};

const STATIC_PAGES: ReadonlyArray<Omit<SearchableDoc, 'id' | 'type'>> = [
  { url: '/', title: brand.name, body: brand.shortDescription, tags: ['home', 'hilton head'], weight: 1.0 },
  { url: '/services', title: 'Services', body: 'Custom itineraries, villa and resort booking, group and family trips, on-island concierge, dining and tee-time reservations.', tags: ['services', 'concierge', 'itinerary'], weight: 1.5 },
  { url: '/itinerary', title: 'Request a Custom Itinerary', body: 'Send a request and a local insider returns a day-by-day plan within 24 hours.', tags: ['itinerary', 'plan', 'concierge'], weight: 1.8 },
  { url: '/contact', title: 'Contact', body: 'Reach William Griffith directly to plan your Hilton Head trip.', tags: ['contact'], weight: 1.2 },
  { url: '/about', title: 'About', body: 'A locally-run travel consulting service for Hilton Head Island.', tags: ['about'], weight: 1.0 },
  { url: '/founder', title: 'Founder', body: 'William Griffith — full-time Hilton Head resident and travel consultant.', tags: ['founder', 'william griffith'], weight: 1.0 },
  { url: '/faq', title: 'Frequently Asked Questions', body: 'Eight clusters of common questions covering booking, pricing, on-island logistics, weather, and weddings.', tags: ['faq', 'questions'], weight: 1.1 },
  { url: '/partners', title: 'Partners', body: 'Curated local partner network across villas, dining, golf, charters, weddings, and spas.', tags: ['partners'], weight: 0.8 },
  { url: '/sponsorships', title: 'Partner With Us', body: 'Sponsorship tiers for Hilton Head businesses ready to join the partner network.', tags: ['sponsorship', 'business'], weight: 0.8 },
  { url: '/press', title: 'Press', body: 'Press mentions and media inquiries for Hilton Ahead Travel Co.', tags: ['press', 'media'], weight: 0.6 },
  { url: '/cost-of-hilton-head-trip', title: 'Cost of a Hilton Head Trip', body: 'Realistic Hilton Head trip cost calculator — villa, dining, golf, and activities.', tags: ['cost', 'budget', 'calculator'], weight: 1.4 },
  { url: '/marriott-bonvoy-stays-hilton-head', title: 'Marriott Bonvoy Stays on Hilton Head', body: 'Every Marriott Bonvoy property on Hilton Head Island with insider takes.', tags: ['marriott', 'bonvoy', 'hotels'], weight: 1.3 },
  { url: '/hilton-head-weather', title: 'Hilton Head Weather by Month', body: '12-month climate, water temperature, and crowd guide for Hilton Head Island.', tags: ['weather', 'month', 'climate'], weight: 1.2 },
  { url: '/events', title: 'Events Calendar', body: 'Marquee, recurring, food, sports, arts, seasonal, and holiday events on Hilton Head Island.', tags: ['events', 'calendar'], weight: 1.1 },
  { url: '/blog', title: 'Local Guide', body: 'Long-form blog posts on Hilton Head travel, golf, beaches, dining, and neighborhoods.', tags: ['blog', 'guide'], weight: 1.0 },
  { url: '/stories', title: 'Stories', body: 'Place-as-protagonist editorial pieces — long-form scroll-driven narratives.', tags: ['stories', 'editorial'], weight: 0.9 },
  { url: '/guides/2027-rbc-heritage', title: '2027 RBC Heritage Kit', body: 'Free guide to the 2027 RBC Heritage tournament — tickets, lodging, parking, and on-course tips.', tags: ['heritage', 'golf', 'tournament', '2027'], weight: 1.4 },
];

export function buildCorpus(): SearchableDoc[] {
  const docs: SearchableDoc[] = [];

  for (const p of STATIC_PAGES) {
    docs.push({
      id: `page:${p.url}`,
      type: 'page',
      ...p,
    });
  }

  return docs;
}
