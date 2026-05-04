-- Hilton Ahead: Business Portal Phase 0/1 — foundation + apply + claim.
--
-- Adds the schema bones for a self-service portal where local businesses
-- can apply for a listing, claim an existing listing, and (in Phase 2+)
-- manage their profile, photos, and rental properties.
--
-- Tables introduced:
--   - businesses              : the dynamic business row (seeded from
--                                data/localBusinesses.ts via scripts/seed-businesses.ts).
--                                During Phase 0/1 the static TS file remains
--                                the SOURCE OF TRUTH for the public /local/*
--                                pages; this table tracks the owner-editable
--                                copy. Phase 2 will swap the public surface
--                                to read from this table.
--   - business_owners         : auth.uid <-> business_id link with a role.
--   - business_applications   : new-listing applications submitted from
--                                /business/apply. Replaces the
--                                business_inquiries flow for portal-bound
--                                applicants. Existing business_inquiries
--                                table stays untouched (covers other inquiry
--                                shapes).
--   - business_claim_requests : token-based "is this your business?" claim
--                                flow. Anon insert; verified by visiting
--                                an emailed link.
--
-- RLS posture:
--   - businesses: public read of approved/published rows; owner-scoped
--     update; admin-managed insert/delete via service role.
--   - business_owners: an owner can read their own row(s); admin manages
--     all rows.
--   - business_applications + business_claim_requests: anon insert;
--     no public read; admin/service-role read.
--
-- Idempotent.

-- ---------------------------------------------------------------------------
-- 1) businesses — owner-editable mirror of the editorial directory
-- ---------------------------------------------------------------------------
create table if not exists public.businesses (
  id                    uuid primary key default gen_random_uuid(),
  -- Stable slug from data/localBusinesses.ts so seeding is idempotent and
  -- the public TS file can map a static row to its dynamic counterpart.
  slug                  text not null unique,
  industry_slug         text not null,
  status                text not null default 'published'
                        check (status in ('draft', 'published', 'archived')),
  tier                  text not null default 'free'
                        check (tier in ('free', 'featured', 'premium')),
  -- Editorial fields — mirror of Business type in data/localBusinesses.ts.
  -- Optional ones may stay null until an owner edits them.
  name                  text not null,
  tagline               text,
  schema_type           text,
  categories            text[] not null default '{}',
  price_range           text,
  review                text,
  notable_for           text,
  address               text,
  city                  text,
  phone                 text,
  website               text,
  hours                 text,
  instagram             text,
  facebook              text,
  hero_image_src        text,
  hero_image_alt        text,
  lat                   double precision,
  lng                   double precision,
  local_quote           text,
  best_for              text,
  parking               text,
  gate_pass             text check (gate_pass in ('sea-pines', 'palmetto-dunes') or gate_pass is null),
  pet_friendly          boolean,
  dress_code            text,
  booking_lead_peak     int,
  booking_lead_off_peak int,
  -- Outreach metadata. Email is also used for claim verification.
  owner_name            text,
  owner_email           text,
  inquiry_routing_email text,
  -- Audit.
  last_verified         timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists idx_businesses_industry on public.businesses(industry_slug);
create index if not exists idx_businesses_status on public.businesses(status);
create index if not exists idx_businesses_tier on public.businesses(tier);
create index if not exists idx_businesses_owner_email on public.businesses(lower(owner_email));

-- ---------------------------------------------------------------------------
-- 2) business_owners — auth.uid <-> business_id
-- ---------------------------------------------------------------------------
create table if not exists public.business_owners (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  business_id   uuid not null references public.businesses(id) on delete cascade,
  role          text not null default 'owner'
                check (role in ('owner', 'manager')),
  created_at    timestamptz not null default now(),
  unique (user_id, business_id)
);

create index if not exists idx_business_owners_user on public.business_owners(user_id);
create index if not exists idx_business_owners_business on public.business_owners(business_id);

-- ---------------------------------------------------------------------------
-- 3) business_applications — new-listing intake from /business/apply
-- ---------------------------------------------------------------------------
create table if not exists public.business_applications (
  id              uuid primary key default gen_random_uuid(),
  business_name   text not null,
  contact_name    text,
  email           text not null,
  phone           text,
  industry_slug   text,
  website         text,
  message         text,
  -- After admin approval, a one-time token is issued. The applicant
  -- visits /business/claim/verify?token=... to bind their auth.uid to
  -- the new business row. Token is null until approved.
  approval_token  text unique,
  approved_at     timestamptz,
  -- The business row created by approval (filled when token is issued).
  business_id     uuid references public.businesses(id) on delete set null,
  status          text not null default 'pending'
                  check (status in ('pending', 'approved', 'rejected', 'archived')),
  user_agent      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_business_apps_email on public.business_applications(lower(email));
create index if not exists idx_business_apps_status on public.business_applications(status);
create index if not exists idx_business_apps_token on public.business_applications(approval_token);

-- ---------------------------------------------------------------------------
-- 4) business_claim_requests — claim an existing listing
-- ---------------------------------------------------------------------------
create table if not exists public.business_claim_requests (
  id            uuid primary key default gen_random_uuid(),
  business_id   uuid not null references public.businesses(id) on delete cascade,
  email         text not null,
  -- Token sent to the listed inquiry_routing_email or owner_email. Visiting
  -- /business/claim/verify?token=... while authenticated as `email` binds
  -- auth.uid to the business row.
  token         text not null unique,
  expires_at    timestamptz not null default (now() + interval '14 days'),
  consumed_at   timestamptz,
  user_agent    text,
  created_at    timestamptz not null default now()
);

create index if not exists idx_claim_requests_business on public.business_claim_requests(business_id);
create index if not exists idx_claim_requests_token on public.business_claim_requests(token);
create index if not exists idx_claim_requests_email on public.business_claim_requests(lower(email));

-- ---------------------------------------------------------------------------
-- 5) Helper: is_business_owner_of(business_id)
-- ---------------------------------------------------------------------------
-- SECURITY DEFINER so it can read business_owners regardless of caller's
-- own RLS visibility (mirrors the is_admin() pattern from migration 003).
create or replace function public.is_business_owner_of(target_business_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.business_owners bo
    where bo.business_id = target_business_id
      and bo.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- 6) RLS — businesses
-- ---------------------------------------------------------------------------
alter table public.businesses enable row level security;

drop policy if exists "Public read of published businesses" on public.businesses;
create policy "Public read of published businesses"
  on public.businesses for select
  using (status = 'published');

drop policy if exists "Owners can read their businesses (any status)" on public.businesses;
create policy "Owners can read their businesses (any status)"
  on public.businesses for select
  using (public.is_business_owner_of(id));

drop policy if exists "Owners can update their businesses" on public.businesses;
create policy "Owners can update their businesses"
  on public.businesses for update
  using (public.is_business_owner_of(id))
  with check (public.is_business_owner_of(id));

-- Insert + delete are admin/service-role only (no policy = denied for anon/auth).

-- ---------------------------------------------------------------------------
-- 7) RLS — business_owners
-- ---------------------------------------------------------------------------
alter table public.business_owners enable row level security;

drop policy if exists "Owners can read their own owner rows" on public.business_owners;
create policy "Owners can read their own owner rows"
  on public.business_owners for select
  using (user_id = auth.uid());

-- Insert/update/delete are admin/service-role only.

-- ---------------------------------------------------------------------------
-- 8) RLS — business_applications
-- ---------------------------------------------------------------------------
alter table public.business_applications enable row level security;

drop policy if exists "Anyone can submit a business application" on public.business_applications;
create policy "Anyone can submit a business application"
  on public.business_applications for insert
  with check (true);

drop policy if exists "Applicants can read their own application by email" on public.business_applications;
create policy "Applicants can read their own application by email"
  on public.business_applications for select
  using (auth.jwt() ->> 'email' is not null
         and lower(auth.jwt() ->> 'email') = lower(email));

-- Update/delete are admin/service-role only.

-- ---------------------------------------------------------------------------
-- 9) RLS — business_claim_requests
-- ---------------------------------------------------------------------------
alter table public.business_claim_requests enable row level security;

drop policy if exists "Anyone can submit a claim request" on public.business_claim_requests;
create policy "Anyone can submit a claim request"
  on public.business_claim_requests for insert
  with check (true);

-- Service role consumes tokens; no public read (token in URL is the auth signal).

-- ---------------------------------------------------------------------------
-- 10) updated_at triggers (reuses set_updated_at from migration 001)
-- ---------------------------------------------------------------------------
drop trigger if exists trg_businesses_updated_at on public.businesses;
create trigger trg_businesses_updated_at
  before update on public.businesses
  for each row
  execute function public.set_updated_at();

drop trigger if exists trg_business_apps_updated_at on public.business_applications;
create trigger trg_business_apps_updated_at
  before update on public.business_applications
  for each row
  execute function public.set_updated_at();
