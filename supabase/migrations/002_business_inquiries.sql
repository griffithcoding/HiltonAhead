-- Hilton Ahead: partnership / "get featured" inquiry captures.
-- Submitted via /local/get-featured. Read via admin dashboard.

create table if not exists public.business_inquiries (
  id              uuid primary key default gen_random_uuid(),
  business_name   text not null,
  contact_name    text,
  email           text not null,
  phone           text,
  industry        text,
  website         text,
  message         text,
  tier_interest   text,
  source          text not null default 'get_featured_form',
  user_agent      text,
  status          text not null default 'new'
                  check (status in ('new', 'contacted', 'active', 'declined', 'archived')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_business_inquiries_email on public.business_inquiries(email);
create index if not exists idx_business_inquiries_created_at on public.business_inquiries(created_at desc);
create index if not exists idx_business_inquiries_status on public.business_inquiries(status);
create index if not exists idx_business_inquiries_industry on public.business_inquiries(industry);

alter table public.business_inquiries enable row level security;

drop policy if exists "Anyone can submit a business inquiry" on public.business_inquiries;
create policy "Anyone can submit a business inquiry"
  on public.business_inquiries for insert
  with check (true);

drop policy if exists "No public read on business inquiries" on public.business_inquiries;
create policy "No public read on business inquiries"
  on public.business_inquiries for select
  using (false);

-- Reuse the set_updated_at trigger function created in 001.
drop trigger if exists trg_business_inquiries_updated_at on public.business_inquiries;
create trigger trg_business_inquiries_updated_at
  before update on public.business_inquiries
  for each row
  execute function public.set_updated_at();
