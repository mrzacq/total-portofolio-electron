import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { formatCurrency } from "../utils/format";

export default function TableAssets({ assets, total, onDelete, onEdit, onTopUp }) {
  if (assets.length === 0)
    return (
      <div className="tp-empty-state">
        Belum ada data aset. Tambahkan lewat form di sebelah kiri.
      </div>
    );

  return (
    <div className="tp-table-scroll">
      <table className="tp-table">
        <thead>
          <tr>
            <th>Aset</th>
            <th>Nilai</th>
            <th>% Total</th>
            <th>Target</th>
            <th>Selisih Target</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a) => {
            const pct = total > 0 ? (a.value / total) * 100 : 0;
            const hasTarget = a.target != null && total > 0;
            const selisih = hasTarget ? a.value - (a.target / 100) * total : 0;

            return (
              <tr key={a.id}>
                <td className="name">{a.name}</td>
                <td className="mono">{formatCurrency(a.value)}</td>
                <td className="mono">{pct.toFixed(2)}%</td>
                <td>
                  {a.target ? (
                    <span className="tp-target-tag">{a.target.toFixed(2)}%</span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="mono">
                  {hasTarget ? (
                    <span className={selisih >= 0 ? "tp-diff-pos" : "tp-diff-neg"}>
                      {selisih >= 0 ? "+" : ""}
                      {formatCurrency(selisih)}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="tp-actions-cell">
                  <button
                    onClick={() => onTopUp(a.id)}
                    className="tp-link-btn topup"
                  >
                    <PlusCircle size={14} />
                    Top Up
                  </button>
                  <button
                    onClick={() => onEdit(a.id)}
                    className="tp-link-btn edit"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(a.id)}
                    className="tp-link-btn delete"
                  >
                    <Trash2 size={14} />
                    Hapus
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
