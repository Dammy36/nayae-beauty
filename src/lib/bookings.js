import { supabase } from "./supabaseClient.js";

// Creates a booking through the create_booking() database function (see
// supabase/schema.sql) - it checks the requested date/time isn't already
// taken before inserting, and does so safely even if two people try to
// book the same slot at the exact same moment.
export async function createBooking({ serviceId, customerName, phone, whatsappNumber, date, time, notes }) {
  const { data, error } = await supabase.rpc("create_booking", {
    p_service_id: serviceId,
    p_customer_name: customerName,
    p_phone: phone,
    p_whatsapp_number: whatsappNumber,
    p_booking_date: date,
    p_booking_time: time,
    p_notes: notes || null,
  });

  if (error) throw error;
  return data[0].booking_id;
}
