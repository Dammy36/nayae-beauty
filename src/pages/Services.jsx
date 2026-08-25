import { Link } from "react-router-dom";
import { useServices } from "../hooks/useServices.js";
import ServiceCard from "../components/service/ServiceCard.jsx";
import PhotoCarousel from "../components/common/PhotoCarousel.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useReveal } from "../hooks/useReveal.js";
import carousel1 from "../assets/services/carousel/carousel-1.jpg";
import carousel2 from "../assets/services/carousel/carousel-2.jpg";
import carousel3 from "../assets/services/carousel/carousel-3.jpg";
import carousel4 from "../assets/services/carousel/carousel-4.jpg";

const carouselImages = [
  { src: carousel1, alt: "Nayaé Beauty makeup look" },
  { src: carousel2, alt: "Nayaé Beauty makeup look" },
  { src: carousel3, alt: "Nayaé Beauty makeup look" },
  { src: carousel4, alt: "Nayaé Beauty makeup look" },
];

const whyChooseUs = [
  { title: "Personalized Looks", description: "Makeup tailored to your unique style and features." },
  { title: "Quality Products", description: "Carefully selected beauty products for a polished finish." },
  { title: "Professional Service", description: "A comfortable, professional makeup experience." },
  { title: "Easy Booking", description: "Book your makeup appointment easily through WhatsApp." },
];

// Same layout logic as the homepage's Services section - the grid
// adapts automatically to however many services exist instead of
// leaving empty space.
function gridModifierClass(count) {
  if (count === 1) return "service-grid--single";
  if (count === 2) return "service-grid--two";
  return "";
}

function Services() {
  usePageMeta(
    "Services | Nayaé Beauty",
    "Professional makeup services in Canada, from everyday glam to bridal makeup. Book your appointment with Nayaé Beauty today."
  );

  const { services, isLoading, error } = useServices();
  const whyChooseReveal = useReveal();
  const gridReveal = useReveal();

  return (
    <div className="shop-page">
      <section className="services-hero">
        <div className="services-hero__background">
          <img src={carousel1} alt="" />
          <div className="services-hero__overlay" aria-hidden="true" />
        </div>
        <div className="services-hero__content">
          <span className="label services-hero__eyebrow">Nayaé Beauty</span>
          <h1>Professional Makeup in Canada</h1>
          <p>
            Look your best for every occasion - shop our curated products or book your next
            appointment with Nayaé Beauty.
          </p>
          <Link to="/book" className="btn btn-primary">
            Book Now
          </Link>
        </div>
      </section>

      <section ref={whyChooseReveal.ref} className={`why-choose-us ${whyChooseReveal.className}`.trim()}>
        <div className="container why-choose-us__grid">
          <div className="why-choose-us__text">
            <span className="label">Why Choose Us</span>
            <h2>Why Choose Nayaé Beauty?</h2>
            <ul className="why-choose-us__list">
              {whyChooseUs.map((item) => (
                <li key={item.title}>
                  <span className="why-choose-us__item-title">{item.title}</span>
                  <span className="why-choose-us__item-description">{item.description}</span>
                </li>
              ))}
            </ul>
            <Link to="/book" className="btn btn-ghost">
              Book Now
            </Link>
          </div>

          <PhotoCarousel images={carouselImages} />
        </div>
      </section>

      <div ref={gridReveal.ref} className={`container ${gridReveal.className}`.trim()}>
        <div className="section-heading">
          <span className="label">Nayaé Beauty</span>
          <h2>Our Services</h2>
        </div>

        {isLoading && <p className="state-message">Loading services...</p>}
        {error && <p className="state-message">Couldn't load services right now. Please try again shortly.</p>}

        {!isLoading && !error && (
          <div className={`service-grid ${gridModifierClass(services.length)}`.trim()}>
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;
