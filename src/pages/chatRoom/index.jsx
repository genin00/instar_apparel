// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — CHAT ROOM (1-on-1 realtime)
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
import {
  getMessages, sendMessage, markAsRead,
  subscribeToMessages, uploadChatImage,
} from "../lib/chatService.js";
import { supabase } from "../lib/supabase.js";

import { formatWaktu, formatTanggal, groupByTanggal } from "./utilChat.js";

export default function ChatRoom({ akun, conversation, onBack, onAccDesain }) {
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [loading,     setLoading]     = useState(true);
  const [sending,     setSending]     = useState(false);
  const [imgLoading,  setImgLoading]  = useState(false);
  const [previewImg,  setPreviewImg]  = useState(null);
  const [lightbox,    setLightbox]    = useState(null);
  const [accDone,     setAccDone]     = useState(false);
  const [popupMsg,    setPopupMsg]    = useState(null);
  const [editingMsg,  setEditingMsg]  = useState(null);
  const [editTeks,    setEditTeks]    = useState("");
  const [hapusModal,  setHapusModal]  = useState(null);
  const longPressRef = useRef(null);
  const bottomRef  = useRef(null);
  const fileRef    = useRef(null);
  const inputRef   = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    loadMessages();
    markAsRead(conversation.id, "customer");

    channelRef.current = subscribeToMessages(conversation.id, (newMsg) => {
      setMessages(prev => {
        if (prev.find(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      if (newMsg.sender_role === "desainer") {
        markAsRead(conversation.id, "customer");
      }
    });

    return () => {
      if (channelRef.current) channelRef.current.unsubscribe();
    };
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await getMessages(conversation.id);
      setMessages(data);
      // Cek apakah sudah ada acc_request yang di-acc
      const sudahAcc = data.some(m => m.type === "acc_done");
      setAccDone(sudahAcc);
      // Kalau sudah acc sebelumnya, tidak auto-redirect (biarkan user lihat chat)
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text && !previewImg) return;
    if (sending || imgLoading) return;

    setSending(true);
    try {
      let imageUrl = null;
      if (previewImg) {
        setImgLoading(true);
        imageUrl = await uploadChatImage(previewImg.file, akun.id);
        setImgLoading(false);
        setPreviewImg(null);
      }
      await sendMessage({
        conversationId: conversation.id,
        senderId:       akun.id,
        senderRole:     "customer",
        body:           text || null,
        imageUrl,
      });
      setInput("");
    } catch (e) {
      console.error(e);
      alert("Gagal kirim pesan. Coba lagi.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang didukung.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewImg({ file, url });
    e.target.value = "";
  };

  const handleAcc = async () => {
    try {
      await sendMessage({
        conversationId: conversation.id,
        senderId:       akun.id,
        senderRole:     "customer",
        body:           "ACC_DONE",
        imageUrl:       null,
        type:           "acc_done",
      });
      setAccDone(true);
      onAccDesain?.(conversation);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLongPress = (msg) => {
    const isMe = msg.sender_role === "customer";
    if (!isMe) return;
    if (msg.type && msg.type !== "text") return;
    setPopupMsg(msg);
  };

  const startLongPress = (msg) => {
    longPressRef.current = setTimeout(() => handleLongPress(msg), 500);
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
        deleted_for: [...existing, akun.id],
      }).eq("id", msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id
        ? { ...m, deleted_for: [...(m.deleted_for || []), akun.id] }
        : m
      ));
      setHapusModal(null);
    } catch(e) { alert("Gagal hapus: " + e.message); }
  };

  const handleHapusSemua = async () => {
    try {
      const msg = hapusModal;
      await supabase.from("messages").update({
        body: null,
        image_url: null,
        deleted_for: ["all"],
      }).eq("id", msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id
        ? { ...m, body: null, image_url: null, deleted_for: ["all"] }
        : m
      ));
      setHapusModal(null);
    } catch(e) { alert("Gagal hapus: " + e.message); }
  };

  const grouped = groupByTanggal(messages);

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      background: "#F2F2F0", maxWidth: "480px", margin: "0 auto", position: "relative",
    }}>

      {/* HEADER */}
      <div style={{
        background: "white", borderBottom: "1px solid #E5E7EB",
        padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0, position: "relative" }}>
          ✏️
          <div style={{ position: "absolute", bottom: "1px", right: "1px", width: "10px", height: "10px", borderRadius: "50%", background: "#22C55E", border: "2px solid white" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "800", fontSize: "14px", color: "#0A0A0A" }}>Desainer Instar</div>
          <div style={{ fontSize: "11px", color: "#22C55E", fontWeight: "600" }}>Online</div>
        </div>
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", paddingBottom: "8px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: "13px" }}>Memuat pesan...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>👋</div>
            <div style={{ fontWeight: "700", fontSize: "14px", color: "#0A0A0A", marginBottom: "6px" }}>Halo! Ada yang bisa kami bantu?</div>
            <div style={{ fontSize: "12px", color: "#9CA3AF" }}>Ceritakan kebutuhan desain kamu</div>
          </div>
        ) : (
          grouped.map((item, i) => {
            if (item.type === "date") {
              return (
                <div key={`date-${i}`} style={{ textAlign: "center", margin: "16px 0 10px" }}>
                  <span style={{ background: "rgba(0,0,0,0.06)", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", color: "#6B7280", fontWeight: "600" }}>
                    {item.label}
                  </span>
                </div>
              );
            }

            const msg  = item.data;
            const isMe = msg.sender_role === "customer";

            // Bubble ACC Request dari desainer
            if (msg.type === "acc_request") {
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                  <div style={{
                    background: "white", border: "2px solid #10B981", borderRadius: "18px",
                    padding: "18px 20px", textAlign: "center", maxWidth: "280px",
                    boxShadow: "0 4px 16px rgba(16,185,129,0.15)",
                  }}>
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>🎨</div>
                    <div style={{ fontWeight: "900", fontSize: "15px", color: "#0A0A0A", marginBottom: "4px" }}>Desain Siap!</div>
                    <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "14px", lineHeight: 1.5 }}>
                      Desainer telah menyelesaikan desain kamu. Setujui untuk lanjut ke produksi.
                    </div>
                    {accDone ? (
                      <button onClick={() => onAccDesain?.(conversation)} style={{
                        background: "#D1FAE5", border: "none", borderRadius: "10px",
                        padding: "8px 16px", fontSize: "13px", fontWeight: "700",
                        color: "#065F46", cursor: "pointer", width: "100%",
                      }}>
                        ✓ Lanjut ke Checkout
                      </button>
                    ) : (
                      <button onClick={handleAcc} style={{
                        background: "#10B981", border: "none", borderRadius: "10px",
                        padding: "10px 24px", color: "white", fontWeight: "800",
                        fontSize: "14px", cursor: "pointer", width: "100%",
                      }}>
                        ✓ ACC Desain
                      </button>
                    )}
                    <div style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "8px" }}>{formatWaktu(msg.created_at)}</div>
                  </div>
                </div>
              );
            }

            // Bubble ACC Done
            if (msg.type === "acc_done") {
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                  <div style={{ background: "#D1FAE5", borderRadius: "20px", padding: "8px 18px", fontSize: "12px", fontWeight: "700", color: "#065F46" }}>
                    ✓ Customer telah ACC desain · {formatWaktu(msg.created_at)}
                  </div>
                </div>
              );
            }

            const showRead = isMe && msg.is_read;
            const dihapusSemua = (msg.deleted_for || []).includes("all");
            const dihapusSaya  = (msg.deleted_for || []).includes(akun.id);
            if (dihapusSaya && !dihapusSemua) return null;

            return (
              <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: "6px" }}>
                <div style={{ maxWidth: "75%" }}
                  onTouchStart={() => startLongPress(msg)}
                  onTouchEnd={cancelLongPress}
                  onTouchMove={cancelLongPress}
                  onMouseDown={() => startLongPress(msg)}
                  onMouseUp={cancelLongPress}
                  onMouseLeave={cancelLongPress}
                >
                  <div style={{
                    background: dihapusSemua ? "#F3F4F6" : isMe ? "#0A0A0A" : "white",
                    color: dihapusSemua ? "#9CA3AF" : isMe ? "white" : "#0A0A0A",
                    borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    padding: msg.image_url && !msg.body && !dihapusSemua ? "4px" : "10px 14px",
                    fontSize: "13px", lineHeight: 1.5,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)", overflow: "hidden",
                    fontStyle: dihapusSemua ? "italic" : "normal",
                  }}>
                    {dihapusSemua ? "Pesan telah dihapus" : (
                      <>
                        {msg.image_url && (
                          <img src={msg.image_url} alt="gambar" onClick={() => setLightbox(msg.image_url)}
                            style={{ width: "100%", maxWidth: "220px", borderRadius: "12px", display: "block", cursor: "pointer", marginBottom: msg.body ? "8px" : "0" }} />
                        )}
                        {msg.body && <span>{msg.body}</span>}
                        {msg.is_edited && <span style={{ fontSize: "10px", opacity: 0.6, marginLeft: "6px" }}>Diedit</span>}
                      </>
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", alignItems: "center", gap: "4px", marginTop: "3px", padding: "0 4px" }}>
                    <span style={{ fontSize: "10px", color: "#9CA3AF" }}>{formatWaktu(msg.created_at)}</span>
                    {isMe && (
                      <span style={{ fontSize: "11px" }}>
                        {showRead ? <span style={{ color: "#3B82F6" }}>✓✓</span> : <span style={{ color: "#9CA3AF" }}>✓</span>}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* PREVIEW GAMBAR */}
      {previewImg && (
        <div style={{ background: "white", borderTop: "1px solid #E5E7EB", padding: "10px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img src={previewImg.url} alt="preview" style={{ width: "60px", height: "60px", borderRadius: "10px", objectFit: "cover" }} />
            <button onClick={() => setPreviewImg(null)} style={{ position: "absolute", top: "-6px", right: "-6px", background: "#0A0A0A", color: "white", border: "none", borderRadius: "50%", width: "18px", height: "18px", fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
          <div style={{ fontSize: "12px", color: "#6B7280", flex: 1 }}>{previewImg.file.name}</div>
        </div>
      )}

      {/* INPUT */}
      <div style={{ background: "white", borderTop: "1px solid #E5E7EB", padding: "10px 16px 24px", display: "flex", alignItems: "flex-end", gap: "10px" }}>
        <button onClick={() => fileRef.current?.click()} disabled={imgLoading} style={{ background: "#F2F2F0", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: "18px" }}>📷</button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis pesan..."
          rows={1}
          style={{ flex: 1, background: "#F2F2F0", border: "none", borderRadius: "20px", padding: "10px 16px", fontSize: "13px", color: "#0A0A0A", resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.5, maxHeight: "100px", overflowY: "auto" }}
        />
        <button onClick={handleSend} disabled={sending || imgLoading || (!input.trim() && !previewImg)}
          style={{ background: (sending || imgLoading || (!input.trim() && !previewImg)) ? "#E5E7EB" : "#0A0A0A", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}>
          {sending || imgLoading ? (
            <div style={{ width: "16px", height: "16px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      {/* POPUP MENU */}
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

      {/* MODAL HAPUS */}
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

      {/* EDIT PESAN */}
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

      {/* LIGHTBOX */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <img src={lightbox} alt="preview" style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: "12px" }} />
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "36px", height: "36px", color: "white", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
