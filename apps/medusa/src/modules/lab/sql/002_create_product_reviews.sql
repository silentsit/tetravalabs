CREATE TABLE IF NOT EXISTS product_reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_handle TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, customer_id)
);

CREATE INDEX IF NOT EXISTS product_reviews_handle_idx
  ON product_reviews (product_handle);

CREATE INDEX IF NOT EXISTS product_reviews_customer_idx
  ON product_reviews (customer_id);

CREATE INDEX IF NOT EXISTS product_reviews_created_idx
  ON product_reviews (created_at DESC);
