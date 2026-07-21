-- Allow admin seed reviews with ratings above 5 (regular customers stay 1–5 in app logic).
ALTER TABLE product_reviews DROP CONSTRAINT IF EXISTS product_reviews_rating_check;
ALTER TABLE product_reviews ADD CONSTRAINT product_reviews_rating_check CHECK (rating >= 1);
