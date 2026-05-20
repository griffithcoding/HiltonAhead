import type { MetadataRoute } from 'next'
import { brand } from '@/data/brand'

/**
 * Robots policy.
 *
 * LLM crawlers are split into two categories:
 *   - Real-time fetchers (ChatGPT-User, OAI-SearchBot, Claude-User, Claude-SearchBot,
 *     PerplexityBot, etc.) hit pages live when a user asks a question. We allow these
 *     because they directly drive citations.
 *   - Training-corpus crawlers (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended,
 *     Meta-ExternalAgent, cohere-ai). We allow these too — getting Hilton Ahead into
 *     model training data is the long-game LLM-SEO play.
 *
 * Every public-facing path is fair game; admin/api routes stay disallowed for all UAs.
 *
 * If we ever need to block a specific crawler later, add a rule above the catch-all `*`.
 */
const LLM_USER_AGENTS = [
  // OpenAI
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  // Anthropic
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  // Perplexity
  'PerplexityBot',
  'Perplexity-User',
  // Google AI / Gemini
  'Google-Extended',
  // Apple Intelligence
  'Applebot-Extended',
  // Meta AI
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  // Cohere
  'cohere-ai',
  'cohere-training-data-crawler',
  // Mistral / DuckDuckGo / Diffbot — broader coverage
  'DuckAssistBot',
  'Diffbot',
]

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url
  return {
    rules: [
      // General catch-all — same disallow list as before.
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/', '/admin/'] },
      // Explicit allow rules for every major LLM crawler. Listing them
      // individually (rather than relying on the wildcard) overrides any
      // upstream defaults and signals intent unambiguously to operators
      // running site-audit tools.
      ...LLM_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
