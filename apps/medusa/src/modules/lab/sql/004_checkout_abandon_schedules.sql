CREATE TABLE IF NOT EXISTS checkout_abandon_schedules (
  session_id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal_usd NUMERIC(12, 2) NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reminder_due_at TIMESTAMPTZ NOT NULL,
  reminder_sent_at TIMESTAMPTZ,
  followup_due_at TIMESTAMPTZ,
  followup_sent_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS checkout_abandon_reminder_due_idx
  ON checkout_abandon_schedules (reminder_due_at)
  WHERE reminder_sent_at IS NULL AND cancelled_at IS NULL;

CREATE INDEX IF NOT EXISTS checkout_abandon_followup_due_idx
  ON checkout_abandon_schedules (followup_due_at)
  WHERE reminder_sent_at IS NOT NULL AND followup_sent_at IS NULL AND cancelled_at IS NULL;

CREATE INDEX IF NOT EXISTS checkout_abandon_email_idx
  ON checkout_abandon_schedules (email)
  WHERE cancelled_at IS NULL;
