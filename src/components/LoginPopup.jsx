// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — LOGIN POPUP
// ═══════════════════════════════════════════════════════════
import { useState } from "react";
import { supabase } from "../lib/supabase.js";

export default function LoginPopup({ onClose, onSuccess, pesan = "Login untuk melanjutkan" }) {
  const [mode,     setMode]     = useState("login"); // login | daftar
  const [nama,     setNama]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [noWA,     setNoWA]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError("Email dan password wajib diisi"); return; }
    if (mode === "daftar" && !nama) { setError("Nama wajib diisi"); return; }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { nama, no_wa: noWA, role: "customer" } }
        });
        if (error) throw error;
      }
      onSuccess?.();
      onClose?.();
    } catch (e) {
      setError(e.message || "Terjadi kesalahan");
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={(e) => e.target === e.currentTarget && onClose?.()}>

      <div style={{
        background: "white", borderRadius: "24px 24px 0 0",
        padding: "24px 20px 40px", width: "100%", maxWidth: "480px",
        boxSizing: "border-box",
      }}>
        {/* Handle */}
        <div style={{ width: "40px", height: "4px", background: "#E5E7EB", borderRadius: "2px", margin: "0 auto 20px" }} />

        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <div style={{ fontWeight: "900", fontSize: "18px", color: "#0A0A0A" }}>
            {mode === "login" ? "Masuk Akun" : "Daftar Akun"}
          </div>
          <div style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "4px" }}>{pesan}</div>
        </div>

        {/* Tab login/daftar */}
        <div style={{ display: "flex", background: "#F2F2F0", borderRadius: "12px", padding: "4px", marginBottom: "20px" }}>
          {[["login", "Masuk"], ["daftar", "Daftar"]].map(([id, label]) => (
            <button key={id} onClick={() => { setMode(id); setError(""); }} style={{
              flex: 1, padding: "10px", borderRadius: "10px", border: "none",
              background: mode === id ? "white" : "transparent",
              fontWeight: "800", fontSize: "13px", cursor: "pointer",
              color: mode === id ? "#0A0A0A" : "#9CA3AF",
              boxShadow: mode === id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}>{label}</button>
          ))}
        </div>

        {/* Form */}
        {mode === "daftar" && (
          <>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Nama Lengkap</div>
            <input value={nama} onChange={e => setNama(e.target.value)}
              placeholder="Masukkan nama lengkap"
              style={{ width: "100%", borderRadius: "10px", border: "2px solid #E5E7EB", padding: "11px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "12px", fontFamily: "inherit" }} />
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Nomor WhatsApp</div>
            <input value={noWA} onChange={e => setNoWA(e.target.value)}
              placeholder="08xxxxxxxxxx" type="tel"
              style={{ width: "100%", borderRadius: "10px", border: "2px solid #E5E7EB", padding: "11px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "12px", fontFamily: "inherit" }} />
          </>
        )}

        <div style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Email</div>
        <input value={email} onChange={e => setEmail(e.target.value)}
          placeholder="email@contoh.com" type="email"
          style={{ width: "100%", borderRadius: "10px", border: "2px solid #E5E7EB", padding: "11px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "12px", fontFamily: "inherit" }} />

        <div style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Password</div>
        <input value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Minimal 6 karakter" type="password"
          style={{ width: "100%", borderRadius: "10px", border: "2px solid #E5E7EB", padding: "11px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "16px", fontFamily: "inherit" }} />

        {error && (
          <div style={{ background: "#FEF2F2", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#C8392B", fontWeight: "600", marginBottom: "14px" }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", padding: "14px", borderRadius: "12px", border: "none",
          background: "#0A0A0A", color: "white", fontWeight: "900", fontSize: "15px",
          cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
        }}>
          {loading ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar Sekarang"}
        </button>

      </div>
    </div>
  );
}
