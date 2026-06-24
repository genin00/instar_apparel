import { useState } from "react";
import supabase from "../lib/supabase.js";

export default function Login({ onLogin }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Isi email dan password"); return; }
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError("Email atau password salah"); return; }
    onLogin(data.user);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0A0A0A 60%, #1a1a2e 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "32px", fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* Logo */}
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <img
          src="/instarapparellogo.png"
          style={{ width: "72px", height: "72px", objectFit: "contain", marginBottom: "16px", filter: "brightness(0) invert(1)" }}
        />
        <div style={{ fontWeight: "900", fontSize: "24px", color: "#FFFFFF", letterSpacing: "4px" }}>INSTAR</div>
        <div style={{ fontSize: "11px", color: "#6B7280", letterSpacing: "6px", marginTop: "4px" }}>DESAINER</div>
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "360px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "20px", padding: "28px",
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "20px", textAlign: "center" }}>
          Masuk ke panel desainer
        </div>

        <div style={{ marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", color: "#6B7280", fontWeight: "700", marginBottom: "6px", letterSpacing: "1px" }}>EMAIL</div>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@instar.com"
            type="email"
            style={{
              width: "100%", padding: "13px 16px",
              borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.07)", color: "white",
              fontSize: "14px", boxSizing: "border-box", outline: "none",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", color: "#6B7280", fontWeight: "700", marginBottom: "6px", letterSpacing: "1px" }}>PASSWORD</div>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="••••••••"
            type="password"
            style={{
              width: "100%", padding: "13px 16px",
              borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.07)", color: "white",
              fontSize: "14px", boxSizing: "border-box", outline: "none",
              fontFamily: "inherit",
            }}
          />
        </div>

        {error && (
          <div style={{
            background: "rgba(200,57,43,0.15)", border: "1px solid rgba(200,57,43,0.3)",
            color: "#F87171", fontSize: "13px", padding: "10px 14px",
            borderRadius: "10px", marginBottom: "16px", textAlign: "center",
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "14px",
            borderRadius: "12px", border: "none",
            background: loading ? "#374151" : "#C8392B",
            color: "white", fontWeight: "900", fontSize: "15px",
            cursor: loading ? "default" : "pointer",
            letterSpacing: "0.5px", transition: "background 0.2s",
          }}
        >
          {loading ? "Masuk..." : "Masuk →"}
        </button>
      </div>

      <div style={{ marginTop: "24px", fontSize: "11px", color: "#374151" }}>
        Instar Apparel © 2026
      </div>
    </div>
  );
}
