-- Customer lifecycle emails: welcome + winback schedules
CREATE TABLE IF NOT EXISTS customer_lifecycle_emails (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  email TEXT NOT NULL,
  kind TEXT NOT NULL,
  due_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (customer_id, kind)
);

CREATE INDEX IF NOT EXISTS customer_lifecycle_emails_due_idx
  ON customer_lifecycle_emails (due_at)
  WHERE sent_at IS NULL AND cancelled_at IS NULL;

CREATE INDEX IF NOT EXISTS customer_lifecycle_emails_customer_idx
  ON customer_lifecycle_emails (customer_id)
  WHERE cancelled_at IS NULL;

CREATE INDEX IF NOT EXISTS customer_lifecycle_emails_email_idx
  ON customer_lifecycle_emails (email)
  WHERE cancelled_at IS NULL;
