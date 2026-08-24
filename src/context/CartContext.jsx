import { createContext, useContext, useEffect, useState } from "react";

// The cart lives here, in one place, so any component (the header badge,
// the product page's "Add to Cart" button, the cart page itself) can
// read or change it via the useCart() hook below, instead of passing
// cart data down through props on every page.
const CartContext = createContext(null);

const STORAGE_KEY = "nayae-beauty-cart";

// A cart "line" is one row in the cart: one product, optionally one
// shade, and a quantity. The same product in two different shades is
// two separate lines - that's what this id captures.
function makeLineId(productId, shade) {
  return `${productId}__${shade ?? "default"}`;
}

function loadCartFromStorage() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    // If localStorage is unavailable or the saved data is corrupted,
    // just start with an empty cart instead of crashing the app.
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCartFromStorage);

  // Keep localStorage in sync any time the cart changes, so a refresh
  // (or coming back later) doesn't lose the customer's cart.
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addToCart(product, quantity, shade) {
    const lineId = makeLineId(product.id, shade);

    setItems((currentItems) => {
      const existingLine = currentItems.find((item) => item.lineId === lineId);

      if (existingLine) {
        const newQuantity = Math.min(existingLine.quantity + quantity, product.stock);
        return currentItems.map((item) =>
          item.lineId === lineId ? { ...item, quantity: newQuantity } : item
        );
      }

      const newLine = {
        lineId,
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        stock: product.stock,
        shade: shade ?? null,
        quantity: Math.min(quantity, product.stock),
      };
      return [...currentItems, newLine];
    });
  }

  function updateQuantity(lineId, quantity) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.lineId === lineId
          ? { ...item, quantity: Math.min(Math.max(1, quantity), item.stock) }
          : item
      )
    );
  }

  function removeFromCart(lineId) {
    setItems((currentItems) => currentItems.filter((item) => item.lineId !== lineId));
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Subtotal is null (rather than 0) if any item's price hasn't been
  // confirmed yet - showing "$0.00" would incorrectly suggest the items
  // are free instead of just not priced yet.
  const hasUnpricedItem = items.some((item) => item.price == null);
  const subtotal = hasUnpricedItem
    ? null
    : items.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = {
    items,
    itemCount,
    subtotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a <CartProvider>");
  }
  return context;
}
