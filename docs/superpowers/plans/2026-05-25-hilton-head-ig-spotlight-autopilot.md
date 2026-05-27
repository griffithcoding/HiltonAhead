# Instagram Spotlight Autopilot — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a weekly Instagram-spotlight content engine: Monday cron generates 5 branded draft posts for unspotlighted businesses, drafts land in an admin approval queue, admin posts to IG manually, and a single bio-link redirect (`/go/ig`) stamps per-post UTM campaigns so directory clicks + Stripe purchases attribute back to the spotlight that drove them.

**Architecture:** Server-only cron writes to a new `social_posts` table (migration 022 already deployed). Generator uses Claude via existing `@anthropic-ai/sdk` for captions, Sharp for branded PNG overlays composited onto curated `data/photos.ts` images, and Supabase Storage for the resulting CDN-hosted PNG. Admin UI lives under the existing `(gated)` route group with `requireAdmin()` on every server action. Attribution piggybacks on the existing `directory_events` and `purchases` tables via two additive `utm_campaign` columns (migration 023).

**Tech Stack:** Next.js 16 (App Router, server actions) · React 19 · TypeScript (strict) · Tailwind 4 · `@anthropic-ai/sdk ^0.97.1` (existing) · `sharp` (existing peer) · `@supabase/ssr` (existing) · Stripe (existing) · Resend (existing) · Playwright (existing).

**Spec:** [docs/superpowers/specs/2026-05-25-hilton-head-ig-spotlight-autopilot-design.md](../specs/2026-05-25-hilton-head-ig-spotlight-autopilot-design.md)

**Testing reality:** Per `CLAUDE.md`, Playwright is the only automated test surface. Library code is verified via `?preview=true` cron dry-run and a dev seed script. Manual SQL spot-checks listed at end.

**Branch:** `feat/social-ig-autopilot` — branch off current `main` (post site-search merge). Per `CLAUDE.md`, no worktrees, 1–2 active branches max.

**Commit cadence:** Atomic per task. Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`). Do NOT commit unless the task explicitly says to.

**Decision defaults locked in this plan (not re-litigated during execution):**

| Subject | Default |
|---|---|
| Caption format | 1–2 short paragraphs, 800-char hard cap, 8–12 hashtags returned as separate JSON field |
| Hashtag set | 5 always-on (`#HiltonHead #HiltonHeadIsland #HiltonAhead #LowcountryLife #SCTravel`) + 3–5 industry-specific from static map + 2–3 dynamic from caption |
| Rotation algorithm | Sort eligible businesses by `last_spotlighted_at ASC NULLS FIRST`, pick top N. Never-spotlighted first, then staleness-ordered. Deterministic. |
| Slot selection | 5 drafts/week, Tue–Sat at 10:00 ET (14:00 UTC EST / 15:00 UTC EDT). Slot 1 = Tue, Slot 2 = Wed, etc. Stored as UTC. |
| Cooldown | 12 weeks min between spotlights of same business |
| Overlay template manifest | JSON sidecar at `public/social-templates/<name>.json` with `{logo,caption,businessName}` box coords + font sizes |
| Regen cap | `regen_count <= 3` per draft |
| LLM cost cap | `SOCIAL_GENERATE_MAX_USD` env, default `2.00` |
| Bio-link path | `/go/ig` (preferred per spec §12.1) |
| Cron schedule | `0 13 * * 1` (Mon 13:00 UTC) |

---

## File Structure

### New files (~30)

| Path | Responsibility |
|---|---|
| `supabase/migrations/023_social_attribution_columns.sql` | Adds `utm_campaign` cols + partial indexes to `directory_events` + `purchases` |
| `app/lib/social/types.ts` | All shared TS types: `SocialPost`, `SocialStatus`, `DraftInput`, `RotationPick`, `OverlayTemplate`, `OverlayManifest` |
| `app/lib/social/rotation.ts` | `pickNextN(n)` — staleness-ordered eligible-business picker |
| `app/lib/social/hashtags.ts` | `buildHashtagsFor(business, dynamic)` — static + per-industry + dynamic |
| `app/lib/social/caption.ts` | `generateCaption(business)` — Claude call + template fallback + spend tracking |
| `app/lib/social/storage.ts` | `uploadOverlay(buf, postId)` — Supabase Storage put + URL builder |
| `app/lib/social/overlay.ts` | `composeOverlay(business, photo, templateName)` — Sharp PNG builder |
| `app/lib/social/bioLink.ts` | `resolveCurrentFeatured()` — picks today's spotlight for `/go/ig` |
| `app/api/cron/social-generate/route.ts` | Mon cron, Bearer-gated, `?preview=true` supported |
| `app/go/ig/route.ts` | Public 302 redirect with stamped UTM |
| `app/admin/(gated)/social/page.tsx` | Queue list view |
| `app/admin/(gated)/social/[id]/page.tsx` | Single-draft editor |
| `app/admin/(gated)/social/actions.ts` | Server actions: approve, edit, reject, regenerate, mark-published, reschedule |
| `app/admin/(gated)/social/attribution/page.tsx` | Joined performance view |
| `components/admin/social/DraftCard.tsx` | Card UI for one draft |
| `components/admin/social/OverlayPreview.tsx` | Image preview pane |
| `components/admin/social/RotationBadge.tsx` | "Last spotlighted N weeks ago" pill |
| `components/admin/social/MarkPostedModal.tsx` | IG URL paste modal + regex validation |
| `public/social-templates/spotlight-v1.png` | Base overlay template (1080×1080) |
| `public/social-templates/spotlight-v1.json` | Template manifest (box coords + font sizes) |
| `public/social-templates/spotlight-v2.png` | Alternate template — caption-heavy variant |
| `public/social-templates/spotlight-v2.json` | Manifest for v2 |
| `public/social-templates/spotlight-v3.png` | Alternate — photo-heavy variant |
| `public/social-templates/spotlight-v3.json` | Manifest for v3 |
| `scripts/seed-social-drafts.ts` | Dev convenience — insert 5 mock drafts |
| `tests/admin-social.spec.ts` | Playwright admin-queue flow tests |
| `tests/social-bio-link.spec.ts` | Playwright bio-link redirect test |

### Modified (8)

| Path | Change |
|---|---|
| `app/lib/email.ts` | Add `notifyAdminSocialQueue({success,failed})` |
| `app/lib/directoryTracking.ts` | Extend `trackDirectoryEvent` signature to accept optional `utmCampaign`; read from `window.location` |
| `app/api/directory/track/route.ts` | Accept + persist `utmCampaign` in payload |
| `app/api/checkout/route.ts` | Read `utm_campaign` from request, attach to Stripe session `metadata` |
| `app/api/stripe/webhook/route.ts` | Read `utm_campaign` from session metadata, persist into `purchases.utm_campaign` |
| `vercel.json` | Add `/api/cron/social-generate` cron entry on `0 13 * * 1` |
| `data/brand.ts` | Set `social.instagram` to real handle (was empty) |
| `.env.example` (if exists) or `README.md` env section | Document `SOCIAL_GENERATE_MAX_USD` |

### Already deployed (no task)

- `supabase/migrations/022_social_posts.sql` — ran in Supabase SQL editor 2026-05-25; file already in repo

---

## Task 1: Branch + dep verification

**Files:**
- Modify: none (branch only)

- [ ] **Step 1: Confirm clean tree + create branch**

```bash
git status
git checkout main
git pull
git checkout -b feat/social-ig-autopilot
git branch --show-current
```

Expected: `feat/social-ig-autopilot` is current, no staged/unstaged changes.

- [ ] **Step 2: Verify required deps already installed**

```bash
node -e "console.log(require('./package.json').dependencies['@anthropic-ai/sdk'])"
node -e "console.log(require('./package.json').dependencies['sharp'] || require('./package.json').devDependencies['sharp'] || 'check peer')"
```

Expected: `@anthropic-ai/sdk` shows `^0.97.1` (or higher); `sharp` may be `check peer` (Next.js peer dependency, already pulled transitively).

- [ ] **Step 3: Confirm Sharp is importable**

```bash
node -e "const s = require('sharp'); console.log('sharp version:', s.versions.vips)"
```

Expected: prints a vips version (e.g. `8.x.x`). If it errors with `Cannot find module 'sharp'`, install: `npm install sharp`.

- [ ] **Step 4: Verify Supabase service-role env present**

```bash
node -e "console.log('service role set:', Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY))" 
```

If false, source `.env.local` first: `set -a && source .env.local && set +a` (bash) or check in PowerShell with `$env:SUPABASE_SERVICE_ROLE_KEY`. Required for cron + storage upload.

- [ ] **Step 5: Confirm typecheck passes from clean main**

```bash
npm run typecheck
```

Expected: no errors. (Baseline before any changes.)

- [ ] **Step 6: No commit yet** — branch is bare, nothing to commit.

---

## Task 2: Migration 023 — attribution columns

**Files:**
- Create: `supabase/migrations/023_social_attribution_columns.sql`

- [ ] **Step 1: Write the migration file**

```sql
-- 023_social_attribution_columns.sql
-- Additive: per-row UTM campaign attribution from IG bio link
-- → directory_events + purchases. Backward compatible (nullable, no defaults).
-- Paired with the social autopilot Phase 1 in migration 022.

alter table public.directory_events
  add column if not exists utm_campaign text;

alter table public.purchases
  add column if not exists utm_campaign text;

create index if not exists directory_events_utm_idx
  on public.directory_events (utm_campaign)
  where utm_campaign is not null;

create index if not exists purchases_utm_idx
  on public.purchases (utm_campaign)
  where utm_campaign is not null;
```

- [ ] **Step 2: Apply migration in Supabase SQL editor**

Open Supabase dashboard → SQL editor → paste the file contents → Run. Expected: "Success. No rows returned." If the columns already exist (unlikely), `if not exists` makes it idempotent.

- [ ] **Step 3: Verify columns exist**

In Supabase SQL editor:

```sql
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in ('directory_events','purchases')
  and column_name = 'utm_campaign';
```

Expected: 2 rows, both `text`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/023_social_attribution_columns.sql
git commit -m "feat(social): migration 023 — utm_campaign cols on directory_events + purchases"
```

---

## Task 3: Supabase Storage bucket setup

**Files:**
- None (one-time Supabase config)

- [ ] **Step 1: Create the bucket**

In Supabase dashboard → Storage → New bucket:
- Name: `social-overlays`
- Public bucket: **Yes** (read public, writes restricted via service role)
- File size limit: 5 MB
- Allowed MIME types: `image/png`

- [ ] **Step 2: Verify upload via SQL (service role)**

In Supabase SQL editor:

```sql
select id, name, public from storage.buckets where id = 'social-overlays';
```

Expected: 1 row, `public = true`.

- [ ] **Step 3: Verify anon read policy**

Default new-bucket policy in Supabase: when "Public bucket" is checked, public select is granted. Confirm by visiting `https://<project-ref>.supabase.co/storage/v1/object/public/social-overlays/` in a browser — should return a 200 with an empty object listing (or 400 with a recognizable error, not 403).

- [ ] **Step 4: No commit** — bucket lives in Supabase config, not the repo.

---

## Task 4: `app/lib/social/types.ts`

**Files:**
- Create: `app/lib/social/types.ts`

- [ ] **Step 1: Write the file**

```ts
/**
 * Shared types for the social autopilot system.
 *
 * Mirrors the public.social_posts and public.social_rotations rows in
 * Supabase (see migrations 022 + 023). Keep in sync if columns change.
 */

import type { IndustrySlug } from '@/data/localBusinesses';

export type SocialStatus =
  | 'draft'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'skipped';

export type SocialPlatform = 'instagram';

export type SocialPost = {
  id: string;
  business_slug: string;
  industry_slug: IndustrySlug;
  platform: SocialPlatform;
  caption: string;
  hashtags: string[];
  image_path: string | null;
  image_url: string | null;
  overlay_template: string;
  status: SocialStatus;
  scheduled_at: string;        // ISO timestamp
  published_at: string | null;
  ig_permalink: string | null;
  utm_campaign: string;
  created_by_ai: boolean;
  generated_by_model: string | null;
  generation_cost_usd: number | null;
  regen_count: number;
  reviewed_by: string | null;
  reviewed_at: string | null;
  edit_notes: string | null;
  created_at: string;
};

export type SocialRotation = {
  business_slug: string;
  last_spotlighted_at: string; // ISO timestamp
  spotlight_count: number;
  updated_at: string;
};

/** Result of one rotation pick, before any LLM/Sharp work happens. */
export type RotationPick = {
  business_slug: string;
  industry_slug: IndustrySlug;
  weeks_since_last: number | null; // null if never spotlighted
};

/** Output of caption generation, fed into the DB insert. */
export type DraftCaption = {
  caption: string;
  hashtags: string[];
  generated_by_model: string;
  generation_cost_usd: number;
  used_fallback: boolean;       // true if LLM was content-blocked
};

/** Manifest sidecar for an overlay template PNG. All values in pixels. */
export type OverlayManifest = {
  template_name: string;        // matches the .png stem
  width: number;                // canvas width (typically 1080)
  height: number;               // canvas height (typically 1080)
  photo: { x: number; y: number; w: number; h: number };
  logo: { x: number; y: number; w: number; h: number };
  business_name: {
    x: number; y: number; w: number; h: number;
    font_px: number;
    color: string;              // hex, e.g. '#FFFFFF'
    align?: 'left' | 'center' | 'right';
  };
  caption_strip?: {
    x: number; y: number; w: number; h: number;
    font_px: number;
    color: string;
    max_chars: number;          // truncate caption to fit
  };
};

export const SOCIAL_GENERATE_MAX_USD_DEFAULT = 2.0;
export const REGEN_CAP = 3;
export const ROTATION_COOLDOWN_WEEKS = 12;
export const DRAFTS_PER_WEEK = 5;
export const SCHEDULE_SLOT_DAYS = [2, 3, 4, 5, 6] as const; // Tue–Sat (Date.getUTCDay)
export const SCHEDULE_SLOT_HOUR_UTC = 14;                   // 10:00 ET in EST
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors. If `IndustrySlug` import path is wrong, open `data/localBusinesses.ts` and find the `export type IndustrySlug = ...` line; adjust path accordingly.

- [ ] **Step 3: Commit**

```bash
git add app/lib/social/types.ts
git commit -m "feat(social): add shared types for autopilot"
```

---

## Task 5: `app/lib/social/rotation.ts`

**Files:**
- Create: `app/lib/social/rotation.ts`

- [ ] **Step 1: Write the file**

```ts
/**
 * Rotation picker for weekly spotlights.
 *
 * Algorithm: stale-first. Eligible = any business in data/localBusinesses.ts
 * whose social_rotations.last_spotlighted_at is either null OR older than
 * ROTATION_COOLDOWN_WEEKS. Sorted by last_spotlighted_at ASC NULLS FIRST,
 * then by stable business_slug for determinism. Top N picked.
 *
 * Also validates that each picked slug actually resolves to a /local/[industry]/[slug]
 * route — businesses that have been removed from the registry are dropped.
 */

import { createServiceClient } from '@/utils/supabase/service';
import { allBusinesses } from '@/data/localBusinesses';
import {
  DRAFTS_PER_WEEK,
  ROTATION_COOLDOWN_WEEKS,
  type RotationPick,
} from './types';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function pickNextN(n: number = DRAFTS_PER_WEEK): Promise<RotationPick[]> {
  const supabase = createServiceClient();

  // 1. Pull current rotation state for all known slugs in one query
  const { data: rotationRows, error } = await supabase
    .from('social_rotations')
    .select('business_slug, last_spotlighted_at');

  if (error) {
    throw new Error(`rotation: failed to read social_rotations: ${error.message}`);
  }

  const lastByBiz = new Map<string, string>();
  for (const r of rotationRows ?? []) {
    if (r.business_slug && r.last_spotlighted_at) {
      lastByBiz.set(r.business_slug, r.last_spotlighted_at);
    }
  }

  const cutoff = Date.now() - ROTATION_COOLDOWN_WEEKS * WEEK_MS;

  // 2. Filter eligible + score by weeks-since-last (null = infinity)
  const eligible: Array<RotationPick & { _sortKey: number }> = [];
  for (const biz of allBusinesses) {
    if (!biz.slug || !biz.industrySlug) continue;
    const lastIso = lastByBiz.get(biz.slug);
    const lastMs = lastIso ? new Date(lastIso).getTime() : null;
    if (lastMs !== null && lastMs > cutoff) continue; // still cooling down

    const weeksSince = lastMs === null
      ? null
      : Math.floor((Date.now() - lastMs) / WEEK_MS);

    eligible.push({
      business_slug: biz.slug,
      industry_slug: biz.industrySlug,
      weeks_since_last: weeksSince,
      _sortKey: lastMs === null ? -Infinity : lastMs, // nulls first
    });
  }

  // 3. Sort stable: oldest (or never) first, then slug A→Z for determinism
  eligible.sort((a, b) => {
    if (a._sortKey !== b._sortKey) return a._sortKey - b._sortKey;
    return a.business_slug.localeCompare(b.business_slug);
  });

  return eligible.slice(0, n).map(({ _sortKey, ...rest }) => rest);
}

/**
 * After a successful draft creation, advance the rotation for one business.
 * Idempotent via upsert on business_slug primary key.
 */
export async function markSpotlighted(business_slug: string): Promise<void> {
  const supabase = createServiceClient();
  const now = new Date().toISOString();

  // Read current count
  const { data: existing } = await supabase
    .from('social_rotations')
    .select('spotlight_count')
    .eq('business_slug', business_slug)
    .maybeSingle();

  const newCount = (existing?.spotlight_count ?? 0) + 1;

  const { error } = await supabase
    .from('social_rotations')
    .upsert({
      business_slug,
      last_spotlighted_at: now,
      spotlight_count: newCount,
      updated_at: now,
    });

  if (error) {
    throw new Error(`rotation: failed to mark spotlighted: ${error.message}`);
  }
}

/**
 * Reverse a rotation entry after a draft is rejected. Restores previous
 * last_spotlighted_at value if known, otherwise removes the row entirely
 * so the business re-enters the eligible pool.
 */
export async function rollbackSpotlight(business_slug: string): Promise<void> {
  const supabase = createServiceClient();
  // Simplest correct behavior: delete the rotation row. Next pick will treat
  // this business as never-spotlighted. Spotlight_count history is lost,
  // which is acceptable for v1.
  const { error } = await supabase
    .from('social_rotations')
    .delete()
    .eq('business_slug', business_slug);

  if (error) {
    throw new Error(`rotation: failed to rollback: ${error.message}`);
  }
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors. If `allBusinesses` import shape is wrong, open `data/localBusinesses.ts` to confirm exported name + shape (`slug`, `industrySlug` properties on each business).

- [ ] **Step 3: Commit**

```bash
git add app/lib/social/rotation.ts
git commit -m "feat(social): rotation picker + mark/rollback helpers"
```

---

## Task 6: `app/lib/social/hashtags.ts`

**Files:**
- Create: `app/lib/social/hashtags.ts`

- [ ] **Step 1: Write the file**

```ts
/**
 * Hashtag builder for spotlight posts.
 *
 * 5 always-on (brand + location) + 3–5 industry-specific from a static map
 * + 2–3 dynamic tags supplied by the caption generator (optional).
 *
 * Total target: 10–13 tags. Instagram caps at 30; we stay well under to avoid
 * looking spammy.
 */

import type { IndustrySlug } from '@/data/localBusinesses';

const ALWAYS_ON = [
  '#HiltonHead',
  '#HiltonHeadIsland',
  '#HiltonAhead',
  '#LowcountryLife',
  '#SCTravel',
];

const INDUSTRY_TAGS: Record<IndustrySlug, string[]> = {
  restaurants: ['#HiltonHeadEats', '#LowcountryFood', '#FoodieFinds', '#SouthernFood'],
  golf: ['#HiltonHeadGolf', '#GolfTravel', '#HeritageGolf', '#GolfLife'],
  'water-activities': ['#HiltonHeadBeach', '#KayakLife', '#OceanLife', '#BeachVibes'],
  weddings: ['#HiltonHeadWedding', '#LowcountryWedding', '#BeachWedding', '#DestinationWedding'],
  'spas-wellness': ['#HiltonHeadSpa', '#WellnessTravel', '#SelfCare', '#SpaDay'],
  'vacation-rentals': ['#HiltonHeadRentals', '#BeachHouse', '#VacationRental', '#IslandLife'],
  shopping: ['#HiltonHeadShopping', '#ShopLocal', '#BoutiqueShopping'],
  'family-activities': ['#FamilyTravel', '#HiltonHeadFamily', '#KidFriendly'],
  pizza: ['#PizzaLovers', '#LocalPizza', '#HiltonHeadEats'],
  transportation: ['#HiltonHeadTravel', '#GoldenIsleTransport'],
  'home-services': ['#HiltonHeadHomes', '#LowcountryLiving'],
  'fishing-charters': ['#HiltonHeadFishing', '#OffshoreFishing', '#InshoreFishing'],
  'dolphin-tours': ['#DolphinWatching', '#HiltonHeadTours', '#OceanAdventures'],
};

export function buildHashtagsFor(
  industry: IndustrySlug,
  dynamicTags: string[] = [],
): string[] {
  const industryTags = INDUSTRY_TAGS[industry] ?? [];
  const dynamic = dynamicTags
    .filter((t) => /^#[\w]{2,30}$/.test(t)) // shape guard
    .slice(0, 3);

  // Dedup + preserve order: always-on → industry → dynamic
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of [...ALWAYS_ON, ...industryTags, ...dynamic]) {
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors. If `INDUSTRY_TAGS` complains about missing keys, open `data/localBusinesses.ts`, copy the full `IndustrySlug` union, and add an entry for every member.

- [ ] **Step 3: Commit**

```bash
git add app/lib/social/hashtags.ts
git commit -m "feat(social): static + per-industry hashtag builder"
```

---

## Task 7: `app/lib/social/caption.ts`

**Files:**
- Create: `app/lib/social/caption.ts`

- [ ] **Step 1: Write the file**

```ts
/**
 * Caption generator for spotlight posts.
 *
 * Calls Claude (Sonnet) with a tight system prompt + structured business
 * data. Returns caption + 2–3 dynamic hashtag suggestions + cost.
 *
 * Failure modes:
 *   - 429 rate limit  → exponential backoff (max 3 retries), then throw
 *   - content blocked → template-only fallback (no LLM), used_fallback=true
 *   - timeout >30s    → abort + throw
 *
 * Inputs piped into the prompt are escaped + length-capped (prompt-injection
 * guard).
 */

import Anthropic from '@anthropic-ai/sdk';
import type { Business } from '@/data/localBusinesses';
import type { DraftCaption } from './types';

const MODEL = 'claude-sonnet-4-5-20250929'; // verify against current alias at deploy

// Pricing as of 2026-05 — keep in sync via env if tuning needed.
const INPUT_PRICE_PER_MTOK = 3.0;
const OUTPUT_PRICE_PER_MTOK = 15.0;

const SYSTEM_PROMPT = `You write short Instagram captions for HiltonAhead.com, a Hilton Head Island travel concierge.

Each post spotlights ONE local business. The caption should:
- Open with a hooky 1-line lead (no emoji at the very start)
- 1–2 short paragraphs total, max 800 characters
- Mention the business by name in the first line
- Capture ONE specific reason a visitor would care (a signature dish, a view, a vibe — not a generic puff)
- End with a soft CTA: "Full profile in our bio."
- Voice: warm, local, specific. Never "discover," "nestled," "hidden gem," "your perfect getaway."
- No emojis other than at most ONE near the end if it lands naturally
- Do not include hashtags in the caption text

Return strict JSON with this shape:
{"caption": "...", "dynamic_tags": ["#tag1", "#tag2"]}

The dynamic_tags should be 2–3 specific tags drawn from the caption's nouns (e.g. #ShrimpBoil, #SunsetSails) — NOT broad ones (we add those separately).`;

function escapeForPrompt(s: string): string {
  return s.replace(/[ -]/g, ' ').slice(0, 500);
}

function buildUserPrompt(b: Business): string {
  // Defensive: business fields may be optional in the data module
  const name = escapeForPrompt(b.name ?? b.slug ?? 'this business');
  const desc = escapeForPrompt(b.description ?? '');
  const industry = escapeForPrompt(b.industrySlug ?? '');
  const tagline = escapeForPrompt((b as { tagline?: string }).tagline ?? '');
  return [
    `Business: ${name}`,
    industry ? `Industry: ${industry}` : '',
    tagline ? `Tagline: ${tagline}` : '',
    desc ? `Description: ${desc}` : '',
  ].filter(Boolean).join('\n');
}

function fallbackCaption(b: Business): DraftCaption {
  const name = b.name ?? b.slug ?? 'A local favorite';
  return {
    caption: `${name} — a local spot worth a stop on Hilton Head. Full profile in our bio.`,
    hashtags: [], // hashtags added by buildHashtagsFor; this returns dynamic_tags only
    generated_by_model: 'template-fallback',
    generation_cost_usd: 0,
    used_fallback: true,
  };
}

async function callWithBackoff<T>(
  fn: () => Promise<T>,
  attempts = 3,
  baseMs = 800,
): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastErr = err;
      const status = (err as { status?: number })?.status;
      if (status !== 429 && status !== 503) throw err;
      await new Promise((r) => setTimeout(r, baseMs * Math.pow(2, i)));
    }
  }
  throw lastErr;
}

export async function generateCaption(b: Business): Promise<DraftCaption> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fallbackCaption(b);

  const client = new Anthropic({ apiKey });
  const userPrompt = buildUserPrompt(b);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    const msg = await callWithBackoff(() =>
      client.messages.create(
        {
          model: MODEL,
          max_tokens: 600,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        },
        { signal: controller.signal },
      ),
    );

    clearTimeout(timeoutId);

    const text = msg.content
      .filter((c): c is Anthropic.TextBlock => c.type === 'text')
      .map((c) => c.text)
      .join('');

    const parsed = parseStrictJson(text);
    if (!parsed) return fallbackCaption(b);

    const inputCost = (msg.usage.input_tokens / 1_000_000) * INPUT_PRICE_PER_MTOK;
    const outputCost = (msg.usage.output_tokens / 1_000_000) * OUTPUT_PRICE_PER_MTOK;

    return {
      caption: parsed.caption.slice(0, 800),
      hashtags: Array.isArray(parsed.dynamic_tags) ? parsed.dynamic_tags : [],
      generated_by_model: MODEL,
      generation_cost_usd: Number((inputCost + outputCost).toFixed(4)),
      used_fallback: false,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    // Stop blocks (content policy) and timeouts both fall back to template
    return fallbackCaption(b);
  }
}

function parseStrictJson(s: string): { caption: string; dynamic_tags?: string[] } | null {
  // Tolerant of leading/trailing prose; pull the first JSON object out.
  const match = s.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const obj = JSON.parse(match[0]);
    if (typeof obj?.caption === 'string') return obj;
    return null;
  } catch {
    return null;
  }
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors. If the `Business` type doesn't have a `description` field, drop that line from `buildUserPrompt`. The defensive `??` will keep it safe at runtime regardless.

- [ ] **Step 3: Verify model alias**

```bash
node -e "console.log(require('@anthropic-ai/sdk/package.json').version)"
```

Confirm the SDK version supports the model alias `claude-sonnet-4-5-20250929`. If a newer alias has been published, update the `MODEL` const. (The plan locks behavior; the model name is a config knob.)

- [ ] **Step 4: Commit**

```bash
git add app/lib/social/caption.ts
git commit -m "feat(social): Claude caption generator with template fallback"
```

---

## Task 8: `app/lib/social/storage.ts`

**Files:**
- Create: `app/lib/social/storage.ts`

- [ ] **Step 1: Write the file**

```ts
/**
 * Supabase Storage upload helper for spotlight overlay PNGs.
 *
 * Bucket: 'social-overlays' (public read, service-role write).
 * Path:   spotlight/<yyyy>/<mm>/<post-id>.png
 *
 * Retries the upload once on failure. Returns { path, url } on success
 * or null on hard failure — caller decides whether to insert a draft
 * with image_url=null (manual-upload prompt in admin queue).
 */

import { createServiceClient } from '@/utils/supabase/service';

const BUCKET = 'social-overlays';

export type UploadResult = { path: string; url: string };

export function buildObjectPath(postId: string, at: Date = new Date()): string {
  const yyyy = at.getUTCFullYear();
  const mm = String(at.getUTCMonth() + 1).padStart(2, '0');
  return `spotlight/${yyyy}/${mm}/${postId}.png`;
}

export async function uploadOverlay(
  postId: string,
  pngBuffer: Buffer,
): Promise<UploadResult | null> {
  const supabase = createServiceClient();
  const path = buildObjectPath(postId);

  for (let attempt = 0; attempt < 2; attempt++) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, pngBuffer, {
        contentType: 'image/png',
        cacheControl: '31536000',
        upsert: true,
      });

    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return { path, url: data.publicUrl };
    }

    if (attempt === 0) {
      await new Promise((r) => setTimeout(r, 500));
      continue;
    }
    // 2nd failure → log + return null
    console.error('[social.storage] upload failed twice', { path, error });
    return null;
  }
  return null;
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/lib/social/storage.ts
git commit -m "feat(social): Supabase Storage upload helper for overlays"
```

---

## Task 9: `app/lib/social/overlay.ts`

**Files:**
- Create: `app/lib/social/overlay.ts`

- [ ] **Step 1: Write the file**

```ts
/**
 * Branded PNG overlay composer using Sharp.
 *
 * Reads a template PNG + its JSON manifest from public/social-templates/,
 * composites the business photo into the photo box, draws the business
 * name into the name box, and optionally a caption snippet into the
 * caption strip. Returns a PNG buffer suitable for storage upload.
 *
 * Text rendering uses SVG-as-overlay (Sharp's text rendering is opaque on
 * older versions; SVG gives us pixel-perfect placement + custom fonts).
 */

import sharp from 'sharp';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import type { Business } from '@/data/localBusinesses';
import type { OverlayManifest } from './types';

const TEMPLATE_DIR = path.join(process.cwd(), 'public', 'social-templates');

async function loadManifest(templateName: string): Promise<OverlayManifest> {
  const jsonPath = path.join(TEMPLATE_DIR, `${templateName}.json`);
  const raw = await readFile(jsonPath, 'utf-8');
  return JSON.parse(raw) as OverlayManifest;
}

function svgFor(
  text: string,
  box: { x: number; y: number; w: number; h: number; font_px: number; color: string; align?: string },
  canvas: { width: number; height: number },
): Buffer {
  const safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const anchor =
    box.align === 'center' ? 'middle' :
    box.align === 'right' ? 'end' : 'start';
  const xText =
    box.align === 'center' ? box.x + box.w / 2 :
    box.align === 'right' ? box.x + box.w : box.x;
  // y in SVG is baseline of text — drop down by font_px so text sits inside the box
  const yText = box.y + box.font_px;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
    <style>
      .label {
        font-family: 'Fraunces', 'Georgia', serif;
        font-weight: 700;
        font-size: ${box.font_px}px;
        fill: ${box.color};
      }
    </style>
    <text x="${xText}" y="${yText}" class="label" text-anchor="${anchor}">${safe}</text>
  </svg>`;
  return Buffer.from(svg);
}

export async function composeOverlay(
  business: Business,
  basePhotoUrl: string,
  templateName: string,
  captionSnippet?: string,
): Promise<Buffer> {
  const manifest = await loadManifest(templateName);
  const templatePngPath = path.join(TEMPLATE_DIR, `${templateName}.png`);

  // Fetch base photo (Unsplash/Pexels CDN per next.config.ts remotePatterns)
  const photoRes = await fetch(basePhotoUrl);
  if (!photoRes.ok) {
    throw new Error(`overlay: photo fetch failed ${photoRes.status} ${basePhotoUrl}`);
  }
  const photoBuf = Buffer.from(await photoRes.arrayBuffer());

  // Resize photo to manifest.photo box (cover)
  const photoFitted = await sharp(photoBuf)
    .resize(manifest.photo.w, manifest.photo.h, { fit: 'cover', position: 'attention' })
    .png()
    .toBuffer();

  // Start from the template PNG as the canvas
  const composites: sharp.OverlayOptions[] = [
    { input: photoFitted, top: manifest.photo.y, left: manifest.photo.x },
  ];

  const businessName = business.name ?? business.slug ?? '';
  if (businessName) {
    composites.push({
      input: svgFor(businessName, manifest.business_name, manifest),
      top: 0,
      left: 0,
    });
  }

  if (manifest.caption_strip && captionSnippet) {
    const snip = captionSnippet.slice(0, manifest.caption_strip.max_chars);
    composites.push({
      input: svgFor(snip, manifest.caption_strip, manifest),
      top: 0,
      left: 0,
    });
  }

  const out = await sharp(templatePngPath)
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toBuffer();

  return out;
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors. If Sharp's `OverlayOptions` import path is wrong on the installed version, replace `sharp.OverlayOptions` with a local `type Overlay = { input: Buffer | string; top?: number; left?: number }` and use that.

- [ ] **Step 3: Commit**

```bash
git add app/lib/social/overlay.ts
git commit -m "feat(social): Sharp-based PNG overlay composer with SVG text"
```

---

## Task 10: `app/lib/social/bioLink.ts`

**Files:**
- Create: `app/lib/social/bioLink.ts`

- [ ] **Step 1: Write the file**

```ts
/**
 * Bio-link resolver for /go/ig.
 *
 * Picks the "current featured" post in priority order:
 *   1. Most recent status='published' today
 *   2. status='approved' whose scheduled_at <= now()
 *   3. fallback to brand homepage
 *
 * Returns a destination URL + UTM campaign + post id (for logging).
 */

import { createServiceClient } from '@/utils/supabase/service';
import { brand } from '@/data/brand';

export type FeaturedResolution = {
  postId: string | null;
  destinationPath: string; // path only; absolute URL constructed by caller
  utmCampaign: string | null;
};

const HOMEPAGE_FALLBACK: FeaturedResolution = {
  postId: null,
  destinationPath: '/',
  utmCampaign: null,
};

export async function resolveCurrentFeatured(): Promise<FeaturedResolution> {
  const supabase = createServiceClient();
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  // 1. Most recent published today
  const { data: pubRows } = await supabase
    .from('social_posts')
    .select('id, business_slug, industry_slug, utm_campaign, published_at')
    .eq('status', 'published')
    .gte('published_at', todayStart.toISOString())
    .order('published_at', { ascending: false })
    .limit(1);

  if (pubRows && pubRows[0]) {
    const r = pubRows[0];
    return {
      postId: r.id,
      destinationPath: `/local/${r.industry_slug}/${r.business_slug}`,
      utmCampaign: r.utm_campaign,
    };
  }

  // 2. Approved whose scheduled_at <= now
  const { data: appRows } = await supabase
    .from('social_posts')
    .select('id, business_slug, industry_slug, utm_campaign, scheduled_at')
    .eq('status', 'approved')
    .lte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: false })
    .limit(1);

  if (appRows && appRows[0]) {
    const r = appRows[0];
    return {
      postId: r.id,
      destinationPath: `/local/${r.industry_slug}/${r.business_slug}`,
      utmCampaign: r.utm_campaign,
    };
  }

  // 3. Fallback — pick the brand's homepage (or whatever brand.ctaTarget says)
  const fallbackPath = (brand as { ctaTarget?: string }).ctaTarget ?? '/';
  return { ...HOMEPAGE_FALLBACK, destinationPath: fallbackPath };
}

export function stampUtm(destPath: string, utmCampaign: string | null): string {
  if (!utmCampaign) return destPath;
  // Build relative URL — works because Next redirect() accepts relative paths
  const [pathOnly, query = ''] = destPath.split('?');
  const params = new URLSearchParams(query);
  params.set('utm_source', 'instagram');
  params.set('utm_medium', 'social');
  params.set('utm_campaign', utmCampaign);
  return `${pathOnly}?${params.toString()}`;
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors. If `brand.ctaTarget` does not exist on the type, the `as { ctaTarget?: string }` cast keeps it from breaking — that field is read with a fallback to `/`.

- [ ] **Step 3: Commit**

```bash
git add app/lib/social/bioLink.ts
git commit -m "feat(social): bio-link resolver + UTM stamper for /go/ig"
```

---

## Task 11: Extend `app/lib/email.ts` with `notifyAdminSocialQueue`

**Files:**
- Modify: `app/lib/email.ts`

- [ ] **Step 1: Append the helper to the bottom of `app/lib/email.ts`**

```ts
/**
 * Notify the operator that a fresh batch of social drafts is ready (or that
 * the generator ran with failures). Soft-fail: never throws — generator must
 * not be killed by an email outage.
 */
export async function notifyAdminSocialQueue(opts: {
  generated: number;
  failed: number;
  costUsd: number;
  baseUrl: string; // e.g. https://www.hiltonahead.com
}): Promise<void> {
  const to = process.env.RESEND_TO_EMAIL;
  if (!to) return;

  const total = opts.generated + opts.failed;
  const subject = opts.failed > 0
    ? `[social] ${opts.generated}/${total} drafts ready (${opts.failed} failed)`
    : `[social] ${opts.generated} drafts ready for review`;

  const queueUrl = `${opts.baseUrl}/admin/social`;
  const html = `
    <p>${opts.generated} draft${opts.generated === 1 ? '' : 's'} generated.</p>
    ${opts.failed > 0 ? `<p><strong>${opts.failed} failed</strong> — see queue for details.</p>` : ''}
    <p>Generator cost: $${opts.costUsd.toFixed(4)}</p>
    <p><a href="${queueUrl}">Open the queue →</a></p>
  `;
  const text = `${subject}\nGenerator cost: $${opts.costUsd.toFixed(4)}\nQueue: ${queueUrl}`;

  try {
    await sendEmail({ to, subject, html, text });
  } catch (err) {
    console.error('[social.email] notifyAdminSocialQueue failed', err);
  }
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors. If `sendEmail` is not exported with that exact name from this file, replace with the actual exported transactional sender name.

- [ ] **Step 3: Commit**

```bash
git add app/lib/email.ts
git commit -m "feat(social): notifyAdminSocialQueue helper"
```

---

## Task 12: `app/api/cron/social-generate/route.ts`

**Files:**
- Create: `app/api/cron/social-generate/route.ts`

- [ ] **Step 1: Write the file**

```ts
/**
 * Weekly cron — generates 5 IG spotlight drafts for unspotlighted businesses.
 *
 * Schedule: 0 13 * * 1 (Mon 13:00 UTC = 09:00 ET in EST; 08:00 ET in EDT).
 *
 * Auth:  Authorization: Bearer ${CRON_SECRET}
 * Query: ?preview=true → dry-run, returns picks + sample caption, no writes
 *
 * Behavior:
 *  - Idempotent: if >= DRAFTS_PER_WEEK drafts already exist for today, return
 *    { skipped: 'already-generated' }.
 *  - Spend-capped: env SOCIAL_GENERATE_MAX_USD (default 2.00). If exceeded
 *    mid-run, stops early and reports { stopped: 'cost-cap' }.
 *  - Per-business try/catch — one failure does not kill the batch. Failed
 *    businesses log + are NOT advanced in social_rotations.
 *  - On any success, notify operator via notifyAdminSocialQueue.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';
import { allBusinesses, type Business } from '@/data/localBusinesses';
import { photos } from '@/data/photos';
import { pickNextN, markSpotlighted } from '@/app/lib/social/rotation';
import { generateCaption } from '@/app/lib/social/caption';
import { buildHashtagsFor } from '@/app/lib/social/hashtags';
import { composeOverlay } from '@/app/lib/social/overlay';
import { uploadOverlay } from '@/app/lib/social/storage';
import { notifyAdminSocialQueue } from '@/app/lib/email';
import {
  DRAFTS_PER_WEEK,
  SCHEDULE_SLOT_DAYS,
  SCHEDULE_SLOT_HOUR_UTC,
  SOCIAL_GENERATE_MAX_USD_DEFAULT,
} from '@/app/lib/social/types';
import { randomUUID } from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const TEMPLATE_ROTATION = ['spotlight-v1', 'spotlight-v2', 'spotlight-v3'];

function bearerOk(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const got = req.headers.get('authorization');
  return got === `Bearer ${expected}`;
}

function lookupBusiness(slug: string): Business | undefined {
  return allBusinesses.find((b) => b.slug === slug);
}

function pickPhotoFor(business: Business): string | null {
  // Find a photo whose tags/industry overlap; else first available
  const bizIndustry = business.industrySlug;
  const candidates = photos.filter((p) =>
    (p.tags ?? []).includes(bizIndustry) || (p.industrySlug ?? '') === bizIndustry,
  );
  const pool = candidates.length > 0 ? candidates : photos;
  if (pool.length === 0) return null;
  // Deterministic per-business pick: hash slug → index
  const hash = Array.from(business.slug).reduce((s, ch) => s + ch.charCodeAt(0), 0);
  return pool[hash % pool.length].url;
}

function utmCampaignFor(slug: string, at: Date): string {
  const yymmdd = at.toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
  return `spotlight-${slug}-${yymmdd}`;
}

function slotForIndex(weekStart: Date, idx: number): Date {
  // weekStart = today @ 00:00 UTC; idx 0..4 maps Tue..Sat
  const day = SCHEDULE_SLOT_DAYS[idx % SCHEDULE_SLOT_DAYS.length];
  const d = new Date(weekStart);
  const currentDay = d.getUTCDay();
  const delta = (day - currentDay + 7) % 7 || 7; // always future-ish
  d.setUTCDate(d.getUTCDate() + delta);
  d.setUTCHours(SCHEDULE_SLOT_HOUR_UTC, 0, 0, 0);
  return d;
}

export async function GET(req: NextRequest) {
  if (!bearerOk(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const url = new URL(req.url);
  const preview = url.searchParams.get('preview') === 'true';

  const supabase = createServiceClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hiltonahead.com';

  // Idempotency check
  const today = new Date();
  const todayStart = new Date(today);
  todayStart.setUTCHours(0, 0, 0, 0);

  if (!preview) {
    const { count } = await supabase
      .from('social_posts')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString());
    if ((count ?? 0) >= DRAFTS_PER_WEEK) {
      return NextResponse.json({ ok: true, skipped: 'already-generated', count });
    }
  }

  const picks = await pickNextN(DRAFTS_PER_WEEK);
  if (picks.length === 0) {
    return NextResponse.json({ ok: true, generated: 0, note: 'no eligible businesses' });
  }

  const spendCap = Number(process.env.SOCIAL_GENERATE_MAX_USD ?? SOCIAL_GENERATE_MAX_USD_DEFAULT);
  let totalCost = 0;
  const generated: unknown[] = [];
  const failed: unknown[] = [];

  for (let i = 0; i < picks.length; i++) {
    if (totalCost >= spendCap) {
      return NextResponse.json({
        ok: true,
        stopped: 'cost-cap',
        generated: generated.length,
        failed: failed.length,
        totalCost,
      });
    }

    const pick = picks[i];
    const biz = lookupBusiness(pick.business_slug);
    if (!biz) {
      failed.push({ slug: pick.business_slug, reason: 'business not in registry' });
      continue;
    }

    try {
      const captionResult = await generateCaption(biz);
      totalCost += captionResult.generation_cost_usd ?? 0;
      const hashtags = buildHashtagsFor(biz.industrySlug, captionResult.hashtags);

      if (preview) {
        generated.push({
          slug: biz.slug,
          industry: biz.industrySlug,
          caption: captionResult.caption,
          hashtags,
          usedFallback: captionResult.used_fallback,
        });
        continue;
      }

      const scheduledAt = slotForIndex(todayStart, i);
      const utmCampaign = utmCampaignFor(biz.slug, scheduledAt);
      const templateName = TEMPLATE_ROTATION[i % TEMPLATE_ROTATION.length];
      const postId = randomUUID();

      // Overlay (best-effort — null on failure means manual upload required)
      let imagePath: string | null = null;
      let imageUrl: string | null = null;
      const photoUrl = pickPhotoFor(biz);
      if (photoUrl) {
        try {
          const buf = await composeOverlay(biz, photoUrl, templateName, captionResult.caption);
          const uploaded = await uploadOverlay(postId, buf);
          if (uploaded) {
            imagePath = uploaded.path;
            imageUrl = uploaded.url;
          }
        } catch (overlayErr) {
          console.error('[social-generate] overlay failed', biz.slug, overlayErr);
        }
      }

      const { error: insertErr } = await supabase.from('social_posts').insert({
        id: postId,
        business_slug: biz.slug,
        industry_slug: biz.industrySlug,
        platform: 'instagram',
        caption: captionResult.caption,
        hashtags,
        image_path: imagePath,
        image_url: imageUrl,
        overlay_template: templateName,
        status: 'draft',
        scheduled_at: scheduledAt.toISOString(),
        utm_campaign: utmCampaign,
        created_by_ai: true,
        generated_by_model: captionResult.generated_by_model,
        generation_cost_usd: captionResult.generation_cost_usd,
        edit_notes: captionResult.used_fallback ? 'LLM-content-filtered, template fallback' : null,
      });

      if (insertErr) {
        failed.push({ slug: biz.slug, reason: insertErr.message });
        continue;
      }

      await markSpotlighted(biz.slug);
      generated.push({ slug: biz.slug, scheduledAt, utmCampaign });
    } catch (err) {
      console.error('[social-generate] per-business failure', biz.slug, err);
      failed.push({
        slug: biz.slug,
        reason: err instanceof Error ? err.message : String(err),
      });
    }
  }

  if (preview) {
    return NextResponse.json({
      ok: true,
      preview: true,
      picks: picks.length,
      sampleCount: generated.length,
      generated,
      failed,
      estimatedTotalCost: totalCost,
    });
  }

  await notifyAdminSocialQueue({
    generated: generated.length,
    failed: failed.length,
    costUsd: totalCost,
    baseUrl,
  });

  // Structured single-line log per spec §8.7
  console.info(JSON.stringify({
    event: 'social-generate.run',
    run_id: randomUUID(),
    drafts_generated: generated.length,
    drafts_failed: failed.length,
    total_cost_usd: totalCost,
    duration_ms: Date.now() - todayStart.getTime(), // generous; replace with start-of-handler stamp if you want true duration
  }));

  return NextResponse.json({
    ok: true,
    generated: generated.length,
    failed: failed.length,
    totalCost,
  });
}

// Vercel cron will GET this route by default; expose POST for ad-hoc curl too.
export const POST = GET;
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors. If `data/photos.ts` doesn't export `photos` with `url`/`tags`/`industrySlug` fields, open the file and adjust `pickPhotoFor` accordingly — keep the deterministic-hash pattern.

- [ ] **Step 3: Manual preview test (skip if templates not yet built)**

```bash
npm run dev
# in another terminal:
curl -H "Authorization: Bearer $CRON_SECRET" \
  "http://localhost:3000/api/cron/social-generate?preview=true" | jq
```

Expected JSON shape: `{ ok: true, preview: true, picks: 5, sampleCount: 5, generated: [...5 items with caption + hashtags], failed: [] }`. If `failed` is non-empty, inspect the `reason` field.

- [ ] **Step 4: Commit**

```bash
git add app/api/cron/social-generate/route.ts
git commit -m "feat(social): weekly cron — generate IG spotlight drafts"
```

---

## Task 13: `app/go/ig/route.ts` — bio-link redirect

**Files:**
- Create: `app/go/ig/route.ts`

- [ ] **Step 1: Write the file**

```ts
/**
 * Public bio-link redirect for Instagram.
 *
 * Reads "current featured" post and 302s to its /local/[industry]/[slug]
 * with utm_source=instagram&utm_medium=social&utm_campaign=<post.utm_campaign>.
 *
 * Edge-cached for 60s so a burst of IG-tap traffic doesn't hammer the DB.
 */

import { NextResponse } from 'next/server';
import { resolveCurrentFeatured, stampUtm } from '@/app/lib/social/bioLink';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const featured = await resolveCurrentFeatured();
  const dest = stampUtm(featured.destinationPath, featured.utmCampaign);

  const res = NextResponse.redirect(new URL(dest, getOrigin()), 302);
  res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return res;
}

function getOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hiltonahead.com';
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Smoke test**

```bash
npm run dev
curl -i http://localhost:3000/go/ig
```

Expected: HTTP 302 with `Location: http://localhost:3000/...?utm_source=instagram&utm_medium=social&...` (or to `/` if no featured post yet).

- [ ] **Step 4: Commit**

```bash
git add app/go/ig/route.ts
git commit -m "feat(social): /go/ig bio-link redirect with stamped UTM"
```

---

## Task 14: Extend `app/lib/directoryTracking.ts` to capture utm_campaign

**Files:**
- Modify: `app/lib/directoryTracking.ts`

- [ ] **Step 1: Replace the `trackDirectoryEvent` function body**

Find the existing `trackDirectoryEvent` function in `app/lib/directoryTracking.ts` (current signature: `(businessId, industrySlug, eventType) => void`).

Replace its **entire body** with this version that auto-reads `utm_campaign` from the URL:

```ts
export function trackDirectoryEvent(
  businessId: string,
  industrySlug: string,
  eventType: DirectoryEventType,
): void {
  if (typeof window === 'undefined') return;

  // Auto-capture utm_campaign from the current URL — set by /go/ig redirect.
  let utmCampaign: string | null = null;
  try {
    utmCampaign = new URL(window.location.href).searchParams.get('utm_campaign');
  } catch {
    /* swallow */
  }

  const payload = JSON.stringify({
    businessId,
    industrySlug,
    eventType,
    ...(utmCampaign ? { utmCampaign } : {}),
  });

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(TRACK_ENDPOINT, blob);
      return;
    } catch {
      // fall through to fetch
    }
  }

  try {
    fetch(TRACK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {
      /* swallow — analytics must never block the user */
    });
  } catch {
    /* swallow */
  }
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/lib/directoryTracking.ts
git commit -m "feat(social): capture utm_campaign from URL in trackDirectoryEvent"
```

---

## Task 15: Extend `/api/directory/track/route.ts` to persist utm_campaign

**Files:**
- Modify: `app/api/directory/track/route.ts`

- [ ] **Step 1: Read the file to locate the destructure + insert call**

The existing route destructures `{ businessId, industrySlug, eventType }` from the parsed body and then inserts a row into `directory_events`. You need to:

1. Add `utmCampaign` to the destructure.
2. Validate it (string, length ≤ 100, regex matches `^[a-zA-Z0-9_\-:]+$`).
3. Pass it into the insert payload as `utm_campaign`.

- [ ] **Step 2: Edit the destructure block**

Find:

```ts
  const { businessId, industrySlug, eventType } = body as {
    businessId?: unknown;
    industrySlug?: unknown;
    eventType?: unknown;
  };
```

Replace with:

```ts
  const { businessId, industrySlug, eventType, utmCampaign } = body as {
    businessId?: unknown;
    industrySlug?: unknown;
    eventType?: unknown;
    utmCampaign?: unknown;
  };
```

- [ ] **Step 3: Add UTM validation just before the insert**

Find the line where the existing payload is validated against `ID_PATTERN`, `VALID_EVENT_TYPES`, and `VALID_INDUSTRIES`. After those checks, add:

```ts
  let utmCampaignClean: string | null = null;
  if (typeof utmCampaign === 'string') {
    if (utmCampaign.length > 0 && utmCampaign.length <= 100 && /^[a-zA-Z0-9_\-:]+$/.test(utmCampaign)) {
      utmCampaignClean = utmCampaign;
    }
  }
```

- [ ] **Step 4: Pass `utm_campaign: utmCampaignClean` into the existing `directory_events` insert**

Find the `.from('directory_events').insert({ ... })` call and add the field:

```ts
      utm_campaign: utmCampaignClean,
```

- [ ] **Step 5: Typecheck + smoke**

```bash
npm run typecheck
# Then dev + curl:
npm run dev
curl -X POST http://localhost:3000/api/directory/track \
  -H 'content-type: application/json' \
  -d '{"businessId":"test","industrySlug":"restaurants","eventType":"website_click","utmCampaign":"spotlight-test-260601"}'
```

Expected: HTTP 204. Verify the row landed in `directory_events` with `utm_campaign='spotlight-test-260601'` via Supabase SQL editor.

- [ ] **Step 6: Commit**

```bash
git add app/api/directory/track/route.ts
git commit -m "feat(social): persist utm_campaign on directory_events insert"
```

---

## Task 16: Extend `/api/checkout/route.ts` to forward utm_campaign

**Files:**
- Modify: `app/api/checkout/route.ts`

- [ ] **Step 1: Locate where the Stripe Checkout Session is created**

In `app/api/checkout/route.ts`, find the `stripe.checkout.sessions.create({ ... })` call. It currently passes `mode`, `line_items`, `success_url`, `cancel_url`, and likely a `client_reference_id`.

- [ ] **Step 2: Modify `readTierFromRequest` to also return `utmCampaign`**

The body can only be read once per request. The existing `readTierFromRequest` at the top of the file consumes the JSON body to extract `tier`. Update its return type and body parsing to also surface `utm_campaign`:

Change the function signature from:

```ts
async function readTierFromRequest(req: NextRequest): Promise<string | null>
```

to:

```ts
type ReadResult = { tier: string | null; utmCampaign: string | null };

async function readTierFromRequest(req: NextRequest): Promise<ReadResult>
```

Inside the function, after the existing JSON parse, extract:

```ts
      const body = await req.json();
      return {
        tier: typeof body?.tier === 'string' ? body.tier : null,
        utmCampaign: typeof body?.utm_campaign === 'string' ? body.utm_campaign : null,
      };
```

Mirror the same for the formData branch. The query-string branch also falls back to `req.nextUrl.searchParams.get('utm_campaign')` so direct `/api/checkout?tier=X&utm_campaign=Y` GETs work.

Update the caller (`POST` handler) destructure:

```ts
  const { tier, utmCampaign } = await readTierFromRequest(req);
```

- [ ] **Step 3: Attach to Stripe metadata**

Pass `utmCampaign` into the session via `metadata`. Find the existing `metadata: { ... }` block in `sessions.create` (or add one):

```ts
      metadata: {
        ...(existing keys),
        ...(utmCampaign ? { utm_campaign: utmCampaign } : {}),
      },
```

- [ ] **Step 4: Validate the UTM string**

Stripe metadata values are length-capped at 500 chars. Defensive validation just before assigning:

```ts
  const safeUtm = (utmCampaign && /^[a-zA-Z0-9_\-:]{1,100}$/.test(utmCampaign))
    ? utmCampaign
    : null;
```

Use `safeUtm` in the metadata block instead of `utmCampaign`.

- [ ] **Step 5: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add app/api/checkout/route.ts
git commit -m "feat(social): forward utm_campaign into Stripe session metadata"
```

---

## Task 17: Extend `/api/stripe/webhook/route.ts` to persist utm_campaign

**Files:**
- Modify: `app/api/stripe/webhook/route.ts`

- [ ] **Step 1: Locate the `checkout.session.completed` handler**

In `app/api/stripe/webhook/route.ts`, find the switch/if block that handles `event.type === 'checkout.session.completed'`. It currently inserts into the `purchases` table.

- [ ] **Step 2: Pull utm_campaign from session metadata**

Inside the handler, where the session object is available (typed as `Stripe.Checkout.Session`):

```ts
  const utmCampaign = (session.metadata?.utm_campaign as string | undefined) ?? null;
```

- [ ] **Step 3: Add `utm_campaign: utmCampaign` to the existing `purchases` insert payload**

Find the `.from('purchases').insert({ ... })` call. Add the field:

```ts
      utm_campaign: utmCampaign,
```

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/api/stripe/webhook/route.ts
git commit -m "feat(social): persist utm_campaign on purchases via Stripe webhook"
```

---

## Task 18: `app/admin/(gated)/social/actions.ts` — server actions

**Files:**
- Create: `app/admin/(gated)/social/actions.ts`

- [ ] **Step 1: Write the file**

```ts
'use server';

/**
 * Admin server actions for the social autopilot queue.
 *
 * Every exported action calls requireAdmin() per CLAUDE.md hard rule.
 * No client component should import from this file directly — use form
 * actions in the page components.
 */

import { revalidatePath } from 'next/cache';
import { requireAdmin, createAdminClient } from '@/utils/supabase/admin';
import { rollbackSpotlight } from '@/app/lib/social/rotation';
import { generateCaption } from '@/app/lib/social/caption';
import { composeOverlay } from '@/app/lib/social/overlay';
import { uploadOverlay } from '@/app/lib/social/storage';
import { allBusinesses } from '@/data/localBusinesses';
import { REGEN_CAP } from '@/app/lib/social/types';

const IG_PERMALINK_REGEX = /^https:\/\/(www\.)?instagram\.com\/(p|reel)\/[\w-]+\/?(\?.*)?$/;

function actionRevalidate(id?: string) {
  revalidatePath('/admin/social');
  revalidatePath('/admin/social/attribution');
  if (id) revalidatePath(`/admin/social/${id}`);
}

export async function approveDraft(id: string): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('social_posts')
    .update({
      status: 'approved',
      reviewed_by: admin.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('status', 'draft');
  if (error) return { ok: false, error: error.message };
  actionRevalidate(id);
  return { ok: true };
}

export async function rejectDraft(id: string, notes: string): Promise<{ ok: boolean; error?: string }> {
  if (!notes || notes.trim().length < 3) {
    return { ok: false, error: 'edit_notes required (min 3 chars)' };
  }
  const admin = await requireAdmin();
  const supabase = createAdminClient();

  // Fetch business_slug before rejecting so we can roll back rotation
  const { data: row } = await supabase
    .from('social_posts')
    .select('business_slug, status')
    .eq('id', id)
    .single();

  if (!row) return { ok: false, error: 'not found' };
  if (row.status !== 'draft' && row.status !== 'approved') {
    return { ok: false, error: `cannot reject from status=${row.status}` };
  }

  const { error } = await supabase
    .from('social_posts')
    .update({
      status: 'rejected',
      reviewed_by: admin.id,
      reviewed_at: new Date().toISOString(),
      edit_notes: notes.trim().slice(0, 500),
    })
    .eq('id', id);

  if (error) return { ok: false, error: error.message };

  // Roll back rotation so business re-enters pool
  try {
    await rollbackSpotlight(row.business_slug);
  } catch (err) {
    console.error('[social.actions] rotation rollback failed', err);
  }

  actionRevalidate(id);
  return { ok: true };
}

export async function editDraftCaption(
  id: string,
  newCaption: string,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  if (!newCaption || newCaption.trim().length === 0) {
    return { ok: false, error: 'caption empty' };
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('social_posts')
    .update({ caption: newCaption.trim().slice(0, 2200) })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };
  actionRevalidate(id);
  return { ok: true };
}

export async function regenerateCaption(id: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data: row } = await supabase
    .from('social_posts')
    .select('business_slug, regen_count')
    .eq('id', id)
    .single();
  if (!row) return { ok: false, error: 'not found' };
  if ((row.regen_count ?? 0) >= REGEN_CAP) {
    return { ok: false, error: `regen cap reached (${REGEN_CAP})` };
  }
  const biz = allBusinesses.find((b) => b.slug === row.business_slug);
  if (!biz) return { ok: false, error: 'business not in registry' };

  const result = await generateCaption(biz);
  const { error } = await supabase
    .from('social_posts')
    .update({
      caption: result.caption,
      regen_count: (row.regen_count ?? 0) + 1,
      generation_cost_usd: result.generation_cost_usd,
    })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };
  actionRevalidate(id);
  return { ok: true };
}

export async function rescheduleDraft(
  id: string,
  isoScheduledAt: string,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const when = new Date(isoScheduledAt);
  if (Number.isNaN(when.getTime())) return { ok: false, error: 'invalid date' };
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('social_posts')
    .update({ scheduled_at: when.toISOString() })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };
  actionRevalidate(id);
  return { ok: true };
}

export async function markPosted(
  id: string,
  permalink: string,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  if (!IG_PERMALINK_REGEX.test(permalink.trim())) {
    return { ok: false, error: 'permalink does not match Instagram URL shape' };
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('social_posts')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
      ig_permalink: permalink.trim(),
    })
    .eq('id', id)
    .in('status', ['approved', 'draft']);
  if (error) return { ok: false, error: error.message };
  actionRevalidate(id);
  return { ok: true };
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors. If `createAdminClient` isn't exported from `utils/supabase/admin`, swap to `createServiceClient` from `utils/supabase/service` — same auth posture since admin actions already passed `requireAdmin()`.

- [ ] **Step 3: Commit**

```bash
git add app/admin/(gated)/social/actions.ts
git commit -m "feat(social): admin server actions — approve/reject/edit/regen/reschedule/mark-posted"
```

---

## Task 19: `components/admin/social/DraftCard.tsx`

**Files:**
- Create: `components/admin/social/DraftCard.tsx`

- [ ] **Step 1: Write the file**

```tsx
import Image from 'next/image';
import Link from 'next/link';
import type { SocialPost } from '@/app/lib/social/types';

export function DraftCard({ post }: { post: SocialPost }) {
  const scheduled = new Date(post.scheduled_at);
  const overdue = post.status === 'draft' && scheduled.getTime() < Date.now();
  return (
    <article className={`rounded-lg border p-4 ${overdue ? 'border-coral bg-coral/5' : 'border-sand'}`}>
      <header className="flex items-center justify-between gap-2">
        <h3 className="font-display text-lg">
          <Link href={`/admin/social/${post.id}`} className="hover:underline">
            {post.business_slug}
          </Link>
        </h3>
        <span className="text-xs uppercase tracking-wider text-ink-soft">{post.status}</span>
      </header>
      {post.image_url ? (
        <div className="relative mt-3 aspect-square w-full overflow-hidden rounded-md bg-sand-soft">
          <Image src={post.image_url} alt={post.business_slug} fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
        </div>
      ) : (
        <div className="mt-3 grid aspect-square w-full place-items-center rounded-md border border-dashed border-coral text-center text-sm text-coral">
          Image missing — upload manually
        </div>
      )}
      <p className="mt-3 line-clamp-4 text-sm text-ink-soft">{post.caption}</p>
      <p className="mt-2 text-xs text-ink-soft">
        {post.hashtags.slice(0, 6).join(' ')}
        {post.hashtags.length > 6 ? ` +${post.hashtags.length - 6}` : ''}
      </p>
      <footer className="mt-3 flex items-center justify-between text-xs text-ink-soft">
        <span>{overdue ? 'OVERDUE — ' : ''}slot: {scheduled.toLocaleString()}</span>
        <span>regen: {post.regen_count}/3</span>
      </footer>
    </article>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/admin/social/DraftCard.tsx
git commit -m "feat(social): DraftCard component for admin queue"
```

---

## Task 20: `components/admin/social/OverlayPreview.tsx`

**Files:**
- Create: `components/admin/social/OverlayPreview.tsx`

- [ ] **Step 1: Write the file**

```tsx
import Image from 'next/image';

export function OverlayPreview({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="grid aspect-square w-full place-items-center rounded-md border border-dashed border-coral text-center text-sm text-coral">
        No image — upload manually before posting
      </div>
    );
  }
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-md border border-sand bg-sand-soft">
      <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/admin/social/OverlayPreview.tsx
git commit -m "feat(social): OverlayPreview component"
```

---

## Task 21: `components/admin/social/RotationBadge.tsx`

**Files:**
- Create: `components/admin/social/RotationBadge.tsx`

- [ ] **Step 1: Write the file**

```tsx
export function RotationBadge({ weeksSinceLast }: { weeksSinceLast: number | null }) {
  if (weeksSinceLast === null) {
    return <span className="rounded-full bg-palm/10 px-2 py-0.5 text-xs text-palm">First spotlight</span>;
  }
  const tone =
    weeksSinceLast >= 12 ? 'bg-ocean/10 text-ocean' : 'bg-gold/10 text-gold-deep';
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs ${tone}`}>
      Last spotlighted {weeksSinceLast}w ago
    </span>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/admin/social/RotationBadge.tsx
git commit -m "feat(social): RotationBadge component"
```

---

## Task 22: `components/admin/social/MarkPostedModal.tsx`

**Files:**
- Create: `components/admin/social/MarkPostedModal.tsx`

- [ ] **Step 1: Write the file**

```tsx
'use client';

import { useState, useTransition } from 'react';
import { markPosted } from '@/app/admin/(gated)/social/actions';

export function MarkPostedModal({ postId, onClose }: { postId: string; onClose: () => void }) {
  const [permalink, setPermalink] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    start(async () => {
      const res = await markPosted(postId, permalink);
      if (!res.ok) setErr(res.error ?? 'failed');
      else onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="font-display text-xl">Mark this post as published</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Paste the public Instagram URL (e.g. <code>https://www.instagram.com/p/AbcDef123/</code>).
        </p>
        <input
          type="url"
          required
          placeholder="https://www.instagram.com/p/..."
          value={permalink}
          onChange={(e) => setPermalink(e.target.value)}
          className="mt-3 w-full rounded border border-sand px-3 py-2 text-sm"
        />
        {err ? <p className="mt-2 text-sm text-coral">{err}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded px-3 py-2 text-sm">
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded bg-ocean px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {pending ? 'Saving…' : 'Mark posted'}
          </button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/admin/social/MarkPostedModal.tsx
git commit -m "feat(social): MarkPostedModal client component"
```

---

## Task 23: `app/admin/(gated)/social/page.tsx`

**Files:**
- Create: `app/admin/(gated)/social/page.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { requireAdmin, createAdminClient } from '@/utils/supabase/admin';
import { DraftCard } from '@/components/admin/social/DraftCard';
import type { SocialPost } from '@/app/lib/social/types';

export const dynamic = 'force-dynamic';

export default async function SocialQueuePage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .in('status', ['draft', 'approved', 'published'])
    .order('scheduled_at', { ascending: true })
    .limit(50);

  if (error) {
    return <div className="p-6 text-coral">Failed to load queue: {error.message}</div>;
  }

  const posts = (data ?? []) as SocialPost[];
  const drafts = posts.filter((p) => p.status === 'draft');
  const approved = posts.filter((p) => p.status === 'approved');
  const published = posts.filter((p) => p.status === 'published');

  return (
    <main className="mx-auto max-w-7xl space-y-10 p-6">
      <header className="flex items-baseline justify-between gap-4">
        <h1 className="font-display text-3xl">Social queue</h1>
        <a href="/admin/social/attribution" className="text-sm text-ocean hover:underline">
          Attribution →
        </a>
      </header>

      <Section title={`Drafts (${drafts.length})`} posts={drafts} emptyText="No drafts — run the Monday cron." />
      <Section title={`Approved (${approved.length})`} posts={approved} emptyText="Nothing approved yet." />
      <Section title={`Published (${published.length})`} posts={published} emptyText="No published spotlights yet." />
    </main>
  );
}

function Section({ title, posts, emptyText }: { title: string; posts: SocialPost[]; emptyText: string }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-xl">{title}</h2>
      {posts.length === 0 ? (
        <p className="text-sm text-ink-soft">{emptyText}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <DraftCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/admin/(gated)/social/page.tsx
git commit -m "feat(social): admin queue list page"
```

---

## Task 24: `app/admin/(gated)/social/[id]/page.tsx`

**Files:**
- Create: `app/admin/(gated)/social/[id]/page.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { notFound } from 'next/navigation';
import { requireAdmin, createAdminClient } from '@/utils/supabase/admin';
import { OverlayPreview } from '@/components/admin/social/OverlayPreview';
import { MarkPostedModalLauncher } from './MarkPostedModalLauncher';
import { ApproveButton, RejectForm, RegenerateButton, EditCaptionForm, RescheduleForm } from './ActionForms';
import type { SocialPost } from '@/app/lib/social/types';

export const dynamic = 'force-dynamic';

export default async function SocialEditorPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return notFound();
  const post = data as SocialPost;

  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-6 md:grid-cols-2">
      <section>
        <OverlayPreview src={post.image_url} alt={post.business_slug} />
        <p className="mt-2 text-xs text-ink-soft">
          Template: {post.overlay_template} · UTM: {post.utm_campaign}
        </p>
      </section>

      <section className="space-y-4">
        <header>
          <h1 className="font-display text-2xl">{post.business_slug}</h1>
          <p className="text-sm text-ink-soft">
            {post.industry_slug} · status: {post.status} · regen {post.regen_count}/3
          </p>
        </header>

        <EditCaptionForm id={post.id} initialCaption={post.caption} />

        <div className="flex flex-wrap gap-2">
          <ApproveButton id={post.id} disabled={post.status !== 'draft'} />
          <RegenerateButton id={post.id} disabled={post.regen_count >= 3} />
          <MarkPostedModalLauncher id={post.id} disabled={post.status === 'published'} />
        </div>

        <RescheduleForm id={post.id} initialIso={post.scheduled_at} />
        <RejectForm id={post.id} disabled={post.status === 'rejected' || post.status === 'published'} />
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Create the small client launcher**

Create `app/admin/(gated)/social/[id]/MarkPostedModalLauncher.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { MarkPostedModal } from '@/components/admin/social/MarkPostedModal';

export function MarkPostedModalLauncher({ id, disabled }: { id: string; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="rounded border border-ocean px-3 py-2 text-sm text-ocean disabled:opacity-50"
      >
        Mark posted
      </button>
      {open ? <MarkPostedModal postId={id} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
```

- [ ] **Step 3: Create the action forms**

Create `app/admin/(gated)/social/[id]/ActionForms.tsx`:

```tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  approveDraft,
  rejectDraft,
  editDraftCaption,
  regenerateCaption,
  rescheduleDraft,
} from '@/app/admin/(gated)/social/actions';

function useFormPending(): [boolean, (fn: () => Promise<void>) => void] {
  const [pending, start] = useTransition();
  return [pending, (fn) => start(async () => { await fn(); })];
}

export function ApproveButton({ id, disabled }: { id: string; disabled?: boolean }) {
  const router = useRouter();
  const [pending, run] = useFormPending();
  return (
    <button
      type="button"
      disabled={pending || disabled}
      onClick={() => run(async () => { await approveDraft(id); router.refresh(); })}
      className="rounded bg-palm px-3 py-2 text-sm text-white disabled:opacity-50"
    >
      {pending ? 'Approving…' : 'Approve'}
    </button>
  );
}

export function RegenerateButton({ id, disabled }: { id: string; disabled?: boolean }) {
  const router = useRouter();
  const [pending, run] = useFormPending();
  return (
    <button
      type="button"
      disabled={pending || disabled}
      onClick={() => run(async () => { await regenerateCaption(id); router.refresh(); })}
      className="rounded border border-gold-deep px-3 py-2 text-sm text-gold-deep disabled:opacity-50"
    >
      {pending ? 'Regenerating…' : 'Regenerate caption'}
    </button>
  );
}

export function EditCaptionForm({ id, initialCaption }: { id: string; initialCaption: string }) {
  const router = useRouter();
  const [caption, setCaption] = useState(initialCaption);
  const [pending, run] = useFormPending();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(async () => { await editDraftCaption(id, caption); router.refresh(); });
      }}
      className="space-y-2"
    >
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={6}
        className="w-full rounded border border-sand p-3 text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-ocean px-3 py-2 text-sm text-white disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Save caption'}
      </button>
    </form>
  );
}

export function RescheduleForm({ id, initialIso }: { id: string; initialIso: string }) {
  const router = useRouter();
  const initial = initialIso.slice(0, 16); // 'YYYY-MM-DDThh:mm'
  const [value, setValue] = useState(initial);
  const [pending, run] = useFormPending();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(async () => {
          await rescheduleDraft(id, new Date(value).toISOString());
          router.refresh();
        });
      }}
      className="flex items-end gap-2"
    >
      <label className="text-sm">
        Reschedule (your local time)
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-1 block rounded border border-sand px-2 py-1 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded border border-ink px-3 py-2 text-sm disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Update'}
      </button>
    </form>
  );
}

export function RejectForm({ id, disabled }: { id: string; disabled?: boolean }) {
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [pending, run] = useFormPending();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setErr(null);
        run(async () => {
          const res = await rejectDraft(id, notes);
          if (!res.ok) setErr(res.error ?? 'failed');
          else router.refresh();
        });
      }}
      className="space-y-2 rounded border border-coral/40 p-3"
    >
      <label className="text-sm text-coral-deep">Reject — note required</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className="w-full rounded border border-sand p-2 text-sm"
      />
      {err ? <p className="text-sm text-coral">{err}</p> : null}
      <button
        type="submit"
        disabled={pending || disabled || notes.trim().length < 3}
        className="rounded border border-coral px-3 py-2 text-sm text-coral disabled:opacity-50"
      >
        {pending ? 'Rejecting…' : 'Reject + return to pool'}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/admin/\(gated\)/social/\[id\]/
git commit -m "feat(social): admin single-draft editor + action forms"
```

(On Windows PowerShell, the parens/brackets in the path may need different escaping — `git add "app/admin/(gated)/social/[id]/"` typically works.)

---

## Task 25: `app/admin/(gated)/social/attribution/page.tsx`

**Files:**
- Create: `app/admin/(gated)/social/attribution/page.tsx`

- [ ] **Step 1: Write the file**

```tsx
import Link from 'next/link';
import { requireAdmin, createAdminClient } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';

type AttributionRow = {
  id: string;
  business_slug: string;
  utm_campaign: string;
  published_at: string | null;
  ig_permalink: string | null;
  clicks: number;
  purchases: number;
  revenue_usd: number;
};

export default async function AttributionPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  // Pull last 60 published posts
  const { data: posts, error } = await supabase
    .from('social_posts')
    .select('id, business_slug, utm_campaign, published_at, ig_permalink')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(60);

  if (error || !posts) {
    return <div className="p-6 text-coral">Failed: {error?.message ?? 'no data'}</div>;
  }

  const utmList = posts.map((p) => p.utm_campaign);
  if (utmList.length === 0) {
    return <main className="p-6"><p>No published posts yet.</p></main>;
  }

  const [{ data: clicks }, { data: purchases }] = await Promise.all([
    supabase.from('directory_events').select('utm_campaign').in('utm_campaign', utmList),
    supabase.from('purchases').select('utm_campaign, amount_cents, tier_slug').in('utm_campaign', utmList),
  ]);

  const clickByUtm = new Map<string, number>();
  for (const c of clicks ?? []) {
    if (!c.utm_campaign) continue;
    clickByUtm.set(c.utm_campaign, (clickByUtm.get(c.utm_campaign) ?? 0) + 1);
  }
  const purchByUtm = new Map<string, { count: number; revenue: number }>();
  for (const p of purchases ?? []) {
    if (!p.utm_campaign) continue;
    const prev = purchByUtm.get(p.utm_campaign) ?? { count: 0, revenue: 0 };
    purchByUtm.set(p.utm_campaign, {
      count: prev.count + 1,
      revenue: prev.revenue + ((p.amount_cents ?? 0) / 100),
    });
  }

  const rows: AttributionRow[] = posts.map((p) => {
    const pu = purchByUtm.get(p.utm_campaign);
    return {
      id: p.id,
      business_slug: p.business_slug,
      utm_campaign: p.utm_campaign,
      published_at: p.published_at,
      ig_permalink: p.ig_permalink,
      clicks: clickByUtm.get(p.utm_campaign) ?? 0,
      purchases: pu?.count ?? 0,
      revenue_usd: pu?.revenue ?? 0,
    };
  });

  const totals = rows.reduce(
    (acc, r) => ({
      clicks: acc.clicks + r.clicks,
      purchases: acc.purchases + r.purchases,
      revenue: acc.revenue + r.revenue_usd,
    }),
    { clicks: 0, purchases: 0, revenue: 0 },
  );

  return (
    <main className="mx-auto max-w-6xl p-6">
      <Link href="/admin/social" className="text-sm text-ocean hover:underline">
        ← Queue
      </Link>
      <h1 className="mt-2 font-display text-3xl">Spotlight attribution</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Totals — clicks: <strong>{totals.clicks}</strong> · purchases:{' '}
        <strong>{totals.purchases}</strong> · revenue:{' '}
        <strong>${totals.revenue.toFixed(2)}</strong>
      </p>

      <table className="mt-6 w-full text-sm">
        <thead className="border-b border-sand text-left text-xs uppercase text-ink-soft">
          <tr>
            <th className="py-2">Business</th>
            <th>Published</th>
            <th className="text-right">Clicks</th>
            <th className="text-right">Purchases</th>
            <th className="text-right">Revenue</th>
            <th>IG</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-sand/50">
              <td className="py-2">
                <Link href={`/admin/social/${r.id}`} className="hover:underline">
                  {r.business_slug}
                </Link>
              </td>
              <td>{r.published_at ? new Date(r.published_at).toLocaleDateString() : '—'}</td>
              <td className="text-right">{r.clicks}</td>
              <td className="text-right">{r.purchases}</td>
              <td className="text-right">${r.revenue_usd.toFixed(2)}</td>
              <td>
                {r.ig_permalink ? (
                  <a href={r.ig_permalink} target="_blank" rel="noopener" className="text-ocean hover:underline">
                    open
                  </a>
                ) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors. If `purchases.amount_cents` is named differently in your schema (e.g. `total_cents`, `amount`), adjust the select + reducer. Check via Supabase SQL editor: `\d public.purchases`.

- [ ] **Step 3: Commit**

```bash
git add app/admin/\(gated\)/social/attribution/page.tsx
git commit -m "feat(social): attribution dashboard joining posts + clicks + purchases"
```

---

## Task 26: Register cron in `vercel.json`

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Read current vercel.json + merge**

Current state (verified during planning): one cron registered (`/api/cron/newsletter-draft`). Add the new entry alongside:

```json
{
  "crons": [
    {
      "path": "/api/cron/newsletter-draft",
      "schedule": "0 13 * * 0"
    },
    {
      "path": "/api/cron/social-generate",
      "schedule": "0 13 * * 1"
    }
  ]
}
```

If other crons were added between plan-write and execution (directory-prospect-scan, attribution-proof), merge by adding only the new social-generate entry and preserving everything else.

- [ ] **Step 2: Verify JSON is valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf-8')); console.log('ok')"
```

Expected: `ok`.

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "chore(social): register social-generate cron (Mon 13:00 UTC)"
```

---

## Task 27: Set Instagram handle in `data/brand.ts`

**Files:**
- Modify: `data/brand.ts`

- [ ] **Step 1: Open `data/brand.ts` and find the `social` block**

The current `social.instagram` is empty (`''`). Set it to the real handle (e.g. `'https://www.instagram.com/hiltonaheadtravel/'`) **only if the IG account already exists**. If not, leave empty and revisit when the account is set up.

```ts
  social: {
    instagram: 'https://www.instagram.com/hiltonaheadtravel/',
    // ... other handles unchanged
  },
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors. The schema.org `sameAs` array consuming this field will now include the IG profile.

- [ ] **Step 3: Commit**

```bash
git add data/brand.ts
git commit -m "chore(social): set instagram handle in brand config"
```

---

## Task 28: Dev seed script `scripts/seed-social-drafts.ts`

**Files:**
- Create: `scripts/seed-social-drafts.ts`

- [ ] **Step 1: Write the file**

```ts
/**
 * Dev convenience — seed 5 mock social_posts rows so /admin/social
 * renders something without running the real generator.
 *
 * Usage:
 *   npx tsx scripts/seed-social-drafts.ts
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */

import { createClient } from '@supabase/supabase-js';
import { allBusinesses } from '../data/localBusinesses';
import { randomUUID } from 'node:crypto';

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Supabase env missing');

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const businesses = allBusinesses.slice(0, 5);
  const now = new Date();
  const rows = businesses.map((b, i) => {
    const scheduledAt = new Date(now);
    scheduledAt.setUTCDate(scheduledAt.getUTCDate() + i + 1);
    scheduledAt.setUTCHours(14, 0, 0, 0);
    return {
      id: randomUUID(),
      business_slug: b.slug,
      industry_slug: b.industrySlug,
      platform: 'instagram',
      caption: `Mock seed caption for ${b.name ?? b.slug}. Full profile in our bio.`,
      hashtags: ['#HiltonHead', '#MockSeed'],
      image_path: null,
      image_url: null,
      overlay_template: 'spotlight-v1',
      status: 'draft',
      scheduled_at: scheduledAt.toISOString(),
      utm_campaign: `spotlight-${b.slug}-mock${i}`,
      created_by_ai: false,
      generated_by_model: 'seed-script',
      regen_count: 0,
    };
  });

  const { error } = await supabase.from('social_posts').insert(rows);
  if (error) throw error;
  console.log(`Seeded ${rows.length} drafts.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Run it**

```bash
npx tsx scripts/seed-social-drafts.ts
```

Expected: `Seeded 5 drafts.` Visit `/admin/social` — 5 cards should appear in the Drafts section.

- [ ] **Step 3: Clean up the seed rows when done verifying**

In Supabase SQL editor:

```sql
delete from public.social_posts where generated_by_model = 'seed-script';
```

- [ ] **Step 4: Commit**

```bash
git add scripts/seed-social-drafts.ts
git commit -m "chore(social): dev seed script for admin queue UI"
```

---

## Task 29: Playwright tests

**Files:**
- Create: `tests/admin-social.spec.ts`
- Create: `tests/social-bio-link.spec.ts`

- [ ] **Step 1: Write `tests/social-bio-link.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test.describe('/go/ig bio-link', () => {
  test('redirects 302 with utm params or to fallback', async ({ page }) => {
    const resp = await page.goto('/go/ig', { waitUntil: 'domcontentloaded' });
    expect(resp).not.toBeNull();
    // We end up on either a /local/* page or '/'. Both are fine; UTM only present if featured exists.
    const url = page.url();
    if (url.includes('/local/')) {
      expect(url).toContain('utm_source=instagram');
      expect(url).toContain('utm_medium=social');
      expect(url).toContain('utm_campaign=');
    } else {
      // Fallback — homepage, no UTM required
      expect(new URL(url).pathname).toBe('/');
    }
  });
});
```

- [ ] **Step 2: Write `tests/admin-social.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

/**
 * NOTE: this spec requires admin auth. If the existing test harness does not
 * provide a signed-in admin storage state, mark this whole file `test.skip`
 * and run it manually after logging in. The auth helper hookup is intentionally
 * out of scope for this task — wire it up in a follow-up.
 */

test.describe('admin social queue', () => {
  test.skip(({}, testInfo) => !process.env.ADMIN_STORAGE_STATE, 'requires ADMIN_STORAGE_STATE env');

  test('renders 3 main sections', async ({ page }) => {
    await page.goto('/admin/social');
    await expect(page.getByRole('heading', { name: /Social queue/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Drafts/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Approved/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Published/ })).toBeVisible();
  });

  test('mark-posted modal validates IG URL shape', async ({ page }) => {
    // Skip if no draft is available — assumes seed script has been run
    await page.goto('/admin/social');
    const firstCard = page.locator('a[href^="/admin/social/"]').first();
    if (!(await firstCard.isVisible().catch(() => false))) test.skip();
    await firstCard.click();
    await page.getByRole('button', { name: /Mark posted/i }).click();
    await page.getByPlaceholder(/instagram\.com\/p\//).fill('https://example.com/not-instagram');
    await page.getByRole('button', { name: /Mark posted/i }).last().click();
    await expect(page.getByText(/does not match Instagram URL shape/)).toBeVisible();
  });
});
```

- [ ] **Step 3: Run the tests**

```bash
npx playwright test tests/social-bio-link.spec.ts tests/admin-social.spec.ts
```

Expected: `social-bio-link` passes; `admin-social` skips (or passes if `ADMIN_STORAGE_STATE` is set). Any failure → inspect, fix, re-run.

- [ ] **Step 4: Commit**

```bash
git add tests/admin-social.spec.ts tests/social-bio-link.spec.ts
git commit -m "test(social): bio-link redirect + admin queue smoke specs"
```

---

## Task 30: Final verification + Definition of Done

**Files:**
- None (verification only)

- [ ] **Step 1: Walk the Definition of Done checklist from the spec**

For each item, verify and check off. If something is not done, create a follow-up task (do NOT mark Phase 1 complete with gaps).

- [ ] Migration 023 deployed (Task 2) ✓
- [ ] Storage bucket `social-overlays` created (Task 3) ✓
- [ ] Cron registered in `vercel.json` (Task 26) ✓
- [ ] Cron preview returns sane content for 5 random businesses (Task 12 Step 3) ✓
- [ ] Generated overlay renders correctly (visual check, requires actual templates)
- [ ] Approve → reject → re-pick flow works without double-spotlight (manual test, requires templates + seed)
- [ ] Bio-link `/go/ig` redirects with correct UTM (Task 13 Step 3 + Task 29) ✓
- [ ] `directory_events.utm_campaign` populated end-to-end after click (Task 15 Step 5) ✓
- [ ] `data/brand.ts` IG handle set (Task 27) ✓
- [ ] 5+ overlay templates designed and dropped into `public/social-templates/` — **owner-action, external task**
- [ ] Playwright admin-social spec passes locally (Task 29 Step 3) ✓

- [ ] **Step 2: Open a PR**

```bash
git push -u origin feat/social-ig-autopilot
gh pr create --title "feat(social): Instagram spotlight autopilot — Phase 1" --body "$(cat <<'EOF'
## Summary
- Weekly cron generates 5 IG spotlight drafts for unspotlighted businesses
- Admin queue at /admin/social for approve / edit / reject / regen / mark-posted
- /go/ig bio-link redirect stamps utm_campaign so directory_events + purchases attribute back to specific spotlights
- Phase 1 ships without Meta Graph publisher (Phase 2 layer-on when verification clears)

Spec: docs/superpowers/specs/2026-05-25-hilton-head-ig-spotlight-autopilot-design.md
Plan: docs/superpowers/plans/2026-05-25-hilton-head-ig-spotlight-autopilot.md

## Test plan
- [ ] Migration 023 applied in Supabase
- [ ] Storage bucket `social-overlays` exists and is public-read
- [ ] `curl /api/cron/social-generate?preview=true` returns 5 picks with captions
- [ ] /admin/social renders queue with at least seeded drafts
- [ ] /go/ig 302s to a /local/* URL with utm_source=instagram
- [ ] Click on a /local/* page produces a directory_events row with utm_campaign populated
- [ ] 5+ overlay templates in public/social-templates/ (owner task)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: No commit (PR is the artifact)**

Done.

---

## Owner-action checklist (run in parallel with code, not blocking Phase 1 merge)

1. Convert IG account to Business (free, 5 min in IG app)
2. Link IG account to a Facebook Page (~10 min)
3. File Meta Business Verification at business.facebook.com (1–3 wk review)
4. Design 5+ overlay templates in Figma/Canva, export as 1080×1080 PNG into `public/social-templates/spotlight-v{1..N}.png` + matching `.json` manifests (schema in `app/lib/social/types.ts::OverlayManifest`)

Phase 2 unlocks when (1)–(3) complete: write a `social-publish` cron, swap `Mark posted` from "paste URL" to "auto-fill from API response."
