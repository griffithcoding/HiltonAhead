import type { Metadata } from 'next';
import ComparisonPageShell from '@/components/sections/ComparisonPageShell';
import { getComparisonBySlug } from '@/data/comparisons';
import { getComparisonMetadata } from '@/app/lib/comparisonPage';

const SLUG = 'hilton-head-vs-myrtle-beach';

export const revalidate = 86400;

export const metadata: Metadata = getComparisonMetadata(
  getComparisonBySlug(SLUG)!,
);

export default function Page() {
  return <ComparisonPageShell slug={SLUG} />;
}
