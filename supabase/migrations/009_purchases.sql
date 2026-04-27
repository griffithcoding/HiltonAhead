-- Hilton Ahead: Stripe purchase tracking.
--
-- Records every successful Stripe Checkout completion (one-time + recurring)
-- so the operator dashboard can surface revenue without round-tripping to
-- the Stripe API on every page load.
--
-- The webhook at /api/stripe/webhook is the only writer. RLS denies
-- public read/write — service role only.

create extension if not exists pgcrypto;

create table if not exists public.purchases (
  id                       uuid primary key default gen_random_uuid(),
  -- Customer
  customer_email           text not null,
  customer_name            text,
  -- Tier
  tier_slug                text not null
                           check (tier_slug in (
                             'compass', 'charter', 'heritage',
                             'listed', 'featured', 'signature'
                           )),
  tier_audience            text not null check (tier_audience in ('b2c', 'b2b')),
  -- Money
  amount_cents             int not null,
  currency                 text not null default 'usd',
  -- Stripe identifiers
  stripe_session_id        text not null unique,
  stripe_payment_intent_id text,
  stripe_subscription_id   text, -- present for B2B annual subs
  stripe_customer_id       text,
  -- Lifecycle
  status                   text not null
                           check (status in (
                             'pending', 'paid', 'refunded',
                             'failed', 'expired'
                           ))
                           default 'pending',
  -- Renewal tracking (for subscriptions)
  current_period_end       timestamptz,
  cancel_at_period_end     boolean default false,
  -- Original Checkout Session metadata, kept for debug/replay.
  metadata                 jsonb,
  -- Timestamps
  paid_at                  timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists idx_purchases_email
  on public.purchases(customer_email);
create index if not exists idx_purchases_tier_slug
  on public.purchases(tier_slug);
create index if not exists idx_purchases_status
  on public.purchases(status);
create index if not exists idx_purchases_created_at
  on public.purchases(created_at desc);
create index if not exists idx_purchases_stripe_subscription_id
  on public.purchases(stripe_subscription_id);

alter table public.purchases enable row level security;

-- No public read, no public write. Service role bypasses RLS.
drop policy if exists "No public read access" on public.purchases;
create policy "No public read access"
  on public.purchases for select
  using (false);

drop policy if exists "No public write access" on public.purchases;
create policy "No public write access"
  on public.purchases for insert
  with check (false);

-- Reuse updated_at trigger from migration 002.
drop trigger if exists trg_purchases_updated_at on public.purchases;
create trigger trg_purchases_updated_at
  before update on public.purchases
  for each row
  execute function public.set_updated_at();
