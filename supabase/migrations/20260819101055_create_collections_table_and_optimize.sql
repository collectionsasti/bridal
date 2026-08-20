/*
# Create collections table, add performance index, clean up schema

1. New Tables
- `collections` — dynamic collection management (label, slug, sort order)
- Admin can create/edit/delete collections from the panel
- Products reference collections by slug (text), so existing products keep working

2. Schema Changes
- Add index on products.sort_order for faster catalog queries
- Add index on products.slug for faster product detail lookups
- Add index on products.collection for faster filtering

3. Security
- RLS enabled on `collections` table
- anon + authenticated can read collections (storefront needs them)
- Only authenticated can insert/update/delete (admin only)

4. Important Notes
- Existing products keep their `collection` text values (mehndi, barat, walima)
- These are seeded into the new collections table so nothing breaks
- The `collection_label` on products is now derived from the collections table at query time
*/

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 99,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Read: anyone (storefront needs to list collections)
DROP POLICY IF EXISTS "anon_select_collections" ON collections;
CREATE POLICY "anon_select_collections" ON collections FOR SELECT
  TO anon, authenticated USING (true);

-- Insert: authenticated only (admin)
DROP POLICY IF EXISTS "auth_insert_collections" ON collections;
CREATE POLICY "auth_insert_collections" ON collections FOR INSERT
  TO authenticated WITH CHECK (true);

-- Update: authenticated only (admin)
DROP POLICY IF EXISTS "auth_update_collections" ON collections;
CREATE POLICY "auth_update_collections" ON collections FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Delete: authenticated only (admin)
DROP POLICY IF EXISTS "auth_delete_collections" ON collections;
CREATE POLICY "auth_delete_collections" ON collections FOR DELETE
  TO authenticated USING (true);

-- Seed default collections
INSERT INTO collections (slug, label, sort_order) VALUES
  ('mehndi', 'Mehndi', 1),
  ('barat', 'Barat', 2),
  ('walima', 'Walima', 3)
ON CONFLICT (slug) DO NOTHING;

-- Performance indexes on products table
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products (sort_order);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_collection ON products (collection);
