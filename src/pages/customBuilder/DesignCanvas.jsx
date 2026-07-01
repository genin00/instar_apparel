import { useState, useRef, useEffect, useCallback } from "react";
import { MOCKUP_MAP, getShirtFilter, PRINT_AREA } from "../../lib/mockupHelpers.js";

// helper
const rp = (n) => "Rp " + n.toLocaleString("id-ID");
const STEPS = ["Warna", "Desain", "Ukuran", "Konfirmasi"];

// ── Area cetak (hanya depan & belakang) ──────────────────────
const AREA_CETAK = [
  { id: "depan",    label: "Depan",    side: "front" },
  { id: "belakang", label: "Belakang", side: "back"  },
];

// ── CSS Filter preset per warna ───────────────────────────────

function DesignCanvas({ uploadSrc, zona, warna, produkId, side, onUploadClick, onPosisiChange }) {
  const [pos,   setPos]   = useState({ x: 50, y: 50 }); // center, % canvas
  const [scale, setScale] = useState(0.4); // lebar desain, fraksi lebar canvas
  const [active, setActive] = useState(false);
  const [imgRatio, setImgRatio] = useState(1); // rasio lebar/tinggi desain asli

  const canvasRef = useRef(null);
  const dragRef   = useRef(null);
  const pinchRef  = useRef(null);
  const stateRef  = useRef({ pos: { x:50, y:50 }, scale: 0.4 });

  // Reset posisi & baca rasio gambar setiap ganti zona / ganti desain
  useEffect(() => {
    setPos({ x: 50, y: 50 });
    setScale(0.4);
    setImgRatio(1);
    onPosisiChange?.(zona, { x: 50, y: 50, scale: 0.4 });
    if (!uploadSrc) return;
    const im = new Image();
    im.onload = () => setImgRatio((im.naturalWidth / im.naturalHeight) || 1);
    im.src = uploadSrc;
  }, [zona, uploadSrc]);

  stateRef.current = { pos, scale };

  // Pastikan desain tidak pernah melebihi area cetak maksimal (≈ A4)
  const commit = useCallback((newPos, newScale) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const canvasAspect = rect && rect.height ? rect.width / rect.height : 0.75;
    const areaWPct = PRINT_AREA.right - PRINT_AREA.left;
    const areaHPct = PRINT_AREA.bottom - PRINT_AREA.top;

    const maxScaleByWidth  = areaWPct / 100;
    const maxScaleByHeight = (areaHPct / 100) * (imgRatio / canvasAspect);
    const maxScale = Math.min(maxScaleByWidth, maxScaleByHeight, 0.95);

    const clampedScale = Math.min(maxScale, Math.max(0.08, newScale));
    const wPct = clampedScale * 100;
    const hPct = (wPct * canvasAspect) / imgRatio;

    const clampedPos = {
      x: Math.min(PRINT_AREA.right  - wPct / 2, Math.max(PRINT_AREA.left + wPct / 2, newPos.x)),
      y: Math.min(PRINT_AREA.bottom - hPct / 2, Math.max(PRINT_AREA.top  + hPct / 2, newPos.y)),
    };
    setPos(clampedPos);
    setScale(clampedScale);
    onPosisiChange?.(zona, { x: clampedPos.x, y: clampedPos.y, scale: clampedScale });
  }, [imgRatio, zona, onPosisiChange]);

  // Touch events (geser 1 jari, cubit 2 jari = zoom)
  const onTouchStart = useCallback((e) => {
    if (!uploadSrc) return;
    e.preventDefault();
    setActive(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { pos: p, scale: sc } = stateRef.current;

    if (e.touches.length === 1) {
      const tx = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      const ty = ((e.touches[0].clientY - rect.top)  / rect.height) * 100;
      dragRef.current = {
        offsetX: tx - p.x,
        offsetY: ty - p.y,
        scale: sc,
      };
      pinchRef.current = null;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = {
        startDist: Math.hypot(dx, dy),
        startScale: sc,
        pos: p,
      };
      dragRef.current = null;
    }
  }, [uploadSrc]);

  const onTouchMove = useCallback((e) => {
    if (!uploadSrc) return;
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (e.touches.length === 1 && dragRef.current) {
      const tx = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      const ty = ((e.touches[0].clientY - rect.top)  / rect.height) * 100;
      commit(
        { x: tx - dragRef.current.offsetX, y: ty - dragRef.current.offsetY },
        dragRef.current.scale
      );
    } else if (e.touches.length === 2 && pinchRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newScale = pinchRef.current.startScale * (Math.hypot(dx,dy) / pinchRef.current.startDist);
      commit(pinchRef.current.pos, newScale);
    }
  }, [commit, uploadSrc]);

  const onTouchEnd = useCallback(() => {
    dragRef.current  = null;
    pinchRef.current = null;
    setTimeout(() => setActive(false), 150);
  }, []);

  // Mouse events (untuk preview/testing di desktop)
  const onMouseDown = useCallback((e) => {
    if (!uploadSrc) return;
    setActive(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { pos: p, scale: sc } = stateRef.current;
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top)  / rect.height) * 100;
    dragRef.current = { offsetX: mx - p.x, offsetY: my - p.y, scale: sc };
  }, [uploadSrc]);

  const onMouseMove = useCallback((e) => {
    if (!dragRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top)  / rect.height) * 100;
    commit({ x: mx - dragRef.current.offsetX, y: my - dragRef.current.offsetY }, dragRef.current.scale);
  }, [commit]);

  const onMouseUp = useCallback(() => {
    dragRef.current = null;
    setTimeout(() => setActive(false), 150);
  }, []);

  const zoom = (delta) => commit(stateRef.current.pos, stateRef.current.scale + delta);

  return (
    <div
      ref={canvasRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{
        position: "relative",
        width: "100%",
        background: "#F8FAFC",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "inset 0 0 0 1px #E5E7EB",
        touchAction: "none",
        cursor: !uploadSrc ? "default" : active ? "grabbing" : "grab",
      }}
    >
      {/* Mockup kaos asli — tampil selalu, jadi desain langsung menyatu dengan produk */}
      <img
        src={MOCKUP_MAP[produkId]?.[side] || "/mockup-pendek.png"}
        alt="mockup kaos"
        draggable={false}
        style={{
          width: "100%",
          display: "block",
          filter: getShirtFilter(warna),
          transition: "filter 0.3s ease",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* Garis batas area cetak maksimal (≈ ukuran A4) — hanya tampil sebelum desain diupload */}
      {!uploadSrc && (
        <>
          <div style={{
            position: "absolute",
            left: `${PRINT_AREA.left}%`, top: `${PRINT_AREA.top}%`,
            width: `${PRINT_AREA.right - PRINT_AREA.left}%`,
            height: `${PRINT_AREA.bottom - PRINT_AREA.top}%`,
            border: "1px dashed rgba(10,10,10,0.15)",
            borderRadius: "4px",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", left: `${PRINT_AREA.left}%`, top: `calc(${PRINT_AREA.top}% - 14px)`,
            fontSize: "9px", color: "#9CA3AF", fontWeight: "700",
            letterSpacing: "0.5px", pointerEvents: "none",
          }}>Area Cetak</div>
        </>
      )}

      {uploadSrc ? (
        <>
          {/* Desain — bisa digeser & di-zoom, dibatasi area cetak maks. A4 */}
          <img
            src={uploadSrc}
            alt="desain"
            draggable={false}
            style={{
              position: "absolute",
              left: `${pos.x}%`,
              top:  `${pos.y}%`,
              width: `${scale * 100}%`,
              transform: "translate(-50%, -50%)",
              userSelect: "none",
              pointerEvents: "none",
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.25))",
            }}
          />

          {active && (
            <div style={{
              position: "absolute", inset: 0,
              border: "2px solid #C8392B",
              borderRadius: "8px",
              pointerEvents: "none",
            }} />
          )}

          {/* Tombol zoom manual, pelengkap cubit 2 jari */}
          <div style={{ position:"absolute", right:"8px", bottom:"8px", display:"flex", flexDirection:"column", gap:"6px" }}>
            <button onClick={() => zoom(0.05)} style={{
              width:"30px", height:"30px", borderRadius:"8px", border:"none",
              background:"rgba(10,10,10,0.72)", color:"white", fontSize:"16px",
              fontWeight:"800", cursor:"pointer", lineHeight:"1" }}>＋</button>
            <button onClick={() => zoom(-0.05)} style={{
              width:"30px", height:"30px", borderRadius:"8px", border:"none",
              background:"rgba(10,10,10,0.72)", color:"white", fontSize:"16px",
              fontWeight:"800", cursor:"pointer", lineHeight:"1" }}>－</button>
          </div>

          {/* Hint */}
          <div style={{
            position: "absolute", bottom: "8px", left: 0, right: "52px",
            textAlign: "center", fontSize: "9px",
            color: "#FFFFFFE0", textShadow: "0 1px 3px rgba(0,0,0,0.6)",
            pointerEvents: "none",
          }}>
            👆 Seret untuk pindah · Cubit 2 jari/tombol untuk zoom
          </div>
        </>
      ) : (
        /* Belum ada desain — overlay tombol upload di atas mockup */
        <button onClick={onUploadClick} style={{
          position: "absolute", left: "50%", bottom: "12px", top: "auto", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
          padding: "10px 16px", borderRadius: "10px", border: "none",
          background: "rgba(10,10,10,0.8)", color: "white", cursor: "pointer",
        }}>
          <span style={{ fontSize: "14px" }}>↑</span>
          <span style={{ fontWeight: "800", fontSize: "12px" }}>Upload Desain</span>
          
        </button>
      )}
    </div>
  );
}

export default DesignCanvas;
