// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — CHAT CENTER (daftar conversation)
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
import Header from "../components/Header.jsx";
import { getConversationsByCustomer, getOrCreateConversation } from "../lib/chatService.js";

function formatWaktu(isoString) {
  if (!isoString) return "";
  const d    = new Date(isoString);
  const now  = new Date();
  const diff = now - d;
  const jam  = Math.floor(diff / 3600000);
  const mnt  = Math.floor(diff / 60000);
  if (mnt < 1)   return "Baru saja";
  if (mnt < 60)  return `${mnt} mnt`;
  if (jam < 24)  return `${jam} jam`;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

export default function ChatCenter({ akun, pesananList = [], onOpenRoom, onBack, keranjangCount = 0, onKeranjang, briefContext }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [buatLoading, setBuatLoading]     = useState(false);
  const briefHandled = useRef(false);

  // Auto-buka chat room + kirim pesan brief dari CustomBuilder
  useEffect(() => {
    if (!briefContext || !akun || briefHandled.current) return;
    briefHandled.current = true;

    const bukaRoom = async () => {
      try {
        const { getOrCreateConversation, sendMessage } = await import("../lib/chatService.js");
        const conv = await getOrCreateConversation(akun.id, null);

        const lines = [
          "Halo! Saya ingin konsultasi desain kaos:",
          "\u2022 Produk: " + briefContext.produk.nama,
          "\u2022 Warna: " + briefContext.warnaLabel,
          "\u2022 Kategori: " + briefContext.briefKat,
          "\u2022 Desain depan: " + briefContext.briefTeks.depan,
        ];
        if (briefContext.briefTeks.belakang) {
          lines.push("\u2022 Desain belakang: " + briefContext.briefTeks.belakang);
        }
        lines.push(
          "\u2022 Ukuran: " + briefContext.satuanSize + " x " + briefContext.satuanQty + " pcs"
        );
        const pesanAwal = lines.join("\n");

        await sendMessage({
          conversationId: conv.id,
          senderId:       akun.id,
          senderRole:     "customer",
          body:           pesanAwal,
          imageUrl:       null,
        });
        onOpenRoom(conv);
      } catch (e) {
        console.error("Brief auto-chat error:", e?.message, e?.code, e?.details, e?.hint, JSON.stringify(e));
      }
    };

    bukaRoom();
  }, [briefContext, akun]);

  useEffect(() => {
    if (!akun) return;
    fetchConversations();
  }, [akun]);

  const fetchConversations = async () => {
    try {
      const data = await getConversationsByCustomer(akun.id);
      setConversations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBuatChat = async (orderId = null) => {
    setBuatLoading(true);
    try {
      const conv = await getOrCreateConversation(akun.id, orderId);
      onOpenRoom(conv);
    } catch (e) {
      console.error(e);
    } finally {
      setBuatLoading(false);
    }
  };

  // Pesanan yang belum ada conversation-nya
  const pesananBelumChat = pesananList.filter(
    p => !conversations.some(c => c.order_id === p.orderId)
  );

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
      <Header
        halaman="chat"
        judul="Chat Desainer"
        keranjangCount={keranjangCount}
        onKeranjang={onKeranjang}
        onBack={onBack}
      />

      <div style={{ padding: "16px" }}>

        {/* ── HERO CARD ── */}
        <div style={{
          background:    "#0A0A0A",
          borderRadius:  "20px",
          padding:       "20px",
          marginBottom:  "20px",
          position:      "relative",
          overflow:      "hidden",
        }}>
          {/* Dekorasi lingkaran */}
          <div style={{
            position: "absolute", right: "-20px", top: "-20px",
            width: "100px", height: "100px", borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }} />
          <div style={{
            position: "absolute", right: "20px", bottom: "-30px",
            width: "80px", height: "80px", borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          }} />

          <div style={{ fontSize: "28px", marginBottom: "8px" }}>✏️</div>
          <div style={{ fontWeight: "900", fontSize: "18px", color: "white", marginBottom: "6px" }}>
            Konsultasi Desain
          </div>
          <div style={{ fontSize: "12px", color: "#9CA3AF", lineHeight: 1.6, marginBottom: "16px" }}>
            Diskusi langsung dengan tim desainer kami.<br />
            Upload referensi, brief, dan revisi mudah.
          </div>
          <button
            onClick={() => handleBuatChat(null)}
            disabled={buatLoading}
            style={{
              background:    "white",
              color:         "#0A0A0A",
              border:        "none",
              borderRadius:  "12px",
              padding:       "11px 20px",
              fontSize:      "13px",
              fontWeight:    "900",
              cursor:        buatLoading ? "not-allowed" : "pointer",
              opacity:       buatLoading ? 0.7 : 1,
            }}
          >
            {buatLoading ? "Membuka..." : "+ Chat Baru"}
          </button>
        </div>

        {/* ── CHAT DARI PESANAN ── */}
        {pesananBelumChat.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{
              fontSize: "10px", letterSpacing: "2px",
              color: "#9CA3AF", fontWeight: "700", marginBottom: "10px",
            }}>
              MULAI CHAT DARI PESANAN
            </div>
            {pesananBelumChat.slice(0, 3).map(p => (
              <button
                key={p.orderId}
                onClick={() => handleBuatChat(p.orderId)}
                disabled={buatLoading}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  gap: "12px", background: "white", borderRadius: "14px",
                  border: "none", padding: "14px 16px", marginBottom: "8px",
                  cursor: "pointer", textAlign: "left",
                }}
              >
                <div style={{
                  width: "42px", height: "42px", borderRadius: "10px",
                  background: "#F2F2F0", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "20px", flexShrink: 0,
                }}>🧾</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "800", fontSize: "13px", color: "#0A0A0A" }}>
                    Pesanan #{p.orderId}
                  </div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>
                    {p.tanggal} · {p.totalQty} item
                  </div>
                </div>
                <div style={{ color: "#9CA3AF", fontSize: "16px" }}>→</div>
              </button>
            ))}
          </div>
        )}

        {/* ── DAFTAR CONVERSATION ── */}
        <div style={{
          fontSize: "10px", letterSpacing: "2px",
          color: "#9CA3AF", fontWeight: "700", marginBottom: "10px",
        }}>
          PERCAKAPAN AKTIF
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: "13px" }}>
            Memuat percakapan...
          </div>
        ) : conversations.length === 0 ? (
          <div style={{
            background: "white", borderRadius: "14px",
            padding: "32px 20px", textAlign: "center",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>💬</div>
            <div style={{ fontWeight: "700", fontSize: "14px", color: "#0A0A0A", marginBottom: "6px" }}>
              Belum ada percakapan
            </div>
            <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
              Mulai chat dengan desainer sekarang
            </div>
          </div>
        ) : (
          conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => onOpenRoom(conv)}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: "12px", background: "white", borderRadius: "14px",
                border: conv.unread_customer > 0 ? "1.5px solid #0A0A0A" : "none",
                padding: "14px 16px", marginBottom: "8px",
                cursor: "pointer", textAlign: "left",
              }}
            >
              {/* Avatar desainer */}
              <div style={{
                width: "46px", height: "46px", borderRadius: "50%",
                background: "#0A0A0A", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "18px", flexShrink: 0, position: "relative",
              }}>
                ✏️
                {/* Online indicator */}
                <div style={{
                  position: "absolute", bottom: "1px", right: "1px",
                  width: "10px", height: "10px", borderRadius: "50%",
                  background: "#22C55E", border: "2px solid white",
                }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                  <div style={{ fontWeight: "800", fontSize: "13px", color: "#0A0A0A" }}>
                    {conv.order_id ? `Pesanan #${conv.order_id}` : "Desainer Instar"}
                  </div>
                  <div style={{ fontSize: "10px", color: "#9CA3AF", flexShrink: 0 }}>
                    {formatWaktu(conv.last_at)}
                  </div>
                </div>
                <div style={{
                  fontSize: "12px",
                  color: conv.unread_customer > 0 ? "#0A0A0A" : "#9CA3AF",
                  fontWeight: conv.unread_customer > 0 ? "700" : "400",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {conv.last_message || "Mulai percakapan..."}
                </div>
              </div>

              {/* Unread badge */}
              {conv.unread_customer > 0 && (
                <div style={{
                  background: "#0A0A0A", color: "white",
                  fontSize: "10px", fontWeight: "800",
                  minWidth: "20px", height: "20px", borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "0 5px", flexShrink: 0,
                }}>
                  {conv.unread_customer > 9 ? "9+" : conv.unread_customer}
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

