import { formatCurrency, pickColor } from "../utils/format";

const RADIUS = 78;
const STROKE = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function DonutChart({ assets, total }) {
  let accumulated = 0;

  return (
    <div className="tp-donut-wrap">
      <svg viewBox="0 0 200 200">
        <g transform="translate(100,100) rotate(-90)">
          {total <= 0 || assets.length === 0 ? (
            <circle
              r={RADIUS}
              cx="0"
              cy="0"
              fill="none"
              stroke="var(--border)"
              strokeWidth={STROKE}
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
                  strokeWidth={STROKE}
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={offset}
                />
              );
            })
          )}
        </g>
      </svg>
      <div className="tp-donut-center">
        <span className="label">Total</span>
        <span className="value">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
