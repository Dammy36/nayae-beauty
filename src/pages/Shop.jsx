import { useMemo, useState } from "react";
import ProductCard from "../components/product/ProductCard.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { usePageMeta } from "../hooks/usePageMeta.js";

function Shop() {
  usePageMeta(
    "Shop | Nayaé Beauty",
    "Browse makeup essentials from Nayaé Beauty - eyes, face, lips, skincare, and tools, curated for every routine and occasion."
  );

  const { products, isLoading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].filter(Boolean).sort(),
    [products]
  );

  // Recomputed only when the search term, category, or catalogue
  // changes - not on every render - since filtering runs on every
  // keystroke while typing in the search box.
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, activeCategory]);

  function clearFilters() {
    setSearchTerm("");
    setActiveCategory("All");
  }

  return (
    <div className="shop-page">
      <div className="container">
        <div className="section-heading">
          <span className="label">Nayaé Beauty</span>
          <h1>Shop</h1>
        </div>

        {isLoading && <p className="state-message">Loading products...</p>}
        {error && <p className="state-message">Couldn't load products right now. Please try again shortly.</p>}

        {!isLoading && !error && (
          <>
            <div className="shop-toolbar">
              <div className="shop-search">
                <label htmlFor="shop-search-input" className="sr-only">
                  Search products
                </label>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <input
                  id="shop-search-input"
                  type="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <div className="shop-categories" role="group" aria-label="Filter by category">
                {["All", ...categories].map((category) => (
                  <button
                    key={category}
                    type="button"
                    className="shop-categories__pill"
                    aria-pressed={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="shop-empty-state">
                <p>No products found.</p>
                <button type="button" className="btn btn-ghost" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Shop;
