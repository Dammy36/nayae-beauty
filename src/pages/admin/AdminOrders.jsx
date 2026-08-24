import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { getAllOrders } from "../../lib/adminOrders.js";

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
}

function AdminOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <AdminLayout>
      <h1>Orders</h1>

      {error && <p className="state-message">Couldn't load orders: {error}</p>}
      {!error && !orders && <p className="state-message">Loading orders...</p>}
      {orders && orders.length === 0 && <p className="state-message">No orders yet.</p>}

      {orders && orders.length > 0 && (
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
              {orders.map((order) => (
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
