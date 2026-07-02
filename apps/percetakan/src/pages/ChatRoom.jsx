import { useState, useEffect, useRef } from "react";
import {
  getMessages, kirimPesan, kirimGambar,
  subscribeMessages, markAsRead,
  updateStatusPesanan, getStatusPesanan,
} from "../services/chatService.js";

const rp = (n) => "Rp " + Number(n).toLocaleString("id-ID");

function formatWaktu(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatRoom({ user, conversation, pesanan, onBack }) {
  const [messages, setMessages] = useState([]);
  const [teks,     setTeks]     = useState("");
  const [loading,  setLoading]  = useState(true);
  const [kirim,    setKirim]    = useState(false);
  const [lightbox,      setLightbox]      = useState(null);
  const [statusPesanan, setStatusPesanan] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showStatus,    setShowStatus]    = useState(false);
  const bottomRef = useRef(null);
  const fileRef   = useRef(null);
  const unsubRef  = useRef(null);

  const scrollBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const data = await getMessages(conversation.id);
        setMessages(data);
        await markAsRead(conversation.id);
        if (conversation.order_id) {
          const st = await getStatusPesanan(conversation.order_id);
          setStatusPesanan(st);
        }
        scrollBottom();
        unsubRef.current = subscribeMessages(conversation.id, (msg) => {
          setMessages(prev => {
            if (prev.find(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          markAsRead(conversation.id);
          scrollBottom();
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
    return () => unsubRef.current?.();
  }, [conversation.id]);

  const handleKirimTeks = async () => {
    if (!teks.trim() || kirim) return;
    setKirim(true);
    try {
      await kirimPesan({ conversationId: conversation.id, senderId: user.id, isi: teks.trim() });
      setTeks("");
      scrollBottom();
    } catch (e) {
      console.error(e);
    } finally {
      setKirim(false);
    }
  };

  const handleKirimGambar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setKirim(true);
    try {
      await kirimGambar({ conversationId: conversation.id, senderId: user.id, file });
      scrollBottom();
    } catch (e) {
      console.error(e);
    } finally {
      setKirim(false);
      e.target.value = "";
    }
  };

  const STATUS_OPTIONS = [
    { id: "qc",      label: "Quality Check", color: "#6D28D9" },
    { id: "dikirim", label: "Dikirim",       color: "#0369A1" },
  ];

  const handleUpdateStatus = async (status) => {
    if (!conversation.order_id) {
      alert("Conversation ini tidak terhubung ke pesanan.");
      return;
    }
    setUpdateLoading(true);
    setShowStatus(false);
    try {
      await updateStatusPesanan(conversation.order_id, status);
      setStatusPesanan(status);
      await kirimPesan({
        conversationId: conversation.id,
        senderId: user.id,
        isi: `STATUS_UPDATE:${status}`,
        type: "status_update",
      });
    } catch(e) {
      alert("Gagal update status: " + e.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleKirimAcc = async () => {
    if (kirim) return;
    setKirim(true);
    try {
      await kirimPesan({ conversationId: conversation.id, senderId: user.id, isi: "ACC_REQUEST", type: "acc_request" });
      scrollBottom();
    } catch (e) {
      console.error(e);
    } finally {
      setKirim(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#F2F2F0", fontFamily: "'Inter', system-ui, sans-serif" }}>

      <div style={{ background: "#0A0A0A", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer", padding: "4px" }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "800", fontSize: "14px", color: "white" }}>Customer</div>
          <div style={{ fontSize: "11px", color: "#6B7280" }}>#{conversation.order_id || "—"}</div>
        </div>
        {conversation.order_id && (
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowStatus(!showStatus)} disabled={updateLoading} style={{
              background: updateLoading ? "#374151" : "#1A1A1A",
              border: "1px solid #374151", borderRadius: "8px",
              padding: "6px 10px", color: "white", fontSize: "11px",
              fontWeight: "700", cursor: "pointer",
            }}>
              {updateLoading ? "..." : "📦 " + (statusPesanan || "status")}
            </button>
            {showStatus && (
              <div style={{
                position: "absolute", right: 0, top: "36px", zIndex: 99,
                background: "white", borderRadius: "12px", overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)", minWidth: "160px",
              }}>
                {STATUS_OPTIONS.map(s => (
                  <button key={s.id} onClick={() => handleUpdateStatus(s.id)} style={{
                    width: "100%", padding: "12px 16px", background: "none",
                    border: "none", borderBottom: "1px solid #F2F2F0",
                    fontSize: "13px", fontWeight: statusPesanan === s.id ? "800" : "500",
                    color: statusPesanan === s.id ? s.color : "#374151",
                    cursor: "pointer", textAlign: "left",
                    background: statusPesanan === s.id ? "#F9FAFB" : "none",
                  }}>
                    {statusPesanan === s.id ? "✓ " : ""}{s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>⏳ Memuat...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>💬</div>
            <div>Belum ada pesan</div>
          </div>
        ) : (
          messages.map((msg, i) => {
            const dariDesainer = msg.sender_role === "desainer";

            if (msg.type === "status_update") {
              const st = msg.body?.replace("STATUS_UPDATE:", "");
              const STATUS_LABEL = { desain: "Proses Desain", produksi: "Produksi", qc: "Quality Check", dikirim: "Dikirim", selesai: "Selesai" };
              return (
                <div key={msg.id || i} style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                  <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: "20px", padding: "6px 16px", fontSize: "12px", fontWeight: "700", color: "#166534" }}>
                    📦 Status diupdate: {STATUS_LABEL[st] || st} · {formatWaktu(msg.created_at)}
                  </div>
                </div>
              );
            }

            if (msg.type === "acc_request") {
              return (
                <div key={msg.id || i} style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                  <div style={{ background: "#D1FAE5", border: "2px solid #10B981", borderRadius: "16px", padding: "14px 20px", textAlign: "center", maxWidth: "280px" }}>
                    <div style={{ fontSize: "24px", marginBottom: "6px" }}>✅</div>
                    <div style={{ fontWeight: "800", fontSize: "14px", color: "#065F46", marginBottom: "4px" }}>ACC Request Terkirim</div>
                    <div style={{ fontSize: "12px", color: "#6B7280" }}>Menunggu konfirmasi customer</div>
                    <div style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "6px" }}>{formatWaktu(msg.created_at)}</div>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id || i} style={{ display: "flex", justifyContent: dariDesainer ? "flex-end" : "flex-start", marginBottom: "8px", alignItems: "flex-end", gap: "6px" }}>
                {!dariDesainer && (
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0 }}>👤</div>
                )}
                <div style={{
                  maxWidth: "72%",
                  background: dariDesainer ? "#0A0A0A" : "white",
                  color: dariDesainer ? "white" : "#0A0A0A",
                  borderRadius: dariDesainer ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: msg.image_url && !msg.body ? "4px" : "10px 14px",
                  fontSize: "13px", lineHeight: 1.5,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}>
                  {msg.image_url && (
                    <img src={msg.image_url} alt="gambar" onClick={() => setLightbox(msg.image_url)}
                      style={{ maxWidth: "200px", borderRadius: "10px", display: "block", cursor: "pointer" }} />
                  )}
                  {msg.body && msg.body !== "ACC_REQUEST" && <span>{msg.body}</span>}
                  <div style={{ fontSize: "10px", opacity: 0.5, marginTop: "4px", textAlign: "right" }}>
                    {formatWaktu(msg.created_at)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ background: "white", borderTop: "1px solid #E5E7EB", padding: "10px 16px 24px" }}>
        <button onClick={handleKirimAcc} disabled={kirim} style={{
          width: "100%", padding: "10px", marginBottom: "10px",
          background: kirim ? "#E5E7EB" : "#10B981", border: "none",
          borderRadius: "10px", color: "white", fontWeight: "800",
          fontSize: "13px", cursor: "pointer",
        }}>
          ✓ Kirim ACC Request ke Customer
        </button>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
          <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={handleKirimGambar} />
          <button onClick={() => fileRef.current?.click()} style={{ background: "#F2F2F0", border: "none", borderRadius: "10px", width: "40px", height: "40px", cursor: "pointer", fontSize: "18px", flexShrink: 0 }}>🖼</button>
          <input
            value={teks}
            onChange={e => setTeks(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleKirimTeks()}
            placeholder="Balas pesan..."
            style={{ flex: 1, border: "2px solid #E5E7EB", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", fontFamily: "inherit", outline: "none" }}
          />
          <button onClick={handleKirimTeks} disabled={kirim || !teks.trim()}
            style={{ background: kirim || !teks.trim() ? "#E5E7EB" : "#0A0A0A", border: "none", borderRadius: "10px", width: "40px", height: "40px", cursor: "pointer", fontSize: "18px", flexShrink: 0 }}>
            ➤
          </button>
        </div>
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <img src={lightbox} alt="preview" style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: "12px" }} />
        </div>
      )}
    </div>
  );
}
