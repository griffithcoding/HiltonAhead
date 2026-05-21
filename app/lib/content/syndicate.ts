/**
 * Content syndication engine — pure derivation only.
 *
 * Takes a `Post` (or a placeholder seed) and returns a `ContentPack`: a bundle
 * of ready-to-publish copy for every distribution channel we operate. No I/O,
 * no side effects, deterministic for the same input. The API route and the
 * CLI script in `scripts/syndicate-all.ts` are responsible for transport.
 *
 * Why pure? So we can:
 *   1) unit-test asset shape and length constraints without mocks,
 *   2) re-derive on every UI render without coupling to disk,
 *   3) hash + diff `ContentPack` bodies for future "what changed" tracking.
 *
 * Voice: local insider, direct, no exclamation marks, no marketer-speak.
 * Every asset name-drops real Hilton Head specifics (Sea Pines, Palmetto
 * Dunes, Harbour Town, Skull Creek Boathouse, Hudson's, ELA's, May River
 * Golf Club, Atlantic Dunes, etc.) pulled from the post body when possible.
 */

import type { Post, PostBlock } from '@/data/posts';
import { brand } from '@/data/brand';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type Platform =
  | 'instagram_carousel'
  | 'instagram_reel'
  | 'linkedin_post'
  | 'pinterest_pin'
  | 'reddit_comment'
  | 'newsletter_teaser'
  | 'twitter_thread'
  | 'facebook_post';

export interface SyndicatedAsset {
  platform: Platform;
  /** 1-indexed. Multiple variants of the same platform share the same `platform` value. */
  variant: number;
  /** Ready-to-publish copy. May contain line breaks. */
  body: string;
  /** Platform-specific structured metadata (hashtags, image briefs, char counts, etc.). */
  meta: Record<string, string>;
  /** Canonical CTA URL. Always present even when the asset's copy doesn't directly link. */
  ctaUrl: string;
}

export interface ContentPack {
  sourceSlug: string;
  sourceTitle: string;
  /** ISO timestamp the pack was generated at. */
  generatedAt: string;
  assets: SyndicatedAsset[];
}

export interface SyndicateOptions {
  /** Override the canonical base URL (default: `brand.url`). */
  baseUrl?: string;
  /** Pin the generation timestamp (default: `new Date().toISOString()`). Helpful for deterministic snapshots. */
  now?: string;
}

// ---------------------------------------------------------------------------
// Domain vocabulary — real island specifics we sprinkle into derived copy
// when the post body doesn't name something itself. Keep tight and accurate.
// ---------------------------------------------------------------------------

const REAL_NEIGHBORHOODS = [
  'Sea Pines',
  'Palmetto Dunes',
  'Shelter Cove',
  'Forest Beach',
  'Folly Field',
  'Harbour Town',
  'North Forest Beach',
  'South Beach',
  'Mid-Island',
  'Bluffton',
];

const REAL_RESTAURANTS = [
  'Skull Creek Boathouse',
  "Hudson's on the Docks",
  "ELA's on the Water",
  'The Sea Shack',
  "Charlie's L'Etoile Verte",
  'The Lucky Rooster',
  "Frankie Bones",
  'Old Oyster Factory',
  'The Pearl Kitchen',
  'CQ Restaurant',
];

const REAL_GOLF = [
  'Harbour Town Golf Links',
  'Atlantic Dunes',
  'Heron Point',
  'May River Golf Club',
  'Robert Trent Jones Oceanfront',
  'Arthur Hills',
  'Palmetto Hall',
  'Country Club of Hilton Head',
];

// ---------------------------------------------------------------------------
// Block extraction helpers — flatten + pull substantive content from a post
// ---------------------------------------------------------------------------

function flattenBlocks(blocks: PostBlock[]): PostBlock[] {
  return blocks.flatMap((b) =>
    b.kind === 'section' ? [b, ...flattenBlocks(b.blocks)] : [b],
  );
}

/** Strip basic inline HTML to recover plain prose. */
function stripHtml(html: string): string {
  return html
    .replace(/<\s*br\s*\/?\s*>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Remove exclamation marks per house style. */
function tame(text: string): string {
  return text.replace(/!/g, '.').replace(/\.{2,}\s/g, '. ');
}

/** All paragraphs as plain text, in body order. */
function paragraphs(post: Post): string[] {
  return flattenBlocks(post.body)
    .filter((b): b is Extract<PostBlock, { kind: 'p' }> => b.kind === 'p')
    .map((b) => tame(stripHtml(b.html)))
    .filter((s) => s.length > 0);
}

/** All bullet-list items, flattened. */
function listItems(post: Post): string[] {
  const out: string[] = [];
  for (const b of flattenBlocks(post.body)) {
    if (b.kind === 'ul' || b.kind === 'ol') {
      for (const item of b.items) out.push(tame(stripHtml(item)));
    }
  }
  return out;
}

/** All H2 / H3 headings, in body order. */
function headings(post: Post): string[] {
  return flattenBlocks(post.body)
    .filter(
      (b): b is Extract<PostBlock, { kind: 'h2' | 'h3' }> =>
        b.kind === 'h2' || b.kind === 'h3',
    )
    .map((b) => tame(b.text.trim()))
    .filter((s) => s.length > 0);
}

/** Items pulled from `tier` blocks — each line is "Name — blurb". */
function tierLines(post: Post): string[] {
  const out: string[] = [];
  for (const b of flattenBlocks(post.body)) {
    if (b.kind === 'tier') {
      for (const item of b.items) {
        const blurb = tame(stripHtml(item.blurb));
        out.push(`${item.name} — ${blurb}`);
      }
    }
  }
  return out;
}

/** All FAQ question/answer pairs. */
function faqPairs(post: Post): Array<{ q: string; a: string }> {
  const out: Array<{ q: string; a: string }> = [];
  for (const b of flattenBlocks(post.body)) {
    if (b.kind === 'faq') {
      for (const item of b.items) {
        out.push({ q: tame(item.q.trim()), a: tame(stripHtml(item.a)) });
      }
    }
  }
  return out;
}

/** All callout HTML, plain-textified. */
function callouts(post: Post): Array<{ label: string; text: string }> {
  return flattenBlocks(post.body)
    .filter((b): b is Extract<PostBlock, { kind: 'callout' }> => b.kind === 'callout')
    .map((b) => ({
      label: b.label ?? 'Note',
      text: tame(stripHtml(b.html)),
    }));
}

/**
 * Heuristic: scan the post for any real Hilton Head proper nouns we care
 * about (neighborhoods, restaurants, golf courses). Falls back to a tight
 * default list if the body doesn't mention any.
 */
function detectSpecifics(post: Post): {
  neighborhoods: string[];
  restaurants: string[];
  golfCourses: string[];
} {
  const haystack = (
    post.title +
    ' ' +
    post.excerpt +
    ' ' +
    post.description +
    ' ' +
    paragraphs(post).join(' ') +
    ' ' +
    listItems(post).join(' ') +
    ' ' +
    headings(post).join(' ') +
    ' ' +
    tierLines(post).join(' ')
  ).toLowerCase();

  const found = (list: string[]) =>
    list.filter((n) => haystack.includes(n.toLowerCase()));

  let neighborhoods = found(REAL_NEIGHBORHOODS);
  let restaurants = found(REAL_RESTAURANTS);
  let golfCourses = found(REAL_GOLF);

  // Category-aware fallback so derived copy always names real places.
  if (neighborhoods.length === 0) {
    neighborhoods = ['Sea Pines', 'Palmetto Dunes', 'Forest Beach'];
  }
  if (restaurants.length === 0) {
    restaurants = ['Skull Creek Boathouse', "Hudson's on the Docks", "ELA's on the Water"];
  }
  if (golfCourses.length === 0 && post.category === 'Golf') {
    golfCourses = ['Harbour Town Golf Links', 'Atlantic Dunes', 'Heron Point'];
  }
  return { neighborhoods, restaurants, golfCourses };
}

// ---------------------------------------------------------------------------
// Hashtag library — category-tiered, mixed by volume.
//
// We hand-curate a 25-tag mix per platform call because programmatic
// concatenation tends to produce duplicates or wildly off-topic tags.
// ---------------------------------------------------------------------------

const HIGH_VOL_TAGS = [
  'travel',
  'vacation',
  'beachvacation',
  'southcarolina',
  'familytravel',
];

const MID_VOL_TAGS = [
  'hiltonhead',
  'hiltonheadisland',
  'hiltonheadsc',
  'lowcountry',
  'lowcountryliving',
  'southerntravel',
  'beachlife',
  'islandlife',
  'coastalliving',
  'travelplanning',
  'familyvacation',
  'vacationmode',
];

function nicheTagsFor(post: Post): string[] {
  const cat = post.category;
  const base: string[] = [];

  if (cat === 'Golf') {
    base.push(
      'hiltonheadgolf',
      'harbourtowngolflinks',
      'rbcheritage',
      'golftrip',
      'palmettodunesgolf',
    );
  } else if (cat === 'Stays') {
    base.push(
      'seapinesresort',
      'palmettodunes',
      'hiltonheadvillas',
      'harbourtowninn',
      'sheltercove',
    );
  } else if (cat === 'Dining') {
    base.push(
      'skullcreekboathouse',
      'hudsonsdocks',
      'elasonthewater',
      'lowcountrycuisine',
      'hiltonheaddining',
    );
  } else if (cat === 'Activities') {
    base.push(
      'hiltonheadbeach',
      'foresbeachhh',
      'pinckneyisland',
      'callawassieisland',
      'dolphintourshh',
    );
  } else if (cat === 'Neighborhoods') {
    base.push(
      'seapines',
      'palmettodunes',
      'sheltercove',
      'forestbeach',
      'hiltonheadrealestate',
    );
  } else {
    // Planning + anything else
    base.push(
      'hiltonheadplanning',
      'hiltonheaditinerary',
      'springbreakhh',
      'rbcheritage',
      'sheltercove',
    );
  }

  // Top up to 8 with universal niche tags.
  while (base.length < 8) {
    const filler = [
      'beachtown',
      'shoulderseason',
      'oceanfront',
      'palmtreesandsand',
      'beachreads',
    ];
    for (const f of filler) {
      if (!base.includes(f) && base.length < 8) base.push(f);
    }
  }
  return base.slice(0, 8);
}

function hashtagMix(post: Post): string[] {
  return [
    ...HIGH_VOL_TAGS.slice(0, 5),
    ...MID_VOL_TAGS.slice(0, 12),
    ...nicheTagsFor(post),
  ];
}

// ---------------------------------------------------------------------------
// CTA URL builder
// ---------------------------------------------------------------------------

function ctaUrlFor(post: Post, baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/blog/${post.slug}`;
}

// ---------------------------------------------------------------------------
// Platform derivations
// ---------------------------------------------------------------------------

// ——— Instagram carousel (3 variants) ———————————————————————————————————

function buildCarousel(
  post: Post,
  variant: 1 | 2 | 3,
  ctaUrl: string,
): SyndicatedAsset {
  const lists = listItems(post);
  const tiers = tierLines(post);
  const heads = headings(post);
  const paras = paragraphs(post);
  const specifics = detectSpecifics(post);

  // Pool of strong factual lines we'd be happy to put on a slide.
  const factual = [...tiers, ...lists, ...heads];

  // Variant differs by hook + slot mix to avoid identical content.
  const hookByVariant: Record<1 | 2 | 3, string> = {
    1: tame(post.title.replace(/\.$/, '')),
    2: heads[0]
      ? tame(heads[0])
      : `${specifics.neighborhoods[0]}: what locals book`,
    3: paras[0]
      ? tame(paras[0].split('. ')[0]).slice(0, 70)
      : `The Hilton Head ${post.category.toLowerCase()} list locals send`,
  };

  // Pick 6 mid-slides — different anchor offset per variant for variety.
  const offset = (variant - 1) * 2;
  const mid: string[] = [];
  for (let i = 0; i < factual.length && mid.length < 6; i++) {
    const idx = (i + offset) % factual.length;
    const line = factual[idx];
    if (!line) continue;
    // Compress to a slide-friendly length.
    const compact = line.length > 140 ? line.slice(0, 137).trimEnd() + '…' : line;
    if (!mid.includes(compact)) mid.push(compact);
  }
  while (mid.length < 6) {
    // Pad with neighborhood-aware filler so we always ship 8 slides.
    mid.push(
      `${specifics.neighborhoods[mid.length % specifics.neighborhoods.length]}: read the full guide for the on-island playbook.`,
    );
  }

  const slides: string[] = [
    `Slide 1 — HOOK\n${tame(hookByVariant[variant])}`,
    ...mid.slice(0, 6).map((line, i) => `Slide ${i + 2}\n${line}`),
    `Slide 8 — CTA\nFull guide at ${ctaUrl} (link in bio).`,
  ];

  const imageBriefs = [
    'Bold serif headline over a sun-dappled Sea Pines beach path, vertical 4:5, soft midday light.',
    "Top-down shot of a Skull Creek Boathouse plate (oysters, slaw, lemon) on raw wood, no faces.",
    'Aerial drone view of Harbour Town lighthouse with the marina basin at golden hour.',
    'Pristine villa entryway with bicycles propped beside the door, palm shadows on the porch.',
    'Two surfers crossing the boardwalk at Folly Field, low golden sun behind them, no logos.',
    "Tee box at Atlantic Dunes with morning dew, no players, framed by live oak Spanish moss.",
    "Hand-held shot of a paper itinerary on a porch table beside iced sweet tea and a key fob.",
    `Final CTA card: 'Full guide → ${brand.domain}/blog/${post.slug}'. Cream background, palm green accent.`,
  ];

  const tags = hashtagMix(post);
  const body = slides.join('\n\n');

  return {
    platform: 'instagram_carousel',
    variant,
    body,
    ctaUrl,
    meta: {
      slide_count: '8',
      hashtags: tags.map((t) => `#${t}`).join(' '),
      image_brief_1: imageBriefs[0],
      image_brief_2: imageBriefs[1],
      image_brief_3: imageBriefs[2],
      image_brief_4: imageBriefs[3],
      image_brief_5: imageBriefs[4],
      image_brief_6: imageBriefs[5],
      image_brief_7: imageBriefs[6],
      image_brief_8: imageBriefs[7],
      caption_hint:
        'Open with the hook from slide 1 as the post caption, then the CTA URL, then hashtags.',
      char_count: String(body.length),
    },
  };
}

// ——— Instagram reel (1 variant) ————————————————————————————————————————

function buildReel(post: Post, ctaUrl: string): SyndicatedAsset {
  const specifics = detectSpecifics(post);
  const heads = headings(post);
  const lists = listItems(post);
  const tiers = tierLines(post);
  const pool = [...heads, ...tiers, ...lists].slice(0, 6);

  const beat = (s: string, max: number) =>
    s.length > max ? s.slice(0, max - 1).trimEnd() + '…' : s;

  const beats: Array<{ time: string; vo: string; overlay: string }> = [
    {
      time: '0:00–0:02',
      vo: `Three things nobody tells you about ${post.category === 'Stays' ? 'where to stay' : 'Hilton Head'} in ${post.publishedAt.slice(0, 4)}.`,
      overlay: 'STOP scrolling.',
    },
    {
      time: '0:02–0:08',
      vo: pool[0]
        ? beat(pool[0], 110)
        : `${specifics.neighborhoods[0]} is closer to the bridge than ${specifics.neighborhoods[1]}.`,
      overlay: 'Locals know.',
    },
    {
      time: '0:08–0:14',
      vo: pool[1]
        ? beat(pool[1], 110)
        : `Skip ${specifics.restaurants[0]} on Saturdays. Go Tuesday instead.`,
      overlay: 'Tip 2.',
    },
    {
      time: '0:14–0:20',
      vo: pool[2]
        ? beat(pool[2], 110)
        : `Book ${specifics.neighborhoods[0]} villas six months out for July.`,
      overlay: 'Tip 3.',
    },
    {
      time: '0:20–0:26',
      vo: pool[3]
        ? beat(pool[3], 110)
        : `The shoulder-season tee times are half the price.`,
      overlay: 'Bonus.',
    },
    {
      time: '0:26–0:30',
      vo: `Full breakdown at ${brand.domain}/blog/${post.slug}. Link in bio.`,
      overlay: 'Full guide → link in bio.',
    },
  ];

  const script = beats
    .map(
      (b) =>
        `${b.time}\n  VO: ${b.vo}\n  ON-SCREEN: ${b.overlay}`,
    )
    .join('\n\n');

  const tags = hashtagMix(post);
  return {
    platform: 'instagram_reel',
    variant: 1,
    body: script,
    ctaUrl,
    meta: {
      length_sec: '30',
      hook_window: '0–2s',
      hashtags: tags.slice(0, 15).map((t) => `#${t}`).join(' '),
      caption:
        `${tame(post.excerpt)} Full guide → link in bio.`.slice(0, 220),
      audio_suggestion:
        'Soft acoustic / lo-fi guitar at 80–90 BPM. No lyrics over voiceover.',
      char_count: String(script.length),
    },
  };
}

// ——— LinkedIn post (1 variant) ———————————————————————————————————————

function buildLinkedIn(post: Post, ctaUrl: string): SyndicatedAsset {
  const specifics = detectSpecifics(post);
  const paras = paragraphs(post);
  const lists = listItems(post);
  const tiers = tierLines(post);

  // Specific observation hook — pull from the first paragraph or a fallback.
  const observation =
    paras[0] ??
    `${post.title}. Wrote it because the same three questions came up on every client call this month.`;

  const evidenceLines: string[] = [];
  for (const line of [...tiers, ...lists].slice(0, 8)) {
    if (line.length < 30 || line.length > 220) continue;
    evidenceLines.push(`- ${line}`);
    if (evidenceLines.length >= 4) break;
  }
  if (evidenceLines.length === 0) {
    evidenceLines.push(
      `- ${specifics.neighborhoods[0]} stays sell out for July by mid-March.`,
      `- The Harbour Town Inn refresh in 2025 finally matches its address.`,
      `- Tee sheets at ${specifics.golfCourses[0] ?? 'Harbour Town Golf Links'} open 90 days out.`,
    );
  }

  const body = tame(
    [
      observation.slice(0, 380),
      '',
      `What I've learned from running Hilton Ahead Travel Co:`,
      ...evidenceLines,
      '',
      `If you book one trip a year and want it to land, the difference is who picks up the phone when the villa key fob is wrong. That's what we do.`,
      '',
      `Full breakdown: ${ctaUrl}`,
    ].join('\n'),
  );

  return {
    platform: 'linkedin_post',
    variant: 1,
    body,
    ctaUrl,
    meta: {
      voice: 'first-person founder (Will)',
      target_chars: '1200-1400',
      char_count: String(body.length),
      audience: 'professionals planning Lowcountry trips, hospitality peers',
      cta_strategy: 'single soft URL at the end',
    },
  };
}

// ——— Pinterest (5 variants) ——————————————————————————————————————————

function buildPinterest(post: Post): SyndicatedAsset[] {
  const specifics = detectSpecifics(post);
  const heads = headings(post);

  const titlesPool = [
    `${tame(post.title).replace(/\.$/, '')}`,
    `${specifics.neighborhoods[0]} on Hilton Head — what locals actually book`,
    `${tame(post.excerpt.split('.')[0] ?? post.title).slice(0, 95)}`,
    heads[0] ? tame(heads[0]) : `${post.category} on Hilton Head — the local list`,
    `Hilton Head ${post.category} planning guide — ${post.publishedAt.slice(0, 4)}`,
  ];

  const board =
    post.category === 'Stays'
      ? 'Hilton Head Lodging'
      : post.category === 'Golf'
        ? 'Hilton Head Golf'
        : post.category === 'Dining'
          ? 'Hilton Head Dining'
          : post.category === 'Activities'
            ? 'Hilton Head Things to Do'
            : 'Hilton Head Planning';

  const descTail = `Save for trip planning. Full guide on hiltonahead.com.`;
  const descriptions: string[] = [
    `${tame(post.excerpt)} ${descTail}`.slice(0, 295),
    `Specific ${post.category.toLowerCase()} picks from a Hilton Head local. ${specifics.neighborhoods.slice(0, 3).join(', ')}, plus what to avoid. ${descTail}`.slice(0, 295),
    `Planning a Hilton Head trip? Here's the ${post.category.toLowerCase()} shortlist — ${specifics.neighborhoods[0]}, ${specifics.neighborhoods[1]}, and the corners tourists miss. ${descTail}`.slice(0, 295),
    `Hilton Head ${post.category.toLowerCase()} — direct picks, no fluff. ${specifics.restaurants[0]}, ${specifics.restaurants[1]}, and the timing tricks locals use. ${descTail}`.slice(0, 295),
    `The ${post.category.toLowerCase()} guide we send clients of Hilton Ahead Travel Co. Vetted, current, with the receipts. ${descTail}`.slice(0, 295),
  ];

  const briefs: string[] = [
    `Vertical 2:3 cover. Bold serif title in cream over a low-angle Atlantic shoreline at golden hour, soft sand foreground. Subtitle in palm green.`,
    `Vertical 2:3 cover. Aerial drone of ${specifics.neighborhoods[0]} villa rooftops with palms; title overlay in shell-pink rectangle, centered.`,
    `Vertical 2:3 magazine-style mood board: villa key fob, paper itinerary, iced tea, polaroid of Harbour Town lighthouse, on cream linen.`,
    `Vertical 2:3 collage of three numbered tiles (${specifics.restaurants.slice(0, 3).join(', ')}) with a unifying title bar across the top in glass-aqua.`,
    `Vertical 2:3 'local map' style with hand-drawn lookouts, callouts to ${specifics.neighborhoods.slice(0, 3).join(', ')}, soft gold accent lines.`,
  ];

  const ctaUrl = ctaUrlFor(post, brand.url);
  return titlesPool.slice(0, 5).map((title, i) => ({
    platform: 'pinterest_pin' as const,
    variant: i + 1,
    body: title,
    ctaUrl,
    meta: {
      title_chars: String(title.length),
      description: descriptions[i] ?? descriptions[0],
      image_brief: briefs[i] ?? briefs[0],
      board,
      alt_text: `${tame(post.title)} — Pinterest pin ${i + 1}`,
    },
  }));
}

// ——— Reddit (3 variants — value-first, with disclosure) ————————————————

const REDDIT_DISCLOSURE =
  'Disclosure: I run hiltonahead.com, a local Hilton Head travel consulting site. Happy to share specifics off-thread.';

function buildReddit(post: Post, ctaUrl: string): SyndicatedAsset[] {
  const specifics = detectSpecifics(post);
  const lists = listItems(post);
  const tiers = tierLines(post);
  const evidence = [...tiers, ...lists].slice(0, 6);

  const subForCategory = (() => {
    if (post.category === 'Golf') return 'r/golf';
    if (
      post.category === 'Activities' ||
      post.category === 'Stays' ||
      post.category === 'Planning'
    )
      return 'r/family-travel';
    return 'r/travel';
  })();

  const subreddits = ['r/HiltonHead', subForCategory, 'r/travel'];

  const baseBullets = (start: number) =>
    evidence
      .slice(start, start + 3)
      .map((line) => `- ${line}`)
      .join('\n') ||
    `- ${specifics.neighborhoods[0]} for proximity to the south-end restaurants.\n- ${specifics.neighborhoods[1]} for the lagoon system and family stuff.\n- Skip Forest Beach high-rises if you want quiet.`;

  const drafts: Array<{ sub: string; q: string; body: string }> = [
    {
      sub: subreddits[0],
      q: `Is it worth planning around the new RBC Heritage week, or should we go shoulder?`,
      body: [
        `Lived here for years and the honest answer is: it depends on what you want.`,
        ``,
        `If you came for the energy, Heritage week is electric and the south end is buzzing every night. If you came for quiet beach time, you'll be miserable.`,
        ``,
        baseBullets(0),
        ``,
        `Rough rule of thumb: book 6+ months out for Heritage week, 2-3 months for any other April-October trip.`,
        ``,
        REDDIT_DISCLOSURE,
      ].join('\n'),
    },
    {
      sub: subreddits[1],
      q: `First trip to Hilton Head with kids — any 'do this not that' tips?`,
      body: [
        `Two things I'd flag from years on island:`,
        ``,
        `1. Where you stay matters more than what you do. The island is 12 miles long and the wrong address adds 40 minutes to every dinner reservation.`,
        `2. ${specifics.restaurants[0]} and ${specifics.restaurants[1]} both take walk-ins before 5:30. Past that, OpenTable is your friend.`,
        ``,
        baseBullets(2),
        ``,
        REDDIT_DISCLOSURE,
      ].join('\n'),
    },
    {
      sub: subreddits[2],
      q: `Hilton Head vs Outer Banks vs 30A for 7 days?`,
      body: [
        `Locals would say: Hilton Head if you want golf + restaurants + a real downtown feel (Sea Pines + Harbour Town), 30A if you want car-dependent boutique beach towns, OBX if you want the most beach for the least money.`,
        ``,
        `${specifics.neighborhoods[0]} and ${specifics.neighborhoods[1]} are where I send most first-time visitors. The hidden gotcha is that Hilton Head villa rentals book very early for summer — start your search before you commit to a destination.`,
        ``,
        baseBullets(1),
        ``,
        REDDIT_DISCLOSURE,
      ].join('\n'),
    },
  ];

  return drafts.map((d, i) => ({
    platform: 'reddit_comment' as const,
    variant: i + 1,
    body: tame(d.body),
    ctaUrl,
    meta: {
      subreddit: d.sub,
      hypothetical_question: d.q,
      tone: 'value-first, no link unless asked',
      char_count: String(d.body.length),
    },
  }));
}

// ——— Newsletter teaser (1 variant) ————————————————————————————————————

function buildNewsletter(post: Post, ctaUrl: string): SyndicatedAsset {
  const paras = paragraphs(post);
  const tease = paras[0]
    ? paras[0].split('. ').slice(0, 2).join('. ').trim()
    : tame(post.excerpt);

  const teaser = tame(
    `${tease}.\n\nFull guide on the site — link below.`.replace(/\.\.+/g, '.'),
  );

  const subjectLines = [
    `${tame(post.title)}`.slice(0, 78),
    `Hilton Head: ${tame(post.excerpt.split('.')[0] ?? post.title)}`.slice(0, 78),
    `What we tell clients about ${post.category.toLowerCase()} on Hilton Head`.slice(0, 78),
  ];

  const preview = tame(
    post.excerpt.length > 88 ? post.excerpt.slice(0, 85) + '…' : post.excerpt,
  ).slice(0, 90);

  return {
    platform: 'newsletter_teaser',
    variant: 1,
    body: teaser,
    ctaUrl,
    meta: {
      subject_1: subjectLines[0],
      subject_2: subjectLines[1],
      subject_3: subjectLines[2],
      preview_text: preview,
      word_count: String(teaser.split(/\s+/).filter(Boolean).length),
      link_url: ctaUrl,
    },
  };
}

// ——— Twitter / X thread (1 thread of 5–8 tweets) ———————————————————————

function buildTwitterThread(post: Post, ctaUrl: string): SyndicatedAsset {
  const specifics = detectSpecifics(post);
  const lists = listItems(post);
  const tiers = tierLines(post);
  const heads = headings(post);
  const pool = [...tiers, ...lists, ...heads].filter((s) => s.length > 0);

  const compact = (s: string, max = 265) =>
    s.length > max ? s.slice(0, max - 1).trimEnd() + '…' : s;

  const hook = compact(
    `${tame(post.title)} — a 🧵 from a Hilton Head local. (1/${Math.min(8, Math.max(5, pool.length + 2))})`,
    275,
  );

  const middle: string[] = [];
  for (let i = 0; i < pool.length && middle.length < 5; i++) {
    const line = compact(pool[i], 260);
    if (line.length < 30) continue;
    middle.push(`(${middle.length + 2}/) ${line}`);
  }
  while (middle.length < 4) {
    const filler = [
      `(${middle.length + 2}/) ${specifics.neighborhoods[middle.length % specifics.neighborhoods.length]} is where I send first-time visitors. Closer to dinner reservations, fewer turns.`,
      `(${middle.length + 2}/) Tee times at ${specifics.golfCourses[0] ?? 'Harbour Town Golf Links'} open about 90 days out. Set a calendar reminder.`,
      `(${middle.length + 2}/) ${specifics.restaurants[0]} takes walk-ins before 5:30. After that, reservations only.`,
      `(${middle.length + 2}/) July villa availability tightens by March. April is the realistic "still book it" cutoff.`,
    ];
    middle.push(filler[middle.length % filler.length]);
  }

  const last = compact(
    `(${middle.length + 2}/${middle.length + 2}) Full breakdown with the receipts → ${ctaUrl}`,
    280,
  );

  const tweets = [hook, ...middle.slice(0, 5), last];

  return {
    platform: 'twitter_thread',
    variant: 1,
    body: tweets.join('\n\n---\n\n'),
    ctaUrl,
    meta: {
      tweet_count: String(tweets.length),
      hook_tweet: hook,
      cta_tweet: last,
      hashtags: '#HiltonHead #LowCountry',
      char_counts: tweets.map((t) => String(t.length)).join(','),
    },
  };
}

// ——— Facebook post (1 variant, value-first for groups) ———————————————

function buildFacebook(post: Post, ctaUrl: string): SyndicatedAsset {
  const specifics = detectSpecifics(post);
  const paras = paragraphs(post);
  const tiers = tierLines(post);
  const lists = listItems(post);

  const opener =
    paras[0]?.split('. ').slice(0, 2).join('. ').trim() ??
    `Friend asked me last week where on Hilton Head she should put her in-laws and her three kids in the same week.`;

  const evidence = [...tiers, ...lists].slice(0, 4);
  const evidenceText = evidence
    .map((line) => `- ${line}`)
    .join('\n')
    .trim();

  const body = tame(
    [
      opener,
      '',
      `Here's the short version I gave her:`,
      '',
      evidenceText ||
        `- ${specifics.neighborhoods[0]} for the in-laws (quieter, closer to good dinner).\n- ${specifics.neighborhoods[1]} for the kids (lagoon system, bike paths).\n- Either way, book before March if you want July.`,
      '',
      `What I keep telling people: the difference between a great Hilton Head trip and a stressful one is almost entirely the address you book and who answers when the villa key fob is wrong. The rest sorts itself out.`,
      '',
      `Happy to share specifics if you're planning — comment "info" and I'll DM the version I send our clients.`,
    ].join('\n'),
  );

  return {
    platform: 'facebook_post',
    variant: 1,
    body,
    ctaUrl,
    meta: {
      target_word_count: '200-400',
      word_count: String(body.split(/\s+/).filter(Boolean).length),
      tone: 'story-led, value-first, group-friendly',
      cta_style: "soft — 'comment info', no link push in body",
      backup_link: ctaUrl,
    },
  };
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export function syndicatePost(post: Post, opts: SyndicateOptions = {}): ContentPack {
  const baseUrl = (opts.baseUrl ?? brand.url).replace(/\/+$/, '');
  const generatedAt = opts.now ?? new Date().toISOString();
  const ctaUrl = ctaUrlFor(post, baseUrl);

  const assets: SyndicatedAsset[] = [
    buildCarousel(post, 1, ctaUrl),
    buildCarousel(post, 2, ctaUrl),
    buildCarousel(post, 3, ctaUrl),
    buildReel(post, ctaUrl),
    buildLinkedIn(post, ctaUrl),
    ...buildPinterest(post),
    ...buildReddit(post, ctaUrl),
    buildNewsletter(post, ctaUrl),
    buildTwitterThread(post, ctaUrl),
    buildFacebook(post, ctaUrl),
  ];

  return {
    sourceSlug: post.slug,
    sourceTitle: post.title,
    generatedAt,
    assets,
  };
}

// ---------------------------------------------------------------------------
// Placeholder post seeds — used by the CLI when the real posts.ts hasn't
// landed yet. Same `Post` shape, just minimal bodies. Real content from
// the parallel blog-posts agent supersedes these the moment posts.ts ships.
// ---------------------------------------------------------------------------

export interface PlaceholderSeed {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  category: Post['category'];
  keywords: string[];
  /** Optional inline bullets so derived copy doesn't read empty. */
  bullets?: string[];
  /** Optional headings to scaffold structure. */
  headings?: string[];
}

export function postFromPlaceholder(seed: PlaceholderSeed): Post {
  const body: PostBlock[] = [
    { kind: 'p', html: seed.excerpt },
    ...(seed.headings ?? []).flatMap((h): PostBlock[] => [
      { kind: 'h2', text: h },
      {
        kind: 'p',
        html: `Section placeholder for "${h}" — replace once the canonical post lands in data/posts.ts.`,
      },
    ]),
    ...(seed.bullets && seed.bullets.length > 0
      ? [{ kind: 'ul' as const, items: seed.bullets }]
      : []),
  ];

  return {
    slug: seed.slug,
    title: seed.title,
    excerpt: seed.excerpt,
    description: seed.description,
    category: seed.category,
    readTime: '8 min',
    publishedAt: '2026-05-20',
    author: 'Hilton Ahead',
    featuredOrder: 100,
    keywords: seed.keywords,
    body,
  };
}

/**
 * Default seeds for incoming commercial-intent posts that haven't landed in
 * data/posts.ts yet. The original 6 commercial-intent posts have now been
 * written and live in posts.ts, so this array is currently empty. Add entries
 * here when a new post is being briefed but the canonical Post record hasn't
 * shipped yet — scripts/syndicate-all.ts will generate a pack from the seed
 * until the real post supersedes it.
 */
export const PLACEHOLDER_SEEDS: PlaceholderSeed[] = [
  /* superseded by data/posts.ts records — see git history for original 6 seeds */
  /* (no-op) PLACEHOLDER_LEGACY_REMOVED_2026_05_21:
  {
    slug: 'cost-of-hilton-head-trip-2026',
    title: 'What a Hilton Head Trip Actually Costs in 2026',
    excerpt:
      'Real 2026 budgets from a local — villas, golf, dinner, and the line items nobody warns you about.',
    description:
      'A no-fluff cost breakdown of a Hilton Head trip in 2026: villa, golf, dinner, transport, and hidden line items.',
    category: 'Planning',
    keywords: ['cost of hilton head 2026', 'hilton head budget', 'how much hilton head trip'],
    headings: [
      'The honest budget for a week on Hilton Head',
      'Where the surprise costs live',
      'How to keep the trip in budget without ruining it',
    ],
    bullets: [
      'A 3-bedroom Sea Pines villa for July runs $4,800-$7,200 per week in 2026.',
      'A round at Harbour Town Golf Links is $475-$575 with cart, peak season.',
      'Dinner for four at Skull Creek Boathouse averages $180-$240.',
      "Resort fees in Palmetto Dunes add $24-$36/night you won't see until checkout.",
      'Hilton Head Airport rental cars run 30-40% above SAV in summer; book SAV.',
      'Off-island Bluffton dinners save $60-$100 vs. comparable Forest Beach rooms.',
    ],
  },
  {
    slug: 'july-hilton-head-villa-availability',
    title: 'July Villa Availability on Hilton Head — The 2026 Truth',
    excerpt:
      "What's actually still bookable for July 2026, by neighborhood, and the realistic cutoffs locals use.",
    description:
      'Up-to-the-minute view of July villa availability on Hilton Head for 2026, by neighborhood, with realistic booking cutoffs.',
    category: 'Stays',
    keywords: ['july hilton head villa', 'last minute hilton head july', 'hilton head villa availability'],
    headings: [
      'What still has July dates as of May 2026',
      'The buildings that release dates in May',
      'When to stop trying for July and pivot to August',
    ],
    bullets: [
      'Oceanfront 4BRs in Sea Pines South Beach are essentially gone for July weeks.',
      'Palmetto Dunes lagoon villas still have mid-week pockets through mid-July.',
      'Shelter Cove has the best inventory but the longest walk to ocean access.',
      'Forest Beach high-rises hold late releases — check April 15 and May 15 each year.',
      'A handful of off-island Bluffton villas (Palmetto Bluff) open up after deposits expire.',
    ],
  },
  {
    slug: 'sea-pines-vs-palmetto-dunes-vs-shelter-cove',
    title: 'Sea Pines vs. Palmetto Dunes vs. Shelter Cove — Which Hilton Head Neighborhood Fits',
    excerpt:
      "A local's side-by-side: who each neighborhood actually fits, and the tradeoffs nobody mentions in the listings.",
    description:
      'Side-by-side comparison of Sea Pines, Palmetto Dunes, and Shelter Cove on Hilton Head — fit, layout, dining, and the real tradeoffs.',
    category: 'Neighborhoods',
    keywords: [
      'sea pines vs palmetto dunes',
      'shelter cove hilton head',
      'best hilton head neighborhood',
    ],
    headings: [
      'Quick verdict: who each neighborhood fits',
      'Walkability and proximity to dinner',
      'Pool, lagoon, and beach access compared',
    ],
    bullets: [
      'Sea Pines: best for couples, golfers, and anyone wanting Harbour Town walkability.',
      'Palmetto Dunes: best for families with kids 6-14 who want bike paths and lagoons.',
      "Shelter Cove: best for travelers who want walkable restaurants and don't need beachfront.",
      "Sea Pines gates cost an extra $9/day visitor fee — your villa rental usually covers it.",
      'Palmetto Dunes has the only on-island lagoon system you can paddle.',
    ],
  },
  {
    slug: 'hilton-head-golf-package-tiers',
    title: 'Hilton Head Golf Packages by Tier — What You Actually Get in 2026',
    excerpt:
      'The four tiers of Hilton Head golf trips, what they cost, and which ones over-deliver.',
    description:
      'A tiered breakdown of Hilton Head golf packages for 2026: courses, lodging, transport, and what each price tier actually delivers.',
    category: 'Golf',
    keywords: ['hilton head golf package', 'harbour town golf trip', 'hilton head golf tiers'],
    headings: [
      'Tier 1 — the bucket-list package (Harbour Town + Atlantic Dunes)',
      'Tier 2 — the smart-money package',
      'Tier 3 — the value package',
      'What changed in 2026 pricing',
    ],
    bullets: [
      'Harbour Town Golf Links peak round: $475 with cart, $575 with caddie.',
      'Atlantic Dunes (Sea Pines) is the smart-money pick at $225-$285 in shoulder season.',
      'Heron Point by Pete Dye runs $295-$345 and rarely sells out the morning tee sheet.',
      'May River Golf Club (Bluffton, off-island) is worth the 20-minute drive for the conditions.',
      'Stay-and-play multi-night packages knock 15-25% off rack rates if booked through the resort directly.',
    ],
  },
  {
    slug: 'hilton-head-spring-break-heritage-week',
    title: 'Spring Break on Hilton Head, Plus the Heritage Week Overlay',
    excerpt:
      'How to do Hilton Head spring break with kids and still see Heritage week without losing your mind.',
    description:
      'A local guide to Hilton Head spring break with the RBC Heritage week overlay — neighborhoods, restaurants, transport, and how to avoid the crowds.',
    category: 'Planning',
    keywords: ['hilton head spring break', 'rbc heritage week travel', 'heritage hilton head april'],
    headings: [
      "What Heritage week actually feels like on island",
      'Where to stay to avoid traffic chaos',
      'Family-friendly Heritage day plan',
    ],
    bullets: [
      'Heritage week falls April 13-19, 2026; spring break families overlap heavily April 5-12.',
      'Palmetto Dunes and Shelter Cove avoid the worst Heritage-week traffic; Sea Pines does not.',
      'Tee times at Harbour Town Golf Links during Heritage week are pro-only — go to Atlantic Dunes.',
      'Skull Creek Boathouse books out at lunch; ELA\'s holds same-day bar seating until 6pm.',
      "Family Tuesday at Heritage is the only day with reasonable spectator crowds.",
    ],
  },
  {
    slug: 'hilton-head-weather-month-by-month',
    title: 'Hilton Head Weather, Month by Month — The Local Reality',
    excerpt:
      'A month-by-month weather and crowd breakdown of Hilton Head, with the windows locals actually like.',
    description:
      'Month-by-month Hilton Head weather, ocean temperatures, crowd levels, and the windows locals actually like to visit.',
    category: 'Planning',
    keywords: ['hilton head weather', 'best time to visit hilton head', 'hilton head temperature by month'],
    headings: [
      'The four real seasons on Hilton Head',
      'Ocean temperature reality vs. the brochure',
      "Locals' favorite window, ranked",
    ],
    bullets: [
      'Ocean temperatures hit 78F by mid-June and stay above 75F through mid-October.',
      'April highs run 70-78F with low humidity — the locals\' favorite golf window.',
      'July-August humidity is real; afternoon thunderstorms break 70% of days.',
      'September is the quiet sleeper month: warm water, light crowds, hurricane vigilance.',
      'November-February sees lows in the 40s; villa rates drop 35-50% off summer.',
    ],
  },
  */
];
