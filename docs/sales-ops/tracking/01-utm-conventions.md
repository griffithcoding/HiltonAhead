# UTM & Tracking Conventions — Sales Pipeline

The cold-outbound funnel writes to four Supabase tables (`sales_campaigns`,
`sales_prospects`, `sales_touches`, `sales_unsubscribes`). For the dashboard
math to be honest, every outbound link, capture form, and touch event has to
use the same conventions. This is that contract.

> **TL;DR:** every outbound URL we control is stamped with the four UTMs
> below by `withSalesUtm()`. Every browser event is reported through
> `trackSalesEvent()`. Both helpers live in `app/lib/salesTracking.ts`.

---

## 1. UTM parameters

| param           | value                                                                |
| --------------- | -------------------------------------------------------------------- |
| `utm_source`    | `hilton-ahead-sales` *(constant — distinguishes from `/local` directory traffic)* |
| `utm_medium`    | the channel — one of `email`, `linkedin`, `instagram`, `facebook`, `reddit`, `pinterest`, `tiktok`, `direct_mail`, `referral`, `paid_search`, `paid_social` |
| `utm_campaign`  | the campaign slug from `sales_campaigns.slug` (e.g. `atlanta-golf-q1-2026`) |
| `utm_content`   | optional — touch identifier or creative variant (`touch1`, `bio-link`, `comment-42`, `vert-a`) |

### Source

`utm_source` is **always** `hilton-ahead-sales` for outbound. That keeps
the sales funnel cleanly separable from the inbound `/local` directory
traffic (which uses `hiltonahead`) and from any future paid channels.

### Medium = the channel enum

`utm_medium` must match a value in the `sales_channel` Postgres enum so a
row in `sales_touches.channel` can be derived from the inbound URL without
extra mapping. The exception is `direct_mail`: when a postcard or letter
sends someone to a vanity URL, encode the medium as `direct_mail` (the
landing page's tracker will convert it).

### Campaign = the slug

Use the slug, not the human name. Examples:

```
atlanta-golf-q1-2026
nyc-honeymoon-2026
boston-snowbird-2026
```

If you spin up a one-off campaign that doesn't yet have a row in
`sales_campaigns`, **insert the campaign first**. A capture form posting
a slug that doesn't resolve still captures the lead (the API gracefully
nulls the campaign FK) but the row won't appear in the
`sales_campaign_stats` view, and that's a hole in your reporting.

### Content = touch identifier

When the same campaign has multiple creative variants or touch points,
`utm_content` is how you tell them apart. Conventions:

- Email sequences: `touch1`, `touch2`, `touch3`, `breakup`
- Social bios: `ig-bio`, `linkedin-bio`, `twitter-bio`
- Social posts: `ig-post-2026-05-20`, `linkedin-post-2026-05-20`
- Reddit comments: `r-{subreddit}-comment-{shortid}` (e.g.
  `r-hiltonhead-comment-a1b2c3`)
- Pinterest pins: `pin-{board-slug}` (e.g. `pin-golf-trips`)
- Direct mail: `postcard-fall26`, `letter-q1`

---

## 2. Building outbound URLs

Always go through the helper:

```ts
import { withSalesUtm } from '@/app/lib/salesTracking';

const url = withSalesUtm(
  'https://www.hiltonahead.com/golf-trips',
  'atlanta-golf-q1-2026', // campaign slug
  'email',                // channel
  'touch1',               // content (optional)
);
// → https://www.hiltonahead.com/golf-trips?utm_source=hilton-ahead-sales&utm_medium=email&utm_campaign=atlanta-golf-q1-2026&utm_content=touch1
```

`withSalesUtm` is server- and client-safe. Falls back to the unmodified URL
on parse failure, so a malformed input never breaks an email render.

---

## 3. First-touch attribution (cookies)

When a recipient lands on a sales URL, `captureLandingAttribution()` (called
from `SalesProspectForm` and any landing-page mount) writes three cookies:

| cookie              | value                | TTL     |
| ------------------- | -------------------- | ------- |
| `ha_sales_campaign` | `utm_campaign` value | 90 days |
| `ha_sales_channel`  | `utm_medium` value   | 90 days |
| `ha_sales_content`  | `utm_content` value  | 90 days |

**First-touch wins.** Existing cookies are not overwritten — the first
campaign to land them gets the credit. This matches how we want to talk
about ROI: the first email that broke through is the one we want to
replicate, even if a later touch is what they clicked through to convert.

When a form submits later, `parseAttributionFromCookies()` reads the
cookies and folds them into `intake_notes` so the dashboard can see when
the form submit's stated campaign disagrees with the original landing
campaign. The first-touch value is the source of truth for the
`source_campaign` foreign key, **unless** the form explicitly provides a
slug (then the form value wins — it represents intent at form time).

Cookie domain: first-party only. We do not set a `.hiltonahead.com`-wide
cookie because that would expose attribution data to subdomains we don't
own.

---

## 4. Touch event vocabulary

The `sales_touch_type` enum is the closed list. Use these exact strings
when calling `trackSalesEvent()` and when writing rows directly to
`sales_touches`. Everything else is dropped on the floor by
`/api/sales-track`.

### Email events

| event          | meaning                                                         |
| -------------- | --------------------------------------------------------------- |
| `email_sent`   | Resend webhook says we delivered it.                            |
| `email_open`   | Pixel fired or webhook says they opened.                        |
| `email_click`  | They clicked a tracked link in the body.                        |
| `email_reply`  | We received a reply (Gmail label or webhook).                   |
| `email_bounce` | Hard bounce. Triggers an automatic `status = 'bounced'` update. |

### LinkedIn events

| event                | meaning                                       |
| -------------------- | --------------------------------------------- |
| `linkedin_invite`    | We sent a connection request.                 |
| `linkedin_accepted`  | They accepted the connection.                 |
| `linkedin_message`   | We DM'd them (post-accept or via InMail).     |
| `linkedin_reply`     | They replied.                                 |

### Instagram / Facebook events

| event                | meaning                          |
| -------------------- | -------------------------------- |
| `instagram_dm`       | We DM'd them on Instagram.       |
| `instagram_reply`    | They replied to an IG DM.        |
| `facebook_message`   | We messaged them on Facebook.    |
| `facebook_reply`     | They replied on Facebook.        |

### Reddit events

| event              | meaning                                                |
| ------------------ | ------------------------------------------------------ |
| `reddit_comment`   | We commented on their post or in a thread they own.    |
| `reddit_reply`     | They replied to our comment (counts as engagement).    |

### Phone / SMS / misc

| event             | meaning                                                  |
| ----------------- | -------------------------------------------------------- |
| `sms_sent`        | Twilio webhook says delivered.                           |
| `sms_reply`       | Inbound SMS from a tracked prospect.                     |
| `call_logged`     | Manual: someone logged a phone call.                     |
| `note`            | Manual: someone added a free-form CRM note.              |
| `status_change`   | Auto-emitted when `sales_prospects.status` changes.      |

---

## 5. Per-channel examples

### 5a. Email — Touch 1 of an Atlanta golf sequence

Outbound link in the email body:

```
https://www.hiltonahead.com/golf-trips?utm_source=hilton-ahead-sales&utm_medium=email&utm_campaign=atlanta-golf-q1-2026&utm_content=touch1
```

What gets written to `sales_touches` when Resend says the email was sent:

```json
{
  "prospect_id": "…",
  "campaign_id": "…",
  "channel": "email",
  "touch_type": "email_sent",
  "sequence": "atlanta-golf-3touch-v1",
  "sequence_step": 1,
  "external_id": "resend_msg_…",
  "subject": "A local read on October at Sea Pines"
}
```

### 5b. LinkedIn — Day 4 message in a Charlotte-golf sequence

Outbound LinkedIn DM, no URL needed (LinkedIn strips most outbound UTMs
from the message body anyway). The touch is recorded manually via
`trackSalesEvent()` from the operator's browser extension or from a
manual entry in the admin UI:

```ts
trackSalesEvent(prospect.id, 'linkedin_message', {
  sequence: 'charlotte-golf-li-v1',
  sequence_step: 2,
  subject: 'Following up on the foursome',
});
```

### 5c. Instagram DM — NYC honeymoon

A DM is sent from the brand IG account. Recorded manually:

```ts
trackSalesEvent(prospect.id, 'instagram_dm', {
  sequence: 'nyc-honeymoon-ig-v1',
  sequence_step: 1,
});
```

If the message contains a link, build it with:

```ts
withSalesUtm(
  'https://www.hiltonahead.com/honeymoon',
  'nyc-honeymoon-2026',
  'instagram',
  'ig-dm-touch1',
);
```

### 5d. Reddit comment — drive-market family thread

Inside `/r/hiltonhead` or `/r/travel`, we comment helpfully with a single
link back to the relevant guide. The link uses:

```ts
withSalesUtm(
  'https://www.hiltonahead.com/hilton-head-family-travel-planner',
  'cincinnati-family-2026',
  'reddit',
  'r-hiltonhead-comment-2026-05',
);
```

Recording the comment as a touch:

```ts
trackSalesEvent(prospect.id, 'reddit_comment', {
  subreddit: 'hiltonhead',
  post_url: 'https://reddit.com/r/hiltonhead/comments/…',
  body_preview: 'first 300 chars of our comment',
});
```

If they reply, log a `reddit_reply` touch and flip `status` to `engaged`.

---

## 6. What NOT to do

- **Do not** stamp UTMs on transactional emails (purchase confirmations,
  receipts, calendar invites). Those are CAN-SPAM-exempt, and treating
  them as sales touches contaminates the funnel.
- **Do not** reuse `utm_source` values across sub-brands. If a future
  Bluffton or Daufuskie sub-brand needs its own funnel, it gets its own
  source string.
- **Do not** invent new `touch_type` values without first adding them to
  the `sales_touch_type` enum (a Supabase migration). The ingest endpoint
  drops unknown values silently — you'll think it worked and have nothing
  in the table.
- **Do not** call `trackSalesEvent` from the server. It's browser-only.
  For server-side touch writes, insert directly into `sales_touches` with
  the service-role client.

---

## 7. Where the code lives

| Concern                       | File                                                  |
| ----------------------------- | ----------------------------------------------------- |
| UTM stamping + browser events | `app/lib/salesTracking.ts`                            |
| Lead capture API              | `app/api/sales-prospects/route.ts`                    |
| Event ingest API              | `app/api/sales-track/route.ts`                        |
| One-click unsubscribe         | `app/api/sales-unsubscribe/route.ts`                  |
| Unsubscribe token signing     | `app/lib/salesUnsubscribe.ts`                         |
| Capture form component        | `components/sales/SalesProspectForm.tsx`              |
| Email footer (CAN-SPAM)       | `components/sales/SalesFooter.tsx`                    |
| Admin dashboard               | `app/admin/(gated)/sales-prospects/page.tsx`          |
| Schema                        | `supabase/migrations/018_sales_prospects.sql`         |

---

## 8. Required env vars

| var                          | used by                          |
| ---------------------------- | -------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`   | all routes                       |
| `SUPABASE_SERVICE_ROLE_KEY`  | service client (capture, track, unsubscribe) |
| `RESEND_API_KEY`             | admin notifications              |
| `RESEND_FROM_EMAIL`          | admin notifications              |
| `RESEND_TO_EMAIL`            | admin notifications              |
| `UNSUBSCRIBE_HMAC_SECRET`    | one-click unsubscribe (32+ char) |
