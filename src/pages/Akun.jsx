// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — AKUN (Shopee-style)
// ═══════════════════════════════════════════════════════════

import { useState } from "react";
import Header from "../components/Header.jsx";
import config from "../config.js";
import { InstarLogo } from "../components/Header.jsx";

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "white", borderRadius: "12px", marginBottom: "8px", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", padding: "14px 16px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "12px",
        background: "none", border: "none", cursor: "pointer", textAlign: "left",
      }}>
        <div style={{ fontWeight: "700", fontSize: "13px", color: "#0A0A0A", flex: 1 }}>{q}</div>
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
          padding: "12px 16px 14px", fontSize: "13px",
          color: "#6B7280", lineHeight: 1.6, borderTop: "1px solid #F2F2F0",
        }}>{a}</div>
      )}
    </div>
  );
}

function MenuItem({ icon, bg, label, sub, action, badge }) {
  return (
    <button onClick={action || undefined} style={{
      width: "100%", display: "flex", alignItems: "center", gap: "12px",
      background: "white", borderRadius: "12px",
      padding: "14px 16px", border: "none",
      cursor: action ? "pointer" : "default",
      marginBottom: "8px", textAlign: "left",
    }}>
      <div style={{
        width: "40px", height: "40px", borderRadius: "10px",
        background: bg || "#F2F2F0", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: "20px", flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "700", fontSize: "13px", color: "#0A0A0A" }}>{label}</div>
        {sub && <div style={{ fontSize: "11px", color: "#9CA3AF", lineHeight: 1.4, marginTop: "2px" }}>{sub}</div>}
      </div>
      {badge && (
        <div style={{
          background: "#C8392B", color: "white",
          fontSize: "10px", fontWeight: "800",
          padding: "2px 7px", borderRadius: "20px",
        }}>{badge}</div>
      )}
      {action && !badge && <div style={{ color: "#9CA3AF", fontSize: "16px" }}>→</div>}
    </button>
  );
}

// ── BELUM LOGIN ─────────────────────────────────────────
function HalamanLogin({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [nama, setNama] = useState("");
  const [noWA, setNoWA] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!nama.trim()) { setError("Nama tidak boleh kosong"); return; }
    if (!noWA.trim()) { setError("Nomor WA tidak boleh kosong"); return; }
    if (noWA.length < 10) { setError("Nomor WA tidak valid"); return; }
    setError("");
    onLogin({ nama: nama.trim(), noWA: noWA.trim() });
  };

  const S = {
    input: {
      width: "100%", borderRadius: "10px", border: "2px solid #E5E7EB",
      padding: "12px 14px", fontSize: "14px", outline: "none",
      boxSizing: "border-box", fontFamily: "inherit", marginBottom: "12px",
    },
  };

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
      <Header halaman="akun" judul="Akun" />
      <div style={{ padding: "32px 20px 0", maxWidth: "480px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "20px",
            background: "#0A0A0A", display: "flex",
            alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
          }}>
            <InstarLogo size={44} white />
          </div>
          <div style={{ fontWeight: "900", fontSize: "20px", color: "#0A0A0A" }}>
            {mode === "login" ? "Masuk ke Akun" : "Buat Akun Baru"}
          </div>
          <div style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "4px" }}>
            {mode === "login" ? "Masuk untuk melihat pesanan kamu" : "Daftar untuk mulai custom kaos"}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "14px" }}>
          <div style={{ fontWeight: "700", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Nama Lengkap</div>
          <input value={nama} onChange={e => { setNama(e.target.value); setError(""); }}
            placeholder="Masukkan nama lengkap" style={S.input} />
          <div style={{ fontWeight: "700", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Nomor WhatsApp</div>
          <input value={noWA} onChange={e => { setNoWA(e.target.value); setError(""); }}
            placeholder="08xxxxxxxxxx" type="tel"
            style={{ ...S.input, marginBottom: error ? "6px" : "0" }} />
          {error && <div style={{ fontSize: "12px", color: "#C8392B", marginBottom: "10px" }}>⚠️ {error}</div>}
        </div>

        <button onClick={handleSubmit} style={{
          width: "100%", padding: "14px", borderRadius: "12px", border: "none",
          background: "#0A0A0A", color: "white", fontWeight: "900",
          fontSize: "15px", cursor: "pointer", marginBottom: "12px",
        }}>
          {mode === "login" ? "Masuk →" : "Daftar →"}
        </button>

        <div style={{ textAlign: "center" }}>
          <button onClick={() => { setMode(mode === "login" ? "daftar" : "login"); setError(""); }}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#9CA3AF" }}>
            {mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
          </button>
        </div>

        <div style={{
          background: "#F9FAFB", borderRadius: "12px", padding: "14px", marginTop: "20px",
          fontSize: "12px", color: "#9CA3AF", lineHeight: 1.6, textAlign: "center",
        }}>
          Data kamu disimpan di perangkat ini saja dan hanya digunakan untuk keperluan pesanan.
        </div>
      </div>
    </div>
  );
}

// ── SUDAH LOGIN ──────────────────────────────────────────
export default function Akun({ akun, pesananList = [], onLogin, onLogout, onLihatPesanan, wishlist = [], onCustom }) {
  if (!akun) return <HalamanLogin onLogin={onLogin} />;

  const hitungStatus = (...statuses) =>
    pesananList.filter(p => statuses.includes(p.status)).length || null;

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
      <Header halaman="akun" judul="Akun" />

      <div style={{ padding: "16px", maxWidth: "480px", margin: "0 auto" }}>

        {/* ── PROFILE CARD ── */}
        <div style={{
          background: "#0A0A0A", borderRadius: "16px",
          padding: "20px", marginBottom: "16px", color: "white",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "#C8392B", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "24px", fontWeight: "900", flexShrink: 0,
            }}>
              {akun.nama.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: "900", fontSize: "18px" }}>{akun.nama}</div>
              <div style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px" }}>📞 {akun.noWA}</div>
            </div>
          </div>
        </div>

        {/* ── PESANAN SAYA ── */}
        <div style={{ background: "white", borderRadius: "14px", padding: "16px", marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ fontWeight: "800", fontSize: "14px", color: "#0A0A0A" }}>Pesanan Saya</div>
            <button onClick={onLihatPesanan} style={{
              background: "none", border: "none", fontSize: "12px",
              fontWeight: "700", color: "#9CA3AF", cursor: "pointer",
            }}>Lihat Semua →</button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {[
              {
                label: "Belum Bayar", count: hitungStatus("diterima", "konfirmasi"), filter: ["diterima", "konfirmasi"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="#374151" strokeWidth="1.6"/>
                    <path d="M2 10h20" stroke="#374151" strokeWidth="1.6"/>
                    <path d="M6 15h4" stroke="#374151" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                label: "Desain", count: hitungStatus("desain"), filter: ["desain"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 19l7-7-3-3-7 7v3h3z" stroke="#374151" strokeWidth="1.6" strokeLinejoin="round"/>
                    <path d="M16 5l3 3" stroke="#374151" strokeWidth="1.6" strokeLinecap="round"/>
                    <path d="M5 21h14" stroke="#374151" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                label: "Cetak", count: hitungStatus("produksi", "qc"), filter: ["produksi", "qc"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9V4h12v5" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="2" y="9" width="20" height="8" rx="2" stroke="#374151" strokeWidth="1.6"/>
                    <path d="M6 14h12v6H6z" stroke="#374151" strokeWidth="1.6" strokeLinejoin="round"/>
                    <circle cx="18" cy="13" r="1" fill="#374151"/>
                  </svg>
                ),
              },
              {
                label: "Dikirim", count: hitungStatus("dikirim"), filter: ["dikirim"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12h13M3 6h8M3 18h8" stroke="#374151" strokeWidth="1.6" strokeLinecap="round"/>
                    <path d="M16 6l5 6-5 6" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                label: "Selesai", count: hitungStatus("selesai"), filter: ["selesai"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#374151" strokeWidth="1.6"/>
                    <path d="M8 12l3 3 5-5" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
            ].map((s, i) => (
              <button key={i} onClick={() => onLihatPesanan(s.filter)} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "6px", background: "none", border: "none", cursor: "pointer",
                padding: "0 2px",
              }}>
                <div style={{ position: "relative", display: "inline-flex" }}>
                  {s.icon}
                  {s.count > 0 && (
                    <div style={{
                      position: "absolute", top: "-6px", right: "-8px",
                      background: "#C8392B", color: "white",
                      fontSize: "10px", fontWeight: "900",
                      minWidth: "16px", height: "16px",
                      borderRadius: "10px", padding: "0 4px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{s.count}</div>
                  )}
                </div>
                <div style={{ fontSize: "10px", color: "#6B7280", fontWeight: "600", textAlign: "center", lineHeight: 1.3 }}>{s.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── WISHLIST ── */}
        {wishlist.length > 0 && (
          <div style={{ marginBottom: "12px" }}>
            <div style={{
              fontSize: "10px", letterSpacing: "2px", color: "#9CA3AF",
              fontWeight: "700", marginBottom: "10px",
            }}>FAVORIT SAYA</div>
            <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px" }}>
              {wishlist.slice(0, 5).map((produk) => (
                <button key={produk.id} onClick={() => onCustom?.(produk)} style={{
                  flexShrink: 0, width: "80px", background: "white",
                  borderRadius: "10px", border: "none", cursor: "pointer",
                  padding: "8px",
                }}>
                  <div style={{ fontSize: "28px", textAlign: "center", marginBottom: "4px" }}>👕</div>
                  <div style={{ fontSize: "9px", fontWeight: "700", color: "#374151",
                    textAlign: "center", lineHeight: 1.3, overflow: "hidden",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                  }}>{produk.nama}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── BANTUAN & INFORMASI ── */}
        <div style={{
          fontSize: "10px", letterSpacing: "2px", color: "#9CA3AF",
          fontWeight: "700", marginBottom: "10px",
        }}>BANTUAN & INFORMASI</div>

        <MenuItem
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/></svg>}
          bg="#25D366" label="WhatsApp Bisnis" sub="Order, pembayaran, konfirmasi"
          action={() => { const msg = encodeURIComponent(config.waPesan.orderBaru); window.open(`https://wa.me/${config.whatsapp.bisnis}?text=${msg}`, "_blank"); }} />

        <MenuItem
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          bg="#C8392B" label="Konsultasi Desainer" sub="Diskusi desain, revisi, brief"
          action={() => { const msg = encodeURIComponent(config.waPesan.konsultasi); window.open(`https://wa.me/${config.whatsapp.desainer}?text=${msg}`, "_blank"); }} />

        <MenuItem
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/><path d="M22 6l-10 7L2 6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>}
          bg="#3B82F6" label="Email Support" sub={config.brand.email}
          action={() => window.open(`mailto:${config.brand.email}`, "_blank")} />

        <MenuItem
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#374151" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="10" r="3" stroke="#374151" strokeWidth="1.8"/></svg>}
          bg="#F2F2F0" label="Lokasi Toko" sub={config.brand.address}
          action={() => window.open(config.brand.mapsUrl, "_blank")} />

        <MenuItem
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#374151" strokeWidth="1.8"/><path d="M12 7v5l3 3" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          bg="#F2F2F0" label="Jam Operasional" sub={`${config.jamOperasional.hari} · ${config.jamOperasional.jam}`} />

        {/* ── FAQ ── */}
        <div style={{
          fontSize: "10px", letterSpacing: "2px", color: "#9CA3AF",
          fontWeight: "700", margin: "16px 0 10px",
        }}>FAQ</div>
        {config.faq.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} />
        ))}

        {/* ── APP INFO ── */}
        <div style={{
          textAlign: "center", padding: "20px 0",
          fontSize: "11px", color: "#9CA3AF",
        }}>
          <div style={{ marginBottom: "4px", fontWeight: "700", letterSpacing: "1px" }}>INSTAR APPAREL</div>
          <div>{config.brand.tagline}</div>
          <div style={{ marginTop: "4px" }}>v1.0.0</div>
        </div>

        {/* ── LOGOUT ── */}
        <button onClick={onLogout} style={{
          width: "100%", padding: "13px", borderRadius: "12px",
          border: "2px solid #FCA5A5", background: "#FEF2F2",
          color: "#C8392B", fontWeight: "800", fontSize: "14px", cursor: "pointer",
        }}>
          Keluar dari Akun
        </button>

      </div>
    </div>
  );
}
