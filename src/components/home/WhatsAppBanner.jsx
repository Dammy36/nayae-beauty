import { getWhatsAppLink } from "../../lib/whatsapp.js";

function WhatsAppBanner() {
  const link = getWhatsAppLink("Hi Nayaé Beauty! I have a question.");

  return (
    <section className="whatsapp-banner">
      <div className="container whatsapp-banner__inner">
        <div>
          <h2>Questions about a product or service?</h2>
          <p>Message us on WhatsApp and we'll get back to you.</p>
        </div>
        <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3a9 9 0 00-7.75 13.5L3 21l4.6-1.2A9 9 0 1012 3z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 9.3c.2-1 1-1 1.4-1 .3 0 .6.4.8.8.2.5.5 1 .1 1.5-.5.6-.9.6-.6 1.2.4.7 1.5 1.9 2.6 2.2.6.2.8-.2 1.3-.7.4-.4.9-.2 1.4.1.4.3.9.5.9.9.1 1.2-1.6 1.9-2.6 1.8-1.6-.1-4.4-1.7-5.5-4.4-.4-1-.2-1.9.2-2.4z"
              fill="currentColor"
            />
          </svg>
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}

export default WhatsAppBanner;
