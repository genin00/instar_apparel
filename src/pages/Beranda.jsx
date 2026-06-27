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
const quotes = [
  {
    teks: "Pakaian bukan sekadar kain — ia adalah bahasa tanpa kata yang menceritakan siapa kamu.",
    ikon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
          stroke="#C8392B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    teks: "Identitasmu terlalu unik untuk diwakilkan oleh desain orang lain. Buat milikmu sendiri.",
    ikon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#C8392B" strokeWidth="1.8"/>
        <path d="M12 8v4l3 3" stroke="#C8392B" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    teks: "Satu kaos custom bisa menyatukan komunitas, merayakan momen, dan meninggalkan kenangan.",
    ikon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"
          stroke="#C8392B" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    teks: "Kreativitas adalah cara terbaik untuk memperkenalkan dirimu kepada dunia.",
    ikon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          stroke="#C8392B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function Beranda({ onCustom, onWishlist, wishlist = [], onLihatSemua, onLihatKarya, onBuatSepertiIni }) {
  const [activeQuote, setActiveQuote] = useState(0);

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>

      <Header halaman="beranda" />

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
            Inspirasi Kami
          </div>
          <div style={{ fontWeight: 900, fontSize: "20px", color: "#0A0A0A" }}>
            Quote of the Day
          </div>
        </div>

        {/* Quote of the Day card */}
        <div style={{
          background:   "#0A0A0A",
          borderRadius: "16px",
          padding:      "20px",
          marginBottom: "12px",
        }}>

          <div style={{
            fontSize:   "14px",
            color:      "#E5E7EB",
            fontStyle:  "italic",
            lineHeight: 1.6,
            marginBottom: "16px",
          }}>
            "{quotes[activeQuote].teks}"
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "13px", color: "#FFFFFF" }}>
              Instar Apparel
            </div>
            <div style={{ fontSize: "11px", color: "#6B7280" }}>
              Palopo, Sulawesi Selatan
            </div>
          </div>
        </div>

        {/* Dot navigator */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveQuote(i)}
              style={{
                width:        i === activeQuote ? "20px" : "6px",
                height:       "6px",
                borderRadius: "3px",
                background:   i === activeQuote ? "#0A0A0A" : "#D1D5DB",
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

