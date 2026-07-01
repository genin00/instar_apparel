import { useState } from "react";
import Header from "../../components/Header.jsx";
import { getAlamat, tambahAlamat, updateAlamat, hapusAlamat } from "../../lib/auth.js";
import { SectionCard } from "./komponenAkun.jsx";

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

export default HalamanAlamat;
