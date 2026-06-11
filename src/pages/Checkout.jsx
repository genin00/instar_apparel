// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — CHECKOUT
// ═══════════════════════════════════════════════════════════

import { useState } from "react";
import Header from "../components/Header.jsx";
import config from "../config.js";
import { ukuranTersedia } from "../data/products.js";

const rp = (n) => "Rp " + n.toLocaleString("id-ID");

export default function Checkout({ items = [], onBack, onSelesai }) {
  const [nama,       setNama]       = useState("");
  const [noWA,       setNoWA]       = useState("");
  const [alamat,     setAlamat]     = useState("");
  const [pengiriman, setPengiriman] = useState("ambil"); // "ambil" | "kirim"
  const [bayar,      setBayar]      = useState(null);
  const [loading,    setLoading]    = useState(false);

  const orderId = "IA-" + Math.floor(100000 + Math.random() * 900000);

  const totalHarga  = items.reduce((a, i) => a + i.totalHarga, 0);
  const totalQty    = items.reduce((a, i) => a + i.totalQty, 0);

  const canOrder = nama && noWA && bayar &&
    (pengiriman === "ambil" || (pengiriman === "kirim" && alamat));

  const buildWAMessage = () => {
    const lines = [];
    lines.push("🧾 *PESANAN BARU — INSTAR APPAREL*");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push(`📋 *ID Pesanan:* ${orderId}`);
    lines.push(`👤 *Nama:* ${nama}`);
    lines.push(`📞 *WhatsApp:* ${noWA}`);
    lines.push(`🚚 *Pengiriman:* ${pengiriman === "ambil" ? "Ambil di Toko" : `Kirim ke: ${alamat}`}`);
    lines.push(`💳 *Pembayaran:* ${bayar}`);
    lines.push("");

    items.forEach((item, idx) => {
      lines.push(`👕 *Item ${idx + 1}: ${item.produk.nama}*`);
      lines.push(`   Warna: ${item.warnaLabel}`);

      if (item.opsiDesain === "upload") {
        const areaList = Object.keys(item.uploads || {}).join(", ");
        lines.push(`   Desain: Upload · Area: ${areaList}`);
        if (Object.keys(item.catatan || {}).length > 0) {
          Object.entries(item.catatan).forEach(([zone, note]) => {
            if (note) lines.push(`   Catatan ${zone}: ${note}`);
          });
        }
      } else {
        if (item.kodeDesain) {
          lines.push(`   Kode Desain: ${item.kodeDesain}`);
        } else {
          lines.push(`   Desain: Brief ke desainer`);
          if (item.briefKat) lines.push(`   Kategori: ${item.briefKat}`);
          if (item.briefTeks?.depan)    lines.push(`   Brief Depan: ${item.briefTeks.depan}`);
          if (item.briefTeks?.belakang) lines.push(`   Brief Belakang: ${item.briefTeks.belakang}`);
          if (item.briefTeks?.lengan)   lines.push(`   Brief Lengan: ${item.briefTeks.lengan}`);
        }
      }

      if (item.modeUkuran === "massal") {
        const ukuranList = ukuranTersedia
          .filter(sz => parseInt(item.massalQty?.[sz]) > 0)
          .map(sz => `${sz}:${item.massalQty[sz]}`)
          .join(" · ");
        lines.push(`   Ukuran: ${ukuranList}`);
      } else {
        lines.push(`   Ukuran: ${item.satuanSize} × ${item.satuanQty} pcs`);
      }
      lines.push(`   Subtotal: ${rp(item.totalHarga)}`);
      lines.push("");
    });

    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push(`📦 *Total Qty:* ${totalQty} pcs`);
    lines.push(`💰 *TOTAL BAYAR: ${rp(totalHarga)}*`);
    lines.push("");
    lines.push("_Mohon lampirkan file desain setelah mengirim pesan ini. Terima kasih! 🙏_");

    return encodeURIComponent(lines.join("\n"));
  };

  const handleOrder = () => {
    setLoading(true);
    setTimeout(() => {
      const msg = buildWAMessage();
      window.open(`https://wa.me/${config.whatsapp.bisnis}?text=${msg}`, "_blank");
      setLoading(false);
      onSelesai(orderId, { nama, noWA, bayar, pengiriman, alamat });
    }, 600);
  };

  const S = {
    card:  { background: "white", borderRadius: "14px", padding: "16px", marginBottom: "12px" },
    label: { fontWeight: "700", fontSize: "13px", color: "#374151", marginBottom: "6px" },
    input: {
      width: "100%", borderRadius: "8px", border: "2px solid #E5E7EB",
      padding: "10px 12px", fontSize: "14px", outline: "none",
      boxSizing: "border-box", fontFamily: "inherit", marginBottom: "12px",
    },
  };

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "110px" }}>
      <Header halaman="checkout" judul="Checkout" onBack={onBack} />

      <div style={{ padding: "16px", maxWidth: "480px", margin: "0 auto" }}>

        {/* ── RINGKASAN ORDER ── */}
        <div style={{ background: "#0A0A0A", borderRadius: "16px", padding: "16px", marginBottom: "12px", color: "white" }}>
          <div style={{
            fontSize: "10px", letterSpacing: "2px", color: "#6B7280",
            marginBottom: "12px", fontWeight: "700",
          }}>
            RINGKASAN PESANAN
          </div>
          {items.map((item, idx) => (
            <div key={item.id} style={{
              display: "flex", gap: "10px", alignItems: "center",
              paddingBottom: idx < items.length - 1 ? "12px" : "0",
              marginBottom: idx < items.length - 1 ? "12px" : "0",
              borderBottom: idx < items.length - 1 ? "1px solid #ffffff10" : "none",
            }}>
              <div style={{
                width: "44px", height: "50px", borderRadius: "8px",
                background: item.warna, border: "1px solid #ffffff15",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", flexShrink: 0,
              }}>👕</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", fontSize: "13px" }}>{item.produk.nama}</div>
                <div style={{ fontSize: "11px", color: "#9CA3AF" }}>
                  {item.warnaLabel} ·{" "}
                  {item.modeUkuran === "satuan"
                    ? `${item.satuanSize} × ${item.satuanQty} pcs`
                    : `Massal · ${item.totalQty} pcs`}
                </div>
              </div>
              <div style={{ fontWeight: "800", fontSize: "13px" }}>
                {rp(item.totalHarga)}
              </div>
            </div>
          ))}
          <div style={{
            borderTop: "1px solid #ffffff15", marginTop: "12px",
            paddingTop: "12px", display: "flex",
            justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: "11px", color: "#6B7280" }}>{totalQty} pcs total</div>
              <div style={{ fontWeight: "900", fontSize: "18px", color: "#C8392B" }}>
                {rp(totalHarga)}
              </div>
            </div>
            <div style={{
              background: "#1A1A1A", borderRadius: "8px",
              padding: "6px 12px", fontSize: "11px",
              color: "#6B7280", fontWeight: "700",
            }}>
              {orderId}
            </div>
          </div>
        </div>

        {/* ── DATA PEMESAN ── */}
        <div style={S.card}>
          <div style={{ fontWeight: "800", fontSize: "15px", marginBottom: "14px" }}>
            Data Pemesan
          </div>
          <div style={S.label}>Nama Lengkap</div>
          <input
            value={nama} onChange={e => setNama(e.target.value)}
            placeholder="Masukkan nama lengkap"
            style={S.input}
          />
          <div style={S.label}>Nomor WhatsApp</div>
          <input
            value={noWA} onChange={e => setNoWA(e.target.value)}
            placeholder="08xxxxxxxxxx" type="tel"
            style={S.input}
          />
        </div>

        {/* ── PENGIRIMAN ── */}
        <div style={S.card}>
          <div style={{ fontWeight: "800", fontSize: "15px", marginBottom: "14px" }}>
            Metode Pengiriman
          </div>
          {[
            { id: "ambil", label: "Ambil di Toko", sub: config.brand.address, icon: "🏪" },
            { id: "kirim", label: "Dikirim (COD area Palopo)", sub: "Ongkir disepakati via WA", icon: "🚚" },
          ].map(p => (
            <button key={p.id} onClick={() => setPengiriman(p.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: "12px",
              padding: "12px", borderRadius: "10px", border: "2px solid", marginBottom: "8px",
              borderColor: pengiriman === p.id ? "#0A0A0A" : "#E5E7EB",
              background: pengiriman === p.id ? "#F9FAFB" : "white",
              cursor: "pointer", textAlign: "left",
            }}>
              <span style={{ fontSize: "22px" }}>{p.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", fontSize: "13px", color: "#0A0A0A" }}>{p.label}</div>
                <div style={{ fontSize: "11px", color: "#9CA3AF", lineHeight: 1.4 }}>{p.sub}</div>
              </div>
              {pengiriman === p.id && (
                <div style={{
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: "#0A0A0A", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white"
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          ))}

          {pengiriman === "kirim" && (
            <div style={{ marginTop: "4px" }}>
              <div style={S.label}>Alamat Pengiriman</div>
              <textarea
                value={alamat} onChange={e => setAlamat(e.target.value)}
                placeholder="Tulis alamat lengkap..."
                style={{
                  ...S.input, minHeight: "72px",
                  resize: "none", marginBottom: 0,
                }}
              />
            </div>
          )}
        </div>

        {/* ── PEMBAYARAN ── */}
        <div style={S.card}>
          <div style={{ fontWeight: "800", fontSize: "15px", marginBottom: "14px" }}>
            Metode Pembayaran
          </div>
          {config.pembayaran.map(m => (
            <button key={m.id} onClick={() => setBayar(m.label)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: "12px",
              padding: "12px", borderRadius: "10px", border: "2px solid", marginBottom: "8px",
              borderColor: bayar === m.label ? "#C8392B" : "#E5E7EB",
              background: bayar === m.label ? "#FEF2F2" : "white",
              cursor: "pointer", textAlign: "left",
            }}>
              <span style={{ fontSize: "22px" }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: "700", fontSize: "13px",
                  color: bayar === m.label ? "#C8392B" : "#0A0A0A",
                }}>{m.label}</div>
                <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{m.sub}</div>
              </div>
              {bayar === m.label && (
                <span style={{ color: "#C8392B", fontWeight: "900", fontSize: "16px" }}>✓</span>
              )}
            </button>
          ))}
        </div>

        {/* ── CATATAN DESAIN ── */}
        <div style={{
          background: "#FEF9C3", borderRadius: "12px",
          padding: "12px 14px", fontSize: "12px",
          color: "#854D0E", border: "1px solid #FDE047",
          lineHeight: 1.5, marginBottom: "12px",
        }}>
          ⚠️ Setelah menekan tombol pesan, WhatsApp admin akan terbuka. Lampirkan file desain kamu di sana.
        </div>

      </div>

      {/* ── BOTTOM BUTTON ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "white", borderTop: "1px solid #E5E7EB",
        padding: "14px 16px", maxWidth: "480px", margin: "0 auto",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "10px",
        }}>
          <div style={{ fontSize: "12px", color: "#9CA3AF" }}>Total Pembayaran</div>
          <div style={{ fontWeight: "900", fontSize: "18px", color: "#C8392B" }}>
            {rp(totalHarga)}
          </div>
        </div>
        <button
          onClick={handleOrder}
          disabled={!canOrder || loading}
          style={{
            width: "100%", padding: "14px", borderRadius: "12px", border: "none",
            background: canOrder ? "#25D366" : "#E5E7EB",
            color: canOrder ? "white" : "#9CA3AF",
            fontWeight: "900", fontSize: "15px",
            cursor: canOrder ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: "8px",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Memproses..." : "💬 Pesan via WhatsApp"}
        </button>
      </div>

    </div>
  );
}

