-- Hilton Ahead: weekly newsletter issues + per-subscriber unsubscribe tokens.
--
-- The cron at /api/cron/newsletter-draft writes a row here in the
-- 'pending_approval' state and emails the owner an HMAC-signed magic link.
-- The owner clicks Approve or Reject; the /api/newsletter/decide route
-- verifies the HMAC and flips the issue to 'sending' or 'rejected'.
--
-- Service-role only — no public read or insert. RLS denies all anon traffic.

create extension if not exists pgcrypto;

create table if not exists public.newsletter_issues (
  id              uuid primary key default gen_random_uuid(),
  -- Human-friendly identifier; one issue per Sunday.
  issue_date      date not null unique,
  subject         text not null,
  body_html       text not null,
  body_text       text not null,
  -- Raw topic bundle the issue was rendered from. Useful for replay/debug.
  topics_json     jsonb not null,
  status          text not null
                  check (status in (
                    'pending_approval',
                    'approved',
                    'rejected',
                    'sending',
                    'sent',
                    'failed'
                  ))
                  default 'pending_approval',
  -- HMAC-signed approval token; one approval action consumes the issue
  -- (status check at decide time prevents replay).
  approval_token  text not null,
  recipient_count int,
  -- Set when status flips to 'sent'.
  sent_at         timestamptz,
  -- For diagnosing send failures / future retries.
  send_error      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_newsletter_issues_status
  on public.newsletter_issues(status);

create index if not exists idx_newsletter_issues_created_at
  on public.newsletter_issues(created_at desc);

alter table public.newsletter_issues enable row level security;

-- No public read, no public insert. Service role bypasses RLS.
drop policy if exists "No public read access" on public.newsletter_issues;
create policy "No public read access"
  on public.newsletter_issues for select
  using (false);

drop policy if exists "No public write access" on public.newsletter_issues;
create policy "No public write access"
  on public.newsletter_issues for insert
  with check (false);

-- Reuse the updated_at trigger fn from migration 002.
drop trigger if exists trg_newsletter_issues_updated_at on public.newsletter_issues;
create trigger trg_newsletter_issues_updated_at
  before update on public.newsletter_issues
  for each row
  execute function public.set_updated_at();

-- -------------------------------------------------------------------------
-- Per-subscriber unsubscribe token.
-- One-click unsubscribe links carry this token; verifying the row by
-- token alone (no login) is the standard pattern. Token is high-entropy
-- random bytes; rotated only on explicit request.
-- -------------------------------------------------------------------------

alter table public.newsletter_subscribers
  add column if not exists unsubscribe_token text unique
  default encode(gen_random_bytes(24), 'hex');

-- Backfill any existing rows that pre-date this column.
update public.newsletter_subscribers
  set unsubscribe_token = encode(gen_random_bytes(24), 'hex')
  where unsubscribe_token is null;

-- After backfill, make the column required for future inserts.
alter table public.newsletter_subscribers
  alter column unsubscribe_token set not null;

create index if not exists idx_newsletter_subscribers_unsub_token
  on public.newsletter_subscribers(unsubscribe_token);
