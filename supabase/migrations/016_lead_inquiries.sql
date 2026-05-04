-- Hilton Ahead: lead inquiries from the new monetization pages.
--
-- Three flavors share one table:
--   - 'relocation': /move-to-hilton-head leads (real estate referral pipeline)
--   - 'owner':      /sell-or-rent-your-villa leads (property mgmt + real estate)
--   - 'wedding':    /hilton-head-wedding-inquiry leads (resold to venue/vendor partners)
--
-- One table because the access pattern is identical (anon insert, admin read,
-- triage in one inbox view) and the type-specific fields are shallow enough
-- to live in a jsonb `details` column. If a lead type grows its own
-- workflow/columns, promote it then.
--
-- Mirrors itinerary_requests (001) on RLS posture: anon-insert, no-public-read,
-- updated_at trigger via shared set_updated_at() helper.
--
-- Idempotent.

create table if not exists public.lead_inquiries (
  id            uuid primary key default gen_random_uuid(),
  lead_type     text not null
                check (lead_type in ('relocation', 'owner', 'wedding')),
  email         text not null,
  full_name     text,
  phone         text,
  notes         text,
  -- Type-specific structured fields:
  --   relocation: { timeline, budget, neighborhoods[], buying_or_renting }
  --   owner:      { property_type, neighborhood, current_use, intent }
  --   wedding:    { wedding_date, guest_count, budget, venue_type, ceremony_or_reception }
  details       jsonb,
  source        text not null,
  user_agent    text,
  status        text not null default 'new'
                check (status in ('new', 'contacted', 'qualified', 'sold', 'archived')),
  -- For wedding leads we also track which vendors received this lead (text[]).
  -- For relocation/owner this stays null. Lightweight enough to keep in-row.
  routed_to     text[],
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_lead_inquiries_type_created
  on public.lead_inquiries (lead_type, created_at desc);
create index if not exists idx_lead_inquiries_status
  on public.lead_inquiries (status);
create index if not exists idx_lead_inquiries_email
  on public.lead_inquiries (email);

alter table public.lead_inquiries enable row level security;

-- Anon inserts via the public form routes.
drop policy if exists "Anyone can submit lead inquiry" on public.lead_inquiries;
create policy "Anyone can submit lead inquiry"
  on public.lead_inquiries for insert
  with check (true);

-- No public reads. Service role bypasses RLS for the admin dashboard.
drop policy if exists "No public read access" on public.lead_inquiries;
create policy "No public read access"
  on public.lead_inquiries for select
  using (false);

-- Reuse the updated_at trigger fn from migration 001.
drop trigger if exists trg_lead_inquiries_updated_at on public.lead_inquiries;
create trigger trg_lead_inquiries_updated_at
  before update on public.lead_inquiries
  for each row
  execute function public.set_updated_at();
