/**
 * Pull the week's newsletter topics from on-site sources.
 *
 * Inputs: now (Date), lastIssueAt (Date | undefined).
 * Outputs: a TopicBundle the render layer turns into HTML + text.
 *
 * Selection rules:
 *   - newPosts: blog posts with publishedAt or updatedAt > lastIssueAt
 *               (or last 30 days if no prior issue), max 4, newest first
 *   - upcomingEvents: events with startDate in the next 14 days
 *                     OR currently mid-run (today within startDate..endDate),
 *                     max 4, soonest first
 *   - currentMonth: the month entry for now.getMonth()
 *   - seasonalAngles: 1-2 logic-driven hooks (see seasonal.ts)
 */

import { posts } from '@/data/posts';
import { events } from '@/data/events';
import { months, type MonthData } from '@/data/months';
import { pickSeasonalAngles, type SeasonalAngle } from './seasonal';

export interface TopicPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
}

export interface TopicEvent {
  slug: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  url?: string;
}

export interface TopicMonth {
  slug: string;
  name: string;
  headline: string;
  intro: string;
  avgHigh: number;
  avgLow: number;
  waterTemp: number;
  crowdLevel: string;
}

export interface TopicBundle {
  newPosts: TopicPost[];
  upcomingEvents: TopicEvent[];
  currentMonth: TopicMonth;
  seasonalAngles: SeasonalAngle[];
  /** ISO date string (YYYY-MM-DD) — the issue's nominal send date. */
  issueDate: string;
  /** Human-readable, e.g. "Apr 26, 2026". Used in the subject line. */
  weekOf: string;
}

export function selectTopics({
  now = new Date(),
  lastIssueAt,
}: {
  now?: Date;
  lastIssueAt?: Date;
} = {}): TopicBundle {
  // 1) New blog posts since last issue (or last 30 days).
  const cutoff =
    lastIssueAt ?? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const newPosts: TopicPost[] = posts
    .filter((p) => {
      const date = new Date(p.updatedAt ?? p.publishedAt);
      return date >= cutoff;
    })
    .sort((a, b) => {
      const ad = new Date(a.updatedAt ?? a.publishedAt).getTime();
      const bd = new Date(b.updatedAt ?? b.publishedAt).getTime();
      return bd - ad;
    })
    .slice(0, 4)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      publishedAt: p.updatedAt ?? p.publishedAt,
    }));

  // 2) Upcoming events in the next 14 days, or currently running.
  const todayIso = toIsoDate(now);
  const horizonIso = toIsoDate(addDays(now, 14));

  const upcomingEvents: TopicEvent[] = events
    .filter(
      (e) =>
        // currently running (today within range), OR
        // starting within the horizon
        (e.startDate <= todayIso && e.endDate >= todayIso) ||
        (e.startDate >= todayIso && e.startDate <= horizonIso),
    )
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 4)
    .map((e) => ({
      slug: e.slug,
      name: e.name,
      startDate: e.startDate,
      endDate: e.endDate,
      location: e.location,
      description: e.description,
      url: e.url,
    }));

  // 3) Current month from data/months.ts.
  const monthNumber = now.getMonth() + 1; // 1-12
  const monthData = months.find((m) => m.monthNumber === monthNumber);
  if (!monthData) {
    throw new Error(`No month data for monthNumber=${monthNumber}`);
  }

  const currentMonth: TopicMonth = {
    slug: monthData.slug,
    name: monthData.name,
    headline: monthData.headline,
    intro: monthData.intro,
    avgHigh: monthData.avgHigh,
    avgLow: monthData.avgLow,
    waterTemp: monthData.waterTemp,
    crowdLevel: monthData.crowdLevel,
  };

  // 4) Seasonal angles from logic.
  const seasonalAngles = pickSeasonalAngles(now, monthData);

  return {
    newPosts,
    upcomingEvents,
    currentMonth,
    seasonalAngles,
    issueDate: todayIso,
    weekOf: now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}

// ——— helpers ———————————————————————————————————————————————————————

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

/** Re-export MonthData for convenience in route handlers. */
export type { MonthData };
