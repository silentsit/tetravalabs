CREATE TABLE IF NOT EXISTS order_fulfillment_emails (
  order_id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  display_id INTEGER,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tracking_sla_due_at TIMESTAMPTZ NOT NULL,
  tracking_sla_sent_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  tracking_number TEXT,
  tracking_url TEXT,
  carrier TEXT,
  shipped_email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS order_fulfillment_emails_sla_due_idx
  ON order_fulfillment_emails (tracking_sla_due_at)
  WHERE tracking_sla_sent_at IS NULL AND shipped_email_sent_at IS NULL;
