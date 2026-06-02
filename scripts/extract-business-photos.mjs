// Extract real business photos for /local directory entries.
//
// Reads data/localBusinesses.ts as text, regex-extracts every entry's
// { id, website } pair, fetches each website, parses out the og:image
// (with Twitter card fallback), and writes a JSON map to
// scripts/business-photos.json.
//
// A second script (apply-business-photos.mjs) then rewrites the data
// file's heroImage.src for each business with a discovered URL.
//
// Run from repo root:  node scripts/extract-business-photos.mjs
//
// Notes:
// - Hot-links the discovered URL — no /public/ download.
// - BusinessCard.tsx uses plain <img>, so cross-domain works fine.
// - Skips businesses without a website field; reports failures so you
//   can fall back to category-matched stock photos manually.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'localBusinesses.ts');
const OUT_PATH = path.join(__dirname, 'business-photos.json');

const REQUEST_TIMEOUT_MS = 12_000;
const CONCURRENCY = 8;

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// ——— parse ———————————————————————————————————————————————————————

/** Extract every { id, website } pair from the data file. */
function parseBusinesses(text) {
  // Match each entry's id (single-quoted), capturing forward-of-id
  // until we hit `website: '...'`. Same-block heuristic: the website
  // and id sit within the same Business object so we tolerate ~600
  // characters between them.
  const re =
    /id:\s*'([^']+)'[\s\S]{0,1200}?website:\s*'([^']+)'/g;
  const out = [];
  let m;
  while ((m = re.exec(text))) {
    out.push({ id: m[1], website: m[2] });
  }
  // Dedupe by id (last wins).
  const map = new Map();
  for (const b of out) map.set(b.id, b);
  return [...map.values()];
}

// ——— fetch ———————————————————————————————————————————————————————

async function withTimeout(promise, ms) {
  let t;
  const timeout = new Promise((_, rej) => {
    t = setTimeout(() => rej(new Error('timeout')), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(t);
  }
}

/** Fetch URL, follow up to 5 redirects, return HTML body or null. */
async function fetchHtml(url) {
  try {
    const res = await withTimeout(
      fetch(url, {
        headers: {
          'User-Agent': UA,
          Accept: 'text/html,application/xhtml+xml',
        },
        redirect: 'follow',
      }),
      REQUEST_TIMEOUT_MS,
    );
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('html')) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/** Extract og:image / twitter:image URL from raw HTML. */
function extractImage(html, baseUrl) {
  if (!html) return null;
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
    /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      let url = m[1].trim();
      if (!url) continue;
      // Resolve relative URLs.
      try {
        return new URL(url, baseUrl).toString();
      } catch {
        continue;
      }
    }
  }
  return null;
}

// ——— pool ————————————————————————————————————————————————————————

async function pool(items, n, worker) {
  const out = new Array(items.length);
  let cursor = 0;
  async function next() {
    while (cursor < items.length) {
      const i = cursor++;
      out[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: n }, next));
  return out;
}

// ——— main ————————————————————————————————————————————————————————

async function main() {
  const text = await fs.readFile(DATA_PATH, 'utf8');
  const businesses = parseBusinesses(text);
  console.log(`Found ${businesses.length} businesses with websites.`);

  const results = await pool(businesses, CONCURRENCY, async (b, i) => {
    process.stdout.write(`[${i + 1}/${businesses.length}] ${b.id} … `);
    const html = await fetchHtml(b.website);
    const img = extractImage(html, b.website);
    if (img) {
      console.log('OK');
      return { id: b.id, website: b.website, photo: img, ok: true };
    }
    console.log('miss');
    return { id: b.id, website: b.website, photo: null, ok: false };
  });

  const okCount = results.filter((r) => r.ok).length;
  console.log(
    `\nResolved ${okCount}/${results.length} (${Math.round((okCount / results.length) * 100)}%).`,
  );

  await fs.writeFile(OUT_PATH, JSON.stringify(results, null, 2));
  console.log(`Wrote ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
