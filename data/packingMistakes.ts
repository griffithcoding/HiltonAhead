// data/packingMistakes.ts
/**
 * The 10 mistakes first-time Hilton Head visitors make — paired with the
 * Amazon product that fixes each one. Renders into the
 * `/hilton-head-packing-list` page (skim table + deep-dive sections).
 *
 * Voice contract (per spec §8):
 *   - 30-year HHI resident voice; no exclamation marks; no "BEST" superlatives
 *   - Each `body` paragraph cites at least one specific local detail
 *   - Anchor copy (in JSX) is the product/brand name, never "click here"
 *   - Do NOT cite specific prices in body — Amazon TOS bans this. Use ranges
 *     only via the referenced amazonProducts.ts `priceBand` field.
 *
 * Cross-reference invariant: exactly one of `productSlug` or `amazonUrl`
 * must be set per entry. The renderer prefers `amazonUrl` (used for the
 * mistakes where we don't yet have an ASIN in amazonProducts.ts).
 *
 * Audit cadence: quarterly. Spot-check 3 random links per audit. If an
 * ASIN 404s, swap to a search URL via `searchUrl` until a new ASIN lands.
 */

import { AMAZON_PRODUCTS } from './amazonProducts';

export type PackingMistake = {
  /** Display number "01" through "10". */
  number: string;
  /** Anchor slug used for the H2 id, analytics placement, and skip-link target. */
  slug: string;
  /** Skim-table ❌ column text (under 70 chars). */
  mistakeShort: string;
  /** Skim-table 🟢 column text (under 70 chars). */
  fixShort: string;
  /** H2 used by the deep-dive section. Statement, not product name. */
  deepDiveHeading: string;
  /** 100–150 word local-context paragraph. Voice contract above applies. */
  body: string;
  /** Display name shown in inline link + skim-table 🛒 column. */
  productName: string;
  /** Cross-reference into data/amazonProducts.ts. Set this OR amazonUrl, not both. */
  productSlug?: string;
  /** Direct Amazon URL for entries with no cross-reference (mistakes #2 + #8). */
  amazonUrl?: string;
  /** Optional search URL fallback in case the primary URL 404s. */
  searchUrl?: string;
  /** Quarterly audit date — bump on every catalog spot-check. */
  dateAuditedAt: string;
};

const AUDIT_DATE = '2026-05-25';

export const PACKING_MISTAKES: ReadonlyArray<PackingMistake> = [
  {
    number: '01',
    slug: 'cheap-umbrella',
    mistakeShort: 'A pop-up beach umbrella from the grocery store',
    fixShort: 'A sand-anchor umbrella that holds in 18 mph gusts',
    deepDiveHeading: 'The umbrella you bring will get destroyed',
    body:
      "Atlantic wind off Coligny and Burkes Beach runs 12 to 18 mph most summer afternoons — that's the wind that snaps the ribs of a $30 pop-up by 2 p.m. We've watched it happen on the same dune line for years. The fix is an anchor-based umbrella that screws into the sand the way a tent stake holds: a sand auger or weighted ballast base, with a vented canopy that lets gusts pass through instead of catching them like a sail. BeachBub and Sport-Brella are the two systems we see locals carry, and the difference is the difference between standing up at lunch and chasing a tumbling umbrella down the shore.",
    productName: 'BeachBub or Sport-Brella anchor umbrella',
    productSlug: undefined,
    amazonUrl: 'https://www.amazon.com/s?k=beachbub+all-in-one+beach+umbrella',
    searchUrl: 'https://www.amazon.com/s?k=sport-brella+vented+beach+umbrella',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '02',
    slug: 'narrow-wheel-cart',
    mistakeShort: 'A folding wagon with narrow wheels',
    fixShort: 'A wide-tire (9"+) beach cart that floats over soft sand',
    deepDiveHeading: 'The wagon you brought gets stuck in Coligny sand',
    body:
      "Coligny Beach Park is the busiest public access on the island, and the walk from the parking lot to the high-tide line crosses about 80 feet of dry, soft, ankle-deep sand. A standard folding wagon with 4-inch hard plastic wheels sinks halfway and stops moving — we've watched grandparents and dads pivot to single-load shuttles four trips deep. Wide-tire beach carts (Mac Sports All-Terrain or WonderWheeler Wide with 9-inch balloon tires) cross that same sand in one pass, fully loaded, without anyone breaking a sweat. The cooler, the boogie boards, the chairs, the umbrella: one trip.",
    productName: 'Mac Sports All-Terrain or WonderWheeler Wide',
    amazonUrl: 'https://www.amazon.com/s?k=mac+sports+all+terrain+beach+wagon+wide+wheel',
    searchUrl: 'https://www.amazon.com/s?k=wonderwheeler+wide+beach+cart',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '03',
    slug: 'wrong-sunscreen',
    mistakeShort: 'Standard chemical sunscreen',
    fixShort: 'Reef-safe mineral or hybrid sunscreen',
    deepDiveHeading: 'Your usual sunscreen is the wrong sunscreen here',
    body:
      "South Carolina's Lowcountry estuaries — Calibogue Sound, Broad Creek, the May River — drain straight into the Atlantic past the same beaches you're swimming on. Reef-safe sunscreen isn't just a Hawaiian thing; it's what locals carry because the chemistry that wrecks coral also wrecks the oyster beds and salt marshes feeding the shrimp boats out of Bluffton. The two we keep in the truck are Sun Bum SPF 50 spray for fast application on restless kids and Blue Lizard for travelers with sensitive skin or a mineral-only preference. Both apply cleanly, smell like vacation, and don't ghost you white on the porch photos.",
    productName: 'Sun Bum SPF 50 Spray (or Blue Lizard Sensitive for mineral-only)',
    productSlug: 'sun-bum-spf-50-spray',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '04',
    slug: 'wrong-bug-spray',
    mistakeShort: 'DEET, citronella, or no bug spray at all',
    fixShort: 'Picaridin 20% — the only thing no-see-ums respect',
    deepDiveHeading: 'No-see-ums laugh at the bug spray you brought',
    body:
      "From early May through late October, Lowcountry no-see-ums arrive at dusk along marsh edges, in the lagoon-side patios at Palmetto Dunes, and behind the dunes at Mitchelville. DEET deters mosquitoes fine but no-see-ums work right through it. The molecule that actually keeps them off skin is picaridin at 20 percent, and the bottle locals carry is Sawyer or Natrapel. Spray ankles, calves, and the back of the neck about an hour before sunset, and the difference is the difference between a relaxed porch evening and looking like you wrestled a thornbush by the time the kids are in bed.",
    productName: 'Sawyer Picaridin 20% (or Natrapel)',
    productSlug: 'sawyer-picaridin-spray',
    searchUrl: 'https://www.amazon.com/s?k=sawyer+picaridin+20+percent+insect+repellent',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '05',
    slug: 'bare-feet',
    mistakeShort: 'Flip-flops or bare feet for sound and lagoon edges',
    fixShort: 'Slip-on water shoes (closed-toe protection)',
    deepDiveHeading: 'The water shoes you skipped just cost you the afternoon',
    body:
      "The Atlantic surf side of Hilton Head is mostly clean white sand. The marsh-and-sound side — Pinckney Island, Skull Creek, the back lagoons at Sea Pines and Palmetto Dunes — is a different beach. Live oyster shells colonize the mud-bottom edges, and stepping on one in flip-flops slices you open. We tell every kayak and SUP renter to wear closed-toe water shoes, slip-on style, no laces. The exact model doesn't matter as long as the sole is thick enough to deflect a sharp edge and the upper drains fast. One small purchase, no ruined afternoons.",
    productName: 'Slip-on water shoes',
    productSlug: 'water-shoes-keen',
    searchUrl: 'https://www.amazon.com/s?k=slip+on+water+shoes+quick+dry',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '06',
    slug: 'no-dry-bag',
    mistakeShort: 'A loose phone in the kayak or paddleboard',
    fixShort: 'A 10L roll-top dry bag (or waterproof phone case)',
    deepDiveHeading: 'The phone in your kayak ends the trip',
    body:
      "Marsh water on Hilton Head is brackish, warm, and not particularly forgiving to an iPhone or AirPods that go overboard mid-paddle. The fix is cheap insurance: a 10-liter roll-top dry bag for phone, keys, wallet, and a small towel, clipped to a deck loop. We see renters at Outside Hilton Head and H2O Sports cinch their bags shut and tuck them between their legs in the cockpit — that's it, that's the whole technique. Trip ends with photos instead of an insurance claim.",
    productName: 'Sea to Summit Lightweight 10L Dry Bag',
    productSlug: 'sea-to-summit-dry-bag',
    searchUrl: 'https://www.amazon.com/s?k=sea+to+summit+10l+dry+bag',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '07',
    slug: 'cheap-chair',
    mistakeShort: 'A budget folding camp chair',
    fixShort: 'Tommy Bahama 5-position backpack beach chair',
    deepDiveHeading: 'The folding chair you brought sinks',
    body:
      "Dry sand at the south end of Coligny is deep and powdery — the legs of a $20 folding camp chair sink three inches in the first ten minutes, and the seat angle drops into a posture that puts your hips below your knees. Locals carry the Tommy Bahama 5-position backpack chair: wider feet that don't sink, a real recline that lets you actually read, a cooler pouch in the back for two waters, and shoulder straps so it carries hands-free from the cart to the spot. We've watched the same model survive ten summers in a beach garage and still hold up.",
    productName: 'Tommy Bahama 5-Position Backpack Chair',
    productSlug: 'tommy-bahama-beach-chair',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '08',
    slug: 'cheap-cooler',
    mistakeShort: 'A $30 styrofoam-walled cooler for a week-long villa',
    fixShort: 'A rotomolded cooler or Coleman Xtreme (5-day ice retention)',
    deepDiveHeading: 'Your cooler turns into a soup pot by 2 p.m.',
    body:
      "It's 90 degrees and humid most July afternoons. A flimsy cooler with thin walls loses ice in four hours — and then you're sitting on hot turkey sandwiches and skunky beer at the high-tide line. The fix is two-pronged: for the villa, a Yeti Roadie 24 or a Coleman Xtreme 5-day handles a week of groceries without daily ice runs. For the beach, the same cooler also handles a day at Coligny if you pre-chill it the night before and pack with block ice underneath, cubes on top. The math works: one purchase, fewer Piggly Wiggly trips, cold beverages at 5 p.m.",
    productName: 'Yeti Roadie 24 or Coleman Xtreme 5-Day',
    amazonUrl: 'https://www.amazon.com/s?k=yeti+roadie+24+cooler',
    searchUrl: 'https://www.amazon.com/s?k=coleman+xtreme+5+day+cooler',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '09',
    slug: 'no-polarized-glasses',
    mistakeShort: 'Non-polarized sunglasses (or no sunglasses)',
    fixShort: 'Polarized sunglasses you can afford to lose to the surf',
    deepDiveHeading: 'You will not see the dolphins without polarization',
    body:
      "Bottlenose dolphins work the shoreline along Sea Pines and Folly Field most mornings, often within 30 yards of the wading depth. Non-polarized sunglasses turn the surf into a wall of glare and you miss the dorsal fins entirely. Polarized lenses cut the glare so you can see into the wave — fish, rays, the occasional shark, and the dolphins. Goodr makes a $25 polarized frame that doesn't slide off when you sweat and doesn't break the household budget when one pair ends up in the surf, which is the realistic outcome about half the time. Bring two pairs.",
    productName: 'Goodr Polarized Sunglasses',
    productSlug: 'goodr-polarized-sunglasses',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '10',
    slug: 'baseball-cap',
    mistakeShort: 'A baseball cap (leaves ears and neck exposed)',
    fixShort: 'A wide-brim UPF 50+ hat that stays on in wind',
    deepDiveHeading: 'A baseball cap will get you sunburned by day two',
    body:
      "Sun exposure on a Hilton Head beach is a six- or seven-hour proposition once you factor in the walk, the swim, lunch on the sand, and the second swim. A baseball cap covers the forehead and that's it — the ears, the back of the neck, and the tops of the cheeks burn first, and they burn worst. The fix is a wide-brim packable hat in UPF 50+ fabric with a chin cord for the wind. Wallaroo and Coolibar are the two brands we see at the boat ramp and on the dock — they pack flat, dry fast, and the brim doesn't fold up the first time the wind catches it.",
    productName: 'Wallaroo or Coolibar UPF 50+ wide-brim hat',
    productSlug: 'wide-brim-sun-hat',
    dateAuditedAt: AUDIT_DATE,
  },
];

/**
 * Resolve the Amazon link to use for a given mistake. Prefers explicit
 * `amazonUrl` (for entries without a catalog product), falls back to the
 * deeplink from `data/amazonProducts.ts`, and lastly to the search URL.
 */
export function resolveMistakeUrl(m: PackingMistake): string {
  if (m.amazonUrl) return m.amazonUrl;
  if (m.productSlug) {
    const product = AMAZON_PRODUCTS.find((p) => p.slug === m.productSlug);
    if (product) return product.deeplink;
  }
  if (m.searchUrl) return m.searchUrl;
  return 'https://www.amazon.com/';
}
