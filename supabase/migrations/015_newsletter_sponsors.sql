-- Hilton Ahead: per-issue newsletter sponsor metadata.
--
-- Adds sponsor fields to newsletter_issues so the renderer can drop a
-- "Presented by" block at a defined slot in the email. One sponsor per issue
-- in v1; if we ever sell multiple slots per issue we'll move to a join table.
--
-- Sponsor click tracking flows through /api/newsletter/sponsor-click, which
-- verifies an HMAC-signed token and 302s to the sponsor URL while logging
-- the click into sponsor_events (migration 014).
--
-- Idempotent. Safe to re-run.

alter table public.newsletter_issues
  add column if not exists sponsor_id     text,
  add column if not exists sponsor_name   text,
  add column if not exists sponsor_url    text,
  add column if not exists sponsor_copy   text,
  add column if not exists sponsor_logo_url text;

create index if not exists idx_newsletter_issues_sponsor_id
  on public.newsletter_issues (sponsor_id);
