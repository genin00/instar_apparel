// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — CHAT ROOM (1-on-1 realtime)
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
import {
  getMessages, sendMessage, markAsRead,
  subscribeToMessages, uploadChatImage,
} from "../lib/chatService.js";

function formatWaktu(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function formatTanggal(iso) {
  if (!iso) return "";
  const d   = new Date(iso);
  const now = new Date();
  const isToday     = d.toDateString() === now.toDateString();
  const isYesterday = d.toDateString() === new Date(now - 86400000).toDateString();
  if (isToday)     return "Hari ini";
  if (isYesterday) return "Kemarin";
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long" });
}

function groupByTanggal(messages) {
  const groups = [];
  let lastDate = null;
  for (const msg of messages) {
    const tanggal = formatTanggal(msg.created_at);
    if (tanggal !== lastDate) {
      groups.push({ type: "date", label: tanggal });
      lastDate = tanggal;
    }
    groups.push({ type: "msg", data: msg });
  }
  return groups;
}

export default function ChatRoom({ akun, conversation, onBack }) {
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [loading,     setLoading]     = useState(true);
  const [sending,     setSending]     = useState(false);
  const [imgLoading,  setImgLoading]  = useState(false);
  const [previewImg,  setPreviewImg]  = useState(null); // preview sebelum kirim
  const [lightbox,    setLightbox]    = useState(null); // fullscreen gambar
  const bottomRef  = useRef(null);
  const fileRef    = useRef(null);
  const inputRef   = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    loadMessages();
    markAsRead(conversation.id, "customer");

    // Subscribe realtime
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

  const grouped = groupByTanggal(messages);

  return (
    <div style={{
      display:       "flex",
      flexDirection: "column",
      height:        "100vh",
      background:    "#F2F2F0",
      maxWidth:      "480px",
      margin:        "0 auto",
      position:      "relative",
    }}>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div style={{
        background:    "white",
        borderBottom:  "1px solid #E5E7EB",
        padding:       "12px 16px",
        display:       "flex",
        alignItems:    "center",
        gap:           "12px",
        position:      "sticky",
        top:           0,
        zIndex:        10,
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none",
            cursor: "pointer", padding: "4px",
            display: "flex", alignItems: "center",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#0A0A0A" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Avatar */}
        <div style={{
          width: "40px", height: "40px", borderRadius: "50%",
          background: "#0A0A0A", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: "18px", flexShrink: 0, position: "relative",
        }}>
          ✏️
          <div style={{
            position: "absolute", bottom: "1px", right: "1px",
            width: "10px", height: "10px", borderRadius: "50%",
            background: "#22C55E", border: "2px solid white",
          }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "800", fontSize: "14px", color: "#0A0A0A" }}>
            Desainer Instar
          </div>
          <div style={{ fontSize: "11px", color: "#22C55E", fontWeight: "600" }}>
            Online
          </div>
        </div>

        {conversation.order_id && (
          <div style={{
            background: "#F2F2F0", borderRadius: "8px",
            padding: "5px 10px", fontSize: "10px",
            fontWeight: "700", color: "#6B7280",
          }}>
            #{conversation.order_id}
          </div>
        )}
      </div>

      {/* ── MESSAGES ───────────────────────────────────────── */}
      <div style={{
        flex:        1,
        overflowY:   "auto",
        padding:     "16px",
        paddingBottom: "8px",
      }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: "13px" }}>
            Memuat pesan...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>👋</div>
            <div style={{ fontWeight: "700", fontSize: "14px", color: "#0A0A0A", marginBottom: "6px" }}>
              Halo! Ada yang bisa kami bantu?
            </div>
            <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
              Ceritakan kebutuhan desain kamu
            </div>
          </div>
        ) : (
          grouped.map((item, i) => {
            if (item.type === "date") {
              return (
                <div key={`date-${i}`} style={{
                  textAlign: "center", margin: "16px 0 10px",
                }}>
                  <span style={{
                    background: "rgba(0,0,0,0.06)", borderRadius: "20px",
                    padding: "4px 12px", fontSize: "11px",
                    color: "#6B7280", fontWeight: "600",
                  }}>
                    {item.label}
                  </span>
                </div>
              );
            }

            const msg       = item.data;
            const isMe      = msg.sender_role === "customer";
            const showRead  = isMe && msg.is_read;

            return (
              <div
                key={msg.id}
                style={{
                  display:       "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  marginBottom:  "6px",
                }}
              >
                <div style={{ maxWidth: "75%" }}>
                  {/* Bubble */}
                  <div style={{
                    background:   isMe ? "#0A0A0A" : "white",
                    color:        isMe ? "white" : "#0A0A0A",
                    borderRadius: isMe
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                    padding:      msg.image_url && !msg.body ? "4px" : "10px 14px",
                    fontSize:     "13px",
                    lineHeight:   1.5,
                    boxShadow:    "0 1px 2px rgba(0,0,0,0.06)",
                    overflow:     "hidden",
                  }}>
                    {msg.image_url && (
                      <img
                        src={msg.image_url}
                        alt="gambar"
                        onClick={() => setLightbox(msg.image_url)}
                        style={{
                          width:        "100%",
                          maxWidth:     "220px",
                          borderRadius: "12px",
                          display:      "block",
                          cursor:       "pointer",
                          marginBottom: msg.body ? "8px" : "0",
                        }}
                      />
                    )}
                    {msg.body && <span>{msg.body}</span>}
                  </div>

                  {/* Waktu + status baca */}
                  <div style={{
                    display:       "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    alignItems:    "center",
                    gap:           "4px",
                    marginTop:     "3px",
                    padding:       "0 4px",
                  }}>
                    <span style={{ fontSize: "10px", color: "#9CA3AF" }}>
                      {formatWaktu(msg.created_at)}
                    </span>
                    {isMe && (
                      <span style={{ fontSize: "11px" }}>
                        {showRead ? (
                          <span style={{ color: "#3B82F6" }}>✓✓</span>
                        ) : (
                          <span style={{ color: "#9CA3AF" }}>✓</span>
                        )}
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

      {/* ── PREVIEW GAMBAR ─────────────────────────────────── */}
      {previewImg && (
        <div style={{
          background:  "white",
          borderTop:   "1px solid #E5E7EB",
          padding:     "10px 16px",
          display:     "flex",
          alignItems:  "center",
          gap:         "10px",
        }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img
              src={previewImg.url}
              alt="preview"
              style={{ width: "60px", height: "60px", borderRadius: "10px", objectFit: "cover" }}
            />
            <button
              onClick={() => setPreviewImg(null)}
              style={{
                position:   "absolute", top: "-6px", right: "-6px",
                background: "#0A0A0A", color: "white", border: "none",
                borderRadius: "50%", width: "18px", height: "18px",
                fontSize: "10px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >✕</button>
          </div>
          <div style={{ fontSize: "12px", color: "#6B7280", flex: 1 }}>
            {previewImg.file.name}
          </div>
        </div>
      )}

      {/* ── INPUT AREA ─────────────────────────────────────── */}
      <div style={{
        background:   "white",
        borderTop:    "1px solid #E5E7EB",
        padding:      "10px 16px 24px",
        display:      "flex",
        alignItems:   "flex-end",
        gap:          "10px",
      }}>
        {/* Tombol lampir gambar */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={imgLoading}
          style={{
            background:   "#F2F2F0",
            border:       "none",
            borderRadius: "50%",
            width:        "40px",
            height:       "40px",
            display:      "flex",
            alignItems:   "center",
            justifyContent: "center",
            cursor:       "pointer",
            flexShrink:   0,
            fontSize:     "18px",
          }}
        >
          📷
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Input teks */}
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis pesan..."
          rows={1}
          style={{
            flex:         1,
            background:   "#F2F2F0",
            border:       "none",
            borderRadius: "20px",
            padding:      "10px 16px",
            fontSize:     "13px",
            color:        "#0A0A0A",
            resize:       "none",
            outline:      "none",
            fontFamily:   "inherit",
            lineHeight:   1.5,
            maxHeight:    "100px",
            overflowY:    "auto",
          }}
        />

        {/* Tombol kirim */}
        <button
          onClick={handleSend}
          disabled={sending || imgLoading || (!input.trim() && !previewImg)}
          style={{
            background:    (sending || imgLoading || (!input.trim() && !previewImg))
              ? "#E5E7EB" : "#0A0A0A",
            border:        "none",
            borderRadius:  "50%",
            width:         "40px",
            height:        "40px",
            display:       "flex",
            alignItems:    "center",
            justifyContent: "center",
            cursor:        (sending || imgLoading) ? "not-allowed" : "pointer",
            flexShrink:    0,
            transition:    "background 0.2s",
          }}
        >
          {sending || imgLoading ? (
            <div style={{
              width: "16px", height: "16px", border: "2px solid white",
              borderTopColor: "transparent", borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="white" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      {/* ── LIGHTBOX GAMBAR ────────────────────────────────── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position:   "fixed", inset: 0, zIndex: 999,
            background: "rgba(0,0,0,0.92)",
            display:    "flex", alignItems: "center", justifyContent: "center",
            padding:    "20px",
          }}
        >
          <img
            src={lightbox}
            alt="preview"
            style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: "12px" }}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position:   "absolute", top: "20px", right: "20px",
              background: "rgba(255,255,255,0.15)", border: "none",
              borderRadius: "50%", width: "36px", height: "36px",
              color: "white", fontSize: "18px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

