// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — CONFIG
//  Semua setting penting ada di sini
//  Ganti nilai di bawah sesuai kebutuhan
// ═══════════════════════════════════════════════════════════

const config = {

  // ── BRAND ──────────────────────────────────────────────
  brand: {
    name:        "Instar Apparel",
    tagline:     "The Best Version of Yourself",
    email:       "support@instarapparel.com",   // ← ganti dengan email asli
    address:     "Jl. Sungai Pareman II, Kel. Sabbamparu, Kec. Wara Utara, Kota Palopo",
    mapsUrl:     "https://maps.google.com/?q=Jl.+Sungai+Pareman+II+Palopo",
  },

  // ── KONTAK ─────────────────────────────────────────────
  whatsapp: {
    bisnis:      "6288242110537",   // WA Bisnis — untuk order & pembayaran
    desainer:    "6281230220456",   // WA Desainer — untuk diskusi desain
  },

  // ── PESAN WA OTOMATIS ───────────────────────────────────
  waPesan: {
    orderBaru:   "Halo Instar Apparel, saya ingin melakukan pemesanan custom.",
    cekStatus:   "Halo, saya ingin mengecek status pesanan saya.",
    konsultasi:  "Halo, saya ingin konsultasi desain untuk pesanan custom.",
  },

  // ── JAM OPERASIONAL ─────────────────────────────────────
  jamOperasional: {
    hari:   "Senin — Sabtu",
    jam:    "08.00 — 17.00 WITA",
    libur:  "Minggu & Hari Libur Nasional",
  },

  // ── TEMA WARNA ──────────────────────────────────────────
  colors: {
    primary:     "#0A0A0A",   // hitam utama
    accent:      "#C8392B",   // merah aksen
    background:  "#F2F2F0",   // putih hangat
    surface:     "#FFFFFF",   // kartu / panel
    textPrimary: "#0A0A0A",   // teks utama
    textMuted:   "#9CA3AF",   // teks abu
    success:     "#10B981",   // hijau sukses
    border:      "#E5E7EB",   // garis border
  },

  // ── HARGA ───────────────────────────────────────────────
  harga: {
    kaosLenganPendek:  95000,
    kaosLenganPanjang: 145000,
    kaosRib:           120000,
    biayaDesainPerArea: 25000,  // biaya tambahan per area cetak
  },

  // ── KODE DESAIN ─────────────────────────────────────────
  kodeDesain: {
    prefix: "INSTAR",   // format: INSTAR-XXXX
  },

  // ── PEMBAYARAN ──────────────────────────────────────────
  pembayaran: [
    {
      id:    "cash",
      label: "Cash (Datang ke Toko)",
      sub:   "Bayar langsung di toko kami",
      icon:  "🏪",
    },
    {
      id:    "qris",
      label: "QRIS",
      sub:   "Scan QR dari semua e-wallet",
      icon:  "📱",
    },
    {
      id:    "transfer",
      label: "Transfer Bank",
      sub:   "BCA · BRI · Mandiri · BNI",
      icon:  "🏦",
    },
  ],

  // ── FAQ ─────────────────────────────────────────────────
  faq: [
    {
      q: "Berapa minimal order?",
      a: "Tidak ada minimal order. Bisa pesan 1 pcs untuk satuan.",
    },
    {
      q: "Berapa lama proses produksi?",
      a: "Estimasi 5–7 hari kerja setelah desain dan pembayaran dikonfirmasi.",
    },
    {
      q: "Apakah bisa request desain custom?",
      a: "Bisa! Pilih opsi 'Konsultasi Desainer' saat order, tim desainer kami akan bantu.",
    },
    {
      q: "Bagaimana cara cek status pesanan?",
      a: "Kamu bisa cek langsung via WhatsApp dengan menyebut ID pesanan kamu.",
    },
    {
      q: "Apakah bisa revisi desain?",
      a: "Bisa revisi maksimal 2x sebelum masuk produksi.",
    },
    {
      q: "Metode pembayaran apa saja?",
      a: "Cash di toko, QRIS, dan Transfer Bank (BCA, BRI, Mandiri, BNI).",
    },
    {
      q: "Apakah ada garansi produk?",
      a: "Ada. Jika ada cacat produksi, kami akan ganti tanpa biaya tambahan.",
    },
  ],

};

export default config;

