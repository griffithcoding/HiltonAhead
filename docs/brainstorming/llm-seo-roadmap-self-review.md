# LLM SEO Roadmap — Self-Review

**Reviewed:** 2026-05-19
**Scope:** Plan file (`~/.claude/plans/build-llm-seo-roadmap-generic-cerf.md`) + Phase 1 implementation (this branch's 19 changed files).
**Method:** Single-AI adversarial pass. Stand-in for `/gsd-review` (no GSD planning structure, no external CLIs installed).

---

## Summary

The roadmap is directionally sound and the Phase 1 technical scaffolding (robots, schema helpers, founder data, FAQ expansion, llms.txt, breadcrumbs/TLDR/QuickFact components) ships clean. The biggest risks are not in the code — they're in the **success metric** (gameable), the **dependence on unsettled standards** (llms.txt, Speakable), and the **off-site execution velocity** that a solo founder probably can't actually sustain. Phase 1 has two real bugs that will cause schema validator failures or production noise and should be fixed before launch.

---

## Strengths

- **Audit-first sequencing.** Plan opens with what already exists (12+ schema types, dynamic sitemap, OG generation) and doesn't propose redundant work. Schema helpers extend rather than replace the existing `app/lib/metadata.ts`.
- **Single source of truth respected.** Founder bio lives in `data/founder.ts`, used by Person schema + (future) blog author refs + llms.txt. Matches CLAUDE.md rule for brand-surface values.
- **Honest about Wikipedia.** Plan acknowledges notability bar may not be met and defers — rare for SEO roadmaps that usually slot Wikipedia as a tactic regardless.
- **GPTBot reversal with explicit allow-list.** Listing each crawler individually (rather than wildcard) signals intent and survives upstream policy changes. Good defensive write.
- **FAQ expansion has citation-shaped answers.** 30 Q&A pairs lead with the direct answer in sentence one, then context. Exactly the format LLMs lift verbatim.
- **Speakable selectors mapped to real DOM classes** (`.faq-answer`, `.cluster-summary`, `.tldr-block`). Not just decorative JSON-LD.

---

## Concerns

### HIGH

- **`H1` — SearchAction target points at `/blog?q={search_term_string}`, which has no real search handler.** The `/blog` page does not consume a `q` query param. Google Rich Results Test will mark the SearchAction as invalid when it probes the URL template, and sitelinks searchbox won't render. **Fix:** either ship a real `/search?q=` route (cheapest: client-side filter over `posts.ts` titles/excerpts) or remove `potentialAction` from `getWebSiteSchema()` until the route exists.
- **`H2` — Success metric is unfalsifiable.** "≥40% mention rate across 25 weekly prompts" — but we pick the prompts and grade them ourselves. No third-party baseline (Profound/Otterly numbers), no competitor benchmark, no tie to revenue or qualified leads. Easy to game by selecting softball prompts ("local travel consultant in Sea Pines"). **Fix:** anchor the metric to (a) referrer-tracked LLM sessions in analytics, (b) at least one third-party measurement tool, (c) a fixed prompt set committed before measurement starts. Add a revenue/lead proxy: "≥X bookings attributed to LLM-referrer cookie within 90 days."
- **`H3` — Phase 3 parallelism is unrealistic.** Plan runs Phase 3 (off-site: Wikidata + GBP + TripAdvisor + Bing + Reddit + Quora + YouTube + 8 press pitches + 3 guest posts) **in parallel** with Phase 2 (30+ new content pages, real testimonial collection, comparison hub). For a solo founder this is 25–40 hrs/week of incremental work for 6 weeks straight. Roadmap will collapse on contact with reality. **Fix:** sequence Phase 3 to start Day 45 not Day 30, or budget a VA / freelance writer explicitly in the plan, not as an afterthought in the risks section.

### MEDIUM

- **`M1` — Organization schema now duplicated.** `app/layout.tsx` emits `getOrganizationSchema()` site-wide. The homepage `app/page.tsx` very likely also emits it (per existing audit). Same `@id` (`#organization`) means validators treat it as one entity by reference — but inspecting the page source will show two `<script type="application/ld+json">` blocks with identical content. Clean but noisy. **Verify** and consolidate: layout emits, page does not.
- **`M2` — `robots.ts` silently added `/admin/` to disallow.** Plan called for crawler allowlist; I extended the disallow list to include `/admin/`. Probably correct, but it's a policy change beyond what the user approved. **Action:** mention in PR description, confirm with user.
- **`M3` — `data/founder.ts` has `yearsOnIsland: 30` but the existing /founder page says "since the early '90s"** (≈34 years as of 2026). Conservative but inaccurate. User should set the precise number.
- **`M4` — llms-full.txt was never written despite being listed in `public/llms.txt` ("see llms-full.txt").** Either ship the file (concatenated long-form: founder bio + faqAll + services + top 5 blog post intros) or remove the link from llms.txt. Currently links to a 404.
- **`M5` — Plain-text email exposure in `llms.txt`.** Indirectly, since llms.txt routes LLM crawlers to pages that surface `hello@hiltonahead.com`. Spam scrapers already harvest it from the site, but the dedicated AI-crawler index makes it more discoverable. Low impact for this brand size; flag for awareness.
- **`M6` — `next.config.ts` not touched.** Plan called for verifying CSP/headers don't block crawlers. Did not check. Most likely fine but unverified.
- **`M7` — Affiliate-link surface tension with "honest local read" brand.** Existing `data/affiliateLinks.ts` stamps tracking on outbound links. LLMs increasingly weigh "is this honest content or sponsored content?" when deciding what to cite. Not a Phase 1 blocker, but the differentiator the LLM is supposed to cite (the "drove past the villa this morning" voice) can erode if every link is `?utm_source=affiliate&...`. Worth an audit pass in Phase 2.
- **`M8` — Reddit/Quora plan is thinly specified and easy to get banned for.** "Build karma, occasional unobtrusive mention" — vague enough that an enthusiastic VA executing this gets a permanent shadowban in week 3. **Fix:** add a hard rule: maximum 1 brand mention per 10 substantive comments, never link the site in a top-level comment, never astroturf, use a real personal account (not a brand handle).

### LOW

- **`L1` — TldrBlock and QuickFact components ship unused.** Created but no page renders them. Phase 2 will use them; meanwhile they sit in the bundle. Trivial overhead but visible in code-review.
- **`L2` — Visible breadcrumbs added only to /about, /founder, /faq.** Plan called for neighborhood/blog/local/story pages too. Phase 1 incomplete on this dimension — flag as carry-over.
- **`L3` — No automated tests added.** Project has Playwright. Could ship a single smoke test verifying `/faq` renders, `/llms.txt` returns 200 with valid markdown, `/robots.txt` no longer disallows `GPTBot`. Defer is OK but worth a TODO.
- **`L4` — llms.txt is static, not generated.** Plan called for `scripts/generate-llms-txt.ts` reading `data/`. Static is fine for the brand size, but if `data/brand.ts` is renamed or domain changes, llms.txt drifts silently. Add a comment block in the file pointing to source-of-truth invariants.
- **`L5` — Speakable schema's actual support is overstated.** Google's Speakable spec is officially limited to news publishers. Voice assistants outside Google Assistant don't consume it widely. Costs nothing to include but the plan's "voice/AI assistant" framing oversells the impact.
- **`L6` — llms.txt is an unsettled standard.** Only Anthropic has publicly endorsed honoring llms.txt as of mid-2026. OpenAI, Google, Meta have not committed. The file is cheap to ship and could pay off; just don't treat it as foundational in measurement.
- **`L7` — Footer "Explore" column now has 12 links** (added FAQ). Minor link-juice dilution, probably not material.
- **`L8` — Person schema's `sameAs: []` is empty.** No LinkedIn, no Instagram, no Twitter. Until populated, the Person entity has zero outbound knowledge-graph anchors. Phase 3 includes claiming social accounts; the schema gap is real until then.

---

## Suggestions

1. **Before shipping Phase 1, fix `H1` (SearchAction).** Either implement `/search` or remove `potentialAction` from `getWebSiteSchema()`. Don't ship invalid schema to production.
2. **Write `public/llms-full.txt`** so the link in llms.txt isn't broken. Even a minimal version (founder bio + faqAll + services list) is enough.
3. **Add a fixed prompt rubric file** at `docs/llm-seo/prompt-tests.md` with 25 prompts committed to git BEFORE measurement starts. Prevents post-hoc cherry-picking.
4. **Add `LLM_REFERRERS` constant** to a shared analytics util and start tagging sessions from `chatgpt.com`, `chat.openai.com`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`, `claude.ai` immediately. Baseline data starts accumulating from day 1.
5. **Rework Phase 3 sequencing.** Move it to Days 45–90, or budget a VA at 5–10 hrs/week explicitly in the plan, not the risks section.
6. **Add a smoke test:** `tests/llm-seo.spec.ts` asserting `/faq` 200, llms.txt 200 + non-empty body, robots.txt contains `GPTBot` with `Allow:` not `Disallow:`.
7. **Connect Person schema to Organization** via `Organization.founder: { '@id': '/founder#person' }` cross-reference. Tightens the knowledge graph.
8. **Audit affiliate links for citation-friendliness.** Specifically, any link the AI is supposed to recommend ("our favorite Skull Creek table") should not be a tracking URL — keep those raw.
9. **Pick a single LLM mention-tracking tool now** (Profound, Otterly, or AthenaHQ) and budget the ~$150/mo. Without external measurement, success criteria stay subjective.
10. **Sanity-check the founder's `yearsOnIsland` value** with the user before this hits Person schema in production.

---

## Risk Assessment

**Overall: MEDIUM**

- **Phase 1 code risk: LOW** — additive changes, existing tests would have caught contract breaks, schema additions don't break existing renders. One real correctness bug (H1) that needs fixing.
- **Phase 2 content risk: MEDIUM** — 30+ pages of new content, real testimonial collection. Realistic only with writer support or AI-assist (which carries its own Google ranking risk if low-quality).
- **Phase 3 off-site risk: MEDIUM-HIGH** — Wikipedia notability ≈ won't clear bar, Wikidata can be deleted by editors, Reddit/Quora plan is thin on execution discipline, press outreach has long lead times. Easy to spend 6 weeks here with little to show.
- **Measurement risk: HIGH** — without external tooling and a pre-committed prompt set, the 40% mention-rate target is unfalsifiable and won't survive scrutiny from a real PM/marketing review.

The plan ships value even if Phase 3 underperforms (technical foundation + 30 FAQ + comparison pages are durable assets). But the headline success metric needs to be re-anchored before this becomes the basis for budget or staffing decisions.

---

## What the GSD multi-AI review would probably catch that I didn't

- **Gemini-style review** would likely push back on the **GPTBot reversal** more sharply — privacy-conscious, would surface that opting into training-corpus crawling is a one-way door (you can't unbake content from a model's weights). Worth a second look.
- **Codex-style review** would probably flag the **TypeScript type for `disallow: string[]`** vs Next.js's expected `string | string[]` union, plus the `faqAll.flatMap` cast to `readonly FaqItem[]`. Both currently compile but could be tightened.
- **CodeRabbit** would likely flag the **duplicate Organization schema** (M1) and the **unused TldrBlock/QuickFact exports** (L1) automatically.

If the user wants stronger adversarial coverage on the next phase, install at least Gemini CLI before `/gsd-review` runs.
