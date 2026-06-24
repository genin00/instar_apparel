// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — BERANDA
// ═══════════════════════════════════════════════════════════

import { useState } from "react";
import Header from "../components/Header.jsx";
import ProductCard from "../components/ProductCard.jsx";
import KaryaInstar from "../components/KaryaInstar.jsx";
import products from "../data/products.js";
import config from "../config.js";

// ── CARA KERJA DATA ─────────────────────────────────────────
const caraKerja = [
  {
    no:     "01",
    judul:  "Pilih Produk",
    sub:    "Tentukan jenis kaos, warna, dan bahan yang kamu inginkan.",
    icon:   (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M20.5 7.5L12 3L3.5 7.5V16.5L12 21L20.5 16.5V7.5Z"
          stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
        <path d="M12 3V21M3.5 7.5L12 12L20.5 7.5"
          stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    no:     "02",
    judul:  "Upload Desain",
    sub:    "Punya desain sendiri? Upload langsung. Belum ada? Tim desainer kami siap bantu.",
    icon:   (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15"
          stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M17 8L12 3L7 8M12 3V15"
          stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    no:     "03",
    judul:  "Pilih Ukuran",
    sub:    "Order satuan atau massal? Tentukan ukuran dan jumlah sesuai kebutuhan.",
    icon:   (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M3 6H21M3 12H21M3 18H21"
          stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    no:     "04",
    judul:  "Terima Pesanan",
    sub:    "Produksi selesai, pesanan dikirim atau bisa diambil langsung ke toko.",
    icon:   (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M5 12L10 17L20 7"
          stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];


// ── TESTIMONI DATA ──────────────────────────────────────────
const testimoni = [
  {
    nama:   "Andi R.",
    peran:  "Ketua Kelas XII",
    bintang: 5,
    teks:   "Hasilnya melebihi ekspektasi! Kualitas bahan bagus, desain rapi, pengiriman tepat waktu.",
  },
  {
    nama:   "Komunitas Trail Palopo",
    peran:  "Order 45 pcs",
    bintang: 5,
    teks:   "Sudah 2x order di Instar. Konsisten kualitasnya, admin responsif, recommended!",
  },
  {
    nama:   "Ibu Sari",
    peran:  "Guru SMAN 1 Palopo",
    bintang: 5,
    teks:   "Kaos guru acara wisuda sangat memuaskan. Akan order lagi untuk acara berikutnya.",
  },
];

export default function Beranda({ onChat, onCustom, onWishlist, wishlist = [], onLihatSemua, onLihatKarya, onBuatSepertiIni }) {
  const [activeTestimoni, setActiveTestimoni] = useState(0);

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>

      <Header halaman="beranda" onChat={onChat} />

      {/* ── HERO SECTION ── */}
      <div style={{
        background:    "#0A0A0A",
        padding:       "24px 20px 36px",
        textAlign:     "center",
      }}>
        <div style={{
          fontSize:      "11px",
          letterSpacing: "3px",
          color:         "#4B5563",
          marginBottom:  "10px",
          textTransform: "uppercase",
        }}>
          Custom Clothing
        </div>
        <h1 style={{
          fontWeight:    900,
          fontSize:      "28px",
          color:         "#FFFFFF",
          lineHeight:    1.2,
          margin:        "0 0 12px",
          letterSpacing: "-0.5px",
        }}>
          Pakaian Custom<br />
          <span style={{ color: "#C8392B" }}>Identitas Kamu</span>
        </h1>
        <p style={{
          fontSize:   "13px",
          color:      "#6B7280",
          lineHeight: 1.6,
          margin:     "0 0 24px",
          padding:    "0 20px",
        }}>
          Dari kaos kelas, komunitas, sampai event — semua bisa di-custom sesuai keinginan kamu.
        </p>
        <button
          onClick={() => onLihatSemua()}
          style={{
            background:    "#FFFFFF",
            color:         "#0A0A0A",
            border:        "none",
            borderRadius:  "50px",
            padding:       "13px 36px",
            fontSize:      "13px",
            fontWeight:    "900",
            letterSpacing: "1.5px",
            cursor:        "pointer",
          }}
        >
          MULAI CUSTOM
        </button>
      </div>

      {/* ── CARA KERJA ── */}
      <div style={{ padding: "32px 20px 0" }}>
        <div style={{ marginBottom: "20px" }}>
          <div style={{
            fontSize:      "10px",
            letterSpacing: "3px",
            color:         "#9CA3AF",
            marginBottom:  "4px",
            textTransform: "uppercase",
          }}>
            Prosesnya Mudah
          </div>
          <div style={{ fontWeight: 900, fontSize: "20px", color: "#0A0A0A" }}>
            Cara Kerja Instar
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {caraKerja.map((item, i) => (
            <div
              key={i}
              style={{
                background:   "#FFFFFF",
                borderRadius: "14px",
                padding:      "16px",
                display:      "flex",
                gap:          "14px",
                alignItems:   "flex-start",
              }}
            >
              {/* Icon circle */}
              <div style={{
                width:          "48px",
                height:         "48px",
                borderRadius:   "12px",
                background:     "#0A0A0A",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                flexShrink:     0,
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize:      "10px",
                  color:         "#C8392B",
                  fontWeight:    "800",
                  letterSpacing: "1px",
                  marginBottom:  "2px",
                }}>
                  {item.no}
                </div>
                <div style={{ fontWeight: "800", fontSize: "14px", color: "#0A0A0A", marginBottom: "3px" }}>
                  {item.judul}
                </div>
                <div style={{ fontSize: "12px", color: "#9CA3AF", lineHeight: 1.5 }}>
                  {item.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── KARYA INSTAR ── */}
      <div style={{ padding: "32px 20px 0", overflowX: "hidden", width: "100%" }}>
        <KaryaInstar preview onLihatSemua={onLihatKarya} onBuatSepertiIni={onBuatSepertiIni} />
      </div>

      {/* ── PRODUK UNGGULAN ── */}
      <div style={{ padding: "32px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px" }}>
          <div>
            <div style={{
              fontSize:      "10px",
              letterSpacing: "3px",
              color:         "#9CA3AF",
              marginBottom:  "4px",
              textTransform: "uppercase",
            }}>
              Koleksi Kami
            </div>
            <div style={{ fontWeight: 900, fontSize: "20px", color: "#0A0A0A" }}>
              Produk
            </div>
          </div>
          <button
            onClick={onLihatSemua}
            style={{
              background: "none",
              border:     "none",
              fontSize:   "12px",
              fontWeight: "700",
              color:      "#9CA3AF",
              cursor:     "pointer",
            }}
          >
            Semua Produk →
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {products.map((produk) => (
            <ProductCard
              key={produk.id}
              produk={produk}
              layout="grid"
              onCustom={onCustom}
              onWishlist={onWishlist}
              isWishlisted={wishlist.some(w => w.id === produk.id)}
            />
          ))}
        </div>
      </div>

      {/* ── TESTIMONI ── */}
      <div style={{ padding: "32px 20px 0" }}>
        <div style={{ marginBottom: "16px" }}>
          <div style={{
            fontSize:      "10px",
            letterSpacing: "3px",
            color:         "#9CA3AF",
            marginBottom:  "4px",
            textTransform: "uppercase",
          }}>
            Kata Mereka
          </div>
          <div style={{ fontWeight: 900, fontSize: "20px", color: "#0A0A0A" }}>
            Testimoni
          </div>
        </div>

        {/* Testimoni card */}
        <div style={{
          background:   "#0A0A0A",
          borderRadius: "16px",
          padding:      "20px",
          marginBottom: "12px",
        }}>
          <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
            {[...Array(testimoni[activeTestimoni].bintang)].map((_, i) => (
              <span key={i} style={{ color: "#F59E0B", fontSize: "14px" }}>★</span>
            ))}
          </div>
          <div style={{
            fontSize:   "14px",
            color:      "#E5E7EB",
            fontStyle:  "italic",
            lineHeight: 1.6,
            marginBottom: "16px",
          }}>
            "{testimoni[activeTestimoni].teks}"
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "13px", color: "#FFFFFF" }}>
              {testimoni[activeTestimoni].nama}
            </div>
            <div style={{ fontSize: "11px", color: "#6B7280" }}>
              {testimoni[activeTestimoni].peran}
            </div>
          </div>
        </div>

        {/* Dot navigator */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
          {testimoni.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTestimoni(i)}
              style={{
                width:        i === activeTestimoni ? "20px" : "6px",
                height:       "6px",
                borderRadius: "3px",
                background:   i === activeTestimoni ? "#0A0A0A" : "#D1D5DB",
                border:       "none",
                cursor:       "pointer",
                transition:   "all 0.3s ease",
                padding:      0,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── CTA BOTTOM ── */}
      <div style={{
        margin:       "32px 20px 0",
        background:   "#0A0A0A",
        borderRadius: "20px",
        padding:      "28px 24px",
        textAlign:    "center",
      }}>
        <div style={{
          fontWeight:    900,
          fontSize:      "20px",
          color:         "#FFFFFF",
          marginBottom:  "8px",
          lineHeight:    1.3,
        }}>
          Siap Bikin Kaos<br />
          <span style={{ color: "#C8392B" }}>Impian Kamu?</span>
        </div>
        <div style={{
          fontSize:     "13px",
          color:        "#6B7280",
          marginBottom: "20px",
          lineHeight:   1.5,
        }}>
          Mulai dari 1 pcs. Tanpa minimal order.
        </div>
        <button
          onClick={onLihatSemua}
          style={{
            background:    "#FFFFFF",
            color:         "#0A0A0A",
            border:        "none",
            borderRadius:  "50px",
            padding:       "13px 36px",
            fontSize:      "13px",
            fontWeight:    "900",
            letterSpacing: "1.5px",
            cursor:        "pointer",
          }}
        >
          CUSTOM SEKARANG
        </button>
      </div>

    </div>
  );
}

