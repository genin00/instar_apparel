// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — PESANAN (Tokopedia-style)
// ═══════════════════════════════════════════════════════════

import { useState, useRef, useEffect } from "react";
import config from "../../config.js";
import { TABS, STATUS_LABEL, STATUS_COLOR, STATUS_FLOW, getShirtFilter } from "./pesananUtils.js";

const rp = (n) => "Rp " + (n || 0).toLocaleString("id-ID");






import RincianPesanan from "./RincianPesanan.jsx";
import PesananCard from "./PesananCard.jsx";
import { KonfirmasiTerimaModal, PengembalianModal } from "./modalPesanan.jsx";

export default function Pesanan({ pesananList = [], filterStatus = null, onBack, onRefresh, onBeriUlasan }) {
  const [tab, setTab]         = useState("semua");
  const [rincian, setRincian] = useState(null);
  const [modalTerima,       setModalTerima]       = useState(null);
  const [modalPengembalian, setModalPengembalian] = useState(null);
  const [localList, setLocalList] = useState(pesananList);

  useEffect(() => { setLocalList(pesananList); }, [pesananList]);

  if (rincian) {
    return <RincianPesanan pesanan={rincian} onBack={() => setRincian(null)} />;
  }

  const tampil = tab === "semua"
    ? localList
    : tab === "diterima" ? localList.filter(p => ["diterima","konfirmasi"].includes(p.status))
    : tab === "produksi" ? localList.filter(p => ["produksi","qc"].includes(p.status))
    : localList.filter(p => p.status === tab);

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
            : t.id === "diterima" ? localList.filter(p => ["diterima","konfirmasi"].includes(p.status)).length
            : t.id === "produksi" ? localList.filter(p => ["produksi","qc"].includes(p.status)).length
            : localList.filter(p => p.status === t.id).length;
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
            <PesananCard
              key={p.orderId}
              pesanan={p}
              onLihatRincian={setRincian}
              onKonfirmasiTerima={setModalTerima}
              onAjukanPengembalian={setModalPengembalian}
              onBeriUlasan={onBeriUlasan}
            />
          ))
        )}
      </div>

      {modalTerima && (
        <KonfirmasiTerimaModal
          pesanan={modalTerima}
          onClose={() => setModalTerima(null)}
          onSelesai={() => {
            setLocalList(prev => prev.map(p =>
              p.orderId === modalTerima.orderId ? { ...p, status: "selesai" } : p
            ));
            setModalTerima(null);
            onRefresh?.();
          }}
        />
      )}
      {modalPengembalian && (
        <PengembalianModal
          pesanan={modalPengembalian}
          onClose={() => setModalPengembalian(null)}
          onSelesai={() => {
            setLocalList(prev => prev.map(p =>
              p.orderId === modalPengembalian.orderId ? { ...p, status: "dikembalikan" } : p
            ));
            setModalPengembalian(null);
            onRefresh?.();
          }}
        />
      )}
    </div>
  );
}
