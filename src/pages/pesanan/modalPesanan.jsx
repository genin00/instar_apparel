import { useState, useRef } from "react";
import supabase from "../../lib/supabase.js";
import config from "../../config.js";

const rp = (n) => "Rp " + (n || 0).toLocaleString("id-ID");


function KonfirmasiTerimaModal({ pesanan, onClose, onSelesai }) {
  const [loading, setLoading] = useState(false);

  const handleKonfirmasi = async () => {
    console.log("DEBUG pesanan diterima:", pesanan);
    console.log("DEBUG orderId:", pesanan.orderId, "order_id:", pesanan.order_id);

    setLoading(true);
    try {
      const { error } = await supabase
        .from("pesanan")
        .update({ status: "selesai" })
        .eq("order_id", pesanan.orderId);
      if (error) throw error;
      onSelesai();
    } catch(e) {
      alert("Gagal: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "20px 20px 0 0", padding: "24px", width: "100%", maxWidth: "480px" }}>
        <div style={{ fontSize: "32px", textAlign: "center", marginBottom: "12px" }}>📦</div>
        <div style={{ fontWeight: "900", fontSize: "16px", color: "#0A0A0A", textAlign: "center", marginBottom: "6px" }}>Konfirmasi Pesanan Diterima</div>
        <div style={{ fontSize: "13px", color: "#6B7280", textAlign: "center", marginBottom: "24px", lineHeight: 1.6 }}>
          Pastikan pesanan sudah kamu terima dengan kondisi baik sebelum konfirmasi.
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "13px", border: "1.5px solid #E5E7EB", borderRadius: "12px", background: "none", fontSize: "13px", fontWeight: "700", color: "#374151", cursor: "pointer" }}>
            Batal
          </button>
          <button onClick={handleKonfirmasi} disabled={loading} style={{ flex: 2, padding: "13px", border: "none", borderRadius: "12px", background: loading ? "#E5E7EB" : "#10B981", fontSize: "13px", fontWeight: "800", color: "white", cursor: "pointer" }}>
            {loading ? "Menyimpan..." : "✓ Pesanan Diterima"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PengembalianModal({ pesanan, onClose, onSelesai }) {
  const [alasan,  setAlasan]  = useState("");
  const [foto,    setFoto]    = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAjukan = async () => {
    if (!alasan.trim()) { alert("Isi alasan pengembalian"); return; }
    setLoading(true);
    try {
      const { error } = await supabase
        .from("pesanan")
        .update({ status: "dikembalikan", catatan_admin: "PENGEMBALIAN: " + alasan })
        .eq("order_id", pesanan.orderId);
      if (error) throw error;
      // Buka WA untuk lapor ke CS
      const msg = encodeURIComponent("Halo, saya ingin mengajukan pengembalian pesanan #" + pesanan.orderId + " - Alasan: " + alasan);
      window.open("https://wa.me/" + config.whatsapp.bisnis + "?text=" + msg, "_blank");
      onSelesai();
    } catch(e) {
      alert("Gagal: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "20px 20px 0 0", padding: "24px", width: "100%", maxWidth: "480px", maxHeight: "80vh", overflowY: "auto" }}>
        <div style={{ fontWeight: "900", fontSize: "16px", color: "#0A0A0A", marginBottom: "4px" }}>Ajukan Pengembalian</div>
        <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "20px" }}>Pesanan #{pesanan.orderId}</div>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>Alasan Pengembalian *</div>
          <textarea
            value={alasan}
            onChange={e => setAlasan(e.target.value)}
            placeholder="Contoh: Warna tidak sesuai, ada cacat produksi, ukuran salah..."
            rows={4}
            style={{ width: "100%", border: "1.5px solid #E5E7EB", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "none" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>Foto Kerusakan (Opsional)</div>
          {preview ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img src={preview} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "10px", border: "1px solid #E5E7EB" }} />
              <button onClick={() => { setFoto(null); setPreview(null); }} style={{ position: "absolute", top: "-6px", right: "-6px", background: "#0A0A0A", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", fontSize: "10px", cursor: "pointer" }}>✕</button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()} style={{ width: "100px", height: "100px", border: "2px dashed #E5E7EB", borderRadius: "10px", background: "#F9FAFB", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px" }}>
              <span style={{ fontSize: "24px" }}>📷</span>
              <span style={{ fontSize: "10px", color: "#9CA3AF" }}>Upload Foto</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFoto} />
        </div>

        <div style={{ background: "#FEF3C7", borderRadius: "10px", padding: "12px", marginBottom: "20px", fontSize: "12px", color: "#92400E" }}>
          Setelah mengajukan, tim CS kami akan menghubungi kamu via WhatsApp untuk proses selanjutnya.
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "13px", border: "1.5px solid #E5E7EB", borderRadius: "12px", background: "none", fontSize: "13px", fontWeight: "700", color: "#374151", cursor: "pointer" }}>
            Batal
          </button>
          <button onClick={handleAjukan} disabled={loading} style={{ flex: 2, padding: "13px", border: "none", borderRadius: "12px", background: loading ? "#E5E7EB" : "#C8392B", fontSize: "13px", fontWeight: "800", color: "white", cursor: "pointer" }}>
            {loading ? "Mengajukan..." : "Ajukan Pengembalian"}
          </button>
        </div>
      </div>
    </div>
  );
}

export { KonfirmasiTerimaModal, PengembalianModal };
