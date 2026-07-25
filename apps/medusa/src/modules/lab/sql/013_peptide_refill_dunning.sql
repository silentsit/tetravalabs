-- Peptide Refill hybrid billing: dunning + cycle idempotency
ALTER TABLE lab_restocks
  ADD COLUMN IF NOT EXISTS dunning_stage INTEGER NOT NULL DEFAULT 0;

ALTER TABLE lab_restocks
  ADD COLUMN IF NOT EXISTS dunning_due_at TIMESTAMPTZ;

ALTER TABLE lab_restocks
  ADD COLUMN IF NOT EXISTS last_dunning_email_at TIMESTAMPTZ;

ALTER TABLE lab_restocks
  ADD COLUMN IF NOT EXISTS billing_cycle_key TEXT;

CREATE INDEX IF NOT EXISTS lab_restocks_dunning_due_idx
  ON lab_restocks (dunning_due_at)
  WHERE status = 'past_due'
    AND dunning_due_at IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS lab_restock_shipments_restock_order_uidx
  ON lab_restock_shipments (lab_restock_id, order_id)
  WHERE order_id IS NOT NULL;
