import { formatCurrency, pickColor } from "../utils/format";

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function DonutChart({ assets, total }) {
  let accumulated = 0;

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-64 h-64 relative">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <g transform="translate(100,100) rotate(-90)">
            {total <= 0 || assets.length === 0 ? (
              <circle
                r={RADIUS}
                cx="0"
                cy="0"
                fill="none"
                stroke="#e6e7eb"
                strokeWidth="40"
              />
            ) : (
              assets.map((a, i) => {
                const portion = a.value / total;
                const dash = portion * CIRCUMFERENCE;
                const gap = CIRCUMFERENCE - dash;
                const offset = -accumulated;
                accumulated += dash;
                return (
                  <circle
                    key={a.id}
                    r={RADIUS}
                    cx="0"
                    cy="0"
                    fill="none"
                    stroke={pickColor(i)}
                    strokeWidth="40"
                    strokeDasharray={`${dash} ${gap}`}
                    strokeDashoffset={offset}
                  />
                );
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
