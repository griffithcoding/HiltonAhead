/**
 * Google Search Console — HTML file verification endpoint.
 *
 * Served at the token path via a rewrite defined in next.config.ts.
 * The token (e.g., `google741f91a51ccaff7d`) lives in the
 * GOOGLE_SITE_VERIFICATION_FILE env var, never in git.
 *
 * When a request hits /<token>.html, it's rewritten to this route
 * and the handler returns the canonical verification content that
 * Google expects:
 *
 *   google-site-verification: google<token>.html
 *
 * If the env var isn't set, returns 404 (nothing to verify).
 */

export async function GET() {
  const token = process.env.GOOGLE_SITE_VERIFICATION_FILE;
  if (!token) {
    return new Response('Not found', { status: 404 });
  }

  const body = `google-site-verification: ${token}.html\n`;
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}
