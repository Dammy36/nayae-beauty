import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { getDashboardStats } from "../../lib/adminStats.js";

// Each card links to the admin page where that number can actually be
// acted on - a count alone isn't very useful without a way to get to
// the items behind it.
const STAT_CARDS = [
  { key: "totalProducts", label: "Total Products", to: "/admin/products" },
  { key: "lowStockProducts", label: "Low Stock Products", to: "/admin/products?filter=low-stock" },
  { key: "totalOrders", label: "Total Orders", to: "/admin/orders" },
  { key: "pendingOrders", label: "Pending Orders", to: "/admin/orders" },
  { key: "totalBookings", label: "Total Bookings", to: "/admin/bookings" },
  { key: "upcomingBookings", label: "Upcoming Bookings", to: "/admin/bookings" },
];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    getDashboardStats()
      .then((data) => {
        if (!isCancelled) setStats(data);
      })
      .catch((err) => {
        if (!isCancelled) setError(err.message);
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <AdminLayout>
      <h1>Dashboard</h1>

      {error && <p className="state-message">Couldn't load dashboard stats: {error}</p>}
      {!error && !stats && <p className="state-message">Loading stats...</p>}

      {stats && (
        <div className="admin-stat-grid">
          {STAT_CARDS.map((card) => (
            <Link key={card.key} to={card.to} className="admin-stat-card">
              <span className="admin-stat-card__value">{stats[card.key]}</span>
              <span className="admin-stat-card__label">{card.label}</span>
            </Link>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;
