-- Removes "Zikel Pro-Matte High Definition Foundation" entirely.
-- Its photo and shades are removed automatically (they're linked to this
-- product and set to delete alongside it). The photo file itself is
-- shared with "Zikel Even True Pro Coverage Foundation" (the only photo
-- available shows both product lines together), so that file stays on
-- disk - only this product's reference to it is removed, which is what
-- we want since Even True still needs it.
delete from products where slug = 'zikel-pro-matte-foundation';
