-- Lab Restock (Subscribe & Save) — hybrid scheduled restock (Peptide Pay per cycle)
CREATE TABLE IF NOT EXISTS lab_restocks (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'paused', 'cancelled', 'past_due')),
  product_id TEXT,
  variant_id TEXT NOT NULL,
  handle TEXT NOT NULL,
  title TEXT NOT NULL,
  variant_title TEXT,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_usd NUMERIC(12, 2) NOT NULL,
  one_time_unit_price_usd NUMERIC(12, 2) NOT NULL,
  cadence_days INTEGER NOT NULL CHECK (cadence_days IN (30, 60, 90)),
  discount_pct INTEGER NOT NULL DEFAULT 12,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_checkout_session_id TEXT,
  latest_order_id TEXT,
  next_billing_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  shipping_address JSONB,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lab_restocks_email_idx ON lab_restocks (email);
CREATE INDEX IF NOT EXISTS lab_restocks_customer_idx ON lab_restocks (customer_id);
CREATE INDEX IF NOT EXISTS lab_restocks_stripe_sub_idx ON lab_restocks (stripe_subscription_id);
CREATE INDEX IF NOT EXISTS lab_restocks_status_idx ON lab_restocks (status);

CREATE TABLE IF NOT EXISTS lab_restock_shipments (
  id TEXT PRIMARY KEY,
  lab_restock_id TEXT NOT NULL REFERENCES lab_restocks (id) ON DELETE CASCADE,
  order_id TEXT,
  stripe_invoice_id TEXT,
  amount_usd NUMERIC(12, 2),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'skipped')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS lab_restock_shipments_invoice_uidx
  ON lab_restock_shipments (stripe_invoice_id)
  WHERE stripe_invoice_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS lab_restock_shipments_restock_idx
  ON lab_restock_shipments (lab_restock_id);
