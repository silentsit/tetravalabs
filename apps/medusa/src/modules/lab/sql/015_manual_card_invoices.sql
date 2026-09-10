CREATE TABLE IF NOT EXISTS manual_card_invoices (
  order_id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  display_id INTEGER,
  first_name TEXT,
  last_name TEXT,
  payment_method TEXT NOT NULL DEFAULT 'manual_card_invoice',
  payment_method_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'on_hold',
  amount_usd NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  shipping JSONB,
  internal_note TEXT NOT NULL DEFAULT 'Awaiting invoice payment',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS manual_card_invoices_status_idx
  ON manual_card_invoices (status, created_at DESC);

CREATE INDEX IF NOT EXISTS manual_card_invoices_email_idx
  ON manual_card_invoices (email);
