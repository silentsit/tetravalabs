type ContactAutoresponderInput = {
  name: string
  subject: string
  contactUrl: string
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export function buildContactAutoresponderEmail(input: ContactAutoresponderInput) {
  const firstName = input.name.split(/\s+/)[0] || input.name

  const html = `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background:#050508;font-family:Inter,Segoe UI,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#0A0A10;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:28px;">
      <p style="margin:0 0 8px;color:#5EEAD4;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;">Tetrava Labs</p>
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">We received your message</h1>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Hi ${escapeHtml(firstName)}, thanks for contacting Tetrava Labs.
        We got your note about <strong style="color:#E8E8F0;">${escapeHtml(input.subject)}</strong>.
      </p>
      <p style="margin:0 0 16px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        Our research support team typically replies within <strong style="color:#E8E8F0;">1–2 business days</strong>.
        If this is about an order, including your order number in a reply helps us look it up faster.
      </p>
      <p style="margin:0 0 20px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        No action is needed right now — we will follow up at this email address.
      </p>
      <a href="${escapeHtml(input.contactUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        Back to contact
      </a>
      <hr style="margin:28px 0;border:none;border-top:1px solid rgba(255,255,255,0.1);" />
      <p style="margin:0;color:#8A8AA0;font-size:11px;line-height:1.5;">
        Research Use Only — not for human consumption.
      </p>
    </div>
  </body>
</html>`.trim()

  return {
    subject: `We received your message: ${input.subject}`,
    html
  }
}
