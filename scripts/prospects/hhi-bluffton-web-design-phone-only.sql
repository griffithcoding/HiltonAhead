-- Hilton Head / Bluffton web-design outreach prospects — PHONE-ONLY batch.
--
-- These 19 businesses surfaced in the June 2026 web-design/SEO prospecting sweep
-- but had NO public email address verifiable from search results (page-fetching
-- was blocked during research, so only search-snippet data was available).
--
-- They cannot go through scripts/import-prospects.ts because that CSV path
-- requires an email per row. sales_prospects.email is nullable at the DB level,
-- so this seed inserts them directly with email = NULL.
--
-- Companion file (the 19 WITH a verified email) imports via:
--   npx tsx scripts/import-prospects.ts \
--     --file=./scripts/prospects/hhi-bluffton-web-design-2026.csv \
--     --channel=direct --no-enqueue --no-segment
--
-- Run this file in the Supabase SQL editor (or psql with the service role).
-- Idempotent: re-running will NOT create duplicates (guarded by NOT EXISTS on
-- company + city). Tagged enrichment_source='web-audit-2026-06', segment='corporate'
-- so the whole batch is filterable and stays separate from travel leads.
--
-- Every "problem" below is INFERRED from URL/presence signals or CONFIRMED where
-- noted — NONE were confirmed by loading the live site. Verify in a browser +
-- Google PageSpeed Insights before outreach.

with incoming (company, industry, city, state, phone, facebook_url, source_notes) as (
  values
    ('May River Grill','Restaurant','Bluffton','SC','(843) 757-5755','https://www.facebook.com/MayRiverGrill/',
      'Tier 1 — BEST TARGET. NO real owned website: mayrivergrill.com returns zero indexed pages; presence is Facebook + third-party aggregators only. Demand: chef-owned since 2007, ~145-241 reviews. CONFIRMED no site.'),
    ('Lot 9 Brewing Co.','Brewery','Bluffton','SC','(843) 757-5689','',
      'Tier 3. Site lot9brew.com exists but under-indexed (24 Yelp reviews) — local-SEO / visibility upside.'),
    ('Captain Woody''s — Bluffton','Bar & grill','Bluffton','SC','(843) 757-6222','',
      'Tier 2. Templated multi-location subdomain (bluffton.captainwoodys.com); online ordering offloaded to Toast/DoorDash. Demand: 357 Yelp reviews. INFERRED.'),
    ('Calhoun Street Tavern','Tavern','Bluffton','SC','(843) 757-4334','',
      'Tier 3. Site exists; no owned online ordering (phone-only takeout); weaker review profile (TripAdvisor 3.7). INFERRED.'),
    ('FARM Bluffton','Restaurant (farm-to-table)','Bluffton','SC','(843) 707-2041','',
      'Tier 3 (lowest need). Strong brand (#7 of 172 Bluffton restaurants); reservations via Resy/OpenTable; likely a capable existing site.'),
    ('Outcast Fishing','Fishing charter','Hilton Head Island','SC','(843) 290-0371','',
      'Tier 2. Legacy .php pages (/about-captain.php). Demand: Chip Michalove, nationally-known Shark Whisperer. INFERRED.'),
    ('Buckeye Charters','Fishing charter','Hilton Head Island','SC','(843) 816-4441','',
      'Tier 2. index.php routing = old CMS. Demand: 5.0 / ~25 TripAdvisor reviews. INFERRED.'),
    ('Kayak Hilton Head','Kayak / eco tours','Hilton Head Island','SC','(843) 684-1910','',
      'Tier 3 verify-the-site. kayakhiltonhead.com; ~25 yrs operating.'),
    ('Gigi''s Boutique','Boutique','Bluffton','SC','(843) 815-4450','',
      'Tier 1. No owned brand / e-commerce domain surfaced (directory + phone only). NOTE: physically in Bluffton (40 Calhoun St) — verify this is the intended business. CONFIRMED thin web presence.'),
    ('Salon Celeste','Salon','Hilton Head Island','SC','(843) 681-5200','',
      'Tier 2 (time-sensitive). Rebranded from Salon 5200 and acquired a second salon Aug 2024 — site/SEO likely stale on new brand + 2nd location; .org domain on a commercial salon. Bluffton line: (843) 757-6245. INFERRED.'),
    ('Minor, Haight & Arundell PC','Law firm','Hilton Head Island','SC','(843) 785-8040','',
      'Tier 2. /tax-a-estate-planning/ slug = old Joomla SEF artifact. Demand: est. 1994, HHI firm (Village at Wexford). INFERRED.'),
    ('Gray''s Heating & Air Conditioning','HVAC','Hilton Head Island','SC','(843) 689-3111','',
      'Tier 3 verify-the-site. Short legacy domain graysinc.com; surfaces via Angi. Full-service HVAC.'),
    ('Property Concierge of Bluffton','Vacation rental / property mgmt','Bluffton','SC','(843) 505-0127','',
      'Tier 2 (top real-estate target). Listing URLs end in .asp?cat= = mid-2000s Classic ASP template. Demand: luxury Palmetto Bluff rentals + concierge. INFERRED.'),
    ('ForeShore Rentals','Property management','Bluffton','SC','(843) 815-2838','',
      'Tier 2. Keyword-stuffed old-style page titles = dated property-management template. Demand: Bluffton/HHI/Palmetto Bluff PM. INFERRED.'),
    ('Sunset Rentals, Inc.','Vacation rental / property mgmt','Hilton Head Island','SC','(843) 785-6767','',
      'Tier 3 verify-the-site. 225+ homes since 1993; IDX-heavy rental sites often score poorly on PageSpeed. Toll-free: (800) 276-8991.'),
    ('May River Manor','Boutique inn','Bluffton','SC','(843) 757-6777','',
      'Tier 3. OTA-dependent boutique inn — direct-booking pitch. Demand: strong TripAdvisor/Expedia reviews, owner-operated.'),
    ('Flowers by KK','Florist','Bluffton','SC','(843) 757-8279','https://www.facebook.com/katkilleen/',
      'Tier 1-ish. Facebook-only presence + an @aol.com email (masked in search results). Demand: 99 WeddingWire reviews, 25+ yrs. INFERRED no site.'),
    ('Johnson''s Florist','Florist','Hilton Head Island','SC','(843) 681-5107','',
      'Tier 2. hiltonheadflorists.net = keyword-stuffed legacy domain, likely an FTD/Teleflora stock template. INFERRED.'),
    ('Amanda Rose Weddings & Events','Wedding planner','Hilton Head Island','SC','(843) 422-7907','',
      'Tier 2/3. 15+ yrs, strong demand across The Knot/WeddingWire; web status to verify.')
)
insert into public.sales_prospects
  (company, industry, city, state, segment, source_channel, phone, facebook_url, enrichment_source, source_notes, status)
select
  i.company,
  i.industry,
  i.city,
  i.state,
  'corporate'::sales_segment,
  'direct'::sales_channel,
  i.phone,
  nullif(i.facebook_url, ''),
  'web-audit-2026-06',
  i.source_notes,
  'new'::sales_status
from incoming i
where not exists (
  select 1 from public.sales_prospects p
  where p.company = i.company
    and coalesce(p.city, '') = i.city
);
