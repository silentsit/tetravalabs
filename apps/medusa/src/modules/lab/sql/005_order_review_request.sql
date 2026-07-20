ALTER TABLE order_fulfillment_emails
  ADD COLUMN IF NOT EXISTS review_due_at TIMESTAMPTZ;

ALTER TABLE order_fulfillment_emails
  ADD COLUMN IF NOT EXISTS review_sent_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS order_fulfillment_emails_review_due_idx
  ON order_fulfillment_emails (review_due_at)
  WHERE review_sent_at IS NULL AND shipped_email_sent_at IS NOT NULL;
