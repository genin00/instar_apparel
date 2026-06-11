// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — AKUN
// ═══════════════════════════════════════════════════════════

import { useState } from "react";
import Header from "../components/Header.jsx";
import config from "../config.js";
import { InstarLogo } from "../components/Header.jsx";

export default function Akun({ akun, onLogin, onLogout, onLihatPesanan }) {
  const [mode,  setMode]  = useState("login"); // "login" | "daftar"
  const [nama,  setNama]  = useState("");
  const [noWA,  setNoWA]  = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!nama.trim()) { setError("Nama tidak boleh kosong"); return; }
    if (!noWA.trim())  { setError("Nomor WA tidak boleh kosong"); return; }
    if (noWA.length < 10) { setError("Nomor WA tidak valid"); return; }
    setError("");
    onLogin({ nama: nama.trim(), noWA: noWA.trim() });
  };

  const S = {
    input: {
      width: "100%", borderRadius: "10px", border: "2px solid #E5E7EB",
      padding: "12px 14px", fontSize: "14px", outline: "none",
      boxSizing: "border-box", fontFamily: "inherit",
      marginBottom: "12px",
    },
  };

  // ── BELUM LOGIN ─────────────────────────────────────────
  if (!akun) {
    return (
      <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
        <Header halaman="akun" judul="Akun" />

        <div style={{ padding: "32px 20px 0", maxWidth: "480px", margin: "0 auto" }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "20px",
              background: "#0A0A0A", display: "flex",
              alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px",
            }}>
              <InstarLogo size={44} white />
            </div>
            <div style={{ fontWeight: "900", fontSize: "20px", color: "#0A0A0A" }}>
              {mode === "login" ? "Masuk ke Akun" : "Buat Akun Baru"}
            </div>
            <div style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "4px" }}>
              {mode === "login"
                ? "Masuk untuk melihat pesanan kamu"
                : "Daftar untuk mulai custom kaos"}
            </div>
          </div>

          {/* Form */}
          <div style={{
            background: "white", borderRadius: "16px",
            padding: "20px", marginBottom: "14px",
          }}>
            <div style={{ fontWeight: "700", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>
              Nama Lengkap
            </div>
            <input
              value={nama}
              onChange={e => { setNama(e.target.value); setError(""); }}
              placeholder="Masukkan nama lengkap"
              style={S.input}
            />
            <div style={{ fontWeight: "700", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>
              Nomor WhatsApp
            </div>
            <input
              value={noWA}
              onChange={e => { setNoWA(e.target.value); setError(""); }}
              placeholder="08xxxxxxxxxx"
              type="tel"
              style={{ ...S.input, marginBottom: error ? "6px" : "0" }}
            />
            {error && (
              <div style={{ fontSize: "12px", color: "#C8392B", marginBottom: "10px" }}>
                ⚠️ {error}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            style={{
              width: "100%", padding: "14px", borderRadius: "12px", border: "none",
              background: "#0A0A0A", color: "white",
              fontWeight: "900", fontSize: "15px",
              cursor: "pointer", marginBottom: "12px",
              letterSpacing: "0.5px",
            }}
          >
            {mode === "login" ? "Masuk →" : "Daftar →"}
          </button>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => { setMode(mode === "login" ? "daftar" : "login"); setError(""); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "13px", color: "#9CA3AF",
              }}
            >
              {mode === "login"
                ? "Belum punya akun? Daftar"
                : "Sudah punya akun? Masuk"}
            </button>
          </div>

          {/* Info */}
          <div style={{
            background: "#F9FAFB", borderRadius: "12px",
            padding: "14px", marginTop: "20px",
            fontSize: "12px", color: "#9CA3AF",
            lineHeight: 1.6, textAlign: "center",
          }}>
            Data kamu disimpan di perangkat ini saja dan hanya digunakan untuk keperluan pesanan.
          </div>
        </div>
      </div>
    );
  }

  // ── SUDAH LOGIN ──────────────────────────────────────────
  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
      <Header halaman="akun" judul="Akun" />

      <div style={{ padding: "16px", maxWidth: "480px", margin: "0 auto" }}>

        {/* Profile card */}
        <div style={{
          background: "#0A0A0A", borderRadius: "16px",
          padding: "20px", marginBottom: "14px", color: "white",
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
              <div style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px" }}>
                📞 {akun.noWA}
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        {[
          {
            label: "Pesanan Saya",
            sub:   "Lihat status dan riwayat pesanan",
            icon:  "📦",
            action: onLihatPesanan,
          },
          {
            label: "Hubungi Kami",
            sub:   "Chat langsung dengan admin",
            icon:  "💬",
            action: () => {
              const msg = encodeURIComponent(config.waPesan.orderBaru);
              window.open(`https://wa.me/${config.whatsapp.bisnis}?text=${msg}`, "_blank");
            },
          },
          {
            label: "Lokasi Toko",
            sub:   config.brand.address,
            icon:  "📍",
            action: () => window.open(config.brand.mapsUrl, "_blank"),
          },
          {
            label: "Jam Operasional",
            sub:   `${config.jamOperasional.hari} · ${config.jamOperasional.jam}`,
            icon:  "🕐",
            action: null,
          },
        ].map((item, i) => (
          <button
            key={i}
            onClick={item.action || undefined}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "12px",
              background: "white", borderRadius: "12px",
              padding: "14px 16px", border: "none",
              cursor: item.action ? "pointer" : "default",
              marginBottom: "8px", textAlign: "left",
            }}
          >
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: "#F2F2F0", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "20px", flexShrink: 0,
            }}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "700", fontSize: "13px", color: "#0A0A0A" }}>
                {item.label}
              </div>
              <div style={{
                fontSize: "11px", color: "#9CA3AF",
                lineHeight: 1.4, marginTop: "2px",
              }}>
                {item.sub}
              </div>
            </div>
            {item.action && (
              <div style={{ color: "#9CA3AF", fontSize: "16px" }}>→</div>
            )}
          </button>
        ))}

        {/* App info */}
        <div style={{
          textAlign: "center", padding: "20px 0",
          fontSize: "11px", color: "#9CA3AF",
        }}>
          <div style={{ marginBottom: "4px", fontWeight: "700", letterSpacing: "1px" }}>
            INSTAR APPAREL
          </div>
          <div>{config.brand.tagline}</div>
          <div style={{ marginTop: "4px" }}>v1.0.0</div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            width: "100%", padding: "13px", borderRadius: "12px",
            border: "2px solid #FCA5A5", background: "#FEF2F2",
            color: "#C8392B", fontWeight: "800", fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Keluar dari Akun
        </button>

      </div>
    </div>
  );
}

