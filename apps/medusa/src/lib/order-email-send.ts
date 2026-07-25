export async function sendHtmlEmail(input: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || "Tetrava Labs <orders@tetravalabs.com>"
  if (!apiKey) return { sent: false, reason: "RESEND_API_KEY not configured" }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      html: input.html
    })
  })

  if (!response.ok) {
    return { sent: false, reason: await response.text() }
  }

  return { sent: true }
}
