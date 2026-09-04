export default function DataActions({ onClearAll, onExport, onImport }) {
  return (
    <div className="tp-table-toolbar">
      <button onClick={onClearAll} className="tp-btn tp-btn-danger tp-btn-sm">
        Hapus Semua
      </button>
      <button onClick={onExport} className="tp-btn tp-btn-ghost tp-btn-sm">
        Export JSON
      </button>
      <label className="tp-btn tp-btn-ghost tp-btn-sm tp-import-label">
        Import JSON
        <input type="file" accept=".json" onChange={onImport} />
      </label>
    </div>
  );
}
