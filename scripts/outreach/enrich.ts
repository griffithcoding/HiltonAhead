/**
 * Email enrichment for scraped outreach CSVs.
 *
 * Many sources (the HHI Chamber in particular) hide member emails. Their
 * scraped CSVs come out with account_name + domain + website_url but no
 * contact_email. This script:
 *
 *   1. Reads a CSV produced by `npm run scrape:outreach <slug>`
 *   2. For each row missing contact_email and having website_url, fetches:
 *        <website>/
 *        <website>/contact
 *        <website>/contact-us
 *        <website>/about
 *      with the same throttle + UA used by the scrapers.
 *   3. Extracts the first plausible email (preferring the one whose domain
 *      matches the account domain — e.g. info@theirsite.com over a
 *      tripadvisor address linked from a footer review badge).
 *   4. Writes <input>.enriched.csv next to the input.
 *
 * Usage:
 *   npm run scrape:outreach -- enrich scripts/outreach/out/hhi-chamber-<ts>.csv
 *
 * (When invoked via the run.ts dispatcher with arg `enrich`.)
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname, basename, extname } from 'node:path';
import { fetchHtml, extractEmails, deriveDomain } from './lib';

// Pages we probe in priority order. First plausible email wins.
const PROBE_PATHS = ['/', '/contact', '/contact-us', '/about', '/about-us'];

// Cap to bound runtime + courtesy to target sites.
const MAX_ROWS = Number(process.env.OUTREACH_ENRICH_MAX ?? 50);

type Row = Record<string, string>;

function parseCsv(content: string): { header: string[]; rows: Row[] } {
  // Lightweight CSV parser — handles quoted cells with commas and escaped
  // quotes. Production-grade is overkill here; the CSV is one we authored
  // ourselves in lib.ts so we know the escape conventions match.
  const lines: string[][] = [];
  let cur: string[] = [];
  let field = '';
  let inQuote = false;

  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    if (inQuote) {
      if (c === '"' && content[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuote = false;
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuote = true;
      } else if (c === ',') {
        cur.push(field);
        field = '';
      } else if (c === '\n') {
        cur.push(field);
        lines.push(cur);
        cur = [];
        field = '';
      } else if (c === '\r') {
        // ignore — \r\n handled by \n branch
      } else {
        field += c;
      }
    }
  }
  if (field || cur.length > 0) {
    cur.push(field);
    lines.push(cur);
  }

  const nonEmpty = lines.filter((l) => l.some((c) => c.length > 0));
  if (nonEmpty.length === 0) return { header: [], rows: [] };

  const header = nonEmpty[0];
  const rows: Row[] = nonEmpty.slice(1).map((cells) => {
    const r: Row = {};
    header.forEach((h, idx) => {
      r[h] = cells[idx] ?? '';
    });
    return r;
  });

  return { header, rows };
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function writeCsvString(header: string[], rows: Row[]): string {
  const headerLine = header.join(',');
  const rowLines = rows.map((r) =>
    header.map((h) => csvEscape(r[h] ?? '')).join(','),
  );
  return [headerLine, ...rowLines].join('\n') + '\n';
}

/**
 * Pick the best email from a list given the target account domain.
 *
 * Preference order:
 *   1. Email whose domain == account domain (info@theirsite.com)
 *   2. Email whose domain endsWith account domain (jane@mail.theirsite.com)
 *   3. First email in the list
 *
 * Excludes obvious noise (wordpress, sentry, hostmaster, etc.) handled
 * by lib.ts's denylist.
 */
function pickBestEmail(
  emails: string[],
  accountDomain: string,
): string | undefined {
  if (emails.length === 0) return undefined;
  const lowered = accountDomain.toLowerCase();

  const exact = emails.find((e) => e.split('@')[1]?.toLowerCase() === lowered);
  if (exact) return exact;

  const suffix = emails.find((e) =>
    e.split('@')[1]?.toLowerCase().endsWith(lowered),
  );
  if (suffix) return suffix;

  return emails[0];
}

async function enrichRow(row: Row): Promise<string | undefined> {
  const website = row.website_url || row.websiteUrl;
  const accountDomain = row.domain || deriveDomain(website);
  if (!website || !accountDomain) return undefined;

  // Normalize base URL.
  let base: URL;
  try {
    base = new URL(website.startsWith('http') ? website : `https://${website}`);
  } catch {
    return undefined;
  }

  for (const path of PROBE_PATHS) {
    const probeUrl = new URL(path, `${base.protocol}//${base.host}`).toString();
    try {
      const html = await fetchHtml(probeUrl, { timeoutMs: 12_000 });
      const emails = extractEmails(html);
      const pick = pickBestEmail(emails, accountDomain);
      if (pick) return pick;
    } catch {
      // 404s and timeouts are expected — keep probing.
    }
  }
  return undefined;
}

export async function enrichCsv(inputPath: string): Promise<string> {
  const content = await readFile(inputPath, 'utf-8');
  const { header, rows } = parseCsv(content);

  if (!header.includes('contact_email')) {
    throw new Error(
      `Input CSV missing contact_email column. Got headers: ${header.join(', ')}`,
    );
  }

  const candidates = rows.filter(
    (r) => !r.contact_email && (r.website_url || r.domain),
  );
  const limit = Math.min(candidates.length, MAX_ROWS);

  console.log(
    `[enrich] ${rows.length} total rows · ${candidates.length} need enrichment · processing first ${limit}`,
  );

  let found = 0;
  for (let i = 0; i < limit; i++) {
    const row = candidates[i];
    const email = await enrichRow(row);
    if (email) {
      row.contact_email = email;
      found++;
    }
    if ((i + 1) % 5 === 0) {
      console.log(`[enrich] ${i + 1}/${limit} · ${found} emails found so far`);
    }
  }

  const outDir = dirname(inputPath);
  const stem = basename(inputPath, extname(inputPath));
  const outPath = join(outDir, `${stem}.enriched.csv`);
  await writeFile(outPath, writeCsvString(header, rows), 'utf-8');

  console.log(`[enrich] Done · ${found}/${limit} emails found · ${outPath}`);
  return outPath;
}
