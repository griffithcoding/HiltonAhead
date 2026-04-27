# Outreach prospects — Q2 2026 starter list

Pre-loaded prospects for Horizon 2 of the brand-visibility plan. ~60 rows
across the four tiers, ready to import via `/admin/outreach/import`.

## What's in here

- **`q2-2026-prospects.csv`** — 60 prospects across 3 tiers (publications,
  podcasts, local cross-promo). Ready to upload as-is to populate the
  outreach CRM.

## How to use

1. Open the admin: `/admin/outreach/import`
2. Upload `q2-2026-prospects.csv`
3. The importer upserts accounts + contacts and creates one
   opportunity per row.
4. Each opportunity defaults to stage `discovered`. Move to
   `researched` once you've found the right editor name; `outreached`
   when you send.

## What still needs founder work before sending

**Contact names + verified emails.** Most rows have generic
`editor@` / `info@` / `partnerships@` addresses — useful for first
pass but low reply rate. Before sending:

- For Tier 1 publications: check the masthead and find the right beat
  editor (travel, food, regional). Tools: muckrack.com, the publication's
  about page, LinkedIn.
- For Tier 2 podcasts: check the show's "contact" page for the host's
  direct email; many have public booking forms.
- For Tier 3 locals: most are existing partner-rate relationships
  already; ping the founder's existing contact rather than
  `partnerships@`.

## Tier 4 — quote-bait sources (not in CSV)

These are sign-up flows, not domains to import. Founder should set up
direct accounts and respond 3x/week:

- **HARO** (now Connectively) — connectively.us
- **Qwoted** — qwoted.com
- **Help A B2B Writer** — helpab2bwriter.com
- **SourceBottle** — sourcebottle.com (international travel queries)
- **JournoRequests on X/Twitter** — search `#journorequest hilton head`
  weekly

When a placement lands from Tier 4, drop a row into the CRM manually
under the campaign tag `q2-2026-tier4-quotes` so the data flows together.

## Cadence

Per the brand-visibility plan: 5 outreach emails per day = 25/week.
Current realistic target: clear Tier 3 (existing relationships, easy
wins) in week 1, then Tier 1 publications week 2–3, podcasts ongoing.

## Pitch templates

Live in the CRM `outreach_activity.metadata.template` field per
opportunity. Use the founder's voice — short, no fluff, lead with the
specific local angle (not "I run a travel site"). Reference one
specific recent piece of theirs to prove you read it.
