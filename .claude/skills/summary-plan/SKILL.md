---
name: summary-plan
description: End-of-session handoff. Summarizes what shipped (commits, files, decisions) and plans forward (next steps, blockers, waiting-on-user items). Use proactively at the end of any session that touched code or made meaningful decisions, or invoke explicitly when the user says "wrap up", "summarize this", "session summary", "plan forward", or `/summary-plan`. Output is structured so a future session — or a different person — can pick up cold without re-reading the transcript.
---

# Summary + Plan

Produce a structured handoff at the end of a working session. Three sections, in this order, no exceptions.

## When to use

Trigger this proactively when:

- A session has produced commits, file changes, or substantial decisions and the user's last message indicates wind-down (thanks, ok, done, ship it, push it, tomorrow, etc.)
- User explicitly asks for a wrap-up, summary, status, or plan
- About to run `/compact` — the summary should be the last meaningful output before compaction
- Switching contexts mid-session (e.g., from a feature build to an unrelated bug fix)

Skip if:

- The session was purely conversational (no files, no commits, no decisions)
- The user's last message is a fresh task — finish that first

## Output structure

### 1. What shipped

**Commits** — every commit made this session, by hash + subject + file count:

```
781cb1f  feat(newsletter): weekly auto-newsletter MVP    14 files
854cb50  fix(seo): TouristAttraction → LocalBusiness     3 files
```

**Files changed (grouped by layer)** — only if 5+ files; otherwise inline in commits.

| Layer | Paths | Notes |
|---|---|---|
| DB migrations | `supabase/migrations/008_…` | Apply via Supabase SQL editor |
| API routes | `app/api/cron/…`, `app/api/newsletter/decide/…` | Bearer-auth, HMAC-signed |
| Skills | `.claude/skills/<name>/SKILL.md` | Trigger on `/<name>` |

**Decisions made** — bullet list, each with one-sentence rationale:

- Chose Resend over Buttondown — already wired, $20 at 1k subs vs $79
- Skipped admin UI in MVP — magic-link approval is sufficient v1

**Decisions deferred** — what we explicitly chose NOT to decide:

- Stripe end-to-end vs invoice-and-pay — flagged options, user picking later
- Newsletter sender alias splitting (transactional vs marketing) — single alias for v1

### 2. Current state

**What's live on production** — committed, pushed, deployed. Be specific: domain, route, status code if relevant.

**What's drafted but not pushed** — local commits or staged changes that haven't reached `origin`.

**Known issues** — bugs surfaced, lint errors introduced, broken tests. Don't paper over.

**Waiting on user** — env vars, DNS records, third-party account setup, manual tests, pricing approvals. Each item gets a clear unblock action.

### 3. Plan forward

**Next session (< 1 day)** — concrete, named, time-boxed:

- [ ] Apply Supabase migration 008 (5 min)
- [ ] Set 4 env vars in Vercel (10 min)
- [ ] Test cron via curl (`curl -X POST .../api/cron/newsletter-draft -H "Authorization: Bearer $CRON_SECRET"`)

**Short-term (1-2 weeks)** — green-lit work the user has approved but not started:

- Stripe Checkout for Compass tier — files: `app/services/page.tsx`, `app/api/checkout/route.ts`
- Build "When to Book HH" interactive calendar (gated lead-magnet)

**Strategic backlog** — user-expressed interest, no commitment yet:

- 12-page `/from/[city]` landing-page series
- Annual "State of HH Travel" report (press-bait PDF)
- White-label trip planning for boutique hotels

**Blockers** — what prevents progress on any of the above:

- Newsletter cron won't fire until env vars are set in Vercel
- Stripe wiring needs explicit price IDs created in Stripe dashboard first

## Style rules

- **Specific paths and commit hashes.** A future session reading this should pick up cold without re-reading the transcript.
- **No vague items.** "Improve SEO" is not a plan; "Build `/from/atlanta` page targeting query 'hilton head from atlanta'" is.
- **Time-box estimates** — "1 week" beats "soon," "5 min" beats "quick."
- **Mark blocking dependencies clearly** — what must happen before the next item can start.
- **Quantify where possible** — file counts, line counts, expected close rates, projected leads.
- **No marketing fluff.** This is an operational handoff, not a press release. Don't praise the work; describe it.
- **Honest about what isn't done.** If something is half-baked, say so. If a build is broken, say so. If a test wasn't run, say so.

## Where to save

Default: produce the summary inline in the chat. The user reads it, decides what to do.

If the user wants persistence, save to `.claude/sessions/YYYY-MM-DD-<short-slug>.md` (e.g., `.claude/sessions/2026-04-26-newsletter-mvp.md`). Append-only, one file per session. Don't overwrite.

If the user wants a running log across sessions, append to `.claude/sessions/SUMMARY.md` with a `## YYYY-MM-DD — <short title>` header for each new entry.

When in doubt, ask: "Inline only, or save to `.claude/sessions/...`?"

## Output length

Two pages of markdown maximum. If a session produced more than that worth summarizing, the summary is still two pages — pick the highest-leverage 80% and drop the rest. Length signals indecision; brevity signals taste.
