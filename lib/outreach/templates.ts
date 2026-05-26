/**
 * Starter email templates for backlink outreach.
 *
 * These are first-draft templates the operator can edit on the fly in the
 * compose modal. They're intentionally short and conversational — long
 * cold-pitch templates underperform.
 *
 * Variable substitution happens client-side before send via render():
 *   {first_name}     contact's first name (or "there" fallback)
 *   {publication}    account display name (or domain fallback)
 *   {their_url}      the source URL we're targeting on their site
 *   {our_url}        our target URL we want them to link to
 *   {anchor}         proposed anchor text
 */

export type OutreachTemplate = {
  id: string;
  label: string;
  subject: string;
  body: string;
  /** Which link types this template fits — used to suggest a default. */
  linkTypes: string[];
};

export const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  {
    id: 'guest_post_intro',
    label: 'Guest post — initial outreach',
    linkTypes: ['guest_post'],
    subject: 'Lowcountry guest post idea for {publication}',
    body: `Hi {first_name},

Found {publication} while researching travel coverage for the Lowcountry — really enjoyed your recent work.

I run hiltonahead.com, a local travel-consulting site for Hilton Head Island. I'd love to contribute a guest piece you'd actually want to publish — happy to write to your style guide and your audience. A few directions I could take it (open to your ideas too):

  • The honest off-season case for Hilton Head (October–December)
  • Sea Pines vs. Palmetto Dunes: how to choose
  • The local-vs-tourist restaurant scene on the island

If any of those resonate, I'll send a full outline before writing a word. Either way, appreciate your time.

— Will Griffith
Hilton Ahead — local travel consulting
hiltonahead.com`,
  },
  {
    id: 'resource_page_intro',
    label: 'Resource page — initial outreach',
    linkTypes: ['resource_page'],
    subject: 'Quick add for your Hilton Head resource page?',
    body: `Hi {first_name},

I came across your resources page at {their_url} — really useful collection.

I run hiltonahead.com, a hand-curated local travel guide for Hilton Head Island. Thought it might be a fit alongside the other links you've gathered there. The page that's most relevant: {our_url}

No pressure if it's not aligned — just figured I'd flag it. Either way, thanks for putting that resource together.

— Will Griffith
Hilton Ahead`,
  },
  {
    id: 'niche_edit_intro',
    label: 'Niche edit — context-add suggestion',
    linkTypes: ['niche_edit'],
    subject: 'Small addition idea for your {publication} post',
    body: `Hi {first_name},

Re-read your piece at {their_url} this morning — solid take.

One small thing that might add value for readers heading to Hilton Head: in the section about [section reference], you might consider linking to {our_url} as a deeper resource — we cover that exact angle from the local perspective ({anchor} would be natural anchor text in your sentence flow).

No expectation either way — figured I'd flag it since I think your readers would actually use it. Happy to send the link any other way that works for you.

— Will Griffith
Hilton Ahead`,
  },
  {
    id: 'broken_link_intro',
    label: 'Broken link — replacement suggestion',
    linkTypes: ['broken_link'],
    subject: 'Heads up — broken link on your {publication} post',
    body: `Hi {first_name},

Quick heads up — was reading your post at {their_url} and noticed the link to [broken URL description] is returning a 404. Likely the destination site moved or shut down.

If you're patching it, hiltonahead.com has a current piece on the same topic that would work as a replacement: {our_url}

Totally fine if you want to use a different replacement — just figured I'd flag both the broken link and offer an option in the same email.

— Will Griffith
Hilton Ahead`,
  },
  {
    id: 'unlinked_mention_intro',
    label: 'Unlinked mention — link request',
    linkTypes: ['unlinked_mention'],
    subject: 'Quick favor — link our mention?',
    body: `Hi {first_name},

Came across your piece at {their_url} where you mentioned Hilton Head Island. Thanks for the kind words — meant a lot.

Would you be open to linking the mention to hiltonahead.com? Specifically the page at {our_url}. Helps us out for SEO and gives your readers a relevant next click. Anchor text "{anchor}" works in your sentence flow but I'm flexible — happy with whatever feels right to you.

Thanks either way.

— Will Griffith
Hilton Ahead`,
  },
  {
    id: 'swap_restaurant',
    label: 'Resource swap — restaurant / local business',
    linkTypes: ['partnership', 'resource_page'],
    subject: 'Featuring {publication} on hiltonahead.com?',
    body: `Hi {first_name},

I run hiltonahead.com — a local travel-consulting site for Hilton Head Island. Our visitors are people in the active planning stage of a trip: itinerary builders, restaurant lookups, and dinner-reservation seekers. Real traffic, attribution-tracked.

I'd like to feature {publication} in our restaurant directory — no charge, no commission. The listing includes a description, photos, hours, and a tracked link to your site. We push qualified visitor traffic at it organically.

In exchange, a link back from your site to {our_url} would be a fair swap — most operators add it to their "Plan Your Visit" or "About the Island" section. If your site doesn't have one, no worries — happy to chat about other options.

Worth a quick call, or want me to just send the listing draft for review?

— Will Griffith
Hilton Ahead
hiltonahead.com`,
  },
  {
    id: 'swap_wedding_vendor',
    label: 'Resource swap — wedding vendor / planner',
    linkTypes: ['partnership', 'resource_page'],
    subject: 'Hilton Head wedding referral partnership?',
    body: `Hi {first_name},

I run hiltonahead.com — Hilton Head Island travel and local-business directory. We're seeing steady inbound from brides planning Lowcountry destination weddings: venue scouting, vendor research, group-stay coordination, the works.

I'd like to feature {publication} in our wedding-vendor directory. The listing is free, includes portfolio photos, contact info, and a tracked link. It surfaces on /weddings and adjacent guides to brides actively pricing out a Hilton Head wedding.

In exchange, a link from your site to {our_url} (a relevant resource page for your audience) would be a fair swap. Many planners put it under "Local Resources" or "Plan Your Day."

Worth a 15-minute call — or I can send the listing draft now if easier?

— Will Griffith
Hilton Ahead
hiltonahead.com`,
  },
  {
    id: 'swap_vacation_rental',
    label: 'Resource swap — vacation rental manager',
    linkTypes: ['partnership', 'resource_page'],
    subject: 'Cross-link with hiltonahead.com? (guest experience play)',
    body: `Hi {first_name},

I run hiltonahead.com — a local travel-consulting site for Hilton Head Island. Most of our visitors are within 30 days of a stay, deep in the "what should we do while we're there" phase.

I'd like to feature {publication} in our vacation-rental directory — free listing, photos, tracked link to your site. Bookings flow your way; we just get a tracked outbound click. Useful asset for your existing guests too: link to us as a "What to do while you're here" resource in your welcome email or guest book, and we cover the rest.

In exchange, a link from your site (footer, plan-your-visit page, or your guest portal) pointing to {our_url} would be a fair swap.

Want me to send the listing draft so you can see what it looks like?

— Will Griffith
Hilton Ahead
hiltonahead.com`,
  },
  {
    id: 'swap_regional_blog',
    label: 'Resource swap — regional travel blog / publication',
    linkTypes: ['partnership', 'resource_page', 'niche_edit'],
    subject: 'Citable Hilton Head data for {publication}?',
    body: `Hi {first_name},

I run hiltonahead.com — a Hilton Head Island travel and local-business publication.

We just shipped a structured "Hilton Head by the Numbers" reference page — original data on the island (visitor stats, beach access, golf course inventory, seasonal pricing, etc.), formatted as a citable resource. It's the kind of page that's useful as a footnote or inline link in Lowcountry travel coverage.

If you ever write about Hilton Head, feel free to cite or link {our_url} — it's there to be used.

Happy to return the favor too: I can feature {publication} on our resources page or link to specific pieces of yours in relevant articles. Let me know what would be useful on your end.

— Will Griffith
Hilton Ahead
hiltonahead.com`,
  },
  {
    id: 'followup_1',
    label: 'Follow-up #1 (no reply, 5 business days later)',
    linkTypes: ['guest_post', 'resource_page', 'niche_edit', 'broken_link', 'unlinked_mention', 'partnership', 'other'],
    subject: 'Re: {publication}',
    body: `Hi {first_name},

Just bumping the message below in case it slipped past. No pressure — happy to send a different angle or pause this entirely if it's not a fit.

Thanks,
Will`,
  },
  {
    id: 'followup_2',
    label: 'Follow-up #2 (no reply, 10 business days after first)',
    linkTypes: ['guest_post', 'resource_page', 'niche_edit', 'broken_link', 'unlinked_mention', 'partnership', 'other'],
    subject: 'Re: {publication}',
    body: `Hi {first_name},

Final note from me on this — fully understand if it's not a priority. If it ever is, I'll be at the address below.

Either way, appreciate the work you do at {publication}.

— Will`,
  },
  {
    id: 'partnership_intro',
    label: 'Partnership / cross-link — initial outreach',
    linkTypes: ['partnership'],
    subject: 'Hilton Head cross-link partnership?',
    body: `Hi {first_name},

I run hiltonahead.com — a locally-run travel-consulting site for Hilton Head Island. We send a steady stream of high-intent visitor traffic to local businesses through our directory and guides.

I think there's a natural cross-link opportunity between us. We can feature {publication} in a relevant spot on our site, and a link back from yours pointing to {our_url} would be a fair swap. Genuinely useful for both audiences.

Worth a 15-minute call?

— Will Griffith
Hilton Ahead`,
  },
];

export function getTemplateById(id: string): OutreachTemplate | undefined {
  return OUTREACH_TEMPLATES.find((t) => t.id === id);
}

export type RenderVars = {
  first_name?: string | null;
  publication?: string | null;
  their_url?: string | null;
  our_url?: string | null;
  anchor?: string | null;
};

/**
 * Substitute {var} tokens. Missing/null vars are replaced with sensible
 * fallbacks so we never send "Hi {first_name}" by accident.
 */
export function renderTemplateString(
  template: string,
  vars: RenderVars,
): string {
  const fallbacks: Record<string, string> = {
    first_name: vars.first_name?.trim() || 'there',
    publication: vars.publication?.trim() || 'your site',
    their_url: vars.their_url?.trim() || '[their URL]',
    our_url: vars.our_url?.trim() || 'https://hiltonahead.com',
    anchor: vars.anchor?.trim() || 'Hilton Ahead',
  };
  return template.replace(/\{(\w+)\}/g, (_match, key) => {
    return fallbacks[key as keyof typeof fallbacks] ?? `{${key}}`;
  });
}
