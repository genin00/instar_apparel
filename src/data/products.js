// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — DATA PRODUK
//  Tambah / edit / hapus produk di sini
// ═══════════════════════════════════════════════════════════

const products = [
  {
    id:          "lengan-pendek",
    nama:        "Kaos Lengan Pendek",
    deskripsi:   "Kaos custom lengan pendek dengan bahan premium, nyaman dipakai seharian.",
    harga:       95000,
    mockup:      "/mockup-pendek.png",   // ← taruh file di public/
    badge:       "Terlaris",
    tersedia:    true,
  },
  {
    id:          "lengan-panjang",
    nama:        "Kaos Lengan Panjang",
    deskripsi:   "Kaos custom lengan panjang, cocok untuk event, komunitas, dan seragam.",
    harga:       145000,
    mockup:      "/mockup-panjang.png",  // ← taruh file di public/
    badge:       null,
    tersedia:    true,
  },
  {
    id:          "rib",
    nama:        "Kaos Rib",
    deskripsi:   "Kaos custom bahan rib premium, stretch dan memeluk tubuh dengan sempurna.",
    harga:       120000,
    mockup:      "/mockup-rib.png",      // ← taruh file di public/
    badge:       "Baru",
    tersedia:    true,
  },
];

// ── AREA CETAK ──────────────────────────────────────────────
export const areaCetak = [
  { id: "depan",        label: "Depan Tengah",  side: "front" },
  { id: "belakang",     label: "Belakang",      side: "back"  },
  { id: "dada",         label: "Dada Kiri",     side: "front" },
  { id: "lengan-kiri",  label: "Lengan Kiri",   side: "front" },
  { id: "lengan-kanan", label: "Lengan Kanan",  side: "front" },
];

// ── PILIHAN WARNA ───────────────────────────────────────────
export const warnaKaos = [
  { nama: "Putih",   hex: "#FFFFFF" },
  { nama: "Hitam",   hex: "#1A1A1A" },
  { nama: "Abu-abu", hex: "#9CA3AF" },
  { nama: "Navy",    hex: "#1E3A5F" },
  { nama: "Merah",   hex: "#C8392B" },
  { nama: "Maroon",  hex: "#6B2737" },
  { nama: "Olive",   hex: "#6B7040" },
  { nama: "Krem",    hex: "#F5F5DC" },
  { nama: "Biru",    hex: "#3B82F6" },
  { nama: "Hijau",   hex: "#10B981" },
  { nama: "Kuning",  hex: "#F59E0B" },
  { nama: "Pink",    hex: "#EC4899" },
  { nama: "Ungu",    hex: "#7C3AED" },
  { nama: "Cokelat", hex: "#92400E" },
];

// ── UKURAN ──────────────────────────────────────────────────
export const ukuranTersedia = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

// ── KATEGORI TEMPLATE (Opsi B) ──────────────────────────────
export const kategoriTemplate = [
  { id: "kelas",       label: "Kaos Kelas / Angkatan", icon: "🏫" },
  { id: "event",       label: "Kaos Event / Kepanitiaan", icon: "🎉" },
  { id: "perpisahan",  label: "Kaos Perpisahan", icon: "👋" },
  { id: "komunitas",   label: "Komunitas / Club", icon: "🏍️" },
  { id: "organisasi",  label: "Organisasi / UKM", icon: "🎓" },
];

export default products;

