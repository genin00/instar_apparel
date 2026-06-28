// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — CONFIG
// ═══════════════════════════════════════════════════════════

const config = {

  // ── BRAND ──────────────────────────────────────────────
  brand: {
    name:    "Instar Apparel",
    tagline: "The Best Version of Yourself",
    email:   "support@instarapparel.com",
    address: "Jl. Sungai Pareman II, Kel. Sabbamparu, Kec. Wara Utara, Kota Palopo",
    mapsUrl: "https://maps.google.com/?q=Jl.+Sungai+Pareman+II+Palopo",
  },

  // ── KONTAK ─────────────────────────────────────────────
  whatsapp: {
    bisnis:   "6288242110537",
    desainer: "6281230220456",
  },

  // ── PESAN WA ───────────────────────────────────────────
  waPesan: {
    orderBaru:   "Halo Instar Apparel, saya ingin melakukan pemesanan custom.",
    cekStatus:   "Halo, saya ingin mengecek status pesanan saya.",
    konsultasi:  "Halo, saya ingin konsultasi desain untuk pesanan custom.",
  },

  // ── JAM OPERASIONAL ────────────────────────────────────
  jamOperasional: {
    hari:  "Senin — Sabtu",
    jam:   "08.00 — 17.00 WITA",
    libur: "Minggu & Hari Libur Nasional",
  },

  // ── TEMA WARNA ─────────────────────────────────────────
  colors: {
    primary:    "#0A0A0A",
    accent:     "#C8392B",
    background: "#F2F2F0",
    surface:    "#FFFFFF",
    textMuted:  "#9CA3AF",
    success:    "#10B981",
    border:     "#E5E7EB",
  },

  // ── HARGA ──────────────────────────────────────────────
  harga: {
    kaosLenganPendek:   95000,
    kaosLenganPanjang:  145000,
    kaosRib:            120000,
    biayaSablon: 5000,
    biayaBrief:  10000,
  },

  // ── PENGIRIMAN ─────────────────────────────────────────
  pengiriman: [
    {
      id:      "toko",
      label:   "Ambil di Toko",
      sub:     "Ambil langsung di Jl. Sungai Pareman II, Palopo",
      icon:    "🏪",
      ongkir:  0,
      freeOngkir: true,
    },
    {
      id:      "kurir",
      label:   "Kurir Instar",
      sub:     "Diantarkan ke area Kota Palopo",
      icon:    "🛵",
      ongkir:  15000,
      freeOngkir: false,
    },
    {
      id:      "ekspedisi",
      label:   "Ekspedisi",
      sub:     "Pengiriman ke seluruh Indonesia",
      icon:    "📦",
      ongkir:  0,
      freeOngkir: false,
      pilihanEkspedisi: ["JNE", "J&T Express", "SiCepat", "Pos Indonesia", "Anteraja", "Lion Parcel"],
    },
  ],

  // ── PEMBAYARAN ─────────────────────────────────────────
  metodeBayar: [
    { id: "cash",     label: "Cash",           sub: "Bayar langsung di toko",         icon: "💵" },
    { id: "qris",     label: "QRIS",           sub: "Scan QR dari semua e-wallet",    icon: "📱" },
    { id: "transfer", label: "Transfer Bank",  sub: "BCA · BRI · Mandiri · BNI",      icon: "🏦" },
    { id: "briva",    label: "Virtual Account",sub: "BRIva · BNIva · Mandiri VA",     icon: "💳" },
  ],

  // ── VOUCHER ────────────────────────────────────────────
  // Jenis: "persen" | "nominal" | "freeOngkir"
  voucher: [
    {
      kode:     "INSTAR10",
      jenis:    "persen",
      nilai:    10,
      label:    "Diskon 10%",
      minOrder: 100000,
      expired:  "2026-12-31",
      aktif:    true,
    },
    {
      kode:     "GRATIS",
      jenis:    "freeOngkir",
      nilai:    0,
      label:    "Gratis Ongkir",
      minOrder: 0,
      expired:  "2026-12-31",
      aktif:    true,
    },
    {
      kode:     "LAUNCHING",
      jenis:    "nominal",
      nilai:    20000,
      label:    "Diskon Rp 20.000",
      minOrder: 150000,
      expired:  "2026-12-31",
      aktif:    true,
    },
    {
      kode:     "PELAJAR",
      jenis:    "persen",
      nilai:    5,
      label:    "Diskon Pelajar 5%",
      minOrder: 0,
      expired:  "2026-12-31",
      aktif:    true,
    },
  ],

  // ── FAQ ────────────────────────────────────────────────
  faq: [
    { q: "Berapa minimal order?", a: "Tidak ada minimal order. Bisa pesan 1 pcs untuk satuan." },
    { q: "Berapa lama proses produksi?", a: "Estimasi 5–7 hari kerja setelah desain dan pembayaran dikonfirmasi." },
    { q: "Apakah bisa request desain custom?", a: "Bisa! Pilih opsi Konsultasi Desainer saat order." },
    { q: "Bagaimana cara cek status pesanan?", a: "Cek langsung via WhatsApp dengan menyebut ID pesanan kamu." },
    { q: "Apakah bisa revisi desain?", a: "Bisa revisi maksimal 2x sebelum masuk produksi." },
    { q: "Metode pembayaran apa saja?", a: "Cash di toko, QRIS, Transfer Bank, dan Virtual Account." },
    { q: "Apakah ada garansi produk?", a: "Ada. Jika ada cacat produksi, kami ganti tanpa biaya tambahan." },
    { q: "Apakah ada layanan pengiriman?", a: "Ada. Kurir Instar untuk area Palopo dan ekspedisi untuk luar kota." },
  ],

};

export default config;
