import MiniSearch from 'minisearch';
import { buildCorpus, type SearchableDoc, type SearchableDocType } from './corpus';

export type SearchHit = SearchableDoc & {
  score: number;
};

export type SearchOpts = {
  types?: SearchableDocType[];
  limit?: number;
};

const FIELD_WEIGHTS = { title: 4, tags: 2, body: 1 } as const;

let cached: MiniSearch<SearchableDoc> | null = null;
let cachedDocs: SearchableDoc[] | null = null;

function getIndex(): { mini: MiniSearch<SearchableDoc>; docs: SearchableDoc[] } {
  if (cached && cachedDocs) return { mini: cached, docs: cachedDocs };

  const docs = buildCorpus();
  const mini = new MiniSearch<SearchableDoc>({
    fields: ['title', 'tags', 'body'],
    storeFields: ['id', 'type', 'title', 'url', 'body', 'tags', 'weight'],
    extractField: (doc, field) => {
      const value = (doc as unknown as Record<string, unknown>)[field];
      if (Array.isArray(value)) return value.join(' ');
      return value == null ? '' : String(value);
    },
    searchOptions: {
      boost: FIELD_WEIGHTS,
      fuzzy: 0.2,
      prefix: true,
      combineWith: 'AND',
    },
  });
  mini.addAll(docs);

  cached = mini;
  cachedDocs = docs;
  return { mini, docs };
}

export function search(query: string, opts: SearchOpts = {}): SearchHit[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const { mini } = getIndex();
  const limit = Math.min(Math.max(opts.limit ?? 20, 1), 100);

  const raw = mini.search(q, {
    filter: opts.types
      ? (result) => opts.types!.includes((result as unknown as SearchableDoc).type)
      : undefined,
  });

  return raw
    .map((r) => {
      const doc = r as unknown as SearchableDoc & { score: number };
      return { ...doc, score: doc.score * (doc.weight ?? 1) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
