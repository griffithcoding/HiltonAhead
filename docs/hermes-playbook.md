# Hermes Playbook for HiltonAhead

How to use Hermes Agent (`%LOCALAPPDATA%\hermes\hermes-agent`) to (1) move money on HiltonAhead and (2) learn your own business faster.

---

## 0. First-run setup (do once)

```powershell
hermes setup --portal      # OAuth into Nous Portal → 300+ models + web search + image gen + TTS + cloud browser under one sub
hermes doctor              # confirm install
hermes tools               # turn on: web_search, file_ops, shell, browser, schedule
```

Then point Hermes at this repo as its working dir:

```powershell
hermes config set workspace.root "C:\Users\wgrif\Projects\HiltonAhead"
```

Drop a context file so every session knows the business:

```powershell
# in repo root
cp CLAUDE.md AGENTS.md      # Hermes reads AGENTS.md by convention
```

---

## 1. Talk to it from your phone (gateway)

This is the #1 unlock. You stop being chained to the laptop.

```powershell
hermes gateway setup        # walks Telegram bot creation (or Discord/Slack/WhatsApp/Signal)
hermes gateway start        # run as daemon — or move to $5 VPS so it's always on
```

Once live:
- Voice memo while driving → transcribed → "draft a cold email to that Charlotte wedding planner I mentioned"
- "/insights 7" → weekly summary of what you've worked on
- "Show me leads from last 3 days" → it queries Supabase via your existing CRM
- "Push a fix for the broken `/local/restaurants` sort" → it opens the repo, fixes, commits, PRs

---

## 2. Money-making cron schedule (set once, runs forever)

```powershell
hermes              # enter TUI
/schedule
```

Suggested jobs for HiltonAhead:

| Cron | Job | Why |
|------|-----|-----|
| `0 7 * * MON-FRI` | Draft 3 cold-email variants for next feeder-city target (Charlotte/Atlanta/NYC), use `agent-sales` skill, send to Telegram for approval | Daily outreach without you writing |
| `0 8 * * MON` | Pull Stripe weekly purchase report + newsletter open rates, post summary to Telegram | Monday revenue snapshot |
| `0 9 * * *` | Scan competitor LLM-SEO surface (hiltonheadinsider.com, etc.), diff vs last week, flag content gaps | Stay ahead in AI Overviews |
| `0 10 * * TUE` | Generate 1 blog brief targeting next keyword cluster from `data/posts.ts` gaps, draft to `/inbox` | Steady content cadence |
| `0 18 * * *` | Tail `purchases` + `business_inquiries` tables, alert if any new B2B inquiry | Don't miss directory leads |
| `0 11 * * FRI` | Generate Amazon affiliate post draft for the week's hot Hilton Head product | Affiliate revenue |
| `30 6 * * *` | Check Vercel deploy + cron health (you have `sales-sequence-tick` scheduling mismatch — obs 642), alert if broken | Catches the bug class you already hit |

Each cron delivers to Telegram. You approve/edit/kill from your phone.

---

## 3. Codify your playbooks as skills

You already have `agent-sales`, `ceo-call-down`, `summary-plan` skills in Claude Code. Port them to Hermes:

```powershell
# in repo root
mkdir -p .hermes/skills
# copy the markdown skill files from your .claude/skills or similar
hermes skills sync
```

Then Hermes calls them the same way Claude Code does: `/agent-sales charlotte wedding planners`, `/ceo-call-down "should I bundle directory + itinerary for resort partners?"`.

**The learning loop:** after Hermes completes a complex task (e.g., a full outreach campaign), it'll offer to extract the steps into a new skill. Accept. Now next month's campaign is one command.

---

## 4. Learn what you're already doing (the deepening model)

Hermes builds a Honcho user model across sessions — every conversation refines its understanding of you, your business, your taste.

Force-feed it:

```powershell
hermes                      # in TUI
/personality founder        # or create one: bias toward Hilton Head context, lowcountry tone, etc.
/insights 30                # what have you been working on for 30 days — surfaces patterns you didn't notice
/memory                     # see what it remembers about you
```

Then ask things you'd ask a sharp consultant who'd been watching you for a month:
- "Where am I leaking time?"
- "Which of my 4 workstreams (B1-B4 directory billing, LLM SEO, sales outreach, affiliate) has the worst ROI per hour I put in?"
- "What's the bottleneck between a feeder-city cold email and a closed itinerary?"
- "Read my last 50 commits and tell me what I avoid working on."

The honest answers are the unlock.

---

## 5. Subagents for parallel work

You already use this pattern in Claude Code. Hermes does it too:

```
/spawn "Audit /local/[industry] pages for missing TierBadge integration, return list of files needing edit"
/spawn "Pull last 30d Stripe disputes + refunds, categorize, suggest webhook hardening"
/spawn "Find every page emitting Speakable schema, verify the DOM selectors render"
```

Three subagents, three workstreams, zero context cost to your main session. Results come back as summaries.

---

## 6. The $5 VPS move (when ready)

Run Hermes on a DigitalOcean/Hetzner droplet. Telegram bot stays online 24/7. Cron jobs run whether your laptop is open or not. Cost: ~$5/mo.

```bash
# on the VPS
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
hermes setup --portal
hermes gateway start --daemon
```

Migrate your skills + memory:

```powershell
# local
hermes export ~/hermes-backup.tar.gz
# scp to VPS, then:
hermes import ~/hermes-backup.tar.gz
```

---

## 7. First week — concrete checklist

- [ ] `hermes setup --portal` + `hermes doctor`
- [ ] Drop `AGENTS.md` (copy of CLAUDE.md) in repo root
- [ ] `hermes gateway setup` → Telegram bot live
- [ ] Schedule the Monday revenue snapshot cron (easiest win)
- [ ] Schedule the daily feeder-city outreach draft cron
- [ ] Port 2 of your existing skills (`agent-sales`, `summary-plan`) into `.hermes/skills`
- [ ] One real conversation: "Read my last 14 days of work and tell me what's actually moving the needle vs. busywork."

---

## Docs

- Full docs: https://hermes-agent.nousresearch.com/docs/
- Gateway: https://hermes-agent.nousresearch.com/docs/user-guide/messaging
- Skills: https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
- Cron: https://hermes-agent.nousresearch.com/docs/user-guide/features/cron
