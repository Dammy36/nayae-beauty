import { Link } from "react-router-dom";
import heroImage from "../../assets/hero/hero-satin-rose.jpg";

// Full-bleed editorial hero: a decorative background image fills the
// section edge-to-edge, a soft dark scrim sits on top only so the
// centered text stays readable, and the copy/CTAs are layered above
// both. The background is a stylistic graphic (not a real product/
// portfolio photo), so its alt text is empty - it's decoration, not
// content the headline/subhead already say everything necessary.
//
// PLACEHOLDER COPY: the subhead below has not been supplied by the
// client yet - it's a temporary description, not a confirmed business
// claim, and will be replaced once real copy is provided.
function Hero() {
  return (
    <section className="hero">
      <div className="hero__background">
        <img src={heroImage} alt="" />
        <div className="hero__overlay" aria-hidden="true" />
      </div>

      <div className="hero__content">
        <span className="hero__eyebrow">
          <span className="hero__eyebrow-ring" aria-hidden="true" />
          Nayaé Beauty
        </span>
        <h1 className="hero__headline">Beauty, refined.</h1>
        <p className="hero__subhead">
          Premium makeup essentials and professional beauty services - shop online or book your
          next appointment.
        </p>
        <div className="hero__actions">
          <Link to="/shop" className="btn btn-primary">
            Shop Now
          </Link>
          <Link to="/book" className="btn btn-outline-light">
            Book an Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
