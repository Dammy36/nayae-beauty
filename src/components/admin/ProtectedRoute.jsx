import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// Wraps any admin page: shows it only once we've confirmed the visitor
// is both logged in AND listed in the "admins" table. Anyone else gets
// sent to the login page. This is a UI convenience, not the real
// security boundary - the database's Row Level Security rules are what
// actually block a non-admin from reading or changing admin data, even
// if someone bypassed this check entirely.
function ProtectedRoute({ children }) {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="page">
        <p className="state-message">Checking access...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
