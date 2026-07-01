import { useState } from "react";
import Header from "../../components/Header.jsx";
import config from "../../config.js";
import { logout } from "../../lib/auth.js";
import HalamanAuth from "./HalamanAuth.jsx";
import HalamanProfil from "./HalamanProfil.jsx";
import HalamanAlamat from "./HalamanAlamat.jsx";
import { Avatar, MenuItem, SectionCard } from "./komponenAkun.jsx";

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

