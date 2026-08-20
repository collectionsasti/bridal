-- Remove the CHECK constraint on products.collection so any dynamic collection slug works
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_collection_check;

-- Create a storage bucket for product image uploads (public read, authenticated write)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: anyone can read, only authenticated can upload/update/delete
DROP POLICY IF EXISTS "public_read_product_images" ON storage.objects;
CREATE POLICY "public_read_product_images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "auth_insert_product_images" ON storage.objects;
CREATE POLICY "auth_insert_product_images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "auth_update_product_images" ON storage.objects;
CREATE POLICY "auth_update_product_images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "auth_delete_product_images" ON storage.objects;
CREATE POLICY "auth_delete_product_images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
