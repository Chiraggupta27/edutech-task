import "./modal.css";

export default function ConfirmModal({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  danger = false,
  loading = false
}) {
  if (!open) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="modalCard card">
        <div className="modalHead">
          <div className="modalTitle">{title}</div>
          <button type="button" className="modalX" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modalBody muted">{message}</div>
        <div className="modalActions">
          <button type="button" className="btn" onClick={onClose} disabled={loading}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${danger ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

