-- P2 COA / batch trust email (~5 days after ship)
ALTER TABLE order_fulfillment_emails
  ADD COLUMN IF NOT EXISTS coa_trust_due_at TIMESTAMPTZ;

ALTER TABLE order_fulfillment_emails
  ADD COLUMN IF NOT EXISTS coa_trust_sent_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS order_fulfillment_emails_coa_trust_due_idx
  ON order_fulfillment_emails (coa_trust_due_at)
  WHERE coa_trust_sent_at IS NULL AND shipped_email_sent_at IS NOT NULL;
