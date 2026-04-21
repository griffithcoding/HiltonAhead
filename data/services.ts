export const services = {
  eyebrow: 'What we handle',
  heading: {
    plain: 'Five things we do better than',
    accent: 'anyone else.',
  },
  subheading:
    'Every trip is different, but these are the jobs that benefit most from a local in your corner.',
  items: [
    {
      icon: '🗓️',
      slug: 'custom-itineraries',
      title: 'Custom Itineraries',
      body:
        'Day-by-day planning built around your group, your budget, and the vibe you actually want. Golf heavy, kid friendly, quiet beach days, or all three.',
    },
    {
      icon: '🏝️',
      slug: 'villa-resort-booking',
      title: 'Villa & Resort Booking',
      body:
        'From Sea Pines oceanfront villas to Palmetto Dunes and Forest Beach. We pick the right property for your group and negotiate the rate.',
    },
    {
      icon: '👨‍👩‍👧‍👦',
      slug: 'group-family-trips',
      title: 'Group & Family Trips',
      body:
        'Weddings, reunions, corporate offsites, golf buddy trips. Coordinated lodging, transportation, dining, and activities for groups of 10 to 100.',
    },
    {
      icon: '🛎️',
      slug: 'on-island-concierge',
      title: 'On-Island Concierge',
      body:
        'Live support while you\'re here: last-minute boat charters, restaurant swaps, kid-sitter intros, bike deliveries to your door. One text, handled.',
    },
    {
      icon: '⛳',
      slug: 'reservations-tee-times',
      title: 'Dining & Tee-Time Reservations',
      body:
        'We hold the 7pm table at Skull Creek Boathouse and the 7am tee time at Harbour Town you can\'t get online. Relationships you can\'t fake.',
    },
  ],
} as const;

export type Service = (typeof services.items)[number];
