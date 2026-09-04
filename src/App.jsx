import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "tp_assets_v1";
const LAST_UPDATED_KEY = "tp_assets_last_updated";

const formatCurrency = (v) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);

const parseNumberInput = (str) => {
  if (!str) return 0;
  const cleaned = str.replace(/[^\d,.-]/g, "").replace(/,/g, ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

const formatDateTime = (date) => {
  const d = new Date(date);
  const options = { hour: "2-digit", minute: "2-digit" };
  const time = d.toLocaleTimeString("id-ID", options);
  const dateStr = d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${time}, ${dateStr}`;
};

const uid = () => "id_" + Math.random().toString(36).slice(2, 9);
const pickColor = (i) => `hsl(${(i * 47) % 360} 70% 50%)`;

export default function App() {
  const [assets, setAssets] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [editing, setEditing] = useState(null);
  const nameRef = useRef();
  const valueRef = useRef();
  const targetRef = useRef();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    setAssets(Array.isArray(parsed) ? parsed : []);
    const last = localStorage.getItem(LAST_UPDATED_KEY);
    if (last) setLastUpdated(last);
  }, []);

  const saveAssets = (newAssets) => {
    const now = new Date().toISOString();
    setAssets(newAssets);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAssets));
    localStorage.setItem(LAST_UPDATED_KEY, now);
    setLastUpdated(now);
  };

  const total = assets.reduce((s, a) => s + (Number(a.value) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = nameRef.current.value.trim();
    const value = parseNumberInput(valueRef.current.value.trim());
    const target = targetRef.current.value
      ? Number(targetRef.current.value)
      : null;

    if (!name) return alert("Isi nama dan nilai aset dengan benar.");

    let newAssets;
    if (editing) {
      newAssets = assets.map((a) =>
        a.id === editing ? { ...a, name, value, target } : a
      );
    } else {
      newAssets = [...assets, { id: uid(), name, value, target }];
    }

    saveAssets(newAssets);
    e.target.reset();
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (confirm("Apakah kamu ingin menghapus aset ini?")) {
      saveAssets(assets.filter((x) => x.id !== id));
    }
  };

  const handleEdit = (id) => {
    const asset = assets.find((x) => x.id === id);
    if (!asset) return;
    nameRef.current.value = asset.name;
    valueRef.current.value = asset.value;
    targetRef.current.value = asset.target ?? "";
    setEditing(asset.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearAll = () => {
    if (confirm("Hapus semua data?")) {
      saveAssets([]);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(assets, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portofolio.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data)) throw new Error("Format JSON tidak valid");
      const merged = assets.concat(
        data.map((d) => ({
          id: uid(),
          name: d.name,
          value: Number(d.value),
          target: Number(d.target) || null,
        }))
      );
      saveAssets(merged);
    } catch (err) {
      alert("Gagal import: " + err.message);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6">
      <div className="container mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Total Portofolio</h1>
          <p className="text-sm text-slate-600">
            Tambah aset, simpan, lihat total & persentase visual
            (donut)
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FORM */}
          <section className="lg:col-span-1 bg-white p-4 rounded-lg shadow">
            <h2 className="font-medium mb-3">
              {editing ? "Edit Aset" : "Tambah / Edit Aset"}
            </h2>
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
                  {editing ? "Update" : "Tambah"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    nameRef.current.value = "";
                    valueRef.current.value = "";
                    targetRef.current.value = "";
                    setEditing(null);
                  }}
                  className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
                >
                  Bersihkan Form
                </button>
              </div>
            </form>

            <hr className="my-4" />

            <div>
              <h3 className="text-sm font-medium mb-2">Total Portofolio</h3>
              <div className="text-2xl font-semibold">
                {formatCurrency(total)}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {assets.length} aset
              </div>
              <div className="text-xs text-slate-400 mt-1 italic">
                Terakhir diupdate:{" "}
                {lastUpdated ? formatDateTime(lastUpdated) : "-"}
              </div>
            </div>
          </section>

          {/* CHART + TABLE */}
          <section className="lg:col-span-2 bg-white p-4 rounded-lg shadow flex flex-col">
            <h2 className="font-medium mb-3">Visualisasi & Rincian</h2>
            <div className="flex flex-col lg:items-start lg:flex-row gap-6">
              <DonutChart assets={assets} total={total} />
              <div className="flex-1 space-y-4">
                <LegendAssets assets={assets} total={total} />
              </div>
            </div>

            <div className="border shadow mt-4 rounded-lg p-4">
              <TableAssets
                assets={assets}
                total={total}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleClearAll}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Hapus Semua
                </button>
                <button
                  onClick={handleExport}
                  className="px-3 py-2 bg-slate-200 rounded hover:bg-slate-300"
                >
                  Export JSON
                </button>
                <label className="px-3 py-2 bg-slate-200 rounded hover:bg-slate-300 cursor-pointer">
                  Import JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function TableAssets({ assets, total, onDelete, onEdit }) {
  if (assets.length === 0)
    return (
      <div className="text-sm text-slate-500 mt-2">Belum ada data aset.</div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-slate-600">
          <tr>
            <th className="py-2">Aset</th>
            <th className="py-2">Nilai</th>
            <th className="py-2">% dari Total</th>
            <th className="py-2">Target %</th>
            <th className="py-2">Selisih Target</th>
            <th className="py-2">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {[...assets]
            .sort((a, b) => b.value - a.value)
            ?.map((a) => {
              const pct = total > 0 ? (a.value / total) * 100 : 0;
              let selisihText = "-";
              if (a.target != null && total > 0) {
                const targetValue = (a.target / 100) * total;
                const selisih = a.value - targetValue;
                selisihText = (
                  <span
                    className={selisih >= 0 ? "text-green-600" : "text-red-600"}
                  >
                    {selisih >= 0 ? "+" : ""}
                    {formatCurrency(selisih)}
                  </span>
                );
              }

              return (
                <tr key={a.id}>
                  <td className="py-2 pr-4">{a.name}</td>
                  <td className="py-2 pr-4 font-medium">
                    {formatCurrency(a.value)}
                  </td>
                  <td className="py-2 pr-4">{pct.toFixed(2)}%</td>
                  <td className="py-2 pr-4">
                    {a.target ? a.target.toFixed(2) + "%" : "-"}
                  </td>
                  <td className="py-2 pr-4">{selisihText}</td>
                  <td className="py-2 pr-4">
                    <button
                      onClick={() => onDelete(a.id)}
                      className="text-sm text-red-600 hover:underline mr-2"
                    >
                      Hapus
                    </button>
                    <button
                      onClick={() => onEdit(a.id)}
                      className="text-sm text-sky-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

function LegendAssets({ assets, total }) {
  if (assets.length === 0)
    return (
      <div className="text-sm text-slate-500 mt-2">Belum ada data aset.</div>
    );

  return (
    <div className="rounded-lg border bg-white p-4 shadow">
      <h3 className="mb-3 text-lg font-semibold text-gray-800">
        Legend & Rincian
      </h3>

      <ul className="space-y-3">
        {[...assets]
          .sort((a, b) => b.value - a.value)
          ?.map((asset, i) => {
            const percent = ((asset.value / total) * 100).toFixed(2);
            return (
              <li key={i} className="flex items-start gap-3">
                {/* Kotak warna */}
                <span
                  className="mt-1 h-4 w-4 rounded-sm"
                  style={{ backgroundColor: pickColor(i) }}
                ></span>

                {/* Detail aset */}
                <div>
                  <p className="font-medium text-gray-800 leading-tight">
                    {asset.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {percent}% —{" "}
                    {asset.value.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

function DonutChart({ assets, total }) {
  const r = 70;
  const circumference = 2 * Math.PI * r;
  let accumulated = 0;

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-64 h-64 relative">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <g transform="translate(100,100) rotate(-90)">
            {total <= 0 || assets.length === 0 ? (
              <circle
                r={r}
                cx="0"
                cy="0"
                fill="none"
                stroke="#e6e7eb"
                strokeWidth="40"
              />
            ) : (
              assets.map((a, i) => {
                const portion = a.value / total;
                const dash = portion * circumference;
                const gap = circumference - dash;
                const circle = (
                  <circle
                    key={a.id}
                    r={r}
                    cx="0"
                    cy="0"
                    fill="none"
                    stroke={pickColor(i)}
                    strokeWidth="40"
                    strokeDasharray={`${dash} ${gap}`}
                    strokeDashoffset={-accumulated}
                  />
                );
                accumulated += dash;
                return circle;
              })
            )}
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-xs text-slate-500">Total</div>
          <div className="text-xs font-semibold">{formatCurrency(total)}</div>
        </div>
      </div>
    </div>
  );
}
