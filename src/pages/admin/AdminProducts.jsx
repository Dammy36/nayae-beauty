import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { getAllProductsAdmin, deleteProduct, setProductStatus } from "../../lib/adminProducts.js";

// Same threshold used everywhere else (the customer-facing "Only X
// left" badge, the dashboard's "Low Stock Products" count) so this
// number means the same thing across the whole app.
const LOW_STOCK_THRESHOLD = 3;

function stockClassName(stock) {
  if (stock <= 0) return "admin-stock admin-stock--out";
  if (stock <= LOW_STOCK_THRESHOLD) return "admin-stock admin-stock--low";
  return "admin-stock";
}

function AdminProducts() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Lets the dashboard's "Low Stock Products" card link straight here
  // already filtered, instead of just landing on the full list.
  const lowStockOnly = searchParams.get("filter") === "low-stock";

  function loadProducts() {
    getAllProductsAdmin()
      .then(setProducts)
      .catch((err) => setError(err.message));
  }

  useEffect(loadProducts, []);

  function toggleLowStockFilter(checked) {
    setSearchParams(checked ? { filter: "low-stock" } : {});
  }

  async function handleToggleStatus(product) {
    setActionError(null);
    const nextStatus = product.status === "active" ? "inactive" : "active";
    try {
      await setProductStatus(product.id, nextStatus);
      loadProducts();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Permanently delete "${product.name}"? This can't be undone. If you just want to hide it from the shop, use Deactivate instead.`
    );
    if (!confirmed) return;

    setActionError(null);
    try {
      await deleteProduct(product.id);
      loadProducts();
    } catch (err) {
      setActionError(err.message);
    }
  }

  const visibleProducts = products
    ? lowStockOnly
      ? products.filter((product) => product.stock <= LOW_STOCK_THRESHOLD)
      : products
    : null;

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Products</h1>
        <Link to="/admin/products/new" className="btn btn-primary">
          Add Product
        </Link>
      </div>

      {error && <p className="state-message">Couldn't load products: {error}</p>}
      {actionError && <p className="form-field__error">{actionError}</p>}
      {!error && !products && <p className="state-message">Loading products...</p>}

      {products && (
        <>
          <label className="admin-filter-toggle">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(event) => toggleLowStockFilter(event.target.checked)}
            />
            Show low stock only (3 or fewer)
          </label>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.images[0] ? (
                        <img src={product.images[0].image_url} alt="" className="admin-table__thumb" />
                      ) : (
                        <span className="admin-table__thumb admin-table__thumb--empty" />
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category ?? "—"}</td>
                    <td>{product.price != null ? `$${product.price.toFixed(2)}` : "—"}</td>
                    <td>
                      <span className={stockClassName(product.stock)}>
                        {product.stock <= 0 ? "Out of stock" : product.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status-pill admin-status-pill--${product.status}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="admin-table__actions">
                      <Link to={`/admin/products/${product.id}/edit`} className="btn btn-ghost btn-sm">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleToggleStatus(product)}
                      >
                        {product.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm admin-table__delete"
                        onClick={() => handleDelete(product)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {visibleProducts.length === 0 && (
              <p className="state-message">No products match "low stock only" right now.</p>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminProducts;
