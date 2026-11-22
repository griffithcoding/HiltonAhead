-- Hilton Ahead: make the admin reporting views run as the caller.
--
-- lead_engagement, sales_campaign_stats, outreach_pipeline_counts and
-- outreach_opp_engagement (migrations 007, 018, 023, 024) were created as
-- default views, which run with the view owner's privileges and so bypass
-- RLS on the tables underneath. Combined with `grant select ... to
-- authenticated`, any signed-in user — including business-portal owners —
-- could read lead, outreach and sales-campaign engagement data. Supabase's
-- security advisor flags these as "Security Definer View".
--
-- security_invoker makes each view apply the caller's RLS, so only admins
-- (via the is_admin() policies on the underlying tables) get rows. The admin
-- pages query these views with the signed-in admin's client, so they keep
-- working.
--
-- Requires Postgres 15+. Idempotent — safe to re-run.

alter view public.lead_engagement          set (security_invoker = true);
alter view public.sales_campaign_stats     set (security_invoker = true);
alter view public.outreach_pipeline_counts set (security_invoker = true);
alter view public.outreach_opp_engagement  set (security_invoker = true);

revoke all on public.lead_engagement,
              public.sales_campaign_stats,
              public.outreach_pipeline_counts,
              public.outreach_opp_engagement
  from anon;
