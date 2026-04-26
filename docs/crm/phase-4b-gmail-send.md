# Phase 4b — Gmail Send for Outreach (Spec)

**Status:** Pending. Phase 4a (this commit) shipped the data model + UI; Phase 4b
adds outbound email capability.

## What this phase delivers

After Phase 4b, you can:

1. Click **Send email** on any opportunity detail page
2. Compose a message in a modal (subject + body, with one-click templating)
3. Send it from your real Gmail address (`hiltonahead@gmail.com`)
4. The send is automatically logged to `outreach_activity` with kind
   `email_sent`, including Gmail thread/message IDs
5. The recipient sees a normal Gmail message — not a transactional-looking
   relay — preserving deliverability for warm follow-ups

Cold initial outreach is intentionally **not** in this phase. That belongs in
Phase 4c (Postmark/Mailgun subdomain), per the deliverability guidance from
the planning brief.

## What you have to do (manual, can't be automated)

**Re-consent the Gmail OAuth connection with `gmail.send` scope.**

Today's grant is `gmail.readonly` only — that's why the read panel works on
lead detail pages but the existing send code path is dormant. To enable send:

1. From `/admin`, find the Gmail-connection action (or the existing OAuth
   landing page; check `app/api/gmail/oauth/...`)
2. Re-trigger the OAuth flow
3. On the Google consent screen, **check the box that says "Send email on
   your behalf"** (or equivalent — the exact wording varies by Google's
   current UX)
4. Confirm

You'll know it worked when `gmail_tokens.scope` in Supabase shows both
`https://www.googleapis.com/auth/gmail.readonly` AND
`https://www.googleapis.com/auth/gmail.send` (or `.modify`).

Until that happens, Phase 4b code can be written but won't successfully
send — Google will reject the API call with `403 insufficient_scope`.

## Implementation notes for the build

### New server action: `sendOutreachEmailAction`

Lives in `app/admin/(gated)/outreach/actions.ts`:

```ts
export async function sendOutreachEmailAction(
  opportunityId: string,
  to: string,
  subject: string,
  body: string,
): Promise<void>
```

Steps:
1. `getAdminUser()` for auth
2. Load opportunity + contact via Supabase
3. Call `utils/gmail/client.ts` `sendEmail()` (already built per CRM state memo)
4. On success, insert `outreach_activity` row with kind `email_sent`,
   metadata `{ thread_id, message_id, to, subject }`
5. Update `outreach_opportunities.stage` from `discovered`/`researched` →
   `outreached` if not already past that
6. `revalidatePath`

### New component: `<ComposeButton />`

Client component on the opportunity detail page. Opens a modal with:
- To: prefilled from contact email, editable
- Subject: prefilled with template, editable
- Body: prefilled with personalized template, editable
- Two buttons: **Save as draft** (Gmail draft API) and **Send now**

### Templates

Stored client-side initially as a const map. Phase 4c can move them to a
`outreach_templates` table.

```ts
const TEMPLATES = {
  guest_post_intro: { subject: '...', body: '...' },
  resource_page_intro: { subject: '...', body: '...' },
  niche_edit_intro: { subject: '...', body: '...' },
  followup_1: { subject: '...', body: '...' },
  followup_2: { subject: '...', body: '...' },
};
```

Personalization variables: `{first_name}`, `{publication}`, `{their_url}`,
`{our_url}`, `{anchor}`. Substituted client-side before send.

### Compliance

Add CAN-SPAM footer auto-appended:
- Physical mailing address (your business address — needs to be added)
- Unsubscribe link (one-click, hits `/api/outreach/unsubscribe?token=...`
  which sets `outreach_contacts.opted_out = true`)

Block sends to any contact where `opted_out = true` or `email_bounced = true`.

### Daily send cap

Gmail free: 500/day. Workspace: 2000/day. We'll hard-cap at 200/day per send
account to stay safely under and protect deliverability. Cap is checked
before send by counting today's `outreach_activity` rows where `kind =
'email_sent'`.

## Estimated time

- Backend (server action + Gmail client wiring): half day
- Frontend (compose modal + template UI): half day
- Compliance (footer, unsub flow, opt-out enforcement): half day
- Testing (you send 5 real emails to test inboxes): one round-trip with you

Total: ~2 days of work, contingent on the OAuth re-consent happening.

## After this phase

Phase 4c (sequences/cadences) is unlocked. That's where the AI agent layer
(Phase 5+) starts to pay off — agent drafts, you approve, sequence runs,
replies pause it automatically.
