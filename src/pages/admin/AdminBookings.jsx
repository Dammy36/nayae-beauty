import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { getAllBookings, updateBookingStatus, rescheduleBooking } from "../../lib/adminBookings.js";

const FILTERS = {
  active: {
    label: "Active",
    match: (booking) => booking.status !== "Completed" && booking.status !== "Cancelled",
  },
  completed: { label: "Completed", match: (booking) => booking.status === "Completed" },
  cancelled: { label: "Cancelled", match: (booking) => booking.status === "Cancelled" },
  all: { label: "All", match: () => true },
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

function AdminBookings() {
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [showPast, setShowPast] = useState(false);
  const [filter, setFilter] = useState("active");
  const [reschedulingId, setReschedulingId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  function loadBookings() {
    getAllBookings()
      .then(setBookings)
      .catch((err) => setError(err.message));
  }

  useEffect(loadBookings, []);

  async function handleStatusChange(booking, status) {
    setActionError(null);
    try {
      await updateBookingStatus(booking.id, status);
      loadBookings();
    } catch (err) {
      setActionError(err.message);
    }
  }

  function startReschedule(booking) {
    setReschedulingId(booking.id);
    setRescheduleDate(booking.booking_date);
    setRescheduleTime(booking.booking_time);
    setActionError(null);
  }

  async function confirmReschedule(bookingId) {
    setActionError(null);
    try {
      await rescheduleBooking(bookingId, rescheduleDate, rescheduleTime);
      setReschedulingId(null);
      loadBookings();
    } catch (err) {
      setActionError(err.message);
    }
  }

  const today = todayIsoDate();
  // Two independent filters stack together: the status tab (Active by
  // default, so Completed/Cancelled bookings don't linger in view) and
  // the existing date toggle (upcoming only by default).
  const visibleBookings = useMemo(() => {
    if (!bookings) return null;
    return bookings
      .filter(FILTERS[filter].match)
      .filter((booking) => showPast || booking.booking_date >= today);
  }, [bookings, filter, showPast, today]);

  return (
    <AdminLayout>
      <h1>Bookings</h1>

      {error && <p className="state-message">Couldn't load bookings: {error}</p>}
      {actionError && <p className="form-field__error">{actionError}</p>}
      {!error && !bookings && <p className="state-message">Loading bookings...</p>}

      {bookings && (
        <>
          <div className="admin-filter-tabs">
            {Object.entries(FILTERS).map(([key, { label }]) => (
              <button
                key={key}
                type="button"
                className={`admin-filter-tabs__tab ${filter === key ? "admin-filter-tabs__tab--active" : ""}`.trim()}
                onClick={() => setFilter(key)}
              >
                {label}
                <span className="admin-filter-tabs__count">{bookings.filter(FILTERS[key].match).length}</span>
              </button>
            ))}
          </div>

          <label className="admin-filter-toggle">
            <input type="checkbox" checked={showPast} onChange={(event) => setShowPast(event.target.checked)} />
            Show past bookings too
          </label>

          {visibleBookings.length === 0 && (
            <p className="state-message">No {FILTERS[filter].label.toLowerCase()} bookings to show.</p>
          )}

          {visibleBookings.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Phone / WhatsApp</th>
                    <th>Notes</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        {booking.booking_date}
                        {booking.booking_date === today && <span className="admin-today-badge">Today</span>}
                      </td>
                      <td>{formatTime(booking.booking_time)}</td>
                      <td>{booking.customer_name}</td>
                      <td>{booking.serviceName}</td>
                      <td>
                        {booking.phone}
                        {booking.whatsapp_number !== booking.phone && ` / ${booking.whatsapp_number}`}
                      </td>
                      <td>{booking.notes || "—"}</td>
                      <td>
                        <span className={`admin-status-pill admin-status-pill--booking-${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="admin-table__actions">
                        {booking.status !== "Cancelled" && booking.status !== "Completed" && (
                          <>
                            {booking.status === "Pending" && (
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                onClick={() => handleStatusChange(booking, "Confirmed")}
                              >
                                Confirm
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              onClick={() => handleStatusChange(booking, "Completed")}
                            >
                              Complete
                            </button>
                            <button type="button" className="btn btn-ghost btn-sm" onClick={() => startReschedule(booking)}>
                              Reschedule
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm admin-table__delete"
                              onClick={() => handleStatusChange(booking, "Cancelled")}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reschedulingId && (
            <div className="admin-reschedule-panel">
              <h2>Reschedule Booking</h2>
              <div className="admin-form__row">
                <div className="form-field">
                  <label htmlFor="reschedule-date">New Date</label>
                  <input
                    id="reschedule-date"
                    type="date"
                    min={today}
                    value={rescheduleDate}
                    onChange={(event) => setRescheduleDate(event.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="reschedule-time">New Time</label>
                  <input
                    id="reschedule-time"
                    type="time"
                    value={rescheduleTime}
                    onChange={(event) => setRescheduleTime(event.target.value)}
                  />
                </div>
              </div>
              <button type="button" className="btn btn-primary" onClick={() => confirmReschedule(reschedulingId)}>
                Save New Time
              </button>
              <button type="button" className="btn btn-ghost admin-form__cancel" onClick={() => setReschedulingId(null)}>
                Cancel
              </button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

export default AdminBookings;
