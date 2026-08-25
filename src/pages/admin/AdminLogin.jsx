import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { usePageMeta } from "../../hooks/usePageMeta.js";

function AdminLogin() {
  usePageMeta("Admin Login | Nayaé Beauty", null, { noIndex: true });

  const { user, isAdmin, isLoading, signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Already logged in as an admin? Skip straight to the dashboard
  // instead of showing the login form again.
  if (!isLoading && user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate("/admin");
    } catch (submitError) {
      setError("Incorrect email or password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <h1>Nayaé Beauty Admin</h1>
        <p className="admin-login__subtitle">Log in to manage products, orders, and bookings.</p>

        <div className="form-field">
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p className="form-field__error">{error}</p>}

        <button type="submit" className="btn btn-primary admin-login__submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging In..." : "Log In"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
