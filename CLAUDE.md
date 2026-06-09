# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working rules

- Do not make any changes until you have 95% confidence in what you need to build.
- Do not use git worktrees. Keep at most 1–2 active branches and name them after the task.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind 4 (CSS-based config in `app/globals.css`) · Supabase (`@supabase/ssr`) · Resend · Stripe · Google APIs (Gmail/Calendar via `googleapis`) · Calendly webhook. Path alias `@/*` resolves to the repo root.

## Commands

- `npm run dev` — Turbopack dev server at http://localhost:3000
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint (`eslint-config-next`)
- `npm run typecheck` — `tsc --noEmit`
- `npx playwright test` — Playwright (chromium/firefox/webkit; tests in `tests/`)
  - Single test: `npx playwright test tests/example.spec.ts -g "title"`

There is no unit-test runner configured.

## High-level architecture

### Public marketing surface
App Router pages live under `app/`. There are dozens of SEO landing pages (`hilton-head-*`, `bluffton-travel-planner`, `harbour-town-villas`, `local/[industry]`, `hilton-head-weather/[month]`, `blog/[slug]`, `stories/[slug]`, etc.). Pages are typically thin shells over modules in `data/`.

All brand-surface values (name, color, domain, CTA target, contact email, social links, scheduling URLs) come from `data/brand.ts`. **Never hardcode them anywhere else** — pages, metadata, schema, and components all import from `brand`.

### Content lives in `data/`
`posts.ts`, `stories.ts`, `localBusinesses.ts`, `partners.ts`, `events.ts`, `pricing.ts`, `photos.ts`, `tripTypes.ts`, `neighborhoods.ts`, `testimonials.ts`, `nav.ts`, `footerLinks.ts`, `services.ts`, `faq.ts`, `hero.ts`, `insiderProof.ts`, `months.ts`, `current-plan.ts`. Add new content in these modules, not inline in JSX.

### Admin / CRM at `app/admin/(gated)/`
The `(gated)` route group is gated by `app/admin/(gated)/layout.tsx`, which calls `getAdminUser()` from `utils/supabase/admin.ts` and redirects to `/admin/login` on miss. Sections: Dashboard, Leads (`leads/[type]/[id]` where `type ∈ {itinerary, newsletter, lead}`), Purchases, Meetings, Directory, Backlink Outreach.

**Server actions live in `app/admin/(gated)/**/actions.ts`. Every exported server action MUST start with `requireAdmin()` from `utils/supabase/admin.ts`.** The `(gated)` route group only guards navigation — it does not protect direct POSTs to server-action endpoints.

### Supabase clients — three variants, pick the right one
- `utils/supabase/client.ts` — browser client. Only for client components.
- `utils/supabase/server.ts` (`createClient`) — SSR client using anon key + user cookies. Use in server components, server actions, and route handlers acting as the signed-in user.
- `utils/supabase/service.ts` (`createServiceClient`) — service-role, bypasses RLS. Use **only** in trusted server contexts (cron handlers, webhooks, server actions that already verified admin or a Bearer secret). Never import from a client component or unauthenticated public route.
- `utils/supabase/admin.ts` exposes `getAdminUser()`, `requireAdmin()` (the gate every admin server action must call), and re-exports `createClient` as `createAdminClient`.

### Auth
Google OAuth via Supabase; callback at `app/auth/callback/route.ts`. Admin allowlist lives in the `admin_users` table with case-insensitive email match. An entry in `admin_users` is the gate — being signed in is not enough. The `is_admin()` SQL helper from migration `003_admin_crm.sql` is the canonical RLS check.

### Migrations
`supabase/migrations/*.sql`, applied via the Supabase CLI or pasted into the SQL editor. **Numbering quirk:** several numbers have duplicate-prefix collisions — `002` (`002_newsletter_subscribers.sql` + `002_business_inquiries.sql`), `014` (`014_directory_events_payload_and_events.sql` + `014_sponsor_events.sql`), and `023` (`023_outreach_email_engine.sql` + `023_social_attribution_columns.sql`); `011` is skipped entirely. Don't trust the highest filename — run `ls supabase/migrations/` and pick the next number that clashes with nothing. Latest is `025_market_trends.sql`, so the next free number is `026`. Migrations include their own RLS policies.

### Itinerary form pipeline
Public form at `/itinerary` POSTs to `/api/itinerary` → inserts into `itinerary_requests` (anon-only insert, no read by design) and emails via Resend. Reading submissions requires the service role; that's how the admin Leads dashboard sees them.

### Directory attribution pipeline
`app/lib/directoryTracking.ts` provides:
- `withDirectoryUtm(url, businessId)` — server- and client-safe UTM stamping for outbound URLs.
- `trackDirectoryEvent(businessId, industrySlug, eventType)` — browser, fire-and-forget via `sendBeacon` with `fetch` fallback.

Events POST to `/api/directory/track` and land in `directory_events` (IP is SHA-256 hashed server-side). `/admin/directory` aggregates per business. When adding outbound-link components on `/local/*` pages, use the `Tracked*` wrappers in `components/local/` rather than reinventing the tracking call.

### Email / messaging integrations
- **Resend** (`app/lib/email.ts`) — transactional itinerary + newsletter notifications. Env: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`.
- **Gmail API** (`utils/gmail/client.ts`, `sendEmailFromAdmin`) — used by `ReplyComposer` to send from the admin's own Gmail. Sending is currently intentionally off; the read/compose UI exists but the send path may be feature-flagged or no-op. Verify the current state before claiming "Gmail send works."
- **Google Calendar** (`utils/google-calendar/client.ts`) — read-only meeting fetch for the Meetings dashboard.
- **Calendly webhook** (`app/api/calendly/webhook/route.ts`) — HMAC-verified via `CALENDLY_WEBHOOK_SIGNING_KEY`. One-time registration script: `scripts/calendly-register-webhook.ts`.
- **Stripe** (`app/api/checkout/route.ts`, `app/api/stripe/webhook/route.ts`) — purchases flow → `purchases` table.

### Newsletter subsystem
`app/lib/newsletter/{render,seasonal,send,sign,subscribers,topic-discovery}.ts`. Drafts created by `app/api/cron/newsletter-draft/route.ts`; review/decide via `app/api/newsletter/decide/route.ts`; issues persist in `newsletter_issues` (migration `008`). Unsubscribe tokens are HMAC-signed in `sign.ts`.

### Outreach (backlink) subsystem
`app/admin/(gated)/outreach/` + `lib/outreach/{templates,compliance}.ts` + migration `007_outreach_crm.sql`. Tracks pitch opportunities, stages, notes, and publishes.

### LLM SEO / GEO surface
The site is engineered to be cited by ChatGPT / Claude / Gemini / Perplexity for Hilton Head travel queries. Read [the 90-day roadmap](~/.claude/plans/build-llm-seo-roadmap-generic-cerf.md) before changing anything in this section.

**Crawler policy lives in `app/robots.ts`.** `LLM_USER_AGENTS` is the explicit allow-list (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Google-Extended, Applebot-Extended, Meta-ExternalAgent, cohere-ai, DuckAssistBot, Diffbot, +variants). Do **not** add a `Disallow: /` for any LLM crawler. If you ever need to block one, add a named rule above the catch-all `*`.

**`public/llms.txt` and `public/llms-full.txt` are static, manually maintained**, and must be re-synced by hand whenever brand/founder/services/FAQ data changes meaningfully. They are NOT generated from `data/` at build time. The `llms.txt` follows the [llmstxt.org](https://llmstxt.org) spec; `llms-full.txt` is the long-form companion linked from it.

**Schema helpers live in `app/lib/metadata.ts`.** This is the single entry point for every JSON-LD type the site emits. Extend, don't replace. Current types: `generatePageMetadata`, `getTravelAgencySchema`, `getLocalBusinessSchema`, `getOrganizationSchema`, `getPersonSchema`, `getFaqSchema`, `getBreadcrumbSchema`, `getServiceSchema`, `getBlogPostingSchema`, `getStoryArticleSchema`, `getStoriesCollectionSchema`, `getItemListSchema`, `getReviewSchema`, `getPlaceSchema`, `getLodgingBusinessSchema`, `getEventSchema`, `getSportsActivityLocationSchema`, `getHowToSchema`, `getSpeakableSchema`, `getWebSiteSchema`, `getDefinedTermSchema`, `getQaPageSchema`. `getWebSiteSchema()` intentionally omits `potentialAction` (SearchAction) until a real `/search?q=` handler exists — re-add when /search ships.

**Site-wide schema is emitted from `app/layout.tsx`:** `getWebSiteSchema()` + `getOrganizationSchema()`. Per-page schemas (TravelAgency on homepage, FAQPage on /faq, BlogPosting on /blog/[slug], etc.) emit additionally with stable `@id` anchors (`#website`, `#organization`, `#travelagency`, `#localbusiness`, `/founder#person`) so duplicates link rather than conflict.

**`data/founder.ts` is the single source of truth for the founder Person entity.** William Griffith's bio, jobTitle, knowsAbout, sameAs, and image path live here. The `getPersonSchema()` helper reads it. Update here, not in JSX.

**FAQ structure in `data/faq.ts`:** `faq.items` (5 pairs) is the legacy homepage subset; `faqClusters` is the full 8-cluster matrix (30 pairs total) used on `/faq`; `faqAll` is the flat list for FAQPage schema. Add new questions to a cluster, not to `faq.items`. Per-industry FAQ subsets are nested inside `data/localBusinesses.ts` and surface on `/local/[industry]` pages.

**LLM-citation UI components in `components/ui/`:**
- `Breadcrumbs.tsx` — visible breadcrumb UI. Mirror the JSON-LD `getBreadcrumbSchema()` items array. Render on every detail page (about/founder/faq today; expand to blog/neighborhood/local/story).
- `TldrBlock.tsx` — direct-answer block. The `.tldr-block` class is referenced by the `Speakable` JSON-LD selector contract — don't rename without also updating the schema helper callers.
- `QuickFact.tsx` — citable factoid block (`.quick-fact` class). Use 1–3 per long-form post.

**Speakable selector contract.** When emitting `getSpeakableSchema({ cssSelectors })`, the page MUST render a real DOM element matching each selector. Today's active selectors: `.faq-answer`, `.cluster-summary` (on /faq), `.tldr-block` (when TldrBlock is rendered). Adding a selector to the schema without rendering it breaks voice/AI overview previews.

## Design system

Tailwind 4 with CSS-based config in `app/globals.css` (`@theme inline` block). Use the custom palette tokens, not raw hex:

`sand`, `sand-deep`, `sand-soft`, `ocean`, `ocean-deep`, `ocean-light`, `coral`, `coral-deep`, `palm`, `palm-light`, `gold`, `gold-deep`, `ink`, `ink-soft`.

Fonts via `next/font` in `app/layout.tsx`: Fraunces (display, with `opsz`/`SOFT`/`WONK` axes) + Instrument Sans (UI).

## Routing notes

`next.config.ts`:
- Optional rewrite for the Google Search Console HTML-file token: set `GOOGLE_SITE_VERIFICATION_FILE` and `/<token>.html` is served from `/api/google-site-verification`.
- Image `remotePatterns` allow `images.unsplash.com/**` and `images.pexels.com/photos/**` only.
