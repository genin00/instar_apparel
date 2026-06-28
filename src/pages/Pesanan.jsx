// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — PESANAN (Tokopedia-style)
// ═══════════════════════════════════════════════════════════

import { useState } from "react";
import config from "../config.js";

const rp = (n) => "Rp " + (n || 0).toLocaleString("id-ID");

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

const TABS = [
  { id: "semua",    label: "Semua" },
  { id: "diterima", label: "Belum Bayar" },
  { id: "desain",   label: "Desain" },
  { id: "produksi", label: "Produksi" },
  { id: "dikirim",  label: "Dikirim" },
  { id: "selesai",  label: "Selesai" },
];

const STATUS_LABEL = {
  diterima:   "Belum Bayar",
  konfirmasi: "Konfirmasi",
  desain:     "Proses Desain",
  produksi:   "Produksi",
  qc:         "Quality Check",
  dikirim:    "Dikirim",
  selesai:    "Selesai",
};

const STATUS_COLOR = {
  diterima:   { bg: "#FEF9C3", text: "#854D0E" },
  konfirmasi: { bg: "#FEF3C7", text: "#92400E" },
  desain:     { bg: "#EFF6FF", text: "#1D4ED8" },
  produksi:   { bg: "#F0FDF4", text: "#166534" },
  qc:         { bg: "#F5F3FF", text: "#6D28D9" },
  dikirim:    { bg: "#E0F2FE", text: "#0369A1" },
  selesai:    { bg: "#ECFDF5", text: "#065F46" },
};

const STATUS_FLOW = [
  { id: "diterima",   label: "Pesanan Diterima" },
  { id: "konfirmasi", label: "Konfirmasi Pembayaran" },
  { id: "desain",     label: "Proses Desain" },
  { id: "produksi",   label: "Produksi" },
  { id: "qc",         label: "Quality Check" },
  { id: "dikirim",    label: "Dikirim" },
  { id: "selesai",    label: "Selesai" },
];

function RincianPesanan({ pesanan, onBack }) {
  const statusIdx = STATUS_FLOW.findIndex(s => s.id === pesanan.status);
  const sc = STATUS_COLOR[pesanan.status] || STATUS_COLOR.diterima;

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
      <div style={{
        background: "white", padding: "14px 16px",
        display: "flex", alignItems: "center", gap: "12px",
        borderBottom: "1px solid #E5E7EB", position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ fontWeight: "800", fontSize: "16px", color: "#0A0A0A" }}>Rincian Pesanan</div>
      </div>

      <div style={{ padding: "14px 16px" }}>

        <div style={{
          background: sc.bg, borderRadius: "14px",
          padding: "14px 16px", marginBottom: "12px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: "11px", color: sc.text, fontWeight: "700", marginBottom: "2px" }}>STATUS PESANAN</div>
            <div style={{ fontSize: "15px", fontWeight: "900", color: sc.text }}>
              {STATUS_LABEL[pesanan.status] || pesanan.status}
            </div>
          </div>
          <div style={{ fontSize: "28px" }}>
            {pesanan.status === "selesai" ? "✅" : pesanan.status === "dikirim" ? "🚚" : pesanan.status === "produksi" ? "🏭" : pesanan.status === "desain" ? "🎨" : "📦"}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "14px", padding: "16px", marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#9CA3AF", letterSpacing: "1.5px", marginBottom: "14px" }}>
            TRACKING PESANAN
          </div>
          {STATUS_FLOW.map((s, i) => {
            const done   = i < statusIdx;
            const active = i === statusIdx;
            return (
              <div key={s.id} style={{ display: "flex", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                    background: done ? "#0A0A0A" : active ? "#C8392B" : "#E5E7EB",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", color: done || active ? "white" : "#9CA3AF", fontWeight: "800",
                  }}>
                    {done ? "✓" : i + 1}
                  </div>
                  {i < STATUS_FLOW.length - 1 && (
                    <div style={{ width: "2px", flex: 1, minHeight: "18px", background: done ? "#0A0A0A" : "#E5E7EB" }} />
                  )}
                </div>
                <div style={{ paddingBottom: "14px", flex: 1 }}>
                  <div style={{
                    fontWeight: active ? "800" : done ? "600" : "400",
                    fontSize: "13px",
                    color: active ? "#C8392B" : done ? "#0A0A0A" : "#9CA3AF",
                  }}>
                    {s.label}
                  </div>
                  {active && (
                    <div style={{ fontSize: "11px", color: "#C8392B", marginTop: "2px" }}>Sedang diproses...</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: "white", borderRadius: "14px", padding: "16px", marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#9CA3AF", letterSpacing: "1.5px", marginBottom: "14px" }}>
            INFO PESANAN
          </div>
          {[
            { label: "No. Pesanan", value: pesanan.orderId },
            { label: "Tanggal", value: pesanan.tanggal },
            { label: "Total Item", value: pesanan.totalQty + " pcs" },
            { label: "Metode Bayar", value: pesanan.metodePembayaran || "-" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ fontSize: "13px", color: "#6B7280" }}>{row.label}</div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#0A0A0A" }}>{row.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "white", borderRadius: "14px", padding: "16px", marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#9CA3AF", letterSpacing: "1.5px", marginBottom: "14px" }}>
            PRODUK
          </div>
          {pesanan.items?.map((item, idx) => (
            <div key={idx} style={{
              display: "flex", gap: "12px",
              paddingBottom: idx < pesanan.items.length - 1 ? "12px" : "0",
              borderBottom: idx < pesanan.items.length - 1 ? "1px solid #F2F2F0" : "none",
              marginBottom: idx < pesanan.items.length - 1 ? "12px" : "0",
            }}>
              <div style={{ width: "60px", height: "60px", flexShrink: 0, background: "#F8FAFC", borderRadius: "10px", padding: "4px", border: "1px solid #E5E7EB" }}>
                <img
                  src={item.produk?.id === "lengan-panjang" ? "/mockup-panjang.png" : item.produk?.id === "rib" ? "/mockup-rib.png" : "/mockup-pendek.png"}
                  alt="kaos"
                  style={{ width: "100%", display: "block", filter: getShirtFilter(item.warna) }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", fontSize: "13px", color: "#0A0A0A", marginBottom: "4px" }}>
                  {item.produk?.nama || item.nama || "Kaos Custom"}
                </div>
                <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "4px" }}>
                  {item.warnaLabel || "-"} · {item.modeUkuran === "satuan" ? item.satuanSize + " x " + item.satuanQty + " pcs" : "Massal · " + item.totalQty + " pcs"}
                </div>
                <div style={{ fontWeight: "800", fontSize: "13px", color: "#0A0A0A" }}>
                  {rp(item.totalHarga)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "white", borderRadius: "14px", padding: "16px", marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#9CA3AF", letterSpacing: "1.5px", marginBottom: "14px" }}>
            RINCIAN PEMBAYARAN
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <div style={{ fontSize: "13px", color: "#6B7280" }}>Subtotal Produk</div>
            <div style={{ fontSize: "13px", color: "#0A0A0A" }}>{rp(pesanan.totalHarga)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <div style={{ fontSize: "13px", color: "#6B7280" }}>Ongkir</div>
            <div style={{ fontSize: "13px", color: "#0A0A0A" }}>{rp(pesanan.ongkir || 0)}</div>
          </div>
          <div style={{ height: "1px", background: "#F2F2F0", margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "14px", fontWeight: "800", color: "#0A0A0A" }}>Total</div>
            <div style={{ fontSize: "14px", fontWeight: "900", color: "#C8392B" }}>{rp((pesanan.totalHarga || 0) + (pesanan.ongkir || 0))}</div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#9CA3AF", letterSpacing: "1.5px", padding: "16px 16px 10px" }}>
            BUTUH BANTUAN?
          </div>
          <button
            onClick={() => window.open("https://wa.me/" + config.whatsapp.bisnis, "_blank")}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "12px",
              background: "none", border: "none", borderTop: "1px solid #F2F2F0",
              padding: "14px 16px", cursor: "pointer", textAlign: "left",
            }}
          >
            <span style={{ fontSize: "20px" }}>💬</span>
            <span style={{ flex: 1, fontSize: "13px", fontWeight: "600", color: "#0A0A0A" }}>Hubungi Customer Service</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}

function PesananCard({ pesanan, onLihatRincian }) {
  const sc = STATUS_COLOR[pesanan.status] || STATUS_COLOR.diterima;
  const firstItem = pesanan.items?.[0];

  return (
    <div style={{ background: "white", borderRadius: "16px", marginBottom: "10px", overflow: "hidden" }}>
      <div style={{
        padding: "10px 14px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #F2F2F0",
      }}>
        <div style={{ fontWeight: "800", fontSize: "12px", color: "#0A0A0A" }}>Instar Apparel</div>
        <div style={{ background: sc.bg, color: sc.text, fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px" }}>
          {STATUS_LABEL[pesanan.status] || pesanan.status}
        </div>
      </div>

      <div style={{ padding: "12px 14px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div style={{ width: "64px", height: "64px", flexShrink: 0, background: "#F8FAFC", borderRadius: "10px", padding: "4px", border: "1px solid #E5E7EB" }}>
          <img
            src={firstItem?.produk?.id === "lengan-panjang" ? "/mockup-panjang.png" : firstItem?.produk?.id === "rib" ? "/mockup-rib.png" : "/mockup-pendek.png"}
            alt="kaos"
            style={{ width: "100%", display: "block", filter: getShirtFilter(firstItem?.warna) }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "700", fontSize: "13px", color: "#0A0A0A", marginBottom: "2px" }}>
            {firstItem?.produk?.nama || firstItem?.nama || "Kaos Custom"}
          </div>
          <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "4px" }}>
            {firstItem?.warnaLabel || "-"} · x{pesanan.totalQty}
          </div>
          {pesanan.items?.length > 1 && (
            <div style={{ fontSize: "11px", color: "#9CA3AF" }}>+{pesanan.items.length - 1} produk lainnya</div>
          )}
          <div style={{ fontWeight: "800", fontSize: "13px", color: "#0A0A0A", marginTop: "4px" }}>
            {rp(pesanan.totalHarga)}
          </div>
        </div>
      </div>

      <div style={{ padding: "8px 14px", borderTop: "1px solid #F2F2F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "12px", color: "#6B7280" }}>Total Pesanan</div>
        <div style={{ fontWeight: "900", fontSize: "14px", color: "#0A0A0A" }}>{rp(pesanan.totalHarga)}</div>
      </div>

      <div style={{ padding: "10px 14px", borderTop: "1px solid #F2F2F0", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <button
          onClick={() => onLihatRincian(pesanan)}
          style={{ background: "none", border: "1.5px solid #E5E7EB", borderRadius: "10px", padding: "8px 16px", fontSize: "12px", fontWeight: "700", color: "#374151", cursor: "pointer" }}
        >
          Lihat Detail
        </button>
        {pesanan.status === "dikirim" && (
          <button
            onClick={() => window.open("https://wa.me/" + config.whatsapp.bisnis + "?text=" + encodeURIComponent("Halo, saya ingin lacak pesanan #" + pesanan.orderId), "_blank")}
            style={{ background: "#0A0A0A", border: "none", borderRadius: "10px", padding: "8px 16px", fontSize: "12px", fontWeight: "700", color: "white", cursor: "pointer" }}
          >
            Lacak
          </button>
        )}
        {pesanan.status === "selesai" && (
          <button style={{ background: "#C8392B", border: "none", borderRadius: "10px", padding: "8px 16px", fontSize: "12px", fontWeight: "700", color: "white", cursor: "pointer" }}>
            Beri Ulasan
          </button>
        )}
      </div>
    </div>
  );
}

export default function Pesanan({ pesananList = [], filterStatus = null, onBack }) {
  const [tab, setTab]         = useState("semua");
  const [rincian, setRincian] = useState(null);

  if (rincian) {
    return <RincianPesanan pesanan={rincian} onBack={() => setRincian(null)} />;
  }

  const tampil = tab === "semua"
    ? pesananList
    : tab === "diterima" ? pesananList.filter(p => ["diterima","konfirmasi"].includes(p.status))
    : tab === "produksi" ? pesananList.filter(p => ["produksi","qc"].includes(p.status))
    : pesananList.filter(p => p.status === tab);

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh" }}>

      <div style={{
        background: "white", padding: "14px 16px",
        display: "flex", alignItems: "center", gap: "12px",
        borderBottom: "1px solid #E5E7EB", position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ fontWeight: "800", fontSize: "16px", color: "#0A0A0A" }}>Pesanan Saya</div>
      </div>

      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", display: "flex", overflowX: "auto", padding: "0 8px", scrollbarWidth: "none" }}>
        {TABS.map(t => {
          const count = t.id === "semua" ? pesananList.length
            : t.id === "diterima" ? pesananList.filter(p => ["diterima","konfirmasi"].includes(p.status)).length
            : t.id === "produksi" ? pesananList.filter(p => ["produksi","qc"].includes(p.status)).length
            : pesananList.filter(p => p.status === t.id).length;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flexShrink: 0, padding: "12px 14px",
              background: "none", border: "none",
              borderBottom: tab === t.id ? "2.5px solid #C8392B" : "2.5px solid transparent",
              fontWeight: tab === t.id ? "800" : "500",
              fontSize: "13px",
              color: tab === t.id ? "#C8392B" : "#6B7280",
              cursor: "pointer", whiteSpace: "nowrap",
            }}>
              {t.label}{count > 0 ? " (" + count + ")" : ""}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "14px 16px", paddingBottom: "80px" }}>
        {tampil.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📦</div>
            <div style={{ fontWeight: "700", fontSize: "15px", color: "#374151", marginBottom: "6px" }}>Belum ada pesanan</div>
            <div style={{ fontSize: "12px", color: "#9CA3AF" }}>Pesanan kamu akan muncul di sini</div>
          </div>
        ) : (
          tampil.map(p => (
            <PesananCard key={p.orderId} pesanan={p} onLihatRincian={setRincian} />
          ))
        )}
      </div>

    </div>
  );
}
