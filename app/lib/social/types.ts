/**
 * Shared types for the social autopilot system.
 *
 * Mirrors the public.social_posts and public.social_rotations rows in
 * Supabase (see migrations 022 + 023). Keep in sync if columns change.
 */

import type { IndustrySlug } from '@/data/localBusinesses';

export type SocialStatus =
  | 'draft'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'skipped';

export type SocialPlatform = 'instagram';

export type SocialPost = {
  id: string;
  business_slug: string;
  industry_slug: IndustrySlug;
  platform: SocialPlatform;
  caption: string;
  hashtags: string[];
  image_path: string | null;
  image_url: string | null;
  overlay_template: string;
  status: SocialStatus;
  scheduled_at: string;        // ISO timestamp
  published_at: string | null;
  ig_permalink: string | null;
  utm_campaign: string;
  created_by_ai: boolean;
  generated_by_model: string | null;
  generation_cost_usd: number | null;
  regen_count: number;
  reviewed_by: string | null;
  reviewed_at: string | null;
  edit_notes: string | null;
  created_at: string;
};

export type SocialRotation = {
  business_slug: string;
  last_spotlighted_at: string; // ISO timestamp
  spotlight_count: number;
  updated_at: string;
};

/** Result of one rotation pick, before any LLM/Sharp work happens. */
export type RotationPick = {
  business_slug: string;
  industry_slug: IndustrySlug;
  weeks_since_last: number | null; // null if never spotlighted
};

/** Output of caption generation, fed into the DB insert. */
export type DraftCaption = {
  caption: string;
  hashtags: string[];
  generated_by_model: string;
  generation_cost_usd: number;
  used_fallback: boolean;       // true if LLM was content-blocked
};

/** Manifest sidecar for an overlay template PNG. All values in pixels. */
export type OverlayManifest = {
  template_name: string;        // matches the .png stem
  width: number;                // canvas width (typically 1080)
  height: number;               // canvas height (typically 1080)
  photo: { x: number; y: number; w: number; h: number };
  logo: { x: number; y: number; w: number; h: number };
  business_name: {
    x: number; y: number; w: number; h: number;
    font_px: number;
    color: string;              // hex, e.g. '#FFFFFF'
    align?: 'left' | 'center' | 'right';
  };
  caption_strip?: {
    x: number; y: number; w: number; h: number;
    font_px: number;
    color: string;
    max_chars: number;          // truncate caption to fit
  };
};

export const SOCIAL_GENERATE_MAX_USD_DEFAULT = 2.0;
export const REGEN_CAP = 3;
export const ROTATION_COOLDOWN_WEEKS = 12;
export const DRAFTS_PER_WEEK = 5;
export const SCHEDULE_SLOT_DAYS = [2, 3, 4, 5, 6] as const; // Tue–Sat (Date.getUTCDay)
export const SCHEDULE_SLOT_HOUR_UTC = 14;                   // 10:00 ET in EST
