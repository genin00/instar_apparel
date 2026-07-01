import MockupKaos from "./MockupKaos.jsx";

function PreviewKonfirmasi({ warna, produk, opsiDesain, uploads, posisiDesain }) {
  const hasDepan    = opsiDesain === "upload" && uploads?.depan;
  const hasBelakang = opsiDesain === "upload" && uploads?.belakang;
  const zona      = hasDepan ? "depan" : hasBelakang ? "belakang" : null;
  const sisi      = zona === "belakang" ? "back" : "front";
  const desainSrc = zona ? uploads[zona] : null;
  // Posisi/skala asli yang diatur user di canvas (drag & zoom), bukan hardcode.
  const posisi    = (zona && posisiDesain?.[zona]) || { x: 190, y: 90, scale: 0.36 };
  const mockupSrc = MOCKUP_MAP[produk?.id]?.[sisi] || "/mockup-pendek.png";

  return (
    <div style={{
      width: "96px", borderRadius: "140px",
      background: "#ffffff10", border: "2px solid #ffffff20",
      overflow: "hidden", position: "relative", flexShrink: 0,
    }}>
      {/* width 100% / height auto — sama dengan canvas, tanpa letterbox */}
      <img src={mockupSrc} alt={produk?.nama}
        style={{
          width: "100%", height: "auto", display: "block",
          filter: getShirtFilter(warna),
        }} />
      {desainSrc && (
        <img src={desainSrc} alt="desain"
          style={{
            position: "absolute",
            left: `${posisi.x}%`, top: `${posisi.y}%`,
            width: `${posisi.scale * 100}%`,
            transform: "translate(-50%, -50%)",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
          }} />
      )}
    </div>
  );
}

export default PreviewKonfirmasi;
