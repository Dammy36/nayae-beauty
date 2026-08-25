import { Link } from "react-router-dom";
import heroImage from "../assets/about/about-hero.jpg";
import missionPrimary from "../assets/about/mission-primary.jpg";
import missionSecondary from "../assets/about/mission-secondary.jpg";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useReveal } from "../hooks/useReveal.js";

// Centered, bold page title (its own plain-background banner) followed
// by a stacked photo + centered story - inspired by the Bea The Stylist
// about page's centered editorial treatment, not copied, with our own
// pink/black styling and copy.
function About() {
  usePageMeta(
    "About | Nayaé Beauty",
    "Nayaé Beauty offers a curated selection of makeup essentials alongside professional beauty services, all in one place."
  );
  const { ref, className } = useReveal();

  return (
    <div className="about-page">
      <section className="about-title">
        <div className="container">
          <span className="label">Nayaé Beauty</span>
          <h1>About Us</h1>
        </div>
      </section>

      <div className="container about-page__intro">
        <div className="about-page__intro-text">
          <h2>Beauty that feels like you.</h2>
          <p>
            Nayaé Beauty offers a curated selection of makeup essentials alongside professional
            beauty services, all in one place. Whether you're shopping for your everyday routine or
            booking a look for a special occasion, our goal is simple: help you feel confident in
            your own skin.
          </p>
          <Link to="/shop" className="btn btn-ghost">
            Shop Now
          </Link>
        </div>
        <div className="about-page__intro-photo">
          <img src={heroImage} alt="Nayaé Beauty" />
        </div>
      </div>

      <section ref={ref} className={`mission ${className}`.trim()}>
        <div className="container mission__grid">
          <div className="mission__media">
            <img src={missionPrimary} alt="Nayaé Beauty makeup application, close up" />
            <img src={missionSecondary} alt="Nayaé Beauty makeup application with brushes" />
          </div>
          <div className="mission__text">
            <span className="label">Our Mission</span>
            <h2>Beauty, made personal.</h2>
            <p>
              Our mission is simple: to make quality beauty accessible and personal. We curate every
              product we carry and every service we offer around one idea - that beauty should meet
              you exactly where you are, with the shades, tools, and expertise to help you feel like
              the most confident version of yourself. From a first-time foundation match to a full
              glam look for a big night out, our door - and our WhatsApp - is always open.
            </p>
            <Link to="/services" className="btn btn-ghost">
              Book a Service
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
