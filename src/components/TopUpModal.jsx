import { useEffect, useRef } from "react";
import { parseNumberInput, formatCurrency } from "../utils/format";

export default function TopUpModal({ open, asset, onCancel, onConfirm }) {
  const amountRef = useRef();

  useEffect(() => {
    if (open && amountRef.current) {
      amountRef.current.value = "";
      amountRef.current.focus();
    }
  }, [open]);

  if (!open || !asset) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseNumberInput(amountRef.current.value.trim());
    if (!amount) return;
    onConfirm(amount);
  };

  return (
    <div
      className="tp-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="tp-modal">
        <h3>Top Up Aset</h3>
        <p>
          Tambah nilai untuk <strong>{asset.name}</strong> (saat ini{" "}
          {formatCurrency(asset.value)}).
        </p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="tp-field" style={{ marginBottom: 0 }}>
            <label htmlFor="topup-amount">Jumlah Top Up</label>
            <input
              id="topup-amount"
              ref={amountRef}
              type="text"
              inputMode="numeric"
              required
              placeholder="5.000.000"
            />
          </div>
          <div className="tp-modal-actions" style={{ marginTop: 20 }}>
            <button type="button" className="tp-btn tp-btn-ghost tp-btn-sm" onClick={onCancel}>
              Batal
            </button>
            <button type="submit" className="tp-btn tp-btn-primary tp-btn-sm">
              Top Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
