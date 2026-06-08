import { NextResponse } from "next/server"

type Body = {
  email?: string
  orderId?: string
  total?: number
}

export async function POST(req: Request) {
  const payload = (await req.json()) as Body
  const { email, orderId, total } = payload
  if (!email || !orderId) {
    return NextResponse.json({ ok: false, message: "email and orderId are required" }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || "Tetrava Labs <orders@tetravalabs.com>"
  if (!apiKey) {
    return NextResponse.json({ ok: true, skipped: "RESEND_API_KEY not configured" })
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: `Order received: ${orderId}`,
      html: `<p>Your research order <strong>${orderId}</strong> has been recorded.</p><p>Total: $${(
        total || 0
      ).toFixed(2)}</p><p>Research Use Only. Not for human consumption.</p>`
    })
  })

  if (!response.ok) {
    const error = await response.text()
    return NextResponse.json({ ok: false, error }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
