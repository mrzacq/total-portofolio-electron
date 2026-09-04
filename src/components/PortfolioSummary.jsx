import { formatCurrency, formatDateTime } from "../utils/format";

export default function PortfolioSummary({ total, count, lastUpdated }) {
  return (
    <div>
      <div className="tp-summary-total">{formatCurrency(total)}</div>
      <div className="tp-summary-row">
        <span><span className="count">{count}</span> aset tercatat</span>
        <span>{lastUpdated ? formatDateTime(lastUpdated) : "belum ada perubahan"}</span>
      </div>
    </div>
  );
}
