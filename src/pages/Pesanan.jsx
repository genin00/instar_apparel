// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — PESANAN
//  Riwayat pesanan + cek status via WA
// ═══════════════════════════════════════════════════════════

import { useState } from "react";
import Header from "../components/Header.jsx";
import config from "../config.js";
import { sudahReview } from "../services/reviewService.js";

const rp = (n) => "Rp " + n.toLocaleString("id-ID");

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

const STATUS_FLOW = [
  { id: "diterima",   label: "Pesanan Diterima",       icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  { id: "konfirmasi", label: "Konfirmasi Pembayaran",  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/></svg> },
  { id: "desain",     label: "Proses Desain",          icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: "produksi",   label: "Produksi",               icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
  { id: "qc",         label: "Quality Check",          icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="M21 21l-4.35-4.35M8 11l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: "selesai",    label: "Selesai / Siap Diambil", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

function StatusBadge({ status }) {
  const colors = {
    diterima:   { bg: "#FEF9C3", text: "#854D0E" },
    konfirmasi: { bg: "#FEF3C7", text: "#92400E" },
    desain:     { bg: "#EFF6FF", text: "#1D4ED8" },
    produksi:   { bg: "#F0FDF4", text: "#166534" },
    qc:         { bg: "#F5F3FF", text: "#6D28D9" },
    selesai:    { bg: "#ECFDF5", text: "#065F46" },
  };
  const c = colors[status] || colors.diterima;
  const s = STATUS_FLOW.find(s => s.id === status);
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      background: c.bg, color: c.text,
      padding: "3px 10px", borderRadius: "20px",
      fontSize: "11px", fontWeight: "700",
    }}>
      {s?.icon} {s?.label}
    </div>
  );
}

function PesananCard({ pesanan, onBeriUlasan }) {
  const [expand, setExpand] = useState(false);
  const statusIdx = STATUS_FLOW.findIndex(s => s.id === pesanan.status);

  return (
    <div style={{
      background: "white", borderRadius: "14px",
      marginBottom: "10px", overflow: "hidden",
    }}>
      {/* Header card */}
      <div
        onClick={() => setExpand(!expand)}
        style={{
          padding: "14px 16px", cursor: "pointer",
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", gap: "10px",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <div style={{
              background: "#0A0A0A", color: "white",
              fontSize: "11px", fontWeight: "800",
              padding: "3px 10px", borderRadius: "20px",
              letterSpacing: "0.5px",
            }}>
              {pesanan.orderId}
            </div>
            <div style={{ fontSize: "11px", color: "#9CA3AF" }}>
              {pesanan.tanggal}
            </div>
          </div>
          <div style={{ fontWeight: "800", fontSize: "14px", marginBottom: "4px" }}>
            {pesanan.items?.map(i => i.produk.nama).join(", ")}
          </div>
          <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "6px" }}>
            {pesanan.totalQty} pcs · {rp(pesanan.totalHarga)}
          </div>
          <StatusBadge status={pesanan.status} />
        </div>
        <div style={{
          color: "#9CA3AF", fontSize: "18px",
          transform: expand ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }}>
          ⌄
        </div>
      </div>

      {/* Detail expand */}
      {expand && (
        <div style={{ borderTop: "1px solid #F2F2F0", padding: "14px 16px" }}>

          {/* Timeline status */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{
              fontSize: "10px", fontWeight: "700",
              color: "#9CA3AF", letterSpacing: "1.5px",
              marginBottom: "12px",
            }}>
              STATUS PESANAN
            </div>
            {STATUS_FLOW.map((s, i) => {
              const done   = i < statusIdx;
              const active = i === statusIdx;
              return (
                <div key={s.id} style={{ display: "flex", gap: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: "24px", height: "24px", borderRadius: "50%",
                      background: done ? "#0A0A0A" : active ? "#C8392B" : "#E5E7EB",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: done ? "11px" : "12px",
                      color: done || active ? "white" : "#9CA3AF",
                      fontWeight: "800", flexShrink: 0,
                    }}>
                      {done ? "✓" : s.icon}
                    </div>
                    {i < STATUS_FLOW.length - 1 && (
                      <div style={{
                        width: "2px", flex: 1, minHeight: "20px",
                        background: done ? "#0A0A0A" : "#E5E7EB",
                      }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: "12px" }}>
                    <div style={{
                      fontWeight: active ? "800" : done ? "600" : "400",
                      fontSize: "13px",
                      color: active ? "#C8392B" : done ? "#0A0A0A" : "#9CA3AF",
                    }}>
                      {s.label}
                    </div>
                    {active && (
                      <div style={{ fontSize: "11px", color: "#C8392B", marginTop: "2px" }}>
                        Sedang diproses...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Items */}
          {pesanan.items?.map((item, idx) => (
            <div key={idx} style={{
              display: "flex", gap: "10px",
              padding: "10px 0",
              borderTop: "1px solid #F2F2F0",
            }}>
              {/* Preview mockup kaos berwarna */}
              <div style={{ width:"56px", flexShrink:0, background:"#F8FAFC",
                borderRadius:"10px", padding:"4px", border:"1px solid #E5E7EB" }}>
                <img
                  src={item.produk?.id === "lengan-panjang" ? "/mockup-panjang.png" : item.produk?.id === "rib" ? "/mockup-rib.png" : "/mockup-pendek.png"}
                  alt="kaos"
                  style={{ width:"100%", display:"block",
                    filter: getShirtFilter(item.warna) }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", fontSize: "13px" }}>
                  {item.produk.nama}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"4px", marginTop:"2px" }}>
                  <div style={{ width:"10px", height:"10px", borderRadius:"50%",
                    background: item.warna, border:"1px solid #E5E7EB", flexShrink:0 }}/>
                  <div style={{ fontSize: "11px", color: "#9CA3AF" }}>
                    {item.warnaLabel} · {item.modeUkuran === "satuan"
                      ? `${item.satuanSize} × ${item.satuanQty} pcs`
                      : `Massal · ${item.totalQty} pcs`}
                  </div>
                </div>
                {item.opsiDesain === "brief" && (
                  <div style={{ marginTop:"4px", background:"#EFF6FF", borderRadius:"6px",
                    padding:"3px 8px", fontSize:"10px", color:"#1D4ED8", fontWeight:"700",
                    display:"inline-flex", alignItems:"center", gap:"4px" }}>
                    🎨 Menunggu Desainer
                  </div>
                )}
                {item.opsiDesain === "upload" && (
                  <div style={{ marginTop:"4px", background:"#F0FDF4", borderRadius:"6px",
                    padding:"3px 8px", fontSize:"10px", color:"#065F46", fontWeight:"700",
                    display:"inline-flex", alignItems:"center", gap:"4px" }}>
                    ✓ Desain Siap
                  </div>
                )}
                <div style={{ fontWeight: "700", fontSize: "12px", marginTop: "4px" }}>
                  {rp(item.totalHarga)}
                </div>
              </div>
            </div>
          ))}


        </div>
      )}
    </div>
  );
}

export default function Pesanan({ pesananList = [], filterStatus = null, onBack, onBeriUlasan }) {
  const [tab, setTab] = useState("aktif");

  const aktif   = pesananList.filter(p => p.status !== "selesai");
  const selesai = pesananList.filter(p => p.status === "selesai");
  const tampil  = filterStatus
    ? pesananList.filter(p => filterStatus.includes(p.status))
    : tab === "aktif" ? aktif : selesai;

  const handleCekStatus = (orderId) => {
    const msg = encodeURIComponent(
      `${config.waPesan.cekStatus}\n\nID Pesanan saya: *${orderId}*`
    );
    window.open(`https://wa.me/${config.whatsapp.bisnis}?text=${msg}`, "_blank");
  };

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
      <Header halaman="pesanan" judul="Pesanan Saya" onBack={onBack} />

      {/* ── TAB ── */}
      <div style={{
        background: "white", borderBottom: "1px solid #E5E7EB",
        padding: "0 16px", display: "flex",
      }}>
        {[
          { id: "aktif",   label: `Aktif (${aktif.length})` },
          { id: "selesai", label: `Selesai (${selesai.length})` },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "13px 0", background: "none", border: "none",
            borderBottom: tab === t.id ? "2.5px solid #0A0A0A" : "2.5px solid transparent",
            fontWeight: tab === t.id ? "800" : "400",
            fontSize: "13px",
            color: tab === t.id ? "#0A0A0A" : "#9CA3AF",
            cursor: "pointer",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── LIST ── */}
      <div style={{ padding: "14px 16px 0" }}>
        {tampil.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>
              {tab === "aktif" ? "📦" : "✅"}
            </div>
            <div style={{
              fontWeight: "700", fontSize: "15px",
              color: "#374151", marginBottom: "6px",
            }}>
              {tab === "aktif" ? "Belum ada pesanan aktif" : "Belum ada pesanan selesai"}
            </div>
            <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
              {tab === "aktif"
                ? "Pesanan yang sedang diproses akan muncul di sini"
                : "Pesanan yang sudah selesai akan muncul di sini"}
            </div>
          </div>
        ) : (
          tampil.map(p => (
            <PesananCard
              key={p.orderId}
              pesanan={p}
              onBeriUlasan={onBeriUlasan}
            />
          ))
        )}
      </div>

    </div>
  );
}

