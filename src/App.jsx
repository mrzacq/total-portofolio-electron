import { useState } from "react";
import AssetForm from "./components/AssetForm";
import PortfolioSummary from "./components/PortfolioSummary";
import DonutChart from "./components/DonutChart";
import LegendAssets from "./components/LegendAssets";
import TableAssets from "./components/TableAssets";
import DataActions from "./components/DataActions";
import { useAssets } from "./hooks/useAssets";
import { downloadJson, readJsonFile } from "./utils/file";

export default function App() {
  const {
    assets,
    lastUpdated,
    addOrUpdateAsset,
    deleteAsset,
    clearAssets,
    importAssets,
  } = useAssets();
  const [editingId, setEditingId] = useState(null);

  const total = assets.reduce((s, a) => s + (Number(a.value) || 0), 0);
  const editingAsset = assets.find((a) => a.id === editingId) ?? null;

  const handleSubmit = (asset) => {
    addOrUpdateAsset(asset);
    setEditingId(null);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (confirm("Apakah kamu ingin menghapus aset ini?")) deleteAsset(id);
  };

  const handleClearAll = () => {
    if (confirm("Hapus semua data?")) clearAssets();
  };

  const handleExport = () => downloadJson(assets, "portofolio.json");

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      importAssets(await readJsonFile(file));
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
            Tambah aset, simpan, lihat total & persentase visual (donut)
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-1 bg-white p-4 rounded-lg shadow">
            <h2 className="font-medium mb-3">
              {editingAsset ? "Edit Aset" : "Tambah / Edit Aset"}
            </h2>
            <AssetForm
              editingAsset={editingAsset}
              onSubmit={handleSubmit}
              onCancelEdit={() => setEditingId(null)}
            />

            <hr className="my-4" />

            <PortfolioSummary
              total={total}
              count={assets.length}
              lastUpdated={lastUpdated}
            />
          </section>

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
              <DataActions
                onClearAll={handleClearAll}
                onExport={handleExport}
                onImport={handleImport}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
