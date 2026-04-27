import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getPostBySlug } from '@/data/posts';

/**
 * Square OG generator for social cross-posting (Instagram, LinkedIn).
 *
 *   /api/og-share?slug=<post-slug>     → 1080×1080 PNG of the blog post
 *   /api/og-share?title=<title>        → 1080×1080 PNG of arbitrary text
 *   /api/og-share?title=<title>&category=<cat>
 *
 * Reuses the visual system from app/blog/[slug]/opengraph-image.tsx but
 * reformatted for Instagram's square feed crop and LinkedIn document
 * carousel slides.
 */

export const runtime = 'edge';

const SIZE = 1080;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const slug = searchParams.get('slug');
  let title: string;
  let category: string;
  let readTime = '';
  let excerpt = '';

  if (slug) {
    const post = getPostBySlug(slug);
    if (!post) {
      return new Response('Post not found', { status: 404 });
    }
    title = post.title;
    category = post.category;
    readTime = post.readTime;
    excerpt = post.excerpt;
  } else {
    title = searchParams.get('title') || 'Hilton Ahead — Local Guide';
    category = searchParams.get('category') || 'Local Guide';
    excerpt = searchParams.get('excerpt') || '';
  }

  // Palette — matches the site's sand/ink/coral system
  const sand = '#F5E8D0';
  const sandDeep = '#ECD8B2';
  const ink = '#0A2930';
  const coral = '#FF7A5C';
  const gold = '#E8A74B';

  // Title sizing scales with length so headlines fill the frame
  const titleSize =
    title.length > 80 ? 56 : title.length > 60 ? 64 : title.length > 40 ? 76 : 88;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, ${sand} 0%, ${sandDeep} 100%)`,
          padding: '72px 72px',
          position: 'relative',
          fontFamily: 'serif',
        }}
      >
        {/* Masthead row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 18,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: ink,
            opacity: 0.75,
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 14,
                height: 14,
                background: coral,
                borderRadius: 14,
                display: 'flex',
              }}
            />
            <span>Hilton Ahead</span>
          </div>
          <span style={{ fontStyle: 'italic', fontSize: 20, letterSpacing: 1 }}>
            hiltonahead.com
          </span>
        </div>

        {/* Category tag */}
        <div
          style={{
            display: 'flex',
            marginTop: 96,
            alignItems: 'center',
            gap: 24,
          }}
        >
          <div
            style={{
              background: coral,
              color: sand,
              padding: '12px 22px',
              fontSize: 18,
              letterSpacing: 3,
              textTransform: 'uppercase',
              fontFamily: 'sans-serif',
              fontWeight: 600,
              display: 'flex',
            }}
          >
            {category}
          </div>
          {readTime && (
            <div
              style={{
                fontSize: 18,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: ink,
                opacity: 0.55,
                fontFamily: 'sans-serif',
                display: 'flex',
              }}
            >
              {readTime} read
            </div>
          )}
        </div>

        {/* Title */}
        <div
          style={{
            marginTop: 36,
            fontSize: titleSize,
            lineHeight: 1.04,
            letterSpacing: -1.5,
            color: ink,
            fontWeight: 500,
            maxWidth: 940,
            display: 'flex',
          }}
        >
          {title}
        </div>

        {/* Excerpt subline (optional) */}
        {excerpt && (
          <div
            style={{
              marginTop: 32,
              fontSize: 26,
              lineHeight: 1.45,
              color: ink,
              opacity: 0.75,
              fontStyle: 'italic',
              maxWidth: 880,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              overflow: 'hidden',
            }}
          >
            {excerpt}
          </div>
        )}

        {/* Bottom row — wordmark + seal */}
        <div
          style={{
            position: 'absolute',
            left: 72,
            bottom: 72,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontSize: 16,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: ink,
            opacity: 0.7,
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              width: 64,
              height: 1,
              background: ink,
              opacity: 0.35,
              display: 'flex',
            }}
          />
          <span>Dispatch · Hilton Head Island · SC</span>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 72,
            bottom: 64,
            width: 132,
            height: 132,
            border: `2px solid ${ink}`,
            borderRadius: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: ink,
            opacity: 0.9,
          }}
        >
          <div
            style={{
              fontSize: 44,
              lineHeight: 1,
              color: gold,
              fontStyle: 'italic',
              display: 'flex',
            }}
          >
            HA
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 9,
              letterSpacing: 2,
              textTransform: 'uppercase',
              fontFamily: 'sans-serif',
              display: 'flex',
            }}
          >
            Est · 2026
          </div>
        </div>

        {/* Diagonal accent bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: 280,
            height: 8,
            background: `linear-gradient(90deg, ${coral} 0%, ${gold} 100%)`,
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      width: SIZE,
      height: SIZE,
    },
  );
}
