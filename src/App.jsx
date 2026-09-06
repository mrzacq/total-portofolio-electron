import { useEffect, useRef, useState } from "react";
import AssetForm from "./components/AssetForm";
import PortfolioSummary from "./components/PortfolioSummary";
import DonutChart from "./components/DonutChart";
import LegendAssets from "./components/LegendAssets";
import TableAssets from "./components/TableAssets";
import DataActions from "./components/DataActions";
import Toast from "./components/Toast";
import ConfirmModal from "./components/ConfirmModal";
import TopUpModal from "./components/TopUpModal";
import { useAssets } from "./hooks/useAssets";
import { downloadJson, readJsonFile } from "./utils/file";
import { sortByValueDesc } from "./utils/format";

export default function App() {
  const {
    assets,
    lastUpdated,
    addOrUpdateAsset,
    topUpAsset,
    deleteAsset,
    clearAssets,
    importAssets,
  } = useAssets();
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ message: "", isError: false, visible: false });
  const [confirmState, setConfirmState] = useState({ open: false });
  const [topUpState, setTopUpState] = useState({ open: false, asset: null });
  const toastTimer = useRef();

  const total = assets.reduce((s, a) => s + (Number(a.value) || 0), 0);
  const editingAsset = assets.find((a) => a.id === editingId) ?? null;
  const sortedAssets = sortByValueDesc(assets);

  const showToast = (message, isError = false) => {
    clearTimeout(toastTimer.current);
    setToast({ message, isError, visible: true });
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      2800
    );
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setConfirmState({ open: false });
        setTopUpState({ open: false, asset: null });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const askConfirm = (title, body, onConfirm) => {
    setConfirmState({ open: true, title, body, onConfirm });
  };
  const closeConfirm = () => setConfirmState({ open: false });

  const handleSubmit = (asset) => {
    const isEdit = Boolean(asset.id);
    addOrUpdateAsset(asset);
    setEditingId(null);
    showToast(isEdit ? "Aset diperbarui." : "Aset ditambahkan.");
  };

  const handleEdit = (id) => {
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTopUp = (id) => {
    const asset = assets.find((a) => a.id === id);
    if (!asset) return;
    setTopUpState({ open: true, asset });
  };

  const closeTopUp = () => setTopUpState({ open: false, asset: null });

  const handleTopUpConfirm = (amount) => {
    topUpAsset(topUpState.asset.id, amount);
    showToast(`Top up ${topUpState.asset.name} berhasil.`);
    closeTopUp();
  };

  const handleDelete = (id) => {
    const asset = assets.find((a) => a.id === id);
    askConfirm("Hapus Aset", `Hapus "${asset?.name}" dari portofolio?`, () => {
      deleteAsset(id);
      if (editingId === id) setEditingId(null);
      closeConfirm();
      showToast("Aset dihapus.");
    });
  };

  const handleClearAll = () => {
    if (assets.length === 0) return;
    askConfirm(
      "Hapus Semua Data",
      "Semua aset akan dihapus permanen dari perangkat ini. Lanjutkan?",
      () => {
        clearAssets();
        setEditingId(null);
        closeConfirm();
        showToast("Semua data dihapus.");
      }
    );
  };

  const handleExport = () => {
    downloadJson(assets, "holdings.json");
    showToast("Portofolio diexport.");
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await readJsonFile(file);
      importAssets(data);
      showToast(`${data.length} aset diimport.`);
    } catch (err) {
      showToast("Gagal import: " + err.message, true);
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="tp-shell">
      <header className="tp-header">
        <div>
          <h1>
            <span className="tp-accent-dot"></span>Holdings
          </h1>
          <p>Catat aset, lihat total kekayaan, dan pantau alokasi terhadap target.</p>
        </div>
      </header>

      <main className="tp-layout">
        <div>
          <section className="tp-panel">
            <h2 className="tp-panel-title">{editingAsset ? "Edit Aset" : "Tambah Aset"}</h2>
            <AssetForm
              editingAsset={editingAsset}
              onSubmit={handleSubmit}
              onCancelEdit={() => setEditingId(null)}
              onInvalid={() => showToast("Isi nama dan nilai aset dengan benar.", true)}
            />
          </section>

          <section className="tp-panel">
            <h2 className="tp-panel-title">Total Portofolio</h2>
            <PortfolioSummary total={total} count={assets.length} lastUpdated={lastUpdated} />
          </section>
        </div>

        <div>
          <section className="tp-panel">
            <h2 className="tp-panel-title">Distribusi Aset</h2>
            {sortedAssets.length === 0 ? (
              <div className="tp-empty-state">Belum ada data aset.</div>
            ) : (
              <div className="tp-allocation-grid">
                <DonutChart assets={sortedAssets} total={total} />
                <LegendAssets assets={sortedAssets} total={total} />
              </div>
            )}
          </section>

          <section className="tp-panel">
            <h2 className="tp-panel-title">Rincian Kepemilikan</h2>
            <TableAssets
              assets={sortedAssets}
              total={total}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onTopUp={handleTopUp}
            />
            <DataActions
              onClearAll={handleClearAll}
              onExport={handleExport}
              onImport={handleImport}
            />
          </section>
        </div>
      </main>

      <Toast message={toast.message} isError={toast.isError} visible={toast.visible} />
      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        body={confirmState.body}
        onCancel={closeConfirm}
        onConfirm={confirmState.onConfirm}
      />
      <TopUpModal
        open={topUpState.open}
        asset={topUpState.asset}
        onCancel={closeTopUp}
        onConfirm={handleTopUpConfirm}
      />
    </div>
  );
}
