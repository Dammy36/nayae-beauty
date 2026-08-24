import { supabase } from "./supabaseClient.js";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getCategories() {
  const { data, error } = await supabase.from("categories").select("id, name").order("display_order");
  if (error) throw error;
  return data;
}

// Unlike the customer-facing getProducts() in src/lib/products.js, this
// includes inactive products too - the admin needs to see (and
// reactivate) products that are hidden from the shop.
export async function getAllProductsAdmin() {
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, price, stock, status, categories ( name ), product_images ( id, image_url, display_order )")
    .order("name");

  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: row.price != null ? Number(row.price) : null,
    stock: row.stock,
    status: row.status,
    category: row.categories?.name ?? null,
    images: [...row.product_images].sort((a, b) => a.display_order - b.display_order),
  }));
}

export async function getProductAdmin(id) {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, description, price, stock, status, category_id, product_images ( id, image_url, display_order )"
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return {
    ...data,
    price: data.price != null ? Number(data.price) : null,
    images: [...data.product_images].sort((a, b) => a.display_order - b.display_order),
  };
}

export async function createProduct(productData) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: productData.name,
      slug: slugify(productData.name),
      description: productData.description || null,
      price: productData.price,
      stock: productData.stock,
      status: productData.status,
      category_id: productData.categoryId,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

// Slug is intentionally left unchanged on edit, even if the name
// changes - that keeps the product's shop URL stable instead of
// breaking any link someone may have shared.
export async function updateProduct(id, productData) {
  const { error } = await supabase
    .from("products")
    .update({
      name: productData.name,
      description: productData.description || null,
      price: productData.price,
      stock: productData.stock,
      status: productData.status,
      category_id: productData.categoryId,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function setProductStatus(id, status) {
  const { error } = await supabase.from("products").update({ status }).eq("id", id);
  if (error) throw error;
}

export function validateImageFile(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Please choose a JPG, PNG, or WEBP image.";
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Image must be smaller than 5MB.";
  }
  return null;
}

// Uploads the file to Supabase Storage, then records it against the
// product so it shows up on the shop. displayOrder controls which photo
// appears first on the product page (0 = main photo).
export async function uploadProductImage(productId, file, displayOrder) {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  const fileExt = file.name.split(".").pop();
  const filePath = `${productId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file);
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(filePath);

  const { error: insertError } = await supabase.from("product_images").insert({
    product_id: productId,
    image_url: publicUrlData.publicUrl,
    display_order: displayOrder,
  });
  if (insertError) throw insertError;

  return publicUrlData.publicUrl;
}

export async function deleteProductImage(imageId) {
  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) throw error;
}
