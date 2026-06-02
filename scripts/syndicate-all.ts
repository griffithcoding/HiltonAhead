/**
 * scripts/syndicate-all.ts
 *
 * CLI: regenerate every blog post's derived content pack to disk.
 *
 *   npx tsx scripts/syndicate-all.ts
 *   npx tsx scripts/syndicate-all.ts --only=cost-of-hilton-head-trip-2026,july-hilton-head-villa-availability
 *
 * Output:
 *   docs/sales-ops/content-calendar/derived/{slug}.md
 *
 * Behavior:
 *   - Idempotent: overwrites existing files with the latest derivation.
 *   - Source of truth: data/posts.ts. If the canonical post exists, we use it.
 *   - Fallback: for the 6 commercial-intent slugs the parallel agent is
 *     writing, we ship from PLACEHOLDER_SEEDS so the marketing team isn't
 *     blocked while that other agent finishes. The moment the real post lands
 *     in posts.ts, the next run of this script supersedes the placeholder.
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { posts, type Post } from '@/data/posts';
import {
  syndicatePost,
  postFromPlaceholder,
  PLACEHOLDER_SEEDS,
} from '@/app/lib/content/syndicate';
import { contentPackToMarkdown } from '@/app/lib/content/contentPackToMarkdown';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(
  REPO_ROOT,
  'docs',
  'sales-ops',
  'content-calendar',
  'derived',
);

function parseArgs(argv: string[]): { only: Set<string> | null } {
  let only: Set<string> | null = null;
  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--only=')) {
      const list = arg
        .slice('--only='.length)
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      only = new Set(list);
    }
  }
  return { only };
}

function writePackForPost(post: Post): { path: string; bytes: number } {
  const pack = syndicatePost(post);
  const md = contentPackToMarkdown(pack);
  const outPath = resolve(OUT_DIR, `${post.slug}.md`);
  writeFileSync(outPath, md, 'utf8');
  return { path: outPath, bytes: Buffer.byteLength(md, 'utf8') };
}

function main() {
  const { only } = parseArgs(process.argv);

  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }

  // Build the working set: every real post + every placeholder whose slug
  // is NOT already a real post. Real posts always win.
  const realSlugs = new Set(posts.map((p) => p.slug));
  const placeholdersToInclude = PLACEHOLDER_SEEDS.filter(
    (s) => !realSlugs.has(s.slug),
  ).map(postFromPlaceholder);

  const fullSet: Post[] = [...posts, ...placeholdersToInclude];

  const filtered = only
    ? fullSet.filter((p) => only.has(p.slug))
    : fullSet;

  if (filtered.length === 0) {
    console.error(
      'No posts matched. Available slugs:\n' +
        fullSet.map((p) => `  - ${p.slug}`).join('\n'),
    );
    process.exit(1);
  }

  let bytesTotal = 0;
  for (const post of filtered) {
    const isPlaceholder = !realSlugs.has(post.slug);
    const { path, bytes } = writePackForPost(post);
    bytesTotal += bytes;
    const marker = isPlaceholder ? '[placeholder]' : '[live]';
    console.log(`${marker} ${post.slug} → ${path} (${bytes} bytes)`);
  }

  console.log(
    `\nDone. Wrote ${filtered.length} pack${filtered.length === 1 ? '' : 's'} (${bytesTotal} bytes total).`,
  );
}

main();
