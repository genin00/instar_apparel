import { useState } from "react";
import Header from "../../components/Header.jsx";
import { updateProfil, uploadFotoProfil } from "../../lib/auth.js";
import { Avatar } from "./komponenAkun.jsx";
import { SectionCard } from "./komponenAkun.jsx";

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

export default HalamanProfil;
