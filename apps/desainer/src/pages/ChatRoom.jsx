import { useState, useEffect, useRef } from "react";
import {
  getMessages, kirimPesan, kirimGambar,
  subscribeMessages, markAsRead,
  updateStatusPesanan, getStatusPesanan,
} from "../services/chatService.js";
import supabase from "../lib/supabase.js";

const rp = (n) => "Rp " + Number(n).toLocaleString("id-ID");

function formatWaktu(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatRoom({ user, conversation, pesanan, onBack }) {

  console.log("===== CHATROOM =====");
  console.log(JSON.stringify(conversation, null, 2));

  console.log("=== CHATROOM DEBUG ===");
  console.log("conversation:", conversation);
  console.log("order_id:", conversation?.order_id);

  const [messages, setMessages] = useState([]);
  const [teks,     setTeks]     = useState("");
  const [loading,  setLoading]  = useState(true);
  const [kirim,    setKirim]    = useState(false);
  const [lightbox,      setLightbox]      = useState(null);
  const [statusPesanan, setStatusPesanan] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showStatus,    setShowStatus]    = useState(false);
  const [popupMsg,   setPopupMsg]   = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [editTeks,   setEditTeks]   = useState("");
  const [hapusModal, setHapusModal] = useState(null);
  const longPressRef = useRef(null);
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
    { id: "produksi", label: "Produksi", color: "#166534" },
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

  const startLongPress = (msg) => {
    const isMe = msg.sender_role === "desainer";
    if (!isMe) return;
    if (msg.type && msg.type !== "text") return;
    longPressRef.current = setTimeout(() => setPopupMsg(msg), 500);
  };

  const cancelLongPress = () => {
    if (longPressRef.current) clearTimeout(longPressRef.current);
  };

  const handleEdit = () => {
    setEditTeks(popupMsg.body || "");
    setEditingMsg(popupMsg);
    setPopupMsg(null);
  };

  const handleSimpanEdit = async () => {
    if (!editTeks.trim()) return;
    try {
      await supabase.from("messages").update({
        body: editTeks.trim(),
        is_edited: true,
        edited_at: new Date().toISOString(),
      }).eq("id", editingMsg.id);
      setMessages(prev => prev.map(m => m.id === editingMsg.id
        ? { ...m, body: editTeks.trim(), is_edited: true }
        : m
      ));
      setEditingMsg(null);
      setEditTeks("");
    } catch(e) { alert("Gagal edit: " + e.message); }
  };

  const handleHapusSaya = async () => {
    try {
      const msg = hapusModal;
      const existing = msg.deleted_for || [];
      await supabase.from("messages").update({
        deleted_for: [...existing, user.id],
      }).eq("id", msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id
        ? { ...m, deleted_for: [...(m.deleted_for || []), user.id] }
        : m
      ));
      setHapusModal(null);
    } catch(e) { alert("Gagal hapus: " + e.message); }
  };

  const handleHapusSemua = async () => {
    try {
      const msg = hapusModal;
      await supabase.from("messages").update({
        body: null, image_url: null, deleted_for: ["all"],
      }).eq("id", msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id
        ? { ...m, body: null, image_url: null, deleted_for: ["all"] }
        : m
      ));
      setHapusModal(null);
    } catch(e) { alert("Gagal hapus: " + e.message); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#F2F2F0", fontFamily: "'Inter', system-ui, sans-serif" }}>

      <div style={{ background: "#0A0A0A", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer", padding: "4px" }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "800", fontSize: "14px", color: "white" }}>Customer</div>
          <div style={{ fontSize: "11px", color: "#6B7280" }}>#{conversation.order_id || "—"}</div>
        </div>

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

            const dihapusSemua = (msg.deleted_for || []).includes("all");
            const dihapusSaya  = (msg.deleted_for || []).includes(user.id);
            if (dihapusSaya && !dihapusSemua) return null;

            return (
              <div key={msg.id || i} style={{ display: "flex", justifyContent: dariDesainer ? "flex-end" : "flex-start", marginBottom: "8px", alignItems: "flex-end", gap: "6px" }}>
                {!dariDesainer && (
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0 }}>👤</div>
                )}
                <div
                  onTouchStart={() => startLongPress(msg)}
                  onTouchEnd={cancelLongPress}
                  onTouchMove={cancelLongPress}
                  onMouseDown={() => startLongPress(msg)}
                  onMouseUp={cancelLongPress}
                  onMouseLeave={cancelLongPress}
                  style={{
                    maxWidth: "72%",
                    background: dihapusSemua ? "#F3F4F6" : dariDesainer ? "#0A0A0A" : "white",
                    color: dihapusSemua ? "#9CA3AF" : dariDesainer ? "white" : "#0A0A0A",
                    borderRadius: dariDesainer ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    padding: msg.image_url && !msg.body && !dihapusSemua ? "4px" : "10px 14px",
                    fontSize: "13px", lineHeight: 1.5,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    fontStyle: dihapusSemua ? "italic" : "normal",
                  }}>
                  {dihapusSemua ? "Pesan telah dihapus" : (
                    <>
                      {msg.image_url && (
                        <img src={msg.image_url} alt="gambar" onClick={() => setLightbox(msg.image_url)}
                          style={{ maxWidth: "200px", borderRadius: "10px", display: "block", cursor: "pointer" }} />
                      )}
                      {msg.body && msg.body !== "ACC_REQUEST" && <span>{msg.body}</span>}
                      {msg.is_edited && <span style={{ fontSize: "10px", opacity: 0.6, marginLeft: "6px" }}>Diedit</span>}
                    </>
                  )}
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
        <div style={{ marginBottom: "8px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#9CA3AF", marginBottom: "6px", letterSpacing: "1px" }}>UPDATE STATUS</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {STATUS_OPTIONS.map(s => (
                <button key={s.id} onClick={() => handleUpdateStatus(s.id)} disabled={updateLoading} style={{
                  padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "700", cursor: "pointer",
                  background: statusPesanan === s.id ? "#0A0A0A" : "white",
                  color: statusPesanan === s.id ? "white" : "#374151",
                  border: statusPesanan === s.id ? "2px solid #0A0A0A" : "2px solid #E5E7EB",
                }}>
                  {statusPesanan === s.id ? "✓ " : ""}{s.label}
                </button>
              ))}
            </div>
          </div>
        <button onClick={handleKirimAcc} disabled={kirim} style={{
          width: "100%", padding: "10px", marginBottom: "10px",
          background: kirim ? "#E5E7EB" : "#0A0A0A", border: "none",
          borderRadius: "10px", color: "white", fontWeight: "800",
          fontSize: "13px", cursor: "pointer",
        }}>
          ✓ Kirim ACC Request ke Customer
        </button>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
          <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={handleKirimGambar} />
          <button onClick={() => fileRef.current?.click()} style={{ background: "#F2F2F0", border: "2px solid #E5E7EB", borderRadius: "10px", width: "40px", height: "40px", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="#374151" strokeWidth="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="#374151"/>
              <path d="M3 16l5-5 4 4 3-3 6 6" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <input
            value={teks}
            onChange={e => setTeks(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleKirimTeks()}
            placeholder="Balas pesan..."
            style={{ flex: 1, border: "2px solid #E5E7EB", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", fontFamily: "inherit", outline: "none" }}
          />
          <button onClick={handleKirimTeks} disabled={kirim || !teks.trim()}
            style={{ background: kirim || !teks.trim() ? "#E5E7EB" : "#0A0A0A", border: "none", borderRadius: "10px", width: "40px", height: "40px", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {popupMsg && (
        <div onClick={() => setPopupMsg(null)} style={{ position: "fixed", inset: 0, zIndex: 998, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: "16px", overflow: "hidden", minWidth: "200px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            {popupMsg.body && !popupMsg.image_url && (
              <button onClick={handleEdit} style={{ width: "100%", padding: "16px", background: "none", border: "none", borderBottom: "1px solid #F2F2F0", fontSize: "14px", fontWeight: "700", color: "#0A0A0A", cursor: "pointer", textAlign: "left" }}>
                Edit Pesan
              </button>
            )}
            <button onClick={() => { setHapusModal(popupMsg); setPopupMsg(null); }} style={{ width: "100%", padding: "16px", background: "none", border: "none", fontSize: "14px", fontWeight: "700", color: "#C8392B", cursor: "pointer", textAlign: "left" }}>
              Hapus Pesan
            </button>
          </div>
        </div>
      )}

      {hapusModal && (
        <div onClick={() => setHapusModal(null)} style={{ position: "fixed", inset: 0, zIndex: 998, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: "20px 20px 0 0", padding: "24px", width: "100%", maxWidth: "480px" }}>
            <div style={{ fontWeight: "800", fontSize: "15px", color: "#0A0A0A", marginBottom: "6px" }}>Hapus Pesan</div>
            <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "20px" }}>Pilih cara menghapus pesan</div>
            <button onClick={handleHapusSaya} style={{ width: "100%", padding: "13px", border: "1.5px solid #E5E7EB", borderRadius: "12px", background: "none", fontSize: "13px", fontWeight: "700", color: "#374151", cursor: "pointer", marginBottom: "10px" }}>
              Hapus untuk Saya
            </button>
            <button onClick={handleHapusSemua} style={{ width: "100%", padding: "13px", border: "none", borderRadius: "12px", background: "#C8392B", fontSize: "13px", fontWeight: "700", color: "white", cursor: "pointer", marginBottom: "10px" }}>
              Hapus untuk Semua
            </button>
            <button onClick={() => setHapusModal(null)} style={{ width: "100%", padding: "13px", border: "none", borderRadius: "12px", background: "none", fontSize: "13px", color: "#9CA3AF", cursor: "pointer" }}>
              Batal
            </button>
          </div>
        </div>
      )}

      {editingMsg && (
        <div style={{ position: "fixed", inset: 0, zIndex: 998, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: "20px 20px 0 0", padding: "24px", width: "100%", maxWidth: "480px" }}>
            <div style={{ fontWeight: "800", fontSize: "15px", color: "#0A0A0A", marginBottom: "16px" }}>Edit Pesan</div>
            <textarea value={editTeks} onChange={e => setEditTeks(e.target.value)}
              style={{ width: "100%", border: "2px solid #E5E7EB", borderRadius: "12px", padding: "12px", fontSize: "14px", fontFamily: "inherit", outline: "none", resize: "none", minHeight: "100px", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button onClick={() => { setEditingMsg(null); setEditTeks(""); }} style={{ flex: 1, padding: "13px", border: "1.5px solid #E5E7EB", borderRadius: "12px", background: "none", fontSize: "13px", fontWeight: "700", color: "#374151", cursor: "pointer" }}>Batal</button>
              <button onClick={handleSimpanEdit} style={{ flex: 2, padding: "13px", border: "none", borderRadius: "12px", background: "#0A0A0A", fontSize: "13px", fontWeight: "700", color: "white", cursor: "pointer" }}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <img src={lightbox} alt="preview" style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: "12px" }} />
        </div>
      )}
    </div>
  );
}
