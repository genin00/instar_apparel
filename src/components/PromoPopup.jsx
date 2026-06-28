// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — PROMO POPUP (seperti Shopee)
//  - Muncul sekali per hari saat buka app
//  - Bisa diisi gambar atau konten promo teks
//  - Swipe atau klik × untuk tutup
// ═══════════════════════════════════════════════════════════

import { useState, useEffect } from "react";

const PROMO_LIST = [
  {
    id:       "promo-juni-2026",
    badge:    "🔥 PROMO TERBATAS",
    judul:    "Gratis Ongkir\nse-Indonesia!",
    sub:      "Min. order 12 pcs. Berlaku s/d 30 Juni 2026.",
    cta:      "Pesan Sekarang",
    warna:    "#C8392B",
    bg:       "linear-gradient(135deg, #0A0A0A 0%, #1a0505 60%, #2d0a0a 100%)",
    emoji:    "🚚",
  },
  {
    id:       "diskon-desain-juni-2026",
    badge:    "✨ SPESIAL",
    judul:    "Konsultasi Desain\nGRATIS!",
    sub:      "Ceritakan idemu ke tim desainer kami. Tanpa biaya tambahan.",
    cta:      "Chat Desainer",
    warna:    "#7C3AED",
    bg:       "linear-gradient(135deg, #0A0A0A 0%, #0d0520 60%, #150a2d 100%)",
    emoji:    "🎨",
  },
];

const CEK_KEY = "instar_promo_tanggal";

function sudahLihatHariIni() {
  try {
    return localStorage.getItem(CEK_KEY) === new Date().toDateString();
  } catch { return false; }
}

function tandaiSudahLihat() {
  try {
    localStorage.setItem(CEK_KEY, new Date().toDateString());
  } catch {}
}

export default function PromoPopup({ onCta }) {
  const [visible,  setVisible]  = useState(false);
  const [closing,  setClosing]  = useState(false);
  const [aktif,    setAktif]    = useState(0);

  useEffect(() => {
    if (sudahLihatHariIni()) return;
    // Delay sedikit agar tidak langsung muncul saat app load
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const tutup = () => {
    setClosing(true);
    tandaiSudahLihat();
    setTimeout(() => setVisible(false), 350);
  };

  const handleCta = () => {
    tutup();
    onCta?.(PROMO_LIST[aktif]);
  };

  if (!visible) return null;

  const promo = PROMO_LIST[aktif];

  return (
    <div
      onClick={tutup}
      style={{
        position:        "fixed",
        inset:           0,
        zIndex:          999,
        background:      "rgba(0,0,0,0.75)",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         "24px",
        opacity:         closing ? 0 : 1,
        transition:      "opacity 0.35s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width:           "100%",
          maxWidth:        "360px",
          borderRadius:    "24px",
          overflow:        "hidden",
          background:      promo.bg,
          boxShadow:       "0 24px 64px rgba(0,0,0,0.6)",
          transform:       closing ? "scale(0.92) translateY(20px)" : "scale(1) translateY(0)",
          transition:      "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease",
          position:        "relative",
        }}
      >
        {/* Tombol tutup */}
        <button
          onClick={tutup}
          style={{
            position:        "absolute",
            top:             "14px",
            right:           "14px",
            width:           "30px",
            height:          "30px",
            borderRadius:    "50%",
            background:      "rgba(255,255,255,0.12)",
            border:          "none",
            color:           "white",
            fontSize:        "14px",
            cursor:          "pointer",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            zIndex:          1,
          }}
        >✕</button>

        {/* Konten */}
        <div style={{ padding: "32px 24px 24px" }}>

          {/* Dekorasi lingkaran */}
          <div style={{
            position: "absolute", right: "-30px", top: "-30px",
            width: "140px", height: "140px", borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", left: "-20px", bottom: "-20px",
            width: "100px", height: "100px", borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            pointerEvents: "none",
          }} />

          {/* Emoji besar */}
          <div style={{ fontSize: "52px", marginBottom: "14px", lineHeight: 1 }}>
            {promo.emoji}
          </div>

          {/* Badge */}
          <div style={{
            display:         "inline-block",
            background:      promo.warna,
            color:           "white",
            fontSize:        "10px",
            fontWeight:      "800",
            letterSpacing:   "1.5px",
            padding:         "4px 10px",
            borderRadius:    "6px",
            marginBottom:    "12px",
          }}>
            {promo.badge}
          </div>

          {/* Judul */}
          <div style={{
            fontWeight:   "900",
            fontSize:     "26px",
            color:        "white",
            lineHeight:   1.2,
            marginBottom: "10px",
            whiteSpace:   "pre-line",
          }}>
            {promo.judul}
          </div>

          {/* Sub */}
          <div style={{
            fontSize:     "13px",
            color:        "rgba(255,255,255,0.6)",
            lineHeight:   1.6,
            marginBottom: "24px",
          }}>
            {promo.sub}
          </div>

          {/* CTA */}
          <button
            onClick={handleCta}
            style={{
              width:        "100%",
              padding:      "14px",
              borderRadius: "14px",
              border:       "none",
              background:   promo.warna,
              color:        "white",
              fontWeight:   "900",
              fontSize:     "15px",
              cursor:       "pointer",
              marginBottom: "10px",
              boxShadow:    `0 8px 24px ${promo.warna}55`,
            }}
          >
            {promo.cta} →
          </button>

          <button
            onClick={tutup}
            style={{
              width:        "100%",
              padding:      "11px",
              borderRadius: "14px",
              border:       "none",
              background:   "rgba(255,255,255,0.08)",
              color:        "rgba(255,255,255,0.5)",
              fontWeight:   "600",
              fontSize:     "13px",
              cursor:       "pointer",
            }}
          >
            Lewati
          </button>
        </div>

        {/* Dots navigator kalau lebih dari 1 promo */}
        {PROMO_LIST.length > 1 && (
          <div style={{
            display:        "flex",
            justifyContent: "center",
            gap:            "6px",
            paddingBottom:  "18px",
          }}>
            {PROMO_LIST.map((_, i) => (
              <button
                key={i}
                onClick={() => setAktif(i)}
                style={{
                  width:        i === aktif ? "20px" : "6px",
                  height:       "6px",
                  borderRadius: "3px",
                  border:       "none",
                  background:   i === aktif ? "white" : "rgba(255,255,255,0.3)",
                  cursor:       "pointer",
                  padding:      0,
                  transition:   "all 0.2s",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
