import { Link } from "react-router-dom";
import ServiceIcon from "./ServiceIcon.jsx";

// The database doesn't store an icon choice (that's a presentational
// detail, not business data) - this just maps a known service slug to
// one of the hand-drawn icons. Falls back to the "makeup" icon for any
// future service slug not listed here.
const ICON_BY_SLUG = {
  makeup: "makeup",
  "bridal-makeup": "bridal",
  lashes: "lashes",
};

function ServiceCard({ service }) {
  return (
    <Link to={`/services/${service.slug}`} className="service-card">
      <div className="service-card__icon">
        <ServiceIcon name={ICON_BY_SLUG[service.slug]} />
      </div>
      <h3 className="service-card__name">{service.name}</h3>
      <p className="service-card__description">{service.description}</p>
      <span className="service-card__cta">View Service</span>
    </Link>
  );
}

export default ServiceCard;
