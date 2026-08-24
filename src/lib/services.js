import { supabase } from "./supabaseClient.js";

function mapService(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price != null ? Number(row.price) : null,
    durationMinutes: row.duration_minutes,
    coverImage: row.cover_image_url,
  };
}

export async function getServices() {
  const { data, error } = await supabase
    .from("services")
    .select("id, slug, name, description, price, duration_minutes, cover_image_url")
    .eq("status", "active")
    .order("name");

  if (error) throw error;
  return data.map(mapService);
}

export async function getServiceBySlug(slug) {
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, slug, name, description, price, duration_minutes, cover_image_url, service_portfolio ( id, image_url, caption, display_order )"
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (error) throw error;

  return {
    ...mapService(data),
    portfolio: [...data.service_portfolio].sort((a, b) => a.display_order - b.display_order),
  };
}
