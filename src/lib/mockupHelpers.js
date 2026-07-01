// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — SHARED MOCKUP HELPERS
//  Dipakai oleh: CustomBuilder (DesignCanvas, MockupKaos, PreviewKonfirmasi),
//  Keranjang, Checkout, Pesanan
// ═══════════════════════════════════════════════════════════

// ── Filter warna kaos (CSS filter preset per hex) ──────────────
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

// ── Path mockup foto kaos per produk ────────────────────────────
export const MOCKUP_MAP = {
  "lengan-pendek":  { front: "/mockup-pendek.png",  back: "/mockup-pendek-belakang.png"  },
  "lengan-panjang": { front: "/mockup-panjang.png", back: "/mockup-panjang-belakang.png" },
  "rib":            { front: "/mockup-rib.png",     back: "/mockup-rib-belakang.png"     },
};

// ── Batas area cetak maksimal (≈ ukuran A4) dalam % terhadap canvas ──
// CATATAN: nilai ini perkiraan awal. Sesuaikan visual di browser kalau
// kotak putus-putus di DesignCanvas belum pas dengan mockup kaos.
export const PRINT_AREA = {
  left: 25,
  top: 18,
  right: 75,
  bottom: 68,
};
