import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useServices } from "../hooks/useServices.js";
import { createBooking } from "../lib/bookings.js";
import { getWhatsAppLink } from "../lib/whatsapp.js";

const initialFormData = {
  serviceId: "",
  date: "",
  time: "",
  name: "",
  phone: "",
  whatsapp: "",
  sameAsPhone: true,
  notes: "",
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateForMessage(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-CA", { month: "long", day: "numeric" });
}

function formatTimeForMessage(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

function buildBookingWhatsAppMessage({ serviceName, date, time, customerName, bookingId }) {
  return `Hello, I just booked an appointment with Nayaé Beauty.\n\nService: ${serviceName}\nDate: ${formatDateForMessage(
    date
  )}\nTime: ${formatTimeForMessage(time)}\nName: ${customerName}\n\nBooking reference: BK-${bookingId}\n\nPlease confirm my appointment.`;
}

function BookAppointment() {
  const { services, isLoading: servicesLoading } = useServices();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // If we arrived from a service's "Book This Service" button, that
  // service is already chosen - the customer shouldn't have to pick it
  // again.
  useEffect(() => {
    const requestedSlug = searchParams.get("service");
    if (!requestedSlug || services.length === 0) return;
    const match = services.find((service) => service.slug === requestedSlug);
    if (match) {
      setFormData((current) => ({ ...current, serviceId: match.id }));
    }
  }, [searchParams, services]);

  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!formData.serviceId) nextErrors.serviceId = "Choose a service.";
    if (!formData.date) nextErrors.date = "Choose a date.";
    if (formData.date && formData.date < todayIsoDate()) nextErrors.date = "Choose a date that hasn't passed.";
    if (!formData.time) nextErrors.time = "Choose a time.";
    if (!formData.name.trim()) nextErrors.name = "Enter your full name.";
    if (!formData.phone.trim()) nextErrors.phone = "Enter a phone number.";
    if (!formData.sameAsPhone && !formData.whatsapp.trim()) {
      nextErrors.whatsapp = "Enter a WhatsApp number, or check “Same as phone number.”";
    }
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const bookingId = await createBooking({
        serviceId: formData.serviceId,
        customerName: formData.name.trim(),
        phone: formData.phone.trim(),
        whatsappNumber: formData.sameAsPhone ? formData.phone.trim() : formData.whatsapp.trim(),
        date: formData.date,
        time: formData.time,
        notes: formData.notes.trim(),
      });

      const service = services.find((item) => item.id === formData.serviceId);
      setConfirmedBooking({
        bookingId,
        serviceName: service?.name ?? "",
        date: formData.date,
        time: formData.time,
        customerName: formData.name.trim(),
      });
    } catch (error) {
      // e.g. "That time is no longer available. Please choose another."
      setErrors({ submit: error.message || "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (confirmedBooking) {
    const whatsappLink = getWhatsAppLink(buildBookingWhatsAppMessage(confirmedBooking));
    return (
      <div className="page checkout-success">
        <h1>Your booking request has been received.</h1>
        <p>
          Continue to WhatsApp to confirm your appointment with Nayaé Beauty. Your booking reference is{" "}
          <strong>BK-{confirmedBooking.bookingId}</strong>.
        </p>
        <div className="checkout-success__actions">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Continue to WhatsApp
          </a>
          <Link to="/" className="btn btn-ghost">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="section-heading">
          <span className="label">Nayaé Beauty</span>
          <h1>Book Appointment</h1>
        </div>

        <form className="admin-form booking-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="booking-service">Service</label>
            <select
              id="booking-service"
              value={formData.serviceId}
              onChange={(event) => updateField("serviceId", event.target.value)}
              disabled={servicesLoading}
            >
              <option value="">Select a service...</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            {errors.serviceId && <p className="form-field__error">{errors.serviceId}</p>}
          </div>

          <div className="admin-form__row">
            <div className="form-field">
              <label htmlFor="booking-date">Date</label>
              <input
                id="booking-date"
                type="date"
                min={todayIsoDate()}
                value={formData.date}
                onChange={(event) => updateField("date", event.target.value)}
              />
              {errors.date && <p className="form-field__error">{errors.date}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="booking-time">Time</label>
              <input
                id="booking-time"
                type="time"
                value={formData.time}
                onChange={(event) => updateField("time", event.target.value)}
              />
              {errors.time && <p className="form-field__error">{errors.time}</p>}
            </div>
          </div>
          <p className="form-field__hint booking-form__hint">
            We'll confirm your exact appointment availability with you on WhatsApp.
          </p>

          <div className="form-field">
            <label htmlFor="booking-name">Full Name</label>
            <input
              id="booking-name"
              type="text"
              value={formData.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
            {errors.name && <p className="form-field__error">{errors.name}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="booking-phone">Phone Number</label>
            <input
              id="booking-phone"
              type="tel"
              value={formData.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
            {errors.phone && <p className="form-field__error">{errors.phone}</p>}
          </div>

          <div className="form-field form-field--checkbox">
            <input
              id="booking-same-as-phone"
              type="checkbox"
              checked={formData.sameAsPhone}
              onChange={(event) => updateField("sameAsPhone", event.target.checked)}
            />
            <label htmlFor="booking-same-as-phone">WhatsApp number is the same as phone number</label>
          </div>

          {!formData.sameAsPhone && (
            <div className="form-field">
              <label htmlFor="booking-whatsapp">WhatsApp Number</label>
              <input
                id="booking-whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={(event) => updateField("whatsapp", event.target.value)}
              />
              {errors.whatsapp && <p className="form-field__error">{errors.whatsapp}</p>}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="booking-notes">Notes (optional)</label>
            <textarea
              id="booking-notes"
              rows={3}
              value={formData.notes}
              onChange={(event) => updateField("notes", event.target.value)}
            />
          </div>

          {errors.submit && <p className="form-field__error">{errors.submit}</p>}

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;
