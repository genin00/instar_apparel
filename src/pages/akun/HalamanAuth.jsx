import { useState } from "react";
import Header from "../../components/Header.jsx";
import { InstarLogo } from "../../components/Header.jsx";
import { kirimOTP, verifikasiOTP } from "../../services/otpService.js";
import { register, login, loginFleksibel, resetPassword, loginWithGoogle } from "../../lib/auth.js";

function HalamanAuth() {
  const [layar, setLayar] = useState("utama"); // utama | daftar-hp | daftar-email | login
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
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
    if (!identifier.trim()) { setError("Email / No HP / Username tidak boleh kosong"); return; }
    if (!password.trim()) { setError("Password tidak boleh kosong"); return; }
    reset(); setLoading(true);
    try {
      await loginFleksibel({ identifier: identifier.trim(), password });
    } catch (e) {
      setError(e.message || "Identitas atau password salah.");
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
      await loginWithGoogle();
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
            <div style={{ fontWeight: "600", fontSize: "12px", color: "#374151", marginBottom: "6px" }}>Email / No HP / Username</div>
            <input value={identifier} onChange={e => { setIdentifier(e.target.value); reset(); }}
              placeholder="Email, 08xx, atau username" type="text" style={S.input} />
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
            <div style={{ fontWeight: "600", fontSize: "12px", color: "#374151", marginBottom: "6px" }}>Email / No HP / Username</div>
            <input value={identifier} onChange={e => { setIdentifier(e.target.value); reset(); }}
              placeholder="Email, 08xx, atau username" type="text" style={S.input} />
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

export default HalamanAuth;
