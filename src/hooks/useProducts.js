import { useEffect, useState } from "react";
import { getProducts } from "../lib/products.js";

// Loads the full product catalogue once and shares it with whichever
// page uses this hook (homepage, shop, product detail all just filter
// the same list down to what they need - simpler than each page having
// its own fetch logic).
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    getProducts()
      .then((data) => {
        if (!isCancelled) setProducts(data);
      })
      .catch((err) => {
        if (!isCancelled) setError(err);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    // If the component unmounts before the request finishes, this stops
    // the result from being applied to state that no longer exists.
    return () => {
      isCancelled = true;
    };
  }, []);

  return { products, isLoading, error };
}
