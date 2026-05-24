/**
 * Single source of truth for the searchable document set.
 * Pulls from data/ modules — no new content lives here.
 */

export type SearchableDocType =
  | 'page'
  | 'post'
  | 'story'
  | 'business'
  | 'industry'
  | 'event'
  | 'faq'
  | 'neighborhood'
  | 'month'
  | 'service'
  | 'partner'
  | 'trip-type'
  | 'property';

export type SearchableDoc = {
  id: string;
  type: SearchableDocType;
  title: string;
  url: string;
  body: string;
  tags: string[];
  weight: number;
};

export function buildCorpus(): SearchableDoc[] {
  return [];
}
