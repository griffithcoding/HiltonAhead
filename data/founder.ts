/**
 * Founder bio — single source of truth for Person schema and any
 * page that surfaces founder information (/about, /founder, blog post
 * `author` fields, llms.txt). Update here, not in JSX.
 */
import { brand } from './brand';

export const founder = {
  name: 'William Griffith',
  givenName: 'William',
  familyName: 'Griffith',
  jobTitle: 'Founder & Lead Travel Consultant',
  /** Short one-line attribution for blog post bylines. */
  byline: 'William Griffith — Founder, Hilton Ahead',
  /** Long-form bio used on /founder and condensed on /about. */
  bio: 'William Griffith plans your Hilton Head trip from a porch on Hilton Head. A thirty-year island resident, he drives past the villas before recommending them, knows which Sea Pines bike path floods after an August storm, and keeps a list — yes, an actual list — of which Skull Creek tables catch the last ten minutes of sunset in late July. The practice is intentionally small: one trip at a time, by hand. No franchise. No call center. No scripts. The work is the work.',
  /** Short bio for schema/og purposes (≤ 160 chars). */
  shortBio:
    'Founder of Hilton Ahead Travel Co. Hilton Head Island full-time resident planning custom local trips by hand — golf, weddings, family weeks.',
  /** Years on/around the island. */
  yearsOnIsland: 30,
  knowsAbout: [
    'Hilton Head Island travel',
    'Sea Pines Resort villas',
    'Palmetto Dunes Oceanfront Resort',
    'Harbour Town Golf Links',
    'RBC Heritage Presented by Boeing',
    'Lowcountry dining',
    'Bluffton, SC',
    'Daufuskie Island',
    'Hilton Head wedding planning',
    'Hilton Head golf trips',
    'Hilton Head family vacations',
  ],
  alumniOf: [] as Array<{ name: string; url?: string }>,
  /** External-presence URLs for schema.org `sameAs`. Filtered when blank. */
  sameAs: [] as string[],
  /** Optional headshot path; falls back to brand logo if blank. */
  imagePath: '',
  email: brand.contact.email,
} as const;

export type Founder = typeof founder;
