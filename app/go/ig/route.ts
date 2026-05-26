/**
 * Public bio-link redirect for Instagram.
 *
 * Reads "current featured" post and 302s to its /local/[industry]/[slug]
 * with utm_source=instagram&utm_medium=social&utm_campaign=<post.utm_campaign>.
 *
 * Edge-cached for 60s so a burst of IG-tap traffic doesn't hammer the DB.
 */

import { NextResponse } from 'next/server';
import { resolveCurrentFeatured, stampUtm } from '@/app/lib/social/bioLink';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const featured = await resolveCurrentFeatured();
  const dest = stampUtm(featured.destinationPath, featured.utmCampaign);

  const res = NextResponse.redirect(new URL(dest, getOrigin()), 302);
  res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return res;
}

function getOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hiltonahead.com';
}
