import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta.js";

function NotFound() {
  usePageMeta("Page Not Found | Nayaé Beauty", null, { noIndex: true });

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
