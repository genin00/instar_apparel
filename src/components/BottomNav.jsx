// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — BOTTOM NAVIGATION
// ═══════════════════════════════════════════════════════════

const navItems = [
  {
    id:    "beranda",
    label: "Beranda",
    icon:  (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
          fill={active ? "#0A0A0A" : "none"}
          stroke={active ? "#0A0A0A" : "#9CA3AF"}
          strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id:    "produk",
    label: "Produk",
    icon:  (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M20.5 7.5L12 3L3.5 7.5V16.5L12 21L20.5 16.5V7.5Z"
          fill={active ? "#0A0A0A" : "none"}
          stroke={active ? "#0A0A0A" : "#9CA3AF"}
          strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 3V21M3.5 7.5L12 12L20.5 7.5"
          stroke={active ? "#FFFFFF" : "#9CA3AF"}
          strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id:    "wishlist",
    label: "Wishlist",
    icon:  (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 21C12 21 3 14 3 8.5C3 5.5 5.5 3 8.5 3C10 3 11.5 3.8 12 5C12.5 3.8 14 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14 12 21 12 21Z"
          fill={active ? "#0A0A0A" : "none"}
          stroke={active ? "#0A0A0A" : "#9CA3AF"}
          strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id:    "support",
    label: "Support",
    icon:  (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9"
          fill={active ? "#0A0A0A" : "none"}
          stroke={active ? "#0A0A0A" : "#9CA3AF"}
          strokeWidth="1.8" />
        <path d="M12 8C10.9 8 10 8.9 10 10"
          stroke={active ? "#FFFFFF" : "#9CA3AF"}
          strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="16" r="0.8"
          fill={active ? "#FFFFFF" : "#9CA3AF"} />
        <path d="M12 10V14"
          stroke={active ? "#FFFFFF" : "#9CA3AF"}
          strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id:    "akun",
    label: "Akun",
    icon:  (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4"
          fill={active ? "#0A0A0A" : "none"}
          stroke={active ? "#0A0A0A" : "#9CA3AF"}
          strokeWidth="1.8" />
        <path d="M4 20C4 17 7.6 15 12 15C16.4 15 20 17 20 20"
          stroke={active ? "#0A0A0A" : "#9CA3AF"}
          strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function BottomNav({ aktif, onChange, keranjangCount = 0 }) {
  return (
    <div style={{
      position:        "fixed",
      bottom:          0,
      left:            0,
      right:           0,
      background:      "#FFFFFF",
      borderTop:       "1px solid #E5E7EB",
      display:         "flex",
      alignItems:      "center",
      justifyContent:  "space-around",
      padding:         "8px 0 12px",
      zIndex:          100,
      maxWidth:        "480px",
      margin:          "0 auto",
    }}>
      {navItems.map((item) => {
        const isActive = aktif === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            style={{
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              gap:            "3px",
              background:     "none",
              border:         "none",
              cursor:         "pointer",
              padding:        "4px 12px",
              position:       "relative",
            }}
          >
            {/* Keranjang badge — muncul di icon Produk */}
            {item.id === "produk" && keranjangCount > 0 && (
              <div style={{
                position:   "absolute",
                top:        "0px",
                right:      "8px",
                background: "#C8392B",
                color:      "white",
                fontSize:   "9px",
                fontWeight: "800",
                width:      "16px",
                height:     "16px",
                borderRadius: "50%",
                display:    "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {keranjangCount > 9 ? "9+" : keranjangCount}
              </div>
            )}

            {item.icon(isActive)}

            <span style={{
              fontSize:   "10px",
              fontWeight: isActive ? "800" : "400",
              color:      isActive ? "#0A0A0A" : "#9CA3AF",
              lineHeight: 1,
            }}>
              {item.label}
            </span>

            {/* Active indicator dot */}
            {isActive && (
              <div style={{
                position:     "absolute",
                bottom:       "-4px",
                width:        "4px",
                height:       "4px",
                borderRadius: "50%",
                background:   "#0A0A0A",
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

