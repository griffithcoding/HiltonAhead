-- Email-engine migration verification (PRs #52 + #53 → migrations 023 + 024).
--
-- Paste this entire block into Supabase Dashboard → SQL Editor → Run.
-- Each row of the result tells you what's present (ok) or missing (MISSING).
-- If anything says MISSING, paste the corresponding migration file
-- (supabase/migrations/023_outreach_email_engine.sql or 024_lead_email_engine.sql)
-- into a new SQL Editor query and run it.

with checks as (

  ------------------------------------------------------------------
  -- Migration 023 — outreach email engine
  ------------------------------------------------------------------
  select '023' as migration, 'table outreach_email_events' as artifact,
         case when to_regclass('public.outreach_email_events') is not null
              then 'ok' else 'MISSING' end as status
  union all
  select '023', 'enum outreach_email_event_kind',
         case when exists (select 1 from pg_type where typname = 'outreach_email_event_kind')
              then 'ok' else 'MISSING' end
  union all
  select '023', 'col outreach_opportunities.last_send_at',
         case when exists (select 1 from information_schema.columns
                            where table_schema = 'public'
                              and table_name = 'outreach_opportunities'
                              and column_name = 'last_send_at')
              then 'ok' else 'MISSING' end
  union all
  select '023', 'col outreach_opportunities.last_received_at',
         case when exists (select 1 from information_schema.columns
                            where table_schema = 'public'
                              and table_name = 'outreach_opportunities'
                              and column_name = 'last_received_at')
              then 'ok' else 'MISSING' end
  union all
  select '023', 'col outreach_opportunities.reply_count',
         case when exists (select 1 from information_schema.columns
                            where table_schema = 'public'
                              and table_name = 'outreach_opportunities'
                              and column_name = 'reply_count')
              then 'ok' else 'MISSING' end
  union all
  select '023', 'col outreach_opportunities.sequence_active',
         case when exists (select 1 from information_schema.columns
                            where table_schema = 'public'
                              and table_name = 'outreach_opportunities'
                              and column_name = 'sequence_active')
              then 'ok' else 'MISSING' end
  union all
  select '023', 'view outreach_opp_engagement',
         case when to_regclass('public.outreach_opp_engagement') is not null
              then 'ok' else 'MISSING' end
  union all
  select '023', 'view outreach_pipeline_counts.replied_count',
         case when exists (select 1 from information_schema.columns
                            where table_schema = 'public'
                              and table_name = 'outreach_pipeline_counts'
                              and column_name = 'replied_count')
              then 'ok' else 'MISSING (view needs re-run)' end
  union all
  select '023', 'fn sync_outreach_opp_activity',
         case when exists (select 1 from pg_proc
                            where proname = 'sync_outreach_opp_activity')
              then 'ok' else 'MISSING' end
  union all
  select '023', 'trg trg_outreach_activity_sync',
         case when exists (select 1 from pg_trigger
                            where tgname = 'trg_outreach_activity_sync'
                              and not tgisinternal)
              then 'ok' else 'MISSING' end

  ------------------------------------------------------------------
  -- Migration 024 — lead email engine
  ------------------------------------------------------------------
  union all
  select '024', 'table lead_email_events',
         case when to_regclass('public.lead_email_events') is not null
              then 'ok' else 'MISSING' end
  union all
  select '024', 'enum lead_email_event_kind',
         case when exists (select 1 from pg_type where typname = 'lead_email_event_kind')
              then 'ok' else 'MISSING' end
  union all
  select '024', 'col itinerary_requests.last_send_at',
         case when exists (select 1 from information_schema.columns
                            where table_schema = 'public'
                              and table_name = 'itinerary_requests'
                              and column_name = 'last_send_at')
              then 'ok' else 'MISSING' end
  union all
  select '024', 'col itinerary_requests.last_received_at',
         case when exists (select 1 from information_schema.columns
                            where table_schema = 'public'
                              and table_name = 'itinerary_requests'
                              and column_name = 'last_received_at')
              then 'ok' else 'MISSING' end
  union all
  select '024', 'col itinerary_requests.sequence_active',
         case when exists (select 1 from information_schema.columns
                            where table_schema = 'public'
                              and table_name = 'itinerary_requests'
                              and column_name = 'sequence_active')
              then 'ok' else 'MISSING' end
  union all
  select '024', 'col leads.last_send_at',
         case when exists (select 1 from information_schema.columns
                            where table_schema = 'public'
                              and table_name = 'leads'
                              and column_name = 'last_send_at')
              then 'ok' else 'MISSING' end
  union all
  select '024', 'col leads.last_received_at',
         case when exists (select 1 from information_schema.columns
                            where table_schema = 'public'
                              and table_name = 'leads'
                              and column_name = 'last_received_at')
              then 'ok' else 'MISSING' end
  union all
  select '024', 'col leads.sequence_active',
         case when exists (select 1 from information_schema.columns
                            where table_schema = 'public'
                              and table_name = 'leads'
                              and column_name = 'sequence_active')
              then 'ok' else 'MISSING' end
  union all
  select '024', 'view lead_engagement',
         case when to_regclass('public.lead_engagement') is not null
              then 'ok' else 'MISSING' end
  union all
  select '024', 'fn sync_lead_activity_to_parent',
         case when exists (select 1 from pg_proc
                            where proname = 'sync_lead_activity_to_parent')
              then 'ok' else 'MISSING' end
  union all
  select '024', 'trg trg_lead_activity_sync',
         case when exists (select 1 from pg_trigger
                            where tgname = 'trg_lead_activity_sync'
                              and not tgisinternal)
              then 'ok' else 'MISSING' end
)
select migration, artifact, status
from checks
order by migration, status desc, artifact;

------------------------------------------------------------------
-- Bonus: data-level sanity (only meaningful if migrations applied)
------------------------------------------------------------------
-- Uncomment after the checks above all show 'ok':
--
-- select count(*) as outreach_opps_with_send  from public.outreach_opportunities where last_send_at is not null;
-- select count(*) as itinerary_with_send      from public.itinerary_requests       where last_send_at is not null;
-- select count(*) as leads_with_send          from public.leads                    where last_send_at is not null;
-- select count(*) as outreach_email_events    from public.outreach_email_events;
-- select count(*) as lead_email_events        from public.lead_email_events;
