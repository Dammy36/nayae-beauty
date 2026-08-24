import { useServices } from "../../hooks/useServices.js";
import ServiceCard from "../service/ServiceCard.jsx";

// The grid layout adapts to how many services actually exist, so a
// short list (1 or 2 services, our current real scope) doesn't render
// as a 3-column grid with awkward empty space. Once there are 3+
// services this falls back to the standard even grid automatically.
function gridModifierClass(count) {
  if (count === 1) return "service-grid--single";
  if (count === 2) return "service-grid--two";
  return "";
}

function FeaturedServices() {
  const { services, isLoading, error } = useServices();

  return (
    <section className="section section--blush">
      <div className="container">
        <div className="section-heading">
          <span className="label">Book Your Next Look</span>
          <h2>Services</h2>
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
    </section>
  );
}

export default FeaturedServices;
