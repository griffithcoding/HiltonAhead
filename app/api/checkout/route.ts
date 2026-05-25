/**
 * Stripe Checkout session creator (tier-based).
 *
 * Receives a tier slug from /services or /partners, looks up the
 * matching pricing definition in data/pricing.ts, creates a Stripe
 * Checkout Session, and returns an HTTP 303 redirect to the hosted
 * Stripe Checkout URL.
 *
 * Two flows:
 *   - One-time payments (Compass, Charter retainer): if a Stripe
 *     Price ID env var is configured, we use it. Otherwise we fall
 *     back to inline price_data using tier.priceUsd. Means Compass
 *     can ship immediately as soon as STRIPE_SECRET_KEY is set.
 *   - Subscriptions (B2B Listed/Featured yearly): MUST have a Stripe
 *     Price ID configured — Stripe doesn't allow inline price_data
 *     for recurring billing. If env var is missing, return 503 with
 *     a clear error.
 *
 * Heritage and Signature are application-only — the route 303s to
 * /itinerary?tier=... rather than charging.
 *
 * Required env:
 *   STRIPE_SECRET_KEY
 *   NEXT_PUBLIC_SITE_URL                (already set)
 *
 * Optional env (subscriptions need these to ship):
 *   STRIPE_PRICE_COMPASS                — Compass one-time
 *   STRIPE_PRICE_CHARTER_RETAINER       — Charter retainer one-time
 *   STRIPE_PRICE_LISTED_YEARLY          — B2B Listed annual
 *   STRIPE_PRICE_FEATURED_YEARLY        — B2B Featured annual
 *   STRIPE_PRICE_FEATURED_PIN_MONTHLY   — Featured Pin ad SKU (monthly)
 *   STRIPE_PRICE_PAGE_DISPLAY_MONTHLY   — Page Display ad SKU (monthly)
 *   STRIPE_PRICE_STORY_SPONSOR          — Story Sponsor ad SKU (one-time)
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  B2C_TIERS,
  B2B_TIERS,
  AD_TIERS,
  INFO_PRODUCT_TIERS,
  getStripePriceId,
  type Tier,
} from '@/data/pricing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hiltonahead.com';

const ALL_TIERS: Tier[] = [...B2C_TIERS, ...B2B_TIERS, ...AD_TIERS, ...INFO_PRODUCT_TIERS];

function findTier(slug: string): Tier | undefined {
  return ALL_TIERS.find((t) => t.slug === slug);
}

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

async function readTierFromRequest(req: NextRequest): Promise<string | null> {
  const ct = req.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try {
      const body = await req.json();
      return typeof body?.tier === 'string' ? body.tier : null;
    } catch {
      return null;
    }
  }
  if (
    ct.includes('application/x-www-form-urlencoded') ||
    ct.includes('multipart/form-data')
  ) {
    const form = await req.formData();
    const t = form.get('tier');
    return typeof t === 'string' ? t : null;
  }
  return new URL(req.url).searchParams.get('tier');
}

function buildLineItems(tier: Tier) {
  const priceId = getStripePriceId(tier);
  if (priceId) {
    return [{ price: priceId, quantity: 1 }] as const;
  }
  // Inline fallback — only valid for one-time payments.
  if (tier.billing !== 'one_time' || tier.priceUsd == null) {
    throw new Error(
      `${tier.name} requires ${tier.stripePriceEnv} to be configured.`,
    );
  }
  return [
    {
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(tier.priceUsd * 100),
        product_data: {
          name: `Hilton Ahead · ${tier.name}`,
          description: tier.tagline,
        },
      },
      quantity: 1,
    },
  ] as const;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Payments not yet configured. Use /itinerary to request a plan.',
      },
      { status: 503 },
    );
  }

  const rawTier = await readTierFromRequest(req);
  if (!rawTier) {
    return NextResponse.json(
      { ok: false, error: 'Missing tier.' },
      { status: 400 },
    );
  }

  const tier = findTier(rawTier);
  if (!tier) {
    return NextResponse.json(
      { ok: false, error: `Unknown tier: ${rawTier}` },
      { status: 400 },
    );
  }

  // Application-only tiers route to the appropriate intake form.
  // B2B (Signature) → business apply form; B2C (Heritage) → itinerary form.
  if (tier.mode !== 'self-serve') {
    const applyPath =
      tier.audience === 'b2b'
        ? `/business/apply?tier=${tier.slug}`
        : `/itinerary?tier=${tier.slug}`;
    return NextResponse.redirect(`${SITE_URL}${applyPath}`, 303);
  }

  // Build line items — fail clearly if subscription tier missing Price ID.
  // Loose type because Stripe's exported LineItem type isn't stable across SDK versions.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lineItems: any[];
  try {
    lineItems = [...buildLineItems(tier)];
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Tier not configured.';
    return NextResponse.json({ ok: false, error: msg }, { status: 503 });
  }

  const checkoutMode: 'subscription' | 'payment' =
    tier.billing === 'subscription_yearly' || tier.billing === 'subscription_monthly'
      ? 'subscription'
      : 'payment';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: checkoutMode,
      line_items: lineItems,
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier.slug}`,
      cancel_url: `${SITE_URL}/checkout/canceled?tier=${tier.slug}`,
      metadata: {
        tier_slug: tier.slug,
        tier_audience: tier.audience,
        source: 'website_checkout',
      },
      subscription_data:
        checkoutMode === 'subscription'
          ? {
              metadata: {
                tier_slug: tier.slug,
                tier_audience: tier.audience,
              },
              // 14-day free trial for B2B directory tiers (listed, featured).
              // B2C subscriptions (Insider Club) do not get a trial.
              ...(tier.audience === 'b2b' ? { trial_period_days: 14 } : {}),
            }
          : undefined,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    if (!session.url) {
      return NextResponse.json(
        { ok: false, error: 'Stripe did not return a session URL.' },
        { status: 502 },
      );
    }

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Checkout failed.';
    console.error('[checkout] stripe error:', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
