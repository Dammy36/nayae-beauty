-- ============================================================================
-- Nayae Beauty - Seed Data
-- ============================================================================
-- Run this AFTER schema.sql, once, in the Supabase SQL Editor. Loads the
-- current placeholder catalogue (real product photos, real names, but
-- placeholder prices/stock) so the live site has something to show while
-- you confirm real pricing/stock with the developer.
--
-- Safe to re-run: every insert uses ON CONFLICT DO NOTHING, so running it
-- again won't create duplicates.
-- ============================================================================

-- A product can have more than one photo, so this needs its own unique
-- rule (product_id + image_url together) to make re-running this file safe.
create unique index if not exists product_images_product_id_url_idx
  on product_images (product_id, image_url);

-- ----------------------------------------------------------------------------
-- CATEGORIES
-- ----------------------------------------------------------------------------
insert into categories (name, slug, display_order) values
  ('Face', 'face', 1),
  ('Eyes', 'eyes', 2),
  ('Lips', 'lips', 3),
  ('Hair', 'hair', 4),
  ('Tools', 'tools', 5)
on conflict (name) do nothing;

-- ----------------------------------------------------------------------------
-- PRODUCTS
-- Price is left NULL on purpose (shows "Price coming soon") - real
-- pricing hasn't been confirmed yet. Stock numbers are placeholders used
-- to demonstrate the Out of Stock / low-stock UI, not real inventory.
-- ----------------------------------------------------------------------------
insert into products (category_id, name, slug, description, price, stock, status) values
  ((select id from categories where slug = 'face'),
   'Davis Brow & Lip Liner Pencil', 'davis-brow-lip-liner-pencil',
   'An extra waterproof, protective eyeliner and brow pencil with a built-in sharpener.', null, 14, 'active'),

  ((select id from categories where slug = 'face'),
   'D''Glow Loose Highlighter', 'dglow-loose-highlighter',
   'A finely milled loose highlighter for a luminous, glowing finish.', null, 6, 'active'),

  ((select id from categories where slug = 'lips'),
   'Absolute Long Lasting Lip Gloss', 'absolute-lip-gloss',
   'A long-lasting, lightweight lip gloss.', null, 20, 'active'),

  ((select id from categories where slug = 'face'),
   'Kiss Beauty Makeup Fix Spray', 'kiss-beauty-fix-spray',
   'A refreshing makeup setting spray for long-lasting hold. Net wt 150ml.', null, 9, 'active'),

  ((select id from categories where slug = 'eyes'),
   'Chic Kee Super Hold Lash Glue', 'chic-kee-lash-glue',
   'A super hold lash glue for secure, long-lasting wear.', null, 0, 'active'),

  ((select id from categories where slug = 'hair'),
   'Lanell Anti-Fungus Hair Bonding Glue', 'lanell-hair-bonding-glue',
   'An anti-fungal hair bonding glue for a secure, natural-looking hold. 1 fl oz.', null, 15, 'active'),

  ((select id from categories where slug = 'face'),
   'Ben Nye Clown White', 'ben-nye-clown-white',
   'A classic, richly pigmented white face paint.', null, 8, 'active'),

  ((select id from categories where slug = 'eyes'),
   'Becharm Ageless Clown White PRO Matte', 'becharm-clown-white-pro-matte',
   'A matte white eyeshadow base and primer for 24-hour wear.', null, 3, 'active'),

  ((select id from categories where slug = 'face'),
   'Browmatic Brow Pomade', 'browmatic-brow-pomade',
   'A brow pomade for defined, long-wearing brows.', null, 10, 'active'),

  ((select id from categories where slug = 'eyes'),
   'Loose Shimmer Pigment', 'loose-shimmer-pigment',
   'A finely milled loose shimmer pigment for eyes and face.', null, 7, 'active'),

  ((select id from categories where slug = 'lips'),
   'Blossom Makeup Lip Oil', 'blossom-makeup-lip-oil',
   'A nourishing, glossy lip oil.', null, 11, 'active'),

  ((select id from categories where slug = 'face'),
   'VEE Beauty Burgundy Luxe Edition Palette', 'vee-beauty-burgundy-luxe-palette',
   'A luxe cream contour and highlight palette set with mirror and pouch.', null, 4, 'active'),

  ((select id from categories where slug = 'face'),
   'L.A. Girl PRO Concealer', 'la-girl-pro-concealer',
   'L.A. Girl HD PRO.Conceal high-definition concealer, available in a wide range of shades and correctors.',
   null, 18, 'active'),

  ((select id from categories where slug = 'tools'),
   'AH Adventure Perfect Soft Blender', 'ah-adventure-blender-sponge',
   'A soft, latex-free blending sponge for flawless application of liquid and cream products.', null, 16, 'active'),

  ((select id from categories where slug = 'lips'),
   '2IKEL BARE Matte Lipgloss', '2ikel-bare-matte-lipgloss',
   'A long-wearing matte lip gloss in a range of nude and bold shades.', null, 13, 'active'),

  ((select id from categories where slug = 'eyes'),
   'Blossom Scandalous Duo 2-in-1 Mascara', 'blossom-scandalous-duo-mascara',
   'A dual-ended 2-in-1 mascara for upper and lower lash definition. 12ml.', null, 10, 'active'),

  ((select id from categories where slug = 'eyes'),
   'Inglot Gel Liner', 'inglot-gel-liner',
   'A richly pigmented gel eyeliner in classic black.', null, 5, 'active')
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- PRODUCT IMAGES
-- Served from /public/products/ for now (a stable URL Vite serves as-is).
-- Once the admin image upload (Phase 11) exists, new/replacement photos
-- go to Supabase Storage instead - these seed rows just point at the
-- files already in the project.
-- ----------------------------------------------------------------------------
insert into product_images (product_id, image_url, display_order)
select id, image_url, 0 from products
join (values
  ('davis-brow-lip-liner-pencil', '/products/davis-brow-lip-liner-pencils.jpg'),
  ('dglow-loose-highlighter', '/products/dglow-loose-highlighter.jpg'),
  ('absolute-lip-gloss', '/products/absolute-lip-gloss.jpg'),
  ('kiss-beauty-fix-spray', '/products/kiss-beauty-fix-spray.jpg'),
  ('chic-kee-lash-glue', '/products/chic-kee-lash-glue.jpg'),
  ('lanell-hair-bonding-glue', '/products/lanell-hair-bonding-glue.jpg'),
  ('ben-nye-clown-white', '/products/ben-nye-clown-white.jpg'),
  ('becharm-clown-white-pro-matte', '/products/becharm-ageless-clown-white-pro-matte.jpg'),
  ('browmatic-brow-pomade', '/products/browmatic-brow-pomade.jpg'),
  ('loose-shimmer-pigment', '/products/loose-shimmer-pigment.jpg'),
  ('blossom-makeup-lip-oil', '/products/blossom-makeup-lip-oil.jpg'),
  ('vee-beauty-burgundy-luxe-palette', '/products/vee-beauty-burgundy-luxe-palette.jpg'),
  ('la-girl-pro-concealer', '/products/la-girl-pro-concealer.jpg'),
  ('ah-adventure-blender-sponge', '/products/ah-adventure-blender-sponge.jpg'),
  ('2ikel-bare-matte-lipgloss', '/products/2ikel-bare-matte-lipgloss.jpg'),
  ('blossom-scandalous-duo-mascara', '/products/blossom-scandalous-duo-mascara.jpg'),
  ('inglot-gel-liner', '/products/inglot-gel-liner.webp')
) as seed (slug, image_url) on seed.slug = products.slug
on conflict (product_id, image_url) do nothing;

-- ----------------------------------------------------------------------------
-- PRODUCT SHADES
-- "Green Corrector" is deliberately left unavailable, purely to keep
-- demonstrating the sold-out pill state in the UI - not a real stock claim.
-- ----------------------------------------------------------------------------
insert into product_shades (product_id, name, available, display_order)
select p.id, shade.name, shade.available, shade.display_order
from products p
join (values
  ('la-girl-pro-concealer', 'Porcelain', true, 1),
  ('la-girl-pro-concealer', 'Light Ivory', true, 2),
  ('la-girl-pro-concealer', 'Classic Ivory', true, 3),
  ('la-girl-pro-concealer', 'Natural', true, 4),
  ('la-girl-pro-concealer', 'Creamy Beige', true, 5),
  ('la-girl-pro-concealer', 'Nude', true, 6),
  ('la-girl-pro-concealer', 'Medium Bisque', true, 7),
  ('la-girl-pro-concealer', 'Pure Beige', true, 8),
  ('la-girl-pro-concealer', 'Warm Sand', true, 9),
  ('la-girl-pro-concealer', 'Medium Beige', true, 10),
  ('la-girl-pro-concealer', 'Almond', true, 11),
  ('la-girl-pro-concealer', 'Cool Tan', true, 12),
  ('la-girl-pro-concealer', 'Toast', true, 13),
  ('la-girl-pro-concealer', 'Warm Honey', true, 14),
  ('la-girl-pro-concealer', 'Fawn', true, 15),
  ('la-girl-pro-concealer', 'Toffee', true, 16),
  ('la-girl-pro-concealer', 'Espresso', true, 17),
  ('la-girl-pro-concealer', 'Chestnut', true, 18),
  ('la-girl-pro-concealer', 'Beautiful Bronze', true, 19),
  ('la-girl-pro-concealer', 'Dark Cocoa', true, 20),
  ('la-girl-pro-concealer', 'Mahogany', true, 21),
  ('la-girl-pro-concealer', 'Green Corrector', false, 22),
  ('la-girl-pro-concealer', 'Yellow Corrector', true, 23),
  ('la-girl-pro-concealer', 'Orange Corrector', true, 24),

  ('ah-adventure-blender-sponge', 'Brown', true, 1),
  ('ah-adventure-blender-sponge', 'Black', true, 2),
  ('ah-adventure-blender-sponge', 'Orange', true, 3),
  ('ah-adventure-blender-sponge', 'Pink', true, 4),

  ('2ikel-bare-matte-lipgloss', 'Exposed', true, 1),
  ('2ikel-bare-matte-lipgloss', 'Earth', true, 2),
  ('2ikel-bare-matte-lipgloss', 'Raw', true, 3),
  ('2ikel-bare-matte-lipgloss', 'Dudu', true, 4),
  ('2ikel-bare-matte-lipgloss', 'Brunette', true, 5),
  ('2ikel-bare-matte-lipgloss', 'Bare', true, 6),
  ('2ikel-bare-matte-lipgloss', 'Striped', true, 7)
) as shade (slug, name, available, display_order) on shade.slug = p.slug
on conflict (product_id, name) do nothing;

-- ----------------------------------------------------------------------------
-- SERVICES
-- Confirmed V1 offering: makeup + bridal makeup appointment booking only.
-- Price and duration stay NULL until the client confirms them.
-- ----------------------------------------------------------------------------
insert into services (name, slug, description, price, duration_minutes, status) values
  ('Makeup', 'makeup',
   'Professional makeup application for everyday glam or a special occasion.', null, null, 'active'),
  ('Bridal Makeup', 'bridal-makeup',
   'A dedicated look and trial for your wedding day.', null, null, 'active')
on conflict (slug) do nothing;

-- ============================================================================
-- BATCH 2 - additional products
-- Same placeholder-price/stock treatment as above. Two of these image
-- filenames (browmatic-brow-pomade.jpg, vee-beauty-burgundy-luxe-palette.jpg)
-- intentionally match existing product photos - the local files were
-- replaced with better shots of the same products, so no database change
-- is needed for those two, just this new content.
-- ============================================================================

insert into categories (name, slug, display_order) values
  ('Skincare', 'skincare', 6)
on conflict (name) do nothing;

insert into products (category_id, name, slug, description, price, stock, status) values
  ((select id from categories where slug = 'skincare'),
   'Blossom Makeup Skincare Moist Essence', 'blossom-skincare-moist-essence',
   'A cream moisturizer with hyaluronic acid, available in 60ml and 150ml sizes.', null, 12, 'active'),

  ((select id from categories where slug = 'skincare'),
   'Mario Badescu Facial Spray', 'mario-badescu-facial-spray',
   'A refreshing facial spray with aloe. 4 fl oz (118ml).', null, 9, 'active'),

  ((select id from categories where slug = 'face'),
   'Nuban Beauty Seal It! Makeup Fixing Spray', 'nuban-seal-it-fixing-spray',
   'A long-lasting makeup fixing spray. 105ml.', null, 14, 'active'),

  ((select id from categories where slug = 'face'),
   'Nuban Beauty In My Skin Liquid Concealer', 'nuban-in-my-skin-concealer',
   'A liquid concealer available in a wide range of shades.', null, 10, 'active'),

  ((select id from categories where slug = 'face'),
   'Nuban Beauty In My Skin Blushes', 'nuban-in-my-skin-blushes',
   'A cream blush stick, available in multiple shades.', null, 8, 'active'),

  ((select id from categories where slug = 'tools'),
   'Makeup Brush Set', 'makeup-brush-set',
   'A complete set of makeup brushes for face and eyes.', null, 6, 'active'),

  ((select id from categories where slug = 'eyes'),
   'Nuban Beauty Éclat Eyeshadow Palette', 'nuban-eclat-palette',
   'A 12-shade eyeshadow palette with matte and glitter finishes.', null, 7, 'active'),

  ((select id from categories where slug = 'face'),
   'Nuban Beauty Loose Setting Powder', 'nuban-loose-powder',
   'A loose setting powder available in five shades.', null, 11, 'active'),

  ((select id from categories where slug = 'face'),
   'Zikel Even True Pro Coverage Foundation', 'zikel-even-true-foundation',
   'A high-definition matte poreless foundation.', null, 13, 'active'),

  ((select id from categories where slug = 'face'),
   'Zikel Pro-Matte High Definition Foundation', 'zikel-pro-matte-foundation',
   'A high-definition foundation with SPF 30. 40ml.', null, 9, 'active'),

  ((select id from categories where slug = 'eyes'),
   'CPB Better Than Chocolate Palette', 'cpb-better-than-chocolate-palette',
   'A 16-color eyeshadow palette.', null, 5, 'active'),

  ((select id from categories where slug = 'eyes'),
   'Annie''s Beauty Nudes Happy Bride Palette', 'annies-nudes-happy-bride-palette',
   'A nude-tone eyeshadow palette.', null, 6, 'active'),

  ((select id from categories where slug = 'eyes'),
   'Annie''s Beauty Meet The Browns Palette', 'annies-meet-the-browns-palette',
   'A 9-shade brown-tone eyeshadow palette.', null, 8, 'active'),

  ((select id from categories where slug = 'eyes'),
   'Tehila Cosmetics Gel Eyeliner', 'tehila-gel-eyeliner',
   'A richly pigmented black gel eyeliner.', null, 15, 'active'),

  ((select id from categories where slug = 'face'),
   'Blossom Makeup Soft Matte Veil Foundation', 'blossom-veil-foundation',
   'A soft matte foundation available in a wide range of shades.', null, 10, 'active'),

  ((select id from categories where slug = 'eyes'),
   'Annie''s Beauty Colorful Party Girl Palette', 'annies-colorful-party-girl-palette',
   'A vibrant, multi-color eyeshadow palette.', null, 7, 'active'),

  ((select id from categories where slug = 'face'),
   'Avour Professional Contour Palette', 'avour-professional-palette',
   'A professional contour and highlight palette.', null, 4, 'active'),

  ((select id from categories where slug = 'lips'),
   'Blossom Makeup Lip Moisturizing Gloss', 'blossom-lip-gloss',
   'A moisturizing lip gloss.', null, 16, 'active'),

  ((select id from categories where slug = 'tools'),
   'The Girlz Korner 30 Piece Full Face Glam Brush Set', 'girlz-korner-brush-set',
   'A 30-piece full face makeup brush set.', null, 5, 'active'),

  ((select id from categories where slug = 'eyes'),
   'Zaron Lengthening Mascara', 'zaron-lengthening-mascara',
   'A lengthening mascara.', null, 12, 'active'),

  ((select id from categories where slug = 'eyes'),
   'KR Karité Long-Wear Gel Eyeliner Set', 'kr-karite-gel-eyeliner-set',
   'A long-wear gel eyeliner set with brushes.', null, 8, 'active'),

  ((select id from categories where slug = 'face'),
   'Annie''s Beauty Cheek Sensation Professional Blush Palette Volume II', 'annies-cheek-sensation-blush-palette',
   'A 9-shade professional blush palette.', null, 6, 'active'),

  ((select id from categories where slug = 'skincare'),
   'MIIS Metics Aqua Grip Radiant Finish Primer', 'miis-metics-aqua-grip-primer',
   'A primer infused with Vitamin B3 and Hyaluronic Acid, available in 50ml and 15ml sizes.', null, 9, 'active'),

  ((select id from categories where slug = 'face'),
   'Rimmel London Stay Matte Primer', 'rimmel-stay-matte-primer',
   'A mattifying, pore-minimizing makeup primer. 30ml.', null, 11, 'active'),

  ((select id from categories where slug = 'lips'),
   'Charm Ageless Dream Sensational Matte Lip Palette', 'charm-ageless-dream-lip-palette',
   'An 18-in-1 stay matte lip color palette.', null, 5, 'active'),

  ((select id from categories where slug = 'eyes'),
   'MSMETICS Bridal Series Luxury Mink Lashes', 'msmetics-bridal-lashes',
   'Luxury mink lashes from the Bridal Series.', null, 10, 'active'),

  ((select id from categories where slug = 'lips'),
   'Zikel Nudes Lipgloss', 'zikel-nudes-lipgloss',
   'A nude-tone lipgloss, available in 6 shades.', null, 13, 'active'),

  ((select id from categories where slug = 'face'),
   'Slyh Beauty Dew Wet Balm', 'slyh-dew-wet-balm',
   'A 9-in-1 highlighting face and body balm.', null, 7, 'active'),

  ((select id from categories where slug = 'eyes'),
   'Sooo Pro Cosmetics Loose Pigment', 'sooo-pro-loose-pigment',
   'A finely milled loose pigment, available in multiple shimmer shades.', null, 8, 'active')
on conflict (slug) do nothing;

insert into product_images (product_id, image_url, display_order)
select id, image_url, 0 from products
join (values
  ('blossom-skincare-moist-essence', '/products/blossom-skincare-moist-essence.jpg'),
  ('mario-badescu-facial-spray', '/products/mario-badescu-facial-spray.jpg'),
  ('nuban-seal-it-fixing-spray', '/products/nuban-seal-it-fixing-spray.jpg'),
  ('nuban-in-my-skin-concealer', '/products/nuban-in-my-skin-concealer.jpg'),
  ('nuban-in-my-skin-blushes', '/products/nuban-in-my-skin-blushes.jpg'),
  ('makeup-brush-set', '/products/makeup-brush-set.jpg'),
  ('nuban-eclat-palette', '/products/nuban-eclat-palette.jpg'),
  ('nuban-loose-powder', '/products/nuban-loose-powder.jpg'),
  ('zikel-even-true-foundation', '/products/zikel-foundation-shade-chart.jpg'),
  ('zikel-pro-matte-foundation', '/products/zikel-foundation-shade-chart.jpg'),
  ('cpb-better-than-chocolate-palette', '/products/cpb-better-than-chocolate-palette.jpg'),
  ('annies-nudes-happy-bride-palette', '/products/annies-nudes-happy-bride-palette.jpg'),
  ('annies-meet-the-browns-palette', '/products/annies-meet-the-browns-palette.jpg'),
  ('tehila-gel-eyeliner', '/products/tehila-gel-eyeliner.jpg'),
  ('blossom-veil-foundation', '/products/blossom-veil-foundation.jpg'),
  ('annies-colorful-party-girl-palette', '/products/annies-colorful-party-girl-palette.jpg'),
  ('avour-professional-palette', '/products/avour-professional-palette.jpg'),
  ('blossom-lip-gloss', '/products/blossom-lip-gloss.jpg'),
  ('girlz-korner-brush-set', '/products/girlz-korner-brush-set.jpg'),
  ('zaron-lengthening-mascara', '/products/zaron-lengthening-mascara.jpg'),
  ('kr-karite-gel-eyeliner-set', '/products/kr-karite-gel-eyeliner-set.jpg'),
  ('annies-cheek-sensation-blush-palette', '/products/annies-cheek-sensation-blush-palette.jpg'),
  ('miis-metics-aqua-grip-primer', '/products/miis-metics-aqua-grip-primer.jpg'),
  ('rimmel-stay-matte-primer', '/products/rimmel-stay-matte-primer.jpg'),
  ('charm-ageless-dream-lip-palette', '/products/charm-ageless-dream-lip-palette.jpg'),
  ('msmetics-bridal-lashes', '/products/msmetics-bridal-lashes.jpg'),
  ('zikel-nudes-lipgloss', '/products/zikel-nudes-lipgloss.jpg'),
  ('slyh-dew-wet-balm', '/products/slyh-dew-wet-balm.jpg'),
  ('sooo-pro-loose-pigment', '/products/sooo-pro-loose-pigment.jpg')
) as seed (slug, image_url) on seed.slug = products.slug
on conflict (product_id, image_url) do nothing;

insert into product_shades (product_id, name, available, display_order)
select p.id, shade.name, shade.available, shade.display_order
from products p
join (values
  ('mario-badescu-facial-spray', 'Aloe, Herbs & Rosewater', true, 1),
  ('mario-badescu-facial-spray', 'Aloe, Cucumber & Green Tea', true, 2),
  ('mario-badescu-facial-spray', 'Aloe, Chamomile & Lavender', true, 3),

  ('nuban-loose-powder', 'Alabaster', true, 1),
  ('nuban-loose-powder', 'Mustard', true, 2),
  ('nuban-loose-powder', 'Caramel', true, 3),
  ('nuban-loose-powder', 'Sahara', true, 4),
  ('nuban-loose-powder', 'Sienna', true, 5),

  ('zikel-even-true-foundation', '101 Natural', true, 1),
  ('zikel-even-true-foundation', '010B Cameo', true, 2),
  ('zikel-even-true-foundation', '102 Pearl', true, 3),
  ('zikel-even-true-foundation', '015 Zikel Tan', true, 4),
  ('zikel-even-true-foundation', '001 White Cream', true, 5),
  ('zikel-even-true-foundation', '020 Sexy Almond', true, 6),
  ('zikel-even-true-foundation', '001B Blonde', true, 7),
  ('zikel-even-true-foundation', '020B Browny', true, 8),
  ('zikel-even-true-foundation', '005 Hot Amber', true, 9),
  ('zikel-even-true-foundation', '025 Mocha', true, 10),
  ('zikel-even-true-foundation', '005B Velvet', true, 11),
  ('zikel-even-true-foundation', '030 Bronze', true, 12),
  ('zikel-even-true-foundation', '010 Golden Caramel', true, 13),
  ('zikel-even-true-foundation', '035 Cocoa', true, 14),
  ('zikel-even-true-foundation', '0B-15 Butter', true, 15),

  ('zikel-pro-matte-foundation', '01 White Cream', true, 1),
  ('zikel-pro-matte-foundation', '03 Golden Caramel', true, 2),
  ('zikel-pro-matte-foundation', '101 Natural', true, 3),
  ('zikel-pro-matte-foundation', '04 Zikel Tan', true, 4),
  ('zikel-pro-matte-foundation', '102 Pearl', true, 5),
  ('zikel-pro-matte-foundation', '05 Sexy Almond', true, 6),
  ('zikel-pro-matte-foundation', '001B Blonde', true, 7),
  ('zikel-pro-matte-foundation', '06 Mocha', true, 8),
  ('zikel-pro-matte-foundation', '005B Velvet', true, 9),
  ('zikel-pro-matte-foundation', '07 Bronze', true, 10),
  ('zikel-pro-matte-foundation', '010B Cameo', true, 11),
  ('zikel-pro-matte-foundation', '020B Browny', true, 12),
  ('zikel-pro-matte-foundation', '02 Hot Amber', true, 13),
  ('zikel-pro-matte-foundation', '08 Dark Pearl', true, 14),

  ('blossom-lip-gloss', 'Watermelon', true, 1),
  ('blossom-lip-gloss', 'Sepia', true, 2),
  ('blossom-lip-gloss', 'Blush', true, 3),
  ('blossom-lip-gloss', 'Latte', true, 4),
  ('blossom-lip-gloss', 'Guth', true, 5),
  ('blossom-lip-gloss', 'Clear', true, 6),
  ('blossom-lip-gloss', 'Ivory', true, 7),
  ('blossom-lip-gloss', 'Salmon', true, 8),
  ('blossom-lip-gloss', 'Hot Chocolate', true, 9),
  ('blossom-lip-gloss', 'Punch', true, 10),
  ('blossom-lip-gloss', 'Cider', true, 11),
  ('blossom-lip-gloss', 'Pay Girl', true, 12),
  ('blossom-lip-gloss', 'Mulberry', true, 13),
  ('blossom-lip-gloss', 'Dove', true, 14),
  ('blossom-lip-gloss', 'Seashells', true, 15),
  ('blossom-lip-gloss', 'Peach', true, 16)
) as shade (slug, name, available, display_order) on shade.slug = p.slug
on conflict (product_id, name) do nothing;
