/**
 * Curated Amazon product database — single source of truth for every
 * product rendered through <AmazonProductGrid>.
 *
 * Why this file exists (not inline in pages):
 *   1. Editorial control — one place to update an out-of-stock ASIN or swap
 *      a discontinued product without grepping JSX.
 *   2. FTC voice consistency — all "we recommend" descriptions live here so
 *      they match brand voice (no marketing-speak).
 *   3. Amazon TOS — descriptions are paraphrased originals, not verbatim
 *      Amazon product titles. We render text-only (no Amazon product images)
 *      because the Product Advertising API for image rights is gated by
 *      having 3 qualifying sales in 180 days. Plain links earn commission
 *      without needing PA-API access.
 *
 * Adding a product:
 *   1. Find the product on Amazon, copy the ASIN from the URL
 *      (https://www.amazon.com/dp/<ASIN>/...).
 *   2. Use `https://www.amazon.com/dp/${ASIN}` as the deeplink for ASIN
 *      products, OR a search URL for category lookups
 *      (`https://www.amazon.com/s?k=<keywords>`).
 *   3. Pick a category from AmazonProductCategoryId or add a new one.
 *   4. Write a 1–2 sentence pitch in our voice — first sentence is the
 *      direct recommendation, second is the reason.
 *
 * Volatility note: ASINs can become unavailable. Audit this file quarterly
 * by spot-checking 5 random links. Replace any that 404 with search URLs.
 *
 * Where these render: <AmazonProductGrid category="..."> queries this file
 * by category, then renders compact text-only cards through <AffiliateLink>
 * (which handles rel="sponsored nofollow", click tracking, and tag stamping).
 */

export type AmazonProductCategoryId =
  | 'beach-essentials'
  | 'family-beach'
  | 'premium-beach'
  | 'couples-beach'
  | 'water-sports'
  | 'bug-protection'
  | 'fishing-gear'
  | 'beach-reads'
  | 'summer-comfort';

export interface AmazonProductCategory {
  id: AmazonProductCategoryId;
  /** Section heading rendered above the grid. */
  title: string;
  /** Optional 1–2 sentence intro under the heading. */
  intro?: string;
}

export const AMAZON_PRODUCT_CATEGORIES: Record<
  AmazonProductCategoryId,
  AmazonProductCategory
> = {
  'beach-essentials': {
    id: 'beach-essentials',
    title: 'Beach essentials we tell every guest to bring',
    intro:
      'Sunscreen, a hat that actually stays on, a chair that survives the sand. The basics that turn a good beach day into a great one.',
  },
  'family-beach': {
    id: 'family-beach',
    title: 'Family beach gear we recommend',
    intro:
      'Wagon-haulers, rash-guard sets, sand toys the kids actually use past day two. Tested by the families we plan trips for.',
  },
  'premium-beach': {
    id: 'premium-beach',
    title: 'Upgrades worth the splurge',
    intro:
      "If you're staying in an oceanfront villa for a week, a few of these turn the patio into a second living room.",
  },
  'couples-beach': {
    id: 'couples-beach',
    title: 'For the slower, quieter beach week',
    intro:
      'Couples trips have different rhythm. Picnic-ready blanket, a real speaker (not a phone propped on a towel), polarized sunglasses you won’t lose.',
  },
  'water-sports': {
    id: 'water-sports',
    title: 'On-the-water gear',
    intro:
      'Hilton Head water is brackish and warm; the bottom has oyster shells in places. A dry bag and water shoes change the day.',
  },
  'bug-protection': {
    id: 'bug-protection',
    title: 'No-see-um defense',
    intro:
      "May through October the Lowcountry no-see-ums find anyone without picaridin. This is the brand the locals carry, not the grocery-store stuff.",
  },
  'fishing-gear': {
    id: 'fishing-gear',
    title: 'Starter surf-fishing setup',
    intro:
      'For travelers who want to throw a line off the beach without booking a charter. The basics, not the trophy kit.',
  },
  'beach-reads': {
    id: 'beach-reads',
    title: 'Lowcountry reading list',
    intro:
      'Books with the right voice for a Hilton Head week. Pat Conroy if you only read one; Mary Kay Andrews if you want lighter.',
  },
  'summer-comfort': {
    id: 'summer-comfort',
    title: 'Things that make July tolerable',
    intro:
      'July on Hilton Head is 88°F and humid. These four items punch above their weight.',
  },
};

export interface AmazonProduct {
  /** Short slug — used as a React key. */
  slug: string;
  /** Display name (paraphrased — not Amazon’s verbatim title). */
  name: string;
  /** Category bucket this product sits in. */
  category: AmazonProductCategoryId;
  /**
   * 1–2 sentence editorial recommendation in our voice. First sentence is
   * the recommendation. Second sentence (optional) is the local-context why.
   */
  pitch: string;
  /**
   * Direct deeplink to Amazon. Prefer specific ASINs
   * (`https://www.amazon.com/dp/<ASIN>`) for stable bestsellers; use search
   * URLs (`https://www.amazon.com/s?k=<keywords>`) for category lookups
   * where any of several products work.
   *
   * Do NOT include `?tag=...` here — withAffiliateParams() stamps the right
   * tracking ID at render time based on the page's `placement` prop.
   */
  deeplink: string;
  /** Rough price band shown next to the title. Updated quarterly. */
  priceBand?: string;
  /**
   * Why locals recommend this specifically. Optional flavor copy shown
   * smaller under the pitch. Keep under 60 chars.
   */
  whyLocal?: string;
}

/**
 * Products. Roughly 35 entries across 9 categories. Mix of specific ASINs
 * (`/dp/<ASIN>`) for iconic bestsellers and search URLs for category-level
 * picks where many products satisfy the need.
 */
export const AMAZON_PRODUCTS: ReadonlyArray<AmazonProduct> = [
  // ——— Beach essentials ———
  {
    slug: 'sun-bum-spf-50-spray',
    name: 'Sun Bum SPF 50 Spray',
    category: 'beach-essentials',
    pitch:
      'The reef-safe spray we keep in the truck. SPF 50, smells like vacation, applies fast enough for restless kids.',
    deeplink: 'https://www.amazon.com/dp/B00FB52HRO',
    priceBand: '$15–20',
    whyLocal: 'Reef-safe — required at South Carolina beaches',
  },
  {
    slug: 'blue-lizard-sensitive',
    name: 'Blue Lizard Sensitive SPF 30+',
    category: 'beach-essentials',
    pitch:
      'Mineral-based, for travelers with kid-sensitive skin or the sunscreen-allergic. The cap turns blue in UV — useful reminder.',
    deeplink: 'https://www.amazon.com/dp/B0007ZE71E',
    priceBand: '$15–25',
  },
  {
    slug: 'goodr-polarized-sunglasses',
    name: 'Goodr Polarized Sunglasses',
    category: 'beach-essentials',
    pitch:
      "$25 polarized shades that don't slide off when you sweat. Bring two pairs — you'll lose one to the surf.",
    deeplink: 'https://www.amazon.com/s?k=goodr+polarized+sunglasses',
    priceBand: '$25–30',
  },
  {
    slug: 'wide-brim-sun-hat',
    name: 'Wallaroo or Coolibar wide-brim hat',
    category: 'beach-essentials',
    pitch:
      'Packable, UPF 50+, stays on in 15 mph wind. Better than a baseball cap for an all-day beach session.',
    deeplink: 'https://www.amazon.com/s?k=wallaroo+wide+brim+sun+hat+upf+50',
    priceBand: '$30–60',
  },
  {
    slug: 'tommy-bahama-beach-chair',
    name: 'Tommy Bahama 5-Position Backpack Chair',
    category: 'beach-essentials',
    pitch:
      'The chair we see on every Coligny Beach setup. Reclines flat, has a cooler pouch in the back, carries on like a backpack.',
    deeplink: 'https://www.amazon.com/s?k=tommy+bahama+beach+chair+5+position',
    priceBand: '$60–80',
  },
  {
    slug: 'beach-umbrella-anchor',
    name: 'BeachBub or AmmSun anchored umbrella',
    category: 'beach-essentials',
    pitch:
      "A sand-anchored umbrella that doesn't pinwheel down the beach at 11am. The base does the real work.",
    deeplink: 'https://www.amazon.com/s?k=anchored+beach+umbrella+wind+resistant',
    priceBand: '$70–120',
  },
  {
    slug: 'sand-resistant-beach-towel',
    name: 'Tesalate or Sand Cloud beach towel',
    category: 'beach-essentials',
    pitch:
      'Turkish-style, sand-shedding, dries fast. Folds smaller than a hotel towel and works on the car seat for the drive home.',
    deeplink: 'https://www.amazon.com/s?k=tesalate+sand+free+beach+towel',
    priceBand: '$25–50',
  },

  // ——— Family beach ———
  {
    slug: 'mac-sports-collapsible-wagon',
    name: 'Mac Sports Collapsible Beach Wagon',
    category: 'family-beach',
    pitch:
      'The wagon you see every family-of-four hauling at Coligny. Folds flat in the trunk, hauls 150 lbs of cooler + chairs + kids.',
    deeplink: 'https://www.amazon.com/dp/B00WSCKBKO',
    priceBand: '$80–130',
    whyLocal: 'Sand wheels worth the upgrade',
  },
  {
    slug: 'sand-toys-bucket-set',
    name: 'Hape or Melissa & Doug sand toy set',
    category: 'family-beach',
    pitch:
      "Sturdy buckets and shovels that survive past day two. Skip the dollar-store sets — they crack and you'll be buying again Wednesday.",
    deeplink: 'https://www.amazon.com/s?k=melissa+and+doug+sand+toys',
    priceBand: '$15–40',
  },
  {
    slug: 'kids-rash-guard-set',
    name: 'Kids UPF 50+ rash guard set',
    category: 'family-beach',
    pitch:
      'Long-sleeve rash guard + swim trunks. Means less sunscreen reapplication and a kid who can stay out past noon without burning.',
    deeplink: 'https://www.amazon.com/s?k=kids+upf+50+rash+guard+set',
    priceBand: '$20–40',
  },
  {
    slug: 'coppertone-kids-spray',
    name: 'Coppertone Kids SPF 70 Spray',
    category: 'family-beach',
    pitch:
      'The high-SPF spray we recommend for under-10 kids. Continuous mist, sticks even after a swim.',
    deeplink: 'https://www.amazon.com/dp/B00YBA3OPM',
    priceBand: '$10–15',
  },
  {
    slug: 'kid-life-jacket-coast-guard',
    name: 'Stearns Coast-Guard-approved kid life vest',
    category: 'family-beach',
    pitch:
      'Required on boat charters, kayaks, and SUPs anywhere on the island. The rental vests are usually fine but yours will fit your kid better.',
    deeplink: 'https://www.amazon.com/s?k=stearns+kids+coast+guard+life+vest',
    priceBand: '$25–40',
  },

  // ——— Premium beach (oceanfront villa renters) ———
  {
    slug: 'yeti-tundra-45',
    name: 'YETI Tundra 45 Cooler',
    category: 'premium-beach',
    pitch:
      "Holds ice for four days. Worth the splurge if you're stocking a villa for a week and don't want to refill the rec-room fridge twice a day.",
    deeplink: 'https://www.amazon.com/dp/B07RW6Z692',
    priceBand: '$325–375',
    whyLocal: 'Bear-resistant; also “kid + cousin”-resistant',
  },
  {
    slug: 'yeti-roadie-24',
    name: 'YETI Roadie 24 Cooler',
    category: 'premium-beach',
    pitch:
      'The day-trip Yeti. Lighter than the Tundra, carries 18 cans plus ice. Right size for two adults on a Daufuskie ferry day.',
    deeplink: 'https://www.amazon.com/s?k=yeti+roadie+24+cooler',
    priceBand: '$225–275',
  },
  {
    slug: 'rtic-45-cooler',
    name: 'RTIC 45 Cooler',
    category: 'premium-beach',
    pitch:
      'The honest Yeti alternative. Same ice retention class, roughly half the price. We carry both.',
    deeplink: 'https://www.amazon.com/s?k=rtic+45+hard+cooler',
    priceBand: '$200–240',
  },
  {
    slug: 'sand-cloud-blanket',
    name: 'Sand Cloud Turkish beach blanket',
    category: 'premium-beach',
    pitch:
      'Bigger than a towel, dries faster, doubles as a picnic blanket for Harbour Town sunset shows.',
    deeplink: 'https://www.amazon.com/s?k=sand+cloud+turkish+beach+blanket',
    priceBand: '$45–70',
  },
  {
    slug: 'hydro-flask-32oz',
    name: 'Hydro Flask 32oz Wide Mouth',
    category: 'premium-beach',
    pitch:
      "Insulated water bottle that holds ice from sunrise to dinner. Non-negotiable for a Hilton Head August day.",
    deeplink: 'https://www.amazon.com/dp/B07T6PD9TV',
    priceBand: '$40–50',
  },

  // ——— Couples beach ———
  {
    slug: 'jbl-clip-4-speaker',
    name: 'JBL Clip 4 Bluetooth Speaker',
    category: 'couples-beach',
    pitch:
      "Waterproof, sand-resistant, clips to the chair. Loud enough for a couples picnic, quiet enough you won't get glared at by neighbors.",
    deeplink: 'https://www.amazon.com/dp/B09JBMTHKB',
    priceBand: '$65–80',
  },
  {
    slug: 'wine-tumbler-set',
    name: 'Insulated stainless wine tumbler set',
    category: 'couples-beach',
    pitch:
      "Most Hilton Head beaches are alcohol-permitting (Sea Pines and town beaches) but glass is banned everywhere. Stainless tumblers keep rosé cold and the cup hidden.",
    deeplink: 'https://www.amazon.com/s?k=stainless+steel+wine+tumbler+set',
    priceBand: '$20–40',
    whyLocal: 'Glass is banned on all HHI beaches',
  },
  {
    slug: 'picnic-blanket-waterproof',
    name: 'Waterproof-backed picnic blanket',
    category: 'couples-beach',
    pitch:
      "For Harbour Town sunset or the Coastal Discovery Museum lawn. The waterproof backing means dewy grass doesn't end the date early.",
    deeplink: 'https://www.amazon.com/s?k=waterproof+picnic+blanket+large',
    priceBand: '$25–45',
  },
  {
    slug: 'goodr-polarized-sunglasses-2',
    name: 'Polarized sunglasses (Goodr or Maui Jim)',
    category: 'couples-beach',
    pitch:
      "Buy two pairs. The honeymoon photos look better and you won't fight over the one good pair when one gets dropped in the surf.",
    deeplink: 'https://www.amazon.com/s?k=goodr+polarized+sunglasses',
    priceBand: '$25–250',
  },

  // ——— Water sports ———
  {
    slug: 'sea-to-summit-dry-bag',
    name: 'Sea to Summit 20L Dry Bag',
    category: 'water-sports',
    pitch:
      "Phone, wallet, keys, sunscreen — all stay dry on a kayak or boat day. The 20L is the right size; smaller fills too fast.",
    deeplink: 'https://www.amazon.com/s?k=sea+to+summit+lightweight+dry+bag+20l',
    priceBand: '$25–40',
  },
  {
    slug: 'water-shoes-keen',
    name: 'Keen Newport H2 sandals',
    category: 'water-sports',
    pitch:
      "Closed-toe water sandals. The Calibogue Sound bottom has oyster shells; flip-flops won't save your feet.",
    deeplink: 'https://www.amazon.com/s?k=keen+newport+h2+sandals',
    priceBand: '$85–120',
    whyLocal: 'Oyster-shell bottom protection',
  },
  {
    slug: 'adult-rash-guard',
    name: 'Adult UPF 50+ rash guard',
    category: 'water-sports',
    pitch:
      'Long-sleeve UPF 50+ shirt for kayak, SUP, or charter days. Sunburn after 6 hours in a kayak is otherwise guaranteed.',
    deeplink: 'https://www.amazon.com/s?k=adult+upf+50+long+sleeve+rash+guard',
    priceBand: '$25–40',
  },
  {
    slug: 'snorkel-set-basic',
    name: 'Cressi or U.S. Divers basic snorkel set',
    category: 'water-sports',
    pitch:
      "Mask + snorkel + fins kit. Hilton Head water visibility is limited so this isn't tropical-island snorkeling — but for tide pools at Hunting Island it works.",
    deeplink: 'https://www.amazon.com/s?k=cressi+snorkel+set+adult',
    priceBand: '$30–60',
  },

  // ——— Bug protection (Lowcountry-specific) ———
  {
    slug: 'sawyer-picaridin-spray',
    name: 'Sawyer Picaridin 20% Insect Repellent',
    category: 'bug-protection',
    pitch:
      "The only spray that consistently stops Lowcountry no-see-ums. DEET works on mosquitoes; picaridin works on both. Get the 20% formula.",
    deeplink: 'https://www.amazon.com/dp/B005MNZIBA',
    priceBand: '$10–15',
    whyLocal: 'No-see-um defense — the local non-negotiable',
  },
  {
    slug: 'after-bite-balm',
    name: 'After Bite anti-itch balm',
    category: 'bug-protection',
    pitch:
      "For the inevitable bite you'll get before you remember the picaridin. Stops the itch in 30 seconds.",
    deeplink: 'https://www.amazon.com/dp/B0017T7XAM',
    priceBand: '$6–10',
  },
  {
    slug: 'thermacell-mosquito-repeller',
    name: 'Thermacell portable mosquito repeller',
    category: 'bug-protection',
    pitch:
      "For villa decks at dusk — creates a 15-foot bug-free zone. Doesn't smell, doesn't spray, just works.",
    deeplink: 'https://www.amazon.com/s?k=thermacell+portable+mosquito+repeller',
    priceBand: '$25–40',
  },

  // ——— Fishing gear ———
  {
    slug: 'penn-battle-surf-combo',
    name: 'Penn Battle III surf-fishing combo',
    category: 'fishing-gear',
    pitch:
      "Pre-spooled rod + reel for under $200. Catches enough redfish and whiting off Burkes Beach to justify the airline check-bag fee.",
    deeplink: 'https://www.amazon.com/s?k=penn+battle+iii+surf+combo',
    priceBand: '$150–220',
  },
  {
    slug: 'tackle-box-starter',
    name: 'Plano starter tackle box',
    category: 'fishing-gear',
    pitch:
      'Stocked with hooks, weights, and a few jigs. Add fresh shrimp from Hudson\'s Seafood and you have a beach-fishing afternoon.',
    deeplink: 'https://www.amazon.com/s?k=plano+tackle+box+with+tackle',
    priceBand: '$25–60',
  },

  // ——— Beach reads (Lowcountry) ———
  {
    slug: 'prince-of-tides',
    name: 'The Prince of Tides — Pat Conroy',
    category: 'beach-reads',
    pitch:
      "If you only read one Lowcountry novel before a Hilton Head trip, this is it. Conroy's South Carolina lives in every sentence.",
    deeplink: 'https://www.amazon.com/dp/0553381547',
    priceBand: '$12–18',
  },
  {
    slug: 'high-tide-club',
    name: 'The High Tide Club — Mary Kay Andrews',
    category: 'beach-reads',
    pitch:
      "Lighter Lowcountry beach read. Three friends, one island, a will-they-won't-they at the bar. Perfect for a chair-and-cooler day.",
    deeplink: 'https://www.amazon.com/dp/B077V7L8HW',
    priceBand: '$10–16',
  },
  {
    slug: 'south-of-broad',
    name: 'South of Broad — Pat Conroy',
    category: 'beach-reads',
    pitch:
      "Set in Charleston but the Lowcountry voice carries the book. Read it on the drive down from Charlotte or Atlanta.",
    deeplink: 'https://www.amazon.com/s?k=south+of+broad+pat+conroy',
    priceBand: '$10–16',
  },

  // ——— Summer comfort (July/August specific) ———
  {
    slug: 'cooling-towel-mission',
    name: 'Mission Cooling Towel',
    category: 'summer-comfort',
    pitch:
      "Soak it, snap it, wear it. Drops the surface temp 30 degrees — the only way to walk Harbour Town at 2pm in August.",
    deeplink: 'https://www.amazon.com/s?k=mission+enduracool+cooling+towel',
    priceBand: '$10–20',
  },
  {
    slug: 'portable-fan-rechargeable',
    name: 'JISULIFE or OPOLAR rechargeable handheld fan',
    category: 'summer-comfort',
    pitch:
      "Battery fan with a clip. Saved more dinner reservations than we can count when the patio table runs hot.",
    deeplink: 'https://www.amazon.com/s?k=rechargeable+portable+fan+handheld',
    priceBand: '$15–40',
  },
  {
    slug: 'reusable-ice-packs',
    name: 'Reusable hard ice packs',
    category: 'summer-comfort',
    pitch:
      "Keeps a cooler cold without melting into a soup at hour six. Pre-freeze in the villa freezer the night before a beach day.",
    deeplink: 'https://www.amazon.com/s?k=hard+plastic+reusable+ice+packs',
    priceBand: '$15–25',
  },
];

/** Look up products by category. */
export function getProductsByCategory(
  categoryId: AmazonProductCategoryId,
): ReadonlyArray<AmazonProduct> {
  return AMAZON_PRODUCTS.filter((p) => p.category === categoryId);
}

/** Look up a category definition. */
export function getCategory(
  categoryId: AmazonProductCategoryId,
): AmazonProductCategory {
  return AMAZON_PRODUCT_CATEGORIES[categoryId];
}
