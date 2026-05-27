/**
 * Auto-followup templates for the inbound leads CRM.
 *
 * Tone note: leads are *inbound* — they emailed us first. The followup
 * voice is "checking in on the conversation we already started," not
 * "cold pitch." Keep them short, deferential, and easy to ignore. The
 * worst possible thing is to come off as pushy on a high-intent lead.
 *
 * Templates are designed to be safe across all lead types (itinerary,
 * relocation, owner, wedding inquiries). The operator can always send
 * a custom message instead via the compose modal.
 */

export type LeadTemplate = {
  id: string;
  label: string;
  subject: string;
  body: string;
  /** Days after last_send_at this template is intended to fire. */
  triggerAfterDays: number;
};

/**
 * Variables this lib substitutes via renderLeadTemplate():
 *   {first_name}   contact's first name (fallback: "there")
 *   {topic}        what the lead asked about (fallback: "your Hilton Head plans")
 */
export const LEAD_TEMPLATES: LeadTemplate[] = [
  {
    id: 'lead_followup_1',
    label: 'Lead follow-up #1 (5 days after our last reply)',
    triggerAfterDays: 5,
    subject: 'Following up on {topic}',
    body: `Hi {first_name},

Wanted to circle back on {topic} — I sent over some notes a few days ago and figured I'd check in.

Anything I can clarify, or questions I missed? Happy to send dates, links, or a quick 15-minute call if it'd help.

Either way, no rush — I just don't want you to be waiting on me.

— Will
Hilton Ahead`,
  },
  {
    id: 'lead_followup_2',
    label: 'Lead follow-up #2 (10 days after followup_1)',
    triggerAfterDays: 10,
    subject: 'Re: {topic}',
    body: `Hi {first_name},

Last note from me on this — totally understand if plans changed or the timing isn't right.

If it ever is, just reply here and I'll pick the thread back up. Otherwise I'll let it rest.

Best,
Will
Hilton Ahead`,
  },
];

export function getLeadTemplateById(id: string): LeadTemplate | undefined {
  return LEAD_TEMPLATES.find((t) => t.id === id);
}

export type LeadRenderVars = {
  first_name?: string | null;
  topic?: string | null;
};

export function renderLeadTemplateString(
  template: string,
  vars: LeadRenderVars,
): string {
  const fallbacks: Record<string, string> = {
    first_name: vars.first_name?.trim() || 'there',
    topic: vars.topic?.trim() || 'your Hilton Head plans',
  };
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return fallbacks[key as keyof typeof fallbacks] ?? `{${key}}`;
  });
}
