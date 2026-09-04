export const formatCurrency = (v) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);

export const parseNumberInput = (str) => {
  if (!str) return 0;
  const cleaned = str.replace(/[^\d,.-]/g, "").replace(/,/g, ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

export const formatDateTime = (date) => {
  const d = new Date(date);
  const time = d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${time}, ${dateStr}`;
};

export const uid = () => "id_" + Math.random().toString(36).slice(2, 9);

const CHART_COLORS = [
  "#FF9F0A",
  "#E8B45C",
  "#4A9B8E",
  "#C97B63",
  "#7C93C9",
  "#A78BFA",
  "#D4A5A5",
  "#8FBF8F",
];

export const pickColor = (i) => CHART_COLORS[i % CHART_COLORS.length];

export const sortByValueDesc = (assets) =>
  [...assets].sort((a, b) => b.value - a.value);
