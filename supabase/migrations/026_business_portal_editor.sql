-- Hilton Ahead: business portal Phase 2 — listing editor + performance stats.
--
-- 1. businesses.owner_edited_at — set when an owner saves their listing in
--    /business. The public /local/[industry] page overlays owner-editable
--    fields from rows where this is not null; untouched rows keep rendering
--    from data/localBusinesses.ts.
-- 2. Column-level UPDATE grants on businesses. The RLS policy from 017 lets
--    an owner update ANY column of their row (including tier, status, slug).
--    This narrows signed-in users to the profile fields the editor exposes.
--    The service role (Stripe webhook, crons, seed script) is unaffected.
-- 3. business_portal_stats() — per-month directory_events counts for one
--    business, callable only by that business's owners (or an admin).
--    directory_events itself stays admin-read-only.
--
-- Depends on: 003_admin_crm.sql, 012_directory_events.sql,
--             017_business_portal.sql.
-- Idempotent — safe to re-run.

-- ============================================================================
-- 1. owner_edited_at
-- ============================================================================
alter table public.businesses
  add column if not exists owner_edited_at timestamptz;

-- ============================================================================
-- 2. Narrow owner updates to profile columns
-- ============================================================================
revoke update on public.businesses from anon, authenticated;

grant update (
  name,
  tagline,
  address,
  city,
  phone,
  website,
  hours,
  instagram,
  facebook,
  parking,
  dress_code,
  pet_friendly,
  owner_edited_at
) on public.businesses to authenticated;

-- ============================================================================
-- 3. Owner-scoped performance stats
-- ============================================================================
-- directory_events.business_id is the listing slug (text), not the uuid.
create or replace function public.business_portal_stats(
  target_business_id uuid,
  since timestamptz default (now() - interval '6 months')
)
returns table (month date, event_type text, total bigint)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not (public.is_business_owner_of(target_business_id) or public.is_admin()) then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  return query
    select
      date_trunc('month', e.created_at at time zone 'America/New_York')::date as month,
      e.event_type,
      count(*)::bigint as total
    from public.directory_events e
    join public.businesses b on b.slug = e.business_id
    where b.id = target_business_id
      and e.created_at >= since
    group by 1, 2
    order by 1 desc, 2;
end;
$$;

revoke all on function public.business_portal_stats(uuid, timestamptz) from public, anon;
grant execute on function public.business_portal_stats(uuid, timestamptz) to authenticated;
