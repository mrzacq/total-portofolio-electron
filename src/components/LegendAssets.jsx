import { formatCurrency, pickColor } from "../utils/format";

export default function LegendAssets({ assets, total }) {
  if (assets.length === 0)
    return <div className="tp-empty-state">Belum ada data aset.</div>;

  return (
    <ul className="tp-legend">
      {assets.map((asset, i) => {
        const percent = total > 0 ? ((asset.value / total) * 100).toFixed(2) : "0.00";
        return (
          <li key={asset.id}>
            <span className="tp-swatch" style={{ backgroundColor: pickColor(i) }}></span>
            <span className="name">{asset.name}</span>
            <span className="pct">{percent}%</span>
          </li>
        );
      })}
    </ul>
  );
}
