import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { usePageMeta } from "../../hooks/usePageMeta.js";

// Shared shell for every admin page: a sidebar for navigating between
// admin sections, plus a top bar showing who's logged in. Kept separate
// from the customer-facing Header/Footer entirely - the admin area is a
// different tool for a different audience.
function AdminLayout({ children }) {
  // One noindex covers every admin page, since they all render through
  // this shared shell - this is a private tool, not something that
  // should ever show up in a Google search result.
  usePageMeta("Admin | Nayaé Beauty", null, { noIndex: true });

  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/admin/login");
  }

  function navLinkClassName({ isActive }) {
    return isActive ? "admin-sidebar__link active" : "admin-sidebar__link";
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <p className="admin-sidebar__logo">Nayaé Beauty</p>
        <nav className="admin-sidebar__nav">
          <NavLink to="/admin" end className={navLinkClassName}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={navLinkClassName}>
            Products
          </NavLink>
          <NavLink to="/admin/orders" className={navLinkClassName}>
            Orders
          </NavLink>
          <NavLink to="/admin/bookings" className={navLinkClassName}>
            Bookings
          </NavLink>
        </nav>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <span>{user?.email}</span>
          <button type="button" className="btn btn-ghost" onClick={handleSignOut}>
            Log Out
          </button>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
