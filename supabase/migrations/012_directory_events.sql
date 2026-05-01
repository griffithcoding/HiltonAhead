-- Hilton Ahead: Local Directory event tracking.
--
-- Captures outbound interactions on /local/[industry] business cards so we
-- can show owners what their listing is sending them, and gate the paid
-- partner upsell on real attribution data instead of vibes.
--
-- Writer: /api/directory/track (service-role, public route, validated input).
-- Reader: /admin/directory dashboard via service-role; admins inherit through
-- the existing admin-gated layout.
--
-- IP is hashed (SHA-256, server-side) so we can deduplicate without storing
-- raw addresses. We store the truncated user-agent for bot filtering, not
-- fingerprinting.
--
-- Depends on: 003_admin_crm.sql (is_admin). Idempotent.

create table if not exists public.directory_events (
  id              uuid primary key default gen_random_uuid(),
  -- Business.id from data/localBusinesses.ts (URL-safe within industry).
  business_id     text not null,
  industry_slug   text not null,
  event_type      text not null
                  check (event_type in (
                    'phone_click', 'website_click', 'inquiry_submit'
                  )),
  ip_hash         text,
  user_agent      text,
  referrer        text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_dir_events_business_created
  on public.directory_events (business_id, created_at desc);
create index if not exists idx_dir_events_industry_created
  on public.directory_events (industry_slug, created_at desc);
create index if not exists idx_dir_events_type_created
  on public.directory_events (event_type, created_at desc);

-- ============================================================================
-- RLS — deny by default. Service role (used by /api/directory/track and the
-- admin dashboard query) bypasses RLS. Admins reading via the admin client
-- get an explicit policy below for safety even though the dashboard route
-- uses service_role.
-- ============================================================================
alter table public.directory_events enable row level security;

drop policy if exists "Admins can read directory_events" on public.directory_events;
create policy "Admins can read directory_events"
  on public.directory_events for select
  using (public.is_admin());
