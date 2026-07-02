import config from "../../config.js";
import { STATUS_COLOR, STATUS_LABEL, getShirtFilter } from "./pesananUtils.js";

const rp = (n) => "Rp " + (n || 0).toLocaleString("id-ID");

function PesananCard({ pesanan, onLihatRincian, onKonfirmasiTerima, onAjukanPengembalian, onBeriUlasan }) {
  const sc = STATUS_COLOR[pesanan.status] || STATUS_COLOR.diterima;
  const firstItem = pesanan.items?.[0];
  return (
    <div style={{ background: "white", borderRadius: "16px", marginBottom: "10px", overflow: "hidden" }}>
      <div style={{
        padding: "10px 14px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #F2F2F0",
      }}>
        <div style={{ fontWeight: "800", fontSize: "12px", color: "#0A0A0A" }}>Instar Apparel</div>
        <div style={{ background: sc.bg, color: sc.text, fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px" }}>
          {STATUS_LABEL[pesanan.status] || pesanan.status}
        </div>
      </div>

      <div style={{ padding: "12px 14px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div style={{ width: "64px", height: "64px", flexShrink: 0, background: "#F8FAFC", borderRadius: "10px", padding: "4px", border: "1px solid #E5E7EB" }}>
          <img
            src={firstItem?.produk?.id === "lengan-panjang" ? "/mockup-panjang.png" : firstItem?.produk?.id === "rib" ? "/mockup-rib.png" : "/mockup-pendek.png"}
            alt="kaos"
            style={{ width: "100%", display: "block", filter: getShirtFilter(firstItem?.warna) }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "700", fontSize: "13px", color: "#0A0A0A", marginBottom: "2px" }}>
            {firstItem?.produk?.nama || firstItem?.nama || "Kaos Custom"}
          </div>
          <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "4px" }}>
            {firstItem?.warnaLabel || "-"} · x{pesanan.totalQty}
          </div>
          {pesanan.items?.length > 1 && (
            <div style={{ fontSize: "11px", color: "#9CA3AF" }}>+{pesanan.items.length - 1} produk lainnya</div>
          )}
          <div style={{ fontWeight: "800", fontSize: "13px", color: "#0A0A0A", marginTop: "4px" }}>
            {rp(pesanan.totalHarga)}
          </div>
        </div>
      </div>

      <div style={{ padding: "8px 14px", borderTop: "1px solid #F2F2F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "12px", color: "#6B7280" }}>Total Pesanan</div>
        <div style={{ fontWeight: "900", fontSize: "14px", color: "#0A0A0A" }}>{rp(pesanan.totalHarga)}</div>
      </div>

      <div style={{ padding: "10px 14px", borderTop: "1px solid #F2F2F0", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <button
          onClick={() => onLihatRincian(pesanan)}
          style={{ background: "none", border: "1.5px solid #E5E7EB", borderRadius: "10px", padding: "8px 16px", fontSize: "12px", fontWeight: "700", color: "#374151", cursor: "pointer" }}
        >
          Lihat Detail
        </button>
        {pesanan.status === "dikirim" && (
          <>
            <button
              onClick={() => window.open("https://wa.me/" + config.whatsapp.bisnis + "?text=" + encodeURIComponent("Halo, saya ingin lacak pesanan #" + pesanan.orderId), "_blank")}
              style={{ background: "none", border: "1.5px solid #E5E7EB", borderRadius: "10px", padding: "8px 14px", fontSize: "12px", fontWeight: "700", color: "#374151", cursor: "pointer" }}
            >
              Lacak
            </button>
            <button
              onClick={() => onKonfirmasiTerima(pesanan)}
              style={{ background: "#10B981", border: "none", borderRadius: "10px", padding: "8px 14px", fontSize: "12px", fontWeight: "700", color: "white", cursor: "pointer" }}
            >
              ✓ Diterima
            </button>
          </>
        )}
        {pesanan.status === "selesai" && (
          <>
            <button
              onClick={() => onAjukanPengembalian(pesanan)}
              style={{ background: "none", border: "1.5px solid #E5E7EB", borderRadius: "10px", padding: "8px 14px", fontSize: "12px", fontWeight: "700", color: "#C8392B", cursor: "pointer" }}
            >
              Kembalikan
            </button>
            <button
              onClick={() => onBeriUlasan(pesanan)}
              style={{ background: "#C8392B", border: "none", borderRadius: "10px", padding: "8px 14px", fontSize: "12px", fontWeight: "700", color: "white", cursor: "pointer" }}
            >
              Beri Ulasan
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PesananCard;
