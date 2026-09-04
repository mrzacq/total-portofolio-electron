import { formatCurrency, pickColor, sortByValueDesc } from "../utils/format";

export default function LegendAssets({ assets, total }) {
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
        {sortByValueDesc(assets).map((asset, i) => {
          const percent = total > 0 ? ((asset.value / total) * 100).toFixed(2) : "0.00";
          return (
            <li key={asset.id} className="flex items-start gap-3">
              <span
                className="mt-1 h-4 w-4 rounded-sm"
                style={{ backgroundColor: pickColor(i) }}
              ></span>

              <div>
                <p className="font-medium text-gray-800 leading-tight">
                  {asset.name}
                </p>
                <p className="text-sm text-gray-500">
                  {percent}% — {formatCurrency(asset.value)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
