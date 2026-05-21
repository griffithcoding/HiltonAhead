'use client';

/**
 * Tabbed renderer for a ContentPack — one tab per platform.
 *
 * Server component above passes the already-derived `ContentPack`, so this
 * client island stays light. Per-asset copy is delegated to CopyButton.
 */

import { useState } from 'react';
import type { ContentPack, Platform, SyndicatedAsset } from '@/app/lib/content/syndicate';
import CopyButton from './CopyButton';

const PLATFORM_LABELS: Record<Platform, string> = {
  newsletter_teaser: 'Newsletter',
  linkedin_post: 'LinkedIn',
  twitter_thread: 'Twitter / X',
  facebook_post: 'Facebook',
  instagram_carousel: 'IG Carousel',
  instagram_reel: 'IG Reel',
  pinterest_pin: 'Pinterest',
  reddit_comment: 'Reddit',
};

const TAB_ORDER: Platform[] = [
  'newsletter_teaser',
  'linkedin_post',
  'twitter_thread',
  'facebook_post',
  'instagram_carousel',
  'instagram_reel',
  'pinterest_pin',
  'reddit_comment',
];

function groupAssets(assets: SyndicatedAsset[]): Map<Platform, SyndicatedAsset[]> {
  const out = new Map<Platform, SyndicatedAsset[]>();
  for (const a of assets) {
    const list = out.get(a.platform) ?? [];
    list.push(a);
    out.set(a.platform, list);
  }
  for (const [k, list] of out) {
    list.sort((x, y) => x.variant - y.variant);
    out.set(k, list);
  }
  return out;
}

interface PackTabsProps {
  pack: ContentPack;
}

export default function PackTabs({ pack }: PackTabsProps) {
  const grouped = groupAssets(pack.assets);
  const availableTabs = TAB_ORDER.filter((t) => grouped.has(t));
  const [active, setActive] = useState<Platform>(availableTabs[0] ?? 'newsletter_teaser');

  const activeAssets = grouped.get(active) ?? [];

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-1 border-b border-ocean-deep/10">
        {availableTabs.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={
                'rounded-t-sm px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition ' +
                (isActive
                  ? 'border border-b-0 border-ocean-deep/15 bg-sand-soft text-ink'
                  : 'text-ink-soft hover:text-ocean-deep')
              }
            >
              {PLATFORM_LABELS[tab]}{' '}
              <span className="ml-1 rounded-full bg-ocean-deep/10 px-1.5 text-[10px] text-ocean-deep">
                {grouped.get(tab)?.length ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active platform — variants */}
      <div className="space-y-6">
        {activeAssets.map((asset) => (
          <AssetCard key={`${asset.platform}-${asset.variant}`} asset={asset} />
        ))}
      </div>
    </div>
  );
}

function AssetCard({ asset }: { asset: SyndicatedAsset }) {
  const isCarousel = asset.platform === 'instagram_carousel';
  const isReel = asset.platform === 'instagram_reel';

  // Hashtags + image briefs we render specially.
  const hashtags = asset.meta.hashtags?.split(/\s+/).filter(Boolean) ?? [];
  const imageBriefs = Object.keys(asset.meta)
    .filter((k) => k.startsWith('image_brief'))
    .sort()
    .map((k) => ({ key: k, brief: asset.meta[k] }));

  const otherMeta = Object.entries(asset.meta).filter(
    ([k]) => !k.startsWith('image_brief') && k !== 'hashtags',
  );

  return (
    <article className="rounded-sm border border-ocean-deep/10 bg-sand-soft p-5">
      <header className="mb-4 flex items-baseline justify-between gap-3">
        <div>
          <div className="eyebrow eyebrow-coral">Variant {asset.variant}</div>
          <div className="mt-1 text-[14px] font-semibold text-ink">
            {asset.ctaUrl}
          </div>
        </div>
        <div className="flex gap-2">
          <CopyButton text={asset.body} label="Copy body" />
          <CopyButton text={asset.ctaUrl} label="Copy URL" />
        </div>
      </header>

      <pre className="whitespace-pre-wrap rounded-sm border border-ocean-deep/10 bg-sand p-4 font-mono text-[12px] leading-[1.55] text-ink">
        {asset.body}
      </pre>

      {hashtags.length > 0 && (
        <div className="mt-4">
          <div className="eyebrow eyebrow-coral mb-2">Hashtags</div>
          <div className="flex flex-wrap gap-1.5">
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-ocean-light px-2.5 py-1 text-[11px] font-semibold text-ocean-deep"
              >
                {tag}
              </span>
            ))}
            <CopyButton
              text={hashtags.join(' ')}
              label="Copy hashtags"
              className="ml-2 inline-flex items-center rounded-full border border-ocean-deep/20 bg-sand px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ocean-deep transition hover:border-coral hover:text-coral-deep"
            />
          </div>
        </div>
      )}

      {(isCarousel || isReel) && imageBriefs.length > 0 && (
        <div className="mt-5">
          <div className="eyebrow eyebrow-coral mb-2">
            {isCarousel ? 'Slide image briefs' : 'Visual briefs'}
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {imageBriefs.map(({ key, brief }) => (
              <div
                key={key}
                className="rounded-sm border border-ocean-deep/10 bg-sand p-3 text-[12px] leading-[1.5] text-ink-soft"
              >
                <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-palm">
                  {key.replace('image_brief_', 'Slide ')}
                </div>
                <div>{brief}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {otherMeta.length > 0 && (
        <div className="mt-5">
          <div className="eyebrow eyebrow-coral mb-2">Metadata</div>
          <dl className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-1.5 text-[12px]">
            {otherMeta.map(([k, v]) => (
              <FragmentMetaRow key={k} k={k} v={v} />
            ))}
          </dl>
        </div>
      )}
    </article>
  );
}

function FragmentMetaRow({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-palm">
        {k}
      </dt>
      <dd className="text-ink-soft">{v}</dd>
    </>
  );
}
