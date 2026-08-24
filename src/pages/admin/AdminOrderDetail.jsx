import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { getOrder, markOrderPaid, cancelOrder, updateOrderStatus } from "../../lib/adminOrders.js";

function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  function loadOrder() {
    getOrder(id)
      .then(setOrder)
      .catch((err) => setError(err.message));
  }

  useEffect(loadOrder, [id]);

  async function handleMarkPaid() {
    setActionError(null);
    setIsSaving(true);
    try {
      await markOrderPaid(id);
      loadOrder();
    } catch (err) {
      // e.g. "Not enough stock left for ... to confirm this order."
      setActionError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCancel() {
    const confirmed = window.confirm(
      "Cancel this order? If it was already marked Paid, the stock it used will be added back."
    );
    if (!confirmed) return;

    setActionError(null);
    setIsSaving(true);
    try {
      await cancelOrder(id);
      loadOrder();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusChange(event) {
    setActionError(null);
    setIsSaving(true);
    try {
      await updateOrderStatus(id, event.target.value);
      loadOrder();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  if (error) {
    return (
      <AdminLayout>
        <p className="state-message">Couldn't load this order: {error}</p>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <p className="state-message">Loading order...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Link to="/admin/orders" className="admin-back-link">
        &larr; Back to Orders
      </Link>

      <div className="admin-page-header">
        <h1>Order #{order.id}</h1>
        <span className={`admin-status-pill admin-status-pill--payment-${order.payment_status.toLowerCase()}`}>
          {order.payment_status}
        </span>
      </div>

      <div className="admin-order-layout">
        <div className="admin-order-details">
          <h2>Customer</h2>
          <p>{order.customer_name}</p>
          <p>Phone: {order.phone}</p>
          <p>WhatsApp: {order.whatsapp_number}</p>
          {order.email && <p>Email: {order.email}</p>}
          <p>
            {order.fulfillment_method === "delivery" ? "Local Delivery" : "Pickup"}
            {order.delivery_address && ` — ${order.delivery_address}`}
          </p>
          <p className="admin-order-details__date">Placed {formatDateTime(order.created_at)}</p>

          <h2>Items</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.product_name}
                    {item.shade ? ` (${item.shade})` : ""}
                  </td>
                  <td>{item.quantity}</td>
                  <td>{item.line_total != null ? `$${item.line_total.toFixed(2)}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="admin-order-total">
            Total: {order.total != null ? `$${order.total.toFixed(2)} CAD` : "Price coming soon"}
          </p>
        </div>

        <div className="admin-order-actions">
          <h2>Status</h2>
          <p>
            Order status: <strong>{order.order_status}</strong>
          </p>

          {actionError && <p className="form-field__error">{actionError}</p>}

          {order.payment_status === "Pending" && (
            <>
              <button type="button" className="btn btn-primary" onClick={handleMarkPaid} disabled={isSaving}>
                {isSaving ? "Saving..." : "Mark as Paid"}
              </button>
              <button type="button" className="btn btn-ghost admin-table__delete" onClick={handleCancel} disabled={isSaving}>
                Cancel Order
              </button>
            </>
          )}

          {order.payment_status === "Paid" && (
            <>
              <div className="form-field">
                <label htmlFor="order-status">Update Order Status</label>
                <select id="order-status" value={order.order_status} onChange={handleStatusChange} disabled={isSaving}>
                  <option value="Paid">Paid</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button type="button" className="btn btn-ghost admin-table__delete" onClick={handleCancel} disabled={isSaving}>
                Cancel Order
              </button>
            </>
          )}

          {order.payment_status === "Cancelled" && <p>This order has been cancelled.</p>}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOrderDetail;
