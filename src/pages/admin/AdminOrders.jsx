import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { getAllOrders } from "../../lib/adminOrders.js";

const FILTERS = {
  active: {
    label: "Active",
    match: (order) => order.order_status !== "Completed" && order.order_status !== "Cancelled",
  },
  completed: { label: "Completed", match: (order) => order.order_status === "Completed" },
  cancelled: { label: "Cancelled", match: (order) => order.order_status === "Cancelled" },
  all: { label: "All", match: () => true },
};

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
}

function AdminOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("active");

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .catch((err) => setError(err.message));
  }, []);

  // Nothing is deleted here - "clearing" an order just moves it out of
  // the default Active view once it's Completed or Cancelled. The full
  // history is always one click away under the All tab.
  const visibleOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(FILTERS[filter].match);
  }, [orders, filter]);

  return (
    <AdminLayout>
      <h1>Orders</h1>

      {orders && (
        <div className="admin-filter-tabs">
          {Object.entries(FILTERS).map(([key, { label }]) => (
            <button
              key={key}
              type="button"
              className={`admin-filter-tabs__tab ${filter === key ? "admin-filter-tabs__tab--active" : ""}`.trim()}
              onClick={() => setFilter(key)}
            >
              {label}
              <span className="admin-filter-tabs__count">{orders.filter(FILTERS[key].match).length}</span>
            </button>
          ))}
        </div>
      )}

      {error && <p className="state-message">Couldn't load orders: {error}</p>}
      {!error && !orders && <p className="state-message">Loading orders...</p>}
      {orders && orders.length === 0 && <p className="state-message">No orders yet.</p>}
      {orders && orders.length > 0 && visibleOrders.length === 0 && (
        <p className="state-message">No {FILTERS[filter].label.toLowerCase()} orders.</p>
      )}

      {visibleOrders.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.itemCount}</td>
                  <td>{order.total != null ? `$${order.total.toFixed(2)}` : "—"}</td>
                  <td>
                    <span className={`admin-status-pill admin-status-pill--payment-${order.payment_status.toLowerCase()}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td>{order.order_status}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>
                    <Link to={`/admin/orders/${order.id}`} className="btn btn-ghost btn-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminOrders;
