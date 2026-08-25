import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ShadeSelector from "../components/product/ShadeSelector.jsx";
import ProductCard from "../components/product/ProductCard.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { useCart } from "../context/CartContext.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

const RELATED_PRODUCTS_COUNT = 4;

// Prefers other products in the same category, then fills any
// remaining spots with other products so this section still shows
// something even for a category that only has one or two items.
function getRelatedProducts(products, currentProduct) {
  const others = products.filter((item) => item.id !== currentProduct.id);
  const sameCategory = others.filter((item) => item.category === currentProduct.category);
  const rest = others.filter((item) => item.category !== currentProduct.category);
  return [...sameCategory, ...rest].slice(0, RELATED_PRODUCTS_COUNT);
}

function ProductDetail() {
  const { slug } = useParams();
  const { products, isLoading, error } = useProducts();
  const product = products.find((item) => item.slug === slug);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  usePageMeta(
    product ? `${product.name} | Nayaé Beauty` : "Nayaé Beauty",
    product?.description
  );

  const [selectedShade, setSelectedShade] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Runs once the product has actually loaded (it's undefined on the
  // first render while the fetch is still in flight), picking the first
  // available shade as the default selection.
  useEffect(() => {
    if (product?.shades) {
      setSelectedShade(product.shades.find((shade) => shade.available)?.name ?? null);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="page">
        <p className="state-message">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="state-message">Couldn't load this product right now. Please try again shortly.</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <h1>Product Not Found</h1>
        <p>
          <Link to="/shop">Back to Shop</Link>
        </p>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(products, product);
  const isOutOfStock = product.stock <= 0;
  // A product with shades can't be added to cart until a shade is chosen -
  // this only blocks the button if every shade happens to be unavailable.
  const needsShadeButNoneSelected = Boolean(product.shades) && !selectedShade;
  const canAddToCart = !isOutOfStock && !needsShadeButNoneSelected;

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(product.stock, current + 1));
  }

  function handleAddToCart() {
    addToCart(product, quantity, selectedShade);
    setQuantity(1);
    setJustAdded(true);
    // Confirmation message fades after a couple seconds rather than
    // sticking around forever or requiring the customer to dismiss it.
    setTimeout(() => setJustAdded(false), 2000);
  }

  function handleBuyNow() {
    addToCart(product, quantity, selectedShade);
    navigate("/checkout");
  }

  return (
    <div className="product-detail">
      <div className="container product-detail__grid">
        <div className="product-detail__image-wrap">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail__info">
          <span className="label product-detail__eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-detail__price">
            {product.price != null ? `$${product.price.toFixed(2)} CAD` : "Price coming soon"}
          </p>

          <p className="product-detail__stock-note">
            {isOutOfStock
              ? "Out of Stock"
              : product.stock <= 3
              ? `Only ${product.stock} left`
              : "In Stock"}
            {" · "}Pickup & local delivery available
          </p>

          {product.shades && (
            <ShadeSelector
              shades={product.shades}
              selectedShade={selectedShade}
              onSelect={setSelectedShade}
            />
          )}

          <div className="product-detail__quantity">
            <span className="shade-selector__label">Quantity</span>
            <div className="quantity-stepper">
              <button type="button" onClick={decreaseQuantity} disabled={isOutOfStock} aria-label="Decrease quantity">
                &minus;
              </button>
              <span aria-live="polite">{quantity}</span>
              <button type="button" onClick={increaseQuantity} disabled={isOutOfStock} aria-label="Increase quantity">
                +
              </button>
            </div>
          </div>

          <div className="product-detail__cta-group">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!canAddToCart}
              onClick={handleAddToCart}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={!canAddToCart}
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
          {justAdded && (
            <p className="product-detail__added-message" role="status">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4.5 8.2l2.3 2.3L11.5 5.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Added to cart.{" "}
              <Link to="/cart" className="product-detail__added-link">
                View Cart
              </Link>
            </p>
          )}

          <p className="product-detail__description">{product.description}</p>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="container">
          <div className="section-divider" aria-hidden="true">
            <span className="section-divider__ring" />
          </div>
          <div className="section-heading">
            <span className="label">Nayaé Beauty</span>
            <h2>You May Also Like</h2>
          </div>
          <div className="product-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
