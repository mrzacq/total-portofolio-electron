import { formatCurrency, sortByValueDesc } from "../utils/format";

export default function TableAssets({ assets, total, onDelete, onEdit }) {
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
          {sortByValueDesc(assets).map((a) => {
            const pct = total > 0 ? (a.value / total) * 100 : 0;
            const hasTarget = a.target != null && total > 0;
            const selisih = hasTarget ? a.value - (a.target / 100) * total : 0;

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
                <td className="py-2 pr-4">
                  {hasTarget ? (
                    <span
                      className={selisih >= 0 ? "text-green-600" : "text-red-600"}
                    >
                      {selisih >= 0 ? "+" : ""}
                      {formatCurrency(selisih)}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
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
