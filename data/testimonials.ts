/**
 * Testimonials data.
 *
 * IMPORTANT: Replace these three examples with real client quotes before
 * launching. Marked `isPlaceholder: true` so the component can render a
 * "coming soon" state until real testimonials arrive.
 */

export type Testimonial = {
  quote: string;
  author: string;
  location: string;
  tripType: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string; // ISO date
  isPlaceholder?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "They booked a villa I couldn't find on any site, got us the 7 p.m. table at Skull Creek, and texted us real-time suggestions after a rainstorm pushed one of our plans. Fee paid for itself on the villa rate alone.",
    author: 'Maggie R.',
    location: 'Charlotte, NC',
    tripType: 'Family of six, summer week',
    rating: 5,
    date: '2026-02-14',
    isPlaceholder: true,
  },
  {
    quote:
      "Twelve-guy golf trip. Four rounds, one dinner for the whole group, zero logistical headaches. The Harbour Town tee time alone was worth it.",
    author: 'Dan P.',
    location: 'Columbus, OH',
    tripType: 'Corporate golf outing, 12 guests',
    rating: 5,
    date: '2026-03-22',
    isPlaceholder: true,
  },
  {
    quote:
      "I told them I wanted a quiet anniversary weekend, nothing touristy, and they nailed every detail \u2014 down to the marina sunset table and the breakfast spot that turned into our favorite morning.",
    author: 'Elena & Tom K.',
    location: 'Boston, MA',
    tripType: 'Anniversary long weekend',
    rating: 5,
    date: '2026-01-09',
    isPlaceholder: true,
  },
];

export const testimonialsMeta = {
  /** Derived aggregate rating for schema.org AggregateRating */
  ratingValue: 5.0,
  reviewCount: testimonials.filter((t) => !t.isPlaceholder).length,
  /** When all placeholders are still present, we render social-proof
      stats instead of the quotes (to avoid fake-testimonial integrity risk). */
  hasRealTestimonials: testimonials.some((t) => !t.isPlaceholder),
};
