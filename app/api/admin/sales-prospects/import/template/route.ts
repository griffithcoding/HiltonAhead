/**
 * GET /api/admin/sales-prospects/import/template
 *
 * Returns the canonical sample-prospect-import.csv with three realistic
 * fictional rows exercising different segments + feeder cities. Admin-gated.
 */
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/utils/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HEADER = [
  'email',
  'first_name',
  'last_name',
  'full_name',
  'title',
  'company',
  'industry',
  'zip',
  'city',
  'state',
  'feeder_city',
  'segment',
  'estimated_hhi',
  'party_size_guess',
  'linkedin_url',
  'instagram_handle',
  'source_channel',
  'source_campaign_slug',
  'source_notes',
  'enrichment_source',
];

const SAMPLE_ROWS: string[][] = [
  [
    'allen.brookhaven@example.com',
    'Allen',
    'Brookhaven',
    'Allen Brookhaven',
    'Managing Partner',
    'Brookhaven Capital',
    'Finance',
    '30319',
    'Atlanta',
    'GA',
    'Atlanta',
    'golf',
    '$500k-$1M',
    '8',
    'https://www.linkedin.com/in/allen-brookhaven-fake',
    '',
    'email',
    'atlanta-golf-q1-2026',
    'Annual partner trip — 8 guys looking for Harbour Town tee times in October',
    'manual',
  ],
  [
    'maria.tribeca@example.com',
    'Maria',
    'Tribeca',
    'Maria Tribeca',
    'Director of Marketing',
    'Spring Studio',
    'Advertising',
    '10013',
    'New York',
    'NY',
    'NYC',
    'honeymoon',
    '$200k-$500k',
    '2',
    'https://www.linkedin.com/in/maria-tribeca-fake',
    '@mariatribeca',
    'instagram',
    'nyc-honeymoon-2026',
    'Newlyweds — wedding in June, honeymoon early July, oceanfront villa with private pool',
    'public_socials',
  ],
  [
    'jp.greenville@example.com',
    'Jordan',
    'Pickens',
    'Jordan Pickens',
    'Pediatrician',
    'Greenville Pediatrics',
    'Medicine',
    '29607',
    'Greenville',
    'SC',
    'Greenville-SC',
    'family',
    '$200k-$500k',
    '5',
    'https://www.linkedin.com/in/jordan-pickens-fake',
    '',
    'email',
    'greenville-sc-family-2026',
    'Family of 5 (kids 3, 6, 9) — easy weekend drive over from Greenville, Easter break dates',
    'manual',
  ],
];

function csvCell(s: string): string {
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function rowToCsv(row: string[]): string {
  return row.map(csvCell).join(',');
}

export async function GET(): Promise<Response> {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ ok: false, error: gate.error }, { status: 401 });
  }

  const lines = [rowToCsv(HEADER), ...SAMPLE_ROWS.map(rowToCsv)];
  const body = lines.join('\r\n') + '\r\n';

  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="sample-prospect-import.csv"',
      'cache-control': 'no-store',
    },
  });
}
