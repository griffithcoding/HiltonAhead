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
        { href: '/blog/sea-pines-guide', label: 'Sea Pines Guide' },
        { href: '/blog/palmetto-dunes-guide', label: 'Palmetto Dunes Guide' },
        { href: '/blog/forest-beach-guide', label: 'Forest Beach Guide' },
        { href: '/blog/shelter-cove-guide', label: 'Shelter Cove Guide' },
      ],
    },
  ],
} as const;
