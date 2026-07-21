-- Admins may post unlimited reviews per product; buyers stay one review per product (app-enforced).
ALTER TABLE product_reviews DROP CONSTRAINT IF EXISTS product_reviews_product_id_customer_id_key;
