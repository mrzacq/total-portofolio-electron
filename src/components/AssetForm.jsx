import { useEffect, useRef } from "react";
import { parseNumberInput } from "../utils/format";

export default function AssetForm({ editingAsset, onSubmit, onCancelEdit }) {
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

    if (!name) return alert("Isi nama dan nilai aset dengan benar.");

    onSubmit({ id: editingAsset?.id, name, value, target });
    resetForm();
  };

  const handleClear = () => {
    resetForm();
    onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-sm block mb-1">Nama Aset</label>
        <input
          ref={nameRef}
          type="text"
          required
          placeholder="contoh: Bitcoin, Saham BBCA, Emas"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
        />
      </div>
      <div>
        <label className="text-sm block mb-1">Nilai Aset (angka)</label>
        <input
          ref={valueRef}
          type="text"
          inputMode="numeric"
          required
          placeholder="500000000 atau 10.000.000"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
        />
      </div>
      <div>
        <label className="text-sm block mb-1">
          Target Alokasi (%) — opsional
        </label>
        <input
          ref={targetRef}
          type="number"
          min="0"
          max="100"
          step="0.01"
          placeholder="misal: 20"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {editingAsset ? "Update" : "Tambah"}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
        >
          Bersihkan Form
        </button>
      </div>
    </form>
  );
}
