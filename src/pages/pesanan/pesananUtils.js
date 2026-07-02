export const STATUS_LABEL = {
  diterima:   "Belum Bayar",
  konfirmasi: "Konfirmasi",
  desain:     "Proses Desain",
  produksi:   "Produksi",
  qc:         "Quality Check",
  dikirim:    "Dikirim",
  selesai:    "Selesai",
};

export const STATUS_COLOR = {
  diterima:   { bg: "#FEF9C3", text: "#854D0E" },
  konfirmasi: { bg: "#FEF3C7", text: "#92400E" },
  desain:     { bg: "#EFF6FF", text: "#1D4ED8" },
  produksi:   { bg: "#F0FDF4", text: "#166534" },
  qc:         { bg: "#F5F3FF", text: "#6D28D9" },
  dikirim:    { bg: "#E0F2FE", text: "#0369A1" },
  selesai:    { bg: "#ECFDF5", text: "#065F46" },
};

export const STATUS_FLOW = [
  { id: "diterima",   label: "Pesanan Diterima" },
  { id: "konfirmasi", label: "Konfirmasi Pembayaran" },
  { id: "desain",     label: "Proses Desain" },
  { id: "produksi",   label: "Produksi" },
  { id: "qc",         label: "Quality Check" },
  { id: "dikirim",    label: "Dikirim" },
  { id: "selesai",    label: "Selesai" },
];

export const TABS = [
  { id: "semua",    label: "Semua" },
  { id: "diterima", label: "Belum Bayar" },
  { id: "desain",   label: "Desain" },
  { id: "produksi", label: "Produksi" },
  { id: "dikirim",  label: "Dikirim" },
  { id: "selesai",  label: "Selesai" },
];

export function getShirtFilter(hex) {
  if (!hex || hex === "#FFFFFF" || hex === "#ffffff") return "none";
  const presets = {
    "#1A1A1A": "brightness(0.15)",
    "#9CA3AF": "brightness(0.65) saturate(0)",
    "#1E3A5F": "brightness(0.25) sepia(1) hue-rotate(180deg) saturate(3)",
    "#C8392B": "brightness(0.4) sepia(1) hue-rotate(320deg) saturate(5)",
    "#6B2737": "brightness(0.25) sepia(1) hue-rotate(300deg) saturate(4)",
    "#6B7040": "brightness(0.35) sepia(1) hue-rotate(60deg) saturate(2)",
    "#F5F5DC": "brightness(0.97) sepia(0.15)",
    "#3B82F6": "brightness(0.5) sepia(1) hue-rotate(190deg) saturate(5)",
    "#10B981": "brightness(0.4) sepia(1) hue-rotate(120deg) saturate(5)",
    "#F59E0B": "brightness(0.6) sepia(1) hue-rotate(10deg) saturate(6)",
    "#EC4899": "brightness(0.5) sepia(1) hue-rotate(280deg) saturate(6)",
    "#7C3AED": "brightness(0.35) sepia(1) hue-rotate(240deg) saturate(6)",
    "#92400E": "brightness(0.3) sepia(1) hue-rotate(350deg) saturate(4)",
  };
  return presets[hex] || "brightness(0.5) sepia(1) saturate(3)";
}
