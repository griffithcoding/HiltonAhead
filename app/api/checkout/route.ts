import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { brand } from '@/data/brand';

/**
 * Stripe Checkout session creator.
 *
 * Creates a hosted Stripe Checkout Session for a specific product
 * (itinerary fee, deposit tier, full-service retainer, etc.) and
 * returns the redirect URL.
 *
 * Products are defined inline \u2014 swap to a Stripe Product catalog
 * once volume grows. For low-variance price points this keeps the
 * implementation simple and auditable.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY     — Stripe secret key (server-only)
 *   NEXT_PUBLIC_SITE_URL  — canonical site URL for success/cancel redirects
 */

type ProductKey =
  | 'discovery_fee'          // $95 discovery session (credited toward itinerary)
  | 'itinerary_fee'          // $450 flat custom itinerary
  | 'trip_deposit_500'       // $500 deposit applied to signature-service invoice
  | 'group_retainer_2500'    // $2,500 group / wedding retainer minimum
  | 'partner_tier_1'         // $1,200/yr — Featured Partner
  | 'partner_tier_2'         // $4,800/yr — Curated Partner
  | 'partner_tier_3'         // $12,000/yr — Signature Partner
  ;

const PRODUCTS: Record<
  ProductKey,
  { name: string; description: string; amount: number /* cents */ }
> = {
  // ——— Client-facing travel consulting ———
  discovery_fee: {
    name: 'Hilton Ahead · Discovery Session',
    description:
      '45-minute discovery call plus a 1-page written summary of recommendations. Credited in full toward a custom itinerary if you book within 30 days.',
    amount: 9500,
  },
  itinerary_fee: {
    name: 'Hilton Ahead · Custom Itinerary',
    description:
      'Flat-fee custom Hilton Head itinerary. One-page plan, villa pick, restaurant holds, and text-based on-island support for the duration of your trip.',
    amount: 45000,
  },
  trip_deposit_500: {
    name: 'Hilton Ahead · Signature Service Deposit',
    description:
      'Applied to your final signature-service invoice. Locks in planning time and partner-rate holds on villas, tee times, and dinner reservations.',
    amount: 50000,
  },
  group_retainer_2500: {
    name: 'Hilton Ahead · Group / Wedding Retainer',
    description:
      'Retainer for weddings, reunions, corporate outings, and groups of 12+. Covers full planning through 30 days of on-island support.',
    amount: 250000,
  },

  // ——— Partner / sponsorship tiers (annual) ———
  partner_tier_1: {
    name: 'Hilton Ahead · Featured Partner (annual)',
    description:
      'One-year Featured Partner membership. Logo + blurb in the site footer on every page, named in one newsletter per quarter, one Instagram field tag per quarter.',
    amount: 120000,
  },
  partner_tier_2: {
    name: 'Hilton Ahead · Curated Partner (annual)',
    description:
      'One-year Curated Partner membership. Everything in Featured plus one honest mention in a tier-list post, monthly newsletter slot, and a co-branded 2-day itinerary template.',
    amount: 480000,
  },
  partner_tier_3: {
    name: 'Hilton Ahead · Signature Partner (annual)',
    description:
      'One-year Signature Partner membership. Everything in Curated plus a dedicated 1,500-word editorial post, featured newsletter placement, and co-branded referred-guest checkout.',
    amount: 1200000,
  },
};

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: 'Payments are not yet configured.' },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON.' },
      { status: 400 },
    );
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { ok: false, error: 'Invalid payload.' },
      { status: 400 },
    );
  }

  const input = body as Record<string, unknown>;
  const productKey = input.product as ProductKey | undefined;
  const email =
    typeof input.email === 'string' ? input.email.trim().slice(0, 320) : undefined;
  const reference =
    typeof input.reference === 'string' ? input.reference.slice(0, 200) : undefined;

  if (!productKey || !(productKey in PRODUCTS)) {
    return NextResponse.json(
      { ok: false, error: 'Unknown product.' },
      { status: 400 },
    );
  }

  const product = PRODUCTS[productKey];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url;

  const stripe = new Stripe(secret, { apiVersion: '2026-03-25.dahlia' });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: product.amount,
            product_data: {
              name: product.name,
              description: product.description,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        product: productKey,
        reference: reference ?? '',
      },
      success_url: `${siteUrl}/itinerary?payment=success&product=${productKey}`,
      cancel_url: `${siteUrl}/itinerary?payment=canceled`,
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json(
        { ok: false, error: 'Could not create checkout session.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    console.error('[checkout] stripe error:', err);
    return NextResponse.json(
      { ok: false, error: 'Could not create checkout session.' },
      { status: 500 },
    );
  }
}
