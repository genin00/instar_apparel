// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — KARYA INSTAR (v2)
// ═══════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { getRataRating, getUlasan, tambahUlasan, cekSudahUlasan, joinGrup, cekSudahJoin, getAnggotaGrup } from "../lib/grupService.js";
import karyaData from "../data/karya.js";
import products, { warnaKaos, ukuranTersedia } from "../data/products.js";

const kategoriKarya = [
  { id: "semua",      label: "Semua" },
  { id: "kelas",      label: "Kelas" },
  { id: "event",      label: "Event" },
  { id: "perpisahan", label: "Perpisahan" },
  { id: "komunitas",  label: "Komunitas" },
  { id: "umkm",       label: "UMKM" },
  { id: "instansi",   label: "Instansi" },
  { id: "custom",     label: "Custom" },
];

function KaryaCarousel({ item }) {
  const semuaFoto = [item.gambarUtama, ...(item.galeriDetail || [])].filter(Boolean);
  const [active, setActive] = useState(0);
  if (semuaFoto.length === 0) return null;
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ borderRadius: "16px", overflow: "hidden", background: "#F2F2F0", position: "relative" }}>
        <div style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch" }}
          onScroll={e => {
            const i = Math.round(e.target.scrollLeft / e.target.clientWidth);
            if (i !== active) setActive(i);
          }}>
          {semuaFoto.map((src, i) => (
            <img key={i} src={src} alt={`${item.label} ${i+1}`}
              style={{ width: "100%", flexShrink: 0, scrollSnapAlign: "start",
                display: "block", objectFit: "cover" }}/>
          ))}
        </div>
        {semuaFoto.length > 1 && (
          <div style={{ position: "absolute", bottom: "10px", left: 0, right: 0,
            display: "flex", justifyContent: "center", gap: "5px" }}>
            {semuaFoto.map((_, i) => (
              <div key={i} style={{ width: i===active?"16px":"5px", height: "5px",
                borderRadius: "3px", transition: "all 0.2s",
                background: i===active?"#FFFFFF":"rgba(255,255,255,0.5)" }}/>
            ))}
          </div>
        )}
      </div>
      {semuaFoto.length > 1 && (
        <div style={{ textAlign: "center", fontSize: "10px", color: "#9CA3AF", marginTop: "6px" }}>
          👆 Geser untuk lihat detail ({active+1}/{semuaFoto.length})
        </div>
      )}
    </div>
  );
}

function KaryaModal({ item, onClose, onBuatSepertiIni, akun, onLogin }) {
  const [tab,         setTab]         = useState("info");
  const [ulasan,      setUlasan]      = useState([]);
  const [anggota,     setAnggota]     = useState([]);
  const [rataRating,  setRataRating]  = useState({ rata: 0, total: 0 });
  const [sudahUlasan, setSudahUlasan] = useState(false);
  const [sudahJoin,   setSudahJoin]   = useState(false);
  const [rating,      setRating]      = useState(0);
  const [komentar,    setKomentar]    = useState("");
  const [joinInput,   setJoinInput]   = useState("");
  const [joinError,   setJoinError]   = useState("");
  const [submitLoad,  setSubmitLoad]  = useState(false);
  const [joinLoad,    setJoinLoad]    = useState(false);

  useEffect(() => {
    if (!item) return;
    getRataRating(item.id).then(setRataRating);
    getUlasan(item.id).then(setUlasan);
    getAnggotaGrup(item.id).then(setAnggota);
    if (akun) {
      cekSudahUlasan(item.id, akun.noWA).then(setSudahUlasan);
      cekSudahJoin(item.id, akun.noWA).then(setSudahJoin);
    }
  }, [item, akun]);

  if (!item) return null;
  const produkDasar = products.find(p => p.id === item.produkId) || products[0];

  const handleJoin = async () => {
    if (!joinInput.trim()) { setJoinError("Masukkan ID pesanan"); return; }
    setJoinLoad(true);
    try {
      await joinGrup(joinInput.trim(), akun);
      setSudahJoin(true);
      getAnggotaGrup(item.id).then(setAnggota);
      setJoinInput(""); setJoinError("");
    } catch (e) { setJoinError("ID tidak valid atau sudah bergabung"); }
    setJoinLoad(false);
  };

  const handleUlasan = async () => {
    if (!rating) return;
    setSubmitLoad(true);
    try {
      await tambahUlasan(item.id, akun, rating, komentar);
      setSudahUlasan(true);
      setRating(0); setKomentar("");
      getRataRating(item.id).then(setRataRating);
      getUlasan(item.id).then(setUlasan);
    } catch (e) { console.error(e); }
    setSubmitLoad(false);
  };

  const StarRating = ({ value, onChange, readonly = false }) => (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1,2,3,4,5].map(s => (
        <button key={s} onClick={() => !readonly && onChange?.(s)}
          style={{ background: "none", border: "none", fontSize: readonly ? "14px" : "26px",
            cursor: readonly ? "default" : "pointer",
            color: s <= value ? "#F59E0B" : "#E5E7EB", padding: "2px" }}>★</button>
      ))}
    </div>
  );
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0,
      background: "rgba(10,10,10,0.6)", display: "flex",
      alignItems: "flex-end", justifyContent: "center", zIndex: 200 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#FFFFFF",
        borderRadius: "24px 24px 0 0", width: "100%", maxWidth: "480px",
        maxHeight: "88vh", overflowY: "auto", padding: "20px 20px 24px",
        boxSizing: "border-box" }}>
        <div style={{ width: "36px", height: "4px", borderRadius: "2px",
          background: "#E5E7EB", margin: "0 auto 16px" }}/>
        <KaryaCarousel item={item}/>
        <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#9CA3AF",
          textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>
          {kategoriKarya.find(k => k.id === item.kategori)?.label}
          {item.tahun ? ` · ${item.tahun}` : ""}
        </div>
        <div style={{ fontWeight: "900", fontSize: "20px", color: "#0A0A0A", marginBottom: "2px" }}>
          {item.label}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
          <span style={{ color: "#F59E0B", fontSize: "14px" }}>{"★".repeat(Math.round(rataRating.rata))}</span>
          <span style={{ fontWeight: "800", fontSize: "13px", color: "#374151" }}>{rataRating.rata || "-"}</span>
          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>({rataRating.total} ulasan)</span>
          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>· 👥 {anggota.length}</span>
        </div>
        {item.subjudul && (
          <div style={{ fontSize: "13px", color: "#C8392B", fontWeight: "700", marginBottom: "10px" }}>
            {item.subjudul}
          </div>
        )}

        {/* Tab bar */}
        <div style={{ display: "flex", background: "#E5E7EB", borderRadius: "10px",
          padding: "3px", marginBottom: "14px", gap: "3px" }}>
          {[["info","📋 Info"],["ulasan","⭐ Ulasan"],["grup","👥 Grup"]].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "8px", borderRadius: "8px", border: "none",
              background: tab === t ? "white" : "transparent",
              fontWeight: tab === t ? "800" : "400",
              fontSize: "11px", cursor: "pointer" }}>{l}</button>
          ))}
        </div>
        {/* Tab: Info */}
        {tab === "info" && (
          <div>
            {item.deskripsi && (
              <div style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.6, marginBottom: "16px" }}>
                {item.deskripsi}
              </div>
            )}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontWeight: "700", fontSize: "12px", color: "#374151", marginBottom: "8px" }}>
                Tersedia dalam berbagai warna
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {warnaKaos.slice(0, 8).map(w => (
                  <div key={w.hex} title={w.nama} style={{ width: "26px", height: "26px",
                    borderRadius: "50%", background: w.hex,
                    border: "2px solid " + (w.hex === "#FFFFFF" ? "#E5E7EB" : "transparent") }}/>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontWeight: "700", fontSize: "12px", color: "#374151", marginBottom: "8px" }}>
                Ukuran tersedia
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {ukuranTersedia.map(sz => (
                  <div key={sz} style={{ padding: "6px 12px", borderRadius: "8px",
                    background: "#F2F2F0", fontSize: "12px", fontWeight: "800", color: "#374151" }}>
                    {sz}
                  </div>
                ))}
              </div>
            </div>
            {item.jumlah && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px",
                background: "#F2F2F0", borderRadius: "10px", padding: "10px 14px",
                fontSize: "12px", color: "#374151", fontWeight: "700", marginBottom: "16px" }}>
                📦 Total produksi: {item.jumlah}
              </div>
            )}
            <button onClick={() => onBuatSepertiIni(item, produkDasar)} style={{
              width: "100%", padding: "14px", borderRadius: "12px", border: "none",
              background: "#0A0A0A", color: "white", fontWeight: "900",
              fontSize: "14px", cursor: "pointer", marginBottom: "10px" }}>
              Buat Seperti Ini →
            </button>
            <button onClick={onClose} style={{ width: "100%", padding: "12px",
              borderRadius: "12px", border: "2px solid #E5E7EB", background: "white",
              fontWeight: "700", fontSize: "13px", color: "#6B7280", cursor: "pointer" }}>
              Tutup
            </button>
          </div>
        )}

        {/* Tab: Ulasan */}
        {tab === "ulasan" && (
          <div>
            {!akun && (
              <div style={{ background: "#FEF9C3", borderRadius: "10px", padding: "12px",
                fontSize: "12px", color: "#854D0E", marginBottom: "12px" }}>
                ⚠️ Login dulu untuk memberikan ulasan
              </div>
            )}
            {akun && !sudahJoin && (
              <div style={{ background: "#EFF6FF", borderRadius: "10px", padding: "12px",
                fontSize: "12px", color: "#1D4ED8", marginBottom: "12px" }}>
                ℹ️ Bergabung ke pesanan ini dulu untuk bisa memberikan ulasan
              </div>
            )}
            {akun && sudahJoin && !sudahUlasan && (
              <div style={{ background: "white", borderRadius: "12px", padding: "14px",
                border: "1px solid #E5E7EB", marginBottom: "12px" }}>
                <div style={{ fontWeight: "800", fontSize: "13px", marginBottom: "10px" }}>✍️ Tulis Ulasan</div>
                <StarRating value={rating} onChange={setRating} />
                <textarea value={komentar} onChange={e => setKomentar(e.target.value)}
                  placeholder="Ceritakan pengalamanmu..."
                  style={{ width: "100%", minHeight: "72px", borderRadius: "8px",
                    border: "2px solid #E5E7EB", padding: "10px", fontSize: "13px",
                    resize: "none", outline: "none", boxSizing: "border-box",
                    fontFamily: "inherit", marginTop: "10px", marginBottom: "10px" }} />
                <button onClick={handleUlasan} disabled={!rating || submitLoad}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none",
                    background: rating ? "#C8392B" : "#E5E7EB",
                    color: rating ? "white" : "#9CA3AF",
                    fontWeight: "800", fontSize: "13px",
                    cursor: rating ? "pointer" : "not-allowed" }}>
                  {submitLoad ? "Mengirim..." : "Kirim Ulasan"}
                </button>
              </div>
            )}
            {sudahUlasan && (
              <div style={{ background: "#ECFDF5", borderRadius: "10px", padding: "12px",
                fontSize: "12px", color: "#065F46", fontWeight: "600", marginBottom: "12px" }}>
                ✅ Kamu sudah memberikan ulasan
              </div>
            )}
            {ulasan.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px", color: "#9CA3AF" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>⭐</div>
                <div style={{ fontSize: "13px" }}>Belum ada ulasan</div>
              </div>
            ) : ulasan.map(u => (
              <div key={u.id} style={{ background: "white", borderRadius: "10px",
                padding: "12px", marginBottom: "8px", border: "1px solid #E5E7EB" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <div style={{ fontWeight: "800", fontSize: "13px" }}>{u.nama_user}</div>
                  <StarRating value={u.rating} readonly />
                </div>
                {u.komentar && (
                  <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.5 }}>{u.komentar}</div>
                )}
                <div style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "4px" }}>
                  {new Date(u.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Grup */}
        {tab === "grup" && (
          <div>
            {!akun ? (
              <div style={{ background: "white", borderRadius: "12px", padding: "20px",
                textAlign: "center", border: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: "36px", marginBottom: "10px" }}>🔐</div>
                <div style={{ fontWeight: "800", fontSize: "14px", marginBottom: "6px" }}>Login Dulu</div>
                <button onClick={onLogin} style={{ background: "#0A0A0A", color: "white",
                  border: "none", borderRadius: "8px", padding: "10px 24px",
                  fontWeight: "800", fontSize: "13px", cursor: "pointer" }}>
                  Login Sekarang
                </button>
              </div>
            ) : sudahJoin ? (
              <div style={{ background: "#ECFDF5", borderRadius: "10px", padding: "14px",
                textAlign: "center", marginBottom: "12px" }}>
                <div style={{ fontSize: "28px", marginBottom: "6px" }}>✅</div>
                <div style={{ fontWeight: "800", fontSize: "13px", color: "#065F46" }}>Kamu sudah bergabung!</div>
              </div>
            ) : (
              <div style={{ background: "white", borderRadius: "12px", padding: "14px",
                border: "1px solid #E5E7EB", marginBottom: "12px" }}>
                <div style={{ fontWeight: "800", fontSize: "14px", marginBottom: "6px" }}>🔗 Bergabung ke Pesanan</div>
                <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "12px", lineHeight: 1.5 }}>
                  Masukkan ID pesanan dari ketua grup. Contoh: <strong>IA-300730</strong>
                </div>
                <input value={joinInput} onChange={e => { setJoinInput(e.target.value.toUpperCase()); setJoinError(""); }}
                  placeholder="IA-XXXXXX"
                  style={{ width: "100%", borderRadius: "8px", border: "2px solid #E5E7EB",
                    padding: "10px 12px", fontSize: "14px", fontWeight: "700",
                    outline: "none", boxSizing: "border-box", letterSpacing: "2px",
                    fontFamily: "monospace", marginBottom: "8px",
                    background: "white", color: "#0A0A0A" }} />
                {joinError && <div style={{ fontSize: "11px", color: "#C8392B", marginBottom: "8px" }}>⚠️ {joinError}</div>}
                <button onClick={handleJoin} disabled={joinLoad} style={{
                  width: "100%", padding: "10px", borderRadius: "8px", border: "none",
                  background: "#0A0A0A", color: "white", fontWeight: "800",
                  fontSize: "13px", cursor: "pointer" }}>
                  {joinLoad ? "Memproses..." : "🔗 Bergabung"}
                </button>
              </div>
            )}
            <div style={{ fontWeight: "700", fontSize: "12px", color: "#6B7280", marginBottom: "10px" }}>
              👥 {anggota.length} Anggota
            </div>
            {anggota.map((a, i) => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "10px",
                background: "white", borderRadius: "10px", padding: "10px 12px",
                marginBottom: "6px", border: "1px solid #E5E7EB" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "50%",
                  background: "#0A0A0A", display: "flex", alignItems: "center",
                  justifyContent: "center", color: "white", fontWeight: "900",
                  fontSize: "14px", flexShrink: 0 }}>
                  {a.nama_user.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "700", fontSize: "12px" }}>{a.nama_user}</div>
                  <div style={{ fontSize: "10px", color: "#9CA3AF" }}>
                    {new Date(a.joined_at).toLocaleDateString("id-ID")}
                  </div>
                </div>
                {i === 0 && (
                  <div style={{ background: "#C8392B", color: "white", fontSize: "9px",
                    fontWeight: "800", padding: "2px 8px", borderRadius: "20px" }}>Ketua</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function KaryaInstar({ preview = false, onLihatSemua, onBuatSepertiIni, akun, onLogin }) {
  const [filterAktif, setFilterAktif] = useState("semua");
  const [selectedItem, setSelectedItem] = useState(null);

  const karyaTampil = preview
    ? karyaData.slice(0, 4)
    : filterAktif === "semua"
      ? karyaData
      : karyaData.filter(k => k.kategori === filterAktif);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "flex-end", marginBottom: "16px" }}>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#9CA3AF",
            marginBottom: "4px", textTransform: "uppercase" }}>Hasil Karya</div>
          <div style={{ fontWeight: 900, fontSize: "20px", color: "#0A0A0A" }}>Karya Instar</div>
        </div>
        {preview && (
          <button onClick={onLihatSemua} style={{ background: "none", border: "none",
            fontSize: "12px", fontWeight: "700", color: "#9CA3AF", cursor: "pointer" }}>
            Lihat Semua →
          </button>
        )}
      </div>

      {/* Filter */}
      {!preview && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px",
          overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }}>
          {kategoriKarya.map(kat => (
            <button key={kat.id} onClick={() => setFilterAktif(kat.id)} style={{
              flexShrink: 0, padding: "8px 16px", borderRadius: "50px",
              border: "none",
              background: filterAktif === kat.id ? "#0A0A0A" : "#FFFFFF",
              color: filterAktif === kat.id ? "#FFFFFF" : "#6B7280",
              fontSize: "12px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}>
              {kat.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {karyaTampil.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px",
          color: "#9CA3AF", fontSize: "13px" }}>
          Belum ada karya di kategori ini.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          {karyaTampil.map(item => (
            <button key={item.id} onClick={() => setSelectedItem(item)} style={{
              borderRadius: "14px", aspectRatio: "1/1", position: "relative",
              overflow: "hidden", border: "none", cursor: "pointer",
              padding: 0, background: "#F2F2F0", display: "block" }}>
              <img src={item.gambarUtama} alt={item.label}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0,
                background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
                padding: "24px 10px 10px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700",
                  color: "#FFFFFF", textAlign: "left", lineHeight: 1.3 }}>
                  {item.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <KaryaModal item={selectedItem} onClose={() => setSelectedItem(null)} akun={akun} onLogin={onLogin}
        onBuatSepertiIni={(item, produkDasar) => {
          setSelectedItem(null);
          onBuatSepertiIni?.(item, produkDasar);
        }}/>
    </div>
  );
}
