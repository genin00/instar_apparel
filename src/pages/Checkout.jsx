// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — CHECKOUT (Shopee Style)
// ═══════════════════════════════════════════════════════════

import { useState } from "react";
import Header from "../components/Header.jsx";
import config from "../config.js";
import { ukuranTersedia } from "../data/products.js";
import { saveOrder } from "../services/orderService.js";

const rp = (n) => "Rp " + Math.ceil(n).toLocaleString("id-ID");

// ── WARNA FILTER (sama seperti Pesanan.jsx) ─────────────────
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

// ── SVG ICONS ───────────────────────────────────────────────
const IconCart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconTag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const IconCheck = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconChevronDown = ({ rotate }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    style={{ transform: rotate ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
    <path d="M6 9l6 6 6-6"/>
  </svg>
);
const IconStore = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconBike = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>
    <path d="M15 6a1 1 0 0 0-1-1h-1l-5 8h8.5"/>
    <path d="M12 6l2 4h4"/>
  </svg>
);
const IconTruck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const IconWallet = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const IconNote = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

// ── PENGIRIMAN ICON MAP ──────────────────────────────────────
const pengirimanIcon = {
  toko:      <IconStore />,
  kurir:     <IconBike />,
  ekspedisi: <IconTruck />,
};

// ── VOUCHER HELPER ──────────────────────────────────────────
const hitungDiskon = (voucher, subtotal, ongkir) => {
  if (!voucher) return { diskonProduk: 0, diskonOngkir: 0 };
  if (voucher.jenis === "persen")
    return { diskonProduk: Math.ceil(subtotal * voucher.nilai / 100), diskonOngkir: 0 };
  if (voucher.jenis === "nominal")
    return { diskonProduk: voucher.nilai, diskonOngkir: 0 };
  if (voucher.jenis === "freeOngkir")
    return { diskonProduk: 0, diskonOngkir: ongkir };
  return { diskonProduk: 0, diskonOngkir: 0 };
};

const cekVoucher = (kode, subtotal) => {
  const now = new Date();
  const v = config.voucher.find(v =>
    v.kode === kode.toUpperCase() && v.aktif &&
    new Date(v.expired) >= now &&
    subtotal >= v.minOrder
  );
  return v || null;
};

export default function Checkout({ items = [], onBack, onSelesai }) {
  const [nama,          setNama]          = useState("");
  const [noWA,          setNoWA]          = useState("");
  const [alamat,        setAlamat]        = useState("");
  const [catatanAdmin,  setCatatanAdmin]  = useState("");
  const [pengiriman,    setPengiriman]    = useState(null);
  const [ekspedisi,     setEkspedisi]     = useState("");
  const [tipeBayar,     setTipeBayar]     = useState(null);
  const [metodeBayar,   setMetodeBayar]   = useState(null);
  const [voucherInput,  setVoucherInput]  = useState("");
  const [voucher,       setVoucher]       = useState(null);
  const [voucherError,  setVoucherError]  = useState("");
  const [voucherOk,     setVoucherOk]     = useState(false);
  const [loading,       setLoading]       = useState(false);

  const orderId    = useState("IA-" + Math.floor(100000 + Math.random() * 900000))[0];
  const subtotal   = items.reduce((a, i) => a + i.totalHarga, 0);
  const totalQty   = items.reduce((a, i) => a + i.totalQty, 0);
  const pilihanP   = config.pengiriman.find(p => p.id === pengiriman);
  const ongkir     = pilihanP?.freeOngkir ? 0 : (pilihanP?.ongkir || 0);
  const { diskonProduk, diskonOngkir } = hitungDiskon(voucher, subtotal, ongkir);
  const totalSetelahDiskon = subtotal + ongkir - diskonProduk - diskonOngkir;
  const totalBayar = tipeBayar === "dp"
    ? Math.ceil(totalSetelahDiskon * 0.5 / 1000) * 1000
    : totalSetelahDiskon;

  const canOrder = nama && noWA && pengiriman && tipeBayar && metodeBayar &&
    (pengiriman !== "ekspedisi" || (alamat && ekspedisi)) &&
    (pengiriman !== "kurir" || alamat);

  const handlePakaiVoucher = () => {
    if (!voucherInput.trim()) { setVoucherError("Masukkan kode voucher"); return; }
    const v = cekVoucher(voucherInput, subtotal);
    if (!v) {
      setVoucherError("Kode tidak valid, sudah expired, atau tidak memenuhi syarat");
      setVoucher(null); setVoucherOk(false);
    } else {
      setVoucher(v); setVoucherOk(true); setVoucherError("");
    }
  };

  const handleOrder = async () => {
    setLoading(true);

    const pesananBaru = {
      orderId,
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
      }),
      status: "diterima",
      items,
      totalQty,
      totalHarga: totalBayar,
      nama,
      noWA,
      tipeBayar,
      metodeBayar,
      pengiriman,
      alamat,
      ekspedisi,
      voucher: voucher?.kode || null,
      catatanAdmin,
    };

    await saveOrder(pesananBaru);
    setLoading(false);
    onSelesai(orderId, { nama, noWA, tipeBayar, metodeBayar, pengiriman, alamat });
  };

  const S = {
    section: {
      background: "white", borderRadius: "14px",
      padding: "16px", marginBottom: "12px",
    },
    sectionTitle: {
      fontSize: "11px", fontWeight: "800", letterSpacing: "1.5px",
      color: "#9CA3AF", marginBottom: "14px", textTransform: "uppercase",
    },
    label: { fontWeight: "700", fontSize: "13px", color: "#374151", marginBottom: "6px" },
    input: {
      width: "100%", borderRadius: "10px", border: "2px solid #E5E7EB",
      padding: "11px 14px", fontSize: "14px", outline: "none",
      boxSizing: "border-box", fontFamily: "inherit", marginBottom: "12px",
      background: "white", color: "#0A0A0A",
    },
  };

  // ── MOCKUP SRC helper ──────────────────────────────────────
  const getMockupSrc = (produkId) => {
    if (produkId === "lengan-panjang") return "/mockup-panjang.png";
    if (produkId === "rib")            return "/mockup-rib.png";
    return "/mockup-pendek.png";
  };

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "110px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Header halaman="checkout" judul="Checkout" onBack={onBack} />

      <div style={{ padding: "12px 14px", maxWidth: "480px", margin: "0 auto" }}>

        {/* ── RINGKASAN PRODUK ── */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Ringkasan Pesanan</div>
          {items.map((item, idx) => (
            <div key={item.id} style={{
              display: "flex", gap: "12px", alignItems: "flex-start",
              paddingBottom: idx < items.length-1 ? "12px" : "0",
              marginBottom: idx < items.length-1 ? "12px" : "0",
              borderBottom: idx < items.length-1 ? "1px solid #F2F2F0" : "none",
            }}>
              <div style={{
                width: "64px", height: "72px", borderRadius: "10px",
                background: "#F8FAFC", border: "1px solid #E5E7EB",
                flexShrink: 0, overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "4px", boxSizing: "border-box",
              }}>
                <img
                  src={getMockupSrc(item.produk.id)}
                  alt={item.produk.nama}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: getShirtFilter(item.warna),
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "800", fontSize: "14px", marginBottom: "2px" }}>
                  {item.produk.nama}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
                  <div style={{
                    width: "10px", height: "10px", borderRadius: "50%",
                    background: item.warna, border: "1px solid #E5E7EB", flexShrink: 0,
                  }} />
                  <div style={{ fontSize: "11px", color: "#9CA3AF" }}>
                    {item.warnaLabel} ·{" "}
                    {item.modeUkuran === "satuan"
                      ? `${item.satuanSize} × ${item.satuanQty} pcs`
                      : `Massal · ${item.totalQty} pcs`}
                  </div>
                </div>
                <div style={{ fontSize: "11px", color: "#9CA3AF" }}>
                  {item.opsiDesain === "upload"
                    ? `Desain upload · ${Object.keys(item.uploads||{}).length} area`
                    : item.kodeDesain ? `Kode: ${item.kodeDesain}` : "Brief ke desainer"}
                </div>
              </div>
              <div style={{ fontWeight: "900", fontSize: "14px", color: "#C8392B", flexShrink: 0 }}>
                {rp(item.totalHarga)}
              </div>
            </div>
          ))}

          {/* ID Pesanan */}
          <div style={{
            marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #F2F2F0",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: "12px", color: "#9CA3AF" }}>ID Pesanan</span>
            <span style={{
              background: "#0A0A0A", color: "white",
              fontSize: "11px", fontWeight: "800",
              padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.5px",
            }}>{orderId}</span>
          </div>
        </div>

        {/* ── DATA PEMESAN ── */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Data Pemesan</div>
          <div style={S.label}>Nama Lengkap</div>
          <input value={nama} onChange={e => setNama(e.target.value)}
            placeholder="Masukkan nama lengkap" style={S.input} />
          <div style={S.label}>Nomor WhatsApp</div>
          <input value={noWA} onChange={e => setNoWA(e.target.value)}
            placeholder="08xxxxxxxxxx" type="tel" style={{ ...S.input, marginBottom: 0 }} />
        </div>

        {/* ── PENGIRIMAN ── */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Opsi Pengiriman</div>
          {config.pengiriman.map(p => (
            <button key={p.id} onClick={() => { setPengiriman(p.id); setAlamat(""); setEkspedisi(""); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 14px", borderRadius: "12px", border: "2px solid",
                borderColor: pengiriman === p.id ? "#0A0A0A" : "#E5E7EB",
                background: pengiriman === p.id ? "#F9FAFB" : "white",
                cursor: "pointer", marginBottom: "8px", textAlign: "left",
              }}>
              <span style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: pengiriman === p.id ? "#0A0A0A" : "#F2F2F0",
                color: pengiriman === p.id ? "white" : "#6B7280",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.2s",
              }}>
                {pengirimanIcon[p.id] || <IconTruck />}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", fontSize: "13px", color: "#0A0A0A" }}>{p.label}</div>
                <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>{p.sub}</div>
                {p.id !== "toko" && p.ongkir > 0 && !p.freeOngkir && (
                  <div style={{ fontSize: "11px", color: "#C8392B", fontWeight: "700", marginTop: "2px" }}>
                    Ongkir: {rp(p.ongkir)}
                  </div>
                )}
                {p.freeOngkir && (
                  <div style={{ fontSize: "11px", color: "#10B981", fontWeight: "700", marginTop: "2px" }}>
                    Gratis Ongkir
                  </div>
                )}
              </div>
              {pengiriman === p.id && (
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: "#0A0A0A", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <IconCheck />
                </div>
              )}
            </button>
          ))}

          {pengiriman === "kurir" && (
            <div style={{ marginTop: "4px" }}>
              <div style={S.label}>Alamat Pengiriman</div>
              <textarea value={alamat} onChange={e => setAlamat(e.target.value)}
                placeholder="Tulis alamat lengkap di area Kota Palopo..."
                style={{
                  width: "100%", minHeight: "72px", borderRadius: "10px",
                  border: "2px solid #E5E7EB", padding: "11px 14px",
                  fontSize: "13px", resize: "none", outline: "none",
                  boxSizing: "border-box", fontFamily: "inherit",
                }} />
            </div>
          )}

          {pengiriman === "ekspedisi" && (
            <div style={{ marginTop: "4px" }}>
              <div style={S.label}>Pilih Ekspedisi</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                {config.pengiriman.find(p => p.id === "ekspedisi")?.pilihanEkspedisi.map(e => (
                  <button key={e} onClick={() => setEkspedisi(e)} style={{
                    padding: "6px 14px", borderRadius: "20px", border: "2px solid",
                    borderColor: ekspedisi === e ? "#C8392B" : "#E5E7EB",
                    background: ekspedisi === e ? "#FEF2F2" : "white",
                    fontSize: "12px", fontWeight: "700", cursor: "pointer",
                    color: ekspedisi === e ? "#C8392B" : "#374151",
                  }}>{e}</button>
                ))}
              </div>
              <div style={S.label}>Alamat Lengkap</div>
              <textarea value={alamat} onChange={e => setAlamat(e.target.value)}
                placeholder="Tulis alamat lengkap dengan kode pos..."
                style={{
                  width: "100%", minHeight: "80px", borderRadius: "10px",
                  border: "2px solid #E5E7EB", padding: "11px 14px",
                  fontSize: "13px", resize: "none", outline: "none",
                  boxSizing: "border-box", fontFamily: "inherit",
                }} />
            </div>
          )}
        </div>

        {/* ── PESAN UNTUK ADMIN ── */}
        <div style={S.section}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
            <span style={{ color: "#9CA3AF" }}><IconNote /></span>
            <span style={{ ...S.sectionTitle, marginBottom: 0 }}>Pesan untuk Admin</span>
          </div>
          <textarea value={catatanAdmin} onChange={e => setCatatanAdmin(e.target.value)}
            placeholder="Tulis catatan tambahan untuk admin... (opsional)"
            style={{
              width: "100%", minHeight: "64px", borderRadius: "10px",
              border: "2px solid #E5E7EB", padding: "11px 14px",
              fontSize: "13px", resize: "none", outline: "none",
              boxSizing: "border-box", fontFamily: "inherit",
            }} />
        </div>

        {/* ── VOUCHER ── */}
        <div style={S.section}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
            <span style={{ color: "#9CA3AF" }}><IconTag /></span>
            <span style={{ ...S.sectionTitle, marginBottom: 0 }}>Voucher</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              value={voucherInput}
              onChange={e => { setVoucherInput(e.target.value.toUpperCase()); setVoucherError(""); setVoucherOk(false); setVoucher(null); }}
              placeholder="Masukkan kode voucher"
              style={{
                flex: 1, borderRadius: "10px", border: "2px solid",
                borderColor: voucherOk ? "#10B981" : voucherError ? "#C8392B" : "#E5E7EB",
                padding: "11px 14px", fontSize: "14px", fontWeight: "700",
                outline: "none", fontFamily: "inherit",
                letterSpacing: "1px",
                color: voucherOk ? "#10B981" : "#374151",
              }}
            />
            <button onClick={handlePakaiVoucher} style={{
              padding: "11px 18px", borderRadius: "10px", border: "none",
              background: "#0A0A0A", color: "white",
              fontWeight: "800", fontSize: "13px", cursor: "pointer", flexShrink: 0,
            }}>Pakai</button>
          </div>
          {voucherError && (
            <div style={{ fontSize: "12px", color: "#C8392B", marginTop: "6px", fontWeight: "600" }}>
              {voucherError}
            </div>
          )}
          {voucherOk && voucher && (
            <div style={{
              marginTop: "8px", background: "#ECFDF5", borderRadius: "8px",
              padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "800", color: "#065F46" }}>
                  {voucher.kode} — {voucher.label}
                </div>
                {voucher.minOrder > 0 && (
                  <div style={{ fontSize: "11px", color: "#6B7280" }}>
                    Min. order {rp(voucher.minOrder)}
                  </div>
                )}
              </div>
              <button onClick={() => { setVoucher(null); setVoucherOk(false); setVoucherInput(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: "18px" }}>
                ×
              </button>
            </div>
          )}
        </div>

        {/* ── OPSI PEMBAYARAN ── */}
        <div style={S.section}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
            <span style={{ color: "#9CA3AF" }}><IconWallet /></span>
            <span style={{ ...S.sectionTitle, marginBottom: 0 }}>Opsi Pembayaran</span>
          </div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
            {[
              { id: "lunas", label: "Lunas",   sub: "Bayar penuh" },
              { id: "dp",    label: "DP 50%",  sub: `Bayar ${rp(Math.ceil(totalSetelahDiskon * 0.5 / 1000) * 1000)}` },
            ].map(t => (
              <button key={t.id} onClick={() => setTipeBayar(t.id)} style={{
                flex: 1, padding: "12px", borderRadius: "12px", border: "2px solid",
                borderColor: tipeBayar === t.id ? "#C8392B" : "#E5E7EB",
                background: tipeBayar === t.id ? "#FEF2F2" : "white",
                cursor: "pointer", textAlign: "center",
              }}>
                <div style={{ fontWeight: "800", fontSize: "13px", color: tipeBayar === t.id ? "#C8392B" : "#0A0A0A" }}>
                  {t.label}
                </div>
                <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>{t.sub}</div>
              </button>
            ))}
          </div>

          <div style={S.sectionTitle}>Metode Pembayaran</div>
          {config.metodeBayar.map(m => (
            <button key={m.id} onClick={() => setMetodeBayar(m.label)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 14px", borderRadius: "12px", border: "2px solid",
              borderColor: metodeBayar === m.label ? "#C8392B" : "#E5E7EB",
              background: metodeBayar === m.label ? "#FEF2F2" : "white",
              cursor: "pointer", marginBottom: "8px", textAlign: "left",
            }}>
              <span style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: metodeBayar === m.label ? "#FEF2F2" : "#F2F2F0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", flexShrink: 0,
              }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", fontSize: "13px", color: metodeBayar === m.label ? "#C8392B" : "#0A0A0A" }}>
                  {m.label}
                </div>
                <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{m.sub}</div>
              </div>
              {metodeBayar === m.label && (
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: "#C8392B", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <IconCheck />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ── RINCIAN PEMBAYARAN ── */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Rincian Pembayaran</div>
          {[
            { label: "Subtotal Produk",   value: rp(subtotal),    show: true },
            { label: `Ongkir (${pilihanP?.label || "-"})`, value: ongkir > 0 ? rp(ongkir) : "Gratis", show: !!pengiriman },
            { label: `Diskon (${voucher?.kode || ""})`,    value: `-${rp(diskonProduk)}`,  show: diskonProduk > 0, green: true },
            { label: "Diskon Ongkir",     value: `-${rp(diskonOngkir)}`, show: diskonOngkir > 0, green: true },
          ].filter(r => r.show).map((row, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              fontSize: "13px", marginBottom: "8px",
            }}>
              <span style={{ color: "#6B7280" }}>{row.label}</span>
              <span style={{ fontWeight: "600", color: row.green ? "#10B981" : "#0A0A0A" }}>{row.value}</span>
            </div>
          ))}

          {tipeBayar === "dp" && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
              <span style={{ color: "#6B7280" }}>Total Keseluruhan</span>
              <span style={{ fontWeight: "600", color: "#0A0A0A" }}>{rp(totalSetelahDiskon)}</span>
            </div>
          )}

          <div style={{
            borderTop: "2px solid #F2F2F0", marginTop: "8px", paddingTop: "12px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontWeight: "800", fontSize: "15px", color: "#0A0A0A" }}>
                {tipeBayar === "dp" ? "DP 50% yang harus dibayar" : "Total Pembayaran"}
              </div>
              {tipeBayar === "dp" && (
                <div style={{ fontSize: "11px", color: "#9CA3AF" }}>
                  Sisa {rp(totalSetelahDiskon - totalBayar)} dibayar saat selesai
                </div>
              )}
            </div>
            <div style={{ fontWeight: "900", fontSize: "20px", color: "#C8392B" }}>
              {rp(totalBayar)}
            </div>
          </div>
        </div>

        {/* ── CATATAN ── */}
        <div style={{
          background: "#FEF9C3", borderRadius: "12px",
          padding: "12px 14px", fontSize: "12px",
          color: "#854D0E", border: "1px solid #FDE047",
          lineHeight: 1.5, marginBottom: "12px",
          display: "flex", alignItems: "flex-start", gap: "8px",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#854D0E" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: "1px" }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Pesanan kamu akan langsung tersimpan. Admin akan menghubungi kamu via WhatsApp untuk konfirmasi.
        </div>

      </div>

      {/* ── BOTTOM FIXED ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "white", borderTop: "1px solid #E5E7EB",
        padding: "12px 16px", maxWidth: "480px", margin: "0 auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "11px", color: "#9CA3AF" }}>
              {tipeBayar === "dp" ? "DP 50%" : "Total Pembayaran"}
            </div>
            <div style={{ fontWeight: "900", fontSize: "20px", color: "#C8392B" }}>
              {rp(totalBayar)}
            </div>
          </div>
          <button
            onClick={handleOrder}
            disabled={!canOrder || loading}
            style={{
              padding: "13px 24px", borderRadius: "12px", border: "none",
              background: canOrder ? "#0A0A0A" : "#E5E7EB",
              color: canOrder ? "white" : "#9CA3AF",
              fontWeight: "800", fontSize: "14px",
              cursor: canOrder ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", gap: "8px",
              opacity: loading ? 0.7 : 1, transition: "all 0.2s",
            }}
          >
            {loading ? (
              "Memproses..."
            ) : (
              <>
                <IconCart />
                Buat Pesanan
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}

