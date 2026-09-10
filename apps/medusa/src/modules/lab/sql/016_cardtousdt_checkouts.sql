ALTER TABLE crypto_payment_intents
  ADD COLUMN IF NOT EXISTS webhook_secret TEXT,
  ADD COLUMN IF NOT EXISTS fallback_secret TEXT,
  ADD COLUMN IF NOT EXISTS deposit_address TEXT,
  ADD COLUMN IF NOT EXISTS request_id TEXT,
  ADD COLUMN IF NOT EXISTS txid_out TEXT,
  ADD COLUMN IF NOT EXISTS coin TEXT,
  ADD COLUMN IF NOT EXISTS value_coin TEXT,
  ADD COLUMN IF NOT EXISTS paid_usd NUMERIC(18, 8),
  ADD COLUMN IF NOT EXISTS hold_reason TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS crypto_payment_intents_txid_out_uidx
  ON crypto_payment_intents (txid_out)
  WHERE txid_out IS NOT NULL;
