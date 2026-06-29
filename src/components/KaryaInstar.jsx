// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — KARYA INSTAR (v3)
//  + Fitur Ulasan untuk akun yang sudah pernah pesan
// ═══════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import karyaData from "../data/karya.js";
import products, { warnaKaos, ukuranTersedia } from "../data/products.js";
import supabase from "../lib/supabase.js";
import { isMemberKarya } from "../services/karyaService.js";

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

// ── STAR RATING ──────────────────────────────────────────────
function StarRating({ value, onChange, readonly = false }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} onClick={() => !readonly && onChange?.(s)}
          style={{
            background: "none", border: "none",
            fontSize: readonly ? "14px" : "28px",
            cursor: readonly ? "default" : "pointer",
            color: s <= value ? "#F59E0B" : "#E5E7EB",
            padding: "2px", lineHeight: 1,
          }}>★</button>
      ))}
    </div>
  );
}

// ── KARYA CAROUSEL ───────────────────────────────────────────
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
            <img key={i} src={src} alt={`${item.label} ${i + 1}`}
              style={{ width: "100%", flexShrink: 0, scrollSnapAlign: "start",
                display: "block", objectFit: "cover" }} />
          ))}
        </div>
        {semuaFoto.length > 1 && (
          <div style={{ position: "absolute", bottom: "10px", left: 0, right: 0,
            display: "flex", justifyContent: "center", gap: "5px" }}>
            {semuaFoto.map((_, i) => (
              <div key={i} style={{ width: i === active ? "16px" : "5px", height: "5px",
                borderRadius: "3px", transition: "all 0.2s",
                background: i === active ? "#FFFFFF" : "rgba(255,255,255,0.5)" }} />
            ))}
          </div>
        )}
      </div>
      {semuaFoto.length > 1 && (
        <div style={{ textAlign: "center", fontSize: "10px", color: "#9CA3AF", marginTop: "6px" }}>
          👆 Geser untuk lihat detail ({active + 1}/{semuaFoto.length})
        </div>
      )}
    </div>
  );
}

// ── KARYA MODAL ──────────────────────────────────────────────
function KaryaModal({ item, onClose, onBuatSepertiIni, akun, pesananList = [] }) {
  const [tab,         setTab]         = useState("info");
  const [ulasanList,  setUlasanList]  = useState([]);
  const [rataRating,  setRataRating]  = useState({ rata: 0, total: 0 });
  const [sudahUlasan, setSudahUlasan] = useState(false);
  const [rating,      setRating]      = useState(0);
  const [komentar,    setKomentar]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [loadUlasan,  setLoadUlasan]  = useState(false);
  const [isAnonim,    setIsAnonim]    = useState(false);

  // Cek apakah user pernah pesan (status selesai)
  const [isMember, setIsMember] = useState(false);

  const muatUlasan = async () => {
    if (!item) return;
    setLoadUlasan(true);
    try {
      const { data } = await supabase
        .from("karya_ulasan")
        .select("*")
        .eq("karya_id", item.id)
        .order("created_at", { ascending: false });
      const list = data || [];
      setUlasanList(list);
      if (list.length > 0) {
        const rata = list.reduce((a, b) => a + b.rating, 0) / list.length;
        setRataRating({ rata: Math.round(rata * 10) / 10, total: list.length });
      } else {
        setRataRating({ rata: 0, total: 0 });
      }
      if (akun) {
        const member = await isMemberKarya(item.id, akun.id);
        console.log("isMember result:", member, "karya:", item.id, "user:", akun.id);
        setIsMember(member);
        const sudah = list.some(u => u.user_id === akun.id);
        setSudahUlasan(sudah);
      }
    } catch (e) {
      console.error("Gagal muat ulasan:", e);
    }
    setLoadUlasan(false);
  };

  useEffect(() => {
    if (item) {
      setTab("info");
      setRating(0);
      setKomentar("");
      muatUlasan();
    }
  }, [item]);

  if (!item) return null;
  const produkDasar = products.find(p => p.id === item.produkId) || products[0];

  const handleKirimUlasan = async () => {
    if (!rating || !akun) return;
    setLoading(true);
    try {
      await supabase.from("karya_ulasan").insert({
        karya_id:  item.id,
        user_id:   akun.id,
        
        rating,
        teks: komentar.trim(),
        nama_user: isAnonim ? "Anonim" : (akun.user_metadata?.nama || akun.email?.split("@")[0] || "Pengguna"),
        is_anonim: isAnonim,
      });
      setSudahUlasan(true);
      setRating(0);
      setKomentar("");
      await muatUlasan();
    } catch (e) {
      console.error("Gagal kirim ulasan:", e);
    }
    setLoading(false);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0,
      background: "rgba(10,10,10,0.6)", display: "flex",
      alignItems: "flex-end", justifyContent: "center", zIndex: 200 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#FFFFFF",
        borderRadius: "24px 24px 0 0", width: "100%", maxWidth: "480px",
        maxHeight: "88vh", overflowY: "auto", padding: "20px 20px 32px",
        boxSizing: "border-box" }}>

        {/* Handle bar */}
        <div style={{ width: "36px", height: "4px", borderRadius: "2px",
          background: "#E5E7EB", margin: "0 auto 16px" }} />

        <KaryaCarousel item={item} />

        {/* Kategori & tahun */}
        <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#9CA3AF",
          textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>
          {kategoriKarya.find(k => k.id === item.kategori)?.label}
          {item.tahun ? ` · ${item.tahun}` : ""}
        </div>

        {/* Judul */}
        <div style={{ fontWeight: "900", fontSize: "20px", color: "#0A0A0A", marginBottom: "4px" }}>
          {item.label}
        </div>

        {/* Rating ringkasan */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
          <span style={{ color: "#F59E0B", fontSize: "13px" }}>
            {"★".repeat(Math.round(rataRating.rata))}{"☆".repeat(5 - Math.round(rataRating.rata))}
          </span>
          <span style={{ fontWeight: "800", fontSize: "13px", color: "#374151" }}>
            {rataRating.rata > 0 ? rataRating.rata : "-"}
          </span>
          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
            ({rataRating.total} ulasan)
          </span>
        </div>

        {item.subjudul && (
          <div style={{ fontSize: "13px", color: "#C8392B", fontWeight: "700", marginBottom: "10px" }}>
            {item.subjudul}
          </div>
        )}

        {/* Tab bar */}
        <div style={{ display: "flex", background: "#F2F2F0", borderRadius: "10px",
          padding: "3px", marginBottom: "16px", gap: "2px" }}>
          {[["info", "Info"], ["ulasan", `Ulasan (${rataRating.total})`]].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "9px", borderRadius: "8px", border: "none",
              background: tab === t ? "white" : "transparent",
              fontWeight: tab === t ? "800" : "500",
              fontSize: "12px", cursor: "pointer",
              color: tab === t ? "#0A0A0A" : "#9CA3AF",
              boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.15s",
            }}>{l}</button>
          ))}
        </div>

        {/* ── TAB INFO ── */}
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
                    border: "2px solid " + (w.hex === "#FFFFFF" ? "#E5E7EB" : "transparent") }} />
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

        {/* ── TAB ULASAN ── */}
        {tab === "ulasan" && (
          <div>
            {/* Form tulis ulasan */}
            {!akun && (
              <div style={{ background: "#FEF9C3", borderRadius: "12px", padding: "14px",
                fontSize: "13px", color: "#854D0E", marginBottom: "14px", textAlign: "center" }}>
                🔐 Login dulu untuk memberikan ulasan
              </div>
            )}

            {akun && !isMember && (
              <div style={{ background: "#F2F2F0", borderRadius: "12px", padding: "14px",
                fontSize: "13px", color: "#6B7280", marginBottom: "14px", textAlign: "center",
                lineHeight: 1.5 }}>
                📦 Hanya pelanggan yang sudah pernah memesan yang bisa memberikan ulasan
              </div>
            )}

            {akun && isMember && !sudahUlasan && (
              <div style={{ background: "white", borderRadius: "14px", padding: "16px",
                border: "1.5px solid #E5E7EB", marginBottom: "16px" }}>
                <div style={{ fontWeight: "800", fontSize: "14px", marginBottom: "12px", color: "#0A0A0A" }}>
                  Tulis Ulasan Kamu
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "6px" }}>Rating</div>
                  <StarRating value={rating} onChange={setRating} />
                </div>
                <textarea value={komentar} onChange={e => setKomentar(e.target.value)}
                  placeholder="Bagaimana pengalamanmu dengan produk ini?"
                  style={{ width: "100%", minHeight: "80px", borderRadius: "10px",
                    border: "1.5px solid #E5E7EB", padding: "10px 12px",
                    fontSize: "13px", resize: "none", outline: "none",
                    boxSizing: "border-box", fontFamily: "inherit",
                    marginBottom: "10px", background: "#FAFAFA" }} />
                <button onClick={() => setIsAnonim(!isAnonim)}
                  style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1.5px solid #E5E7EB", background: isAnonim ? "#0A0A0A" : "white", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: isAnonim ? "white" : "#374151" }}>Kirim sebagai Anonim</span>
                  <div style={{ width: "36px", height: "20px", borderRadius: "10px", background: isAnonim ? "#C8392B" : "#E5E7EB", position: "relative", transition: "all 0.2s" }}>
                    <div style={{ position: "absolute", top: "2px", left: isAnonim ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", background: "white", transition: "all 0.2s" }} />
                  </div>
                </button>
                <button onClick={handleKirimUlasan}
                  disabled={!rating || loading}
                  style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "none",
                    background: rating ? "#C8392B" : "#E5E7EB",
                    color: rating ? "white" : "#9CA3AF",
                    fontWeight: "800", fontSize: "13px",
                    cursor: rating ? "pointer" : "not-allowed",
                    transition: "all 0.2s" }}>
                  {loading ? "Mengirim..." : "Kirim Ulasan"}
                </button>
              </div>
            )}

            {akun && sudahUlasan && (
              <div style={{ background: "#ECFDF5", borderRadius: "12px", padding: "12px",
                fontSize: "13px", color: "#065F46", fontWeight: "600",
                marginBottom: "14px", textAlign: "center" }}>
                ✅ Kamu sudah memberikan ulasan
              </div>
            )}

            {/* List ulasan */}
            {loadUlasan ? (
              <div style={{ textAlign: "center", padding: "30px", color: "#9CA3AF", fontSize: "13px" }}>
                Memuat ulasan...
              </div>
            ) : ulasanList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px" }}>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>⭐</div>
                <div style={{ fontSize: "13px", color: "#9CA3AF" }}>Belum ada ulasan</div>
                <div style={{ fontSize: "12px", color: "#D1D5DB", marginTop: "4px" }}>
                  Jadilah yang pertama memberi ulasan!
                </div>
              </div>
            ) : (
              ulasanList.map(u => (
                <div key={u.id} style={{ background: "white", borderRadius: "12px",
                  padding: "14px", marginBottom: "8px", border: "1px solid #F2F2F0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", marginBottom: "6px" }}>
                    <div>
                      <div style={{ fontWeight: "800", fontSize: "13px", color: "#0A0A0A" }}>
                        { u.is_anonim ? "Anonim" : (u.nama_user || "Pengguna") }
                      </div>
                      <div style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "2px" }}>
                        {new Date(u.created_at).toLocaleDateString("id-ID", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </div>
                    </div>
                    <StarRating value={u.rating} readonly />
                  </div>
                  {u.teks && (
                    <div style={{ fontSize: "13px", color: "#374151", lineHeight: 1.5 }}>
                      {u.teks}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────
export default function KaryaInstar({ preview = false, onLihatSemua, onBuatSepertiIni, akun, pesananList = [] }) {
  const [filterAktif,  setFilterAktif]  = useState("semua");
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
              flexShrink: 0, padding: "8px 16px", borderRadius: "50px", border: "none",
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
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF", fontSize: "13px" }}>
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
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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

      <KaryaModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onBuatSepertiIni={(item, produkDasar) => {
          setSelectedItem(null);
          onBuatSepertiIni?.(item, produkDasar);
        }}
        akun={akun}
        pesananList={pesananList}
      />
    </div>
  );
}
