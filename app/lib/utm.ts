/**
 * Campaign UTM stamping for outbound links that aren't tied to a directory
 * business (e.g. course-card "Book tee time" links, Heritage-kit sponsor
 * blurbs). For directory-business links, prefer `withDirectoryUtm` from
 * `app/lib/directoryTracking` so per-business attribution still works.
 */

export type CampaignUtm = {
  source?: string;
  medium?: string;
  campaign: string;
  content?: string;
};

const DEFAULT_SOURCE = 'hiltonahead';
const DEFAULT_MEDIUM = 'editorial';

export function withCampaignUtm(rawUrl: string, utm: CampaignUtm): string {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set('utm_source', utm.source ?? DEFAULT_SOURCE);
    url.searchParams.set('utm_medium', utm.medium ?? DEFAULT_MEDIUM);
    url.searchParams.set('utm_campaign', utm.campaign);
    if (utm.content) url.searchParams.set('utm_content', utm.content);
    return url.toString();
  } catch {
    return rawUrl;
  }
}

export const HERITAGE_2027_CAMPAIGN = 'heritage_2027';
