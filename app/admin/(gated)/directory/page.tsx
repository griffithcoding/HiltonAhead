import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { allBusinesses } from '@/data/localBusinesses';

export const dynamic = 'force-dynamic';

const WINDOW_DAYS = 30;

interface DirectoryEventRow {
  business_id: string;
  industry_slug: string;
  event_type: string;
  created_at: string;
}

type Counts = {
  phone: number;
  website: number;
  inquiry: number;
  total: number;
  last: string | null;
};

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default async function AdminDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string }>;
}) {
  const { industry: industryFilter } = await searchParams;
  const supabase = await createClient();

  const since = new Date(
    Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data, error } = await supabase
    .from('directory_events')
    .select('business_id, industry_slug, event_type, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(50_000);

  if (error) {
    return (
      <div className="mx-auto max-w-[900px] p-8 font-mono text-[13px]">
        <div className="mb-4 text-[16px] font-semibold text-coral-deep">
          Supabase query error
        </div>
        <pre className="rounded-sm border border-coral/30 bg-coral/5 p-4 whitespace-pre-wrap break-words">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  const events = (data ?? []) as DirectoryEventRow[];

  // Aggregate per business_id.
  const counts = new Map<string, Counts>();
  for (const ev of events) {
    const c = counts.get(ev.business_id) ?? {
      phone: 0,
      website: 0,
      inquiry: 0,
      total: 0,
      last: null,
    };
    if (ev.event_type === 'phone_click') c.phone += 1;
    else if (ev.event_type === 'website_click') c.website += 1;
    else if (ev.event_type === 'inquiry_submit') c.inquiry += 1;
    c.total += 1;
    if (!c.last || ev.created_at > c.last) c.last = ev.created_at;
    counts.set(ev.business_id, c);
  }

  // Pull all businesses (optionally filtered by industry) and decorate
  // with their counts. Listings with zero events still appear so the
  // founder can see what isn't moving.
  const businesses = industryFilter
    ? allBusinesses.filter((b) => b.industrySlug === industryFilter)
    : allBusinesses;

  const rows = businesses.map((b) => {
    const c = counts.get(b.id) ?? {
      phone: 0,
      website: 0,
      inquiry: 0,
      total: 0,
      last: null,
    };
    return { business: b, counts: c };
  });

  // Sort: most-active first, then alpha.
  rows.sort((a, z) => {
    if (z.counts.total !== a.counts.total) return z.counts.total - a.counts.total;
    return a.business.name.localeCompare(z.business.name);
  });

  // Top-line stats.
  const totalEvents = events.length;
  const businessesWithActivity = counts.size;
  const totalPhone = events.filter((e) => e.event_type === 'phone_click').length;
  const totalWebsite = events.filter(
    (e) => e.event_type === 'website_click',
  ).length;

  // Industries for the filter pill row.
  const industrySlugs = Array.from(
    new Set(allBusinesses.map((b) => b.industrySlug)),
  ).sort();

  return (
    <div>
      <header className="mb-8">
        <div className="eyebrow eyebrow-coral">Directory</div>
        <h1 className="display mt-2 text-[28px] leading-[1.1] text-ink md:text-[34px]">
          Listing attribution
          <span className="display-italic text-ink-soft"> — last {WINDOW_DAYS} days</span>
        </h1>
        <p className="mt-3 max-w-[640px] text-[14px] leading-[1.6] text-ink-soft">
          Outbound interactions on /local business cards. Use this to identify
          listings worth pitching for a Listed ($600/yr), Featured ($1,800/yr),
          or Signature ($4,800/yr) upgrade — the upsell story is &ldquo;Hilton
          Ahead sent you {totalPhone + totalWebsite} interactions in the last
          month.&rdquo;
        </p>
      </header>

      {/* KPIs */}
      <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total events', value: totalEvents },
          { label: 'Active listings', value: businessesWithActivity },
          { label: 'Phone clicks', value: totalPhone },
          { label: 'Website clicks', value: totalWebsite },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-sm border border-ocean-deep/15 bg-sand-soft p-4"
          >
            <div className="display text-[26px] leading-none text-ink">
              {k.value.toLocaleString()}
            </div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              {k.label}
            </div>
          </div>
        ))}
      </section>

      {/* Industry filter */}
      <nav className="mb-6 flex flex-wrap gap-2 text-[12px]">
        <Link
          href="/admin/directory"
          className={`rounded-full border px-3 py-1.5 transition ${
            !industryFilter
              ? 'border-ink bg-ink text-sand'
              : 'border-rule-soft bg-sand-soft text-ink-soft hover:border-ocean/40 hover:text-ocean'
          }`}
        >
          All
        </Link>
        {industrySlugs.map((s) => (
          <Link
            key={s}
            href={`/admin/directory?industry=${s}`}
            className={`rounded-full border px-3 py-1.5 transition ${
              industryFilter === s
                ? 'border-ink bg-ink text-sand'
                : 'border-rule-soft bg-sand-soft text-ink-soft hover:border-ocean/40 hover:text-ocean'
            }`}
          >
            {s}
          </Link>
        ))}
      </nav>

      {/* Table */}
      <div className="overflow-x-auto rounded-sm border border-ocean-deep/15">
        <table className="w-full text-[13px]">
          <thead className="bg-sand-soft text-[11px] uppercase tracking-[0.14em] text-ink-soft">
            <tr>
              <th className="p-3 text-left font-semibold">Business</th>
              <th className="p-3 text-left font-semibold">Industry</th>
              <th className="p-3 text-right font-semibold">Phone</th>
              <th className="p-3 text-right font-semibold">Website</th>
              <th className="p-3 text-right font-semibold">Inquiries</th>
              <th className="p-3 text-right font-semibold">Total</th>
              <th className="p-3 text-left font-semibold">Last</th>
              <th className="p-3 text-left font-semibold">Owner</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ business: b, counts: c }) => {
              const isActive = c.total > 0;
              return (
                <tr
                  key={`${b.industrySlug}-${b.id}`}
                  className={`border-t border-ocean-deep/10 ${
                    isActive ? '' : 'opacity-60'
                  }`}
                >
                  <td className="p-3 align-top">
                    <div className="font-semibold text-ink">{b.name}</div>
                    <div className="text-[11px] text-ink-soft">{b.id}</div>
                  </td>
                  <td className="p-3 align-top text-ink-soft">
                    <Link
                      href={`/local/${b.industrySlug}#${b.id}`}
                      className="hover:text-coral"
                      target="_blank"
                    >
                      {b.industrySlug} ↗
                    </Link>
                  </td>
                  <td className="p-3 text-right tabular-nums">{c.phone}</td>
                  <td className="p-3 text-right tabular-nums">{c.website}</td>
                  <td className="p-3 text-right tabular-nums">{c.inquiry}</td>
                  <td className="p-3 text-right font-semibold tabular-nums text-ink">
                    {c.total}
                  </td>
                  <td className="p-3 text-ink-soft">{fmtDate(c.last)}</td>
                  <td className="p-3 text-ink-soft">
                    {b.ownerEmail ? (
                      <a
                        href={`mailto:${b.ownerEmail}?subject=${encodeURIComponent(
                          `Hilton Ahead sent ${c.total} interaction${c.total === 1 ? '' : 's'} to ${b.name} this month`,
                        )}`}
                        className="hover:text-coral"
                      >
                        {b.ownerEmail}
                      </a>
                    ) : (
                      <span className="italic text-ink-soft/60">— add owner</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="mt-8 rounded-sm border border-ocean-deep/15 bg-sand-soft p-8 text-center text-[13px] text-ink-soft">
          No businesses match this filter.
        </div>
      )}
    </div>
  );
}
