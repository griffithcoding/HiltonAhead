/**
 * /admin/sales-prospects/import — CSV import surface for sales prospects.
 *
 * Server component, gated by requireAdmin() (belt-and-braces with the (gated)
 * layout). Loads active sales_campaigns and renders the Uploader client
 * island. Heavy lifting is in Uploader.tsx — this page is the shell.
 */
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import Uploader from './Uploader';

export const dynamic = 'force-dynamic';

interface CampaignOption {
  slug: string;
  name: string;
}

export default async function ImportProspectsPage() {
  const gate = await requireAdmin();
  if (!gate.ok) redirect('/admin/login');

  const supabase = await createClient();
  const { data: campaignRows } = await supabase
    .from('sales_campaigns')
    .select('slug, name, is_active, feeder_city')
    .eq('is_active', true)
    .order('feeder_city', { ascending: true });

  const campaigns: CampaignOption[] = (campaignRows ?? []).map((c) => ({
    slug: (c as { slug: string }).slug,
    name: (c as { name: string }).name,
  }));

  return (
    <div className="mx-auto max-w-[1100px]">
      <header className="mb-8">
        <Link
          href="/admin/sales-prospects"
          className="inline-block text-[12px] uppercase tracking-[0.18em] text-ocean-deep hover:text-coral"
        >
          ← Sales Prospects
        </Link>
        <div className="eyebrow eyebrow-coral mt-4">Cold outbound CRM</div>
        <h1 className="display mt-2 text-[34px] leading-[1.1] text-ink md:text-[42px]">
          Import prospects
        </h1>
        <p className="mt-3 max-w-[680px] text-[14px] leading-[1.65] text-ink-soft">
          Upload an enriched CSV — one row per prospect. We dedupe by lower(email),
          skip anyone on the unsubscribe list, infer segment from notes + campaign,
          and enroll new prospects in the right cold sequence with a 5-minute
          enrichment buffer.
        </p>
      </header>

      <div className="mb-6 rounded-sm border border-ocean-deep/15 bg-sand-soft p-5 text-[13px] leading-[1.7] text-ink-soft">
        <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-ocean-deep">
          Before you import
        </div>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong className="text-ink">Email column is required.</strong> Other
            fields are optional but more = better segmentation.
          </li>
          <li>
            Limits: 5&nbsp;MB max upload, 10,000 rows max per batch. Split
            larger lists.
          </li>
          <li>
            Pick the campaign + channel below before importing — they get
            written onto every new prospect for attribution.
          </li>
          <li>
            Use{' '}
            <strong className="text-ink">Dry run</strong> to validate without
            writing anything to the DB.
          </li>
          <li>
            <Link
              href="/api/admin/sales-prospects/import/template"
              className="text-ocean-deep underline hover:text-coral"
            >
              Download the sample CSV template
            </Link>{' '}
            for the canonical column order + 3 example rows.
          </li>
        </ul>
      </div>

      <Uploader campaigns={campaigns} />
    </div>
  );
}
