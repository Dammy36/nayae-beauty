import { useServices } from "../hooks/useServices.js";
import ServiceCard from "../components/service/ServiceCard.jsx";

// Same layout logic as the homepage's Services section - the grid
// adapts automatically to however many services exist instead of
// leaving empty space.
function gridModifierClass(count) {
  if (count === 1) return "service-grid--single";
  if (count === 2) return "service-grid--two";
  return "";
}

function Services() {
  const { services, isLoading, error } = useServices();

  return (
    <div className="shop-page">
      <div className="container">
        <div className="section-heading">
          <span className="label">Nayaé Beauty</span>
          <h1>Services</h1>
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
