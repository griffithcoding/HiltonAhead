import { NextResponse } from 'next/server';
import { search, type SearchHit } from '@/app/lib/search/engine';
import type { SearchableDocType } from '@/app/lib/search/corpus';

export const runtime = 'nodejs';

const MAX_QUERY = 200;
const ALLOWED_TYPES: ReadonlyArray<SearchableDocType> = ['page', 'post', 'faq'];

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const rawQ = url.searchParams.get('q') ?? '';
  const q = rawQ.trim().slice(0, MAX_QUERY);

  if (q.length < 2) {
    return NextResponse.json({ error: 'q required (min 2 chars)' }, { status: 400 });
  }

  const typeParam = url.searchParams.get('type');
  const types = typeParam
    ? typeParam.split(',').filter((t): t is SearchableDocType =>
        ALLOWED_TYPES.includes(t as SearchableDocType),
      )
    : undefined;

  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 10, 1), 50) : 10;

  const hits: SearchHit[] = search(q, {
    types: types && types.length > 0 ? types : undefined,
    limit,
  });

  return NextResponse.json(
    { q, total: hits.length, hits },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600' } },
  );
}
