import { supabase } from "./supabaseClient.js";

export async function getAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("id, customer_name, total, payment_status, order_status, fulfillment_method, created_at, order_items ( id )")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((order) => ({
    ...order,
    total: order.total != null ? Number(order.total) : null,
    itemCount: order.order_items.length,
  }));
}

export async function getOrder(id) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, customer_name, phone, whatsapp_number, email, fulfillment_method, delivery_address, total, payment_status, order_status, created_at, order_items ( id, product_name, shade, unit_price, quantity, line_total )"
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return {
    ...data,
    total: data.total != null ? Number(data.total) : null,
    order_items: data.order_items.map((item) => ({
      ...item,
      unit_price: item.unit_price != null ? Number(item.unit_price) : null,
      line_total: item.line_total != null ? Number(item.line_total) : null,
    })),
  };
}

// Runs the mark_order_paid() database function (see supabase/schema.sql) -
// not a plain table update, because that function also atomically
// re-checks and deducts stock in one safe step.
export async function markOrderPaid(id) {
  const { error } = await supabase.rpc("mark_order_paid", { p_order_id: id });
  if (error) throw error;
}

// Runs cancel_order(), which restores stock first if the order had
// already been paid (see the function's comment in schema.sql).
export async function cancelOrder(id) {
  const { error } = await supabase.rpc("cancel_order", { p_order_id: id });
  if (error) throw error;
}

// For status moves that don't touch inventory (Paid -> Processing ->
// Completed) - a plain update is safe here since no stock math is
// involved.
export async function updateOrderStatus(id, orderStatus) {
  const { error } = await supabase.from("orders").update({ order_status: orderStatus }).eq("id", id);
  if (error) throw error;
}
