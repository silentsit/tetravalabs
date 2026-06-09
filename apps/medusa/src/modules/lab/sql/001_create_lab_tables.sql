CREATE TABLE IF NOT EXISTS lab_batch_documents (
  id TEXT PRIMARY KEY,
  variant_id TEXT NOT NULL,
  batch_number TEXT NOT NULL,
  purity_percent NUMERIC(5,2),
  tested_at TIMESTAMPTZ,
  document_type TEXT NOT NULL CHECK (document_type IN ('coa', 'hplc')),
  document_url TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lab_batch_documents_variant_idx
  ON lab_batch_documents (variant_id);

CREATE INDEX IF NOT EXISTS lab_batch_documents_batch_idx
  ON lab_batch_documents (batch_number);

CREATE TABLE IF NOT EXISTS order_compliance_records (
  order_id TEXT PRIMARY KEY,
  disclaimer_version TEXT NOT NULL,
  acknowledged_at TIMESTAMPTZ NOT NULL,
  shipping_country TEXT,
  ip_country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_webhook_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  mapped_status TEXT NOT NULL,
  order_id TEXT,
  payment_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crypto_payment_intents (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  amount_usd NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL,
  provider_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE crypto_payment_intents ADD COLUMN IF NOT EXISTS provider_payment_id TEXT;
ALTER TABLE crypto_payment_intents ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL DEFAULT 'placeholder';

CREATE INDEX IF NOT EXISTS crypto_payment_intents_provider_payment_idx
  ON crypto_payment_intents (provider_payment_id);
