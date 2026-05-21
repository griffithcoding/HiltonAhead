/**
 * CSV import — pure parsing + validation library.
 *
 * No I/O, no DB, no env. Safe to import from both the browser (Uploader
 * preview) and the server (importProspects, CLI). Mirrors the column shape
 * of sales_prospects (migration 018) but maps loose-cased / human-typed
 * header variants onto the canonical schema before validation.
 *
 * Parser is inline (~50 LOC) — RFC-4180-ish: quoted fields with embedded
 * commas, embedded newlines, and "" escapes. BOM tolerated. CRLF/LF both
 * accepted. Empty trailing rows skipped silently.
 */
import { SEGMENT_LIST, type Segment } from './segmentation';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CsvProspectRow {
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  title?: string;
  company?: string;
  industry?: string;
  zip?: string;
  city?: string;
  state?: string;
  feeder_city?: string;
  segment?: string;
  estimated_hhi?: string;
  party_size_guess?: number;
  linkedin_url?: string;
  instagram_handle?: string;
  facebook_url?: string;
  reddit_username?: string;
  twitter_handle?: string;
  phone?: string;
  source_channel?: string;
  source_campaign_slug?: string;
  source_notes?: string;
  enrichment_source?: string;
  enrichment_data?: unknown;
}

export interface ParseIssue {
  line: number;
  field?: string;
  message: string;
  raw?: string;
}

export interface ParseResult {
  rows: CsvProspectRow[];
  errors: ParseIssue[];
  warnings: ParseIssue[];
}

// ---------------------------------------------------------------------------
// Header alias map — every canonical column has multiple human variants.
// Keys are normalized via normalizeHeaderKey (lower, strip whitespace + _ -).
// ---------------------------------------------------------------------------

const HEADER_ALIASES: Record<string, keyof CsvProspectRow> = {
  // email
  email: 'email',
  emailaddress: 'email',
  workemail: 'email',
  personalemail: 'email',

  // names
  firstname: 'first_name',
  first: 'first_name',
  givenname: 'first_name',
  fname: 'first_name',
  lastname: 'last_name',
  last: 'last_name',
  surname: 'last_name',
  familyname: 'last_name',
  lname: 'last_name',
  fullname: 'full_name',
  name: 'full_name',
  contactname: 'full_name',

  // role / org
  title: 'title',
  jobtitle: 'title',
  role: 'title',
  position: 'title',
  company: 'company',
  companyname: 'company',
  org: 'company',
  organization: 'company',
  organisation: 'company',
  employer: 'company',
  industry: 'industry',
  sector: 'industry',
  vertical: 'industry',

  // location
  zip: 'zip',
  zipcode: 'zip',
  postalcode: 'zip',
  postcode: 'zip',
  city: 'city',
  state: 'state',
  region: 'state',
  province: 'state',
  feedercity: 'feeder_city',
  feeder: 'feeder_city',
  metro: 'feeder_city',
  market: 'feeder_city',
  origin: 'feeder_city',

  // sales meta
  segment: 'segment',
  bucket: 'segment',
  persona: 'segment',
  estimatedhhi: 'estimated_hhi',
  hhi: 'estimated_hhi',
  householdincome: 'estimated_hhi',
  income: 'estimated_hhi',
  partysize: 'party_size_guess',
  partysizeguess: 'party_size_guess',
  groupsize: 'party_size_guess',
  travelparty: 'party_size_guess',

  // social handles
  linkedin: 'linkedin_url',
  linkedinurl: 'linkedin_url',
  li: 'linkedin_url',
  liurl: 'linkedin_url',
  instagram: 'instagram_handle',
  instagramhandle: 'instagram_handle',
  ig: 'instagram_handle',
  ighandle: 'instagram_handle',
  facebook: 'facebook_url',
  facebookurl: 'facebook_url',
  fb: 'facebook_url',
  reddit: 'reddit_username',
  redditusername: 'reddit_username',
  twitter: 'twitter_handle',
  twitterhandle: 'twitter_handle',
  x: 'twitter_handle',
  xhandle: 'twitter_handle',
  phone: 'phone',
  phonenumber: 'phone',
  mobile: 'phone',
  cell: 'phone',

  // attribution
  sourcechannel: 'source_channel',
  channel: 'source_channel',
  sourcecampaignslug: 'source_campaign_slug',
  campaign: 'source_campaign_slug',
  campaignslug: 'source_campaign_slug',
  sourcenotes: 'source_notes',
  notes: 'source_notes',
  intakenotes: 'source_notes',
  context: 'source_notes',

  // enrichment
  enrichmentsource: 'enrichment_source',
  source: 'enrichment_source',
  list: 'enrichment_source',
  enrichmentdata: 'enrichment_data',
  enrichment: 'enrichment_data',
  raw: 'enrichment_data',
};

function normalizeHeaderKey(h: string): string {
  return h
    .replace(/^﻿/, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_\-]+/g, '');
}

// ---------------------------------------------------------------------------
// Feeder-city normalization map (case-insensitive lookup → canonical name)
// ---------------------------------------------------------------------------

export const FEEDER_CITY_NORMALIZATION: Record<string, string> = {
  atlanta: 'Atlanta',
  atl: 'Atlanta',
  charlotte: 'Charlotte',
  clt: 'Charlotte',
  nyc: 'NYC',
  'new york': 'NYC',
  'new york city': 'NYC',
  manhattan: 'NYC',
  ny: 'NYC',
  'washington dc': 'DC',
  dc: 'DC',
  'd.c.': 'DC',
  washington: 'DC',
  boston: 'Boston',
  bos: 'Boston',
  chicago: 'Chicago',
  chi: 'Chicago',
  cincinnati: 'Cincinnati',
  cinci: 'Cincinnati',
  cvg: 'Cincinnati',
  nashville: 'Nashville',
  nash: 'Nashville',
  bna: 'Nashville',
  raleigh: 'Raleigh-Durham',
  durham: 'Raleigh-Durham',
  'raleigh-durham': 'Raleigh-Durham',
  rdu: 'Raleigh-Durham',
  greenville: 'Greenville-SC',
  'greenville sc': 'Greenville-SC',
  gsp: 'Greenville-SC',
  jacksonville: 'Jacksonville',
  jax: 'Jacksonville',
  orlando: 'Orlando',
  mco: 'Orlando',
};

function normalizeFeederCity(raw: string): string {
  const key = raw.trim().toLowerCase();
  return FEEDER_CITY_NORMALIZATION[key] ?? raw.trim();
}

// ---------------------------------------------------------------------------
// Inline CSV tokenizer — RFC-4180-ish
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Tokenize CSV text into rows of string cells. Handles:
 *   - quoted fields with embedded commas + newlines
 *   - "" escape inside quoted fields
 *   - CRLF, LF, CR line endings
 *   - leading BOM (stripped before parsing)
 */
function tokenize(input: string): string[][] {
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ',') {
      row.push(cell);
      cell = '';
      continue;
    }
    if (ch === '\n' || ch === '\r') {
      // Treat CRLF as a single break by swallowing the LF after a CR.
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }
    cell += ch;
  }
  // Trailing cell + row (no terminating newline).
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// normalizeRow — trim strings, drop empty fields, normalize feeder_city
// ---------------------------------------------------------------------------

export function normalizeRow(row: CsvProspectRow): CsvProspectRow {
  const out: CsvProspectRow = { email: '' };
  for (const [k, v] of Object.entries(row) as Array<[keyof CsvProspectRow, unknown]>) {
    if (v == null) continue;
    if (typeof v === 'string') {
      const trimmed = v.trim();
      if (!trimmed) continue;
      if (k === 'feeder_city') {
        (out as unknown as Record<string, unknown>)[k] = normalizeFeederCity(trimmed);
      } else if (k === 'email') {
        out.email = trimmed.toLowerCase();
      } else {
        (out as unknown as Record<string, unknown>)[k] = trimmed;
      }
    } else {
      (out as unknown as Record<string, unknown>)[k] = v;
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// parseProspectCsv — full pipeline
// ---------------------------------------------------------------------------

export function parseProspectCsv(csv: string): ParseResult {
  const errors: ParseIssue[] = [];
  const warnings: ParseIssue[] = [];
  const rows: CsvProspectRow[] = [];

  const tokens = tokenize(csv);
  if (tokens.length === 0) {
    errors.push({ line: 0, message: 'CSV is empty.' });
    return { rows, errors, warnings };
  }

  const headerCells = tokens[0];
  if (headerCells.every((c) => !c.trim())) {
    errors.push({ line: 1, message: 'Header row is empty.' });
    return { rows, errors, warnings };
  }

  // Map header columns → canonical CsvProspectRow keys.
  const colMap: Array<keyof CsvProspectRow | null> = headerCells.map((h, idx) => {
    const key = normalizeHeaderKey(h);
    if (!key) return null;
    const canonical = HEADER_ALIASES[key];
    if (!canonical) {
      warnings.push({
        line: 1,
        field: h,
        message: `Unknown column "${h}" at position ${idx + 1} — ignored.`,
      });
      return null;
    }
    return canonical;
  });

  if (!colMap.includes('email')) {
    errors.push({
      line: 1,
      field: 'email',
      message: 'CSV must include an "email" column (or alias).',
    });
    return { rows, errors, warnings };
  }

  // Iterate data rows.
  for (let r = 1; r < tokens.length; r++) {
    const lineNum = r + 1;
    const cells = tokens[r];

    // Skip trailing empty rows silently.
    if (cells.length === 0 || cells.every((c) => c.trim() === '')) continue;

    const row: CsvProspectRow = { email: '' };
    for (let c = 0; c < cells.length; c++) {
      const canonical = colMap[c];
      if (!canonical) continue;
      const raw = cells[c];
      if (raw == null || raw.trim() === '') continue;

      if (canonical === 'party_size_guess') {
        const n = parseInt(raw.trim(), 10);
        if (Number.isNaN(n)) {
          warnings.push({
            line: lineNum,
            field: 'party_size_guess',
            message: `Could not parse "${raw}" as integer — left blank.`,
          });
          continue;
        }
        row.party_size_guess = Math.max(1, Math.min(500, n));
      } else if (canonical === 'enrichment_data') {
        const trimmed = raw.trim();
        try {
          row.enrichment_data = JSON.parse(trimmed);
        } catch {
          warnings.push({
            line: lineNum,
            field: 'enrichment_data',
            message: 'Could not parse enrichment_data as JSON — stored as string.',
          });
          row.enrichment_data = trimmed;
        }
      } else if (canonical === 'segment') {
        const seg = raw.trim().toLowerCase();
        if (!(SEGMENT_LIST as ReadonlyArray<string>).includes(seg)) {
          warnings.push({
            line: lineNum,
            field: 'segment',
            message: `Unknown segment "${raw}" — will be re-inferred.`,
          });
        } else {
          row.segment = seg as Segment;
        }
      } else {
        (row as unknown as Record<string, unknown>)[canonical] = raw;
      }
    }

    // Validate email — required.
    const emailRaw = (row.email ?? '').toString().trim();
    if (!emailRaw) {
      errors.push({
        line: lineNum,
        field: 'email',
        message: 'Missing email — row skipped.',
        raw: cells.join(','),
      });
      continue;
    }
    if (!EMAIL_RE.test(emailRaw)) {
      errors.push({
        line: lineNum,
        field: 'email',
        message: `Invalid email "${emailRaw}" — row skipped.`,
        raw: cells.join(','),
      });
      continue;
    }
    row.email = emailRaw;

    rows.push(normalizeRow(row));
  }

  return { rows, errors, warnings };
}
