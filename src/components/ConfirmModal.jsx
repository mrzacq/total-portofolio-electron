export default function ConfirmModal({ open, title, body, confirmLabel, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div
      className="tp-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="tp-modal">
        <h3>{title}</h3>
        <p>{body}</p>
        <div className="tp-modal-actions">
          <button className="tp-btn tp-btn-ghost tp-btn-sm" onClick={onCancel}>
            Batal
          </button>
          <button className="tp-btn tp-btn-danger tp-btn-sm" onClick={onConfirm}>
            {confirmLabel ?? "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
