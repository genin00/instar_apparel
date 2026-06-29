// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — KODE GRUP
// ═══════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { joinKodeGrup, getKaryaGrup } from "../services/karyaService.js";
import karya from "../data/karya.js";

export default function KodeGrup({ akun, onBack, onLihatKarya }) {
  const [kode,      setKode]      = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [sukses,    setSukses]    = useState("");
  const [karyaList, setKaryaList] = useState([]);

  useEffect(() => {
    if (!akun) return;
    getKaryaGrup(akun.id).then(ids => {
      const joined = karya.filter(k => ids.includes(k.id));
      setKaryaList(joined);
    });
  }, [akun]);

  const handleJoin = async () => {
    if (!kode.trim()) { setError("Masukkan kode grup"); return; }
    setLoading(true); setError(""); setSukses("");
    try {
      const karyaId = await joinKodeGrup(kode, akun.id);
      const karyaItem = karya.find(k => k.id === karyaId);
      setSukses("Berhasil bergabung dengan " + (karyaItem?.label || "karya"));
      setKode("");
      const ids = await getKaryaGrup(akun.id);
      setKaryaList(karya.filter(k => ids.includes(k.id)));
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* HEADER */}
      <div style={{ background: "white", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #E5E7EB", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ fontWeight: "800", fontSize: "16px", color: "#0A0A0A" }}>Kode Grup</div>
      </div>

      <div style={{ padding: "16px" }}>

        {/* INPUT KODE */}
        <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
          <div style={{ fontWeight: "800", fontSize: "15px", color: "#0A0A0A", marginBottom: "6px" }}>Masukkan Kode Grup</div>
          <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "16px", lineHeight: 1.6 }}>
            Dapatkan kode dari perwakilan kelasmu untuk melihat dan memberi ulasan pada karya kamu di Instar Apparel.
          </div>
          <input
            value={kode}
            onChange={e => setKode(e.target.value.toUpperCase())}
            placeholder="Contoh: KELAS2024"
            style={{ width: "100%", border: "2px solid #E5E7EB", borderRadius: "12px", padding: "12px 16px", fontSize: "16px", fontWeight: "700", letterSpacing: "3px", textAlign: "center", outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: "12px" }}
          />
          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", color: "#C8392B", fontWeight: "600", marginBottom: "12px" }}>
              {error}
            </div>
          )}
          {sukses && (
            <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", color: "#166534", fontWeight: "600", marginBottom: "12px" }}>
              ✓ {sukses}
            </div>
          )}
          <button onClick={handleJoin} disabled={loading || !kode.trim()} style={{ width: "100%", padding: "13px", border: "none", borderRadius: "12px", background: loading || !kode.trim() ? "#E5E7EB" : "#0A0A0A", color: loading || !kode.trim() ? "#9CA3AF" : "white", fontSize: "14px", fontWeight: "800", cursor: loading || !kode.trim() ? "not-allowed" : "pointer" }}>
            {loading ? "Memproses..." : "Gabung Grup"}
          </button>
        </div>

        {/* KARYA YANG SUDAH DIJOIN */}
        {karyaList.length > 0 && (
          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#9CA3AF", letterSpacing: "1.5px", marginBottom: "10px" }}>KARYA KAMU</div>
            {karyaList.map(k => (
              <div key={k.id} onClick={() => onLihatKarya?.(k)}
                style={{ background: "white", borderRadius: "14px", padding: "14px", marginBottom: "10px", display: "flex", gap: "12px", alignItems: "center", cursor: "pointer" }}>
                <img src={k.gambarUtama} alt={k.label} style={{ width: "60px", height: "60px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "800", fontSize: "14px", color: "#0A0A0A", marginBottom: "2px" }}>{k.label}</div>
                  <div style={{ fontSize: "12px", color: "#9CA3AF" }}>{k.kategori} · {k.tahun}</div>
                  <div style={{ fontSize: "12px", color: "#C8392B", fontWeight: "700", marginTop: "4px" }}>⭐ Beri Ulasan →</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {karyaList.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎨</div>
            <div style={{ fontWeight: "700", fontSize: "14px", color: "#374151", marginBottom: "6px" }}>Belum ada karya</div>
            <div style={{ fontSize: "12px", color: "#9CA3AF" }}>Masukkan kode grup untuk bergabung dengan karya kamu</div>
          </div>
        )}

      </div>
    </div>
  );
}
