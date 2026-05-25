type NavChild = {
  readonly href: string;
  readonly label: string;
};

type NavLink = {
  readonly href: string;
  readonly label: string;
  readonly children?: ReadonlyArray<NavChild>;
};

type Nav = {
  readonly links: ReadonlyArray<NavLink>;
  readonly statusPill: { readonly label: string };
};

export const nav: Nav = {
  links: [
    {
      href: '/services',
      label: 'Services',
      children: [
        { href: '/villa-match', label: 'Villa Match Quiz' },
        { href: '/services#custom-itineraries', label: 'Custom Itineraries' },
        { href: '/services#villa-resort-booking', label: 'Villa & Resort Booking' },
        { href: '/services#group-family-trips', label: 'Group & Family Trips' },
        { href: '/services#on-island-concierge', label: 'On-Island Concierge' },
        { href: '/services#reservations-tee-times', label: 'Dining & Tee Times' },
        { href: '/itinerary', label: 'Request Itinerary' },
      ],
    },
    {
      href: '/blog',
      label: 'Local Guide',
      children: [
        { href: '/blog/best-time-to-visit-hilton-head', label: 'Best Time to Visit' },
        { href: '/hilton-head-weather', label: 'Weather by Month' },
        { href: '/guides/2027-rbc-heritage', label: '2027 Heritage Kit (free)' },
        { href: '/events', label: 'Events Calendar' },
        { href: '/stories', label: 'Stories' },
      ],
    },
    {
      href: '/local',
      label: 'Businesses',
      children: [
        { href: '/local/restaurants', label: 'Restaurants' },
        { href: '/local/golf', label: 'Golf Courses' },
        { href: '/local/water-activities', label: 'Water Activities' },
        { href: '/local/weddings', label: 'Wedding Venues' },
        { href: '/local/spas-wellness', label: 'Spas & Wellness' },
        { href: '/local/vacation-rentals', label: 'Vacation Rentals' },
        { href: '/local/get-featured', label: 'Feature Your Business' },
      ],
    },
    {
      href: '/about',
      label: 'About',
      children: [
        { href: '/founder', label: 'Founder' },
        { href: '/press', label: 'Press' },
        { href: '/partners', label: 'Partners' },
        { href: '/sponsorships', label: 'Partner With Us' },
      ],
    },
    { href: '/contact', label: 'Contact' },
  ],
  statusPill: { label: 'Booking Summer 2026' },
};
