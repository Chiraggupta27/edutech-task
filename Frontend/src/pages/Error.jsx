import { Link, useLocation } from "react-router-dom";
import "./errorPage.css";

export default function ErrorPage({ title, message }) {
  const location = useLocation();

  const heading = title || "Something went wrong";
  const details =
    message ||
    "An unexpected error occurred. You can try refreshing, or go back to the dashboard.";

  return (
    <div className="errWrap">
      <div className="errCard card">
        <div className="errTitle">{heading}</div>
        <div className="errMsg muted">{details}</div>

        <div className="errMeta muted">
          <div>
            <span className="errKey">Path:</span>{" "}
            <span className="errVal">{location.pathname}</span>
          </div>
        </div>

        <div className="errActions">
          <button type="button" className="btn" onClick={() => window.location.reload()}>
            Refresh
          </button>
          <Link className="btn btn-primary" to="/dashboard">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

