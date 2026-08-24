import { supabase } from "./supabaseClient.js";

// Creates an order through the create_order() database function (see
// supabase/schema.sql) instead of writing to the orders table directly -
// that function validates stock and computes the total safely on the
// server, and it's the only way in since customers have no direct table
// access. Throws if anything is wrong (e.g. not enough stock), so the
// checkout page can show that message to the customer.
export async function createOrder({
  customerName,
  phone,
  whatsappNumber,
  email,
  fulfillmentMethod,
  deliveryAddress,
  items,
}) {
  const { data, error } = await supabase.rpc("create_order", {
    p_customer_name: customerName,
    p_phone: phone,
    p_whatsapp_number: whatsappNumber,
    p_email: email,
    p_fulfillment_method: fulfillmentMethod,
    p_delivery_address: deliveryAddress,
    p_items: items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
      shade: item.shade,
    })),
  });

  if (error) throw error;

  const result = data[0];
  return {
    orderNumber: result.order_id,
    total: result.order_total != null ? Number(result.order_total) : null,
  };
}
