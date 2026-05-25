/**
 * Shared utilities for outreach scrapers.
 *
 * Scrapers in scripts/outreach/sources/ produce arrays of ScrapedRecord,
 * which this lib converts to the CSV column schema expected by the existing
 * importer at app/admin/(gated)/outreach/import/.
 *
 * Operator workflow:
 *   1. npm run scrape:outreach <source-slug>
 *   2. Review the CSV written to scripts/outreach/out/
 *   3. Manually clean (most scrapers will need it on first run)
 *   4. Upload at /admin/outreach/import
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';

// ============================================================================
// Types
// ============================================================================

/**
 * A scraped account/contact pair, ready to be flattened into the CSV
 * importer's row format. Optional fields drop out as empty cells.
 */
export type ScrapedRecord = {
  /** Display name of the business / publication. Required. */
  accountName: string;
  /** Bare domain (lowercased, no protocol, no www). Required. */
  domain: string;
  /** Full landing URL. Optional if domain is present. */
  websiteUrl?: string;
  /** Free-text vertical label — what kind of business this is. */
  vertical?: string;
  /** Moz/Ahrefs domain rating 0–100. Optional. */
  domainRating?: number;
  /** Monthly organic traffic estimate. Optional. */
  monthlyTraffic?: number;
  /** Contact email. Optional but strongly preferred. */
  contactEmail?: string;
  contactFirstName?: string;
  contactLastName?: string;
  contactRole?: string;
  /** Default outreach link_type for the opportunity row. */
  linkType?: 'guest_post' | 'resource_page' | 'partnership' | 'niche_edit' | 'other';
  /** Our target URL we want them to link to. */
  targetUrl?: string;
  anchorText?: string;
  /** Campaign tag for ROI attribution. */
  campaign: string;
  /** Free-text notes — anything the operator should see before sending. */
  notes?: string;
};

// ============================================================================
// Email extraction
// ============================================================================

/**
 * Liberal email regex. Captures groups: 1=local, 2=domain. Used with /g flag.
 *
 * Intentionally tolerant — false positives are easier to filter at review
 * time than missed emails are to recover.
 */
export const EMAIL_RE =
  /([a-zA-Z0-9._%+\-]+)@([a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)+)/g;

// Common bot/placeholder noise we don't want in the output.
const EMAIL_DENYLIST = new Set([
  'example@example.com',
  'name@example.com',
  'you@example.com',
  'email@domain.com',
  'noreply@noreply.com',
  'no-reply@no-reply.com',
]);

const DENYLIST_DOMAINS = new Set([
  'sentry.io',
  'sentry.wixpress.com',
  'wixpress.com',
  'cloudflare.com',
  'godaddy.com',
  'godaddysites.com',
  'squarespace.com',
  'shopify.com',
]);

/** Extract unique, lower-cased, denylist-filtered emails from a blob of HTML or text. */
export function extractEmails(input: string): string[] {
  const seen = new Set<string>();
  for (const match of input.matchAll(EMAIL_RE)) {
    const email = match[0].toLowerCase().trim();
    if (EMAIL_DENYLIST.has(email)) continue;
    const domain = match[2]?.toLowerCase();
    if (domain && DENYLIST_DOMAINS.has(domain)) continue;
    seen.add(email);
  }
  return Array.from(seen);
}

// ============================================================================
// URL / domain helpers
// ============================================================================

/** Strip protocol, www, path, query, fragment — return bare lowercased domain. */
export function deriveDomain(url: string | undefined | null): string {
  if (!url) return '';
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    return url
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split(/[/?#]/)[0];
  }
}

/** Domains we never want to outreach (our own, social networks, marketplaces). */
const SELF_AND_NOISE_DOMAINS = new Set([
  'hiltonahead.com',
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  'linkedin.com',
  'youtube.com',
  'pinterest.com',
  'tiktok.com',
  'reddit.com',
  'yelp.com',
  'tripadvisor.com',
  'google.com',
  'maps.google.com',
  'mailchi.mp',
  'eventbrite.com',
  'gofundme.com',
  'patreon.com',
]);

export function isOutreachableDomain(domain: string): boolean {
  if (!domain) return false;
  if (SELF_AND_NOISE_DOMAINS.has(domain)) return false;
  if (domain.endsWith('.gov')) return false;
  if (domain.endsWith('.edu')) return false;
  return true;
}

// ============================================================================
// Fetch with throttle + custom UA
// ============================================================================

const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 HiltonAheadResearchBot';

let lastFetchAt = 0;

/**
 * Fetch a URL as text with politeness throttle. Default 1500ms between calls.
 * Real Mozilla-ish UA — many sites 403 obvious bots.
 */
export async function fetchHtml(
  url: string,
  opts: { throttleMs?: number; userAgent?: string; timeoutMs?: number } = {},
): Promise<string> {
  const throttle = opts.throttleMs ?? 1500;
  const ua = opts.userAgent ?? DEFAULT_UA;
  const timeout = opts.timeoutMs ?? 20_000;

  const wait = lastFetchAt + throttle - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastFetchAt = Date.now();

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, {
      headers: {
        'user-agent': ua,
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

// ============================================================================
// CSV writer — matches the column schema the existing importer expects.
// See app/admin/(gated)/outreach/import/actions.ts
// ============================================================================

const CSV_COLUMNS = [
  'account_name',
  'domain',
  'website_url',
  'vertical',
  'domain_rating',
  'monthly_traffic',
  'contact_email',
  'contact_first_name',
  'contact_last_name',
  'contact_role',
  'link_type',
  'target_url',
  'anchor_text',
  'campaign',
  'notes',
] as const;

function csvEscape(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '';
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function recordsToCsv(records: ScrapedRecord[]): string {
  const header = CSV_COLUMNS.join(',');
  const rows = records.map((r) =>
    [
      r.accountName,
      r.domain,
      r.websiteUrl,
      r.vertical,
      r.domainRating,
      r.monthlyTraffic,
      r.contactEmail,
      r.contactFirstName,
      r.contactLastName,
      r.contactRole,
      r.linkType ?? 'other',
      r.targetUrl,
      r.anchorText,
      r.campaign,
      r.notes,
    ]
      .map(csvEscape)
      .join(','),
  );
  return [header, ...rows].join('\n') + '\n';
}

/** Write CSV to scripts/outreach/out/<source>-<ISO>.csv. Returns the file path. */
export async function writeCsv(
  sourceSlug: string,
  records: ScrapedRecord[],
): Promise<string> {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const path = join(
    process.cwd(),
    'scripts',
    'outreach',
    'out',
    `${sourceSlug}-${stamp}.csv`,
  );
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, recordsToCsv(records), 'utf-8');
  return path;
}

// ============================================================================
// Name parsing
// ============================================================================

/** Split "Jane Doe" → { firstName: "Jane", lastName: "Doe" }. */
export function splitName(full: string | undefined): {
  firstName?: string;
  lastName?: string;
} {
  if (!full) return {};
  const cleaned = full.trim().replace(/\s+/g, ' ');
  if (!cleaned) return {};
  const parts = cleaned.split(' ');
  if (parts.length === 1) return { firstName: parts[0] };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

// ============================================================================
// Source registry contract
// ============================================================================

export type OutreachSource = {
  slug: string;
  label: string;
  description: string;
  /** Suggested default link_type + targetUrl for opportunities from this source. */
  defaults: {
    linkType: ScrapedRecord['linkType'];
    targetUrl?: string;
    campaign: string;
  };
  scrape(): Promise<ScrapedRecord[]>;
};
