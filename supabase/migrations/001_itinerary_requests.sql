-- Hilton Ahead: itinerary request captures.
-- Publicly-submittable form on /itinerary. Staff read via dashboard later.

create extension if not exists pgcrypto;

create table if not exists public.itinerary_requests (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  full_name     text,
  phone         text,
  party_size    int check (party_size is null or (party_size between 1 and 500)),
  start_date    date,
  end_date      date,
  lodging       text,
  interests     text[],
  budget        text,
  notes         text,
  source        text not null default 'itinerary_form',
  user_agent    text,
  status        text not null default 'new'
                check (status in ('new', 'contacted', 'quoted', 'booked', 'archived')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_itinerary_requests_email on public.itinerary_requests(email);
create index if not exists idx_itinerary_requests_created_at on public.itinerary_requests(created_at desc);
create index if not exists idx_itinerary_requests_status on public.itinerary_requests(status);

alter table public.itinerary_requests enable row level security;

-- Anyone (anon) can submit a request via the public form.
drop policy if exists "Anyone can submit itinerary request" on public.itinerary_requests;
create policy "Anyone can submit itinerary request"
  on public.itinerary_requests for insert
  with check (true);

-- Nobody can read from the anon role. Service role bypasses RLS so the
-- server (or a future admin dashboard using the service role key) is fine.
drop policy if exists "No public read access" on public.itinerary_requests;
create policy "No public read access"
  on public.itinerary_requests for select
  using (false);

-- Keep updated_at in sync.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_itinerary_requests_updated_at on public.itinerary_requests;
create trigger trg_itinerary_requests_updated_at
  before update on public.itinerary_requests
  for each row
  execute function public.set_updated_at();
