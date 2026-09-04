import { formatCurrency, formatDateTime } from "../utils/format";

export default function PortfolioSummary({ total, count, lastUpdated }) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Total Portofolio</h3>
      <div className="text-2xl font-semibold">{formatCurrency(total)}</div>
      <div className="text-xs text-slate-500 mt-1">{count} aset</div>
      <div className="text-xs text-slate-400 mt-1 italic">
        Terakhir diupdate: {lastUpdated ? formatDateTime(lastUpdated) : "-"}
      </div>
    </div>
  );
}
