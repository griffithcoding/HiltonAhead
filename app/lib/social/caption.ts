/**
 * Caption generator for spotlight posts.
 *
 * Calls Claude (Sonnet) with a tight system prompt + structured business
 * data. Returns caption + 2–3 dynamic hashtag suggestions + cost.
 *
 * Failure modes:
 *   - 429 rate limit  → exponential backoff (max 3 retries), then throw
 *   - content blocked → template-only fallback (no LLM), used_fallback=true
 *   - timeout >30s    → abort + throw
 *
 * Inputs piped into the prompt are escaped + length-capped (prompt-injection
 * guard).
 */

import Anthropic from '@anthropic-ai/sdk';
import type { Business } from '@/data/localBusinesses';
import type { DraftCaption } from './types';

const MODEL = 'claude-sonnet-4-5-20250929'; // verify against current alias at deploy

// Pricing as of 2026-05 — keep in sync via env if tuning needed.
const INPUT_PRICE_PER_MTOK = 3.0;
const OUTPUT_PRICE_PER_MTOK = 15.0;

const SYSTEM_PROMPT = `You write short Instagram captions for HiltonAhead.com, a Hilton Head Island travel concierge.

Each post spotlights ONE local business. The caption should:
- Open with a hooky 1-line lead (no emoji at the very start)
- 1–2 short paragraphs total, max 800 characters
- Mention the business by name in the first line
- Capture ONE specific reason a visitor would care (a signature dish, a view, a vibe — not a generic puff)
- End with a soft CTA: "Full profile in our bio."
- Voice: warm, local, specific. Never "discover," "nestled," "hidden gem," "your perfect getaway."
- No emojis other than at most ONE near the end if it lands naturally
- Do not include hashtags in the caption text

Return strict JSON with this shape:
{"caption": "...", "dynamic_tags": ["#tag1", "#tag2"]}

The dynamic_tags should be 2–3 specific tags drawn from the caption's nouns (e.g. #ShrimpBoil, #SunsetSails) — NOT broad ones (we add those separately).`;

function escapeForPrompt(s: string): string {
  return s.replace(/[ -]/g, ' ').slice(0, 500);
}

function buildUserPrompt(b: Business): string {
  // Field names per data/localBusinesses.ts: id (slug), name, tagline, review, industrySlug
  const name = escapeForPrompt(b.name ?? b.id ?? 'this business');
  const review = escapeForPrompt(b.review ?? '');
  const industry = escapeForPrompt(b.industrySlug ?? '');
  const tagline = escapeForPrompt(b.tagline ?? '');
  return [
    `Business: ${name}`,
    industry ? `Industry: ${industry}` : '',
    tagline ? `Tagline: ${tagline}` : '',
    review ? `Editorial review: ${review}` : '',
  ].filter(Boolean).join('\n');
}

function fallbackCaption(b: Business): DraftCaption {
  const name = b.name ?? b.id ?? 'A local favorite';
  return {
    caption: `${name} — a local spot worth a stop on Hilton Head. Full profile in our bio.`,
    hashtags: [], // dynamic tags only here; broad tags added by buildHashtagsFor
    generated_by_model: 'template-fallback',
    generation_cost_usd: 0,
    used_fallback: true,
  };
}

async function callWithBackoff<T>(
  fn: () => Promise<T>,
  attempts = 3,
  baseMs = 800,
): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastErr = err;
      const status = (err as { status?: number })?.status;
      if (status !== 429 && status !== 503) throw err;
      await new Promise((r) => setTimeout(r, baseMs * Math.pow(2, i)));
    }
  }
  throw lastErr;
}

export async function generateCaption(b: Business): Promise<DraftCaption> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fallbackCaption(b);

  const client = new Anthropic({ apiKey });
  const userPrompt = buildUserPrompt(b);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    const msg = await callWithBackoff(() =>
      client.messages.create(
        {
          model: MODEL,
          max_tokens: 600,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        },
        { signal: controller.signal },
      ),
    );

    clearTimeout(timeoutId);

    const text = msg.content
      .filter((c): c is Anthropic.Messages.TextBlock => c.type === 'text')
      .map((c) => c.text)
      .join('');

    const parsed = parseStrictJson(text);
    if (!parsed) return fallbackCaption(b);

    const inputCost = (msg.usage.input_tokens / 1_000_000) * INPUT_PRICE_PER_MTOK;
    const outputCost = (msg.usage.output_tokens / 1_000_000) * OUTPUT_PRICE_PER_MTOK;

    return {
      caption: parsed.caption.slice(0, 800),
      hashtags: Array.isArray(parsed.dynamic_tags) ? parsed.dynamic_tags : [],
      generated_by_model: MODEL,
      generation_cost_usd: Number((inputCost + outputCost).toFixed(4)),
      used_fallback: false,
    };
  } catch {
    clearTimeout(timeoutId);
    // Content-policy blocks and timeouts both fall back to template
    return fallbackCaption(b);
  }
}

function parseStrictJson(s: string): { caption: string; dynamic_tags?: string[] } | null {
  const match = s.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const obj = JSON.parse(match[0]);
    if (typeof obj?.caption === 'string') return obj;
    return null;
  } catch {
    return null;
  }
}
