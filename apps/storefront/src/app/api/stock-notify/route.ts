import { NextResponse } from "next/server"

type Body = {
  email?: string
  productHandle?: string
  productTitle?: string
  variantId?: string
  strengthLabel?: string
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body
  const email = body.email?.trim().toLowerCase()
  const productHandle = body.productHandle?.trim()
  const productTitle = body.productTitle?.trim()
  const variantId = body.variantId?.trim()
  const strengthLabel = body.strengthLabel?.trim()

  if (!email || !productHandle || !variantId) {
    return NextResponse.json(
      { ok: false, message: "Email and product details are required." },
      { status: 400 }
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, message: "Enter a valid email." }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL || process.env.RESEND_FROM_EMAIL
  const from = process.env.RESEND_FROM || "Tetrava Labs <support@tetravalabs.com>"

  const payload = {
    email,
    productHandle,
    productTitle,
    variantId,
    strengthLabel
  }

  if (!apiKey || !to) {
    console.info("[stock-notify]", payload)
    return NextResponse.json({ ok: true, skipped: "email not configured" })
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
      subject: `[Stock notify] ${productTitle || productHandle} ${strengthLabel || ""}`.trim(),
      html: `<p><strong>${email}</strong> requested stock notification.</p>
        <ul>
          <li>Product: ${productTitle || productHandle}</li>
          <li>Handle: ${productHandle}</li>
          <li>Strength: ${strengthLabel || "n/a"}</li>
          <li>Variant: ${variantId}</li>
        </ul>`
    })
  })

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, message: "Unable to save your request right now." },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
