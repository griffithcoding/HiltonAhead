-- 025_market_trends.sql
-- Real estate market trends (Redfin Data Center) + referral inquiries.
-- NOTE: numbered 025 because 013–024 are already taken on this branch
--       (013_affiliate_events.sql through 024_lead_email_engine.sql).
--       Two 023_* files exist (same 002_* quirk pattern).

-- ── market_trends ──────────────────────────────────────────────────────────
create table if not exists public.market_trends (
  id uuid primary key default gen_random_uuid(),
  neighborhood_slug text not null,
  month date not null,
  median_sale_price numeric,
  median_ppsf numeric,
  median_dom integer,
  homes_sold integer,
  yoy_pct numeric,
  source text not null default 'redfin-data-center',
  source_url text,
  fetched_at timestamptz not null default now(),
  unique (neighborhood_slug, month)
);

create index if not exists market_trends_slug_month_idx
  on public.market_trends (neighborhood_slug, month desc);

alter table public.market_trends enable row level security;

-- Public read (market data is non-sensitive, displayed on public pages).
create policy "Public can read market trends"
  on public.market_trends for select
  using (true);

-- Writes only via service role (cron) or admins.
create policy "Admins manage market trends"
  on public.market_trends for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── real_estate_inquiries ───────────────────────────────────────────────────
create table if not exists public.real_estate_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  neighborhood_slug text,
  name text not null,
  email text not null,
  phone text,
  message text,
  intent text,            -- 'buying' | 'selling' | 'both' | 'browsing'
  source_url text,
  ip_hash text            -- SHA-256, mirrors directory_events
);

alter table public.real_estate_inquiries enable row level security;

-- Anonymous insert (public form), mirrors itinerary_requests.
create policy "Anyone can submit a real estate inquiry"
  on public.real_estate_inquiries for insert
  with check (true);

-- No anonymous read — admin/service-role only.
create policy "No public read of inquiries"
  on public.real_estate_inquiries for select
  using (public.is_admin());
