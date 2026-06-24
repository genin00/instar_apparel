import { useState, useEffect, useRef } from "react";
import { updateOrderStatus } from "../services/orderService.js";
import { getPesan, kirimPesan, kirimGambar, subscribeChat } from "../services/chatService.js";

const STATUS_COLOR = {
  diterima:  { bg: "#FEF3C7", color: "#92400E" },
  desain:    { bg: "#DBEAFE", color: "#1E40AF" },
  produksi:  { bg: "#EDE9FE", color: "#5B21B6" },
  selesai:   { bg: "#D1FAE5", color: "#065F46" },
};

const STATUS_URUTAN = ["diterima", "desain", "produksi", "selesai"];

const rp = (n) => "Rp " + Number(n).toLocaleString("id-ID");

export default function DetailPesanan({ pesanan, user, onBack }) {
  const [pesanList, setPesanList]   = useState([]);
  const [teks, setTeks]             = useState("");
  const [loading, setLoading]       = useState(true);
  const [kirim, setKirim]           = useState(false);
  const [status, setStatus]         = useState(pesanan.status);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [tab, setTab]               = useState("chat"); // "chat" | "detail"
  const bottomRef                   = useRef(null);
  const fileRef                     = useRef(null);

  const scrollBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  useEffect(() => {
    getPesan(pesanan.orderId).then(data => {
      setPesanList(data);
      setLoading(false);
      scrollBottom();
    });
    const unsub = subscribeChat(pesanan.orderId, (pesan) => {
      setPesanList(prev => [...prev, pesan]);
      scrollBottom();
    });
    return unsub;
  }, [pesanan.orderId]);

  const handleKirimTeks = async () => {
    if (!teks.trim()) return;
    setKirim(true);
    await kirimPesan({
      orderId:    pesanan.orderId,
      senderId:   user.id,
      senderRole: "desainer",
      isi:        teks.trim(),
    });
    setTeks("");
    setKirim(false);
    scrollBottom();
  };

  const handleKirimGambar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setKirim(true);
    await kirimGambar({
      orderId:    pesanan.orderId,
      senderId:   user.id,
      senderRole: "desainer",
      file,
    });
    setKirim(false);
    scrollBottom();
  };

  const handleUpdateStatus = async (s) => {
    setUpdatingStatus(true);
    await updateOrderStatus(pesanan.orderId, s);
    setStatus(s);
    setUpdatingStatus(false);
  };

  const sc = STATUS_COLOR[status] || { bg: "#F3F4F6", color: "#374151" };

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "#0A0A0A", padding: "12px 16px", position: "sticky", top: 0, zIndex: 99 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={onBack}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "white", fontSize: "20px" }}
          >
            ←
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "900", fontSize: "15px", color: "white", letterSpacing: "1px" }}>
              #{pesanan.orderId}
            </div>
            <div style={{ fontSize: "11px", color: "#6B7280" }}>
              {pesanan.nama || "—"} · {pesanan.tanggal}
            </div>
          </div>
          <div style={{ background: sc.bg, color: sc.color, fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "20px", textTransform: "capitalize" }}>
            {status}
          </div>
        </div>

        {/* ── TAB ── */}
        <div style={{ display: "flex", gap: "4px", marginTop: "12px" }}>
          {["chat", "detail"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: "8px", borderRadius: "8px", border: "none",
                background: tab === t ? "white" : "transparent",
                color: tab === t ? "#0A0A0A" : "#6B7280",
                fontWeight: "700", fontSize: "13px", cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {t === "chat" ? "💬 Chat" : "📋 Detail"}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB DETAIL ── */}
      {tab === "detail" && (
        <div style={{ padding: "16px", overflowY: "auto" }}>

          {/* Info customer */}
          <div style={{ background: "white", borderRadius: "14px", padding: "16px", marginBottom: "12px" }}>
            <div style={{ fontWeight: "800", fontSize: "13px", color: "#0A0A0A", marginBottom: "12px" }}>Info Customer</div>
            {[
              { label: "Nama",    value: pesanan.nama    || "—" },
              { label: "Telepon", value: pesanan.telepon || "—" },
              { label: "Alamat",  value: pesanan.alamat  || "—" },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                <div style={{ fontSize: "12px", color: "#9CA3AF", width: "60px", flexShrink: 0 }}>{r.label}</div>
                <div style={{ fontSize: "13px", color: "#0A0A0A", fontWeight: "600", flex: 1 }}>{r.value}</div>
              </div>
            ))}
            {pesanan.telepon && (
              <a
                href={`https://wa.me/62${pesanan.telepon.replace(/^0/, "")}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: "inline-block", marginTop: "8px", background: "#25D366", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "800", textDecoration: "none" }}
              >
                💬 WhatsApp Customer
              </a>
            )}
          </div>

          {/* Item pesanan */}
          <div style={{ background: "white", borderRadius: "14px", padding: "16px", marginBottom: "12px" }}>
            <div style={{ fontWeight: "800", fontSize: "13px", color: "#0A0A0A", marginBottom: "12px" }}>Item Pesanan</div>
            {(pesanan.items || []).map((item, i) => (
              <div key={i} style={{ borderBottom: i < pesanan.items.length - 1 ? "1px solid #F3F4F6" : "none", paddingBottom: "16px", marginBottom: "16px" }}>
                
                {/* Nama produk */}
                <div style={{ fontWeight: "800", fontSize: "14px", color: "#0A0A0A", marginBottom: "8px" }}>
                  {item.produk?.nama || item.namaProduk || item.nama || "—"}
                </div>

                {/* Warna & ukuran */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                  {item.warnaLabel && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#F2F2F0", padding: "4px 10px", borderRadius: "20px" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: item.warna, border: "1px solid rgba(0,0,0,0.1)" }} />
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#374151" }}>{item.warnaLabel}</span>
                    </div>
                  )}
                  {item.satuanSize && (
                    <div style={{ background: "#F2F2F0", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", color: "#374151" }}>
                      Size: {item.satuanSize}
                    </div>
                  )}
                  <div style={{ background: "#F2F2F0", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", color: "#374151" }}>
                    {item.totalQty} pcs
                  </div>
                  <div style={{ background: "#0A0A0A", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", color: "white" }}>
                    {rp(item.totalHarga)}
                  </div>
                </div>

                {/* Opsi desain */}
                {item.opsiDesain === "brief" ? (
                  <div style={{ background: "#DBEAFE", borderRadius: "10px", padding: "10px 12px", marginBottom: "8px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "800", color: "#1E40AF", marginBottom: "6px" }}>📝 BRIEF DESAIN</div>
                    {item.briefKat && <div style={{ fontSize: "12px", color: "#374151", marginBottom: "4px" }}>Kategori: <b>{item.briefKat}</b></div>}
                    {item.briefTeks?.depan && <div style={{ fontSize: "12px", color: "#374151", marginBottom: "2px" }}>Depan: {item.briefTeks.depan}</div>}
                    {item.briefTeks?.belakang && <div style={{ fontSize: "12px", color: "#374151" }}>Belakang: {item.briefTeks.belakang}</div>}
                  </div>
                ) : item.opsiDesain === "upload" ? (
                  <div style={{ background: "#D1FAE5", borderRadius: "10px", padding: "10px 12px", marginBottom: "8px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "800", color: "#065F46", marginBottom: "6px" }}>🎨 UPLOAD DESAIN</div>
                    {item.uploads?.depan && (
                      <div style={{ marginBottom: "6px" }}>
                        <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "4px" }}>Depan:</div>
                        <img src={item.uploads.depan} style={{ maxWidth: "120px", borderRadius: "8px" }} />
                      </div>
                    )}
                    {item.uploads?.belakang && (
                      <div>
                        <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "4px" }}>Belakang:</div>
                        <img src={item.uploads.belakang} style={{ maxWidth: "120px", borderRadius: "8px" }} />
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Catatan */}
                {item.catatan && Object.values(item.catatan).some(v => v) && (
                  <div style={{ background: "#FEF3C7", borderRadius: "10px", padding: "10px 12px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "800", color: "#92400E", marginBottom: "4px" }}>📌 CATATAN</div>
                    {Object.entries(item.catatan).map(([k, v]) => v ? (
                      <div key={k} style={{ fontSize: "12px", color: "#374151" }}>{k}: {v}</div>
                    ) : null)}
                  </div>
                )}
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <div style={{ fontWeight: "700", fontSize: "13px", color: "#0A0A0A" }}>Total</div>
              <div style={{ fontWeight: "900", fontSize: "15px", color: "#0A0A0A" }}>{rp(pesanan.totalHarga)}</div>
            </div>
          </div>

          {/* Update status */}
          <div style={{ background: "white", borderRadius: "14px", padding: "16px" }}>
            <div style={{ fontWeight: "800", fontSize: "13px", color: "#0A0A0A", marginBottom: "12px" }}>Update Status</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {STATUS_URUTAN.map(s => (
                <button
                  key={s}
                  onClick={() => handleUpdateStatus(s)}
                  disabled={updatingStatus || status === s}
                  style={{
                    padding: "8px 16px", borderRadius: "20px", border: "2px solid",
                    borderColor: status === s ? "#0A0A0A" : "#E5E7EB",
                    background: status === s ? "#0A0A0A" : "white",
                    color: status === s ? "white" : "#6B7280",
                    fontSize: "12px", fontWeight: "700", cursor: status === s ? "default" : "pointer",
                    textTransform: "capitalize", opacity: updatingStatus ? 0.6 : 1,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB CHAT ── */}
      {tab === "chat" && (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>⏳ Memuat chat...</div>
            ) : pesanList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>💬</div>
                <div>Belum ada pesan. Mulai chat dengan customer.</div>
              </div>
            ) : (
              pesanList.map((p, i) => {
                const dariDesainer = p.sender_role === "desainer";
                const sistem = p.sender_role === "sistem" || p.tipe === "sistem";
                if (sistem) return (
                  <div key={i} style={{ textAlign: "center", margin: "12px 0" }}>
                    <span style={{ background: "#F3F4F6", color: "#9CA3AF", fontSize: "11px", padding: "4px 12px", borderRadius: "20px" }}>{p.isi}</span>
                  </div>
                );
                return (
                  <div key={i} style={{ display: "flex", justifyContent: dariDesainer ? "flex-end" : "flex-start", marginBottom: "10px" }}>
                    <div style={{
                      maxWidth: "75%", background: dariDesainer ? "#0A0A0A" : "white",
                      color: dariDesainer ? "white" : "#0A0A0A",
                      borderRadius: dariDesainer ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      padding: "10px 14px", fontSize: "13px", lineHeight: 1.5,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    }}>
                      {p.tipe === "gambar" ? (
                        <img src={p.gambar_url} alt="gambar" style={{ maxWidth: "200px", borderRadius: "8px", display: "block" }} />
                      ) : p.isi}
                      <div style={{ fontSize: "10px", opacity: 0.5, marginTop: "4px", textAlign: "right" }}>
                        {new Date(p.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* ── INPUT CHAT ── */}
          <div style={{ background: "white", borderTop: "1px solid #E5E7EB", padding: "12px 16px", display: "flex", gap: "8px", alignItems: "flex-end" }}>
            <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={handleKirimGambar} />
            <button
              onClick={() => fileRef.current?.click()}
              style={{ background: "#F2F2F0", border: "none", borderRadius: "10px", width: "40px", height: "40px", cursor: "pointer", fontSize: "18px", flexShrink: 0 }}
            >
              🖼
            </button>
            <input
              value={teks}
              onChange={e => setTeks(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleKirimTeks()}
              placeholder="Ketik pesan..."
              style={{ flex: 1, border: "2px solid #E5E7EB", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", fontFamily: "inherit", outline: "none", resize: "none" }}
            />
            <button
              onClick={handleKirimTeks}
              disabled={kirim || !teks.trim()}
              style={{ background: "#0A0A0A", border: "none", borderRadius: "10px", width: "40px", height: "40px", cursor: "pointer", fontSize: "18px", flexShrink: 0, opacity: kirim || !teks.trim() ? 0.4 : 1 }}
            >
              ➤
            </button>
          </div>
        </>
      )}
    </div>
  );
}
