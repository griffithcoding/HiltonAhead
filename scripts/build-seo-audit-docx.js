// Build the SEO Audit Word document.
// Run: node scripts/build-seo-audit-docx.js
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, BorderStyle, WidthType, ShadingType, AlignmentType,
  LevelFormat,
} = require('docx');

// ------- constants -------
const PAGE_W = 12240; // US Letter
const PAGE_H = 15840;
const MARGIN = 1440;  // 1 inch
const CONTENT_W = PAGE_W - MARGIN * 2; // 9360

const thin = { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' };
const cellBorders = { top: thin, bottom: thin, left: thin, right: thin };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

// ------- helpers -------
const p = (text, opts = {}) =>
  new Paragraph({
    children: Array.isArray(text)
      ? text
      : [new TextRun({ text, ...opts })],
    spacing: { after: 120 },
  });

const h1 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true })],
  });

const h2 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true })],
  });

const h3 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, bold: true })],
  });

const bullet = (text) =>
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [new TextRun(text)],
  });

const numbered = (text) =>
  new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    children: [new TextRun(text)],
  });

// Build a table where:
//   headers = string[]
//   rows    = string[][]
//   weights = number[]  relative column widths, summed = CONTENT_W
function buildTable(headers, rows, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  const columnWidths = weights.map((w) => Math.round((w / total) * CONTENT_W));
  // adjust last so it sums exactly to CONTENT_W
  const sumSoFar = columnWidths.reduce((a, b) => a + b, 0);
  columnWidths[columnWidths.length - 1] += CONTENT_W - sumSoFar;

  const makeCell = (text, width, isHeader) =>
    new TableCell({
      borders: cellBorders,
      width: { size: width, type: WidthType.DXA },
      shading: isHeader
        ? { fill: 'E8E4D8', type: ShadingType.CLEAR, color: 'auto' }
        : undefined,
      margins: cellMargins,
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: String(text ?? ''),
              bold: !!isHeader,
              size: 20,
            }),
          ],
        }),
      ],
    });

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => makeCell(h, columnWidths[i], true)),
  });

  const bodyRows = rows.map(
    (r) =>
      new TableRow({
        children: r.map((cell, i) => makeCell(cell, columnWidths[i], false)),
      })
  );

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths,
    rows: [headerRow, ...bodyRows],
  });
}

const gap = () => new Paragraph({ children: [new TextRun('')], spacing: { after: 200 } });

// ------- content -------
const children = [];

// Title + date
children.push(
  new Paragraph({
    heading: HeadingLevel.TITLE,
    children: [
      new TextRun({
        text: 'Hilton Ahead SEO Audit — Site-Wide vs. Page-1 SERPs',
        bold: true,
        size: 40,
      }),
    ],
    spacing: { after: 200 },
  })
);
children.push(
  new Paragraph({
    children: [new TextRun({ text: 'April 24, 2026', italics: true, color: '666666' })],
    spacing: { after: 400 },
  })
);

// SECTION 1
children.push(h1('1. Executive Summary'));
children.push(
  p(
    "Technical foundation is strong (schema stack, sitemap, clean URLs, good internal linking). The editorial voice is a genuine differentiator no competitor has. The problem is authority and coverage gaps: hiltonheadisland.org (the CVB) owns 3-5 page-1 slots across nearly every informational query; rental-management companies lock commercial lodging queries; resort sites own their own-brand queries. You can't outrank Sea Pines for \u201CSea Pines rentals\u201D or Vacasa for generic rental queries. But you can absolutely win the editorial-intent middle where competitors publish thin aggregator pages: \u201Cbest time to visit,\u201D \u201CX vs Y,\u201D \u201Cranked,\u201D \u201Cwith kids,\u201D \u201C3-day itinerary,\u201D \u201Cbeaches guide,\u201D \u201Choneymoon,\u201D and month-specific planning queries. That middle is where your biggest customer bases search."
  )
);
children.push(h3('Top 3 priorities'));
children.push(
  numbered(
    'Build the missing high-volume landing pages — no /hilton-head-beaches, no couples/honeymoon page, no itinerary content. These are the biggest single content gaps on the site.'
  )
);
children.push(
  numbered(
    'Add comparison + long-tail planning content — "Hilton Head vs Myrtle Beach," "Sea Pines vs Palmetto Dunes," "Hilton Head in October" etc. Low competition, high intent, meets users mid-decision.'
  )
);
children.push(
  numbered(
    'Convert the editorial blog posts into SERP winners with the same treatment we gave the weather post: tables, FAQ schema, direct-answer H2s, and deep internal linking.'
  )
);
children.push(gap());

// SECTION 2
children.push(h1('2. Your biggest customer bases, by revenue \u00d7 volume'));
children.push(
  buildTable(
    ['#', 'Segment', 'Intent signal', 'Avg trip spend', 'Our coverage', 'SERP winnability'],
    [
      ['1', 'Families (school calendar)', '"Hilton Head with kids", "family vacation", "spring break"', '$4\u20138k/week', 'Good \u2014 trip-type + blog post', 'High. Beat Points Guy / CVB with deep itinerary + activity tiering'],
      ['2', 'Golfers', '"Hilton Head golf packages", "Harbour Town golf", "stay and play"', '$3\u20136k/head', 'Good \u2014 trip-type + blog post', 'Medium. Resorts own their brand; we win planning/logistics queries'],
      ['3', 'Lodging seekers (generic)', '"Hilton Head vacation rentals", "villas"', '$3\u201312k/week', 'Partial \u2014 /oceanfront-villas', 'Low on generic, high on qualified: "best villa buildings," "oceanfront with pool"'],
      ['4', 'Couples / honeymoon', '"romantic getaway", "Hilton Head honeymoon", "anniversary"', '$2\u20135k/weekend', 'Gap \u2014 no dedicated page', 'High. Under-served segment, no CVB landing page dominating'],
      ['5', 'Wedding parties', '"Hilton Head wedding venues"', '$30\u201380k/event', 'Good \u2014 /hilton-head-weddings', 'Medium. Resorts own venue queries; we win logistics angle'],
      ['6', 'Weekenders / 3-day', '"Hilton Head 3-day itinerary", "48 hours Hilton Head"', '$1\u20133k/trip', 'Gap \u2014 no editorial itinerary', 'High. CVB owns "48 hours"; we can own ranked alternative'],
      ['7', 'Thanksgiving / holiday', '"Hilton Head Thanksgiving"', '$2\u20135k/trip', 'Excellent \u2014 /hilton-head-thanksgiving', 'High. Niche, we already compete'],
      ['8', 'RBC Heritage attendees', '"RBC Heritage tickets", "Heritage lodging"', '$6\u201315k/trip', 'Good \u2014 blog post', 'Medium. Ticket sites own tickets; we win planning'],
      ['9', 'Snowbirds / long-stay', '"Hilton Head winter rental", "monthly rental"', '$3\u20138k/month', 'Gap', 'High. Almost no editorial content exists'],
    ],
    [4, 18, 22, 12, 18, 26]
  )
);
children.push(gap());

// SECTION 3
children.push(h1('3. Keyword Opportunity Table'));
children.push(
  buildTable(
    ['Keyword', 'Difficulty', 'Opportunity', 'Our ranking', 'Intent', 'Recommended action'],
    [
      ['Hilton Head weather by month', 'Hard', 'High', 'Just improved (was p10)', 'Informational', 'Push the post we just rewrote; build inbound links'],
      ['Best time to visit Hilton Head', 'Hard', 'High', 'On that same post', 'Planning', 'Same post'],
      ['Hilton Head beaches', 'Medium', 'High', 'Gap', 'Informational + commercial', 'Build /hilton-head-beaches landing + guide post'],
      ['Hilton Head with kids / family vacation', 'Medium', 'High', 'Covered', 'Planning', 'Deepen: best beaches for toddlers, kid-friendly restaurants, rainy-day list'],
      ['Hilton Head 3-day itinerary', 'Medium', 'High', 'Gap', 'Planning', 'New blog post, editorial tier'],
      ['Hilton Head 7-day itinerary', 'Medium', 'High', 'Gap', 'Planning', 'Companion long-form post'],
      ['Hilton Head honeymoon / couples getaway', 'Medium', 'High', 'Gap', 'Commercial', 'New trip-type page'],
      ['Sea Pines vs Palmetto Dunes', 'Low', 'High', 'Gap', 'Commercial', 'Comparison post, huge intent signal'],
      ['Hilton Head vs Myrtle Beach', 'Medium', 'High', 'Gap', 'Informational (funnel top)', 'Comparison post'],
      ['Hilton Head vs Charleston', 'Low', 'Medium', 'Gap', 'Informational', 'Comparison post'],
      ['Hilton Head bike rentals / bike paths', 'Medium', 'Medium', 'Gap', 'Commercial (activity)', 'Activity guide post'],
      ['Hilton Head dolphin tours', 'Medium', 'Medium', 'Gap', 'Commercial (activity)', 'Activity guide post'],
      ['Hilton Head water temperature', 'Medium', 'Medium', 'Just added section', 'Informational', 'Featured snippet candidate \u2014 already strong'],
      ['Hilton Head hurricane season', 'Low', 'Medium', 'Just added section', 'Informational', 'Same'],
      ['Harbour Town villas', 'Low', 'High', 'Covered', 'Commercial', 'Deepen with photography + booking partner CTA'],
      ['Best villa buildings Hilton Head', 'Low', 'High', 'Partial in Stays post', 'Commercial', 'Extract into dedicated post'],
      ['Hilton Head winter / off-season / cheap', 'Low', 'Medium', 'Covered in weather post', 'Commercial', 'Extract into dedicated post for snowbird segment'],
      ['Hilton Head oceanfront rentals with pool', 'Low', 'High', 'Partial', 'Commercial', 'Long-tail page or tier block'],
      ['Hilton Head restaurants open Sunday / breakfast / sunset', 'Low', 'Medium', 'Gap', 'Commercial (mid-trip)', 'Sub-topic posts from restaurants tier list'],
      ['Harbour Town Lighthouse', 'Medium', 'Low', 'Mentioned only', 'Informational', 'Micro-post with schema'],
      ['Hilton Head without a car / walkable', 'Low', 'Medium', 'Gap', 'Planning', 'Blog post'],
      ['RBC Heritage hospitality / parking', 'Low', 'Medium', 'Covered in Heritage post', 'Planning (seasonal)', 'Expand for 2027 refresh'],
      ['Hilton Head dining with kids', 'Low', 'Medium', 'Mentioned only', 'Commercial', 'Dedicated sub-post'],
      ['Hilton Head weather [month] \u00d7 12', 'Low', 'Medium', 'Partial (in weather post)', 'Informational', 'Split into 12 short month pages OR anchor links'],
      ['Bluffton restaurants / FARM Bluffton', 'Low', 'Medium', 'Mentioned only', 'Commercial', 'Dedicated Bluffton dining post'],
    ],
    [22, 9, 9, 14, 14, 32]
  )
);
children.push(gap());

// SECTION 4
children.push(h1('4. On-Page Issues'));
children.push(
  buildTable(
    ['Page', 'Issue', 'Severity', 'Fix'],
    [
      ['All pages', 'No og:image in generatePageMetadata() \u2014 social shares have no thumbnail', 'High', 'Add openGraph.images to the helper; use category photos'],
      ['Utility pages (/contact, /partners)', '2\u20134 keywords only; thin for any ranking signal', 'Medium', 'Expand to 6-8 relevant keywords each'],
      ['/contact', 'No FAQ, no schema beyond breadcrumb/LocalBusiness', 'Medium', 'Add FAQ section + FAQPage schema'],
      ['Blog post descriptions', 'Not every post description is distinct from excerpt \u2014 verify no duplicates', 'Low', 'Audit all 11 description fields for uniqueness + 140-158 chars'],
      ['Blog posts', "sea-pines-guide, palmetto-dunes-guide etc. don't set relatedNeighborhoods so the inbound link block doesn't render", 'High', "Set relatedNeighborhoods: ['sea-pines'] etc. on the four neighborhood-guide posts"],
      ['/services', 'Service anchors in sitemap (#) are fragments \u2014 not separate URLs, not indexable', 'Medium', 'Split top 3 services into standalone pages OR accept current structure'],
      ['Homepage', 'H1 inferred from Hero \u2014 if not a literal h1, semantic signal weaker', 'High', 'Verify Hero uses h1 tag'],
      ['All pages', 'No link rel="alternate" hreflang \u2014 fine since English-only, but absent breadcrumb-style language signal', 'Low', 'Leave'],
      ['Images', 'All Next.js Image but no audit of alt text quality on neighborhood/trip-type galleries', 'Medium', 'Pass over data/neighborhoods.ts + data/tripTypes.ts gallery alt fields'],
    ],
    [18, 42, 10, 30]
  )
);
children.push(gap());

// SECTION 5
children.push(h1('5. Content Gap Recommendations'));
children.push(p('Ranked by revenue impact \u00d7 effort.'));
children.push(
  buildTable(
    ['Priority', 'Gap', 'Format', 'Target query', 'Effort', 'Why'],
    [
      ['P0', 'No /hilton-head-beaches landing', 'New trip-type landing + companion blog post', '"Hilton Head beaches", "best Hilton Head beach"', 'Moderate', 'Largest single missing page. Beaches are tied to every lodging decision'],
      ['P0', 'No couples/honeymoon page', 'New trip-type landing (/hilton-head-honeymoon)', '"Hilton Head honeymoon", "romantic getaway"', 'Moderate', "High-dollar segment, under-served SERP, resorts don't dominate"],
      ['P0', 'No editorial itinerary content', 'Two blog posts: "3 Days in Hilton Head" + "7 Days in Hilton Head"', '"Hilton Head 3 day itinerary", "48 hours"', 'Substantial', "Competes directly with CVB's \u201C48 Hours\u201D post (page 1)"],
      ['P1', 'No comparison content', '2\u20133 posts: HH vs Myrtle Beach, Sea Pines vs Palmetto Dunes, HH vs Charleston', '"Hilton Head vs Myrtle Beach" + siblings', 'Substantial', 'Comparison queries have near-zero editorial competition'],
      ['P1', 'No dedicated "best villa buildings" post', 'Pull tier detail from Stays post into standalone', '"best villas Hilton Head", "oceanfront villas Sea Pines"', 'Quick win', 'Repurposes content you already wrote'],
      ['P1', 'No activity-specific content (bikes, dolphins, kayak)', '3-4 micro blog posts, each with local-operator tier list', '"Hilton Head bike rentals", "dolphin tours Hilton Head"', 'Moderate', 'High-volume activity queries, low competition, drives affiliate/partner rev'],
      ['P2', 'Neighborhood blog posts missing relatedNeighborhoods', 'Data fix + the template auto-renders the block', '\u2014', 'Quick win (10 min)', 'Restores the reciprocal link, boosts topic clustering'],
      ['P2', 'No winter/snowbird landing', 'New seasonal trip-type page (/hilton-head-winter-rental)', '"Hilton Head winter rental", "monthly rental"', 'Moderate', 'Niche, nearly no competition, long-stay = high-margin'],
      ['P2', 'No Bluffton dining / Palmetto Bluff post', 'Blog post', '"FARM Bluffton", "Palmetto Bluff May River Grill"', 'Quick win', 'Completes the Bluffton cluster around your trip-type page'],
      ['P3', 'No events calendar', '/events page with the 2026 island calendar', '"Hilton Head events 2026", "wine and food festival"', 'Moderate', 'Fresh content, ongoing SEO value'],
      ['P3', 'Month-level weather anchor pages', '12 thin anchor routes or anchor IDs', '"Hilton Head weather October" (and 11 siblings)', 'Moderate', 'Each month query has meaningful volume'],
    ],
    [7, 26, 26, 18, 10, 23]
  )
);
children.push(gap());

// SECTION 6
children.push(h1('6. Technical SEO Checklist'));
children.push(
  buildTable(
    ['Check', 'Status', 'Detail'],
    [
      ['HTTPS', 'Pass', '\u2014'],
      ['Sitemap present + complete', 'Pass', '37 URLs, priorities sensible'],
      ['Robots.txt', 'Pass', 'Blocks /api/, /_next/, GPTBot \u2014 all correct'],
      ['Canonical tags', 'Pass', 'Generated via alternates.canonical in helper'],
      ['Structured data (schema)', 'Pass', 'Excellent \u2014 TravelAgency, LocalBusiness, Place, BlogPosting, Review, LodgingBusiness, Event, FAQPage, ItemList, BreadcrumbList'],
      ['Mobile responsive', 'Pass', 'Tailwind responsive classes throughout'],
      ['Core Web Vitals', 'Pass', 'Hero images use priority, sizes set properly'],
      ['og:image on pages', 'Fail', "generatePageMetadata() doesn't set openGraph.images"],
      ['H1 uniqueness', 'Warning', 'Verify Hero component emits a single h1 on homepage'],
      ['Internal link depth', 'Pass', 'Neighborhoods \u2194 blog, trip-types \u2192 blog, all from home'],
      ['URL structure', 'Pass', 'Clean, keyword-rich, flat hierarchy'],
      ['Mixed content', 'Pass', '\u2014'],
      ['XML sitemap in GSC', 'Unknown', 'Confirm Google Search Console is verified'],
      ['FAQPage schema coverage', 'Partial', 'Homepage + (now) blog posts with FAQ blocks. /services, /itinerary could add'],
    ],
    [26, 14, 60]
  )
);
children.push(gap());

// SECTION 7
children.push(h1('7. Competitor Comparison'));
children.push(
  buildTable(
    ['Dimension', 'hiltonahead.com', 'hiltonheadisland.org (CVB)', 'seapines.com', 'tripadvisor.com', 'Beach-property.com'],
    [
      ['Keyword count (est)', '~200 targeted', '10k+ (institutional)', '2k+ (brand)', 'Massive (UGC)', '1k+ (rental + blog)'],
      ['Content depth', 'Strong editorial, 11 posts + 8 trip pages', 'Shallow-but-wide, 500+ pages', 'Brand/transactional', 'UGC reviews', 'Moderate blog + listings'],
      ['Schema coverage', 'Excellent', 'Good', 'Good', 'Excellent', 'Moderate'],
      ['Publishing frequency', 'Low (~1-2/mo)', 'Weekly', 'Low', 'Continuous', 'Weekly'],
      ['Backlink profile', 'New/weak', 'Huge (CVB authority)', 'Strong (resort)', 'Domain-wide', 'Moderate'],
      ['SERP feature presence', 'Low', 'Featured snippets + knowledge panels', 'Knowledge panel', 'Local pack, reviews', 'Low'],
      ['Editorial voice / trust', 'Distinctive, human', 'Generic institutional', 'Marketing tone', 'Crowd review', 'Marketing tone'],
      ['Can we beat them on', '\u2014', 'Editorial/ranked content, long-tail', 'Nothing brand-specific', 'Curated tier lists with opinion', 'Ranked comparison, honesty'],
    ],
    [20, 16, 18, 14, 16, 16]
  )
);
children.push(gap());
children.push(
  p(
    "Reading the field: you are never going to outrank the CVB or resort sites on their strongest pages \u2014 they have decades of authority. What you can do, and what no competitor does well, is ranked editorial content with an actual point of view. TripAdvisor's tier lists are UGC averages; the CVB is afraid to say anything bad about any business. Your \u201Cskip this property\u201D section is genuinely rare in this vertical. Lean into that.",
    { italics: true }
  )
);
children.push(gap());

// SECTION 8
children.push(h1('8. Prioritized Action Plan'));
children.push(h2('Quick Wins (this week, under 2 hours each)'));
[
  'Add og:image to generatePageMetadata() \u2014 every post/page gets a social share image. Use category photos for blog posts, hero for landing pages. Biggest single technical lift. Impact: high, Effort: 30 min.',
  'Set relatedNeighborhoods on the 4 neighborhood guide blog posts \u2014 restores the reciprocal link block. Impact: medium, Effort: 5 min.',
  'Audit 11 blog description fields for duplicates + 140-158 char length \u2014 tighten CTRs. Impact: medium, Effort: 45 min.',
  'Verify Hero component emits a real h1 on homepage. Impact: medium, Effort: 10 min.',
  'Add FAQ schema + 6-8 Q&A to /itinerary and /services \u2014 use the getFaqSchema helper you already have. Impact: medium, Effort: 60 min each.',
  'Expand /contact and /partners keywords to 6-8 each. Impact: low, Effort: 15 min.',
  'Submit the updated weather post to Google Search Console for recrawl. Impact: medium, Effort: 5 min.',
].forEach((t) => children.push(numbered(t)));

children.push(h2('Strategic Investments (this quarter)'));
[
  'Build /hilton-head-beaches landing page + companion blog post \u2014 mirror the trip-type template, add TouristAttraction Place schema per beach. Target: \u201CHilton Head beaches\u201D (p1 in 60-90 days). Impact: high, Effort: 2-3 days.',
  'Build /hilton-head-honeymoon (or /hilton-head-couples-getaway) \u2014 under-served, high-dollar segment. No CVB landing page owns this. Impact: high, Effort: 1-2 days.',
  '\u201C3 Days in Hilton Head\u201D + \u201C7 Days in Hilton Head\u201D itinerary posts \u2014 compete directly with CVB\u2019s \u201C48 Hours\u201D which is on page 1. These feed everything downstream. Impact: high, Effort: 3-4 days for both.',
  'Comparison post series \u2014 \u201CHilton Head vs Myrtle Beach,\u201D \u201CSea Pines vs Palmetto Dunes,\u201D \u201CHilton Head vs Charleston.\u201D Each post internally links to the relevant neighborhood/trip-type pages. Impact: high, Effort: 1-2 days each.',
  'Repeat the weather-post treatment on 3 more long-form posts \u2014 specifically \u201CBest Places to Stay\u201D (villa buildings table + FAQ), \u201CRestaurants Ranked\u201D (FAQ on reservations, dress code, waits), \u201CThings To Do\u201D (FAQ on booking windows, weather contingencies). Impact: high, Effort: 1 day per post.',
  'Build month-specific planning pages or anchor IDs \u2014 the weather post already contains month-by-month data, but each month search has its own volume. Simplest: add anchor IDs + jump-nav. Harder: 12 thin landing pages. Impact: medium, Effort: half-day for anchors, multi-day for pages.',
  'Start a visible backlink strategy \u2014 guest posts on regional travel blogs (Points Guy family, DiscoverSouthCarolina contributor, FORA, local real estate blogs). Right now low DA is the ceiling. Impact: high, Effort: ongoing, 4-6 hours/month.',
  'Add a /events page \u2014 aggregate the 2026 Hilton Head calendar (RBC Heritage, Wine & Food Festival, Concours d\u2019Elegance, Valentine\u2019s concerts, Christmas at Harbour Town). Use Event schema. Impact: medium, Effort: 1 day + monthly updates.',
].forEach((t) => children.push(numbered(t)));
children.push(gap());

// SECTION 9
children.push(h1('9. Sources referenced'));
[
  'Vacation Company Hilton Head Rentals \u2014 vacationcompany.com/hilton-head-rentals',
  'U.S. News Best Hotels in Hilton Head \u2014 travel.usnews.com/hotels/hilton_head_sc',
  'Visit Hilton Head Island \u2014 Stay \u2014 hiltonheadisland.org/stay',
  'Visit Hilton Head Island \u2014 Things To Do \u2014 hiltonheadisland.org/see-do',
  'Visit Hilton Head Island \u2014 Beaches \u2014 hiltonheadisland.org/see-do/beaches',
  'Visit Hilton Head Island \u2014 Family Vacations \u2014 hiltonheadisland.org/see-do/family-vacations',
  'Visit Hilton Head Island \u2014 48 Hours Itinerary \u2014 hiltonheadisland.org/island-time/trending/48-hours-hilton-head-island-relaxed-weekend-itinerary',
  'Visit Hilton Head Island \u2014 Weddings \u2014 hiltonheadisland.org/weddings',
  'Sea Pines Resort \u2014 Offers & Packages \u2014 seapines.com/offers-and-packages',
  'Sea Pines Resort \u2014 Villa Rentals \u2014 seapines.com/vacation-rentals/villa-rentals',
  'Palmetto Dunes Resort \u2014 palmettodunes.com',
  'Palmetto Dunes \u2014 26 Things to Do in 2026 \u2014 palmettodunes.com/blog/26-things-to-do-in-hilton-head-island',
  'Tripadvisor Hilton Head Hotels \u2014 tripadvisor.com/Hotels-g54273-Hilton_Head_South_Carolina-Hotels.html',
  'Tripadvisor Hilton Head Things to Do \u2014 tripadvisor.com/Attractions-g54273-Activities-Hilton_Head_South_Carolina.html',
  'Tripadvisor Hilton Head Restaurants \u2014 tripadvisor.com/Restaurants-g54273-Hilton_Head_South_Carolina.html',
  'AccuWeather \u2014 Hilton Head Island Weather \u2014 accuweather.com/en/us/hilton-head-island/29926',
  'WeatherSpark \u2014 Hilton Head Year Round \u2014 weatherspark.com/y/18815/Average-Weather-in-Hilton-Head-Island-South-Carolina-United-States-Year-Round',
  'Points Guy \u2014 Best Hilton Head Family Resorts \u2014 thepointsguy.com/hotel/best-hilton-head-resorts-for-families',
  'Points Guy \u2014 Hilton Head Family Vacation \u2014 thepointsguy.com/travel/hilton-head-family-vacation',
  'Hilton Head vs Myrtle Beach comparison \u2014 Living on Hilton Head \u2014 livingonhiltonhead.com/hilton-head-vs-myrtle-beach',
  'Beach Properties Hilton Head \u2014 3-Day Itinerary \u2014 beach-property.com/hilton-head-blog/your-perfect-3-days-hilton-head-island-itinerary',
  'Visit Bluffton SC \u2014 visitbluffton.org',
  'Palmetto Bluff \u2014 Old Town Bluffton \u2014 palmettobluff.com/discover/stories/visit-old-town-bluffton',
  'RBC Heritage \u2014 Tournament Home \u2014 rbcheritage.com',
  'RBC Heritage 2026 Tickets \u2014 Ticketmaster \u2014 am.ticketmaster.com/pgarbcheritage/buy/2026tickets',
].forEach((t) => children.push(bullet(t)));

// ------- document -------
const doc = new Document({
  creator: 'Hilton Ahead',
  title: 'Hilton Ahead SEO Audit',
  description: 'Site-wide SEO audit, April 2026',
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      {
        id: 'Title',
        name: 'Title',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 40, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 0, after: 200 } },
      },
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 30, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 26, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 },
      },
      {
        id: 'Heading3',
        name: 'Heading 3',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 22, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '\u2022',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
      {
        reference: 'numbers',
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: '%1.',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        },
      },
      children,
    },
  ],
});

const outPath = path.join(__dirname, '..', 'SEO-Audit-2026-04-24.docx');
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outPath, buf);
  console.log('Wrote', outPath, `(${(buf.length / 1024).toFixed(1)} KB)`);
});
