-- supabase/migrations/014_directory_events_payload_and_events.sql
-- Restaurant Hub event-type widening + per-event payload column.
-- Builds on migration 012_directory_events.sql.

-- 1. Add nullable payload column for per-event detail (platform, photoIndex,
--    advertiser_name, related_business_id, source, etc.).
alter table directory_events
  add column if not exists payload jsonb;

-- 2. Drop + recreate the event_type CHECK constraint with the widened set.
--    Existing values from migration 012: phone_click, website_click, inquiry_submit.
--    New page-level events (7): menu_click, reservations_click, directions_click,
--    photo_view, share_click, sponsor_slot_click, related_click.
--    Cross-system attribution events (3) — fired by Villa Match / Trip Sketch /
--    itinerary pipelines, included here so future writes won't fail the CHECK:
--    saved_to_trip_sketch, added_to_itinerary, sent_in_pdf_takeaway.
alter table directory_events
  drop constraint if exists directory_events_event_type_check;

alter table directory_events
  add constraint directory_events_event_type_check
  check (event_type in (
    -- Existing through migration 012:
    'phone_click',
    'website_click',
    'inquiry_submit',
    -- Restaurant Hub page-level events:
    'menu_click',
    'reservations_click',
    'directions_click',
    'photo_view',
    'share_click',
    'sponsor_slot_click',
    'related_click',
    -- Cross-system attribution (forward-compat for Villa Match / Trip Sketch):
    'saved_to_trip_sketch',
    'added_to_itinerary',
    'sent_in_pdf_takeaway'
  ));

-- 3. Functional index on payload->>'platform' for reservations-platform
--    breakdowns in the heat map dashboard.
create index if not exists directory_events_payload_platform_idx
  on directory_events ((payload->>'platform'))
  where payload ? 'platform';
