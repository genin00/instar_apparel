// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — DAFTAR CHAT
// ═══════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { getDaftarChat } from "../services/chatService.js";

const formatWaktu = (ts) => {
  if (!ts) return "";
  const d = new Date(ts);
  const today = new Date();
  const diff = today.setHours(0,0,0,0) - new Date(ts).setHours(0,0,0,0);
  if (diff === 0) return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  if (diff === 86400000) return "Kemarin";
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
};

export default function DaftarChat({ pesananList = [], akun, onBack, onBukaChat }) {
  const [daftarChat, setDaftarChat] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    if (!pesananList.length) { setLoading(false); return; }
    getDaftarChat(pesananList).then(data => {
      setDaftarChat(data);
      setLoading(false);
    });
  }, [pesananList]);

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ fontWeight: "900", fontSize: "17px", color: "#0A0A0A" }}>Chat Desainer</div>
      </div>

      <div style={{ padding: "14px 16px" }}>
        {!akun ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔐</div>
            <div style={{ fontWeight: "700", fontSize: "15px", color: "#374151", marginBottom: "6px" }}>Login Dulu</div>
            <div style={{ fontSize: "13px", color: "#9CA3AF" }}>Login untuk bisa chat dengan desainer</div>
          </div>
        ) : loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF", fontSize: "13px" }}>Memuat...</div>
        ) : daftarChat.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>💬</div>
            <div style={{ fontWeight: "700", fontSize: "15px", color: "#374151", marginBottom: "6px" }}>Belum Ada Chat</div>
            <div style={{ fontSize: "13px", color: "#9CA3AF", lineHeight: 1.6 }}>Chat dengan desainer akan muncul setelah kamu membuat pesanan</div>
          </div>
        ) : (
          daftarChat.map(({ orderId, pesanan, pesanTerakhir }) => (
            <button key={orderId} onClick={() => onBukaChat(pesanan)}
              style={{ width: "100%", background: "white", borderRadius: "14px", padding: "14px 16px", marginBottom: "8px", border: "none", cursor: "pointer", textAlign: "left", display: "flex", gap: "12px", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

              {/* Avatar desainer */}
              <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                  <div style={{ fontWeight: "800", fontSize: "14px", color: "#0A0A0A" }}>Tim Desainer</div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", flexShrink: 0 }}>
                    {formatWaktu(pesanTerakhir?.created_at)}
                  </div>
                </div>
                <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "4px", fontWeight: "600", letterSpacing: "0.3px" }}>
                  {orderId}
                </div>
                <div style={{ fontSize: "13px", color: "#6B7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {pesanTerakhir
                    ? pesanTerakhir.tipe === "gambar"
                      ? "📷 Gambar"
                      : pesanTerakhir.isi
                    : "Belum ada pesan — tap untuk mulai chat"}
                </div>
              </div>

              {/* Status pesanan */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: pesanan?.status === "desain" ? "#F59E0B" : pesanan?.status === "produksi" ? "#10B981" : "#9CA3AF" }} />
              </div>

            </button>
          ))
        )}
      </div>
    </div>
  );
}
