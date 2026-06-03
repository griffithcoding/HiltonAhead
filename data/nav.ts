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
        { href: '/services#custom-itineraries', label: 'Custom Itineraries' },
        { href: '/services#villa-resort-booking', label: 'Villa & Resort Booking' },
        { href: '/services#group-family-trips', label: 'Group & Family Trips' },
        { href: '/services#on-island-concierge', label: 'On-Island Concierge' },
        { href: '/services#reservations-tee-times', label: 'Dining & Tee Times' },
        { href: '/hilton-head-packing-list', label: 'Packing List' },
        { href: '/itinerary', label: 'Request Itinerary' },
      ],
    },
    {
      href: '/blog',
      label: 'Local Guide',
      children: [
        { href: '/best-time-to-visit-hilton-head', label: 'Best Time to Visit' },
        { href: '/hilton-head-weather', label: 'Weather by Month' },
        { href: '/hilton-head-tides', label: 'Tide Charts' },
        { href: '/hilton-head-hurricane-season', label: 'Hurricane Season' },
        { href: '/hilton-head-tee-times', label: 'Tee Times' },
        { href: '/guides/2027-rbc-heritage', label: '2027 Heritage Kit (free)' },
        { href: '/events', label: 'Events Calendar' },
        { href: '/stories', label: 'Stories' },
      ],
    },
    {
      href: '/vacation-rentals',
      label: 'Vacation Rentals',
      children: [
        { href: '/vacation-rentals/sea-pines', label: 'Sea Pines' },
        { href: '/vacation-rentals/palmetto-dunes', label: 'Palmetto Dunes' },
        { href: '/vacation-rentals/forest-beach', label: 'Forest Beach' },
        { href: '/vacation-rentals/shelter-cove', label: 'Shelter Cove' },
        { href: '/vacation-rentals/port-royal', label: 'Port Royal' },
        { href: '/vacation-rentals/mid-island', label: 'Mid-Island' },
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
