/**
 * Hilton Head Island–Bluffton Chamber of Commerce member directory scraper.
 *
 * Source index:  https://hiltonheadchamber.org/membership/member-directory
 * Detail format: https://hiltonheadchamber.org/member-directory/<slug>
 *
 * The chamber runs on Drupal. Member listings are rendered server-side as
 * `.c-card.c-card__member` blocks with an `about="/member-directory/<slug>"`
 * attribute. Each detail page exposes the business's external website at
 * `a.website-link`, the address at `.c-member-details__address`, and the
 * phone at `.phone-link`.
 *
 * **No emails are published.** The chamber hides member emails behind a
 * contact form. The CSV this scraper writes has account + website + vertical
 * but contact_email is blank. The follow-up step (separate script, future
 * iteration) crawls each member website for a contact email.
 *
 * **Pagination limitation:** The index renders 40 members server-side and
 * loads the rest via Drupal Views AJAX (a "Load More" button). The
 * `?page=N` query string is ignored — every page returns the same 40
 * records. To get more, either:
 *   1. Filter by category (form POST with category ID) — see CATEGORY_IDS
 *   2. Hit the Drupal Views AJAX endpoint directly
 * For v1 we accept the 40-member limit and rely on category filters.
 */

import * as cheerio from 'cheerio';
import {
  fetchHtml,
  deriveDomain,
  isOutreachableDomain,
  type OutreachSource,
  type ScrapedRecord,
} from '../lib';

const INDEX_URL = 'https://hiltonheadchamber.org/membership/member-directory';
const BASE_URL = 'https://hiltonheadchamber.org';

// Cap to keep first-run runtime + chamber load bounded.
const MAX_DETAIL_FETCHES = Number(process.env.OUTREACH_MAX_FETCH ?? 40);

// High-value categories for the resource-swap pitch. Chamber category IDs
// come from <option value="N"> in the directory search dropdown — see the
// docstring above for how to discover more.
//
// To add a category: visit /membership/member-directory in the browser,
// inspect the category select, copy the numeric value attribute. Re-run.
const CATEGORY_IDS: Array<{ id: string; label: string }> = [
  // Empty for now — first run targets the default (unfiltered) listing.
  // Add { id: '...', label: '...' } entries to crawl more categories.
];

type IndexEntry = {
  name: string;
  detailPath: string;
};

function parseIndex(html: string): IndexEntry[] {
  const $ = cheerio.load(html);
  const out: IndexEntry[] = [];

  // Drupal renders each member as a .c-card.c-card__member div with an
  // `about="/member-directory/<slug>"` attribute pointing to the detail page.
  $('div.c-card.c-card__member, [about^="/member-directory/"]').each((_, el) => {
    const $el = $(el);
    const about = $el.attr('about');
    if (!about || !about.startsWith('/member-directory/')) return;

    // Name is rendered inside an <a> within the card (varies by view mode).
    // Pull the first non-empty link text or a h3/h2/h4 heading.
    let name =
      $el.find('a').first().text().trim() ||
      $el.find('h2, h3, h4, h5').first().text().trim();

    // Fallback: derive from the slug.
    if (!name) {
      const slug = about.replace('/member-directory/', '');
      name = slug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    out.push({
      name,
      detailPath: `${BASE_URL}${about}`,
    });
  });

  // Dedupe by detailPath.
  const seen = new Set<string>();
  return out.filter((e) => {
    if (seen.has(e.detailPath)) return false;
    seen.add(e.detailPath);
    return true;
  });
}

type DetailFields = {
  website?: string;
  address?: string;
  phone?: string;
};

function parseDetailPage(html: string): DetailFields {
  const $ = cheerio.load(html);

  const websiteHref = $('a.website-link').first().attr('href');
  const website = websiteHref?.trim();

  const rawAddress = $('.c-member-details__address')
    .first()
    .text()
    .replace(/\s+/g, ' ')
    .trim();
  // Drupal renders the field with its label baked in ("Address: <value>").
  // Strip the label so notes don't show "Address: Address: <value>".
  const address = rawAddress.replace(/^address:\s*/i, '') || undefined;

  const phone = $('a.phone-link').first().text().trim() || undefined;

  return { website, address, phone };
}

async function scrapeCategory(
  url: string,
  campaign: string,
  categoryLabel: string | undefined,
  records: ScrapedRecord[],
): Promise<void> {
  const indexHtml = await fetchHtml(url);
  const entries = parseIndex(indexHtml);

  if (entries.length === 0) {
    console.warn(
      `[hhi-chamber] No entries parsed at ${url}. Selectors may need updating.`,
    );
    return;
  }

  const limit = Math.min(entries.length, MAX_DETAIL_FETCHES);
  console.log(`[hhi-chamber] ${url}: ${entries.length} entries, fetching ${limit}.`);

  for (let i = 0; i < limit; i++) {
    const entry = entries[i];
    try {
      const detailHtml = await fetchHtml(entry.detailPath);
      const detail = parseDetailPage(detailHtml);
      const domain = deriveDomain(detail.website);

      if (!domain || !isOutreachableDomain(domain)) continue;

      const noteParts = [`Source: HHI Chamber · ${entry.detailPath}`];
      if (detail.address) noteParts.push(`Address: ${detail.address}`);
      if (detail.phone) noteParts.push(`Phone: ${detail.phone}`);
      noteParts.push('Email TBD — chamber hides emails; crawl website for contact');

      records.push({
        accountName: entry.name,
        domain,
        websiteUrl: detail.website,
        vertical: categoryLabel || 'chamber-member',
        // contactEmail intentionally blank — chamber doesn't expose it.
        linkType: 'partnership',
        targetUrl: 'https://hiltonahead.com/local',
        campaign,
        notes: noteParts.join(' · '),
      });

      if ((i + 1) % 10 === 0) {
        console.log(
          `[hhi-chamber] ${i + 1}/${limit} done · ${records.length} usable accumulated`,
        );
      }
    } catch (err) {
      console.warn(
        `[hhi-chamber] Skipped ${entry.detailPath}: ${(err as Error).message}`,
      );
    }
  }
}

export const hhiChamberSource: OutreachSource = {
  slug: 'hhi-chamber',
  label: 'HHI Chamber Member Directory',
  description:
    'Hilton Head Island–Bluffton Chamber of Commerce members (Drupal). 40/page; add categories to expand.',
  defaults: {
    linkType: 'partnership',
    targetUrl: 'https://hiltonahead.com/local',
    campaign: 'resource-swap-v1-chamber',
  },

  async scrape() {
    const records: ScrapedRecord[] = [];

    // First pass: unfiltered index (40 members).
    await scrapeCategory(
      INDEX_URL,
      'resource-swap-v1-chamber',
      undefined,
      records,
    );

    // Per-category passes (none configured yet — see CATEGORY_IDS docstring).
    for (const cat of CATEGORY_IDS) {
      const url = `${INDEX_URL}?category=${cat.id}`;
      await scrapeCategory(
        url,
        `resource-swap-v1-chamber-${cat.id}`,
        cat.label,
        records,
      );
    }

    // Final dedupe by domain — same business may appear in multiple categories.
    const byDomain = new Map<string, ScrapedRecord>();
    for (const r of records) {
      if (!byDomain.has(r.domain)) byDomain.set(r.domain, r);
    }
    return Array.from(byDomain.values());
  },
};
