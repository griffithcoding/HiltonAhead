# B5 Plan: Attribution Proof Email Cron

**Goal:** Send a monthly email to every active B2B directory subscriber showing
exactly how many phone clicks, website visits, and inquiry submissions their
listing generated in the last 30 days. This is the retention mechanism for
Workstream B — without it, subscribers have no reason to renew.

**Branch:** `feat/directory-billing-b5` (create from main)

---

## Files to create / modify

| File | Action |
|------|--------|
| `app/lib/email.ts` | Add `sendAttributionProofEmail()` |
| `app/api/cron/attribution-proof/route.ts` | New cron route |
| `vercel.json` | Add monthly schedule |

---

## Task 1 — `sendAttributionProofEmail()` in `app/lib/email.ts`

**Read first:** `app/lib/email.ts` (full file — match existing HTML style exactly)

**Action:** Append the following export after `sendClaimRequestAdminNotification`.

```typescript
export interface AttributionProofEmail {
  to: string;
  contactName?: string;
  businessName: string;
  businessSlug: string;
  tierSlug: 'listed' | 'featured' | 'signature';
  phoneClicks: number;
  websiteClicks: number;
  inquirySubmits: number;
  /** ISO date string for subscription renewal, or null for signature (manual) */
  renewalDate: string | null;
  windowDays: number; // 30
}

export async function sendAttributionProofEmail(opts: AttributionProofEmail) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hiltonahead.com';
  const total = opts.phoneClicks + opts.websiteClicks + opts.inquirySubmits;
  const month = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const tierLabel =
    opts.tierSlug === 'signature'
      ? 'Signature Partner'
      : opts.tierSlug === 'featured'
      ? 'Featured Listing'
      : 'Verified Listing';

  const subject =
    total > 0
      ? `Your Hilton Ahead listing: ${total} interaction${total === 1 ? '' : 's'} in the last ${opts.windowDays} days`
      : `Your Hilton Ahead listing — monthly report for ${month}`;

  const renewalLine = opts.renewalDate
    ? `<p style="font-size:12px;color:#9CA3AF;margin:20px 0 0;">
        Subscription renews ${new Date(opts.renewalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} — cancel any time before then at <a href="${siteUrl}/business/portal" style="color:#6B7280;">your portal</a>.
       </p>`
    : '';

  const zeroNote =
    total === 0
      ? `<p style="font-size:14px;line-height:1.7;color:#3D5860;margin:0 0 16px;">
          No interactions were recorded this period. This can happen when a listing is newly published or the directory is still building traffic. We'll keep your listing live and report again next month.
         </p>`
      : '';

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#F5E8D0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0A2930;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#C44A2B;font-weight:600;margin-bottom:14px;">
      ${esc(tierLabel)} · hiltonahead.com/local
    </div>

    <h1 style="font-family:Georgia,serif;font-size:30px;line-height:1.1;color:#0A2930;margin:0 0 8px 0;letter-spacing:-0.02em;">
      ${esc(opts.businessName)}
    </h1>
    <p style="font-size:14px;color:#6B7280;margin:0 0 28px;">
      Last ${opts.windowDays} days · ${month}
    </p>

    ${zeroNote}

    <!-- Stats row -->
    <table style="width:100%;border-collapse:separate;border-spacing:8px 0;margin-bottom:28px;">
      <tr>
        <td style="background:#FBF3E2;border:1px solid rgba(10,41,48,0.1);border-radius:8px;padding:16px 12px;text-align:center;width:33%;">
          <div style="font-family:Georgia,serif;font-size:34px;line-height:1;color:#0A2930;font-weight:normal;">${opts.phoneClicks}</div>
          <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6B7280;margin-top:6px;">Phone clicks</div>
        </td>
        <td style="background:#FBF3E2;border:1px solid rgba(10,41,48,0.1);border-radius:8px;padding:16px 12px;text-align:center;width:33%;">
          <div style="font-family:Georgia,serif;font-size:34px;line-height:1;color:#0A2930;font-weight:normal;">${opts.websiteClicks}</div>
          <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6B7280;margin-top:6px;">Website visits</div>
        </td>
        <td style="background:#FBF3E2;border:1px solid rgba(10,41,48,0.1);border-radius:8px;padding:16px 12px;text-align:center;width:33%;">
          <div style="font-family:Georgia,serif;font-size:34px;line-height:1;color:#0A2930;font-weight:normal;">${opts.inquirySubmits}</div>
          <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6B7280;margin-top:6px;">Inquiries</div>
        </td>
      </tr>
    </table>

    ${
      total > 0
        ? `<p style="font-size:15px;line-height:1.7;color:#3D5860;margin:0 0 24px;">
            That's <strong style="color:#0A2930;">${total} conversation${total === 1 ? '' : 's'}</strong> that started on your Hilton Ahead listing — travelers actively planning a Hilton Head trip who reached out to you directly.
           </p>`
        : ''
    }

    <div style="text-align:center;margin:28px 0;">
      <a href="${siteUrl}/business/portal"
         style="display:inline-block;background:#0A2930;color:#F5E8D0;padding:13px 26px;font-size:12px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;text-decoration:none;border-radius:999px;">
        View your portal →
      </a>
    </div>

    <hr style="border:0;border-top:1px solid rgba(10,41,48,0.15);margin:28px 0 20px;" />

    <p style="font-size:14px;line-height:1.7;color:#3D5860;margin:0 0 8px;">
      Reply to this email with any questions — it goes straight to William.
    </p>
    <p style="font-size:14px;color:#3D5860;margin:0;">
      — William Griffith<br/>
      <span style="font-size:12px;color:#6B7280;">Founder, Hilton Ahead Travel Co.</span>
    </p>

    ${renewalLine}

    <p style="font-size:11px;color:#9CA3AF;margin:24px 0 0;">
      You're receiving this because your business is listed on hiltonahead.com/local/${esc(opts.businessSlug)}.
    </p>
  </div>
</body>
</html>`;

  const text = [
    `${opts.businessName} — Hilton Ahead listing report`,
    `Last ${opts.windowDays} days · ${month}`,
    ``,
    `Phone clicks:   ${opts.phoneClicks}`,
    `Website visits: ${opts.websiteClicks}`,
    `Inquiries:      ${opts.inquirySubmits}`,
    `Total:          ${total}`,
    ``,
    total > 0
      ? `That's ${total} conversation${total === 1 ? '' : 's'} that started on your Hilton Ahead listing.`
      : `No interactions recorded this period — we'll report again next month.`,
    ``,
    `View your portal: ${siteUrl}/business/portal`,
    ``,
    `— William Griffith, Hilton Ahead Travel Co.`,
    opts.renewalDate
      ? `\nRenews ${new Date(opts.renewalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} — cancel any time at ${siteUrl}/business/portal`
      : '',
  ]
    .filter((l) => l !== null && l !== undefined)
    .join('\n');

  return sendEmail({
    to: opts.to,
    subject,
    html,
    text,
    replyTo: 'hiltonahead@gmail.com',
    tags: [
      { name: 'type', value: 'attribution_proof' },
      { name: 'tier', value: opts.tierSlug },
    ],
  });
}
```

**Acceptance criteria:**
- `app/lib/email.ts` exports `sendAttributionProofEmail`
- `sendAttributionProofEmail` is TypeScript-clean (`npm run typecheck` passes)
- HTML contains the three stat cells with `phoneClicks`, `websiteClicks`, `inquirySubmits`
- Subject line includes total interaction count when `total > 0`
- Subject falls back to plain month string when `total === 0`

---

## Task 2 — `app/api/cron/attribution-proof/route.ts`

**Read first:**
- `app/api/cron/sales-sequence-tick/route.ts` — auth pattern, export constants
- `utils/supabase/service.ts` — service client (needed: purchases has no-public-read RLS)
- `app/lib/email.ts` — `sendAttributionProofEmail` signature

**Action:** Create the file with this exact logic:

```typescript
/**
 * GET /api/cron/attribution-proof
 *
 * Sends a monthly attribution report to every active B2B directory subscriber
 * (Listed, Featured, Signature) showing phone clicks, website visits, and
 * inquiry submissions their listing generated in the last 30 days.
 *
 * Schedule (add to vercel.json):
 *   { "path": "/api/cron/attribution-proof", "schedule": "0 9 1 * *" }
 *   = 1st of each month at 9:00 UTC (5:00 AM ET)
 *
 * Auth: Bearer CRON_SECRET (same as sales-sequence-tick)
 *
 * Manual admin trigger (preview mode — sends only to RESEND_TO_EMAIL):
 *   GET /api/cron/attribution-proof?preview=true
 *
 * Manual single-business trigger:
 *   GET /api/cron/attribution-proof?slug=charlies-l-etoile-verte
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';
import { sendAttributionProofEmail } from '@/app/lib/email';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const runtime = 'nodejs';

const WINDOW_DAYS = 30;
const B2B_TIER_SLUGS = ['listed', 'featured', 'signature'] as const;
type B2BTier = (typeof B2B_TIER_SLUGS)[number];
const TIER_RANK: Record<B2BTier, number> = { signature: 0, featured: 1, listed: 2 };

function isAuthorized(req: NextRequest, secret: string): boolean {
  const auth = req.headers.get('authorization') || '';
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: 'CRON_SECRET not configured.' },
      { status: 503 },
    );
  }
  if (!isAuthorized(req, secret)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const url = new URL(req.url);
  const preview = url.searchParams.get('preview') === 'true';
  const slugFilter = url.searchParams.get('slug') ?? null;

  const supabase = createServiceClient();
  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();

  // 1. Fetch all active B2B paid subscribers.
  const { data: rawPurchases, error: purchaseErr } = await supabase
    .from('purchases')
    .select('customer_email, customer_name, tier_slug, tier_audience, business_id, current_period_end')
    .in('tier_slug', [...B2B_TIER_SLUGS])
    .eq('tier_audience', 'b2b')
    .eq('status', 'paid');

  if (purchaseErr) {
    console.error('[attribution-proof] purchases query error:', purchaseErr.message);
    return NextResponse.json({ ok: false, error: purchaseErr.message }, { status: 500 });
  }

  // 2. Deduplicate by email — keep highest tier per subscriber.
  const byEmail = new Map<
    string,
    {
      email: string;
      name: string | null;
      tier: B2BTier;
      businessId: string | null;
      renewalDate: string | null;
    }
  >();

  for (const p of rawPurchases ?? []) {
    if (!B2B_TIER_SLUGS.includes(p.tier_slug as B2BTier)) continue;
    const key = p.customer_email.toLowerCase();
    const existing = byEmail.get(key);
    const rank = TIER_RANK[p.tier_slug as B2BTier];
    if (!existing || rank < TIER_RANK[existing.tier]) {
      byEmail.set(key, {
        email: p.customer_email,
        name: p.customer_name ?? null,
        tier: p.tier_slug as B2BTier,
        businessId: p.business_id ?? null,
        renewalDate: p.current_period_end ?? null,
      });
    }
  }

  const subscribers = Array.from(byEmail.values());

  // 3. Process each subscriber.
  const results = { sent: 0, skipped: 0, errors: [] as string[] };

  for (const sub of subscribers) {
    try {
      // 3a. Resolve businesses.slug (the key for directory_events lookup).
      let businessSlug: string | null = null;
      let businessName: string | null = null;

      if (sub.businessId) {
        const { data: biz } = await supabase
          .from('businesses')
          .select('slug, name')
          .eq('id', sub.businessId)
          .maybeSingle();
        if (biz) { businessSlug = biz.slug; businessName = biz.name; }
      }

      if (!businessSlug) {
        // Fallback: match by owner_email.
        const { data: biz } = await supabase
          .from('businesses')
          .select('slug, name')
          .ilike('owner_email', sub.email)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (biz) { businessSlug = biz.slug; businessName = biz.name; }
      }

      if (!businessSlug) {
        console.warn(`[attribution-proof] no business found for subscriber: ${sub.email}`);
        results.skipped++;
        continue;
      }

      // 3b. Slug filter for manual single-business trigger.
      if (slugFilter && businessSlug !== slugFilter) continue;

      // 3c. Aggregate directory_events for the last 30 days.
      const { data: events } = await supabase
        .from('directory_events')
        .select('event_type')
        .eq('business_id', businessSlug)
        .gte('created_at', since);

      const evts = events ?? [];
      const phoneClicks = evts.filter((e) => e.event_type === 'phone_click').length;
      const websiteClicks = evts.filter((e) => e.event_type === 'website_click').length;
      const inquirySubmits = evts.filter((e) => e.event_type === 'inquiry_submit').length;

      // 3d. Send.
      const sendTo = preview
        ? (process.env.RESEND_TO_EMAIL ?? 'hiltonahead@gmail.com')
        : sub.email;

      const result = await sendAttributionProofEmail({
        to: sendTo,
        contactName: sub.name ?? undefined,
        businessName: businessName ?? businessSlug,
        businessSlug,
        tierSlug: sub.tier,
        phoneClicks,
        websiteClicks,
        inquirySubmits,
        renewalDate: sub.renewalDate,
        windowDays: WINDOW_DAYS,
      });

      if (result.ok) {
        results.sent++;
      } else if ('skipped' in result && result.skipped) {
        results.skipped++;
      } else {
        results.errors.push(`${sub.email}: ${'error' in result ? result.error : 'unknown'}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      console.error(`[attribution-proof] error for ${sub.email}:`, msg);
      results.errors.push(`${sub.email}: ${msg}`);
    }
  }

  console.log(
    `[attribution-proof] done — sent:${results.sent} skipped:${results.skipped} errors:${results.errors.length}`,
  );

  return NextResponse.json({
    ok: true,
    preview,
    windowDays: WINDOW_DAYS,
    subscribersProcessed: subscribers.length,
    ...results,
  });
}
```

**Acceptance criteria:**
- File exists at `app/api/cron/attribution-proof/route.ts`
- `npm run typecheck` passes
- Missing `CRON_SECRET` returns 503
- Wrong token returns 401
- `?preview=true` routes email to `RESEND_TO_EMAIL` not subscriber
- `?slug=<slug>` filters to one business only
- Each subscriber gets exactly one email (deduplication by email, highest tier wins)
- Route returns JSON `{ ok, sent, skipped, errors, subscribersProcessed }`

---

## Task 3 — `vercel.json` cron schedule

**Read first:** `vercel.json`

**Action:** Add the attribution-proof cron to the existing `crons` array:

```json
{
  "crons": [
    {
      "path": "/api/cron/newsletter-draft",
      "schedule": "0 13 * * 0"
    },
    {
      "path": "/api/cron/attribution-proof",
      "schedule": "0 9 1 * *"
    }
  ]
}
```

Schedule `"0 9 1 * *"` = 9:00 UTC on the 1st of every month (5:00 AM ET).

**Acceptance criteria:**
- `vercel.json` contains `"/api/cron/attribution-proof"` with schedule `"0 9 1 * *"`
- Existing `newsletter-draft` entry is unchanged
- Valid JSON (no trailing commas)

---

## Verification

Run after all three tasks:

```bash
npm run typecheck   # must exit 0
npm run lint        # must exit 0
```

Manual smoke test (requires CRON_SECRET in .env.local):
```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  "http://localhost:3000/api/cron/attribution-proof?preview=true"
# Expected: { ok: true, preview: true, sent: N, skipped: K, errors: [] }
```

---

## Edge cases handled

| Case | Behavior |
|------|----------|
| `RESEND_API_KEY` not set | `sendEmail` no-ops, result has `skipped: true`, route counts as skipped |
| `CRON_SECRET` not set | 503 — deploy misconfiguration is loud |
| Subscriber has no matching business in DB | Logs warning, `skipped++`, continues |
| Business in DB but no directory_events | All counts are 0, email still sends ("no interactions this period") |
| Multiple paid purchases for same email | Deduplication keeps highest tier (signature > featured > listed) |
| `?slug=` filter returns no matches | Sends nothing, `{ sent: 0, skipped: 0 }` |
