export default function HalamanSukses({ pesananList, setHalaman, navigateTab }) {
  const pesananTerbaru = pesananList[0];
  const isBrief = pesananTerbaru?.items?.some(i => i.opsiDesain === "brief");
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#F2F2F0", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px", textAlign: "center" }}>
      <div style={{ fontSize: "72px", marginBottom: "16px" }}>{isBrief ? "🎨" : "🎉"}</div>
      <div style={{ fontWeight: "900", fontSize: "24px", color: "#0A0A0A", marginBottom: "8px" }}>{isBrief ? "Pesanan Diterima" : "Pesanan Terkirim"}</div>
      <div style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6, marginBottom: "24px" }}>
        {isBrief ? <>Pesananmu sudah masuk.<br/>Lanjutkan konsultasi desain di aplikasi.</> : <>Pesananmu berhasil dibuat.<br/>Pantau status di halaman Pesanan.</>}
      </div>
      {pesananTerbaru?.orderId && (
        <div style={{ background: "white", borderRadius: "14px", padding: "14px 20px", marginBottom: "24px", width: "100%", border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "4px" }}>ID Pesanan</div>
          <div style={{ fontWeight: "900", fontSize: "18px", letterSpacing: "2px", color: "#0A0A0A" }}>{pesananTerbaru.orderId}</div>
        </div>
      )}
      {isBrief ? (
        <button onClick={() => setHalaman("chat")} style={{ background: "#0A0A0A", color: "white", border: "none", borderRadius: "14px", padding: "14px 36px", fontSize: "14px", fontWeight: "900", cursor: "pointer", marginBottom: "12px", width: "100%" }}>
          💬 Chat Desainer Sekarang
        </button>
      ) : (
        <button onClick={() => setHalaman("pesanan")} style={{ background: "#0A0A0A", color: "white", border: "none", borderRadius: "14px", padding: "13px 36px", fontSize: "13px", fontWeight: "900", cursor: "pointer", marginBottom: "12px", width: "100%" }}>
          Lihat Pesanan Saya
        </button>
      )}
      <button onClick={() => { setHalaman(null); navigateTab("beranda"); }} style={{ background: "none", border: "none", fontSize: "13px", fontWeight: "600", cursor: "pointer", width: "100%", color: "#9CA3AF" }}>
        Kembali ke Beranda
      </button>
    </div>
  );
}
