// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — HEADER
// ═══════════════════════════════════════════════════════════

import config from "../config.js";

// ── LOGO SVG ────────────────────────────────────────────────
export const InstarLogo = ({ size = 36, white = false }) => {
  const c = white ? "#FFFFFF" : "#0A0A0A";
  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 220 190"
      fill="none"
    >
      {/* dot */}
      <circle cx="72" cy="36" r="13" fill={c} />
      {/* S-curve body */}
      <path
        d="M52 66 Q18 50 28 86 Q38 122 80 116 Q122 110 148 130 Q174 150 158 176 Q142 196 108 190 Q74 184 52 160"
        stroke={c}
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
      />
      {/* inner highlight */}
      <path
        d="M58 76 Q86 60 116 74 Q146 88 148 122"
        stroke={white ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)"}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* lightning bolt */}
      <path
        d="M138 98 L124 124 L134 124 L120 152 L142 116 L130 116 Z"
        fill={c}
      />
    </svg>
  );
};

// ── HEADER COMPONENT ────────────────────────────────────────
export default function Header({
  halaman      = "beranda",
  judul        = null,
  onBack       = null,
  keranjangCount = 0,
  onKeranjang  = null,
}) {

  // Halaman yang pakai header hitam penuh (brand header)
  const isBrandHeader = halaman === "beranda" || halaman === "produk";

  // Halaman yang pakai header dengan tombol back
  const isSubPage = !!onBack;

  return (
    <div style={{
      position:   "sticky",
      top:        0,
      zIndex:     99,
      background: isBrandHeader ? "#0A0A0A" : "#FFFFFF",
      borderBottom: isBrandHeader ? "none" : "1px solid #E5E7EB",
    }}>
      <div style={{
        maxWidth:       "480px",
        margin:         "0 auto",
        padding:        "12px 16px",
        display:        "flex",
        alignItems:     "center",
        gap:            "10px",
        minHeight:      "56px",
      }}>

        {/* Tombol back — muncul di sub-page */}
        {isSubPage && (
          <button
            onClick={onBack}
            style={{
              background:   "none",
              border:       "none",
              cursor:       "pointer",
              padding:      "4px",
              display:      "flex",
              alignItems:   "center",
              flexShrink:   0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke={isBrandHeader ? "#FFFFFF" : "#0A0A0A"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Logo — muncul di brand header */}
        {isBrandHeader && !isSubPage && (
          <>
            <InstarLogo size={34} white />
            <div style={{ marginLeft: "2px" }}>
              <div style={{
                fontWeight:    900,
                fontSize:      "16px",
                letterSpacing: "3px",
                color:         "#FFFFFF",
                lineHeight:    1,
              }}>
                INSTAR
              </div>
              <div style={{
                fontSize:      "9px",
                letterSpacing: "4px",
                color:         "#6B7280",
                lineHeight:    1,
                marginTop:     "2px",
              }}>
                APPAREL
              </div>
            </div>
          </>
        )}

        {/* Judul halaman — muncul di sub-page */}
        {judul && (
          <div style={{
            fontWeight: 800,
            fontSize:   "16px",
            color:      isBrandHeader ? "#FFFFFF" : "#0A0A0A",
            flex:       1,
            textAlign:  isSubPage ? "center" : "left",
            marginRight: isSubPage ? "32px" : "0",
          }}>
            {judul}
          </div>
        )}

        {/* Spacer */}
        {!judul && <div style={{ flex: 1 }} />}

        {/* Tagline — hanya di beranda */}
        {halaman === "beranda" && !isSubPage && (
          <div style={{
            marginLeft: "auto",
            fontSize:   "10px",
            color:      "#6B7280",
            fontStyle:  "italic",
            maxWidth:   "120px",
            textAlign:  "right",
            lineHeight: 1.3,
          }}>
            {config.brand.tagline}
          </div>
        )}

        {/* Icon keranjang — muncul di produk & custom builder */}
        {(halaman === "produk" || halaman === "custom") && onKeranjang && (
          <button
            onClick={onKeranjang}
            style={{
              background:   "none",
              border:       "none",
              cursor:       "pointer",
              padding:      "4px",
              position:     "relative",
              display:      "flex",
              alignItems:   "center",
              flexShrink:   0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z"
                stroke={isBrandHeader ? "#FFFFFF" : "#0A0A0A"}
                strokeWidth="1.8"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M3 6H21M16 10C16 12.2 14.2 14 12 14C9.8 14 8 12.2 8 10"
                stroke={isBrandHeader ? "#FFFFFF" : "#0A0A0A"}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            {keranjangCount > 0 && (
              <div style={{
                position:       "absolute",
                top:            "0px",
                right:          "0px",
                background:     "#C8392B",
                color:          "white",
                fontSize:       "9px",
                fontWeight:     "800",
                width:          "16px",
                height:         "16px",
                borderRadius:   "50%",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
              }}>
                {keranjangCount > 9 ? "9+" : keranjangCount}
              </div>
            )}
          </button>
        )}

      </div>
    </div>
  );
}

