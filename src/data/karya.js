// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — DATA KARYA
//  Setiap karya adalah TEMPLATE DESAIN siap pakai.
//  Customer bisa klik "Buat Seperti Ini" untuk langsung custom
//  kaos pakai desain ini (warna & ukuran tetap bisa diubah).
//
//  Tambahkan karya di sini. Format tiap item:
//  {
//    id:            1,                        // angka unik, urut
//    label:         "Nama Karya",              // judul utama
//    subjudul:      "Spirit of Unity",         // tagline singkat (opsional, boleh "")
//    kategori:      "kelas",                   // id dari kategoriKarya di bawah
//    produkId:      "lengan-pendek",           // id produk dasar, lihat src/data/products.js
//    gambarUtama:   "/karya/todo-fulik.png",   // foto mockup LENGKAP (utk preview grid & cover modal)
//    gambarDesain:  "/karya/todo-fulik-desain.png", // PNG desain TRANSPARAN (utk dipasang di CustomBuilder)
//    galeriDetail:  [                          // 0-5 foto close-up tambahan (carousel di modal)
//      "/karya/todo-fulik-detail1.png",
//      "/karya/todo-fulik-detail2.png",
//      "/karya/todo-fulik-detail3.png",
//    ],
//    deskripsi:     "...",                     // cerita/penjelasan desain di modal
//    jumlah:        "36 pcs",                  // total produksi (opsional, info sosial proof)
//    tahun:         "2025",
//  },
//
//  Catatan:
//  - Semua path gambar (gambarUtama, gambarDesain, galeriDetail) merujuk ke
//    folder public/karya/ — taruh file fisiknya di sana.
//  - galeriDetail boleh dikosongkan [] kalau belum ada foto detail.
//  - Pilihan warna & ukuran TIDAK perlu diisi di sini — semua karya
//    pakai daftar warna & ukuran yang sama dari src/data/products.js
//    (warnaKaos & ukuranTersedia), supaya konsisten dgn CustomBuilder.
// ═══════════════════════════════════════════════════════════

export const kategoriKarya = [
  { id: "semua",      label: "Semua" },
  { id: "kelas",      label: "Kelas" },
  { id: "komunitas",  label: "Komunitas" },
  { id: "event",      label: "Event" },
  { id: "perpisahan", label: "Perpisahan" },
];

const karya = [
  // Tambahkan data karya di sini, mengikuti format di atas. Contoh:
  // {
  //   id:           1,
  //   label:        "Todo Fulik Temmalara",
  //   subjudul:     "Spirit of Unity",
  //   kategori:     "komunitas",
  //   produkId:     "lengan-pendek",
  //   gambarUtama:  "/karya/todo-fulik.png",
  //   gambarDesain: "/karya/todo-fulik-desain.png",
  //   galeriDetail: [
  //     "/karya/todo-fulik-detail1.png",
  //     "/karya/todo-fulik-detail2.png",
  //     "/karya/todo-fulik-detail3.png",
  //   ],
  //   deskripsi:    "Desain terinspirasi dari monumen Todo Fulik Temmalara sebagai simbol persatuan, keberanian, dan semangat membangun daerah.",
  //   jumlah:       "36 pcs",
  //   tahun:        "2025",
  // },
];

export default karya;
