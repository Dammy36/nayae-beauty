import { useState } from "react";
import { getWhatsAppLink } from "../lib/whatsapp.js";
import { usePageMeta } from "../hooks/usePageMeta.js";

const initialFormData = { name: "", email: "", subject: "", message: "" };

const BUSINESS_ADDRESS = "York University, North York, ON";
const BUSINESS_PHONE = "+1 437-267-6919";
const BUSINESS_EMAIL = "nayaebeauty@gmail.com";
const MAP_EMBED_SRC = "https://www.google.com/maps?q=York+University,+North+York,+ON&output=embed";

function buildContactWhatsAppMessage({ name, email, subject, message }) {
  return `Hello, I have a message from the Nayaé Beauty contact page.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;
}

// There's no backend to receive a contact form submission - "Send
// Message" builds a WhatsApp message from what was typed and opens it,
// same as every other form on this site (bookings, checkout).
function Contact() {
  usePageMeta(
    "Contact | Nayaé Beauty",
    "Get in touch with Nayaé Beauty - questions, bookings, or anything else. Find our address, phone, and email here."
  );

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "Enter your name.";
    if (!formData.email.trim()) nextErrors.email = "Enter your email address.";
    if (!formData.message.trim()) nextErrors.message = "Enter a message.";
    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const link = getWhatsAppLink(buildContactWhatsAppMessage(formData));
    window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="about-page">
      <section className="about-title">
        <div className="container">
          <span className="label">Nayaé Beauty</span>
          <h1>Contact Us</h1>
        </div>
      </section>

      <div className="container contact-grid">
        <div className="contact-grid__info">
          <h2>We'd Love to Hear From You</h2>
          <p>
            Have a question about a product, a booking, or anything else? Reach out and we'll get
            back to you as soon as we can.
          </p>

          <ul className="contact-info-list">
            <li>
              <span className="contact-info-list__icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
              {BUSINESS_ADDRESS}
            </li>
            <li>
              <span className="contact-info-list__icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 5c0-.6.4-1 1-1h3l2 4.5-2 1.3a11 11 0 005 5l1.3-2L19 15v3c0 .6-.4 1-1 1C10.3 19 4 12.7 4 5z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <a href={`tel:${BUSINESS_PHONE.replace(/[^+\d]/g, "")}`}>{BUSINESS_PHONE}</a>
            </li>
            <li>
              <span className="contact-info-list__icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M4 6.5l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
            </li>
          </ul>
        </div>

        <form className="admin-form contact-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              type="text"
              value={formData.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
            {errors.name && <p className="form-field__error">{errors.name}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              type="email"
              value={formData.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
            {errors.email && <p className="form-field__error">{errors.email}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              type="text"
              value={formData.subject}
              onChange={(event) => updateField("subject", event.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              rows={4}
              value={formData.message}
              onChange={(event) => updateField("message", event.target.value)}
            />
            {errors.message && <p className="form-field__error">{errors.message}</p>}
          </div>

          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
      </div>

      <div className="contact-map">
        <iframe
          title="Nayaé Beauty location"
          src={MAP_EMBED_SRC}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

export default Contact;
