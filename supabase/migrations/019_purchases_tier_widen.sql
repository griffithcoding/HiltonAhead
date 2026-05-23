-- Hilton Ahead: widen purchases CHECK constraints to current pricing catalog
-- and link purchases to businesses for per-listing revenue queries.
--
-- Builds on migration 009_purchases.sql.
--
-- Background: data/pricing.ts now defines 13 tier slugs across B2C, B2B,
-- and B2B-Ads. The original 009 CHECKs only allowed 6 slugs and only
-- ('b2c', 'b2b') audiences. New SKUs added since (heritage-kit-vip,
-- insider-club-*, all 4 ad tiers with audience='b2b-ads') would fail one
-- or both CHECKs, causing the Stripe webhook to throw on checkout
-- completion. This migration brings both CHECKs in sync with pricing.ts.
--
-- The business_id column makes the relationship from a B2B purchase to
-- the business listing explicit. Today the only link is by lower(email)
-- match, which is fragile. The webhook tier-sync work in B2 will populate
-- this column on receipt. For now it remains nullable and unpopulated —
-- pure schema groundwork.
--
-- Idempotent.

-- ---------------------------------------------------------------------------
-- 1) Widen tier_slug CHECK to the current catalog.
-- ---------------------------------------------------------------------------
alter table public.purchases
  drop constraint if exists purchases_tier_slug_check;

alter table public.purchases
  add constraint purchases_tier_slug_check
  check (tier_slug in (
    -- B2C — consumer travel consulting + Insider Club
    'compass',
    'charter',
    'heritage',
    'heritage-kit-vip',
    'insider-club-monthly',
    'insider-club-yearly',
    -- B2B — local-business directory tiers
    'listed',
    'featured',
    'signature',
    -- B2B-Ads — direct display ad SKUs
    'featured-pin',
    'story-sponsor',
    'page-display',
    'featured-villa'
  ));

-- ---------------------------------------------------------------------------
-- 2) Widen tier_audience CHECK to include 'b2b-ads'.
-- ---------------------------------------------------------------------------
alter table public.purchases
  drop constraint if exists purchases_tier_audience_check;

alter table public.purchases
  add constraint purchases_tier_audience_check
  check (tier_audience in ('b2c', 'b2b', 'b2b-ads'));

-- ---------------------------------------------------------------------------
-- 3) Link purchases to businesses (nullable; populated by webhook in B2).
-- ---------------------------------------------------------------------------
alter table public.purchases
  add column if not exists business_id uuid
  references public.businesses(id) on delete set null;

create index if not exists idx_purchases_business_id
  on public.purchases(business_id);
