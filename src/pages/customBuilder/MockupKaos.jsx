import { useState } from "react";

function MockupKaos({ warna, produkId, side }) {
  const src = MOCKUP_MAP[produkId]?.[side] || "/mockup-pendek.png";

  return (
    <img
      src={src}
      alt="mockup kaos"
      style={{
        width: "100%",
        display: "block",
        filter: getShirtFilter(warna),
        transition: "filter 0.3s ease",
        userSelect: "none",
        pointerEvents: "none",
      }}
    />
  );
}

export default MockupKaos;
