type PasswordResetEmailInput = {
  resetUrl: string
  email: string
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export function buildPasswordResetEmail(input: PasswordResetEmailInput) {
  const { resetUrl, email } = input

  const html = `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background:#050508;font-family:Inter,Segoe UI,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#0A0A10;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:28px;">
      <p style="margin:0 0 8px;color:#5EEAD4;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;">Tetrava Labs</p>
      <h1 style="margin:0 0 12px;color:#E8E8F0;font-size:24px;font-weight:600;">Reset your password</h1>
      <p style="margin:0 0 20px;color:#8A8AA0;font-size:14px;line-height:1.5;">
        We received a request to reset the password for <strong style="color:#E8E8F0;">${escapeHtml(email)}</strong>.
        Use the button below to choose a new password.
      </p>
      <a href="${escapeHtml(resetUrl)}"
         style="display:inline-block;background:#5EEAD4;color:#050508;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
        Reset password
      </a>
      <p style="margin:20px 0 0;color:#8A8AA0;font-size:12px;line-height:1.5;">
        If the button does not work, copy and paste this link into your browser:<br />
        <a href="${escapeHtml(resetUrl)}" style="color:#5EEAD4;word-break:break-all;">${escapeHtml(resetUrl)}</a>
      </p>
      <p style="margin:16px 0 0;color:#8A8AA0;font-size:12px;line-height:1.5;">
        This link expires soon for security. If you did not request a password reset, you can ignore this email.
      </p>
      <hr style="margin:28px 0;border:none;border-top:1px solid rgba(255,255,255,0.1);" />
      <p style="margin:0;color:#8A8AA0;font-size:11px;line-height:1.5;">
        Research Use Only — not for human consumption. Questions? Visit
        <a href="${escapeHtml(new URL(resetUrl).origin)}/contact" style="color:#5EEAD4;">contact</a>.
      </p>
    </div>
  </body>
</html>`.trim()

  return {
    subject: "Reset your Tetrava Labs password",
    html
  }
}
