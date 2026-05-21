/**
 * POST /api/content/syndicate — derive a ContentPack for a single post.
 *
 * Admin-only. Body: { slug: string, baseUrl?: string }.
 * Looks the post up in data/posts.ts and returns the syndicated content pack
 * as JSON. No persistence — the caller is expected to either render it
 * (admin UI) or write it to disk (CLI script).
 *
 * Why a route at all? So the admin UI's client island can request a fresh
 * pack on demand (e.g. for a "regenerate" button) without bundling the
 * derivation code into the browser.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getPostBySlug } from '@/data/posts';
import { requireAdmin } from '@/utils/supabase/admin';
import { syndicatePost } from '@/app/lib/content/syndicate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface SyndicateRequestBody {
  slug?: unknown;
  baseUrl?: unknown;
}

export async function POST(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ ok: false, error: gate.error }, { status: 401 });
  }

  let body: SyndicateRequestBody;
  try {
    body = (await req.json()) as SyndicateRequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
  if (!slug) {
    return NextResponse.json(
      { ok: false, error: 'Missing required field: slug.' },
      { status: 400 },
    );
  }

  const post = getPostBySlug(slug);
  if (!post) {
    return NextResponse.json(
      { ok: false, error: `No post found for slug "${slug}".` },
      { status: 404 },
    );
  }

  const baseUrl =
    typeof body.baseUrl === 'string' && body.baseUrl.trim().length > 0
      ? body.baseUrl.trim()
      : undefined;

  const pack = syndicatePost(post, { baseUrl });
  return NextResponse.json({ ok: true, pack });
}
