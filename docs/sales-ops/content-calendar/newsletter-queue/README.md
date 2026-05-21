# Newsletter Queue — Hilton Ahead Travel Co

Production-ready newsletter queue for the Jun-Aug 2026 cycle. Sixteen files: four segment variants of Issue #1, plus one general issue for Issues #2-13. Loads into `newsletter_issues` (migration 008) and ships through the existing `app/api/cron/newsletter-draft` → `app/api/newsletter/decide` flow.

## Send schedule

| Issue | Date (Thu) | Subject | Anchor blog | Segment | Open target | Click target | Replies |
|---|---|---|---|---|---|---|---|
| 001-general | Jun 4 | What a Hilton Head trip actually costs | hilton-head-trip-cost-2026-real-numbers | general | 34% | 5.5% | 4 |
| 001-golf | Jun 4 | Golf-trip math: what to budget per golfer | hilton-head-golf-packages-course-tiers | golf | 38% | 6.8% | 3 |
| 001-family | Jun 4 | Family-of-five Hilton Head, real numbers | hilton-head-trip-cost-2026-real-numbers | family | 35% | 6.0% | 4 |
| 001-couples | Jun 4 | Quiet-week Hilton Head, real numbers | hilton-head-trip-cost-2026-real-numbers | couples | 36% | 5.8% | 3 |
| 002 | Jun 11 | Three July weeks still bookable (with prices) | last-call-july-hilton-head-villa-availability | general+family | 36% | 7.5% | 5 |
| 003 | Jun 18 | Sea Pines vs Palmetto Dunes vs Shelter Cove | sea-pines-vs-palmetto-dunes-vs-shelter-cove | all | 34% | 5.8% | 3 |
| 004 | Jun 25 | Shoulder-season golf packages, three tiers | hilton-head-golf-packages-course-tiers | general+golf | 34% | 5.5% | 6 |
| 005 | Jul 2 | Surviving July 4 on Hilton Head | hilton-head-trip-cost-2026-real-numbers | all | 38% | 4.0% | 2 |
| 006 | Jul 9 | Best month for Hilton Head, ranked | hilton-head-weather-month-by-month | all | 33% | 5.3% | 3 |
| 007 | Jul 16 | The beach beyond Coligny | hilton-head-beaches (page) | all | 33% | 8.2% | 1 |
| 008 | Jul 23 | Heritage 2027 villa booking opens July 1 | hilton-head-spring-break-heritage-week-avoid | golf | 38% | 6.8% | 4 |
| 009 | Jul 30 | Why we send guests to Bluffton on day 3 | bluffton-travel-planner (page) | general+couples | 30% | 3.8% | 2 |
| 010 | Aug 6 | When the locals eat | hilton-head-trip-cost-2026-real-numbers | all | 32% | 5.2% | 4 |
| 011 | Aug 13 | Off-season golf windows for fall | hilton-head-golf-packages-course-tiers | golf | 36% | 6.2% | 6 |
| 012 | Aug 20 | Five honeymoon mistakes we keep seeing | hilton-head-honeymoon (page) | couples | 36% | 7.2% | 4 |
| 013 | Aug 27 | Fall is what locals quietly recommend | hilton-head-weather-month-by-month | all | 33% | 4.8% | 3 |

Aggregate target across 13 weeks: ~40 inquiries, ~200 booking-relevant clickouts, <4% cumulative attrition.

## How to load an issue (when send.ts integration is wired)

Each `.md` file contains a YAML frontmatter block, an HTML body fenced block, a plain text fenced block, and a `send metadata` YAML block. The loader should:

1. Parse the frontmatter into a row insert on `newsletter_issues` with `status='draft'`.
2. Extract the HTML block (between ```html and ```) and store as `subscriber_html`.
3. Extract the plain text block and store as `subscriber_text`.
4. Extract the send metadata block as `send_meta` (JSONB).
5. Keep the `{{unsubscribe_url}}` placeholder intact — `send.ts` swaps it per-recipient using `app/lib/newsletter/sign.ts`.

A minimal loader sketch:

```ts
// scripts/load-newsletter-queue.ts (not yet implemented)
import { readFile, readdir } from 'node:fs/promises';
import matter from 'gray-matter';
import { createServiceClient } from '@/utils/supabase/service';

const QUEUE_DIR = 'docs/sales-ops/content-calendar/newsletter-queue';

for (const file of (await readdir(QUEUE_DIR)).filter((f) => /^\d{2}-issue-/.test(f))) {
  const raw = await readFile(`${QUEUE_DIR}/${file}`, 'utf8');
  const { data, content } = matter(raw);
  const html = content.match(/```html\n([\s\S]*?)\n```/)?.[1] ?? '';
  const text = content.match(/```\n([\s\S]*?)\nUnsubscribe:[\s\S]*?\n```/)?.[1] ?? '';
  const meta = content.match(/## Send metadata\n+```yaml\n([\s\S]*?)\n```/)?.[1] ?? '';

  await createServiceClient()
    .from('newsletter_issues')
    .upsert({
      issue_number: data.issue_number,
      subject: data.subject,
      preheader: data.preheader,
      segment: data.segment,
      send_date: data.send_date,
      subscriber_html: html,
      subscriber_text: text,
      send_meta: meta,
      status: 'draft',
      primary_link: data.primary_link,
    });
}
```

When the loader ships, run `npm run load-newsletter-queue` before the Thursday cron picks up the draft.

## A/B test plan

Issues 4 onward carry an `ab_test` block in frontmatter with `variant_a` and `variant_b` subject lines, plus an `ab_test_split` block in send metadata. Mechanics:

1. Pre-send job runs 4 hours before the main send window.
2. 10% of the list gets variant A, 10% gets variant B. Send-time UTC stamp + variant ID stored in `newsletter_issues.ab_test_arms` (JSONB).
3. Open rate is measured on the 10% / 10% arms at T+3 hours.
4. The winning subject line ships to the remaining 80% at T+4 hours.
5. If both arms come in within 1 percentage point, ship variant A.

The variant subject lines I shipped favor: receipts (issue 4, 8, 11), local-tell hooks (issue 5, 7, 10), and direct deadlines (issue 6, 12, 13).

Issue 1 segment variants are not A/B'd against each other — each is shipped to its own segment list at the same Thursday 8 AM slot.

## Segment variant strategy for future issues

The four-variant build pattern from Issue 1 is intentionally heavier than what Issues 2-13 need, because Issue 1 is the first send of the cycle and segment-level relevance drives the per-segment open-rate lift we need to justify keeping the segment lists. For Issues 2-13 the lighter-touch pattern is:

- **Single base issue** written to the broadest segment in its `segment_filter`.
- **Targeted subject-line A/B** for the segments where the subject can be sharpened (Issue 4 golf, Issue 5 family, Issue 12 couples, Issue 8 golf).
- **No per-segment body rewrite** unless the segment open rate falls below 18% for 3 consecutive sends, which is the prune threshold from `04-newsletter-plan.md`.

Future segment-only sends (post-cycle) should follow the Issue 1 pattern: separate frontmatter, separate lead story numbers tied to that segment's archetype trip, separate CTA target. The four variant files are the production template.

## Voice and link conventions

All copy follows `00-style-guide.md` — owner-operator first-person, no exclamation marks (max 1 per issue), `— Will, Hilton Ahead` sign-off, every outbound link UTM-stamped with `utm_source=newsletter&utm_medium=email&utm_campaign=issue-{n}`. Segment variants of Issue 1 add `utm_term={segment}`.

## Status

All 16 files are `status='draft'`. The Wednesday-before-send review window (per `04-newsletter-plan.md`) is still required before any issue ships.
