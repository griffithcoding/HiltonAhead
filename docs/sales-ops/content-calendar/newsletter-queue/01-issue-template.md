---
issue_number: 0
send_date: YYYY-MM-DD
subject: "Subject line under 60 characters"
preheader: "Preheader under 100 chars that continues the subject, never repeats it"
segment: general # one of: general | golf | family | couples
primary_link: "/path-to-the-anchor"
status: draft
target_open_rate: 0.33
target_click_rate: 0.053
---

# Issue {n} — {short title}

## HTML body

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>{subject}</title>
</head>
<body style="margin:0;padding:0;background:#F5E8D0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0A2930;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5E8D0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER BAR -->
        <tr><td style="padding:32px 24px 8px 24px;">
          <div style="font-size:18px;font-family:Georgia,serif;color:#0A2930;font-weight:600;">Hilton Ahead</div>
          <div style="font-size:12px;color:#3D5860;margin-top:2px;">Your local insider for Hilton Head travel.</div>
          <div style="font-size:11px;color:#9CA3AF;margin-top:8px;letter-spacing:0.08em;text-transform:uppercase;">Issue {n} · {send_date}</div>
        </td></tr>

        <!-- HERO HOOK -->
        <tr><td style="padding:24px 24px 8px 24px;">
          <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;color:#0A2930;margin:0;letter-spacing:-0.01em;">
            {hero headline}
          </h1>
          <p style="font-size:15px;line-height:1.65;color:#3D5860;margin:14px 0 0 0;">
            {hero hook — 1-2 sentences with a specific number, name, or date}
          </p>
        </td></tr>

        <!-- LEAD STORY -->
        <tr><td style="padding:28px 24px 0 24px;">
          <hr style="border:0;border-top:1px solid rgba(10,41,48,0.1);margin:0 0 20px 0;" />
          <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#C44A2B;font-weight:600;">This week</div>
          <h2 style="font-family:Georgia,serif;font-size:22px;line-height:1.25;color:#0A2930;margin:8px 0 0 0;">{lead headline}</h2>
          <p style="font-size:15px;line-height:1.7;color:#3D5860;margin:14px 0 0 0;">
            {lead paragraph 1 — 80-120 words}
          </p>
          <p style="font-size:15px;line-height:1.7;color:#3D5860;margin:12px 0 0 0;">
            {lead paragraph 2 — 80-120 words, ends with the anchor blog link}
          </p>
          <p style="margin:16px 0 0 0;">
            <a href="{anchor blog URL with UTM}" style="color:#C44A2B;text-decoration:underline;font-size:14px;font-weight:600;">Read the full post →</a>
          </p>
        </td></tr>

        <!-- THREE QUICK HITS -->
        <tr><td style="padding:32px 24px 0 24px;">
          <hr style="border:0;border-top:1px solid rgba(10,41,48,0.1);margin:0 0 20px 0;" />
          <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#C44A2B;font-weight:600;">Three things this week</div>
        </td></tr>

        <tr><td style="padding:18px 24px 0 24px;">
          <div style="font-family:Georgia,serif;font-size:17px;line-height:1.3;color:#0A2930;">{quick hit 1 headline}</div>
          <p style="font-size:14px;line-height:1.65;color:#3D5860;margin:8px 0 0 0;">
            {60 words ending with a link} <a href="{URL with UTM}" style="color:#C44A2B;text-decoration:underline;">Anchor text →</a>
          </p>
        </td></tr>

        <tr><td style="padding:18px 24px 0 24px;">
          <div style="font-family:Georgia,serif;font-size:17px;line-height:1.3;color:#0A2930;">{quick hit 2 headline}</div>
          <p style="font-size:14px;line-height:1.65;color:#3D5860;margin:8px 0 0 0;">
            {60 words ending with a link} <a href="{URL with UTM}" style="color:#C44A2B;text-decoration:underline;">Anchor text →</a>
          </p>
        </td></tr>

        <tr><td style="padding:18px 24px 0 24px;">
          <div style="font-family:Georgia,serif;font-size:17px;line-height:1.3;color:#0A2930;">{quick hit 3 headline}</div>
          <p style="font-size:14px;line-height:1.65;color:#3D5860;margin:8px 0 0 0;">
            {60 words ending with a link} <a href="{URL with UTM}" style="color:#C44A2B;text-decoration:underline;">Anchor text →</a>
          </p>
        </td></tr>

        <!-- CTA BLOCK -->
        <tr><td style="padding:32px 24px 0 24px;">
          <hr style="border:0;border-top:1px solid rgba(10,41,48,0.1);margin:0 0 20px 0;" />
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF3E2;border:1px solid rgba(10,41,48,0.1);">
            <tr><td style="padding:24px;">
              <div style="font-family:Georgia,serif;font-size:18px;line-height:1.3;color:#0A2930;">{CTA headline}</div>
              <p style="font-size:14px;line-height:1.65;color:#3D5860;margin:8px 0 16px 0;">{CTA subtext — 1 sentence}</p>
              <a href="{primary CTA URL with UTM}" style="display:inline-block;background:#0A2930;color:#F5E8D0;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;font-weight:600;">{CTA button label}</a>
            </td></tr>
          </table>
        </td></tr>

        <!-- SIGNOFF -->
        <tr><td style="padding:28px 24px 0 24px;">
          <p style="font-size:15px;line-height:1.7;color:#3D5860;margin:0;">
            Reply if you want a sample plan for your dates. Replies hit my inbox directly.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#3D5860;margin:12px 0 0 0;">
            — Will, Hilton Ahead
          </p>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="padding:36px 24px 36px 24px;">
          <hr style="border:0;border-top:1px solid rgba(10,41,48,0.1);margin:0 0 16px 0;" />
          <div style="font-size:11px;line-height:1.7;color:#9CA3AF;">
            You're getting this because you asked for Hilton Head travel notes at hiltonahead.com. One email a week. <a href="{{unsubscribe_url}}" style="color:#9CA3AF;text-decoration:underline;">Unsubscribe</a> in one click.
          </div>
          <div style="font-size:11px;line-height:1.7;color:#9CA3AF;margin-top:10px;">
            Hilton Ahead Travel Co · Hilton Head Island, SC 29928
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
```

## Plain text fallback

```
HILTON AHEAD — ISSUE {n}
{send_date}

{hero headline}
{hero hook 1-2 sentences}

---
THIS WEEK
---

{lead headline}

{lead paragraph 1}

{lead paragraph 2}

Read the full post: {anchor URL with UTM}

---
THREE THINGS THIS WEEK
---

1. {quick hit 1 headline}
{60 words}
{URL with UTM}

2. {quick hit 2 headline}
{60 words}
{URL with UTM}

3. {quick hit 3 headline}
{60 words}
{URL with UTM}

---
{CTA headline}
{CTA subtext}
{CTA URL with UTM}

---
Reply if you want a sample plan for your dates. Replies hit my inbox directly.

— Will, Hilton Ahead

Unsubscribe: {{unsubscribe_url}}
Hilton Ahead Travel Co · Hilton Head Island, SC 29928
```

## Send metadata

```yaml
recommended_send_time_et: "Friday 08:00"
expected_open_count: ~1155 # 33% of 3500
expected_click_count: ~185 # 5.3% of 3500
target_replies: 3
segment_filter:
  include: ["all"]   # or named segments
  exclude: []
```
