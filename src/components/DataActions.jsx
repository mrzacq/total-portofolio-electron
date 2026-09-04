export default function DataActions({ onClearAll, onExport, onImport }) {
  return (
    <div className="mt-4 flex gap-2">
      <button
        onClick={onClearAll}
        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Hapus Semua
      </button>
      <button
        onClick={onExport}
        className="px-3 py-2 bg-slate-200 rounded hover:bg-slate-300"
      >
        Export JSON
      </button>
      <label className="px-3 py-2 bg-slate-200 rounded hover:bg-slate-300 cursor-pointer">
        Import JSON
        <input
          type="file"
          accept=".json"
          onChange={onImport}
          className="hidden"
        />
      </label>
    </div>
  );
}
