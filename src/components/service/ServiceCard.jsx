import { Link } from "react-router-dom";
import ServiceIcon from "./ServiceIcon.jsx";
import makeupPhoto from "../../assets/services/makeup.jpg";
import bridalPhoto from "../../assets/services/bridal-makeup.jpg";

const ICON_BY_SLUG = {
  makeup: "makeup",
  "bridal-makeup": "bridal",
  lashes: "lashes",
};

// Falls back to this map when a service has no cover_image_url set in
// the database yet (no admin upload flow exists for that field today).
const PHOTO_BY_SLUG = {
  makeup: makeupPhoto,
  "bridal-makeup": bridalPhoto,
};

function ServiceCard({ service }) {
  const photo = service.coverImage || PHOTO_BY_SLUG[service.slug] || makeupPhoto;

  return (
    <Link to={`/services/${service.slug}`} className="service-card">
      <div className="service-card__background">
        <img src={photo} alt="" />
        <div className="service-card__overlay" aria-hidden="true" />
      </div>
      <div className="service-card__icon">
        <ServiceIcon name={ICON_BY_SLUG[service.slug]} />
      </div>
      <div className="service-card__content">
        <h3 className="service-card__name">{service.name}</h3>
        <p className="service-card__description">{service.description}</p>
        <span className="service-card__cta">View Service</span>
      </div>
    </Link>
  );
}

export default ServiceCard;
