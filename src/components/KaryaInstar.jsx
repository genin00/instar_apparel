// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — KARYA INSTAR
//  Grid template desain + filter kategori + modal detail
//  Modal punya carousel foto detail + tombol "Buat Seperti Ini"
// ═══════════════════════════════════════════════════════════

import { useState } from "react";
import karyaData from "../data/karya.js";

const kategoriKarya = [
  { id: "semua",      label: "Semua" },
  { id: "kelas",      label: "Kelas" },
  { id: "event",      label: "Event" },
  { id: "perpisahan", label: "Perpisahan" },
  { id: "komunitas",  label: "Komunitas" },
  { id: "umkm",       label: "UMKM" },
  { id: "instansi",   label: "Instansi" },
  { id: "custom",     label: "Custom" },
];
import products, { warnaKaos, ukuranTersedia } from "../data/products.js";

// ── CAROUSEL FOTO (gambar utama + galeri detail) ───────────
function KaryaCarousel({ item }) {
  const semuaFoto = [item.gambarUtama, ...(item.galeriDetail || [])].filter(Boolean);
  const [active, setActive] = useState(0);

  if (semuaFoto.length === 0) return null;

  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{
        borderRadius: "16px", overflow: "hidden",
        background: "#F2F2F0", position: "relative",
      }}>
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
          onScroll={(e) => {
            const w = e.target.clientWidth;
            const i = Math.round(e.target.scrollLeft / w);
            if (i !== active) setActive(i);
          }}
        >
          {semuaFoto.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${item.label} ${i + 1}`}
              style={{
                width: "100%", flexShrink: 0,
                scrollSnapAlign: "start",
                display: "block", objectFit: "cover",
              }}
            />
          ))}
        </div>

        {semuaFoto.length > 1 && (
          <div style={{
            position: "absolute", bottom: "10px", left: 0, right: 0,
            display: "flex", justifyContent: "center", gap: "5px",
          }}>
            {semuaFoto.map((_, i) => (
              <div key={i} style={{
                width: i === active ? "16px" : "5px",
                height: "5px", borderRadius: "3px",
                background: i === active ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }} />
            ))}
          </div>
        )}
      </div>

      {semuaFoto.length > 1 && (
        <div style={{
          textAlign: "center", fontSize: "10px",
          color: "#9CA3AF", marginTop: "6px",
        }}>
          👆 Geser untuk lihat detail lainnya ({active + 1}/{semuaFoto.length})
        </div>
      )}
    </div>
  );
}

// ── MODAL DETAIL ──────────────────────────────────────────
function KaryaModal({ item, onClose, onBuatSepertiIni }) {
  if (!item) return null;

  const produkDasar = products.find(p => p.id === item.produkId) || products[0];

  return (
    <div
      onClick={onClose}
      style={{
        position:       "fixed",
        inset:          0,
        background:     "rgba(10,10,10,0.6)",
        display:        "flex",
        alignItems:     "flex-end",
        justifyContent: "center",
        zIndex:         200,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background:    "#FFFFFF",
          borderRadius:  "24px 24px 0 0",
          width:         "100%",
          maxWidth:      "480px",
          maxHeight:     "88vh",
          overflowY:     "auto",
          padding:       "20px 20px 24px",
          boxSizing:     "border-box",
        }}
      >
        {/* Drag handle */}
        <div style={{
          width: "36px", height: "4px", borderRadius: "2px",
          background: "#E5E7EB", margin: "0 auto 16px",
        }} />

        {/* Carousel: gambar utama + foto detail */}
        <KaryaCarousel item={item} />

        <div style={{
          fontSize: "10px", letterSpacing: "2px", color: "#9CA3AF",
          textTransform: "uppercase", fontWeight: "700", marginBottom: "4px",
        }}>
          {kategoriKarya.find(k => k.id === item.kategori)?.label}
          {item.tahun ? ` · ${item.tahun}` : ""}
        </div>

        <div style={{ fontWeight: "900", fontSize: "20px", color: "#0A0A0A", marginBottom: "2px" }}>
          {item.label}
        </div>

        {item.subjudul && (
          <div style={{ fontSize: "13px", color: "#C8392B", fontWeight: "700", marginBottom: "10px" }}>
            {item.subjudul}
          </div>
        )}

        {item.deskripsi && (
          <div style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.6, marginBottom: "16px" }}>
            {item.deskripsi}
          </div>
        )}

        {/* Pilihan warna (preview saja, warna sebenarnya dipilih di CustomBuilder) */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontWeight: "700", fontSize: "12px", color: "#374151", marginBottom: "8px" }}>
            Tersedia dalam berbagai warna
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {warnaKaos.slice(0, 8).map((w) => (
              <div key={w.hex} title={w.nama} style={{
                width: "26px", height: "26px", borderRadius: "50%",
                background: w.hex,
                border: "2px solid " + (w.hex === "#FFFFFF" ? "#E5E7EB" : "transparent"),
              }} />
            ))}
          </div>
        </div>

        {/* Size chart */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontWeight: "700", fontSize: "12px", color: "#374151", marginBottom: "8px" }}>
            Ukuran tersedia
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {ukuranTersedia.map((sz) => (
              <div key={sz} style={{
                padding: "6px 12px", borderRadius: "8px",
                background: "#F2F2F0", fontSize: "12px", fontWeight: "800",
                color: "#374151",
              }}>
                {sz}
              </div>
            ))}
          </div>
        </div>

        {item.jumlah && (
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "#F2F2F0", borderRadius: "10px", padding: "10px 14px",
            fontSize: "12px", color: "#374151", fontWeight: "700",
            marginBottom: "16px",
          }}>
            📦 Total produksi: {item.jumlah}
          </div>
        )}

        {/* Tombol aksi */}
        <button
          onClick={() => onBuatSepertiIni(item, produkDasar)}
          style={{
            width: "100%", padding: "14px",
            borderRadius: "12px", border: "none",
            background: "#0A0A0A", color: "white",
            fontWeight: "900", fontSize: "14px", cursor: "pointer",
            letterSpacing: "0.5px", marginBottom: "10px",
          }}
        >
          Buat Seperti Ini →
        </button>

        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "12px",
            borderRadius: "12px", border: "2px solid #E5E7EB",
            background: "white", fontWeight: "700", fontSize: "13px",
            color: "#6B7280", cursor: "pointer",
          }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

// ── KOMPONEN UTAMA ────────────────────────────────────────
// Props:
//   preview          — true: tampilkan max 4 karya, tanpa filter (Beranda)
//   onLihatSemua     — dipanggil saat tombol "Lihat Semua" diklik (mode preview)
//   onBuatSepertiIni — wajib: (karyaItem, produkDasar) => void — dipanggil saat
//                      customer klik "Buat Seperti Ini" di modal. Biasanya
//                      meneruskan ke CustomBuilder dgn desain awal ter-pasang.
export default function KaryaInstar({ preview = false, onLihatSemua, onBuatSepertiIni }) {
  const [filterAktif, setFilterAktif] = useState("semua");
  const [selectedItem, setSelectedItem] = useState(null);

  const karyaTampil = preview
    ? karyaData.slice(0, 4)
    : filterAktif === "semua"
      ? karyaData
      : karyaData.filter(k => k.kategori === filterAktif);

  return (
    <div>
      {/* ── HEADER ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px" }}>
        <div>
          <div style={{
            fontSize: "10px", letterSpacing: "3px", color: "#9CA3AF",
            marginBottom: "4px", textTransform: "uppercase",
          }}>
            Hasil Karya
          </div>
          <div style={{ fontWeight: 900, fontSize: "20px", color: "#0A0A0A" }}>
            Karya Instar
          </div>
        </div>
        {preview && (
          <button
            onClick={onLihatSemua}
            style={{ background: "none", border: "none", fontSize: "12px", fontWeight: "700", color: "#9CA3AF", cursor: "pointer" }}
          >
            Lihat Semua →
          </button>
        )}
      </div>

      {/* ── FILTER KATEGORI (hanya mode full) ── */}
      {!preview && (
        <div style={{
          display: "flex", gap: "8px", marginBottom: "16px",
          overflowX: "auto", paddingBottom: "4px",
        }}>
          {kategoriKarya.map((kat) => {
            const aktif = filterAktif === kat.id;
            return (
              <button
                key={kat.id}
                onClick={() => setFilterAktif(kat.id)}
                style={{
                  flexShrink:    0,
                  padding:       "8px 16px",
                  borderRadius:  "50px",
                  border:        "none",
                  background:    aktif ? "#0A0A0A" : "#FFFFFF",
                  color:         aktif ? "#FFFFFF" : "#6B7280",
                  fontSize:      "12px",
                  fontWeight:    "700",
                  cursor:        "pointer",
                  whiteSpace:    "nowrap",
                }}
              >
                {kat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── GRID KARYA ── */}
      {karyaTampil.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "40px 20px",
          color: "#9CA3AF", fontSize: "13px",
        }}>
          Belum ada karya di kategori ini.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {karyaTampil.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              style={{
                borderRadius:   "14px",
                height:         "180px",
                position:       "relative",
                overflow:       "hidden",
                border:         "none",
                cursor:         "pointer",
                padding:        0,
                background:     "#F2F2F0",
              }}
            >
              <img
                src={item.gambarUtama}
                alt={item.label}
                style={{
                  width: "100%", height: "100%",
                  objectFit: "cover", display: "block",
                }}
              />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0,
                background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
                padding: "24px 10px 10px",
              }}>
                <div style={{
                  fontSize: "11px", fontWeight: "700",
                  color: "#FFFFFF", textAlign: "left", lineHeight: 1.3,
                }}>
                  {item.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <KaryaModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onBuatSepertiIni={(item, produkDasar) => {
          setSelectedItem(null);
          onBuatSepertiIni?.(item, produkDasar);
        }}
      />
    </div>
  );
}
