import { ImageResponse } from 'next/og';
import { getPostBySlug, posts } from '@/data/posts';

// ——— Image metadata ———
export const alt = 'Hilton Ahead — Local Travel Guide';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Enables static pre-generation for every post at build time.
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogOGImage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  const title = post?.title || 'Hilton Ahead — Local Guide';
  const category = post?.category || 'Local Guide';
  const readTime = post?.readTime || '';

  // Palette — matches the site's Lowcountry heritage system
  const sand = '#EEE2CC';
  const sandDeep = '#DECCA6';
  const ink = '#152930';
  const coral = '#C8694A';
  const gold = '#C79A5C';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, ${sand} 0%, ${sandDeep} 100%)`,
          padding: '72px 80px',
          position: 'relative',
          fontFamily: 'serif',
        }}
      >
        {/* Top bar — dispatch masthead */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 16,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: ink,
            opacity: 0.75,
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 12,
                height: 12,
                background: coral,
                borderRadius: 12,
                display: 'flex',
              }}
            />
            <span>Hilton Ahead — Local Guide</span>
          </div>
          <span style={{ fontStyle: 'italic', fontSize: 18 }}>
            hiltonahead.com
          </span>
        </div>

        {/* Category tag */}
        <div
          style={{
            display: 'flex',
            marginTop: 64,
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              background: coral,
              color: sand,
              padding: '10px 18px',
              fontSize: 16,
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
                fontSize: 16,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: ink,
                opacity: 0.6,
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
            fontSize: title.length > 60 ? 64 : 78,
            lineHeight: 1.03,
            letterSpacing: -1.5,
            color: ink,
            fontWeight: 500,
            maxWidth: 1040,
            display: 'flex',
          }}
        >
          {title}
        </div>

        {/* Bottom corner — sunset accent + seal mark */}
        <div
          style={{
            position: 'absolute',
            left: 80,
            bottom: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 14,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: ink,
            opacity: 0.7,
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              width: 60,
              height: 1,
              background: ink,
              opacity: 0.35,
              display: 'flex',
            }}
          />
          <span>Dispatch · Hilton Head Island · SC</span>
        </div>

        {/* Seal in bottom-right */}
        <div
          style={{
            position: 'absolute',
            right: 72,
            bottom: 56,
            width: 120,
            height: 120,
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
              fontSize: 40,
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
              fontSize: 8,
              letterSpacing: 2,
              textTransform: 'uppercase',
              fontFamily: 'sans-serif',
              display: 'flex',
            }}
          >
            Est · 2026
          </div>
        </div>

        {/* Diagonal wave accent bottom-left */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: 240,
            height: 6,
            background: `linear-gradient(90deg, ${coral} 0%, ${gold} 100%)`,
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
