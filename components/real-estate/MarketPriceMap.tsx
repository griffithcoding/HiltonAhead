'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { priceTierFor, PRICE_TIERS } from '@/data/realEstateTrends';

export type PricePoint = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  medianSalePrice: number | null;
};

export default function MarketPriceMap({
  points,
  center,
  zoom = 11,
  focusSlug,
}: {
  points: PricePoint[];
  center: { lat: number; lng: number };
  zoom?: number;
  focusSlug?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Effect A: initialize the map once (and on center/zoom change).
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !ref.current || mapRef.current) return;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: ref.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [center.lng, center.lat],
      zoom,
      attributionControl: true,
    });
    mapRef.current = map;
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [center.lat, center.lng, zoom]);

  // Effect B: (re)render markers when points/focus change.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    for (const p of points) {
      if (p.medianSalePrice === null) continue;
      const tier = priceTierFor(p.medianSalePrice);
      const el = document.createElement('div');
      const size = p.slug === focusSlug ? 26 : 18;
      el.style.cssText = `width:${size}px;height:${size}px;border-radius:9999px;background:#${tier.colorHex};border:2px solid #FBF3E2;box-shadow:0 1px 4px rgba(0,0,0,.3);cursor:pointer;`;
      // p.name/tier.label are static internal data (data/realEstateTrends.ts), not user input — safe for setHTML.
      const popup = new mapboxgl.Popup({ offset: 14 }).setHTML(
        `<strong>${p.name}</strong><br/>Median: $${Math.round(p.medianSalePrice).toLocaleString()}<br/><span style="color:#666">${tier.label}</span>`,
      );
      const marker = new mapboxgl.Marker({ element: el }).setLngLat([p.lng, p.lat]).setPopup(popup).addTo(map);
      markersRef.current.push(marker);
    }
  }, [points, focusSlug]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    return (
      <div className="rounded-2xl border border-rule-soft bg-sand-soft p-5 text-sm text-ink-soft">
        Map unavailable — set NEXT_PUBLIC_MAPBOX_TOKEN.
      </div>
    );
  }

  return (
    <div>
      <div ref={ref} className="h-[360px] w-full overflow-hidden rounded-2xl border border-rule-soft" />
      <div className="mt-3 flex flex-wrap gap-3">
        {PRICE_TIERS.map((t) => (
          <span key={t.key} className="flex items-center gap-1.5 text-xs text-ink-soft">
            <span className="h-3 w-3 rounded-full" style={{ background: `#${t.colorHex}` }} />
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
