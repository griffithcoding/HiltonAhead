/**
 * Stripe webhook handler.
 *
 * Receives event notifications from Stripe (checkout.session.completed,
 * invoice.paid, customer.subscription.updated, etc.) and:
 *   1. Verifies the signature using STRIPE_WEBHOOK_SECRET.
 *   2. Persists a row in the `purchases` table.
 *   3. Sends notification emails — operator notification + customer
 *      welcome with intake-form link.
 *
 * Webhook URL to configure in Stripe dashboard:
 *   https://www.hiltonahead.com/api/stripe/webhook
 *
 * Required env:
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET     — from Stripe dashboard "Reveal signing secret"
 *   SUPABASE_SERVICE_ROLE_KEY — for service-role insert into purchases
 *   RESEND_API_KEY            — for confirmation emails (already configured)
 *   RESEND_TO_EMAIL           — operator inbox (defaults to hiltonahead@gmail.com)
 *
 * Webhook events handled:
 *   - checkout.session.completed     → create purchases row, mark paid
 *   - invoice.paid                   → renewal of B2B subscription, update period_end
 *   - customer.subscription.updated  → handle cancel_at_period_end flag
 *   - customer.subscription.deleted  → mark expired
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceClient } from '@/utils/supabase/service';
import { sendEmail } from '@/app/lib/email';
import { B2C_TIERS, B2B_TIERS, type Tier, type TierSlug } from '@/data/pricing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALL_TIERS: Tier[] = [...B2C_TIERS, ...B2B_TIERS];

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hiltonahead.com';

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function findTier(slug: string | null | undefined): Tier | undefined {
  if (!slug) return undefined;
  return ALL_TIERS.find((t) => t.slug === slug);
}

// ============================================================================

export async function POST(req: NextRequest): Promise<NextResponse> {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { ok: false, error: 'Webhook not configured.' },
      { status: 503 },
    );
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json(
      { ok: false, error: 'Missing signature.' },
      { status: 400 },
    );
  }

  // Stripe requires the RAW body for signature verification — must read as text.
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[stripe-webhook] signature verify failed:', msg);
    return NextResponse.json(
      { ok: false, error: 'Invalid signature.' },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
          stripe,
        );
        break;
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;
      default:
        // Ignore everything else.
        break;
    }
    return NextResponse.json({ ok: true, received: event.type });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[stripe-webhook] handler error:', msg);
    return NextResponse.json(
      { ok: false, error: msg, eventType: event.type },
      { status: 500 },
    );
  }
}

// ============================================================================
// Handlers
// ============================================================================

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
): Promise<void> {
  const supabase = createServiceClient();
  const tierSlug = session.metadata?.tier_slug as TierSlug | undefined;
  const tier = findTier(tierSlug);

  if (!tier) {
    console.warn('[stripe-webhook] checkout completed without tier metadata');
    return;
  }

  const customerEmail =
    session.customer_email ?? session.customer_details?.email ?? null;
  const customerName = session.customer_details?.name ?? null;

  // Stripe gives us amount_total in cents already.
  const amountCents = session.amount_total ?? 0;

  // For subscriptions, fetch the subscription to capture period_end.
  let periodEnd: string | null = null;
  let subscriptionId: string | null = null;
  if (typeof session.subscription === 'string') {
    subscriptionId = session.subscription;
    try {
      const sub = await stripe.subscriptions.retrieve(session.subscription);
      const subRecord = sub as unknown as {
        current_period_end?: number;
      };
      if (typeof subRecord.current_period_end === 'number') {
        periodEnd = new Date(subRecord.current_period_end * 1000).toISOString();
      }
    } catch (err) {
      console.error('[stripe-webhook] sub retrieve failed:', err);
    }
  }

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  const customerId =
    typeof session.customer === 'string'
      ? session.customer
      : (session.customer?.id ?? null);

  // Idempotent insert — unique constraint on stripe_session_id absorbs
  // the rare case where Stripe redelivers the same event.
  const { data: purchaseRow, error } = await supabase
    .from('purchases')
    .upsert(
      {
        customer_email: customerEmail || 'unknown@unknown',
        customer_name: customerName,
        tier_slug: tier.slug,
        tier_audience: tier.audience,
        amount_cents: amountCents,
        currency: session.currency ?? 'usd',
        stripe_session_id: session.id,
        stripe_payment_intent_id: paymentIntentId,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        status: session.payment_status === 'paid' ? 'paid' : 'pending',
        current_period_end: periodEnd,
        metadata: {
          mode: session.mode,
          payment_status: session.payment_status,
        },
        paid_at:
          session.payment_status === 'paid' ? new Date().toISOString() : null,
      },
      { onConflict: 'stripe_session_id' },
    )
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('[stripe-webhook] purchases upsert error:', error);
    throw new Error(`DB insert failed: ${error.message}`);
  }

  // Mirror the purchase into the per-lead activity timeline so the
  // CRM lead detail surfaces the payment without any UI work.
  if (
    customerEmail &&
    session.payment_status === 'paid' &&
    purchaseRow?.id
  ) {
    await logPaymentActivity(
      supabase,
      customerEmail,
      tier,
      amountCents,
      purchaseRow.id as string,
      session.id,
    );
  }

  if (customerEmail) {
    await Promise.all([
      sendCustomerWelcome(customerEmail, customerName, tier),
      sendOperatorNotification(customerEmail, customerName, tier, amountCents),
    ]);
  }
}

async function logPaymentActivity(
  supabase: ReturnType<typeof createServiceClient>,
  customerEmail: string,
  tier: Tier,
  amountCents: number,
  purchaseId: string,
  stripeSessionId: string,
): Promise<void> {
  // First match wins — itinerary requests are the highest-intent leads
  // so they're checked first.
  const tables = [
    'itinerary_requests',
    'leads',
    'newsletter_subscribers',
  ] as const;
  for (const table of tables) {
    const { data } = await supabase
      .from(table)
      .select('id')
      .ilike('email', customerEmail)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data?.id) {
      const dollars = (amountCents / 100).toFixed(2);
      await supabase.from('lead_activity').insert({
        lead_table: table,
        lead_id: data.id,
        kind: 'payment',
        actor_email: null,
        body: `Paid $${dollars} for ${tier.name}`,
        metadata: {
          purchase_id: purchaseId,
          tier_slug: tier.slug,
          amount_cents: amountCents,
          stripe_session_id: stripeSessionId,
        },
      });
      return;
    }
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const supabase = createServiceClient();
  // Renewal of an annual B2B subscription. Update the existing row's period.
  const invoiceWithSubscription = invoice as unknown as {
    subscription?: string;
  };
  const subscriptionId = invoiceWithSubscription.subscription;
  if (typeof subscriptionId !== 'string') return;

  const stripe = getStripe();
  if (!stripe) return;

  let periodEnd: string | null = null;
  try {
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    const subRecord = sub as unknown as {
      current_period_end?: number;
    };
    if (typeof subRecord.current_period_end === 'number') {
      periodEnd = new Date(subRecord.current_period_end * 1000).toISOString();
    }
  } catch {
    return;
  }

  await supabase
    .from('purchases')
    .update({
      status: 'paid',
      current_period_end: periodEnd,
    })
    .eq('stripe_subscription_id', subscriptionId);
}

async function handleSubscriptionUpdated(
  sub: Stripe.Subscription,
): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from('purchases')
    .update({
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
    })
    .eq('stripe_subscription_id', sub.id);
}

async function handleSubscriptionDeleted(
  sub: Stripe.Subscription,
): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from('purchases')
    .update({ status: 'expired' })
    .eq('stripe_subscription_id', sub.id);
}

// ============================================================================
// Email
// ============================================================================

async function sendCustomerWelcome(
  email: string,
  name: string | null,
  tier: Tier,
): Promise<void> {
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hi —';
  const intakeUrl =
    tier.audience === 'b2c'
      ? `${SITE_URL}/itinerary?tier=${tier.slug}`
      : `${SITE_URL}/local/get-featured?tier=${tier.slug}`;

  const subject = `Welcome to Hilton Ahead — ${tier.name}`;
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#F5E8D0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">
    <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C44A2B;font-weight:600;">
      Hilton Ahead · ${tier.name}
    </div>
    <h1 style="font-family:Georgia,serif;font-size:30px;line-height:1.12;margin:14px 0 0 0;color:#0A2930;letter-spacing:-0.02em;">
      ${greeting}
    </h1>
    <p style="font-size:15px;line-height:1.7;color:#3D5860;margin-top:18px;">
      Payment received. Welcome to <strong>${tier.name}</strong>.
    </p>
    <p style="font-size:15px;line-height:1.7;color:#3D5860;">
      Next step: tell us about your trip so we can start planning. The
      intake form takes about three minutes — dates, group size, what you
      want out of the trip — and we come back inside one business day with
      the first draft of a plan.
    </p>
    <p style="margin:28px 0 0 0;">
      <a href="${intakeUrl}" style="display:inline-block;background:#0A2930;color:#F5E8D0;text-decoration:none;padding:14px 26px;border-radius:999px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;">
        Complete intake →
      </a>
    </p>
    <p style="font-size:13px;line-height:1.7;color:#3D5860;margin-top:32px;">
      Reply directly to this email with any questions. — Hilton Ahead<br/>
      <span style="color:#9CA3AF;font-size:12px;">Hilton Head Island, SC</span>
    </p>
  </div></body></html>`;

  const text = [
    `${greeting}`,
    ``,
    `Payment received. Welcome to ${tier.name}.`,
    ``,
    `Next step: tell us about your trip so we can start planning.`,
    `${intakeUrl}`,
    ``,
    `Reply directly to this email with any questions.`,
    `— Hilton Ahead · Hilton Head Island, SC`,
  ].join('\n');

  await sendEmail({
    to: email,
    subject,
    html,
    text,
    tags: [
      { name: 'type', value: 'purchase_welcome' },
      { name: 'tier', value: tier.slug },
    ],
  });
}

async function sendOperatorNotification(
  customerEmail: string,
  customerName: string | null,
  tier: Tier,
  amountCents: number,
): Promise<void> {
  const opsInbox = process.env.RESEND_TO_EMAIL || 'hiltonahead@gmail.com';
  const dollars = (amountCents / 100).toFixed(2);
  const subject = `New ${tier.name} purchase — ${customerName ?? customerEmail}`;
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#F5E8D0;font-family:sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C44A2B;font-weight:600;">
      New purchase
    </div>
    <h1 style="font-family:Georgia,serif;font-size:24px;color:#0A2930;margin:8px 0 16px 0;">
      ${tier.name} — $${dollars}
    </h1>
    <table style="width:100%;border-collapse:collapse;background:#FBF3E2;border:1px solid rgba(10,41,48,0.1);">
      <tbody>
        <tr><td style="padding:8px 12px 8px 0;color:#6B7280;font-size:13px;white-space:nowrap;">Email</td><td style="padding:8px 0;color:#0A2930;font-size:14px;">${customerEmail}</td></tr>
        <tr><td style="padding:8px 12px 8px 0;color:#6B7280;font-size:13px;white-space:nowrap;">Name</td><td style="padding:8px 0;color:#0A2930;font-size:14px;">${customerName ?? '—'}</td></tr>
        <tr><td style="padding:8px 12px 8px 0;color:#6B7280;font-size:13px;white-space:nowrap;">Tier</td><td style="padding:8px 0;color:#0A2930;font-size:14px;">${tier.name} (${tier.slug})</td></tr>
        <tr><td style="padding:8px 12px 8px 0;color:#6B7280;font-size:13px;white-space:nowrap;">Audience</td><td style="padding:8px 0;color:#0A2930;font-size:14px;">${tier.audience}</td></tr>
        <tr><td style="padding:8px 12px 8px 0;color:#6B7280;font-size:13px;white-space:nowrap;">Billing</td><td style="padding:8px 0;color:#0A2930;font-size:14px;">${tier.billing}</td></tr>
      </tbody>
    </table>
    <p style="font-size:13px;color:#3D5860;margin-top:24px;">
      Reply directly to this email — replies go to ${customerEmail}.
    </p>
  </div></body></html>`;

  await sendEmail({
    to: opsInbox,
    subject,
    html,
    text: `New ${tier.name} purchase\nEmail: ${customerEmail}\nName: ${customerName ?? '—'}\nAmount: $${dollars}\n`,
    replyTo: customerEmail,
    tags: [
      { name: 'type', value: 'purchase_notification' },
      { name: 'tier', value: tier.slug },
    ],
  });
}
