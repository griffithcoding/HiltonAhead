# Instagram Spotlight Autopilot — Phase 1 Design Spec

**Date:** 2026-05-25
**Owner:** William Griffith
**Status:** Approved (brainstorm phase) — pending implementation plan
**Branch target:** `feat/social-ig-autopilot`

## 1. Purpose

Build a weekly content engine that turns the existing `data/localBusinesses.ts` directory into a steady drip of branded Instagram spotlight posts whose primary job is to drive **B2B directory upsells** (the lever activated by the just-shipped B6 sales engine).

The system runs on a Monday cron, generates 5 draft posts per week, surfaces them in an admin approval queue, and — after a human approves — yields a ready-to-post caption + branded PNG that the admin posts to Instagram manually. A single Instagram bio link (`/go/ig`) redirects with a per-post UTM campaign so directory clicks, signups, and Stripe purchases attribute back to the specific spotlight that drove them.

This is **Phase 1**. It deliberately ships **without** the Meta Graph API publisher so that the project is not gated by Meta Business verification (1–3 week unpredictable review). Phase 2 layers the publisher on top as a 1–2 day add when Meta access lands.

## 2. Non-Goals

- No Meta Graph API integration in Phase 1 (deferred to Phase 2).
- No platforms beyond Instagram (Facebook crosspost, Pinterest, TikTok, YouTube Shorts, X all explicitly out).
- No AI-generated imagery — overlays composed from existing curated photos only.
- No inbound DM/comment automation. No reply bot.
- No social-platform analytics ingest (Meta Insights API). Attribution lives in our own DB via UTM stamps.
- No multi-admin collaboration features (single-admin app, optimistic concurrency check is sufficient).
- No A/B testing of captions or templates in v1.
- No scheduling beyond a fixed Tue–Sat 10:00 ET slot per week.

## 3. Decisions Locked During Brainstorm

| # | Decision | Rationale |
|---|---|---|
| 1 | Primary revenue lever = **directory upsells (B2B)** | Aligns with B6 sales engine just shipped; tightest existing infra match. |
| 2 | Platform = **Instagram only** | Single Meta API surface (when Phase 2 ships); B2B tag mechanic strongest on IG; overrides earlier `brand.ts` "IG + LinkedIn" note. |
| 3 | Automation mode = **queue + approve** | IG bans accounts that mass-post or wrong-tag. Human gate protects the account and the relationships. |
| 4 | Post format = **business spotlight** (1 post = 1 featured business) | Direct B2B lever — tagged business owner gets notification → claim/upgrade CTA. |
| 5 | Image source = **branded overlay on `data/photos.ts`** | Deterministic, $0 marginal cost, on-brand, no AI-image policy risk. |
| 6 | Approach = **A (engine + queue, no publisher) for Phase 1** | Decouples ship date from Meta verification. Publisher is a thin add. |

## 4. Architecture

```
Mon 13:00 UTC ─► /api/cron/social-generate (Bearer CRON_SECRET)
                       │
                       ▼
   app/lib/social/rotation.ts ─► picks 5 businesses not spotlighted in 12wk
                       │
                       ▼
   app/lib/social/caption.ts ──► Claude (anthropic SDK) ─► caption + hashtags
                       │
                       ▼
   app/lib/social/overlay.ts ──► Sharp ─► branded PNG buffer
                       │
                       ▼
   app/lib/social/storage.ts ──► Supabase Storage (bucket: social-overlays)
                       │
                       ▼
   INSERT social_posts (status='draft', scheduled_at=Tue–Sat 10:00 ET slot)
   UPSERT social_rotations (last_spotlighted_at = now())
                       │
                       ▼
   app/lib/email.ts ──► notifyAdminSocialQueue('5 drafts ready')

Admin opens /admin/(gated)/social
   ├─ DraftCard list (caption + overlay preview + business + scheduled slot)
   ├─ Approve  → status='approved', reviewed_by/at recorded
   ├─ Edit     → caption editable, image regenerable (capped at 3 regens/draft)
   ├─ Reject   → status='rejected', edit_notes required, rotation rolled back
   └─ Reschedule → adjust scheduled_at

Admin posts to IG manually (at slot or any time)
   └─ "Mark posted" → paste IG permalink → status='published'

Viewer clicks IG bio link (constant URL = hiltonahead.com/go/ig)
   └─ /api/social/bio-link (public, edge-cached 60s)
        resolves current featured = most recent published OR scheduled today
        302 → /local/<industry_slug>/<business_slug>
              ?utm_source=instagram&utm_medium=social&utm_campaign=<post.utm_campaign>

/local/[industry]/[slug] page renders
   └─ existing trackDirectoryEvent fires beacon → /api/directory/track
      → directory_events row with utm_campaign captured

Stripe checkout (existing /api/checkout) also persists utm_campaign on purchase

Attribution view  /admin/(gated)/social/attribution
   └─ SELECT post.*, COUNT(events), COUNT(purchases), SUM(purchases.amount)
        FROM social_posts post
        LEFT JOIN directory_events e ON e.utm_campaign = post.utm_campaign
        LEFT JOIN purchases p ON p.utm_campaign = post.utm_campaign
        GROUP BY post.id
        ORDER BY post.published_at DESC
```

### 4.1 Trust boundaries

- **Cron endpoint** → Bearer-gated via `CRON_SECRET` (existing pattern from `/api/cron/directory-prospect-scan`)
- **Admin UI + every server action** → `requireAdmin()` from `utils/supabase/admin.ts` (CLAUDE.md hard rule)
- **Bio-link redirect** → public, no auth, no user input echoed; destination always server-resolved
- **Supabase service-role client** → cron and admin server actions only; never imported in client components or unauthenticated public routes

## 5. Components & Files

### 5.1 New files

```
app/lib/social/
  rotation.ts          # pick N businesses, dedupe vs last 12wk spotlights
  caption.ts           # Claude prompt + caption generator + template fallback
  hashtags.ts          # static + dynamic tag mixer per business
  overlay.ts           # Sharp PNG composer (template + dynamic text)
  storage.ts           # Supabase Storage upload + signed URL helper
  bioLink.ts           # current-featured resolver for /go/ig
  types.ts             # SocialPost, DraftInput, OverlayTemplate, RotationPick

app/api/cron/social-generate/route.ts    # Mon 13:00 UTC, Bearer-gated, ?preview=true supported
app/go/ig/route.ts                       # public 302 redirect rotator (preferred path; see §12.1)
   # alternate: app/api/social/bio-link/route.ts — same handler, different URL surface

app/admin/(gated)/social/
  page.tsx             # queue list view (drafts → approved → scheduled)
  [id]/page.tsx        # single-draft editor
  actions.ts           # approve, edit, reject, regenerate, mark-published, reschedule
  attribution/
    page.tsx           # joined view: post → clicks → upgrades → revenue

components/admin/social/
  DraftCard.tsx        # caption + image + business + scheduled slot
  OverlayPreview.tsx   # live PNG preview when editing
  RotationBadge.tsx    # "last spotlighted N weeks ago"
  MarkPostedModal.tsx  # IG permalink paste + URL regex validation

supabase/migrations/022_social_posts.sql                 # ✅ already ran in DB 2026-05-25
supabase/migrations/023_social_attribution_columns.sql   # pending — adds utm_campaign cols + indexes

public/social-templates/
  spotlight-v1.png     # base overlay template (logo + safe zones)
  spotlight-v2.png     # alternate (caption-heavy variant)
  spotlight-v3.png     # alternate (photo-heavy variant)
  # ~5–10 templates total, hand-designed once in Figma/Canva by owner

scripts/seed-social-drafts.ts   # dev convenience, inserts 5 mock drafts
tests/admin-social.spec.ts      # Playwright queue-flow tests
```

### 5.2 Reused / extended (no new deps)

- `data/brand.ts` — set `social.instagram` to real handle (currently empty)
- `data/localBusinesses.ts` — read-only consumer; no schema change
- `data/photos.ts` — read-only photo pool for overlay base
- `utils/supabase/service.ts` — service-role client for cron + server actions
- `utils/supabase/admin.ts` — `requireAdmin()` gate on every server action
- `app/lib/email.ts` — extend with `notifyAdminSocialQueue(payload)` Slack/email ping
- `vercel.json` — register `0 13 * * 1` cron (09:00 ET in EST; revisit DST per season)

### 5.3 File-size guardrails

- Each `app/lib/social/*.ts` file ≤ 200 LOC, single purpose
- `actions.ts` splits into `actions/{approve,edit,reject,regenerate,publish}.ts` if one grows complex
- No business logic in route handlers — handlers parse + delegate to `lib/social/*`

### 5.4 Dependencies (existing, no installs)

- `@anthropic-ai/sdk` `^0.97.1` — already in `package.json`
- `sharp` — already a Next.js peer dependency
- `@supabase/ssr` + `@supabase/supabase-js` — already in use

## 6. Data Model

### 6.1 `supabase/migrations/022_social_posts.sql` (deployed 2026-05-25)

```sql
create table public.social_posts (
  id              uuid primary key default gen_random_uuid(),
  business_slug   text not null,                    -- from data/localBusinesses.ts
  industry_slug   text not null,                    -- maps /local/[industry]/[slug]
  platform        text not null default 'instagram',
  caption         text not null,
  hashtags        text[] not null default '{}',
  image_path      text,                              -- supabase storage object key
  image_url       text,                              -- public CDN URL (cached)
  overlay_template text not null,                   -- e.g. 'spotlight-v1'
  status          text not null default 'draft'
                  check (status in ('draft','approved','rejected','published','skipped')),
  scheduled_at    timestamptz not null,             -- slot suggested by generator
  published_at    timestamptz,                       -- when admin marks posted
  ig_permalink    text,                              -- pasted by admin after manual post
  utm_campaign    text not null,                    -- 'spotlight-<slug>-<yymmdd>'
  created_by_ai   boolean not null default true,
  generated_by_model text,                          -- e.g. 'claude-sonnet-4'
  generation_cost_usd numeric(8,4),                 -- spend per draft
  regen_count     int not null default 0,           -- bound to 3 in app
  reviewed_by     uuid references public.admin_users(id),
  reviewed_at     timestamptz,
  edit_notes      text,                              -- admin reason for edit/reject
  created_at      timestamptz not null default now()
);

create index social_posts_status_scheduled_idx on public.social_posts (status, scheduled_at);
create index social_posts_utm_idx              on public.social_posts (utm_campaign);
create index social_posts_business_idx         on public.social_posts (business_slug, created_at desc);

create table public.social_rotations (
  business_slug        text primary key,
  last_spotlighted_at  timestamptz not null,
  spotlight_count      int not null default 0,
  updated_at           timestamptz not null default now()
);

alter table public.social_posts     enable row level security;
alter table public.social_rotations enable row level security;

create policy social_posts_admin_all     on public.social_posts
  for all using (public.is_admin()) with check (public.is_admin());
create policy social_rotations_admin_all on public.social_rotations
  for all using (public.is_admin()) with check (public.is_admin());
```

### 6.2 `supabase/migrations/023_social_attribution_columns.sql` (pending)

```sql
-- additive: per-row UTM campaign attribution from IG bio link → directory events + purchases
alter table public.directory_events add column if not exists utm_campaign text;
alter table public.purchases        add column if not exists utm_campaign text;

create index if not exists directory_events_utm_idx
  on public.directory_events (utm_campaign) where utm_campaign is not null;
create index if not exists purchases_utm_idx
  on public.purchases       (utm_campaign) where utm_campaign is not null;
```

### 6.3 Supabase Storage bucket

- **Name:** `social-overlays`
- **Access:** public read, service-role write
- **Path:** `spotlight/<yyyy>/<mm>/<post-id>.png`
- **Setup:** one-time bucket creation via SQL or Supabase dashboard during Phase 1 plan execution.

## 7. UTM Contract (load-bearing)

- **Format:** `spotlight-<business-slug>-<yymmdd>` (e.g. `spotlight-skull-creek-boathouse-260601`)
- **Stamped by:** `/api/social/bio-link` redirect only — never by the IG caption itself (cleaner UTM, no human typing risk)
- **Captured by:** existing `trackDirectoryEvent` (in `app/lib/directoryTracking.ts`) extended to read `utm_campaign` query param from `window.location` and POST it to `/api/directory/track`
- **Persisted to:** `directory_events.utm_campaign` (migration 023)
- **Joined to revenue:** existing `/api/checkout` and Stripe webhook extended to capture `utm_campaign` from session metadata and persist into `purchases.utm_campaign` (migration 023)

## 8. Error Handling & Ops

### 8.1 Cron (`/api/cron/social-generate`)

- Bearer-gated via `CRON_SECRET`; 401 if missing/wrong.
- `?preview=true` dry-run returns picked businesses + sample caption JSON; no DB writes.
- **Idempotency:** if `social_posts` already has ≥5 drafts with `created_at::date = today`, return 200 with `{skipped: 'already-generated'}`. (N=5 is the per-week draft count; one cron run per week is expected.)
- **Partial failure:** per-business work runs in `try/catch`. One failure does not kill the batch. Failed businesses logged with reason and **not** advanced in rotation (eligible again next week).
- **Soft spend cap:** env `SOCIAL_GENERATE_MAX_USD` (default `2.00`). Tracks Claude usage; halts mid-run with `{stopped: 'cost-cap'}` if exceeded.

### 8.2 LLM (`app/lib/social/caption.ts`)

- Anthropic rate limit (429) → exponential backoff, max 3 retries, then fail that business.
- Content policy block → caption falls back to **template-only** caption (no LLM polish); draft inserted with `edit_notes='LLM-content-filtered, template fallback'`.
- Timeout (>30s per business) → abort, log, continue.
- **Prompt-injection guard:** business name/description piped into prompt is escaped and length-capped at 500 chars.

### 8.3 Overlay (`app/lib/social/overlay.ts`)

- Sharp throws (missing template, corrupt base photo) → draft inserted with `image_path=null, image_url=null`, `edit_notes='overlay-failed: <reason>'`. Admin sees "Image missing — upload manually" prompt in queue.
- Slow render (>10s) logged for template review; not a failure.

### 8.4 Storage

- Upload retries once. If still fails → null image fields, manual upload prompt in queue.
- Bucket misconfig → fail fast with explicit error naming bucket + role; never silent-fallback to anon client.

### 8.5 Admin queue

- **Stale drafts:** `scheduled_at` in past AND `status='draft'` → flagged "OVERDUE" in UI, sorted top. No auto-action.
- **Race:** optimistic concurrency via `updated_at` check in server action; conflict → 409 with reload prompt. (Future-proof; single-admin today.)
- **Regen cap:** `regen_count >= 3` disables regen buttons; admin can still hand-edit.
- **Reject:** rolls back `social_rotations.last_spotlighted_at` to prior value so the business re-enters the pool. `edit_notes` mandatory.
- **Mark-published:** IG permalink validated against URL regex (`/^https:\/\/(www\.)?instagram\.com\/p\/[\w-]+\/?$/`); soft validation only.

### 8.6 Bio-link (`/api/social/bio-link` or `/go/ig`)

- Public, no auth. Edge-cached 60s (`Cache-Control: public, s-maxage=60`).
- If no current featured post → 302 to `data/brand.ts` default CTA (homepage).
- UTM appended via `URLSearchParams` (never string-concat) to handle `?` already present in destination.
- No PII; no user input echoed in redirect target.

### 8.7 Observability

- Cron emits structured log: `{run_id, drafts_generated, drafts_failed, total_cost_usd, duration_ms}`.
- Slack/email ping on every run via extended `app/lib/email.ts`:
  - **success:** "5 drafts ready → /admin/social"
  - **partial/fail:** "3/5 drafts ready (2 failed). Open queue → /admin/social"
- Weekly digest cron deferred to Phase 1.5 (not in spec scope).

### 8.8 Secrets

| Var | Source | Phase |
|---|---|---|
| `ANTHROPIC_API_KEY` | already present per existing SDK install — verify in `.env.local` | 1 |
| `SOCIAL_GENERATE_MAX_USD` | new env, default `2.00` | 1 |
| `CRON_SECRET` | existing | 1 |
| `IG_GRAPH_TOKEN`, `IG_BUSINESS_ID`, `FB_PAGE_ID` | Meta Graph API | 2 (not Phase 1) |

## 9. Testing

CLAUDE.md confirms there is no unit-test runner configured. Three-tier verification:

### 9.1 Cron smoke (manual)

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  "http://localhost:3000/api/cron/social-generate?preview=true"
```

Asserts: JSON `{businesses: [...], sampleCaption, sampleHashtags}`. No DB writes confirmed via row-count diff before/after.

### 9.2 Playwright (`tests/admin-social.spec.ts`)

Extends existing `tests/` Playwright setup.

- Seed 3 drafts via service-role helper in `beforeAll`
- Authenticate via existing test auth helper or saved storage state
- Load `/admin/social`, assert 3 draft cards render
- Approve → status flips, card moves to "approved" section
- Edit → caption editable; regen disabled after 3 clicks
- Reject → modal forces `edit_notes`; draft disappears from active list
- Mark Posted with invalid URL → validation error visible, no DB write
- Mark Posted with valid IG URL → status='published', `ig_permalink` persisted

### 9.3 SQL spot-checks (run in Supabase SQL editor)

- Rotation cooldown: `SELECT * FROM social_rotations WHERE last_spotlighted_at > now() - interval '12 weeks';` — these slugs MUST NOT appear in next cron's pick.
- RLS isolation: as `anon` role, `SELECT * FROM social_posts` returns 0 rows.
- Index hit: `EXPLAIN ANALYZE` on the attribution join confirms `social_posts_utm_idx` is used.

### 9.4 Seed script

`scripts/seed-social-drafts.ts` inserts 5 mock drafts so admin UI is non-empty for local development without running the cron.

### 9.5 Manual pre-ship checklist

- [ ] Cron preview returns sane content for 5 random businesses
- [ ] Generated overlay renders correctly (3 templates × 3 photos visual check)
- [ ] Approve → reject → re-pick flow works without double-spotlight in same week
- [ ] Bio-link redirect stamps correct UTM, hits `/local/[industry]/[slug]`
- [ ] `directory_events.utm_campaign` populated end-to-end after click
- [ ] Slack/email ping arrives on cron success and on simulated failure
- [ ] LLM spend cap actually halts a runaway run (force by setting cap=$0.01)

## 10. Phase 2 (out of scope here, sketched for continuity)

When Meta Business verification clears (1–3 weeks of paperwork run in parallel with Phase 1 code work):

- New env: `IG_GRAPH_TOKEN`, `IG_BUSINESS_ID`, `FB_PAGE_ID`
- New cron: `/api/cron/social-publish` every 30 min — finds approved posts whose `scheduled_at <= now()`, calls Meta Graph API (image-then-caption two-call dance for IG containers), writes back `ig_post_id` + `ig_permalink`, flips status to `published`.
- "Mark posted" admin button becomes optional fallback.
- ~1–2 days of code on top of Phase 1.

## 11. Risks

| # | Risk | Mitigation |
|---|---|---|
| 1 | Meta verification stalls indefinitely | Phase 1 immune by design — no Meta dependency. |
| 2 | Claude content-policy false positive on caption | Template-only fallback path; draft still ships with admin edit flag. |
| 3 | LLM cost runaway (loop, retries, regen-spam) | `SOCIAL_GENERATE_MAX_USD` cap + per-draft `regen_count <= 3` ceiling. |
| 4 | Wrong-business tag in caption | Admin queue is the gate. No auto-publish in v1. Mark-published is human-driven. |
| 5 | Stale `data/localBusinesses.ts` slugs (page no longer exists) | Generator validates each picked slug resolves to a real `/local/[industry]/[slug]` route before drafting. |
| 6 | IG account flagged for spammy posting pattern | Single cron, 5 posts/week, varied captions, no auto-publish, no mass tagging. |
| 7 | Bio-link redirect picks "wrong" current-featured post (race vs schedule) | Resolver order: `published` today first, else `approved` whose `scheduled_at <= now()`, else fallback CTA. Deterministic. |
| 8 | Owner workload: weekly review feels like a chore and queue stalls | Slack ping is the prompt; OVERDUE flag is the consequence visible in admin. Weekly digest in 1.5 if needed. |

## 12. Open Questions (resolve during plan phase, not before)

1. **Bio-link path:** `/go/ig` (short, marketing-friendly) or `/api/social/bio-link` (canonical, API-route-y)? Lean `/go/ig`.
2. **Slack vs email** for cron notification: today the codebase uses Resend; Slack would require a webhook env var. Default to Resend email; Slack later.
3. **Overlay template authoring:** PNG with safe-zone metadata in JSON sidecar, or Figma export with hardcoded coordinates in `overlay.ts`? Lean sidecar JSON for hot-swap without code changes.
4. **Time zone for `scheduled_at`:** store UTC always (standard); UI renders ET. Confirm during plan phase.

## 13. Definition of Done (Phase 1)

- Migration 023 deployed (022 already deployed).
- Storage bucket `social-overlays` created.
- Cron registered in `vercel.json` and observed running on first Monday post-deploy.
- 5 draft posts visible in `/admin/social` after first cron run.
- Approve → mark-posted flow works end-to-end on at least one real spotlight.
- Bio-link `/go/ig` redirects with correct UTM and resolves to the live featured `/local/*` page.
- `directory_events.utm_campaign` populated for at least one click attributable to a published spotlight.
- `data/brand.ts` has the real IG handle set.
- 5+ overlay templates designed and dropped into `public/social-templates/`.
- Playwright admin-social spec passes locally.
