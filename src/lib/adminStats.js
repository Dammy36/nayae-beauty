import { supabase } from "./supabaseClient.js";

// Products at or below this count are counted as "low stock" - same
// threshold the customer-facing "Only X left" badge uses, so the number
// shown here means the same thing everywhere in the app.
const LOW_STOCK_THRESHOLD = 3;

async function countRows(query) {
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

export async function getDashboardStats() {
  const today = new Date().toISOString().slice(0, 10);

  const [totalProducts, lowStockProducts, totalOrders, pendingOrders, totalBookings, upcomingBookings] =
    await Promise.all([
      countRows(supabase.from("products").select("*", { count: "exact", head: true })),
      countRows(
        supabase.from("products").select("*", { count: "exact", head: true }).lte("stock", LOW_STOCK_THRESHOLD)
      ),
      countRows(supabase.from("orders").select("*", { count: "exact", head: true })),
      countRows(
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("order_status", "Pending Payment")
      ),
      countRows(supabase.from("bookings").select("*", { count: "exact", head: true })),
      countRows(
        supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .gte("booking_date", today)
          .neq("status", "Cancelled")
      ),
    ]);

  return { totalProducts, lowStockProducts, totalOrders, pendingOrders, totalBookings, upcomingBookings };
}
