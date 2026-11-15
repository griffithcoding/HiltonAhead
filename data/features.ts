/**
 * Site-wide feature switches.
 *
 * consumerProductsEnabled
 * -----------------------
 * Master switch for the consumer-facing paid travel products:
 *   - Compass, Charter, Heritage (B2C_TIERS in data/pricing.ts)
 *   - Heritage Kit · VIP pre-order
 *   - Insider Club (monthly + yearly)
 *   - Itinerary Packs: Couples + Golf (INFO_PRODUCT_TIERS, data/itineraryPacks.ts)
 *
 * While false the site runs as an SEO + affiliate site:
 *   - /insider-club and /itinerary-packs/* return 404 and are out of the sitemap
 *   - footer links to them are hidden
 *   - the /services pricing section and the Heritage VIP pre-order box are hidden
 *   - /api/checkout rejects those tiers server-side
 *
 * Everything else is deliberately left in place so the products can come back:
 * data/pricing.ts, data/itineraryPacks.ts, the Stripe webhook (still processes
 * renewals/refunds for any existing buyers), pack delivery email in
 * app/lib/email.ts, the .env.example price IDs, and the purchases migrations.
 *
 * TO RESTORE: set this to true, redeploy, then
 *   1. re-add this line to public/llms.txt under "## Optional":
 *      - [Insider Club](https://www.hiltonahead.com/insider-club): Email newsletter with local trip-planning notes.
 *   2. confirm the STRIPE_PRICE_* and DOWNLOAD_URL_ITINERARY_PACK_* env vars
 *      are set in the deploy environment.
 *
 * This is a code constant, not an env var, on purpose: flipping it does not
 * require access to the hosting dashboard.
 *
 * B2B products (directory Listed/Featured, ad slots) are NOT affected.
 */
export const consumerProductsEnabled = false;

/**
 * servicesEnabled
 * ---------------
 * Switch for the consulting "Services" surface (custom itineraries, villa &
 * resort booking, group trips, on-island concierge, reservations).
 *
 * While false:
 *   - /services redirects (307) to the homepage
 *   - the "Services" nav category and "Services" footer column are hidden
 *   - the homepage Services section is hidden
 *   - /services and /services#* are out of the sitemap and the site search
 *   - the "Services" breadcrumb step and "See pricing" / "Compare services"
 *     buttons that pointed at /services are hidden
 *   - the "## Services" section is removed from public/llms.txt
 *
 * All content stays in data/services.ts, components/sections/Services.tsx and
 * app/services/page.tsx. The /itinerary request form is NOT affected.
 *
 * TO RESTORE: set to true, redeploy, then paste this back into
 * public/llms.txt (after the "Request an itinerary" line):
 *
 * ## Services
 *
 * - [Custom Itineraries](https://www.hiltonahead.com/services#custom-itineraries): Day-by-day planning built around your group, budget, and trip style. Flat fee, quoted up front through the itinerary form.
 * - [Villa & Resort Booking](https://www.hiltonahead.com/services#villa-resort-booking): Sea Pines, Palmetto Dunes, Forest Beach, Shelter Cove. 60+ partner properties at preferred rates averaging 8–12% below public listings.
 * - [Group & Family Trips](https://www.hiltonahead.com/services#group-family-trips): Weddings, reunions, corporate offsites, golf trips for 10–100 people.
 * - [On-Island Concierge](https://www.hiltonahead.com/services#on-island-concierge): Live support during your stay — boat charters, dining swaps, bike delivery, sitter intros.
 * - [Dining & Tee-Time Reservations](https://www.hiltonahead.com/services#reservations-tee-times): Skull Creek Boathouse, Harbour Town Golf Links, and other reservations the public booking systems won't show.
 */
export const servicesEnabled = false;

/**
 * tripPlanningEnabled
 * -------------------
 * Switch for the "we plan your trip" offer: the /itinerary request form and
 * every call-to-action that leads to it (header and mobile-menu "Plan my trip",
 * homepage hero button, final CTA band, "Request an itinerary" blocks on
 * neighborhood / trip-type / event / blog / comparison pages, "Have us book it"
 * buttons, calculators' quote links).
 *
 * While false: /itinerary redirects (307) home, /api/itinerary returns 503,
 * and the page is out of the sitemap and site search. Also swapped (by flag)
 * to guide-site wording: the FAQ matrix (pricing cluster, "about" cluster),
 * homepage FAQ, About "How we work" + "What you get", homepage stats strip,
 * schema serviceType, the by-the-numbers "client savings" fact, and the
 * checkout canceled / verify-email fallback links.
 *
 * NOT gated by this flag (reworded in place, restore with `git log -p`):
 * taglines / hero / metadata / OG text, the sentences in data/tripTypes.ts,
 * months.ts, neighborhoods.ts, stories.ts, the founder bio, public/llms.txt,
 * public/llms-full.txt (service tiers + pricing FAQ removed), and the offer
 * paragraphs / CTA sections removed from data/posts.ts.
 */
export const tripPlanningEnabled = false;

/**
 * sellOrRentPageEnabled / golfPackagesPageEnabled
 * -----------------------------------------------
 * Individual page switches. While false the page redirects (307) to the
 * homepage and is removed from the sitemap. Inbound links were removed from
 * the footer, cross-link lists and blog text; restore those from git history.
 */
export const sellOrRentPageEnabled = false;
export const golfPackagesPageEnabled = false;
