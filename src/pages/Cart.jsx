import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

function Cart() {
  usePageMeta("Cart | Nayaé Beauty", null, { noIndex: true });

  const { items, subtotal, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="page cart-empty">
        <h1>Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Cart</h1>

        <div className="cart-layout">
          <ul className="cart-items">
            {items.map((item) => (
              <li key={item.lineId} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item__image" />

                <div className="cart-item__details">
                  <p className="cart-item__name">{item.name}</p>
                  {item.shade && <p className="cart-item__shade">Shade: {item.shade}</p>}
                  <p className="cart-item__price">
                    {item.price != null ? `$${item.price.toFixed(2)} CAD` : "Price coming soon"}
                  </p>

                  <div className="quantity-stepper">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      &minus;
                    </button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="cart-item__remove"
                  onClick={() => removeFromCart(item.lineId)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <span>{subtotal != null ? `$${subtotal.toFixed(2)} CAD` : "Price coming soon"}</span>
            </div>
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total</span>
              <span>{subtotal != null ? `$${subtotal.toFixed(2)} CAD` : "Price coming soon"}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary cart-summary__checkout">
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="btn btn-ghost cart-summary__continue">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
