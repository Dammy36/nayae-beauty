import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page">
      <h1>Page Not Found</h1>
      <p>
        <Link to="/">Go back home</Link>
      </p>
    </div>
  );
}

export default NotFound;
