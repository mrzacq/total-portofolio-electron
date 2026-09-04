import { useEffect, useRef } from "react";
import { parseNumberInput } from "../utils/format";

export default function AssetForm({ editingAsset, onSubmit, onCancelEdit, onInvalid }) {
  const nameRef = useRef();
  const valueRef = useRef();
  const targetRef = useRef();

  const resetForm = () => {
    nameRef.current.value = "";
    valueRef.current.value = "";
    targetRef.current.value = "";
  };

  useEffect(() => {
    if (!editingAsset) return;
    nameRef.current.value = editingAsset.name;
    valueRef.current.value = editingAsset.value;
    targetRef.current.value = editingAsset.target ?? "";
  }, [editingAsset]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = nameRef.current.value.trim();
    const value = parseNumberInput(valueRef.current.value.trim());
    const target = targetRef.current.value
      ? Number(targetRef.current.value)
      : null;

    if (!name || !value) {
      onInvalid();
      return;
    }

    onSubmit({ id: editingAsset?.id, name, value, target });
    resetForm();
  };

  const handleClear = () => {
    resetForm();
    onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div className="tp-field">
        <label htmlFor="f-name">Nama Aset</label>
        <input
          id="f-name"
          ref={nameRef}
          type="text"
          required
          placeholder="Bitcoin, Saham BBCA, Emas"
        />
      </div>
      <div className="tp-field">
        <label htmlFor="f-value">Nilai Aset</label>
        <input
          id="f-value"
          ref={valueRef}
          type="text"
          inputMode="numeric"
          required
          placeholder="500.000.000"
        />
        <div className="tp-field-hint">
          Boleh pakai titik/koma ribuan, contoh: 10.000.000
        </div>
      </div>
      <div className="tp-field" style={{ marginBottom: 0 }}>
        <label htmlFor="f-target">
          Target Alokasi % <span style={{ color: "var(--tertiary)" }}>— opsional</span>
        </label>
        <input
          id="f-target"
          ref={targetRef}
          type="number"
          min="0"
          max="100"
          step="0.01"
          placeholder="20"
        />
      </div>

      <div className="tp-form-actions">
        <button type="submit" className="tp-btn tp-btn-primary">
          {editingAsset ? "Update" : "Tambah"}
        </button>
        <button type="button" onClick={handleClear} className="tp-btn tp-btn-ghost">
          Bersihkan
        </button>
      </div>
    </form>
  );
}
