-- Soft R1–R3 one-click reorder magic links (not Peptide Refill billing)
CREATE TABLE IF NOT EXISTS order_reorder_tokens (
  id TEXT PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  order_id TEXT NOT NULL,
  email TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS order_reorder_tokens_order_idx
  ON order_reorder_tokens (order_id);

CREATE INDEX IF NOT EXISTS order_reorder_tokens_email_idx
  ON order_reorder_tokens (email);

CREATE INDEX IF NOT EXISTS order_reorder_tokens_expires_idx
  ON order_reorder_tokens (expires_at)
  WHERE used_at IS NULL;
