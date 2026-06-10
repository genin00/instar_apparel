// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — INTRO CINEMATIC
// ═══════════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import config from "../config.js";

export default function Intro({ onSelesai }) {
  const [fase, setFase] = useState(0);
  // fase 0 = gelap total
  // fase 1 = logo muncul
  // fase 2 = tagline muncul
  // fase 3 = tombol muncul
  // fase 4 = fade out

  useEffect(() => {
    const timers = [
      setTimeout(() => setFase(1), 400),   // logo muncul
      setTimeout(() => setFase(2), 1400),  // tagline muncul
      setTimeout(() => setFase(3), 2400),  // tombol muncul
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleMulai = () => {
    setFase(4);
    setTimeout(() => onSelesai(), 600);
  };

  return (
    <div
      onClick={fase === 3 ? handleMulai : undefined}
      style={{
        position:        "fixed",
        inset:           0,
        background:      "#0A0A0A",
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "center",
        justifyContent:  "center",
        zIndex:          999,
        opacity:         fase === 4 ? 0 : 1,
        transition:      "opacity 0.6s ease",
        cursor:          fase === 3 ? "pointer" : "default",
        padding:         "40px 32px",
      }}
    >
      {/* ── LOGO ── */}
      <div style={{
        opacity:    fase >= 1 ? 1 : 0,
        transform:  fase >= 1 ? "translateY(0px)" : "translateY(20px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        display:    "flex",
        flexDirection: "column",
        alignItems: "center",
        gap:        "20px",
      }}>
        {/* Logo SVG */}
        <svg
          width="100"
          height="86"
          viewBox="0 0 220 190"
          fill="none"
        >
          <circle cx="72" cy="36" r="13" fill="white" />
          <path
            d="M52 66 Q18 50 28 86 Q38 122 80 116 Q122 110 148 130 Q174 150 158 176 Q142 196 108 190 Q74 184 52 160"
            stroke="white"
            strokeWidth="20"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M58 76 Q86 60 116 74 Q146 88 148 122"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M138 98 L124 124 L134 124 L120 152 L142 116 L130 116 Z"
            fill="white"
          />
        </svg>

        {/* Brand name */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontWeight:    900,
            fontSize:      "38px",
            letterSpacing: "8px",
            color:         "#FFFFFF",
            lineHeight:    1,
            fontFamily:    "system-ui, sans-serif",
          }}>
            INSTAR
          </div>
          <div style={{
            fontSize:      "13px",
            letterSpacing: "8px",
            color:         "#4B5563",
            marginTop:     "6px",
            fontWeight:    "400",
          }}>
            APPAREL
          </div>
        </div>
      </div>

      {/* ── GARIS PEMISAH ── */}
      <div style={{
        width:      fase >= 2 ? "48px" : "0px",
        height:     "1px",
        background: "#374151",
        margin:     "32px 0",
        transition: "width 0.8s ease",
      }} />

      {/* ── TAGLINE ── */}
      <div style={{
        opacity:    fase >= 2 ? 1 : 0,
        transform:  fase >= 2 ? "translateY(0px)" : "translateY(10px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        textAlign:  "center",
      }}>
        <div style={{
          fontSize:      "16px",
          color:         "#9CA3AF",
          fontStyle:     "italic",
          letterSpacing: "1px",
          lineHeight:    1.6,
        }}>
          "{config.brand.tagline}"
        </div>
      </div>

      {/* ── TOMBOL MULAI ── */}
      <div style={{
        position:   "absolute",
        bottom:     "60px",
        left:       0,
        right:      0,
        display:    "flex",
        flexDirection: "column",
        alignItems: "center",
        gap:        "12px",
        opacity:    fase >= 3 ? 1 : 0,
        transform:  fase >= 3 ? "translateY(0px)" : "translateY(16px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}>
        <button
          onClick={handleMulai}
          style={{
            background:    "#FFFFFF",
            color:         "#0A0A0A",
            border:        "none",
            borderRadius:  "50px",
            padding:       "14px 48px",
            fontSize:      "14px",
            fontWeight:    "900",
            letterSpacing: "2px",
            cursor:        "pointer",
            boxShadow:     "0 0 40px rgba(255,255,255,0.15)",
          }}
        >
          MULAI CUSTOM
        </button>
        <div style={{
          fontSize:  "11px",
          color:     "#4B5563",
          letterSpacing: "1px",
        }}>
          Tap untuk melanjutkan
        </div>
      </div>

      {/* ── TITIK DEKORASI ── */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{
            position:     "absolute",
            width:        "2px",
            height:       "2px",
            borderRadius: "50%",
            background:   "#374151",
            top:          `${15 + i * 18}%`,
            right:        `${8 + (i % 2) * 4}%`,
            opacity:      fase >= 1 ? 0.6 : 0,
            transition:   `opacity ${0.5 + i * 0.1}s ease`,
          }}
        />
      ))}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{
            position:     "absolute",
            width:        "2px",
            height:       "2px",
            borderRadius: "50%",
            background:   "#374151",
            top:          `${20 + i * 15}%`,
            left:         `${6 + (i % 2) * 4}%`,
            opacity:      fase >= 1 ? 0.6 : 0,
            transition:   `opacity ${0.5 + i * 0.1}s ease`,
          }}
        />
      ))}

    </div>
  );
}

