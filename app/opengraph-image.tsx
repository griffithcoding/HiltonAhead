import { ImageResponse } from 'next/og'
import { brand } from '@/data/brand'

export const alt = `${brand.name} — Hilton Head Travel Consulting`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  // Lowcountry heritage palette — matches /app/globals.css
  const sand = '#EEE2CC'
  const sandDeep = '#DECCA6'
  const ink = '#152930'
  const coral = '#C8694A'
  const gold = '#C79A5C'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: `linear-gradient(135deg, ${sand} 0%, ${sandDeep} 100%)`,
          color: ink,
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Masthead */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '18px',
            letterSpacing: 3,
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
            opacity: 0.85,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              background: coral,
              borderRadius: 14,
              display: 'flex',
            }}
          />
          <span>{brand.name} — Hilton Head Travel</span>
        </div>

        {/* Headline block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              fontSize: '96px',
              lineHeight: 1.02,
              letterSpacing: '-0.025em',
              fontWeight: 500,
              maxWidth: '1040px',
            }}
          >
            Hilton Head,
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '96px',
              lineHeight: 1.02,
              letterSpacing: '-0.025em',
              fontStyle: 'italic',
              fontWeight: 400,
              color: coral,
              maxWidth: '1040px',
            }}
          >
            planned by a local.
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: '18px',
              fontSize: '24px',
              color: ink,
              opacity: 0.72,
              lineHeight: 1.45,
              maxWidth: '880px',
              fontFamily: 'sans-serif',
            }}
          >
            Villa booking, tee times, dinner reservations, and the ten things
            only locals know about.
          </div>
        </div>

        {/* Bottom bar — domain + location */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '16px',
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: ink,
            opacity: 0.7,
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 60, height: 1, background: ink, opacity: 0.35, display: 'flex' }} />
            <span>{brand.domain}</span>
          </div>
          <span>Hilton Head Island · SC</span>
        </div>

        {/* Seal in bottom-right */}
        <div
          style={{
            position: 'absolute',
            right: 72,
            bottom: 120,
            width: 128,
            height: 128,
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
              marginTop: 8,
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

        {/* Diagonal wave accent bottom-left */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: 280,
            height: 6,
            background: `linear-gradient(90deg, ${coral} 0%, ${gold} 100%)`,
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
