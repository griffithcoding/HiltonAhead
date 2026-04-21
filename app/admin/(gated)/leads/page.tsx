import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

type UnifiedLead = {
  id: string;
  type: 'itinerary' | 'newsletter' | 'lead';
  email: string;
  name: string | null;
  status: string | null;
  created_at: string;
  summary: string | null;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const mo = d.toLocaleString('en-US', { month: 'short' });
  return `${mo} ${d.getDate()}`;
}

export default async function AdminLeadsList({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; status?: string }>;
}) {
  const { q, type, status } = await searchParams;
  const supabase = await createClient();

  const [itRes, nlRes, lRes] = await Promise.all([
    supabase
      .from('itinerary_requests')
      .select('id, email, full_name, status, party_size, start_date, end_date, budget, created_at')
      .order('created_at', { ascending: false })
      .limit(300),
    supabase
      .from('newsletter_subscribers')
      .select('id, email, full_name, source, created_at')
      .order('created_at', { ascending: false })
      .limit(300),
    supabase
      .from('leads')
      .select('id, email, full_name, status, source, message, created_at')
      .order('created_at', { ascending: false })
      .limit(300),
  ]);

  const combined: UnifiedLead[] = [
    ...(itRes.data ?? []).map(
      (r): UnifiedLead => ({
        id: r.id,
        type: 'itinerary',
        email: r.email,
        name: r.full_name,
        status: r.status,
        created_at: r.created_at,
        summary: [
          r.party_size ? `Party of ${r.party_size}` : null,
          r.start_date && r.end_date ? `${r.start_date} → ${r.end_date}` : null,
          r.budget,
        ]
          .filter(Boolean)
          .join(' · ') || null,
      }),
    ),
    ...(nlRes.data ?? []).map(
      (r): UnifiedLead => ({
        id: r.id,
        type: 'newsletter',
        email: r.email,
        name: r.full_name,
        status: null,
        created_at: r.created_at,
        summary: r.source ? `via ${r.source}` : null,
      }),
    ),
    ...(lRes.data ?? []).map(
      (r): UnifiedLead => ({
        id: r.id,
        type: 'lead',
        email: r.email,
        name: r.full_name,
        status: r.status,
        created_at: r.created_at,
        summary: r.message?.slice(0, 80) || (r.source ? `via ${r.source}` : null),
      }),
    ),
  ];

  // Filters (client-side over the fetched 900 max rows — fine for this volume).
  const filtered = combined
    .filter((r) => (type ? r.type === type : true))
    .filter((r) => (status ? (r.status || '').toLowerCase() === status.toLowerCase() : true))
    .filter((r) => {
      if (!q) return true;
      const needle = q.toLowerCase();
      return (
        r.email.toLowerCase().includes(needle) ||
        (r.name || '').toLowerCase().includes(needle) ||
        (r.summary || '').toLowerCase().includes(needle)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="flex items-end justify-between">
        <div>
          <div className="eyebrow eyebrow-coral">All contacts</div>
          <h1 className="display mt-3 text-[38px] leading-[1.05] tracking-[-0.02em] text-ink md:text-[48px]">
            Leads{' '}
            <span className="display-italic text-coral">
              ({filtered.length.toLocaleString()})
            </span>
          </h1>
        </div>
      </div>

      {/* ——— Filters ——— */}
      <form className="mt-8 flex flex-wrap gap-3 text-[13px]">
        <input
          type="search"
          name="q"
          defaultValue={q || ''}
          placeholder="Search email, name, summary…"
          className="w-full max-w-[380px] border-b border-ocean-deep/30 bg-transparent px-1 py-2 text-ink placeholder:text-ink-soft/60 focus:border-coral focus:outline-none"
        />
        <select
          name="type"
          defaultValue={type || ''}
          className="border-b border-ocean-deep/30 bg-transparent px-1 py-2 text-ink focus:border-coral focus:outline-none"
        >
          <option value="">All types</option>
          <option value="itinerary">Itinerary</option>
          <option value="newsletter">Newsletter</option>
          <option value="lead">Contact form</option>
        </select>
        <select
          name="status"
          defaultValue={status || ''}
          className="border-b border-ocean-deep/30 bg-transparent px-1 py-2 text-ink focus:border-coral focus:outline-none"
        >
          <option value="">Any status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="quoted">Quoted</option>
          <option value="booked">Booked</option>
          <option value="converted">Converted</option>
          <option value="archived">Archived</option>
          <option value="lost">Lost</option>
        </select>
        <button
          type="submit"
          className="rounded-full border border-ink bg-ink px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-sand hover:bg-coral hover:border-coral"
        >
          Apply
        </button>
      </form>

      {/* ——— Table ——— */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-12 text-center text-[14px] text-ink-soft">
          No leads match these filters yet.
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-sm ring-1 ring-ocean-deep/10">
          <table className="w-full border-collapse text-[13px]">
            <thead className="bg-sand-deep/40 text-left text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Summary</th>
              </tr>
            </thead>
            <tbody className="[&_tr]:border-t [&_tr]:border-ocean-deep/10 [&_tr:hover]:bg-sand-soft">
              {filtered.map((r) => (
                <tr key={`${r.type}-${r.id}`}>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-soft">
                    {formatDate(r.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${r.type}/${r.id}`}
                      className="block"
                    >
                      <div className="font-semibold text-ink hover:text-coral">
                        {r.name || '—'}
                      </div>
                      <div className="mt-0.5 text-[11px] text-ink-soft">
                        {r.email}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                    {r.type}
                  </td>
                  <td className="px-4 py-3">
                    {r.status ? (
                      <StatusPill status={r.status} />
                    ) : (
                      <span className="text-[11px] text-ink-soft/60">—</span>
                    )}
                  </td>
                  <td className="max-w-[320px] truncate px-4 py-3 text-ink-soft">
                    {r.summary || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const s = status.toLowerCase();
  const tone =
    s === 'new'
      ? 'bg-coral/15 text-coral-deep'
      : s === 'contacted'
        ? 'bg-ocean/15 text-ocean-deep'
        : s === 'qualified' || s === 'quoted'
          ? 'bg-gold/15 text-gold-deep'
          : s === 'booked' || s === 'converted'
            ? 'bg-palm/15 text-palm'
            : 'bg-ocean-deep/10 text-ink-soft';
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${tone}`}
    >
      {s}
    </span>
  );
}
