/**
 * Hashtag builder for spotlight posts.
 *
 * 5 always-on (brand + location) + 3–5 industry-specific from a static map
 * + 2–3 dynamic tags supplied by the caption generator (optional).
 *
 * Total target: 10–13 tags. Instagram caps at 30; we stay well under to avoid
 * looking spammy.
 */

import type { IndustrySlug } from '@/data/localBusinesses';

const ALWAYS_ON = [
  '#HiltonHead',
  '#HiltonHeadIsland',
  '#HiltonAhead',
  '#LowcountryLife',
  '#SCTravel',
];

const INDUSTRY_TAGS: Record<IndustrySlug, string[]> = {
  restaurants: ['#HiltonHeadEats', '#LowcountryFood', '#FoodieFinds', '#SouthernFood'],
  golf: ['#HiltonHeadGolf', '#GolfTravel', '#HeritageGolf', '#GolfLife'],
  'water-activities': ['#HiltonHeadBeach', '#KayakLife', '#OceanLife', '#BeachVibes'],
  weddings: ['#HiltonHeadWedding', '#LowcountryWedding', '#BeachWedding', '#DestinationWedding'],
  'spas-wellness': ['#HiltonHeadSpa', '#WellnessTravel', '#SelfCare', '#SpaDay'],
  'vacation-rentals': ['#HiltonHeadRentals', '#BeachHouse', '#VacationRental', '#IslandLife'],
  shopping: ['#HiltonHeadShopping', '#ShopLocal', '#BoutiqueShopping'],
  'family-activities': ['#FamilyTravel', '#HiltonHeadFamily', '#KidFriendly'],
  pizza: ['#PizzaLovers', '#LocalPizza', '#HiltonHeadEats'],
  transportation: ['#HiltonHeadTravel', '#GoldenIsleTransport'],
  'home-services': ['#HiltonHeadHomes', '#LowcountryLiving'],
  'fishing-charters': ['#HiltonHeadFishing', '#OffshoreFishing', '#InshoreFishing'],
  'dolphin-tours': ['#DolphinWatching', '#HiltonHeadTours', '#OceanAdventures'],
  photographers: ['#HiltonHeadPhotography', '#WeddingPhotographer', '#LocalPhotographer'],
  'real-estate': ['#HiltonHeadRealEstate', '#LowcountryHomes', '#BeachPropertyLover'],
  lessons: ['#HiltonHeadLessons', '#LocalExperience', '#LearnSomething'],
};

export function buildHashtagsFor(
  industry: IndustrySlug,
  dynamicTags: string[] = [],
): string[] {
  const industryTags = INDUSTRY_TAGS[industry] ?? [];
  const dynamic = dynamicTags
    .filter((t) => /^#[\w]{2,30}$/.test(t)) // shape guard
    .slice(0, 3);

  // Dedup + preserve order: always-on → industry → dynamic
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of [...ALWAYS_ON, ...industryTags, ...dynamic]) {
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}
