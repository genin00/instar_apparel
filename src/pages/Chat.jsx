// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — HALAMAN CHAT DESAINER
// ═══════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from "react";
import { getPesan, kirimPesan, kirimGambar, subscribeChat } from "../services/chatService.js";

const formatWaktu = (ts) => {
  const d = new Date(ts);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

const formatTanggal = (ts) => {
  const d = new Date(ts);
  const today = new Date();
  const diff  = today.setHours(0,0,0,0) - d.setHours(0,0,0,0);
  if (diff === 0) return "Hari Ini";
  if (diff === 86400000) return "Kemarin";
  return new Date(ts).toLocaleDateString("id-ID", { day:"2-digit", month:"short", year:"numeric" });
};

export default function Chat({ pesanan, akun, onBack }) {
  const [pesanList, setPesanList] = useState([]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(true);
  const [sending,   setSending]   = useState(false);
  const bottomRef = useRef(null);
  const fileRef   = useRef(null);

  useEffect(() => {
    if (!pesanan) return;
    getPesan(pesanan.orderId).then(data => {
      setPesanList(data);
      setLoading(false);
    });
    const unsub = subscribeChat(pesanan.orderId, (pesan) => {
      setPesanList(prev => [...prev, pesan]);
    });
    return unsub;
  }, [pesanan]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [pesanList]);

  const handleKirim = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      await kirimPesan({
        orderId:    pesanan.orderId,
        senderId:   akun.id,
        senderRole: "customer",
        isi:        input.trim(),
      });
      setInput("");
    } catch (e) { console.error(e); }
    setSending(false);
  };

  const handleGambar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSending(true);
    try {
      await kirimGambar({
        orderId:    pesanan.orderId,
        senderId:   akun.id,
        senderRole: "customer",
        file,
      });
    } catch (e) { console.error(e); }
    setSending(false);
    e.target.value = "";
  };

  const produkItem = pesanan?.items?.[0];

  // Grup pesan per tanggal
  const grupPesan = [];
  let lastTgl = null;
  for (const p of pesanList) {
    const tgl = formatTanggal(p.created_at);
    if (tgl !== lastTgl) {
      grupPesan.push({ type: "divider", label: tgl });
      lastTgl = tgl;
    }
    grupPesan.push({ type: "pesan", data: p });
  }

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#374151" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "800", fontSize: "14px", color: "#0A0A0A" }}>Tim Desainer</div>
          <div style={{ fontSize: "11px", color: "#10B981", fontWeight: "600" }}>● Online</div>
        </div>
        <div style={{ background: "#F2F2F0", borderRadius: "8px", padding: "4px 10px" }}>
          <div style={{ fontSize: "10px", color: "#9CA3AF" }}>ID Pesanan</div>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#0A0A0A", letterSpacing: "0.5px" }}>{pesanan?.orderId}</div>
        </div>
      </div>

      {/* ── CARD PESANAN ── */}
      {produkItem && (
        <div style={{ background: "white", borderBottom: "1px solid #F2F2F0", padding: "12px 16px", display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ width: "52px", height: "58px", borderRadius: "10px", background: "#F8FAFC", border: "1px solid #E5E7EB", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={produkItem.produk?.id === "lengan-panjang" ? "/mockup-panjang.png" : produkItem.produk?.id === "rib" ? "/mockup-rib.png" : "/mockup-pendek.png"}
              alt="produk" style={{ width: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "800", fontSize: "13px", color: "#0A0A0A" }}>{produkItem.produk?.nama}</div>
            <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>{pesanan.totalQty} pcs · {produkItem.warnaLabel}</div>
            <div style={{ marginTop: "4px" }}>
              <span style={{ background: "#FEF9C3", color: "#854D0E", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px" }}>
                {pesanan.status === "desain" ? "⏳ Proses Desain" : pesanan.status === "produksi" ? "🖨️ Produksi" : "📋 " + pesanan.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── BODY CHAT ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", paddingBottom: "80px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF", fontSize: "13px" }}>Memuat pesan...</div>
        ) : pesanList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>💬</div>
            <div style={{ fontWeight: "700", fontSize: "14px", color: "#374151", marginBottom: "6px" }}>Mulai Konsultasi</div>
            <div style={{ fontSize: "12px", color: "#9CA3AF", lineHeight: 1.6 }}>Ceritakan idemu kepada tim desainer kami. Kami siap membantu mewujudkan desain kaosmu!</div>
          </div>
        ) : (
          grupPesan.map((item, idx) => {
            if (item.type === "divider") {
              return (
                <div key={idx} style={{ textAlign: "center", margin: "12px 0" }}>
                  <span style={{ background: "#E5E7EB", color: "#6B7280", fontSize: "11px", fontWeight: "600", padding: "4px 12px", borderRadius: "20px" }}>{item.label}</span>
                </div>
              );
            }
            const p = item.data;
            const isCustomer = p.sender_role === "customer";
            const isSistem   = p.sender_role === "sistem";

            if (isSistem) {
              return (
                <div key={p.id} style={{ textAlign: "center", margin: "8px 0" }}>
                  <span style={{ background: "#EFF6FF", color: "#1D4ED8", fontSize: "11px", fontWeight: "600", padding: "6px 14px", borderRadius: "20px", display: "inline-block", lineHeight: 1.5 }}>{p.isi}</span>
                </div>
              );
            }

            return (
              <div key={p.id} style={{ display: "flex", justifyContent: isCustomer ? "flex-end" : "flex-start", marginBottom: "8px" }}>
                {!isCustomer && (
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: "8px", alignSelf: "flex-end" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <div style={{ maxWidth: "72%" }}>
                  {!isCustomer && <div style={{ fontSize: "10px", color: "#9CA3AF", marginBottom: "3px", fontWeight: "600" }}>Desainer</div>}
                  <div style={{
                    background: isCustomer ? "#0A0A0A" : "white",
                    color: isCustomer ? "white" : "#0A0A0A",
                    borderRadius: isCustomer ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    padding: p.tipe === "gambar" ? "6px" : "10px 14px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  }}>
                    {p.tipe === "gambar" ? (
                      <img src={p.gambar_url} alt="gambar" style={{ width: "100%", maxWidth: "220px", borderRadius: "10px", display: "block" }} />
                    ) : (
                      <div style={{ fontSize: "14px", lineHeight: 1.5 }}>{p.isi}</div>
                    )}
                  </div>
                  <div style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "3px", textAlign: isCustomer ? "right" : "left" }}>
                    {formatWaktu(p.created_at)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── INPUT CHAT ── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #E5E7EB", padding: "10px 16px", display: "flex", alignItems: "center", gap: "10px", maxWidth: "480px", margin: "0 auto", boxSizing: "border-box" }}>
        <button onClick={() => fileRef.current?.click()} style={{ width: "38px", height: "38px", borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleKirim()}
          placeholder="Tulis pesan..."
          style={{ flex: 1, border: "1.5px solid #E5E7EB", borderRadius: "20px", padding: "10px 16px", fontSize: "14px", outline: "none", fontFamily: "inherit", background: "#FAFAFA" }}
        />
        <button onClick={handleKirim} disabled={!input.trim() || sending} style={{ width: "38px", height: "38px", borderRadius: "50%", border: "none", background: input.trim() ? "#0A0A0A" : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "not-allowed", flexShrink: 0, transition: "all 0.2s" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleGambar} />
      </div>

    </div>
  );
}
