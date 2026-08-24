import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { createOrder } from "../lib/orders.js";
import { getWhatsAppLink } from "../lib/whatsapp.js";

const initialFormData = {
  name: "",
  phone: "",
  whatsapp: "",
  sameAsPhone: true,
  email: "",
  fulfillment: "pickup",
  address: "",
};

function buildOrderWhatsAppMessage(order) {
  const itemLines = order.items
    .map((item) => `${item.name}${item.shade ? ` (${item.shade})` : ""} × ${item.quantity}`)
    .join("\n");
  const totalLine = order.total != null ? `$${order.total.toFixed(2)} CAD` : "To be confirmed";

  return `Hello, I just placed an order #${order.orderNumber} with Nayaé Beauty.\n\nOrder:\n${itemLines}\n\nTotal: ${totalLine}\n\nPlease send me payment details.`;
}

function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Enter your full name.";
    if (!formData.phone.trim()) nextErrors.phone = "Enter a phone number.";
    if (!formData.sameAsPhone && !formData.whatsapp.trim()) {
      nextErrors.whatsapp = "Enter a WhatsApp number, or check “Same as phone number.”";
    }
    if (formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      nextErrors.email = "Enter a valid email address, or leave this blank.";
    }
    if (formData.fulfillment === "delivery" && !formData.address.trim()) {
      nextErrors.address = "Enter a delivery address, or choose Pickup instead.";
    }

    // Re-check stock in case anything changed since items were added to
    // the cart - defensive now, and this is exactly where a real
    // Supabase stock check will plug in during Phase 8.
    const outOfStockItem = items.find((item) => item.quantity > item.stock);
    if (outOfStockItem) {
      nextErrors.stock = `Sorry, "${outOfStockItem.name}" no longer has enough stock. Please update your cart.`;
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const orderItems = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      shade: item.shade,
      price: item.price,
      quantity: item.quantity,
    }));

    setIsSubmitting(true);
    try {
      const result = await createOrder({
        customerName: formData.name.trim(),
        phone: formData.phone.trim(),
        whatsappNumber: formData.sameAsPhone ? formData.phone.trim() : formData.whatsapp.trim(),
        email: formData.email.trim() || null,
        fulfillmentMethod: formData.fulfillment,
        deliveryAddress: formData.fulfillment === "delivery" ? formData.address.trim() : null,
        items: orderItems,
      });

      clearCart();
      setSubmittedOrder({ ...result, items: orderItems });
    } catch (error) {
      // The database function raises a clear message (e.g. "Not enough
      // stock for ...") if something changed since the cart was built -
      // show that instead of a generic failure.
      setErrors({ submit: error.message || "Something went wrong placing your order. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submittedOrder) {
    const whatsappLink = getWhatsAppLink(buildOrderWhatsAppMessage(submittedOrder));
    return (
      <div className="page checkout-success">
        <h1>Order #{submittedOrder.orderNumber} has been created.</h1>
        <p>
          Continue to WhatsApp to receive payment instructions from Nayaé Beauty. Your order is
          currently <strong>Pending Payment</strong>.
        </p>
        <div className="checkout-success__actions">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Continue to WhatsApp
          </a>
          <Link to="/shop" className="btn btn-ghost">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page cart-empty">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <Link to="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <form className="checkout-layout" onSubmit={handleSubmit} noValidate>
          <div className="checkout-form">
            <h2>Your Details</h2>

            <div className="form-field">
              <label htmlFor="checkout-name">Full Name</label>
              <input
                id="checkout-name"
                type="text"
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
              {errors.name && <p className="form-field__error">{errors.name}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="checkout-phone">Phone Number</label>
              <input
                id="checkout-phone"
                type="tel"
                value={formData.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
              {errors.phone && <p className="form-field__error">{errors.phone}</p>}
            </div>

            <div className="form-field form-field--checkbox">
              <input
                id="checkout-same-as-phone"
                type="checkbox"
                checked={formData.sameAsPhone}
                onChange={(event) => updateField("sameAsPhone", event.target.checked)}
              />
              <label htmlFor="checkout-same-as-phone">WhatsApp number is the same as phone number</label>
            </div>

            {!formData.sameAsPhone && (
              <div className="form-field">
                <label htmlFor="checkout-whatsapp">WhatsApp Number</label>
                <input
                  id="checkout-whatsapp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(event) => updateField("whatsapp", event.target.value)}
                />
                {errors.whatsapp && <p className="form-field__error">{errors.whatsapp}</p>}
              </div>
            )}

            <div className="form-field">
              <label htmlFor="checkout-email">Email (optional)</label>
              <input
                id="checkout-email"
                type="email"
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
              {errors.email && <p className="form-field__error">{errors.email}</p>}
            </div>

            <h2>Pickup or Delivery</h2>
            <div className="form-field form-field--radio-group" role="radiogroup" aria-label="Fulfillment method">
              <label className="form-field__radio">
                <input
                  type="radio"
                  name="fulfillment"
                  value="pickup"
                  checked={formData.fulfillment === "pickup"}
                  onChange={() => updateField("fulfillment", "pickup")}
                />
                Pickup
              </label>
              <label className="form-field__radio">
                <input
                  type="radio"
                  name="fulfillment"
                  value="delivery"
                  checked={formData.fulfillment === "delivery"}
                  onChange={() => updateField("fulfillment", "delivery")}
                />
                Local Delivery
              </label>
            </div>

            {formData.fulfillment === "delivery" && (
              <div className="form-field">
                <label htmlFor="checkout-address">Delivery Address</label>
                <textarea
                  id="checkout-address"
                  rows={3}
                  value={formData.address}
                  onChange={(event) => updateField("address", event.target.value)}
                />
                {errors.address && <p className="form-field__error">{errors.address}</p>}
                <p className="form-field__hint">
                  Local delivery area and fee will be confirmed with you on WhatsApp.
                </p>
              </div>
            )}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <ul className="checkout-summary-items">
              {items.map((item) => (
                <li key={item.lineId}>
                  <span>
                    {item.name}
                    {item.shade ? ` (${item.shade})` : ""} &times; {item.quantity}
                  </span>
                  <span>{item.price != null ? `$${(item.price * item.quantity).toFixed(2)}` : "—"}</span>
                </li>
              ))}
            </ul>
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total</span>
              <span>{subtotal != null ? `$${subtotal.toFixed(2)} CAD` : "Price coming soon"}</span>
            </div>

            {errors.stock && <p className="form-field__error">{errors.stock}</p>}
            {errors.submit && <p className="form-field__error">{errors.submit}</p>}

            <button type="submit" className="btn btn-primary cart-summary__checkout" disabled={isSubmitting}>
              {isSubmitting ? "Placing Order..." : "Place Order & Continue to WhatsApp"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
