// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — AKUN (Supabase Auth + Shopee-style)
// ═══════════════════════════════════════════════════════════

import { useState } from "react";
import Header from "../components/Header.jsx";
import config from "../config.js";
import { InstarLogo } from "../components/Header.jsx";
import { kirimOTP, verifikasiOTP, formatPhone } from "../services/otpService.js";
import { register, login, logout, updateProfil, uploadFotoProfil, getAlamat, tambahAlamat, updateAlamat, hapusAlamat, resetPassword } from "../lib/auth.js";

// ── AVATAR ───────────────────────────────────────────────────
function Avatar({ profil, size = 56 }) {
  if (profil?.foto_url) {
    return (
      <img src={profil.foto_url} alt="foto profil"
        style={{ width: size, height: size, borderRadius: size / 4,
          objectFit: "cover", flexShrink: 0 }} />
    );
  }
  const inisial = (profil?.nama || "?").charAt(0).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 4,
      background: "#C8392B", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontSize: size * 0.4, fontWeight: "900",
      color: "white", flexShrink: 0,
    }}>{inisial}</div>
  );
}

// ── FAQ ITEM ─────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #F2F2F0" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", padding: "14px 0",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "12px",
        background: "none", border: "none", cursor: "pointer", textAlign: "left",
      }}>
        <div style={{ fontWeight: "600", fontSize: "13px", color: "#0A0A0A", flex: 1 }}>{q}</div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
          <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div style={{ paddingBottom: "14px", fontSize: "13px", color: "#6B7280", lineHeight: 1.6 }}>{a}</div>
      )}
    </div>
  );
}

// ── MENU ITEM ────────────────────────────────────────────────
function MenuItem({ icon, label, sub, action, danger }) {
  return (
    <button onClick={action || undefined} style={{
      width: "100%", display: "flex", alignItems: "center", gap: "14px",
      background: "none", border: "none", borderBottom: "1px solid #F2F2F0",
      padding: "14px 0", cursor: action ? "pointer" : "default", textAlign: "left",
    }}>
      <div style={{ color: danger ? "#C8392B" : "#374151", flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "600", fontSize: "13px", color: danger ? "#C8392B" : "#0A0A0A" }}>{label}</div>
        {sub && <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>{sub}</div>}
      </div>
      {action && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 18l6-6-6-6" stroke={danger ? "#C8392B" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

// ── SECTION CARD ─────────────────────────────────────────────
function SectionCard({ title, children }) {
  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "0 16px", marginBottom: "12px" }}>
      {title && (
        <div style={{ fontSize: "11px", fontWeight: "700", color: "#9CA3AF",
          letterSpacing: "1px", padding: "14px 0 8px", borderBottom: "1px solid #F2F2F0" }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

function HalamanAuth() {
  const [layar, setLayar] = useState("utama"); // utama | daftar-hp | daftar-email | login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [otpKode, setOtpKode] = useState("");
  const [noHpFormatted, setNoHpFormatted] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [resetMode, setResetMode] = useState(false);

  const S = {
    input: {
      width: "100%", borderRadius: "10px", border: "1.5px solid #E5E7EB",
      padding: "12px 14px", fontSize: "14px", outline: "none",
      boxSizing: "border-box", fontFamily: "inherit", marginBottom: "12px",
      background: "#FAFAFA",
    },
    btn: {
      width: "100%", padding: "14px", borderRadius: "12px", border: "none",
      background: "#0A0A0A", color: "white", fontWeight: "900",
      fontSize: "15px", cursor: "pointer", marginBottom: "12px",
    },
    btnOutline: {
      width: "100%", padding: "13px", borderRadius: "12px",
      border: "1.5px solid #E5E7EB", background: "white",
      fontWeight: "700", fontSize: "14px", cursor: "pointer",
      marginBottom: "10px", display: "flex", alignItems: "center",
      justifyContent: "center", gap: "10px", color: "#0A0A0A",
    },
  };

  const reset = () => { setError(""); setInfo(""); };

  // ── LOGIN ──
  const handleLogin = async () => {
    if (!email.trim()) { setError("Email tidak boleh kosong"); return; }
    if (!password.trim()) { setError("Password tidak boleh kosong"); return; }
    reset(); setLoading(true);
    try {
      await login({ email: email.trim(), password });
    } catch (e) {
      setError(e.message || "Email atau password salah.");
    } finally { setLoading(false); }
  };

  // ── DAFTAR EMAIL ──
  const handleDaftarEmail = async () => {
    if (!nama.trim()) {
      setError("Nama tidak boleh kosong");
      return;
    }

    if (!email.trim()) {
      setError("Email tidak boleh kosong");
      return;
    }

    if (!password.trim() || password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    reset();
    setLoading(true);

    try {
      await register({
        email: email.trim(),
        password,
        nama: nama.trim(),
      });

      setInfo("Akun dibuat! Cek email untuk verifikasi lalu login.");
      setLayar("login");
    } catch (e) {
      setError(e.message || "Gagal membuat akun.");
    } finally {
      setLoading(false);
    }
  };

  // ── DAFTAR NO HP ──
  const handleKirimOTP = async () => {
    if (!nama.trim()) { setError("Nama tidak boleh kosong"); return; }
    if (!noHp.trim()) { setError("No HP tidak boleh kosong"); return; }
    reset(); setLoading(true);
    try {
      const phone = await kirimOTP(noHp);
      setNoHpFormatted(phone);
      setOtpMode(true);
      setInfo("Kode OTP dikirim ke WhatsApp kamu");
    } catch (e) {
      setError(e.message || "Gagal kirim OTP.");
    } finally { setLoading(false); }
  };

  const handleVerifikasiOTP = async () => {
    if (!otpKode.trim()) { setError("Masukkan kode OTP"); return; }
    reset(); setLoading(true);
    try {
      const hasil = verifikasiOTP(noHp, otpKode);
      if (!hasil.valid) { setError(hasil.pesan); setLoading(false); return; }
      // TODO: nanti akun dibuat setelah backend WhatsApp Auth selesai
      setInfo("Nomor WhatsApp berhasil diverifikasi.");
      setOtpMode(false);
      setLayar("login");
    } catch (e) {
      setError(e.message || "Gagal membuat akun.");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    try {
      const { supabase } = await import("../lib/supabase.js");
      await supabase.auth.signInWithOAuth({ provider: "google",
        options: { redirectTo: window.location.origin }
      });
    } catch (e) { setError("Gagal login Google: " + e.message); }
  };

  const handleReset = async () => {
    if (!email.trim()) { setError("Masukkan email dulu"); return; }
    reset(); setLoading(true);
    try {
      await resetPassword(email.trim());
      setInfo("Link reset dikirim ke email kamu.");
      setResetMode(false);
    } catch (e) {
      setError(e.message || "Gagal kirim email reset.");
    } finally { setLoading(false); }
  };

  // ── LAYAR OTP ──
  if (otpMode) {
    return (
      <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
        <Header halaman="akun" judul="Verifikasi WA" onBack={() => { setOtpMode(false); reset(); }} />
        <div style={{ padding: "32px 20px 0", maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "52px", marginBottom: "12px" }}>📱</div>
            <div style={{ fontWeight: "900", fontSize: "22px", color: "#0A0A0A" }}>Cek WhatsApp Kamu</div>
            <div style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "6px", lineHeight: 1.6 }}>
              Kode OTP 6 digit dikirim ke<br />
              <strong style={{ color: "#0A0A0A" }}>+{noHpFormatted}</strong>
            </div>
          </div>
          <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "14px" }}>
            <div style={{ fontWeight: "600", fontSize: "12px", color: "#374151", marginBottom: "6px" }}>Kode OTP</div>
            <input value={otpKode} onChange={e => { setOtpKode(e.target.value); reset(); }}
              placeholder="6 digit kode OTP" maxLength={6} type="number"
              style={{ ...S.input, textAlign: "center", fontSize: "24px", fontWeight: "900", letterSpacing: "8px", marginBottom: 0 }} />
            {error && <div style={{ fontSize: "12px", color: "#C8392B", marginTop: "8px" }}>⚠️ {error}</div>}
            {info && <div style={{ fontSize: "12px", color: "#10B981", marginTop: "8px" }}>✅ {info}</div>}
          </div>
          <button onClick={handleVerifikasiOTP} disabled={loading} style={{ ...S.btn, background: loading ? "#E5E7EB" : "#0A0A0A", color: loading ? "#9CA3AF" : "white" }}>
            {loading ? "Memverifikasi..." : "Verifikasi OTP →"}
          </button>
          <div style={{ textAlign: "center" }}>
            <button onClick={async () => { reset(); setLoading(true); try { await kirimOTP(noHp); setInfo("OTP baru dikirim!"); } catch(e){setError(e.message);} finally{setLoading(false);} }}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#C8392B", fontWeight: "700" }}>
              Kirim Ulang OTP
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LAYAR RESET PASSWORD ──
  if (resetMode) {
    return (
      <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
        <Header halaman="akun" judul="Lupa Sandi" onBack={() => { setResetMode(false); reset(); }} />
        <div style={{ padding: "32px 20px 0", maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "14px" }}>
            <div style={{ fontWeight: "600", fontSize: "12px", color: "#374151", marginBottom: "6px" }}>Email</div>
            <input value={email} onChange={e => { setEmail(e.target.value); reset(); }}
              placeholder="email@contoh.com" type="email" style={S.input} />
            {error && <div style={{ fontSize: "12px", color: "#C8392B", marginTop: "8px" }}>⚠️ {error}</div>}
            {info && <div style={{ fontSize: "12px", color: "#10B981", marginTop: "8px" }}>✅ {info}</div>}
          </div>
          <button onClick={handleReset} disabled={loading} style={{ ...S.btn, background: loading ? "#E5E7EB" : "#0A0A0A", color: loading ? "#9CA3AF" : "white" }}>
            {loading ? "Mengirim..." : "Kirim Link Reset →"}
          </button>
        </div>
      </div>
    );
  }

  // ── LAYAR LOGIN ──
  if (layar === "login") {
    return (
      <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
        <Header halaman="akun" judul="Masuk" onBack={() => { setLayar("utama"); reset(); }} />
        <div style={{ padding: "32px 20px 0", maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <InstarLogo size={44} white />
            </div>
            <div style={{ fontWeight: "900", fontSize: "22px", color: "#0A0A0A" }}>Masuk ke Akun</div>
            <div style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "4px" }}>Masuk untuk melanjutkan</div>
          </div>
          <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "14px" }}>
            <div style={{ fontWeight: "600", fontSize: "12px", color: "#374151", marginBottom: "6px" }}>Email</div>
            <input value={email} onChange={e => { setEmail(e.target.value); reset(); }}
              placeholder="email@contoh.com" type="email" style={S.input} />
            <div style={{ fontWeight: "600", fontSize: "12px", color: "#374151", marginBottom: "6px" }}>Password</div>
            <input value={password} onChange={e => { setPassword(e.target.value); reset(); }}
              placeholder="Password" type="password" style={{ ...S.input, marginBottom: 0 }} />
            {error && <div style={{ fontSize: "12px", color: "#C8392B", marginTop: "8px" }}>⚠️ {error}</div>}
            {info && <div style={{ fontSize: "12px", color: "#10B981", marginTop: "8px" }}>✅ {info}</div>}
          </div>
          <button onClick={handleLogin} disabled={loading} style={{ ...S.btn, background: loading ? "#E5E7EB" : "#0A0A0A", color: loading ? "#9CA3AF" : "white" }}>
            {loading ? "Memuat..." : "Masuk →"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "4px 0 14px" }}>
            <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
            <span style={{ fontSize: "12px", color: "#9CA3AF" }}>atau</span>
            <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
          </div>
          <button onClick={handleGoogle} style={S.btnOutline}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Masuk dengan Google
          </button>
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
            <button onClick={() => { setResetMode(true); reset(); }}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#C8392B", fontWeight: "700" }}>
              Lupa Sandi?
            </button>
            <button onClick={() => { setLayar("utama"); reset(); }}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#6B7280" }}>
              Belum punya akun? Daftar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LAYAR DAFTAR NO HP ──
  if (layar === "daftar-hp") {
    return (
      <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
        <Header halaman="akun" judul="Daftar via WhatsApp" onBack={() => { setLayar("utama"); reset(); }} />
        <div style={{ padding: "32px 20px 0", maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "14px" }}>
            {[
              { label: "Nama Lengkap", val: nama, set: setNama, ph: "Nama lengkap", type: "text" },
              { label: "No. HP (WhatsApp)", val: noHp, set: setNoHp, ph: "08xxxxxxxxxx", type: "tel" },
              { label: "Password", val: password, set: setPassword, ph: "Minimal 6 karakter", type: "password" },
            ].map((f, i, arr) => (
              <div key={f.label}>
                <div style={{ fontWeight: "600", fontSize: "12px", color: "#374151", marginBottom: "6px" }}>{f.label}</div>
                <input value={f.val} onChange={e => { f.set(e.target.value); reset(); }}
                  placeholder={f.ph} type={f.type}
                  style={{ ...S.input, marginBottom: i === arr.length - 1 ? 0 : "12px" }} />
              </div>
            ))}
            {error && <div style={{ fontSize: "12px", color: "#C8392B", marginTop: "8px" }}>⚠️ {error}</div>}
            {info && <div style={{ fontSize: "12px", color: "#10B981", marginTop: "8px" }}>✅ {info}</div>}
          </div>
          <button onClick={handleKirimOTP} disabled={loading} style={{ ...S.btn, background: loading ? "#E5E7EB" : "#0A0A0A", color: loading ? "#9CA3AF" : "white" }}>
            {loading ? "Mengirim OTP..." : "Kirim OTP via WhatsApp →"}
          </button>
          <div style={{ textAlign: "center" }}>
            <button onClick={() => { setLayar("login"); reset(); }}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#6B7280" }}>
              Sudah punya akun? Masuk
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LAYAR DAFTAR EMAIL ──
  if (layar === "daftar-email") {
    return (
      <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
        <Header halaman="akun" judul="Daftar via Email" onBack={() => { setLayar("utama"); reset(); }} />
        <div style={{ padding: "32px 20px 0", maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "14px" }}>
            {[
              {
                label: "Nama Lengkap",
                val: nama,
                set: setNama,
                ph: "Nama lengkap",
                type: "text",
              },
              {
                label: "Email",
                val: email,
                set: setEmail,
                ph: "email@gmail.com",
                type: "email",
              },
              {
                label: "Password",
                val: password,
                set: setPassword,
                ph: "Minimal 6 karakter",
                type: "password",
              },
            ].map((f, i, arr) => (
              <div key={f.label}>
                <div style={{ fontWeight: "600", fontSize: "12px", color: "#374151", marginBottom: "6px" }}>{f.label}</div>
                <input value={f.val} onChange={e => { f.set(e.target.value); reset(); }}
                  placeholder={f.ph} type={f.type}
                  style={{ ...S.input, marginBottom: i === arr.length - 1 ? 0 : "12px" }} />
              </div>
            ))}
            {error && <div style={{ fontSize: "12px", color: "#C8392B", marginTop: "8px" }}>⚠️ {error}</div>}
            {info && <div style={{ fontSize: "12px", color: "#10B981", marginTop: "8px" }}>✅ {info}</div>}
          </div>
          <button onClick={handleDaftarEmail} disabled={loading} style={{ ...S.btn, background: loading ? "#E5E7EB" : "#0A0A0A", color: loading ? "#9CA3AF" : "white" }}>
            {loading ? "Mendaftar..." : "Daftar dengan Email →"}
          </button>
          <div style={{ textAlign: "center" }}>
            <button onClick={() => { setLayar("login"); reset(); }}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#6B7280" }}>
              Sudah punya akun? Masuk
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LAYAR UTAMA (pilih metode) ──
  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
      <Header halaman="akun" judul="Akun" />
      <div style={{ padding: "32px 20px 0", maxWidth: "480px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "22px", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <InstarLogo size={50} white />
          </div>
          <div style={{ fontWeight: "900", fontSize: "24px", color: "#0A0A0A" }}>Instar Apparel</div>
          <div style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "4px" }}>Daftar untuk mulai custom kaos</div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#9CA3AF", letterSpacing: "1px", marginBottom: "12px", textAlign: "center" }}>BUAT AKUN BARU</div>

          {/* Daftar No HP */}
          <button onClick={() => { setLayar("daftar-hp"); reset(); }} style={S.btnOutline}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 15.46l-4.27-.36-2.02 2.02C11.39 15.77 8.24 12.63 6.88 9.29L8.91 7.26 8.55 3H3.03C2.45 13.18 10.82 21.55 21 20.97V15.46z" fill="#25D366"/>
            </svg>
            Daftar dengan WhatsApp
          </button>

          {/* Daftar Email */}
          <button onClick={() => { setLayar("daftar-email"); reset(); }} style={S.btnOutline}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="#374151" strokeWidth="1.8"/>
              <path d="M2 8l10 6 10-6" stroke="#374151" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Daftar dengan Email
          </button>

          {/* Daftar Google */}
          <button onClick={handleGoogle} style={S.btnOutline}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Daftar dengan Google
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "8px 0 20px" }}>
          <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
          <span style={{ fontSize: "12px", color: "#9CA3AF" }}>Sudah punya akun?</span>
          <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
        </div>

        <button onClick={() => { setLayar("login"); reset(); }} style={{
          width: "100%", padding: "13px", borderRadius: "12px",
          border: "1.5px solid #0A0A0A", background: "white",
          fontWeight: "800", fontSize: "14px", cursor: "pointer", color: "#0A0A0A",
        }}>
          Masuk ke Akun →
        </button>
      </div>
    </div>
  );
}

// ── HALAMAN PENGATURAN PROFIL ─────────────────────────────────
function HalamanProfil({ profil, userId, onBack, onUpdate }) {
  const [nama, setNama] = useState(profil?.nama || "");
  const [bio, setBio] = useState(profil?.bio || "");
  const [noHp, setNoHp] = useState(profil?.no_hp || "");
  const [jenisKelamin, setJenisKelamin] = useState(profil?.jenis_kelamin || "");
  const [tanggalLahir, setTanggalLahir] = useState(profil?.tanggal_lahir || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState(false);
  const fileRef = useState(null);

  const handleSimpan = async () => {
    setLoading(true); setError(""); setSukses(false);
    try {
      const updated = await updateProfil(userId, { nama, bio, no_hp: noHp, jenis_kelamin: jenisKelamin, tanggal_lahir: tanggalLahir });
      onUpdate(updated);
      setSukses(true);
      setTimeout(() => setSukses(false), 2000);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadFotoProfil(userId, file);
      onUpdate({ ...profil, foto_url: url });
    } catch (e) {
      setError("Gagal upload foto: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const S = {
    label: { fontWeight: "600", fontSize: "12px", color: "#374151", marginBottom: "6px" },
    input: {
      width: "100%", borderRadius: "10px", border: "1.5px solid #E5E7EB",
      padding: "11px 14px", fontSize: "14px", outline: "none",
      boxSizing: "border-box", fontFamily: "inherit", background: "#FAFAFA",
    },
  };

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "100px" }}>
      <Header halaman="profil" judul="Edit Profil" onBack={onBack} />
      <div style={{ padding: "16px", maxWidth: "480px", margin: "0 auto" }}>

        {/* Foto profil */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
          <Avatar profil={profil} size={80} />
          <label style={{
            marginTop: "10px", fontSize: "13px", fontWeight: "700",
            color: "#0A0A0A", cursor: "pointer", padding: "6px 16px",
            background: "white", borderRadius: "20px", border: "1.5px solid #E5E7EB",
          }}>
            Ganti Foto
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFoto} />
          </label>
        </div>

        <SectionCard>
          <div style={S.label}>Nama Lengkap</div>
          <input value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama lengkap" style={{ ...S.input, marginBottom: "14px" }} />
          <div style={S.label}>Bio</div>
          <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Ceritakan sedikit tentang dirimu..." rows={3}
            style={{ ...S.input, resize: "none", marginBottom: "14px" }} />
          <div style={S.label}>Nomor HP</div>
          <input value={noHp} onChange={e => setNoHp(e.target.value)} placeholder="08xxxxxxxxxx" type="tel" style={{ ...S.input, marginBottom: "14px" }} />
          <div style={S.label}>Jenis Kelamin</div>
          <select value={jenisKelamin} onChange={e => setJenisKelamin(e.target.value)}
            style={{ ...S.input, marginBottom: "14px" }}>
            <option value="">Pilih jenis kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
          <div style={S.label}>Tanggal Lahir</div>
          <input value={tanggalLahir} onChange={e => setTanggalLahir(e.target.value)} type="date"
            style={{ ...S.input, marginBottom: 0 }} />
        </SectionCard>

        {error && <div style={{ fontSize: "12px", color: "#C8392B", marginBottom: "10px", padding: "0 4px" }}>⚠️ {error}</div>}
        {sukses && <div style={{ fontSize: "12px", color: "#10B981", marginBottom: "10px", padding: "0 4px" }}>✅ Profil berhasil disimpan!</div>}

        <button onClick={handleSimpan} disabled={loading} style={{
          width: "100%", padding: "14px", borderRadius: "12px", border: "none",
          background: loading ? "#E5E7EB" : "#0A0A0A", color: loading ? "#9CA3AF" : "white",
          fontWeight: "900", fontSize: "15px", cursor: loading ? "not-allowed" : "pointer",
        }}>
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}

// ── HALAMAN ALAMAT ────────────────────────────────────────────
function HalamanAlamat({ userId, onBack }) {
  const [daftarAlamat, setDaftarAlamat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null); // null | "tambah" | alamat object
  const [form, setForm] = useState({ label: "", nama_penerima: "", no_hp: "", alamat_lengkap: "", kota: "", provinsi: "", kode_pos: "", is_utama: false });

  const muat = async () => {
    setLoading(true);
    try { setDaftarAlamat(await getAlamat(userId)); } catch {}
    setLoading(false);
  };

  useState(() => { muat(); }, []);

  const bukaForm = (alamat) => {
    if (alamat === "tambah") {
      setForm({ label: "", nama_penerima: "", no_hp: "", alamat_lengkap: "", kota: "", provinsi: "", kode_pos: "", is_utama: false });
      setFormMode("tambah");
    } else {
      setForm({ ...alamat });
      setFormMode(alamat);
    }
  };

  const handleSimpan = async () => {
    try {
      if (formMode === "tambah") {
        await tambahAlamat(userId, form);
      } else {
        await updateAlamat(formMode.id, form);
      }
      setFormMode(null);
      muat();
    } catch (e) { alert(e.message); }
  };

  const handleHapus = async (id) => {
    if (!confirm("Hapus alamat ini?")) return;
    try { await hapusAlamat(id); muat(); } catch (e) { alert(e.message); }
  };

  const S = {
    input: {
      width: "100%", borderRadius: "10px", border: "1.5px solid #E5E7EB",
      padding: "11px 14px", fontSize: "13px", outline: "none",
      boxSizing: "border-box", fontFamily: "inherit", background: "#FAFAFA", marginBottom: "10px",
    },
  };

  if (formMode !== null) {
    return (
      <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "100px" }}>
        <Header halaman="alamat" judul={formMode === "tambah" ? "Tambah Alamat" : "Edit Alamat"} onBack={() => setFormMode(null)} />
        <div style={{ padding: "16px", maxWidth: "480px", margin: "0 auto" }}>
          <SectionCard>
            {[
              { key: "label", label: "Label (Rumah, Kantor, dll)", placeholder: "Rumah" },
              { key: "nama_penerima", label: "Nama Penerima", placeholder: "Nama lengkap" },
              { key: "no_hp", label: "Nomor HP Penerima", placeholder: "08xxxxxxxxxx" },
              { key: "alamat_lengkap", label: "Alamat Lengkap", placeholder: "Jl. Contoh No. 1" },
              { key: "kota", label: "Kota/Kabupaten", placeholder: "Palopo" },
              { key: "provinsi", label: "Provinsi", placeholder: "Sulawesi Selatan" },
              { key: "kode_pos", label: "Kode Pos", placeholder: "91900" },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontWeight: "600", fontSize: "12px", color: "#374151", marginBottom: "4px" }}>{f.label}</div>
                <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} style={S.input} />
              </div>
            ))}
            <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0", cursor: "pointer" }}>
              <input type="checkbox" checked={form.is_utama} onChange={e => setForm(p => ({ ...p, is_utama: e.target.checked }))} />
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Jadikan Alamat Utama</span>
            </label>
          </SectionCard>
          <button onClick={handleSimpan} style={{
            width: "100%", padding: "14px", borderRadius: "12px", border: "none",
            background: "#0A0A0A", color: "white", fontWeight: "900", fontSize: "15px", cursor: "pointer",
          }}>Simpan Alamat</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "100px" }}>
      <Header halaman="alamat" judul="Alamat Saya" onBack={onBack} />
      <div style={{ padding: "16px", maxWidth: "480px", margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>Memuat...</div>
        ) : daftarAlamat.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📍</div>
            <div style={{ fontWeight: "700", fontSize: "15px", color: "#374151", marginBottom: "6px" }}>Belum ada alamat</div>
            <div style={{ fontSize: "13px", color: "#9CA3AF" }}>Tambahkan alamat pengiriman kamu</div>
          </div>
        ) : (
          daftarAlamat.map(a => (
            <div key={a.id} style={{ background: "white", borderRadius: "14px", padding: "14px 16px", marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <div style={{ fontWeight: "800", fontSize: "13px", color: "#0A0A0A" }}>{a.label || "Alamat"}</div>
                    {a.is_utama && (
                      <div style={{ background: "#0A0A0A", color: "white", fontSize: "9px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px" }}>
                        UTAMA
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: "12px", color: "#374151", fontWeight: "600" }}>{a.nama_penerima} · {a.no_hp}</div>
                  <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px", lineHeight: 1.4 }}>
                    {a.alamat_lengkap}, {a.kota}, {a.provinsi} {a.kode_pos}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <button onClick={() => bukaForm(a)} style={{
                  flex: 1, padding: "8px", borderRadius: "8px",
                  border: "1.5px solid #E5E7EB", background: "white",
                  fontSize: "12px", fontWeight: "700", cursor: "pointer", color: "#374151",
                }}>Edit</button>
                <button onClick={() => handleHapus(a.id)} style={{
                  flex: 1, padding: "8px", borderRadius: "8px",
                  border: "1.5px solid #FCA5A5", background: "#FEF2F2",
                  fontSize: "12px", fontWeight: "700", cursor: "pointer", color: "#C8392B",
                }}>Hapus</button>
              </div>
            </div>
          ))
        )}
        <button onClick={() => bukaForm("tambah")} style={{
          width: "100%", padding: "13px", borderRadius: "12px",
          border: "2px dashed #D1D5DB", background: "white",
          fontWeight: "700", fontSize: "13px", cursor: "pointer", color: "#374151",
          marginTop: "4px",
        }}>+ Tambah Alamat Baru</button>
      </div>
    </div>
  );
}

// ── HALAMAN UTAMA AKUN ────────────────────────────────────────
export default function Akun({ akun, profil, onProfilUpdate, pesananList = [], onLogout, onLihatPesanan, wishlist = [], onCustom, onKodeGrup }) {
  const [subHalaman, setSubHalaman] = useState(null);

  if (!akun) return <HalamanAuth />;

  // Sub-halaman
  if (subHalaman === "profil") {
    return <HalamanProfil profil={profil} userId={akun.id} onBack={() => setSubHalaman(null)} onUpdate={(p) => { onProfilUpdate(p); setSubHalaman(null); }} />;
  }
  if (subHalaman === "alamat") {
    return <HalamanAlamat userId={akun.id} onBack={() => setSubHalaman(null)} />;
  }

  const hitungStatus = (...statuses) =>
    pesananList.filter(p => statuses.includes(p.status)).length || null;

  const handleLogout = async () => {
    try { await logout(); onLogout(); } catch {}
  };

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
      <Header halaman="akun" judul="Akun" />
      <div style={{ padding: "16px", maxWidth: "480px", margin: "0 auto" }}>

        {/* PROFILE CARD */}
        <div style={{ background: "white", borderRadius: "16px", padding: "16px", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <Avatar profil={profil} size={56} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "900", fontSize: "17px", color: "#0A0A0A" }}>
                {profil?.nama || akun.email?.split("@")[0] || "Pengguna"}
              </div>
              <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>{akun.email}</div>
              {profil?.bio && (
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px", lineHeight: 1.4 }}>{profil.bio}</div>
              )}
            </div>
            <button onClick={() => setSubHalaman("profil")} style={{
              background: "#F2F2F0", border: "none", borderRadius: "8px",
              padding: "6px 12px", fontSize: "12px", fontWeight: "700",
              color: "#374151", cursor: "pointer",
            }}>Edit</button>
          </div>
        </div>

        {/* PESANAN SAYA */}
        <SectionCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 12px" }}>
            <div style={{ fontWeight: "800", fontSize: "14px", color: "#0A0A0A" }}>Pesanan Saya</div>
            <button onClick={() => onLihatPesanan()} style={{
              background: "none", border: "none", fontSize: "12px",
              fontWeight: "700", color: "#9CA3AF", cursor: "pointer",
            }}>Lihat Semua →</button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", paddingBottom: "14px" }}>
            {[
              { label: "Belum\nBayar", statuses: ["diterima", "konfirmasi"], icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#374151" strokeWidth="1.6"/><path d="M2 10h20" stroke="#374151" strokeWidth="1.6"/><path d="M6 15h4" stroke="#374151" strokeWidth="1.6" strokeLinecap="round"/></svg> },
              { label: "Desain", statuses: ["desain"], icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 19l7-7-3-3-7 7v3h3z" stroke="#374151" strokeWidth="1.6" strokeLinejoin="round"/><path d="M16 5l3 3" stroke="#374151" strokeWidth="1.6" strokeLinecap="round"/><path d="M5 21h14" stroke="#374151" strokeWidth="1.6" strokeLinecap="round"/></svg> },
              { label: "Cetak", statuses: ["produksi", "qc"], icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M6 9V4h12v5" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><rect x="2" y="9" width="20" height="8" rx="2" stroke="#374151" strokeWidth="1.6"/><path d="M6 14h12v6H6z" stroke="#374151" strokeWidth="1.6" strokeLinejoin="round"/><circle cx="18" cy="13" r="1" fill="#374151"/></svg> },
              { label: "Dikirim", statuses: ["dikirim"], icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M3 12h13M3 6h8M3 18h8" stroke="#374151" strokeWidth="1.6" strokeLinecap="round"/><path d="M16 6l5 6-5 6" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg> },
              { label: "Selesai", statuses: ["selesai"], icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#374151" strokeWidth="1.6"/><path d="M8 12l3 3 5-5" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            ].map((s, i) => {
              const count = hitungStatus(...s.statuses);
              return (
                <button key={i} onClick={() => onLihatPesanan(s.statuses)} style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: "6px", background: "none", border: "none", cursor: "pointer", padding: "0 2px",
                }}>
                  <div style={{ position: "relative" }}>
                    {s.icon}
                    {count > 0 && (
                      <div style={{
                        position: "absolute", top: "-5px", right: "-7px",
                        background: "#C8392B", color: "white", fontSize: "9px",
                        fontWeight: "900", minWidth: "15px", height: "15px",
                        borderRadius: "10px", padding: "0 3px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{count}</div>
                    )}
                  </div>
                  <div style={{ fontSize: "9px", color: "#6B7280", fontWeight: "600", textAlign: "center", lineHeight: 1.3, whiteSpace: "pre-line" }}>{s.label}</div>
                </button>
              );
            })}
          </div>
        </SectionCard>

        {/* AKUN & KEAMANAN */}
        <SectionCard title="AKUN & KEAMANAN">
          <MenuItem
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#374151" strokeWidth="1.7"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#374151" strokeWidth="1.7" strokeLinecap="round"/></svg>}
            label="Edit Profil" sub="Nama, bio, jenis kelamin, tanggal lahir"
            action={() => setSubHalaman("profil")} />
          <MenuItem
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="#374151" strokeWidth="1.7"/><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#374151" strokeWidth="1.7" strokeLinecap="round"/></svg>}
            label="Ganti Password" sub="Ubah password akun kamu"
            action={() => alert("Fitur ganti password akan segera hadir")} />
        </SectionCard>

        {/* PENGIRIMAN */}
        <SectionCard title="PENGIRIMAN">
          <MenuItem
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#374151" strokeWidth="1.7"/><circle cx="12" cy="10" r="3" stroke="#374151" strokeWidth="1.7"/></svg>}
            label="Alamat Saya" sub="Kelola alamat pengiriman"
            action={() => setSubHalaman("alamat")} />
        </SectionCard>

        {/* KARYA */}
        <SectionCard title="KARYA">
          <MenuItem
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#374151" strokeWidth="1.7"/><path d="M8 12l3 3 5-5" stroke="#374151" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            label="Kode Grup"
            sub="Masukkan kode untuk lihat & ulasan karya kamu"
            action={() => onKodeGrup?.()} />
        </SectionCard>

        {/* BANTUAN */}
        <SectionCard title="BANTUAN">
          <MenuItem
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#374151" strokeWidth="1.7"/><path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2 .9 2 2" stroke="#374151" strokeWidth="1.7" strokeLinecap="round"/><circle cx="12" cy="17" r="0.8" fill="#374151"/></svg>}
            label="Pusat Bantuan (FAQ)"
            action={() => setSubHalaman("faq")} />
          <MenuItem
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#374151" strokeWidth="1.7" strokeLinejoin="round"/></svg>}
            label="Hubungi Customer Service" sub="WhatsApp & Email"
            action={() => { const msg = encodeURIComponent(config.waPesan.orderBaru); window.open(`https://wa.me/${config.whatsapp.bisnis}?text=${msg}`, "_blank"); }} />
          <MenuItem
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#374151" strokeWidth="1.7" strokeLinejoin="round"/></svg>}
            label="Suka? Nilai Kami" sub="Beri bintang di Play Store"
            action={() => alert("Mengarahkan ke Play Store...")} />
          <MenuItem
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#374151" strokeWidth="1.7"/><path d="M12 8v4M12 16h.01" stroke="#374151" strokeWidth="1.7" strokeLinecap="round"/></svg>}
            label="Versi Aplikasi" sub="v1.0.0" />
          <MenuItem
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="#C8392B" strokeWidth="1.7" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6" stroke="#C8392B" strokeWidth="1.7" strokeLinejoin="round"/><path d="M10 11v6M14 11v6" stroke="#C8392B" strokeWidth="1.7" strokeLinecap="round"/><path d="M9 6V4h6v2" stroke="#C8392B" strokeWidth="1.7" strokeLinejoin="round"/></svg>}
            label="Ajukan Penghapusan Akun" danger
            action={() => alert("Hubungi CS untuk penghapusan akun")} />
        </SectionCard>

        {/* LOGOUT */}
        <button onClick={handleLogout} style={{
          width: "100%", padding: "13px", borderRadius: "12px",
          border: "1.5px solid #FCA5A5", background: "#FEF2F2",
          color: "#C8392B", fontWeight: "800", fontSize: "14px",
          cursor: "pointer", marginTop: "4px",
        }}>
          Keluar dari Akun
        </button>

        <div style={{ textAlign: "center", padding: "20px 0 0", fontSize: "11px", color: "#D1D5DB" }}>
          INSTAR APPAREL · {config.brand.tagline}
        </div>

      </div>
    </div>
  );
}
