/**
 * Outreach scraper CLI.
 *
 * Usage:
 *   npm run scrape:outreach                  # list sources
 *   npm run scrape:outreach <slug>           # run one source
 *   npm run scrape:outreach all              # run every source sequentially
 *
 * Each run writes a CSV to scripts/outreach/out/<slug>-<ISO>.csv in the exact
 * column schema accepted by /admin/outreach/import.
 *
 * Operator workflow:
 *   1. Run the scraper
 *   2. Open the CSV in a spreadsheet, manually clean (delete obvious junk
 *      rows, fix names, add anchor text, set link_type where useful)
 *   3. Upload the cleaned CSV at /admin/outreach/import
 *   4. Each row becomes 1 outreach_account + 0–1 contact + 1 opportunity
 *      in the 'discovered' stage
 *   5. From the opportunity detail page, compose with a swap_* template
 *      (Resource swap — restaurant / wedding / vacation rental / regional blog)
 */

import { hhiChamberSource } from './sources/hhi-chamber';
import { writeCsv, type OutreachSource } from './lib';
import { enrichCsv } from './enrich';

const SOURCES: OutreachSource[] = [hhiChamberSource];

function listSources(): void {
  console.log('Available outreach sources:\n');
  for (const s of SOURCES) {
    console.log(`  ${s.slug.padEnd(20)} ${s.label}`);
    console.log(`  ${''.padEnd(20)} ${s.description}`);
    console.log();
  }
  console.log('Run: npm run scrape:outreach <slug>');
  console.log('Or:  npm run scrape:outreach all');
}

async function runOne(source: OutreachSource): Promise<number> {
  console.log(`\n=== ${source.slug} — ${source.label} ===`);
  const t0 = Date.now();
  const records = await source.scrape();
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  if (records.length === 0) {
    console.warn(`[${source.slug}] No records scraped after ${elapsed}s. Selectors may need updating.`);
    return 0;
  }

  const path = await writeCsv(source.slug, records);
  const withEmail = records.filter((r) => r.contactEmail).length;
  console.log(`[${source.slug}] ${records.length} records (${withEmail} with email) in ${elapsed}s`);
  console.log(`[${source.slug}] CSV: ${path}`);
  return records.length;
}

async function main(): Promise<void> {
  const arg = process.argv[2];

  if (!arg) {
    listSources();
    return;
  }

  if (arg === 'enrich') {
    const inputPath = process.argv[3];
    if (!inputPath) {
      console.error('Usage: npm run scrape:outreach enrich <path-to-csv>');
      process.exit(1);
    }
    await enrichCsv(inputPath);
    return;
  }

  if (arg === 'all') {
    let total = 0;
    for (const s of SOURCES) {
      total += await runOne(s);
    }
    console.log(`\nDone — ${total} total records across ${SOURCES.length} sources.`);
    return;
  }

  const source = SOURCES.find((s) => s.slug === arg);
  if (!source) {
    console.error(`Unknown source: ${arg}`);
    listSources();
    process.exit(1);
  }

  await runOne(source);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
