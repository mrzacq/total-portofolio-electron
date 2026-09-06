import { useEffect, useState } from "react";
import { uid } from "../utils/format";

const STORAGE_KEY = "tp_assets_v1";
const LAST_UPDATED_KEY = "tp_assets_last_updated";

export function useAssets() {
  const [assets, setAssets] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

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

  const addOrUpdateAsset = ({ id, name, value, target }) => {
    if (id) {
      saveAssets(
        assets.map((a) => (a.id === id ? { ...a, name, value, target } : a))
      );
    } else {
      saveAssets([...assets, { id: uid(), name, value, target }]);
    }
  };

  const topUpAsset = (id, amount) =>
    saveAssets(
      assets.map((a) =>
        a.id === id ? { ...a, value: (Number(a.value) || 0) + amount } : a
      )
    );

  const deleteAsset = (id) => saveAssets(assets.filter((a) => a.id !== id));

  const clearAssets = () => saveAssets([]);

  const importAssets = (data) => {
    const merged = assets.concat(
      data.map((d) => ({
        id: uid(),
        name: d.name,
        value: Number(d.value),
        target: Number(d.target) || null,
      }))
    );
    saveAssets(merged);
  };

  return {
    assets,
    lastUpdated,
    addOrUpdateAsset,
    topUpAsset,
    deleteAsset,
    clearAssets,
    importAssets,
  };
}
