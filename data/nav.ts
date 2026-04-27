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
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Local Guide' },
    { href: '/local', label: 'Businesses' },
    {
      href: '/about',
      label: 'About',
      children: [{ href: '/founder', label: 'Founder' }],
    },
    { href: '/contact', label: 'Contact' },
  ],
  statusPill: { label: 'Booking Summer 2026' },
};
