// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — KERANJANG
// ═══════════════════════════════════════════════════════════

import { useState } from "react";
import Header from "../components/Header.jsx";
import { ukuranTersedia } from "../data/products.js";

const rp = (n) => "Rp " + n.toLocaleString("id-ID");

// ── Filter warna kaos (sama dengan CustomBuilder.jsx) ─────────
function getShirtFilter(hex) {
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

// ── Path mockup foto kaos per produk (sama dengan CustomBuilder.jsx) ──
const MOCKUP_MAP = {
  "lengan-pendek":  { front: "/mockup-pendek.png",  back: "/mockup-pendek-belakang.png"  },
  "lengan-panjang": { front: "/mockup-panjang.png", back: "/mockup-panjang-belakang.png" },
  "rib":            { front: "/mockup-rib.png",     back: "/mockup-rib-belakang.png"     },
};

// ── Preview produk: mockup asli + warna + desain upload (kalau ada) ──
function PreviewProduk({ item }) {
  const hasDepan    = item.opsiDesain === "upload" && item.uploads?.depan;
  const hasBelakang = item.opsiDesain === "upload" && item.uploads?.belakang;
  const zona      = hasDepan ? "depan" : hasBelakang ? "belakang" : null;
  const sisi      = zona === "belakang" ? "back" : "front";
  const desainSrc = zona ? item.uploads[zona] : null;
  // Posisi/skala asli yang diatur user di canvas builder (drag & zoom).
  // Fallback dipakai hanya untuk item lama yang belum punya data posisiDesain.
  const posisi    = (zona && item.posisiDesain?.[zona]) || { x: 50, y: 32, scale: 0.36 };
  const mockupSrc = MOCKUP_MAP[item.produk?.id]?.[sisi] || "/mockup-pendek.png";

  return (
    <div style={{
      width: "56px", borderRadius: "10px",
      background: "#F8FAFC", border: "1px solid #E5E7EB",
      overflow: "hidden", position: "relative", flexShrink: 0,
      alignSelf: "flex-start",
    }}>
      {/* width 100% / height auto — sama persis dengan canvas builder,
          supaya tidak ada letterbox dan koordinat % desain tetap pas */}
      <img src={mockupSrc} alt={item.produk?.nama}
        style={{
          width: "100%", height: "auto", display: "block",
          filter: getShirtFilter(item.warna),
        }} />
      {desainSrc && (
        <img src={desainSrc} alt="desain"
          style={{
            position: "absolute",
            left: `${posisi.x}%`, top: `${posisi.y}%`,
            width: `${posisi.scale * 100}%`,
            transform: "translate(-50%, -50%)",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))",
          }} />
      )}
    </div>
  );
}

export default function Keranjang({ items = [], onHapus, onCheckout, onLanjutBelanja, onBack }) {
  const [dipilih, setDipilih] = useState([]);

  const totalHarga = items
    .filter(i => dipilih.includes(i.id))
    .reduce((a, i) => a + i.totalHarga, 0);
  const totalItem = dipilih.length;

  const togglePilih = (id) => {
    setDipilih(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const pilihSemua = () => {
    if (dipilih.length === items.length) setDipilih([]);
    else setDipilih(items.map(i => i.id));
  };

  if (items.length === 0) {
    return (
      <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
        <Header halaman="keranjang" judul="Keranjang" onBack={onBack} />
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "80px 32px", textAlign: "center",
        }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🛒</div>
          <div style={{ fontWeight: "900", fontSize: "20px", marginBottom: "8px", color: "#0A0A0A" }}>
            Keranjang Kosong
          </div>
          <div style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "24px", lineHeight: 1.5 }}>
            Belum ada produk di keranjang.<br />Yuk mulai custom kaos kamu!
          </div>
          <button onClick={onLanjutBelanja} style={{
            background: "#0A0A0A", color: "white", border: "none",
            borderRadius: "50px", padding: "13px 36px",
            fontSize: "13px", fontWeight: "900",
            letterSpacing: "1.5px", cursor: "pointer",
          }}>
            LIHAT PRODUK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "160px" }}>
      <Header halaman="keranjang" judul="Keranjang" />

      {/* ── PILIH SEMUA ── */}
      <div style={{
        background: "white", borderBottom: "1px solid #E5E7EB",
        padding: "12px 16px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={pilihSemua} style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "none", border: "none", cursor: "pointer",
        }}>
          <div style={{
            width: "20px", height: "20px", borderRadius: "6px",
            border: "2px solid",
            borderColor: dipilih.length === items.length ? "#0A0A0A" : "#D1D5DB",
            background: dipilih.length === items.length ? "#0A0A0A" : "white",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {dipilih.length === items.length && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>
            Pilih Semua ({items.length})
          </span>
        </button>
        {dipilih.length > 0 && (
          <button onClick={() => {
            dipilih.forEach(id => onHapus(id));
            setDipilih([]);
          }} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "12px", fontWeight: "700", color: "#C8392B",
          }}>
            Hapus ({dipilih.length})
          </button>
        )}
      </div>

      {/* ── LIST ITEM ── */}
      <div style={{ padding: "12px 16px 0" }}>
        {items.map((item) => (
          <div key={item.id} style={{
            background: "white", borderRadius: "14px",
            padding: "14px", marginBottom: "10px",
            display: "flex", gap: "12px",
            border: dipilih.includes(item.id)
              ? "2px solid #0A0A0A" : "2px solid transparent",
          }}>
            {/* Checkbox */}
            <button onClick={() => togglePilih(item.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 0, flexShrink: 0, alignSelf: "flex-start", marginTop: "2px",
            }}>
              <div style={{
                width: "20px", height: "20px", borderRadius: "6px",
                border: "2px solid",
                borderColor: dipilih.includes(item.id) ? "#0A0A0A" : "#D1D5DB",
                background: dipilih.includes(item.id) ? "#0A0A0A" : "white",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {dipilih.includes(item.id) && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>

            {/* Preview produk: mockup + warna + desain */}
            <PreviewProduk item={item} />

            {/* Detail */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "800", fontSize: "14px", marginBottom: "3px" }}>
                {item.produk.nama}
              </div>
              <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "3px" }}>
                Warna: {item.warnaLabel}
              </div>
              <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "4px" }}>
                Desain: {item.opsiDesain === "upload"
                  ? `Upload · ${Object.keys(item.uploads || {}).length} area`
                  : item.kodeDesain
                    ? `Kode: ${item.kodeDesain}`
                    : "Brief ke desainer"}
              </div>

              {/* Breakdown ukuran */}
              {item.modeUkuran === "massal" ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "6px" }}>
                  {ukuranTersedia
                    .filter(sz => parseInt(item.massalQty?.[sz]) > 0)
                    .map(sz => (
                      <div key={sz} style={{
                        background: "#F2F2F0", borderRadius: "4px",
                        padding: "2px 7px", fontSize: "10px", fontWeight: "700",
                      }}>
                        {sz}: {item.massalQty[sz]}
                      </div>
                    ))}
                </div>
              ) : (
                <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "4px" }}>
                  Ukuran {item.satuanSize} · {item.satuanQty} pcs
                </div>
              )}

              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ fontWeight: "900", fontSize: "14px", color: "#0A0A0A" }}>
                  {rp(item.totalHarga)}
                </div>
                <div style={{ fontSize: "11px", color: "#9CA3AF" }}>
                  {item.totalQty} pcs
                </div>
              </div>
            </div>

            {/* Hapus */}
            <button onClick={() => {
              onHapus(item.id);
              setDipilih(prev => prev.filter(x => x !== item.id));
            }} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "4px", alignSelf: "flex-start", flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18"
                  stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* ── BOTTOM CHECKOUT ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "white", borderTop: "1px solid #E5E7EB",
        padding: "14px 16px",
        maxWidth: "480px", margin: "0 auto",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: "11px", color: "#9CA3AF" }}>
              {totalItem} item dipilih
            </div>
            <div style={{ fontWeight: "900", fontSize: "18px", color: "#0A0A0A" }}>
              {rp(totalHarga)}
            </div>
          </div>
          <button
            onClick={() => onCheckout(items.filter(i => dipilih.includes(i.id)))}
            disabled={totalItem === 0}
            style={{
              padding: "13px 28px", borderRadius: "12px", border: "none",
              background: totalItem > 0 ? "#C8392B" : "#E5E7EB",
              color: totalItem > 0 ? "white" : "#9CA3AF",
              fontWeight: "900", fontSize: "15px",
              cursor: totalItem > 0 ? "pointer" : "not-allowed",
            }}
          >
            Checkout ({totalItem})
          </button>
        </div>
      </div>

    </div>
  );
}

