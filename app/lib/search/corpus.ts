/**
 * Single source of truth for the searchable document set.
 * Tight corpus: static pages + blog posts + FAQs only.
 */

import { brand } from '@/data/brand';
import { posts, type PostBlock } from '@/data/posts';
import { faqAll, faqClusters } from '@/data/faq';

export type SearchableDocType = 'page' | 'post' | 'faq';

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
  { url: '/faq', title: 'Frequently Asked Questions', body: 'Common questions covering booking, pricing, on-island logistics, weather, and weddings.', tags: ['faq', 'questions'], weight: 1.1 },
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractPostBlocksText(blocks: PostBlock[]): string {
  const parts: string[] = [];
  for (const b of blocks) {
    if (b.kind === 'p' || b.kind === 'callout') parts.push(stripHtml(b.html));
    else if (b.kind === 'h2' || b.kind === 'h3') parts.push(b.text);
    else if (b.kind === 'ul' || b.kind === 'ol') parts.push(b.items.join(' '));
    else if (b.kind === 'quote') parts.push(stripHtml(b.html));
    else if (b.kind === 'faq') parts.push(b.items.map((i) => `${i.q} ${i.a}`).join(' '));
    else if (b.kind === 'section') parts.push(b.title, b.summary ?? '', extractPostBlocksText(b.blocks));
  }
  return parts.join(' ');
}

export function buildCorpus(): SearchableDoc[] {
  const docs: SearchableDoc[] = [];

  for (const p of STATIC_PAGES) {
    docs.push({ id: `page:${p.url}`, type: 'page', ...p });
  }

  for (const post of posts) {
    const bodyText = extractPostBlocksText(post.body).slice(0, 4000);
    docs.push({
      id: `post:${post.slug}`,
      type: 'post',
      title: post.title,
      url: `/blog/${post.slug}`,
      body: `${post.description ?? ''} ${bodyText}`.trim(),
      tags: post.keywords ?? [],
      weight: post.featuredOrder <= 3 ? 1.3 : 1.0,
    });
  }

  for (let i = 0; i < faqAll.length; i++) {
    const item = faqAll[i];
    const cluster = faqClusters.find((c) => c.items.some((it) => it.question === item.question));
    const clusterSlug = cluster?.slug ?? 'general';
    docs.push({
      id: `faq:${clusterSlug}:${i}`,
      type: 'faq',
      title: item.question,
      url: `/faq#${clusterSlug}`,
      body: item.answer,
      tags: ['faq', clusterSlug],
      weight: 1.2,
    });
  }

  return docs;
}
