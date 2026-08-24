import { supabase } from "./supabaseClient.js";

// Turns one row (with its nested category/images/shades) from Supabase
// into the flat shape the rest of the app already expects - so
// components don't need to know about the underlying table structure.
function mapProduct(row) {
  const sortedImages = [...row.product_images].sort((a, b) => a.display_order - b.display_order);
  const sortedShades = [...row.product_shades].sort((a, b) => a.display_order - b.display_order);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    category: row.categories?.name ?? null,
    image: sortedImages[0]?.image_url ?? null,
    price: row.price != null ? Number(row.price) : null,
    stock: row.stock,
    shades: sortedShades.length > 0 ? sortedShades.map((s) => ({ name: s.name, available: s.available })) : null,
  };
}

const PRODUCT_SELECT = `
  id, slug, name, description, price, stock,
  categories ( name ),
  product_images ( image_url, display_order ),
  product_shades ( name, available, display_order )
`;

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .order("name");

  if (error) throw error;
  return data.map(mapProduct);
}

export async function getCategories() {
  const { data, error } = await supabase.from("categories").select("name").order("display_order");
  if (error) throw error;
  return data.map((row) => row.name);
}
