import { Link } from "react-router-dom";

// A single product tile, used on the homepage and the full Shop grid.
// Price is optional on purpose: real pricing isn't confirmed yet, so we
// show "Price coming soon" instead of guessing. Stock drives a status
// badge - out of stock, low stock, or nothing when there's plenty.
function ProductCard({ product }) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= 3;

  return (
    <Link
      to={`/shop/${product.slug}`}
      className={isOutOfStock ? "product-card product-card--out-of-stock" : "product-card"}
    >
      <div className="product-card__image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        {isOutOfStock && <span className="product-card__badge product-card__badge--out">Out of Stock</span>}
        {isLowStock && (
          <span className="product-card__badge product-card__badge--low">Only {product.stock} left</span>
        )}
      </div>
      <span className="label product-card__category">{product.category}</span>
      <h3 className="product-card__name">{product.name}</h3>
      <p className="product-card__price">
        {product.price != null ? `$${product.price.toFixed(2)} CAD` : "Price coming soon"}
      </p>
    </Link>
  );
}

export default ProductCard;
