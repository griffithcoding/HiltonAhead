/**
 * Register the Hilton Ahead Calendly webhook subscription.
 *
 * Calendly webhooks are created via API, not the dashboard. Run this
 * once per environment to wire bookings into /api/calendly/webhook.
 *
 * Usage:
 *   npx tsx scripts/calendly-register-webhook.ts
 *
 * Required env (in your shell or .env.local):
 *   CALENDLY_PERSONAL_ACCESS_TOKEN  — from
 *     https://calendly.com/integrations/api_webhooks
 *   CALENDLY_ORGANIZATION_URI       — from
 *     https://api.calendly.com/users/me  (response.resource.current_organization)
 *   NEXT_PUBLIC_SITE_URL            — base URL of the deployment
 *                                     (defaults to www.hiltonahead.com)
 *
 * On success the script prints the webhook subscription URI and the
 * signing key — copy that signing key into CALENDLY_WEBHOOK_SIGNING_KEY
 * in Vercel / .env.local. The webhook handler verifies HMAC against it.
 */

const TOKEN = process.env.CALENDLY_PERSONAL_ACCESS_TOKEN;
const ORG = process.env.CALENDLY_ORGANIZATION_URI;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hiltonahead.com';

async function main(): Promise<void> {
  if (!TOKEN) throw new Error('Missing CALENDLY_PERSONAL_ACCESS_TOKEN');
  if (!ORG) throw new Error('Missing CALENDLY_ORGANIZATION_URI');

  const url = `${SITE.replace(/\/$/, '')}/api/calendly/webhook`;

  const body = {
    url,
    events: ['invitee.created', 'invitee.canceled'],
    organization: ORG,
    scope: 'organization',
  };

  const res = await fetch('https://api.calendly.com/webhook_subscriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json: unknown = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error('Calendly registration failed:', res.status, json);
    process.exit(1);
  }

  const resource =
    (json as { resource?: { uri?: string; signing_key?: string } }).resource ||
    {};
  console.log('Webhook registered.');
  console.log('  URI:        ', resource.uri);
  console.log('  Webhook URL:', url);
  console.log('  Signing key:', resource.signing_key);
  console.log('');
  console.log(
    'Copy the signing key into CALENDLY_WEBHOOK_SIGNING_KEY (Vercel / .env.local).',
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
