import { supabase } from "./supabaseClient.js";

export async function getAllBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, customer_name, phone, whatsapp_number, booking_date, booking_time, notes, status, created_at, services ( name )"
    )
    .order("booking_date")
    .order("booking_time");

  if (error) throw error;
  return data.map((booking) => ({
    ...booking,
    serviceName: booking.services?.name ?? "—",
  }));
}

export async function updateBookingStatus(id, status) {
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) throw error;
}

// Moves a booking to a new date/time and marks it Rescheduled - the
// booking stays a normal active booking at its new slot (the unique
// "no double booking" rule in schema.sql only ignores Cancelled
// bookings, so this new slot is still fully protected against clashes).
export async function rescheduleBooking(id, date, time) {
  const { error } = await supabase
    .from("bookings")
    .update({ booking_date: date, booking_time: time, status: "Rescheduled" })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      throw new Error("That time is already booked. Please choose another.");
    }
    throw error;
  }
}
