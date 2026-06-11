// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — SUPPORT
// ═══════════════════════════════════════════════════════════

import { useState } from "react";
import Header from "../components/Header.jsx";
import config from "../config.js";

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "white", borderRadius: "12px",
      marginBottom: "8px", overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "14px 16px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "12px",
          background: "none", border: "none", cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ fontWeight: "700", fontSize: "13px", color: "#0A0A0A", flex: 1 }}>
          {q}
        </div>
        <div style={{
          width: "24px", height: "24px", borderRadius: "50%",
          background: open ? "#0A0A0A" : "#F2F2F0",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.2s",
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
            <path d="M1 3L5 7L9 3" stroke={open ? "white" : "#9CA3AF"}
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
      {open && (
        <div style={{
          padding: "0 16px 14px",
          fontSize: "13px", color: "#6B7280", lineHeight: 1.6,
          borderTop: "1px solid #F2F2F0",
          paddingTop: "12px",
        }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function Support() {
  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
      <Header halaman="support" judul="Support" />

      <div style={{ padding: "16px", maxWidth: "480px", margin: "0 auto" }}>

        {/* ── KONTAK CEPAT ── */}
        <div style={{
          background: "#0A0A0A", borderRadius: "16px",
          padding: "20px", marginBottom: "20px", color: "white",
        }}>
          <div style={{
            fontSize: "10px", letterSpacing: "3px",
            color: "#6B7280", marginBottom: "12px", fontWeight: "700",
          }}>
            HUBUNGI KAMI
          </div>

          {/* WA Bisnis */}
          <button
            onClick={() => {
              const msg = encodeURIComponent(config.waPesan.orderBaru);
              window.open(`https://wa.me/${config.whatsapp.bisnis}?text=${msg}`, "_blank");
            }}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "12px",
              background: "#1A1A1A", borderRadius: "10px", border: "none",
              padding: "12px 14px", cursor: "pointer", marginBottom: "8px",
              textAlign: "left",
            }}
          >
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: "#25D366", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "20px", flexShrink: 0,
            }}>💬</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "700", fontSize: "13px", color: "white" }}>
                WhatsApp Bisnis
              </div>
              <div style={{ fontSize: "11px", color: "#6B7280" }}>
                Order, pembayaran, konfirmasi
              </div>
            </div>
            <div style={{ color: "#6B7280", fontSize: "16px" }}>→</div>
          </button>

          {/* WA Desainer */}
          <button
            onClick={() => {
              const msg = encodeURIComponent(config.waPesan.konsultasi);
              window.open(`https://wa.me/${config.whatsapp.desainer}?text=${msg}`, "_blank");
            }}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "12px",
              background: "#1A1A1A", borderRadius: "10px", border: "none",
              padding: "12px 14px", cursor: "pointer", marginBottom: "8px",
              textAlign: "left",
            }}
          >
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: "#C8392B", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "20px", flexShrink: 0,
            }}>✏️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "700", fontSize: "13px", color: "white" }}>
                Konsultasi Desainer
              </div>
              <div style={{ fontSize: "11px", color: "#6B7280" }}>
                Diskusi desain, revisi, brief
              </div>
            </div>
            <div style={{ color: "#6B7280", fontSize: "16px" }}>→</div>
          </button>

          {/* Email */}
          <button
            onClick={() => window.open(`mailto:${config.brand.email}`, "_blank")}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "12px",
              background: "#1A1A1A", borderRadius: "10px", border: "none",
              padding: "12px 14px", cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: "#3B82F6", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "20px", flexShrink: 0,
            }}>📧</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "700", fontSize: "13px", color: "white" }}>
                Email Support
              </div>
              <div style={{ fontSize: "11px", color: "#6B7280" }}>
                {config.brand.email}
              </div>
            </div>
            <div style={{ color: "#6B7280", fontSize: "16px" }}>→</div>
          </button>
        </div>

        {/* ── JAM OPERASIONAL ── */}
        <div style={{
          background: "white", borderRadius: "14px",
          padding: "16px", marginBottom: "20px",
        }}>
          <div style={{
            fontSize: "10px", letterSpacing: "2px", color: "#9CA3AF",
            fontWeight: "700", marginBottom: "12px",
          }}>
            JAM OPERASIONAL
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "13px", color: "#374151", fontWeight: "600" }}>
              {config.jamOperasional.hari}
            </span>
            <span style={{ fontSize: "13px", fontWeight: "800", color: "#0A0A0A" }}>
              {config.jamOperasional.jam}
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
            Libur: {config.jamOperasional.libur}
          </div>
        </div>

        {/* ── LOKASI ── */}
        <div style={{
          background: "white", borderRadius: "14px",
          padding: "16px", marginBottom: "20px",
        }}>
          <div style={{
            fontSize: "10px", letterSpacing: "2px", color: "#9CA3AF",
            fontWeight: "700", marginBottom: "12px",
          }}>
            LOKASI TOKO
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: "#F2F2F0", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "20px", flexShrink: 0,
            }}>📍</div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: "700", fontSize: "13px",
                color: "#0A0A0A", lineHeight: 1.5, marginBottom: "8px",
              }}>
                {config.brand.address}
              </div>
              <button
                onClick={() => window.open(config.brand.mapsUrl, "_blank")}
                style={{
                  background: "#0A0A0A", color: "white", border: "none",
                  borderRadius: "8px", padding: "8px 16px",
                  fontSize: "12px", fontWeight: "700", cursor: "pointer",
                }}
              >
                Buka Maps →
              </button>
            </div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div>
          <div style={{
            fontSize: "10px", letterSpacing: "2px", color: "#9CA3AF",
            fontWeight: "700", marginBottom: "12px",
          }}>
            FAQ
          </div>
          {config.faq.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>

      </div>
    </div>
  );
}

