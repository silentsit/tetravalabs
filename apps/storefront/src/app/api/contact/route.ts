import { NextResponse } from "next/server"
import { buildContactAutoresponderEmail } from "@/lib/contact-autoresponder-email"

type ContactBody = {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")

async function sendResendEmail(input: {
  apiKey: string
  from: string
  to: string
  subject: string
  html: string
  replyTo?: string
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: input.from,
      to: [input.to],
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      subject: input.subject,
      html: input.html
    })
  })

  if (!response.ok) {
    return { ok: false as const, error: await response.text() }
  }

  return { ok: true as const }
}

export async function POST(req: Request) {
  const body = (await req.json()) as ContactBody
  const name = body.name?.trim()
  const email = body.email?.trim()
  const subject = body.subject?.trim()
  const message = body.message?.trim()

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ ok: false, message: "All fields are required." }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL || process.env.RESEND_FROM_EMAIL
  const from = process.env.RESEND_FROM || "Tetrava Labs <support@tetravalabs.com>"

  if (!apiKey || !to) {
    console.info("[contact]", { name, email, subject, message: message.slice(0, 120) })
    return NextResponse.json({ ok: true, skipped: "RESEND_API_KEY or CONTACT_TO_EMAIL not configured" })
  }

  const staffResult = await sendResendEmail({
    apiKey,
    from,
    to,
    replyTo: email,
    subject: `[Contact] ${subject}`,
    html: `<p><strong>${name}</strong> (${email})</p><p>${message.replace(/\n/g, "<br/>")}</p>`
  })

  if (!staffResult.ok) {
    return NextResponse.json({ ok: false, message: staffResult.error }, { status: 502 })
  }

  const autoresponder = buildContactAutoresponderEmail({
    name,
    subject,
    contactUrl: `${SITE_URL}/contact`
  })

  const customerResult = await sendResendEmail({
    apiKey,
    from,
    to: email,
    subject: autoresponder.subject,
    html: autoresponder.html
  })

  if (!customerResult.ok) {
    console.warn("[contact] autoresponder failed:", customerResult.error)
    // Staff inbox already received the message — do not fail the form.
    return NextResponse.json({ ok: true, autoresponder: false })
  }

  return NextResponse.json({ ok: true, autoresponder: true })
}
