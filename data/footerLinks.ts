export const footerLinks = {
  tagline:
    'Local-run travel consulting for Hilton Head Island. Villas, tee times, reservations, on-island concierge.',
  locationTagline: 'Made on Hilton Head Island, SC',
  columns: [
    {
      label: 'Services',
      links: [
        { href: '/services#custom-itineraries', label: 'Custom Itineraries' },
        { href: '/services#villa-resort-booking', label: 'Villa & Resort Booking' },
        { href: '/services#group-family-trips', label: 'Group & Family Trips' },
        { href: '/services#on-island-concierge', label: 'On-Island Concierge' },
        { href: '/services#reservations-tee-times', label: 'Dining & Tee Times' },
      ],
    },
    {
      label: 'Explore',
      links: [
        { href: '/about', label: 'About' },
        { href: '/blog', label: 'Local Guide' },
        { href: '/itinerary', label: 'Request Itinerary' },
        { href: '/contact', label: 'Contact' },
      ],
    },
    {
      label: 'Island',
      links: [
        { href: '/hilton-head/sea-pines', label: 'Sea Pines' },
        { href: '/hilton-head/palmetto-dunes', label: 'Palmetto Dunes' },
        { href: '/hilton-head/forest-beach', label: 'Forest Beach' },
        { href: '/hilton-head/shelter-cove', label: 'Shelter Cove' },
      ],
    },
  ],
} as const;
