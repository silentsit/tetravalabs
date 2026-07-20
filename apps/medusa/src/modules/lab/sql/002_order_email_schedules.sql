CREATE TABLE IF NOT EXISTS order_email_schedules (
  order_id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  display_id INTEGER,
  total_usd NUMERIC(12, 2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'crypto',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  checkout_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmation_due_at TIMESTAMPTZ NOT NULL,
  confirmation_sent_at TIMESTAMPTZ,
  followup_due_at TIMESTAMPTZ,
  followup_sent_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS order_email_schedules_confirmation_due_idx
  ON order_email_schedules (confirmation_due_at)
  WHERE confirmation_sent_at IS NULL AND cancelled_at IS NULL;

CREATE INDEX IF NOT EXISTS order_email_schedules_followup_due_idx
  ON order_email_schedules (followup_due_at)
  WHERE confirmation_sent_at IS NOT NULL AND followup_sent_at IS NULL AND cancelled_at IS NULL;
