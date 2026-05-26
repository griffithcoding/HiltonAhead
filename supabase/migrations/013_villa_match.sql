-- supabase/migrations/013_villa_match.sql
-- Villa Match quiz telemetry + lead capture.
-- Mirrors the directory_events pattern from migration 012.

create extension if not exists citext;

create table villa_match_events (
  id          uuid primary key default gen_random_uuid(),
  session_id  text not null,
  event_type  text not null check (event_type in ('start','step_complete','complete','pdf_requested')),
  step        smallint,
  answers     jsonb,
  ip_hash     text,
  user_agent  text,
  referrer    text,
  created_at  timestamptz default now()
);
create index on villa_match_events (session_id);
create index on villa_match_events (created_at desc);

create table villa_match_leads (
  id            uuid primary key default gen_random_uuid(),
  session_id    text not null,
  email         citext not null,
  answers       jsonb not null,
  top_match_ids text[] not null,
  pdf_sent_at   timestamptz,
  ip_hash       text,
  user_agent    text,
  referrer      text,
  created_at    timestamptz default now()
);
create index on villa_match_leads (email);
create index on villa_match_leads (created_at desc);

alter table villa_match_events enable row level security;
alter table villa_match_leads  enable row level security;

-- Reads: admins only (anon never reads). Writes: service-role bypass via API.
create policy "admin read villa_match_events" on villa_match_events
  for select using (is_admin());
create policy "admin read villa_match_leads" on villa_match_leads
  for select using (is_admin());
