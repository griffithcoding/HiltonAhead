/**
 * Render a ContentPack as a single human-editable markdown document.
 *
 * Output shape:
 *   YAML frontmatter (slug, title, generatedAt, asset_count)
 *   H1 title
 *   per-platform H2 section, each containing:
 *     - per-variant H3
 *     - fenced ```text block with the body
 *     - meta key/value list
 *
 * This is what the CLI writes to disk per post. Designed so the human editor
 * can copy/paste each block directly into the matching platform without
 * touching the surrounding scaffolding.
 */

import type { ContentPack, Platform, SyndicatedAsset } from './syndicate';

const PLATFORM_LABEL: Record<Platform, string> = {
  instagram_carousel: 'Instagram — Carousel',
  instagram_reel: 'Instagram — Reel',
  linkedin_post: 'LinkedIn — Post',
  pinterest_pin: 'Pinterest — Pin',
  reddit_comment: 'Reddit — Comment',
  newsletter_teaser: 'Newsletter — Teaser',
  twitter_thread: 'Twitter / X — Thread',
  facebook_post: 'Facebook — Group Post',
};

/** Canonical platform render order — mirrors the UI tab order. */
const PLATFORM_ORDER: Platform[] = [
  'newsletter_teaser',
  'linkedin_post',
  'twitter_thread',
  'facebook_post',
  'instagram_carousel',
  'instagram_reel',
  'pinterest_pin',
  'reddit_comment',
];

function groupByPlatform(
  assets: SyndicatedAsset[],
): Map<Platform, SyndicatedAsset[]> {
  const map = new Map<Platform, SyndicatedAsset[]>();
  for (const a of assets) {
    const list = map.get(a.platform) ?? [];
    list.push(a);
    map.set(a.platform, list);
  }
  for (const [k, list] of map) {
    list.sort((x, y) => x.variant - y.variant);
    map.set(k, list);
  }
  return map;
}

function metaBlock(meta: Record<string, string>): string {
  const keys = Object.keys(meta);
  if (keys.length === 0) return '';
  const lines = keys.map((k) => `- **${k}**: ${meta[k]}`);
  return lines.join('\n');
}

export function contentPackToMarkdown(pack: ContentPack): string {
  const grouped = groupByPlatform(pack.assets);

  const lines: string[] = [];
  lines.push('---');
  lines.push(`source_slug: ${pack.sourceSlug}`);
  lines.push(`source_title: ${JSON.stringify(pack.sourceTitle)}`);
  lines.push(`generated_at: ${pack.generatedAt}`);
  lines.push(`asset_count: ${pack.assets.length}`);
  lines.push('---');
  lines.push('');
  lines.push(`# ${pack.sourceTitle}`);
  lines.push('');
  lines.push(
    `Derived content pack for the blog post at \`/blog/${pack.sourceSlug}\`. ` +
      `Generated ${pack.generatedAt}. Edit any section before publishing — these ` +
      `are starting drafts, not final copy.`,
  );
  lines.push('');

  for (const platform of PLATFORM_ORDER) {
    const list = grouped.get(platform);
    if (!list || list.length === 0) continue;

    lines.push(`## ${PLATFORM_LABEL[platform]}`);
    lines.push('');

    for (const asset of list) {
      const variantLabel =
        list.length > 1 ? ` — Variant ${asset.variant}` : '';
      lines.push(`### ${PLATFORM_LABEL[platform]}${variantLabel}`);
      lines.push('');

      lines.push('```text');
      lines.push(asset.body);
      lines.push('```');
      lines.push('');

      const meta = metaBlock(asset.meta);
      if (meta) {
        lines.push('**Meta**');
        lines.push('');
        lines.push(meta);
        lines.push('');
      }

      lines.push(`**CTA URL:** ${asset.ctaUrl}`);
      lines.push('');
    }
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}
