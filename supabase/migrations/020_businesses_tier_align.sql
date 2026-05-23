-- Hilton Ahead: align businesses.tier vocabulary with data/pricing.ts.
--
-- Builds on migration 017_business_portal.sql.
--
-- Background: 017 defined businesses.tier as ('free', 'featured', 'premium').
-- The 'premium' value was the original name for the top tier; data/pricing.ts
-- now calls it 'signature'. There is also an entry-paid tier ('listed' at
-- $600/yr) that has no value in the schema.
--
-- This migration renames premium → signature in-place and adds 'listed'.
-- The 'featured' value keeps its name. Default stays 'free'.
--
-- Order: drop CHECK → migrate data → re-add CHECK. Doing the UPDATE before
-- dropping the CHECK would fail because 'signature' is not yet allowed.
--
-- Idempotent.

alter table public.businesses
  drop constraint if exists businesses_tier_check;

update public.businesses
  set tier = 'signature'
  where tier = 'premium';

alter table public.businesses
  add constraint businesses_tier_check
  check (tier in ('free', 'listed', 'featured', 'signature'));
