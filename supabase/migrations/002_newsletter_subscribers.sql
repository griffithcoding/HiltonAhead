-- Hilton Ahead: newsletter subscribers + lightweight lead capture.
--
-- Public-insert / no-public-read. The service role reads via a future
-- admin dashboard. We also capture referral context (source, page) so
-- we can attribute which posts / CTAs actually produce leads.

create extension if not exists pgcrypto;

create table if not exists public.newsletter_subscribers (
  id             uuid primary key default gen_random_uuid(),
  -- Always stored lowercase. API normalizes before insert.
  email          text not null unique,
  full_name      text,
  -- where on the site they signed up: 'footer', 'blog_index',
  -- 'blog_post_<slug>', 'homepage_cta', etc.
  source         text not null default 'unknown',
  -- freeform interests picked from the signup form (golf, food, family…)
  interests      text[],
  -- set by server: referrer URL, user agent
  page_url       text,
  user_agent     text,
  -- double opt-in support (future): mark confirmed when they click email
  confirmed      boolean not null default false,
  confirmed_at   timestamptz,
  -- unsubscribe tracking
  unsubscribed   boolean not null default false,
  unsubscribed_at timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint newsletter_subscribers_email_chk
    check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create index if not exists idx_newsletter_subscribers_source
  on public.newsletter_subscribers(source);

create index if not exists idx_newsletter_subscribers_created_at
  on public.newsletter_subscribers(created_at desc);

alter table public.newsletter_subscribers enable row level security;

-- Anonymous public form can insert.
drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

-- Nobody reads from anon. Service role bypasses RLS.
drop policy if exists "No public read access" on public.newsletter_subscribers;
create policy "No public read access"
  on public.newsletter_subscribers for select
  using (false);

-- Keep updated_at fresh (reuse the trigger fn from migration 001 if present).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_newsletter_subscribers_updated_at on public.newsletter_subscribers;
create trigger trg_newsletter_subscribers_updated_at
  before update on public.newsletter_subscribers
  for each row
  execute function public.set_updated_at();

-- -------------------------------------------------------------------------
-- Lightweight lead table for non-itinerary inquiries
-- (contact form, "quick question" CTAs, phone-lead logging).
-- Kept separate from itinerary_requests so the funnel reporting is clean.
-- -------------------------------------------------------------------------

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  full_name     text,
  phone         text,
  message       text,
  source        text not null default 'contact_form',
  page_url      text,
  user_agent    text,
  status        text not null default 'new'
                check (status in ('new', 'contacted', 'qualified', 'converted', 'archived')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_leads_email on public.leads(email);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_created_at on public.leads(created_at desc);

alter table public.leads enable row level security;

drop policy if exists "Anyone can submit a lead" on public.leads;
create policy "Anyone can submit a lead"
  on public.leads for insert
  with check (true);

drop policy if exists "No public read access" on public.leads;
create policy "No public read access"
  on public.leads for select
  using (false);

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
  before update on public.leads
  for each row
  execute function public.set_updated_at();
