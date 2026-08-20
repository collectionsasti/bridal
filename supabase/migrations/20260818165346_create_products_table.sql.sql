/*
# Create products table for Ab Bridal storefront + admin panel

1. Purpose
   Stores the bridal suit catalog shown on the public storefront, and editable
   from the /admin panel. Each product belongs to one of three collections
   (mehndi, barat, walima) and carries a list of image URLs plus one close-up
   embroidery video URL. The admin panel (gated by Supabase email/password auth)
   can create, update and delete products and add/remove their media.

2. New Tables
   - `products`
     - `id`            uuid primary key
     - `name`          text, not null — e.g. "Royal Barat Regalia"
     - `slug`          text, unique, not null — URL-safe identifier
     - `collection`    text, not null — one of 'mehndi' | 'barat' | 'walima'
     - `collection_label` text, not null — display label e.g. "Barat"
     - `tagline`       text — short italic descriptor
     - `description`   text — short catalog copy
     - `story`         text — long atelier story
     - `price`         text — display string e.g. "PKR 4,85,000"
     - `fabric`        text
     - `work`          text — embroidery techniques
     - `color`         text
     - `pieces`        text — e.g. "3-piece unstitched suit"
     - `includes`      text[] — bullet list of what's in the bridal box
     - `video_url`     text — close-up embroidery film URL
     - `image`         text — primary hero image URL
     - `gallery`       text[] — ordered list of image URLs
     - `palette`       text[] — hex colors for the palette swatches
     - `sort_order`    int, default 0 — admin controls ordering
     - `created_at`    timestamptz default now()

3. Security
   - RLS enabled on `products`.
   - Public read: anyone (anon + authenticated) can SELECT, so the storefront
     renders without a login.
   - Writes restricted to authenticated admins only (the /admin panel signs in
     with Supabase email/password). No anon writes.
   - Four separate policies (SELECT/INSERT/UPDATE/DELETE), never FOR ALL.

4. Seed
   - Inserts the three existing bridal suits (Royal Barat Regalia, Luxury Mehndi
     Edition, Walima Reception Glamour) with their exact Cloudinary video URLs
     and Pexels imagery, so the storefront is populated immediately.

5. Notes
   - This is a single shared catalog (not per-user data), so there is no
     user_id column. Write policies are scoped to `authenticated` because only
     the admin (who signs in) should mutate the catalog.
   - `includes`, `gallery` and `palette` use native text[] arrays so the admin
     panel can add/remove items without a join table.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  collection text NOT NULL CHECK (collection IN ('mehndi', 'barat', 'walima')),
  collection_label text NOT NULL,
  tagline text DEFAULT '',
  description text DEFAULT '',
  story text DEFAULT '',
  price text DEFAULT '',
  fabric text DEFAULT '',
  work text DEFAULT '',
  color text DEFAULT '',
  pieces text DEFAULT '',
  includes text[] DEFAULT '{}',
  video_url text DEFAULT '',
  image text DEFAULT '',
  gallery text[] DEFAULT '{}',
  palette text[] DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read (storefront needs no login)
DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products"
ON products FOR SELECT
TO anon, authenticated USING (true);

-- Admin-only writes (must be signed in via Supabase auth)
DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products"
ON products FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products"
ON products FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products"
ON products FOR DELETE
TO authenticated USING (true);

-- Index for collection filtering + ordering
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);

-- Seed the three existing products (idempotent: only insert if slug missing)
INSERT INTO products (slug, name, collection, collection_label, tagline, description, story, price, fabric, work, color, pieces, includes, video_url, image, gallery, palette, sort_order)
SELECT 'royal-barat-regalia', 'Royal Barat Regalia', 'barat', 'Barat',
  'Zardozi on wine raw silk',
  'A barat heirloom in deep borhundy raw silk, heavy with hand-set zardozi, dabka and kamdani — an unstitched three-piece made to carry the weight of a royal bride.',
  'Cut from 2.5 metres of hand-woven raw silk and dyed in a small-batch borhundy vat, the Regalia is handed to our zardozi karigars who spend over 140 hours couching gold and copper wire into its floral jaal. Each motif is finished with kamdani dots and a hand-knotted fringe, so the dupatta catches candlelight the moment the barat doors open.',
  'PKR 4,85,000',
  'Hand-woven raw silk • 2.5m suit length',
  'Zardozi • dabka • kamdani • kora',
  'Borhundy wine with antique gold',
  '3-piece unstitched suit',
  ARRAY['2.5m dyed raw silk shirt length','2.5m matching silk dupatta with kiran border','2.5m inner lining & kalgi fabric','Hand-finished zardozi karigari chart','Bridal care & storage scroll'],
  'https://res.cloudinary.com/oe3tofix/video/upload/v1786969723/WhatsApp_Video_2026-08-17_at_4.58.06_PM.mp4',
  'https://images.pexels.com/photos/11503286/pexels-photo-11503286.jpeg?auto=compress&cs=tinysrgb&h=1200&w=850',
  ARRAY['https://images.pexels.com/photos/11503286/pexels-photo-11503286.jpeg?auto=compress&cs=tinysrgb&h=1200&w=850','https://images.pexels.com/photos/13806066/pexels-photo-13806066.jpeg?auto=compress&cs=tinysrgb&h=1200&w=850','https://images.pexels.com/photos/35059564/pexels-photo-35059564.jpeg?auto=compress&cs=tinysrgb&h=1200&w=850'],
  ARRAY['#52101c','#8c1f33','#cda861','#0e0b09'],
  1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'royal-barat-regalia');

INSERT INTO products (slug, name, collection, collection_label, tagline, description, story, price, fabric, work, color, pieces, includes, video_url, image, gallery, palette, sort_order)
SELECT 'luxury-mehndi-edition', 'Luxury Mehndi Edition', 'mehndi', 'Mehndi',
  'Marigold dabka on mustard organza',
  'A breezy mehndi unstitched suit on mustard organza, scattered with marigold dabka, mirror work and a whisper of gota — made for the bride who dances her mehndi into the night.',
  'The Mehndi Edition begins on translucent organza dyed in the colour of fresh turmeric, then passes to our mirror karigars who set each shisha by hand and ring it in marigold dabka. The dupatta carries a gota patti border that jingles softly as you move, and the whole suit is sent unstitched so your own darzi can tailor it to your exact mehndi-night silhouette.',
  'PKR 2,40,000',
  'Pure organza • 2.5m suit length',
  'Marigold dabka • shisha mirror • gota patti',
  'Mustard yellow with gota gold',
  '3-piece unstitched suit',
  ARRAY['2.5m mustard organza shirt length','2.5m sheer organza dupatta with gota border','2.5m cotton inner lining','Hand-set mirror placement chart','Bridal care & storage scroll'],
  'https://res.cloudinary.com/oe3tofix/video/upload/v1786969844/WhatsApp_Video_2026-08-17_at_4.58.08_PM.mp4',
  'https://images.pexels.com/photos/36354615/pexels-photo-36354615.jpeg?auto=compress&cs=tinysrgb&h=1200&w=850',
  ARRAY['https://images.pexels.com/photos/36354615/pexels-photo-36354615.jpeg?auto=compress&cs=tinysrgb&h=1200&w=850','https://images.pexels.com/photos/30370332/pexels-photo-30370332.jpeg?auto=compress&cs=tinysrgb&h=1200&w=850','https://images.pexels.com/photos/5824023/pexels-photo-5824023.jpeg?auto=compress&cs=tinysrgb&h=1200&w=850'],
  ARRAY['#7a5b29','#cda861','#e8d3a8','#3b0a12'],
  2
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'luxury-mehndi-edition');

INSERT INTO products (slug, name, collection, collection_label, tagline, description, story, price, fabric, work, color, pieces, includes, video_url, image, gallery, palette, sort_order)
SELECT 'walima-reception-glamour', 'Walima Reception Glamour', 'walima', 'Walima',
  'Pearl & crystal on champagne',
  'A walima reception unstitched suit in champagne gold, threaded with freshwater pearlwork, crystal sequins and a scalloped naqshi border — quiet luxury that glows under reception lights.',
  'For the Walima Reception Glamour we start with a soft champagne-gold tissue and lay it with clusters of crystal sequins and freshwater pearls, each pearl hand-stitched onto a naqshi spiral. The dupatta is edged in a scalloped naqshi border that catches every reception spotlight, and like all Ab Bridal suits it ships unstitched so your silhouette is entirely your own.',
  'PKR 3,65,000',
  'Champagne tissue • 2.5m suit length',
  'Pearlwork • crystal sequins • naqshi',
  'Champagne gold with pearl white',
  '3-piece unstitched suit',
  ARRAY['2.5m champagne tissue shirt length','2.5m tissue dupatta with scalloped naqshi border','2.5m silk inner lining','Pearl placement & maintenance chart','Bridal care & storage scroll'],
  'https://res.cloudinary.com/oe3tofix/video/upload/v1786969860/WhatsApp_Video_2026-08-17_at_4.58.07_PM.mp4',
  'https://images.pexels.com/photos/37967114/pexels-photo-37967114.jpeg?auto=compress&cs=tinysrgb&h=1200&w=850',
  ARRAY['https://images.pexels.com/photos/37967114/pexels-photo-37967114.jpeg?auto=compress&cs=tinysrgb&h=1200&w=850','https://images.pexels.com/photos/37967129/pexels-photo-37967129.jpeg?auto=compress&cs=tinysrgb&h=1200&w=850','https://images.pexels.com/photos/21624036/pexels-photo-21624036.jpeg?auto=compress&cs=tinysrgb&h=1200&w=850'],
  ARRAY['#e8d3a8','#cda861','#fbf6ec','#2f2620'],
  3
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'walima-reception-glamour');
