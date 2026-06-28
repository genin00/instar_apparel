import { useState, useEffect, useRef } from "react";
import supabase from "../lib/supabase.js";

const SUPABASE_URL = "https://wfgjvpbehhbuysdklimg.supabase.co";
const SUPABASE_KEY = "sb_publishable_savuuXHTZZp_FZuTNfKqjQ_2iKIx6ZA";
const headers = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
};

const rp = (n) => "Rp " + (n || 0).toLocaleString("id-ID");

const STATUS_LABEL = {
  desain:   "Proses Desain",
  produksi: "Produksi",
  qc:       "Quality Check",
  dikirim:  "Dikirim",
  selesai:  "Selesai",
};

const STATUS_COLOR = {
  desain:   { bg: "#EFF6FF", text: "#1D4ED8" },
  produksi: { bg: "#FEF3C7", text: "#92400E" },
  qc:       { bg: "#F5F3FF", text: "#6D28D9" },
  dikirim:  { bg: "#E0F2FE", text: "#0369A1" },
  selesai:  { bg: "#ECFDF5", text: "#065F46" },
};

function KonfirmasiModal({ pesanan, onClose, onSelesai }) {
  const [foto,    setFoto]    = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [catatan, setCatatan] = useState("");
  const fileRef = useRef(null);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleKonfirmasi = async () => {
    setLoading(true);
    try {
      let fotoUrl = null;

      // Upload foto jika ada
      if (foto) {
        const ext  = foto.name.split(".").pop();
        const path = `produksi/${pesanan.order_id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("chat-images")
          .upload(path, foto, { upsert: false });
        if (!upErr) {
          const { data: urlData } = supabase.storage
            .from("chat-images")
            .getPublicUrl(path);
          fotoUrl = urlData.publicUrl;
        }
      }

      // Update status ke QC
      await fetch(`${SUPABASE_URL}/rest/v1/pesanan?order_id=eq.${pesanan.order_id}`, {
        method: "PATCH",
        headers: { ...headers, "Prefer": "return=minimal" },
        body: JSON.stringify({
          status: "qc",
          foto_produksi: fotoUrl,
          catatan_produksi: catatan || null,
        }),
      });

      onSelesai();
    } catch(e) {
      alert("Gagal: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      <div style={{
        background: "white", borderRadius: "20px 20px 0 0",
        padding: "24px", width: "100%", maxWidth: "480px",
      }}>
        <div style={{ fontWeight: "900", fontSize: "16px", color: "#0A0A0A", marginBottom: "4px" }}>
          Konfirmasi Selesai Produksi
        </div>
        <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "20px" }}>
          Pesanan #{pesanan.order_id} · {pesanan.total_qty} pcs
        </div>

        {/* Upload foto */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>
            Foto Hasil Produksi (Opsional)
          </div>
          {preview ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img src={preview} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "10px", border: "1px solid #E5E7EB" }} />
              <button onClick={() => { setFoto(null); setPreview(null); }} style={{
                position: "absolute", top: "-6px", right: "-6px",
                background: "#0A0A0A", color: "white", border: "none",
                borderRadius: "50%", width: "20px", height: "20px",
                fontSize: "10px", cursor: "pointer",
              }}>✕</button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()} style={{
              width: "100px", height: "100px", border: "2px dashed #E5E7EB",
              borderRadius: "10px", background: "#F9FAFB", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: "4px",
            }}>
              <span style={{ fontSize: "24px" }}>📷</span>
              <span style={{ fontSize: "10px", color: "#9CA3AF" }}>Upload Foto</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFoto} />
        </div>

        {/* Catatan */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>
            Catatan (Opsional)
          </div>
          <textarea
            value={catatan}
            onChange={e => setCatatan(e.target.value)}
            placeholder="Catatan untuk QC..."
            rows={3}
            style={{ width: "100%", border: "1.5px solid #E5E7EB", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "none" }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "13px", border: "1.5px solid #E5E7EB",
            borderRadius: "12px", background: "none",
            fontSize: "13px", fontWeight: "700", color: "#374151", cursor: "pointer",
          }}>
            Batal
          </button>
          <button onClick={handleKonfirmasi} disabled={loading} style={{
            flex: 2, padding: "13px", border: "none",
            borderRadius: "12px", background: loading ? "#E5E7EB" : "#F59E0B",
            fontSize: "13px", fontWeight: "800", color: "white", cursor: "pointer",
          }}>
            {loading ? "Menyimpan..." : "✓ Konfirmasi Selesai"}
          </button>
        </div>
      </div>
    </div>
  );
}

function QCModal({ pesanan, onClose, onSelesai }) {
  const [loading, setLoading] = useState(false);
  const [catatan, setCatatan] = useState("");

  const handleQC = async () => {
    setLoading(true);
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/pesanan?order_id=eq.${pesanan.order_id}`, {
        method: "PATCH",
        headers: { ...headers, "Prefer": "return=minimal" },
        body: JSON.stringify({
          status: "dikirim",
          catatan_qc: catatan || null,
        }),
      });
      onSelesai();
    } catch(e) {
      alert("Gagal: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      <div style={{
        background: "white", borderRadius: "20px 20px 0 0",
        padding: "24px", width: "100%", maxWidth: "480px",
      }}>
        <div style={{ fontWeight: "900", fontSize: "16px", color: "#0A0A0A", marginBottom: "4px" }}>
          Konfirmasi Quality Check
        </div>
        <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "16px" }}>
          Pesanan #{pesanan.order_id} · {pesanan.total_qty} pcs
        </div>

        {pesanan.foto_produksi && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>Foto Produksi</div>
            <img src={pesanan.foto_produksi} style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "10px", border: "1px solid #E5E7EB" }} />
          </div>
        )}

        <div style={{ background: "#F9FAFB", borderRadius: "12px", padding: "14px", marginBottom: "16px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#9CA3AF", marginBottom: "8px" }}>CHECKLIST QC</div>
          {["Warna sesuai", "Ukuran sesuai", "Sablon/bordir rapi", "Tidak ada cacat", "Jumlah sesuai"].map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "white", fontSize: "10px" }}>✓</span>
              </div>
              <span style={{ fontSize: "13px", color: "#374151" }}>{item}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>Catatan QC (Opsional)</div>
          <textarea
            value={catatan}
            onChange={e => setCatatan(e.target.value)}
            placeholder="Catatan hasil QC..."
            rows={2}
            style={{ width: "100%", border: "1.5px solid #E5E7EB", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "none" }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "13px", border: "1.5px solid #E5E7EB",
            borderRadius: "12px", background: "none",
            fontSize: "13px", fontWeight: "700", color: "#374151", cursor: "pointer",
          }}>
            Batal
          </button>
          <button onClick={handleQC} disabled={loading} style={{
            flex: 2, padding: "13px", border: "none",
            borderRadius: "12px", background: loading ? "#E5E7EB" : "#10B981",
            fontSize: "13px", fontWeight: "800", color: "white", cursor: "pointer",
          }}>
            {loading ? "Menyimpan..." : "✓ Lolos QC → Dikirim"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ user, onLogout }) {
  const [pesanan,  setPesanan]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("produksi");
  const [modal,    setModal]    = useState(null); // { type: 'produksi'|'qc', pesanan }

  const loadPesanan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/pesanan?status=in.(produksi,qc,dikirim,selesai)&order=created_at.desc`, { headers });
      const data = await res.json();
      setPesanan(data || []);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPesanan();
    // Realtime
    const channel = supabase
      .channel("pesanan_percetakan")
      .on("postgres_changes", { event: "*", schema: "public", table: "pesanan" }, loadPesanan)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const TABS = [
    { id: "produksi", label: "Produksi",       count: pesanan.filter(p => p.status === "produksi").length },
    { id: "qc",       label: "Quality Check",  count: pesanan.filter(p => p.status === "qc").length },
    { id: "dikirim",  label: "Dikirim",        count: pesanan.filter(p => p.status === "dikirim").length },
    { id: "selesai",  label: "Selesai",        count: pesanan.filter(p => p.status === "selesai").length },
  ];

  const tampil = pesanan.filter(p => p.status === tab);
  const totalAktif = pesanan.filter(p => ["produksi","qc"].includes(p.status)).length;

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#0A0A0A", padding: "16px 20px", position: "sticky", top: 0, zIndex: 98 }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: "900", fontSize: "16px", letterSpacing: "2px", color: "white" }}>INSTAR</div>
            <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#6B7280" }}>PERCETAKAN</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {totalAktif > 0 && (
              <div style={{ background: "#F59E0B", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", color: "white", fontWeight: "800" }}>
                {totalAktif} aktif
              </div>
            )}
            <button onClick={onLogout} style={{ background: "#1A1A1A", border: "none", color: "#9CA3AF", fontSize: "12px", padding: "6px 12px", borderRadius: "8px", cursor: "pointer" }}>
              Keluar
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px 16px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
          {TABS.map(t => (
            <div key={t.id} style={{ background: t.id === "produksi" ? "#FEF3C7" : t.id === "qc" ? "#F5F3FF" : "white", borderRadius: "12px", padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontWeight: "900", fontSize: "20px", color: t.id === "produksi" ? "#92400E" : t.id === "qc" ? "#6D28D9" : "#0A0A0A" }}>{t.count}</div>
              <div style={{ fontSize: "9px", color: "#9CA3AF", fontWeight: "700", marginTop: "2px" }}>{t.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", display: "flex", overflowX: "auto", padding: "0 8px", scrollbarWidth: "none" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flexShrink: 0, padding: "12px 16px",
            background: "none", border: "none",
            borderBottom: tab === t.id ? "2.5px solid #F59E0B" : "2.5px solid transparent",
            fontWeight: tab === t.id ? "800" : "500",
            fontSize: "13px",
            color: tab === t.id ? "#92400E" : "#6B7280",
            cursor: "pointer", whiteSpace: "nowrap",
          }}>
            {t.label}{t.count > 0 ? ` (${t.count})` : ""}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "14px 16px 80px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#9CA3AF" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>⏳</div>
            <div>Memuat...</div>
          </div>
        ) : tampil.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#9CA3AF" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📭</div>
            <div style={{ fontWeight: "700", color: "#374151" }}>Tidak ada pesanan {STATUS_LABEL[tab]}</div>
          </div>
        ) : (
          tampil.map(p => {
            const sc = STATUS_COLOR[p.status] || STATUS_COLOR.produksi;
            const items = p.items || [];
            const firstItem = items[0];
            return (
              <div key={p.id} style={{ background: "white", borderRadius: "16px", marginBottom: "12px", overflow: "hidden" }}>

                {/* Header */}
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #F2F2F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: "900", fontSize: "14px", color: "#0A0A0A" }}>#{p.order_id}</div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>{p.tanggal} · {p.nama}</div>
                  </div>
                  <div style={{ background: sc.bg, color: sc.text, fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "20px" }}>
                    {STATUS_LABEL[p.status]}
                  </div>
                </div>

                {/* Produk */}
                <div style={{ padding: "12px 16px" }}>
                  {items.map((item, i) => (
                    <div key={i} style={{ marginBottom: i < items.length - 1 ? "14px" : "0", paddingBottom: i < items.length - 1 ? "14px" : "0", borderBottom: i < items.length - 1 ? "1px solid #F2F2F0" : "none" }}>
                      
                      {/* Baris atas: mockup + nama + qty */}
                      <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
                        <div style={{ width: "64px", height: "64px", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E5E7EB", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img
                            src={item.produk?.id === "lengan-panjang" ? "/mockup-panjang.png" : item.produk?.id === "rib" ? "/mockup-rib.png" : "/mockup-pendek.png"}
                            alt="kaos"
                            style={{ width: "100%", filter: item.warna && item.warna !== "#FFFFFF" ? "brightness(0.5) sepia(1) saturate(3)" : "none" }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "800", fontSize: "14px", color: "#0A0A0A", marginBottom: "4px" }}>
                            {item.produk?.nama || item.nama || "Kaos Custom"}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                            {item.warna && (
                              <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: item.warna, border: "1px solid #E5E7EB", flexShrink: 0 }} />
                            )}
                            <span style={{ fontSize: "12px", color: "#6B7280" }}>{item.warnaLabel || "Warna belum ditentukan"}</span>
                          </div>
                          <div style={{ fontSize: "12px", fontWeight: "800", color: "#0A0A0A" }}>
                            Total: {item.totalQty} pcs
                          </div>
                        </div>
                      </div>

                      {/* Ukuran */}
                      <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "10px 12px", marginBottom: "8px" }}>
                        <div style={{ fontSize: "10px", fontWeight: "700", color: "#9CA3AF", letterSpacing: "1px", marginBottom: "6px" }}>UKURAN & JUMLAH</div>
                        {item.modeUkuran === "satuan" ? (
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: "13px", color: "#374151" }}>Ukuran {item.satuanSize}</span>
                            <span style={{ fontSize: "13px", fontWeight: "800", color: "#0A0A0A" }}>{item.satuanQty} pcs</span>
                          </div>
                        ) : item.massalQty ? (
                          Object.entries(item.massalQty).filter(([,qty]) => qty > 0).map(([size, qty]) => (
                            <div key={size} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                              <span style={{ fontSize: "13px", color: "#374151" }}>Ukuran {size}</span>
                              <span style={{ fontSize: "13px", fontWeight: "800", color: "#0A0A0A" }}>{qty} pcs</span>
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: "13px", color: "#9CA3AF" }}>Data ukuran tidak tersedia</div>
                        )}
                      </div>

                      {/* Brief desain */}
                      {item.opsiDesain === "brief" && (
                        <div style={{ background: "#EFF6FF", borderRadius: "10px", padding: "10px 12px" }}>
                          <div style={{ fontSize: "10px", fontWeight: "700", color: "#1D4ED8", letterSpacing: "1px", marginBottom: "6px" }}>BRIEF DESAIN</div>
                          {item.briefKat && item.briefKat !== "-" && (
                            <div style={{ fontSize: "12px", color: "#374151", marginBottom: "4px" }}>
                              <span style={{ fontWeight: "700" }}>Kategori:</span> {item.briefKat}
                            </div>
                          )}
                          {item.briefTeks?.depan && (
                            <div style={{ fontSize: "12px", color: "#374151", marginBottom: "4px" }}>
                              <span style={{ fontWeight: "700" }}>Depan:</span> {item.briefTeks.depan}
                            </div>
                          )}
                          {item.briefTeks?.belakang && (
                            <div style={{ fontSize: "12px", color: "#374151" }}>
                              <span style={{ fontWeight: "700" }}>Belakang:</span> {item.briefTeks.belakang}
                            </div>
                          )}
                          {(!item.briefTeks?.depan && !item.briefTeks?.belakang) && (
                            <div style={{ fontSize: "12px", color: "#9CA3AF" }}>Lihat detail di chat desainer</div>
                          )}
                        </div>
                      )}

                      {/* Gambar desain (jika upload) */}
                      {item.opsiDesain === "upload" && item.desainUrl && (
                        <div style={{ background: "#F0FDF4", borderRadius: "10px", padding: "10px 12px" }}>
                          <div style={{ fontSize: "10px", fontWeight: "700", color: "#166534", letterSpacing: "1px", marginBottom: "8px" }}>FILE DESAIN</div>
                          <img src={item.desainUrl} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Foto produksi (jika ada) */}
                {p.foto_produksi && (
                  <div style={{ padding: "0 16px 12px" }}>
                    <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "6px" }}>Foto Produksi:</div>
                    <img src={p.foto_produksi} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                  </div>
                )}

                {/* Total */}
                <div style={{ padding: "10px 16px", borderTop: "1px solid #F2F2F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>Total · {p.total_qty} pcs</div>
                  <div style={{ fontWeight: "900", fontSize: "14px", color: "#0A0A0A" }}>{rp(p.total_harga)}</div>
                </div>

                {/* Tombol aksi */}
                {p.status === "produksi" && (
                  <div style={{ padding: "12px 16px", borderTop: "1px solid #F2F2F0" }}>
                    <button
                      onClick={() => setModal({ type: "produksi", pesanan: p })}
                      style={{
                        width: "100%", padding: "12px", border: "none",
                        borderRadius: "12px", background: "#F59E0B",
                        fontSize: "13px", fontWeight: "800", color: "white", cursor: "pointer",
                      }}
                    >
                      ✓ Konfirmasi Selesai Produksi
                    </button>
                  </div>
                )}

                {p.status === "qc" && (
                  <div style={{ padding: "12px 16px", borderTop: "1px solid #F2F2F0" }}>
                    <button
                      onClick={() => setModal({ type: "qc", pesanan: p })}
                      style={{
                        width: "100%", padding: "12px", border: "none",
                        borderRadius: "12px", background: "#10B981",
                        fontSize: "13px", fontWeight: "800", color: "white", cursor: "pointer",
                      }}
                    >
                      ✓ Konfirmasi Quality Check
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}

        <button onClick={loadPesanan} style={{ width: "100%", padding: "12px", background: "white", border: "2px solid #E5E7EB", borderRadius: "12px", fontSize: "13px", fontWeight: "700", color: "#6B7280", cursor: "pointer" }}>
          🔄 Refresh
        </button>
      </div>

      {/* Modal */}
      {modal?.type === "produksi" && (
        <KonfirmasiModal
          pesanan={modal.pesanan}
          onClose={() => setModal(null)}
          onSelesai={() => { setModal(null); loadPesanan(); }}
        />
      )}
      {modal?.type === "qc" && (
        <QCModal
          pesanan={modal.pesanan}
          onClose={() => setModal(null)}
          onSelesai={() => { setModal(null); loadPesanan(); }}
        />
      )}
    </div>
  );
}
