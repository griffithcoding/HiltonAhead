import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { sendBusinessInquiryNotification } from '@/app/lib/email'

function clamp(s: unknown, max: number): string {
  if (typeof s !== 'string') return ''
  return s.trim().slice(0, max)
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const businessName = clamp(body.businessName, 120)
  const contactName = clamp(body.contactName, 80)
  const email = clamp(body.email, 160)
  const phone = clamp(body.phone, 30)
  const industry = clamp(body.industry, 60)
  const website = clamp(body.website, 240)
  const tierInterest = clamp(body.tierInterest, 40)
  const message = clamp(body.message, 1000)

  if (!businessName) {
    return NextResponse.json({ ok: false, error: 'Business name is required.' }, { status: 400 })
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'A valid email address is required.' }, { status: 400 })
  }

  const userAgent = req.headers.get('user-agent')

  // Persist to Supabase (best-effort — don't fail the request if DB is down)
  let dbOk = false
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('business_inquiries').insert({
      business_name: businessName,
      contact_name: contactName || null,
      email,
      phone: phone || null,
      industry: industry || null,
      website: website || null,
      tier_interest: tierInterest || null,
      message: message || null,
      user_agent: userAgent?.slice(0, 500) || null,
    })
    dbOk = !error
    if (error) console.error('[business-inquiry] supabase error:', error.message)
  } catch (err) {
    console.error('[business-inquiry] supabase exception:', err)
  }

  // Send email notification (best-effort)
  let emailOk = false
  try {
    const result = await sendBusinessInquiryNotification({
      businessName,
      contactName,
      email,
      phone,
      industry,
      website,
      tierInterest,
      message,
      userAgent,
    })
    emailOk = result.ok
    if (!result.ok && !('skipped' in result && result.skipped)) {
      console.error('[business-inquiry] email error:', (result as { error: string }).error)
    }
  } catch (err) {
    console.error('[business-inquiry] email exception:', err)
  }

  if (!dbOk && !emailOk) {
    return NextResponse.json(
      { ok: false, error: 'Unable to process your request. Please email hello@hiltonahead.com directly.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
