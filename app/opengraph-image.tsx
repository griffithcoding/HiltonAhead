import { ImageResponse } from 'next/og'
import { brand } from '@/data/brand'

export const alt = `${brand.name} — Hilton Head Travel Consulting`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
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
          background:
            'radial-gradient(circle at top left, #0f2a2a 0%, #081619 45%, #03090b 100%)',
          color: '#fafafa',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '72px',
              height: '72px',
              borderRadius: '22px',
              background: brand.colors.primary,
              color: '#000',
              fontSize: '40px',
              fontWeight: 800,
              letterSpacing: '0.04em',
            }}
          >
            H
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '0.08em' }}>
              {brand.name.toUpperCase()}
            </div>
            <div style={{ fontSize: '18px', color: '#a1a1aa', marginTop: '4px' }}>
              Hilton Head Travel · Planned by a Local
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              display: 'flex',
              fontSize: '68px',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              fontWeight: 600,
              maxWidth: '960px',
            }}
          >
            Hilton Head, planned
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '68px',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              fontWeight: 600,
              color: brand.colors.primary,
              maxWidth: '960px',
            }}
          >
            by a local.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '26px',
              color: '#a1a1aa',
              lineHeight: 1.35,
              maxWidth: '900px',
            }}
          >
            Villa booking, tee times, dinner reservations, and the ten things only locals know about.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '20px',
            color: '#71717a',
          }}
        >
          <div style={{ display: 'flex' }}>{brand.domain}</div>
          <div style={{ display: 'flex' }}>Hilton Head Island · SC</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
