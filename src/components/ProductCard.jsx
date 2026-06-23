// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — PRODUCT CARD
// ═══════════════════════════════════════════════════════════

import config from "../config.js";

const rp = (n) => "Rp " + n.toLocaleString("id-ID");

export default function ProductCard({
  produk,
  onCustom,       // tap tombol "Mulai Custom"
  onWishlist,     // tap icon wishlist
  isWishlisted = false,
  layout = "grid", // "grid" | "list"
}) {

  if (layout === "list") {
    return (
      <div style={{
        background:   "#FFFFFF",
        borderRadius: "14px",
        display:      "flex",
        gap:          "12px",
        padding:      "12px",
        marginBottom: "10px",
        boxShadow:    "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        {/* Foto produk */}
        <div style={{
          width:        "90px",
          height:       "100px",
          borderRadius: "10px",
          background:   "#F2F2F0",
          flexShrink:   0,
          overflow:     "hidden",
          display:      "flex",
          alignItems:   "center",
          justifyContent: "center",
        }}>
          {produk.mockup ? (
            <img
              src={produk.mockup}
              alt={produk.nama}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: "36px" }}>👕</span>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            {produk.badge && (
              <div style={{
                display:      "inline-block",
                background:   produk.badge === "Terlaris" ? "#0A0A0A" : "#C8392B",
                color:        "white",
                fontSize:     "9px",
                fontWeight:   "800",
                padding:      "2px 8px",
                borderRadius: "20px",
                marginBottom: "5px",
                letterSpacing: "0.5px",
              }}>
                {produk.badge}
              </div>
            )}
            <div style={{ fontWeight: "800", fontSize: "14px", color: "#0A0A0A", marginBottom: "3px" }}>
              {produk.nama}
            </div>
            <div style={{ fontSize: "12px", color: "#9CA3AF", lineHeight: 1.4 }}>
              {produk.deskripsi}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
            <div style={{ fontWeight: "900", fontSize: "15px", color: "#0A0A0A" }}>
              {rp(produk.harga)}
            </div>
            <button
              onClick={() => onCustom(produk)}
              style={{
                background:   "#0A0A0A",
                color:        "white",
                border:       "none",
                borderRadius: "8px",
                padding:      "7px 14px",
                fontSize:     "12px",
                fontWeight:   "800",
                cursor:       "pointer",
              }}
            >
              Custom →
            </button>
          </div>
        </div>

        {/* Wishlist button */}
        <button
          onClick={() => onWishlist(produk)}
          style={{
            background: "none",
            border:     "none",
            cursor:     "pointer",
            padding:    "4px",
            alignSelf:  "flex-start",
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21C12 21 3 14 3 8.5C3 5.5 5.5 3 8.5 3C10 3 11.5 3.8 12 5C12.5 3.8 14 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14 12 21 12 21Z"
              fill={isWishlisted ? "#C8392B" : "none"}
              stroke={isWishlisted ? "#C8392B" : "#9CA3AF"}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    );
  }

  // ── GRID LAYOUT ─────────────────────────────────────────
  return (
    <div style={{
      background:   "#FFFFFF",
      borderRadius: "16px",
      overflow:     "hidden",
      width:        "100%",
      minWidth:     0,
      boxShadow:    "0 2px 8px rgba(0,0,0,0.07)",
      position:     "relative",
    }}>
      {/* Badge */}
      {produk.badge && (
        <div style={{
          position:     "absolute",
          top:          "10px",
          left:         "10px",
          zIndex:       2,
          background:   produk.badge === "Terlaris" ? "#0A0A0A" : "#C8392B",
          color:        "white",
          fontSize:     "9px",
          fontWeight:   "800",
          padding:      "3px 9px",
          borderRadius: "20px",
          letterSpacing: "0.5px",
        }}>
          {produk.badge}
        </div>
      )}

      {/* Wishlist button */}
      <button
        onClick={() => onWishlist(produk)}
        style={{
          position:   "absolute",
          top:        "8px",
          right:      "8px",
          zIndex:     2,
          background: "rgba(255,255,255,0.9)",
          border:     "none",
          borderRadius: "50%",
          width:      "32px",
          height:     "32px",
          display:    "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor:     "pointer",
          backdropFilter: "blur(4px)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21C12 21 3 14 3 8.5C3 5.5 5.5 3 8.5 3C10 3 11.5 3.8 12 5C12.5 3.8 14 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14 12 21 12 21Z"
            fill={isWishlisted ? "#C8392B" : "none"}
            stroke={isWishlisted ? "#C8392B" : "#9CA3AF"}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Foto produk */}
      <div style={{
        background: "#F2F2F0",
        width:      "100%",
        aspectRatio: "3/4",
        overflow:   "hidden",
      }}>
        {produk.mockup ? (
          <img
            src={produk.mockup}
            alt={produk.nama}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize: "56px" }}>👕</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "12px" }}>
        <div style={{ fontWeight: "800", fontSize: "13px", color: "#0A0A0A", marginBottom: "3px" }}>
          {produk.nama}
        </div>
        <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "10px", lineHeight: 1.4 }}>
          {produk.deskripsi}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "10px", color: "#9CA3AF" }}>Mulai dari</div>
            <div style={{ fontWeight: "900", fontSize: "14px", color: "#0A0A0A" }}>
              {rp(produk.harga)}
            </div>
          </div>
          <button
            onClick={() => onCustom(produk)}
            style={{
              background:   "#0A0A0A",
              color:        "white",
              border:       "none",
              borderRadius: "10px",
              padding:      "8px 14px",
              fontSize:     "12px",
              fontWeight:   "800",
              cursor:       "pointer",
              letterSpacing: "0.3px",
            }}
          >
            Custom →
          </button>
        </div>
      </div>
    </div>
  );
}

