import { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "../services/orderService.js";

const STATUS_LIST = ["semua", "diterima", "desain", "produksi", "selesai"];

const STATUS_COLOR = {
  diterima:  { bg: "#FEF3C7", color: "#92400E" },
  desain:    { bg: "#DBEAFE", color: "#1E40AF" },
  produksi:  { bg: "#EDE9FE", color: "#5B21B6" },
  selesai:   { bg: "#D1FAE5", color: "#065F46" },
};

const rp = (n) => "Rp " + Number(n).toLocaleString("id-ID");

export default function Dashboard({ user, onLogout, onBukaPesanan }) {
  const [pesanan, setPesanan]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("semua");
  const [cari, setCari]           = useState("");
  const [updating, setUpdating]   = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await getOrders();
    setPesanan(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = pesanan.filter(p => {
    const cocokStatus = filter === "semua" || p.status === filter;
    const cocokCari   = cari === "" ||
      p.orderId?.toLowerCase().includes(cari.toLowerCase()) ||
      p.nama?.toLowerCase().includes(cari.toLowerCase());
    const adaBrief = (p.items || []).some(i => i.opsiDesain === "brief");
    return cocokStatus && cocokCari && adaBrief;
  });

  const handleUpdateStatus = async (e, orderId, status) => {
    e.stopPropagation();
    setUpdating(orderId);
    await updateOrderStatus(orderId, status);
    await load();
    setUpdating(null);
  };

  const statusBerikutnya = (status) => {
    const urutan = ["diterima", "desain", "produksi", "selesai"];
    const idx = urutan.indexOf(status);
    return idx < urutan.length - 1 ? urutan[idx + 1] : null;
  };

  // ── STATS ──
  const stats = {
    total:     pesanan.length,
    diterima:  pesanan.filter(p => p.status === "diterima").length,
    desain:    pesanan.filter(p => p.status === "desain").length,
    produksi:  pesanan.filter(p => p.status === "produksi").length,
    selesai:   pesanan.filter(p => p.status === "selesai").length,
  };

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "#0A0A0A", padding: "16px 20px", position: "sticky", top: 0, zIndex: 99 }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: "900", fontSize: "16px", letterSpacing: "2px", color: "#FFFFFF" }}>INSTAR</div>
            <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#6B7280" }}>DESAINER</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "12px", color: "#6B7280" }}>{user.email}</div>
            <button
              onClick={onLogout}
              style={{ background: "#1A1A1A", border: "none", color: "#9CA3AF", fontSize: "12px", padding: "6px 12px", borderRadius: "8px", cursor: "pointer" }}
            >
              Keluar
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>

        {/* ── STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "20px" }}>
          {[
            { label: "Masuk",    value: stats.diterima,  color: "#92400E", bg: "#FEF3C7" },
            { label: "Desain",   value: stats.desain,    color: "#1E40AF", bg: "#DBEAFE" },
            { label: "Produksi", value: stats.produksi,  color: "#5B21B6", bg: "#EDE9FE" },
            { label: "Selesai",  value: stats.selesai,   color: "#065F46", bg: "#D1FAE5" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: "12px", padding: "12px 8px", textAlign: "center" }}>
              <div style={{ fontWeight: "900", fontSize: "22px", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "10px", color: s.color, fontWeight: "700" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── SEARCH ── */}
        <div style={{ background: "white", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", marginBottom: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <span style={{ fontSize: "16px" }}>🔍</span>
          <input
            value={cari}
            onChange={e => setCari(e.target.value)}
            placeholder="Cari ID pesanan atau nama..."
            style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", fontFamily: "inherit" }}
          />
          {cari && (
            <button onClick={() => setCari("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: "18px" }}>×</button>
          )}
        </div>

        {/* ── FILTER ── */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", overflowX: "auto", paddingBottom: "4px" }}>
          {STATUS_LIST.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                flexShrink: 0, padding: "7px 16px", borderRadius: "20px",
                border: "2px solid", borderColor: filter === s ? "#0A0A0A" : "#E5E7EB",
                background: filter === s ? "#0A0A0A" : "white",
                color: filter === s ? "white" : "#6B7280",
                fontSize: "12px", fontWeight: "700", cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {s === "semua" ? `Semua (${stats.total})` : s}
            </button>
          ))}
        </div>

        {/* ── LIST PESANAN ── */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>⏳</div>
            <div>Memuat pesanan...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📭</div>
            <div style={{ fontWeight: "700", color: "#374151" }}>Tidak ada pesanan</div>
          </div>
        ) : (
          filtered.map(p => {
            const sc = STATUS_COLOR[p.status] || { bg: "#F3F4F6", color: "#374151" };
            const next = statusBerikutnya(p.status);
            return (
              <div
                key={p.orderId}
                onClick={() => onBukaPesanan(p)}
                style={{
                  background: "white", borderRadius: "14px", padding: "16px",
                  marginBottom: "10px", cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  border: "2px solid transparent",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#0A0A0A"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div>
                    <div style={{ fontWeight: "900", fontSize: "15px", color: "#0A0A0A", letterSpacing: "1px" }}>
                      #{p.orderId}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
                      {p.tanggal} · {p.nama || "—"}
                    </div>
                  </div>
                  <div style={{ background: sc.bg, color: sc.color, fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "20px", textTransform: "capitalize" }}>
                    {p.status}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "13px", color: "#374151" }}>
                    <span style={{ fontWeight: "700" }}>{rp(p.totalHarga)}</span>
                    <span style={{ color: "#9CA3AF" }}> · {p.totalQty} pcs</span>
                  </div>
                  {next && (
                    <button
                      onClick={e => handleUpdateStatus(e, p.orderId, next)}
                      disabled={updating === p.orderId}
                      style={{
                        background: "#0A0A0A", color: "white", border: "none",
                        borderRadius: "8px", padding: "6px 12px",
                        fontSize: "11px", fontWeight: "800", cursor: "pointer",
                        opacity: updating === p.orderId ? 0.6 : 1,
                      }}
                    >
                      {updating === p.orderId ? "..." : `→ ${next}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* ── REFRESH ── */}
        <button
          onClick={load}
          style={{
            width: "100%", padding: "12px", marginTop: "8px",
            background: "white", border: "2px solid #E5E7EB",
            borderRadius: "12px", fontSize: "13px", fontWeight: "700",
            color: "#6B7280", cursor: "pointer",
          }}
        >
          🔄 Refresh
        </button>

      </div>
    </div>
  );
}
