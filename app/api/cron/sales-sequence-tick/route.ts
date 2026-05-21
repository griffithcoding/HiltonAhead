/**
 * GET /api/cron/sales-sequence-tick — advances the sales sequence engine.
 *
 * Recommended schedule:
 *   Every 30 minutes from 12:00 to 22:00 UTC
 *   (= 8 AM to 6 PM ET in EDT, 7 AM to 5 PM ET in EST)
 *
 * vercel.json example:
 *   {
 *     "crons": [
 *       { "path": "/api/cron/sales-sequence-tick", "schedule": "*\/30 12-22 * * *" }
 *     ]
 *   }
 *
 * Auth: Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.
 * If the env is missing → 503 (deliberately distinct from a wrong-token 401
 * so deploy misconfig is loud).
 *
 * Side effects:
 *   - Calls processDueTouches({ batchSize: 50 })
 *   - Logs a one-line summary so Vercel logs stay readable
 */

import { NextRequest, NextResponse } from 'next/server';
import { processDueTouches } from '@/app/lib/sales/sequenceEngine';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const runtime = 'nodejs';

const DEFAULT_BATCH_SIZE = 50;

function isAuthorized(req: NextRequest, secret: string): boolean {
  const auth = req.headers.get('authorization') || '';
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'CRON_SECRET is not configured. Set CRON_SECRET in the deploy env before scheduling this route.',
      },
      { status: 503 },
    );
  }

  if (!isAuthorized(req, secret)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 },
    );
  }

  try {
    const result = await processDueTouches({ batchSize: DEFAULT_BATCH_SIZE });
    console.log(
      `[sales-sequence-tick] processed=${result.processed} sent=${result.sent} errors=${result.errors}`,
    );
    return NextResponse.json({
      ok: true,
      processed: result.processed,
      sent: result.sent,
      errors: result.errors,
      // Cap detail list at 25 to keep the response bounded.
      details: result.details.slice(0, 25),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[sales-sequence-tick] error:', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
