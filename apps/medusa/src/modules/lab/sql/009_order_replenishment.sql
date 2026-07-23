-- Soft replenishment ladder after ship (R1/R2/R3)
ALTER TABLE order_fulfillment_emails
  ADD COLUMN IF NOT EXISTS r1_due_at TIMESTAMPTZ;

ALTER TABLE order_fulfillment_emails
  ADD COLUMN IF NOT EXISTS r1_sent_at TIMESTAMPTZ;

ALTER TABLE order_fulfillment_emails
  ADD COLUMN IF NOT EXISTS r2_due_at TIMESTAMPTZ;

ALTER TABLE order_fulfillment_emails
  ADD COLUMN IF NOT EXISTS r2_sent_at TIMESTAMPTZ;

ALTER TABLE order_fulfillment_emails
  ADD COLUMN IF NOT EXISTS r3_due_at TIMESTAMPTZ;

ALTER TABLE order_fulfillment_emails
  ADD COLUMN IF NOT EXISTS r3_sent_at TIMESTAMPTZ;

ALTER TABLE order_fulfillment_emails
  ADD COLUMN IF NOT EXISTS replenishment_cancelled_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS order_fulfillment_emails_r1_due_idx
  ON order_fulfillment_emails (r1_due_at)
  WHERE r1_sent_at IS NULL
    AND shipped_email_sent_at IS NOT NULL
    AND replenishment_cancelled_at IS NULL;

CREATE INDEX IF NOT EXISTS order_fulfillment_emails_r2_due_idx
  ON order_fulfillment_emails (r2_due_at)
  WHERE r1_sent_at IS NOT NULL
    AND r2_sent_at IS NULL
    AND replenishment_cancelled_at IS NULL;

CREATE INDEX IF NOT EXISTS order_fulfillment_emails_r3_due_idx
  ON order_fulfillment_emails (r3_due_at)
  WHERE r2_sent_at IS NOT NULL
    AND r3_sent_at IS NULL
    AND replenishment_cancelled_at IS NULL;
