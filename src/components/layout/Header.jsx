import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

// Files in /public are served as-is by Vite at the site root, so this is
// just a plain URL string - no import needed (only files under src/
// go through Vite's bundler and need an import).
const logoUrl = "/logo.jpg";

// The site-wide top navigation. Below 860px wide it collapses into a
// hamburger menu (see the "is-open" class + the CSS media query in
// global.css) instead of just shrinking the desktop layout.
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function navLinkClassName({ isActive }) {
    return isActive ? "site-nav__link active" : "site-nav__link";
  }

  return (
    <header className="site-header">
      <Link to="/" className="site-logo" onClick={closeMenu}>
        <img src={logoUrl} alt="Nayaé Beauty" />
        Nayaé Beauty
      </Link>

      <button
        type="button"
        className="site-nav__menu-toggle"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        {isMenuOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <nav className={isMenuOpen ? "site-nav is-open" : "site-nav"}>
        <NavLink to="/shop" className={navLinkClassName} onClick={closeMenu}>
          Shop
        </NavLink>
        <NavLink to="/services" className={navLinkClassName} onClick={closeMenu}>
          Services
        </NavLink>
        <NavLink to="/about" className={navLinkClassName} onClick={closeMenu}>
          About
        </NavLink>
        <NavLink to="/contact" className={navLinkClassName} onClick={closeMenu}>
          Contact
        </NavLink>
        <NavLink to="/cart" className="site-nav__cart" onClick={closeMenu}>
          Cart{itemCount > 0 && <span className="site-nav__cart-count">{itemCount}</span>}
        </NavLink>
        <Link to="/book" className="btn btn-primary" onClick={closeMenu}>
          Book Appointment
        </Link>
      </nav>
    </header>
  );
}

export default Header;
