import "./loader.css";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="loaderWrap" role="status" aria-live="polite">
      <div className="spinner" />
      <div className="muted">{label}</div>
    </div>
  );
}

