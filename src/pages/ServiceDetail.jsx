import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getServiceBySlug } from "../lib/services.js";

function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    getServiceBySlug(slug)
      .then((data) => {
        if (!isCancelled) setService(data);
      })
      .catch(() => {
        if (!isCancelled) setError(true);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="page">
        <p className="state-message">Loading service...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="page">
        <h1>Service Not Found</h1>
        <p>
          <Link to="/services">Back to Services</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="service-detail">
      <div className="container service-detail__grid">
        <div className="service-detail__image-wrap">
          {service.coverImage ? (
            <img src={service.coverImage} alt={service.name} />
          ) : (
            <div className="service-detail__image-placeholder" aria-hidden="true" />
          )}
        </div>

        <div className="service-detail__info">
          <span className="label service-detail__eyebrow">Nayaé Beauty</span>
          <h1>{service.name}</h1>
          <p className="service-detail__description">{service.description}</p>

          <p className="service-detail__meta">
            {service.price != null ? `$${service.price.toFixed(2)} CAD` : "Price coming soon"}
            {" · "}
            {service.durationMinutes != null ? `${service.durationMinutes} minutes` : "Duration to be confirmed"}
          </p>

          <Link to={`/book?service=${service.slug}`} className="btn btn-primary">
            Book This Service
          </Link>
        </div>
      </div>

      <div className="container">
        <div className="section-divider" aria-hidden="true">
          <span className="section-divider__ring" />
        </div>

        <h2 className="service-portfolio__heading">Our Work</h2>

        {service.portfolio.length > 0 ? (
          <div className="service-portfolio__grid">
            {service.portfolio.map((photo) => (
              <figure key={photo.id} className="service-portfolio__item">
                <img src={photo.image_url} alt={photo.caption ?? ""} loading="lazy" />
                {photo.caption && <figcaption>{photo.caption}</figcaption>}
              </figure>
            ))}
          </div>
        ) : (
          <p className="state-message">Portfolio photos coming soon.</p>
        )}

        <div className="service-detail__bottom-cta">
          <Link to={`/book?service=${service.slug}`} className="btn btn-primary">
            Book This Service
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;
