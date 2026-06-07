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
