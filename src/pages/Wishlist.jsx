// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — WISHLIST
// ═══════════════════════════════════════════════════════════

import Header from "../components/Header.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Wishlist({ items = [], onHapus, onCustom }) {

  if (items.length === 0) {
    return (
      <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
        <Header halaman="wishlist" judul="Wishlist" />
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "80px 32px", textAlign: "center",
        }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>❤️</div>
          <div style={{ fontWeight: "900", fontSize: "20px", marginBottom: "8px", color: "#0A0A0A" }}>
            Wishlist Kosong
          </div>
          <div style={{ fontSize: "13px", color: "#9CA3AF", lineHeight: 1.6 }}>
            Tap icon ❤️ di produk mana saja<br />untuk menyimpannya di sini.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
      <Header halaman="wishlist" judul="Wishlist" />

      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "14px" }}>
          {items.length} produk tersimpan
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {items.map((produk) => (
            <ProductCard
              key={produk.id}
              produk={produk}
              layout="grid"
              onCustom={onCustom}
              onWishlist={() => onHapus(produk.id)}
              isWishlisted={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

