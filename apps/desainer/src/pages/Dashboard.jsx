import { useState, useEffect, useRef } from "react";
import { getAllConversations, subscribeConversations } from "../services/chatService.js";

export default function Dashboard({ user, onLogout, onBukaPesanan }) {
  const [convs,       setConvs]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [totalUnread, setTotalUnread] = useState(0);
  const unsubRef = useRef(null);

  const loadAll = async () => {
    setLoading(true);
    const data = await getAllConversations();
    setConvs(data);
    setTotalUnread(data.reduce((sum, c) => sum + (c.unread_desainer || 0), 0));
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
    unsubRef.current = subscribeConversations(loadAll);
    return () => unsubRef.current?.();
  }, []);

  const formatWaktu = (iso) => {
    if (!iso) return "";
    const d    = new Date(iso);
    const now  = new Date();
    const diff = now - d;
    const mnt  = Math.floor(diff / 60000);
    const jam  = Math.floor(diff / 3600000);
    if (mnt < 1)  return "Baru saja";
    if (mnt < 60) return `${mnt} mnt`;
    if (jam < 24) return `${jam} jam`;
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
  };

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>

      <div style={{ background: "#0A0A0A", padding: "16px 20px", position: "sticky", top: 0, zIndex: 98 }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: "900", fontSize: "16px", letterSpacing: "2px", color: "white" }}>INSTAR</div>
            <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#6B7280" }}>DESAINER</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {totalUnread > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "#C8392B", padding: "5px 10px", borderRadius: "20px" }}>
                <span style={{ fontSize: "13px" }}>💬</span>
                <span style={{ fontSize: "12px", color: "white", fontWeight: "800" }}>{totalUnread}</span>
              </div>
            )}
            <div style={{ fontSize: "11px", color: "#6B7280" }}>{user.email}</div>
            <button onClick={onLogout} style={{ background: "#1A1A1A", border: "none", color: "#9CA3AF", fontSize: "12px", padding: "6px 12px", borderRadius: "8px", cursor: "pointer" }}>
              Keluar
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
          <div style={{ background: "#DBEAFE", borderRadius: "12px", padding: "12px 8px", textAlign: "center" }}>
            <div style={{ fontWeight: "900", fontSize: "22px", color: "#1E40AF" }}>{convs.length}</div>
            <div style={{ fontSize: "10px", color: "#1E40AF", fontWeight: "700" }}>Total Chat</div>
          </div>
          <div style={{ background: "#FEF3C7", borderRadius: "12px", padding: "12px 8px", textAlign: "center" }}>
            <div style={{ fontWeight: "900", fontSize: "22px", color: "#92400E" }}>{totalUnread}</div>
            <div style={{ fontSize: "10px", color: "#92400E", fontWeight: "700" }}>Belum Dibaca</div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>⏳</div>
            <div>Memuat...</div>
          </div>
        ) : convs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📭</div>
            <div style={{ fontWeight: "700", color: "#374151" }}>Belum ada chat masuk</div>
          </div>
        ) : (
          convs.map(conv => {
            const unread = conv.unread_desainer || 0;
            return (
              <div key={conv.id} onClick={() => onBukaPesanan(conv)}
                style={{
                  background: "white", borderRadius: "14px", padding: "16px", marginBottom: "10px", cursor: "pointer",
                  boxShadow: unread > 0 ? "0 0 0 2px #C8392B" : "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>👤</div>
                    <div>
                      <div style={{ fontWeight: "800", fontSize: "14px", color: "#0A0A0A" }}>
                        Customer
                        {conv.order_id && <span style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: "400", marginLeft: "6px" }}>#{conv.order_id}</span>}
                      </div>
                      <div style={{ fontSize: "12px", color: unread > 0 ? "#C8392B" : "#9CA3AF", marginTop: "2px", fontWeight: unread > 0 ? "700" : "400" }}>
                        {conv.last_message || "Belum ada pesan"}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                    <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{formatWaktu(conv.last_at)}</div>
                    {unread > 0 && (
                      <div style={{ background: "#C8392B", color: "white", fontSize: "10px", fontWeight: "800", minWidth: "18px", height: "18px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>
                        {unread > 9 ? "9+" : unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <button onClick={loadAll} style={{ width: "100%", padding: "12px", marginTop: "8px", background: "white", border: "2px solid #E5E7EB", borderRadius: "12px", fontSize: "13px", fontWeight: "700", color: "#6B7280", cursor: "pointer" }}>
          🔄 Refresh
        </button>
      </div>
    </div>
  );
}
