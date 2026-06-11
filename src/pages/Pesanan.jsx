// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — PESANAN
//  Riwayat pesanan + cek status via WA
// ═══════════════════════════════════════════════════════════

import { useState } from "react";
import Header from "../components/Header.jsx";
import config from "../config.js";

const rp = (n) => "Rp " + n.toLocaleString("id-ID");

const STATUS_FLOW = [
  { id: "diterima",   label: "Pesanan Diterima",       icon: "📋" },
  { id: "konfirmasi", label: "Konfirmasi Pembayaran",  icon: "💳" },
  { id: "desain",     label: "Proses Desain",          icon: "🎨" },
  { id: "produksi",   label: "Produksi",               icon: "👕" },
  { id: "qc",         label: "Quality Check",          icon: "🔍" },
  { id: "selesai",    label: "Selesai / Siap Diambil", icon: "✅" },
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

function PesananCard({ pesanan, onCekStatus }) {
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
              <div style={{
                width: "44px", height: "50px", borderRadius: "8px",
                background: item.warna, border: "1px solid #E5E7EB",
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "18px", flexShrink: 0,
              }}>👕</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", fontSize: "13px" }}>
                  {item.produk.nama}
                </div>
                <div style={{ fontSize: "11px", color: "#9CA3AF" }}>
                  {item.warnaLabel} · {item.modeUkuran === "satuan"
                    ? `${item.satuanSize} × ${item.satuanQty} pcs`
                    : `Massal · ${item.totalQty} pcs`}
                </div>
                <div style={{ fontWeight: "700", fontSize: "12px", marginTop: "3px" }}>
                  {rp(item.totalHarga)}
                </div>
              </div>
            </div>
          ))}

          {/* Cek status WA */}
          <button
            onClick={() => onCekStatus(pesanan.orderId)}
            style={{
              width: "100%", marginTop: "14px",
              padding: "11px", borderRadius: "10px", border: "none",
              background: "#25D366", color: "white",
              fontWeight: "800", fontSize: "13px",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", gap: "6px",
            }}
          >
            💬 Cek Status via WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}

export default function Pesanan({ pesananList = [], onBack }) {
  const [tab, setTab] = useState("aktif");

  const aktif   = pesananList.filter(p => p.status !== "selesai");
  const selesai = pesananList.filter(p => p.status === "selesai");
  const tampil  = tab === "aktif" ? aktif : selesai;

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
              onCekStatus={handleCekStatus}
            />
          ))
        )}
      </div>

    </div>
  );
}

