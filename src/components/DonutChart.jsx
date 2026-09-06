import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency, pickColor } from "../utils/format";

export default function DonutChart({ assets, total }) {
  const isEmpty = total <= 0 || assets.length === 0;

  return (
    <div className="flex flex-col items-center">
      <div className="tp-donut-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={isEmpty ? [{ id: "empty", name: "Kosong", value: 1 }] : assets}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={!isEmpty}
            >
              {(isEmpty ? [{ id: "empty" }] : assets).map((a, i) => (
                <Cell key={a.id} fill={isEmpty ? "var(--border)" : pickColor(i)} />
              ))}
            </Pie>
            {!isEmpty && (
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  background: "var(--card-raised)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 13,
                }}
                labelStyle={{ color: "var(--secondary)" }}
                itemStyle={{ color: "var(--primary)" }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col items-center mt-3">
        <span className="label">Total</span>
        <span className="value">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
