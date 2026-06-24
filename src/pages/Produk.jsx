// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — HALAMAN PRODUK (v2)
// ═══════════════════════════════════════════════════════════

import { useState } from "react";
import Header from "../components/Header.jsx";
import ProductCard from "../components/ProductCard.jsx";
import products from "../data/products.js";

const kategori = ["Semua", "Lengan Pendek", "Lengan Panjang", "Rib"];

export default function Produk({ onCustom, onWishlist, wishlist = [], keranjangCount = 0, onKeranjang, onKonsultasi }) {
  const [aktifKategori, setAktifKategori] = useState("Semua");
  const [layout, setLayout]               = useState("grid");
  const [cari, setCari]                   = useState("");

  const filtered = products.filter((p) => {
    const cocokKategori =
      aktifKategori === "Semua" ||
      (aktifKategori === "Lengan Pendek"  && p.id === "lengan-pendek")  ||
      (aktifKategori === "Lengan Panjang" && p.id === "lengan-panjang") ||
      (aktifKategori === "Rib"            && p.id === "rib");
    const cocokCari = p.nama.toLowerCase().includes(cari.toLowerCase());
    return cocokKategori && cocokCari;
  });

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "80px", background: "#F2F2F0" }}>

      <Header halaman="produk" keranjangCount={keranjangCount} onKeranjang={onKeranjang} />

      {/* Search */}
      <div style={{ background: "#0A0A0A", padding: "0 16px 16px" }}>
        <div style={{ background: "#1A1A1A", borderRadius: "12px",
          display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#6B7280" strokeWidth="2"/>
            <path d="M16.5 16.5L21 21" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input value={cari} onChange={e => setCari(e.target.value)}
            placeholder="Cari produk..."
            style={{ background: "none", border: "none", outline: "none",
              fontSize: "16px", color: "#FFFFFF", flex: 1, fontFamily: "inherit" }}/>
          {cari && (
            <button onClick={() => setCari("")}
              style={{ background: "none", border: "none", color: "#6B7280",
                cursor: "pointer", fontSize: "18px", padding: 0, lineHeight: 1 }}>×</button>
          )}
        </div>
      </div>

      {/* Filter + Toggle Layout */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB",
        padding: "12px 16px", display: "flex", alignItems: "center",
        gap: "8px", overflowX: "auto", scrollbarWidth: "none" }}>
        {kategori.map(k => (
          <button key={k} onClick={() => setAktifKategori(k)} style={{
            padding: "7px 16px", borderRadius: "20px", border: "2px solid",
            borderColor: aktifKategori === k ? "#0A0A0A" : "#E5E7EB",
            background: aktifKategori === k ? "#0A0A0A" : "white",
            color: aktifKategori === k ? "white" : "#6B7280",
            fontSize: "12px", fontWeight: "700", cursor: "pointer",
            whiteSpace: "nowrap", flexShrink: 0 }}>
            {k}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: "4px", flexShrink: 0 }}>
          {["grid", "list"].map(l => (
            <button key={l} onClick={() => setLayout(l)} style={{
              width: "34px", height: "34px", borderRadius: "8px", border: "2px solid",
              borderColor: layout === l ? "#0A0A0A" : "#E5E7EB",
              background: layout === l ? "#0A0A0A" : "white",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {l === "grid" ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="0" y="0" width="6" height="6" rx="1.5" fill={layout === l ? "white" : "#9CA3AF"}/>
                  <rect x="8" y="0" width="6" height="6" rx="1.5" fill={layout === l ? "white" : "#9CA3AF"}/>
                  <rect x="0" y="8" width="6" height="6" rx="1.5" fill={layout === l ? "white" : "#9CA3AF"}/>
                  <rect x="8" y="8" width="6" height="6" rx="1.5" fill={layout === l ? "white" : "#9CA3AF"}/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="0" y="0" width="14" height="4" rx="1.5" fill={layout === l ? "white" : "#9CA3AF"}/>
                  <rect x="0" y="5" width="14" height="4" rx="1.5" fill={layout === l ? "white" : "#9CA3AF"}/>
                  <rect x="0" y="10" width="14" height="4" rx="1.5" fill={layout === l ? "white" : "#9CA3AF"}/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Jumlah hasil */}
      <div style={{ padding: "12px 16px 4px" }}>
        <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
          {filtered.length} produk ditemukan
          {aktifKategori !== "Semua" && (
            <span style={{ color: "#0A0A0A", fontWeight: "700" }}> · {aktifKategori}</span>
          )}
        </div>
      </div>

      {/* List produk */}
      <div style={{ padding: "8px 16px 0" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
            <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "6px", color: "#374151" }}>
              Produk tidak ditemukan
            </div>
            <div style={{ fontSize: "12px" }}>Coba kata kunci lain atau pilih kategori berbeda</div>
          </div>
        ) : layout === "grid" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {filtered.map(produk => (
              <ProductCard key={produk.id} produk={produk} layout="grid"
                onCustom={onCustom} onWishlist={onWishlist}
                isWishlisted={wishlist.some(w => w.id === produk.id)}/>
            ))}
          </div>
        ) : (
          <div>
            {filtered.map(produk => (
              <ProductCard key={produk.id} produk={produk} layout="list"
                onCustom={onCustom} onWishlist={onWishlist}
                isWishlisted={wishlist.some(w => w.id === produk.id)}/>
            ))}
          </div>
        )}
      </div>

      {/* Banner bawah */}
      <div style={{ margin: "20px 16px 0", background: "#0A0A0A", borderRadius: "16px",
        padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "900", fontSize: "14px", color: "#FFFFFF", marginBottom: "4px" }}>
            Belum ada desain?
          </div>
          <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: 1.4 }}>
            Tim desainer kami siap bantu wujudkan idemu.
          </div>
        </div>
        <button onClick={() => onKonsultasi && onKonsultasi()} style={{ background: "#C8392B", color: "white", border: "none",
          borderRadius: "10px", padding: "10px 14px", fontSize: "12px",
          fontWeight: "800", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
          💬 Konsultasi
        </button>
      </div>

    </div>
  );
}
