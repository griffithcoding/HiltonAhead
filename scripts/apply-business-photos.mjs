// Apply discovered business photos (and category-matched fallbacks)
// to data/localBusinesses.ts.
//
// Reads:
//   scripts/business-photos.json  (output of extract-business-photos.mjs)
//   data/localBusinesses.ts
//
// For each business:
//   1. If we extracted a real URL (from the business's website's og:image),
//      use it.
//   2. Otherwise, use a category-matched Unsplash photo derived from the
//      business's industrySlug + categories[] array.
//
// Writes data/localBusinesses.ts back in place. Idempotent.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'localBusinesses.ts');
const PHOTOS_PATH = path.join(__dirname, 'business-photos.json');

// ——— Unsplash fallbacks by category keyword ———————————————————————
// Order matters — first match wins. Keywords matched against
// business.industrySlug + categories[].join(' ').toLowerCase().

const UNSPLASH_BASE = 'https://images.unsplash.com/';
const FB_PARAMS = '?w=1200&q=80&auto=format&fit=crop';

const FALLBACKS = [
  // pizza
  { match: ['pizza'], id: 'photo-1565299624946-b28f40a0ae38' },
  // transportation
  { match: ['limo bus', 'wedding'], id: 'photo-1519225421980-715cb0215aed' },
  { match: ['limo', 'black car', 'town car'], id: 'photo-1453170228677-fe9f99d1aa48' },
  { match: ['airport shuttle', 'shuttle'], id: 'photo-1556122071-e404cb6f31c0' },
  { match: ['taxi'], id: 'photo-1559762717-99c81ac85459' },
  { match: ['bike rental', 'bicycle', 'e-bikes'], id: 'photo-1507035895480-2b3156c31fc8' },
  { match: ['golf cart', 'lsv'], id: 'photo-1592919505780-303950717480' },
  { match: ['water taxi', 'boat tour', 'ferry', 'daufuskie'], id: 'photo-1502784444187-359ac186c5bb' },
  { match: ['trolley'], id: 'photo-1556122071-e404cb6f31c0' },
  { match: ['beach gear', 'cabana'], id: 'photo-1519046904884-53103b34b206' },
  // home services
  { match: ['vacation rental management', 'property management'], id: 'photo-1564013799919-ab600027ffc6' },
  { match: ['cleaning', 'turnover'], id: 'photo-1581578731548-c64695cc6952' },
  { match: ['landscaping', 'lawn care'], id: 'photo-1416879595882-3373a0480b5b' },
  { match: ['pest control', 'termite', 'mosquito'], id: 'photo-1597762470488-3877b1f538c6' },
  { match: ['pool service', 'pool'], id: 'photo-1576013551627-0cc20b96c2a7' },
  { match: ['handyman', 'repair', 'remodel'], id: 'photo-1581094794329-c8112a89af12' },
  { match: ['interior design', 'staging'], id: 'photo-1586023492125-27b2c045efd7' },
  // existing industries
  { match: ['vacation rental', 'villa'], id: 'photo-1564013799919-ab600027ffc6' },
  { match: ['restaurant', 'seafood', 'dining', 'french', 'italian'], id: 'photo-1414235077428-338989a2e8c0' },
  { match: ['golf'], id: 'photo-1535131749006-b7f58c99034b' },
  { match: ['kayak', 'paddleboard', 'fishing', 'water activities', 'dolphin'], id: 'photo-1502784444187-359ac186c5bb' },
  { match: ['spa', 'wellness', 'massage', 'yoga'], id: 'photo-1544161515-4ab6ce6db874' },
  { match: ['wedding'], id: 'photo-1519225421980-715cb0215aed' },
  { match: ['shopping', 'boutique', 'gallery'], id: 'photo-1483985988355-763728e1935b' },
  { match: ['family', 'kids', 'children'], id: 'photo-1569317002804-ab77bc7f8a7f' },
];

const DEFAULT_FALLBACK = 'photo-1572715376701-98568319fd0b';

function pickFallback(industrySlug, categories) {
  const haystack = [industrySlug, ...(categories ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  for (const f of FALLBACKS) {
    if (f.match.some((kw) => haystack.includes(kw))) {
      return `${UNSPLASH_BASE}${f.id}${FB_PARAMS}`;
    }
  }
  return `${UNSPLASH_BASE}${DEFAULT_FALLBACK}${FB_PARAMS}`;
}

// ——— parse ———————————————————————————————————————————————————————

/** Pull every business's id, industrySlug, and categories array from the file text. */
function parseBusinessMeta(text) {
  // Each entry: id: 'X' ... industrySlug: 'Y' ... categories: ['A', 'B', ...]
  const re =
    /id:\s*'([^']+)'[\s\S]{0,200}?industrySlug:\s*'([^']+)'[\s\S]{0,400}?categories:\s*\[([^\]]*)\]/g;
  const out = new Map();
  let m;
  while ((m = re.exec(text))) {
    const cats = m[3]
      .split(',')
      .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
    out.set(m[1], { industrySlug: m[2], categories: cats });
  }
  return out;
}

// ——— rewrite ———————————————————————————————————————————————————————

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replace the heroImage.src for one business id. Returns updated text. */
function applyOne(text, businessId, newUrl) {
  const safeId = escapeRegExp(businessId);
  const re = new RegExp(
    `(id:\\s*'${safeId}'[\\s\\S]{0,1500}?heroImage:\\s*\\{[\\s\\S]{0,300}?src:\\s*)'[^']*'`,
  );
  if (!re.test(text)) {
    return { text, changed: false };
  }
  return { text: text.replace(re, `$1'${newUrl}'`), changed: true };
}

// ——— main ————————————————————————————————————————————————————————

async function main() {
  const text0 = await fs.readFile(DATA_PATH, 'utf8');
  const photoData = JSON.parse(await fs.readFile(PHOTOS_PATH, 'utf8'));
  const meta = parseBusinessMeta(text0);

  const photoMap = new Map();
  for (const r of photoData) {
    if (r.ok && r.photo) photoMap.set(r.id, r.photo);
  }

  // Build target URLs for every business we have meta for.
  const targets = [];
  for (const [id, m] of meta.entries()) {
    const real = photoMap.get(id);
    targets.push({
      id,
      url: real ?? pickFallback(m.industrySlug, m.categories),
      source: real ? 'website' : 'unsplash',
    });
  }

  let text = text0;
  let realCount = 0;
  let fallbackCount = 0;
  let unchanged = 0;

  for (const t of targets) {
    const result = applyOne(text, t.id, t.url);
    if (result.changed) {
      text = result.text;
      if (t.source === 'website') realCount++;
      else fallbackCount++;
    } else {
      unchanged++;
    }
  }

  await fs.writeFile(DATA_PATH, text, 'utf8');

  console.log(`Updated heroImage.src for ${targets.length - unchanged} businesses:`);
  console.log(`  ${realCount} real (from each business's og:image)`);
  console.log(`  ${fallbackCount} category-matched Unsplash fallbacks`);
  if (unchanged) {
    console.log(`  ${unchanged} no-change (regex didn't match — investigate)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
