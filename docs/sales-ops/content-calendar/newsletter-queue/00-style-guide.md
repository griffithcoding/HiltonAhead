# Newsletter Style Guide — Hilton Ahead Travel Co

Single source of truth for every issue in this queue. If a draft contradicts this guide, the guide wins.

## Voice

- Owner-operator first-person. "I", "we", "our team". Never "the team at Hilton Ahead" or third-person brand talk.
- Knowledgeable local. Specifics over adjectives. "Burkes Beach lot fills by 10:30 in July" beats "Burkes is popular".
- Direct. Short sentences. Paragraphs of 1-3 sentences.
- Honest tradeoffs. Name what's crowded, what's overpriced, what's worth skipping. The credibility is in the caveats.
- No hype. No "amazing", no "unforgettable", no "paradise".

## Tone rules

- No exclamation marks. Max one per issue if a moment truly warrants it. Default zero.
- No em-dashes used as drama beats. Use commas, periods, or rewrite.
- No emoji in body copy. The brand uses none.
- No "click here", "learn more", "discover". Use the actual destination as the link text.
- Sign off every issue: "— Will, Hilton Ahead"

## Subject line patterns

Under 60 characters. Five patterns that work for this brand:

1. **The receipt** — "What a Hilton Head trip actually costs"
2. **The deadline** — "Three July weeks still bookable"
3. **The comparison** — "Sea Pines vs Palmetto Dunes vs Shelter Cove"
4. **The local tell** — "When the locals eat"
5. **The honest caveat** — "Heritage Week is a trap (unless you do this)"

Avoid: questions in subject lines, all-caps, brackets, emoji.

## Preheader

- Under 100 characters.
- Continues the subject, never repeats it.
- Hints at one specific number or name from the body.
- Example pair: Subject "What a Hilton Head trip actually costs" / Preheader "Four real trips, four spreadsheets, no rounding. The couples weekend came in under $2,400."

## Email anatomy

Every issue follows this structure. Mobile-first, 600px max width, single column, inline styles only.

1. **Header bar** — brand name "Hilton Ahead" + tagline line ("Your local insider for Hilton Head travel.") + week-of date.
2. **Hero hook** — 1-2 sentences. Names a place, a number, or a date. No throat-clearing.
3. **Lead story** — 200-300 words. Anchors to that week's blog post. One link inline + one CTA at the end of the section.
4. **Three quick hits** — 60 words each. Each one ends with a tagged URL.
5. **CTA block** — single primary button. Either `/itinerary` or `/cost-of-hilton-head-trip` depending on issue. UTM stamped.
6. **Signoff** — "— Will, Hilton Ahead"
7. **Footer** — physical address, why-you-got-this paragraph, unsubscribe placeholder `{{unsubscribe_url}}`.

## HTML rules (email client compatibility)

- No external CSS. Inline styles only.
- No `<style>` blocks (Outlook strips them inconsistently).
- No flexbox, no grid, no CSS variables.
- Use tables only when block elements won't hold layout. Prefer simple `<div>` + `<a>`.
- Buttons rendered as `<a>` with inline `display:inline-block;background:...;padding:12px 20px;`.
- Font stack: `-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif`. Display headers may use `Georgia,serif` (matches existing `render.ts`).
- Max-width 600px enforced on the inner `<table>`.
- All `<img>` tags have explicit `width`, `height`, and `alt`.
- Link color: `#C44A2B` (coral). Body ink: `#0A2930`. Soft ink: `#3D5860`. Background: `#F5E8D0` (sand).
- Unsubscribe link uses placeholder `{{unsubscribe_url}}` — `send.ts` swaps in the per-recipient HMAC-signed URL at send time (`app/lib/newsletter/sign.ts`).

## Plain-text fallback rules

- Every issue ships with a plain-text version. No exceptions.
- Same content as HTML, no marketing-only filler.
- Section dividers: a line of `---`.
- Links spelled out fully on their own line, e.g. `https://www.hiltonahead.com/blog/hilton-head-trip-cost-2026-real-numbers?utm_source=newsletter&utm_medium=email&utm_campaign=issue-001`.
- Sign-off and footer identical to HTML.
- Closing line: `Unsubscribe: {{unsubscribe_url}}`.

## Link tagging convention

Every outbound link in every issue carries UTM params:

```
?utm_source=newsletter&utm_medium=email&utm_campaign=issue-{n}
```

Where `{n}` is the zero-padded issue number (`001`, `002`, ..., `013`).

Optional fourth param for A/B subject test arms (issues 4+):
```
&utm_content=variant-a
&utm_content=variant-b
```

Optional segment param for Issue #1 variants:
```
&utm_term=general | golf | family | couples
```

## Send discipline

- **Day / time:** Friday, 8:00 AM ET. Issue 1 ships Thursday June 4 only because we anchor to a Wed pre-fill window — Issues 2-13 are Friday.
- **Reply-to:** founder@hiltonahead.com. Never noreply.
- **A/B subject test:** issues 4 onward split 10% / 10% of the list 4 hours before main send. Higher open rate wins the 80% remainder.
- **Litmus / Email-on-Acid preview** before every send.
- **Approval workflow:** existing `/api/cron/newsletter-draft` → `/api/newsletter/decide` flow. Issue files in this queue load into `newsletter_issues` as `status='draft'`.
