import type { SearchableDoc, SearchableDocType } from './corpus';

export type SearchHit = SearchableDoc & {
  score: number;
};

export type SearchOpts = {
  types?: SearchableDocType[];
  limit?: number;
};

export function search(_query: string, _opts?: SearchOpts): SearchHit[] {
  return [];
}
