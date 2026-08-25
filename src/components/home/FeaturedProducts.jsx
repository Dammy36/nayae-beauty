import { Link } from "react-router-dom";
import ProductCard from "../product/ProductCard.jsx";
import { useProducts } from "../../hooks/useProducts.js";
import { useReveal } from "../../hooks/useReveal.js";

// Which products show on the homepage is a presentation choice, not
// business data, so it's just a slug list here rather than a database
// column - easy to change without touching the schema.
const FEATURED_SLUGS = [
  "la-girl-pro-concealer",
  "davis-brow-lip-liner-pencil",
  "dglow-loose-highlighter",
  "absolute-lip-gloss",
];

function FeaturedProducts() {
  const { products, isLoading, error } = useProducts();
  const featuredProducts = FEATURED_SLUGS.map((slug) => products.find((p) => p.slug === slug)).filter(
    Boolean
  );
  const { ref, className } = useReveal();

  return (
    <section ref={ref} className={`section ${className}`.trim()}>
      <div className="container">
        <div className="section-heading">
          <span className="label">Shop The Edit</span>
          <h2>Featured Products</h2>
        </div>

        {isLoading && <p className="state-message">Loading products...</p>}
        {error && <p className="state-message">Couldn't load products right now. Please try again shortly.</p>}

        {!isLoading && !error && (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="section-heading__cta">
          <Link to="/shop" className="btn btn-ghost">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
