import { NextResponse } from "next/server"

type ContactBody = {
  name?: string
  email?: string
  subject?: string
  message?: string
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

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `[Contact] ${subject}`,
      html: `<p><strong>${name}</strong> (${email})</p><p>${message.replace(/\n/g, "<br/>")}</p>`
    })
  })

  if (!response.ok) {
    const error = await response.text()
    return NextResponse.json({ ok: false, message: error }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
