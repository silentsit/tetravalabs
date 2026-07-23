-- C1c — third checkout abandon email (~48h after session start)
ALTER TABLE checkout_abandon_schedules
  ADD COLUMN IF NOT EXISTS final_due_at TIMESTAMPTZ;

ALTER TABLE checkout_abandon_schedules
  ADD COLUMN IF NOT EXISTS final_sent_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS checkout_abandon_final_due_idx
  ON checkout_abandon_schedules (final_due_at)
  WHERE followup_sent_at IS NOT NULL
    AND final_sent_at IS NULL
    AND cancelled_at IS NULL;
