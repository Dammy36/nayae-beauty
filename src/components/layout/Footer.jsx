import { Link } from "react-router-dom";
import { getWhatsAppLink } from "../../lib/whatsapp.js";

function Footer() {
  const whatsappLink = getWhatsAppLink("Hi Nayaé Beauty! I have a question.");

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__logo">Nayaé Beauty</p>
          <p>Beauty products and professional beauty services.</p>
        </div>

        <nav className="site-footer__links" aria-label="Footer">
          <Link to="/shop">Shop</Link>
          <Link to="/services">Services</Link>
          <Link to="/book">Book Appointment</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="site-footer__whatsapp">
          Chat on WhatsApp
        </a>
      </div>

      <p className="site-footer__copyright">
        &copy; {new Date().getFullYear()} Nayaé Beauty. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
