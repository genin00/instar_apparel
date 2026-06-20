// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — CUSTOM BUILDER (v5)
//  - 2 zona: Depan & Belakang
//  - Canvas A4 untuk posisi desain
//  - Drag desain di atas canvas
//  - Warna kaos via CSS filter preset
// ═══════════════════════════════════════════════════════════

import { useState, useRef, useCallback, useEffect } from "react";
import Header from "../components/Header.jsx";
import { warnaKaos, ukuranTersedia, kategoriTemplate } from "../data/products.js";
import config from "../config.js";

const rp = (n) => "Rp " + n.toLocaleString("id-ID");
const STEPS = ["Warna", "Desain", "Ukuran", "Konfirmasi"];

// ── Area cetak (hanya depan & belakang) ──────────────────────
const AREA_CETAK = [
  { id: "depan",    label: "Depan",    side: "front" },
  { id: "belakang", label: "Belakang", side: "back"  },
];

// ── CSS Filter preset per warna ───────────────────────────────
function getShirtFilter(hex) {
  if (!hex || hex === "#FFFFFF" || hex === "#ffffff") return "none";
  const presets = {
    "#1A1A1A": "brightness(0.15)",
    "#9CA3AF": "brightness(0.65) saturate(0)",
    "#1E3A5F": "brightness(0.25) sepia(1) hue-rotate(180deg) saturate(3)",
    "#C8392B": "brightness(0.4) sepia(1) hue-rotate(320deg) saturate(5)",
    "#6B2737": "brightness(0.25) sepia(1) hue-rotate(300deg) saturate(4)",
    "#6B7040": "brightness(0.35) sepia(1) hue-rotate(60deg) saturate(2)",
    "#F5F5DC": "brightness(0.97) sepia(0.15)",
    "#3B82F6": "brightness(0.5) sepia(1) hue-rotate(190deg) saturate(5)",
    "#10B981": "brightness(0.4) sepia(1) hue-rotate(120deg) saturate(5)",
    "#F59E0B": "brightness(0.6) sepia(1) hue-rotate(10deg) saturate(6)",
    "#EC4899": "brightness(0.5) sepia(1) hue-rotate(280deg) saturate(6)",
    "#7C3AED": "brightness(0.35) sepia(1) hue-rotate(240deg) saturate(6)",
    "#92400E": "brightness(0.3) sepia(1) hue-rotate(350deg) saturate(4)",
  };
  return presets[hex] || "brightness(0.5) sepia(1) saturate(3)";
}

// ── Path mockup foto kaos per produk ──────────────────────────
const MOCKUP_MAP = {
  "lengan-pendek":  { front: "/mockup-pendek.png",  back: "/mockup-pendek-belakang.png"  },
  "lengan-panjang": { front: "/mockup-panjang.png", back: "/mockup-panjang-belakang.png" },
  "rib":            { front: "/mockup-rib.png",     back: "/mockup-rib-belakang.png"     },
};

// ── Area cetak maksimal (≈ proporsi A4) dipetakan ke kanvas mockup, dalam % ──
const PRINT_AREA = { left: 24, right: 76, top: 10, bottom: 86 };

// ── CANVAS: mockup kaos asli + desain digabung jadi 1 layer ──────────────
// - Mockup difilter sesuai warna kaos yang dipilih (selalu tampil, menyatu dgn desain)
// - Desain bisa digeser (drag) & di-zoom (cubit 2 jari / tombol +−)
// - Posisi & ukuran desain dibatasi agar tidak melebihi area cetak maks. A4
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
            border: "1.5px dashed rgba(10,10,10,0.25)",
            borderRadius: "4px",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", left: `${PRINT_AREA.left}%`, top: `calc(${PRINT_AREA.top}% - 14px)`,
            fontSize: "9px", color: "#9CA3AF", fontWeight: "700",
            letterSpacing: "0.5px", pointerEvents: "none",
          }}>MAKS. A4 · {zona === "depan" ? "DEPAN" : "BELAKANG"}</div>
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
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
          padding: "16px 22px", borderRadius: "12px", border: "none",
          background: "rgba(10,10,10,0.8)", color: "white", cursor: "pointer",
        }}>
          <span style={{ fontSize: "22px" }}>📁</span>
          <span style={{ fontWeight: "800", fontSize: "13px" }}>Upload Desain</span>
          <span style={{ fontSize: "10px", color: "#D1D5DB" }}>PNG, JPG · maks 10MB</span>
        </button>
      )}
    </div>
  );
}

// ── MOCKUP KAOS (foto asli + filter warna) ───────────────────
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

// ── PREVIEW MINI UNTUK STEP KONFIRMASI (mockup + desain) ──────
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

// ── COLOR PICKER ─────────────────────────────────────────────
function ColorPicker({ warna, setWarna }) {
  const [showCustom, setShowCustom] = useState(false);
  const [customHex,  setCustomHex]  = useState(warna);
  const isCustom = !warnaKaos.find(w => w.hex === warna);
  const warnaObj = warnaKaos.find(w => w.hex === warna);

  return (
    <div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"10px", marginBottom:"12px" }}>
        {warnaKaos.map(w => (
          <button key={w.hex} onClick={() => { setWarna(w.hex); setCustomHex(w.hex); }}
            title={w.nama} style={{
              width:"38px", height:"38px", borderRadius:"50%",
              background: w.hex, cursor:"pointer", border:"3px solid",
              borderColor: warna===w.hex ? "#C8392B" : w.hex==="#FFFFFF" ? "#D1D5DB" : "transparent",
              boxShadow: warna===w.hex
                ? "0 0 0 3px rgba(200,57,43,0.3), 0 2px 8px rgba(0,0,0,0.2)"
                : "0 2px 6px rgba(0,0,0,0.12)",
              transition: "all 0.15s", flexShrink: 0,
            }} />
        ))}
        <button onClick={() => setShowCustom(s => !s)} title="Warna kustom" style={{
          width:"38px", height:"38px", borderRadius:"50%",
          background: isCustom ? warna : "conic-gradient(#FF6B6B,#FFD93D,#6BCB77,#4D96FF,#C44FFF,#FF6B6B)",
          cursor:"pointer", border:"3px solid",
          borderColor: isCustom ? "#C8392B" : "transparent",
          boxShadow: isCustom ? "0 0 0 3px rgba(200,57,43,0.3)" : "0 2px 6px rgba(0,0,0,0.2)",
          fontSize: isCustom ? "0" : "14px",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
        }}>{!isCustom && "🎨"}</button>
      </div>

      <div style={{
        display:"flex", alignItems:"center", gap:"10px",
        padding:"10px 14px", background:"#F9FAFB",
        borderRadius:"10px", border:"1px solid #E5E7EB",
        marginBottom: showCustom ? "10px" : "0",
      }}>
        <div style={{
          width:"26px", height:"26px", borderRadius:"50%", background:warna,
          border:"2px solid "+(warna==="#FFFFFF"?"#D1D5DB":"#00000020"), flexShrink:0,
        }}/>
        <div>
          <div style={{ fontWeight:"700", fontSize:"13px" }}>{isCustom ? "Warna Kustom" : warnaObj?.nama}</div>
          <div style={{ fontSize:"10px", color:"#9CA3AF", fontFamily:"monospace" }}>{warna.toUpperCase()}</div>
        </div>
      </div>

      {showCustom && (
        <div style={{ background:"white", border:"2px solid #E5E7EB", borderRadius:"12px", padding:"14px", marginTop:"10px" }}>
          <div style={{ fontWeight:"700", fontSize:"13px", marginBottom:"12px" }}>🎨 Warna Kustom</div>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"14px" }}>
            <input type="color"
              value={customHex.match(/^#[0-9A-Fa-f]{6}$/) ? customHex : "#000000"}
              onChange={e => { setCustomHex(e.target.value); setWarna(e.target.value); }}
              style={{ width:"56px", height:"56px", borderRadius:"12px", border:"2px solid #E5E7EB", cursor:"pointer", padding:"3px", flexShrink:0 }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"11px", color:"#9CA3AF", marginBottom:"5px" }}>Kode HEX</div>
              <div style={{ display:"flex", gap:"6px" }}>
                <input value={customHex} onChange={e => setCustomHex(e.target.value)} placeholder="#000000"
                  style={{ flex:1, border:"2px solid #E5E7EB", borderRadius:"8px", padding:"8px 10px", fontSize:"13px", fontWeight:"700", fontFamily:"monospace", outline:"none" }}/>
                <button onClick={() => {
                  const h = customHex.startsWith("#") ? customHex : "#"+customHex;
                  if (/^#[0-9A-Fa-f]{6}$/.test(h)) { setWarna(h); setCustomHex(h); }
                }} style={{ padding:"8px 14px", borderRadius:"8px", border:"none", background:"#0A0A0A", color:"white", fontWeight:"700", fontSize:"12px", cursor:"pointer" }}>OK</button>
              </div>
            </div>
          </div>
          <div style={{ fontSize:"11px", color:"#9CA3AF", marginBottom:"8px" }}>Warna Populer</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {["#FF6B6B","#FF8E53","#FFD93D","#6BCB77","#4D96FF","#C44FFF","#FF69B4","#00BCD4","#795548","#607D8B","#1A1A1A","#2C3E50","#8B0000","#006400","#00008B"].map(h => (
              <button key={h} onClick={() => { setWarna(h); setCustomHex(h); }}
                style={{ width:"30px", height:"30px", borderRadius:"50%", background:h, border:"2px solid", borderColor:warna===h?"#C8392B":"transparent", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────
export default function CustomBuilder({ produk, onBack, onTambahKeranjang, desainAwal }) {
  const [step,         setStep]         = useState(0);
  const [warna,        setWarna]        = useState("#FFFFFF");
  const [opsiDesain,   setOpsiDesain]   = useState(desainAwal ? "upload" : null);
  const [side,         setSide]         = useState("front");
  const [activeZona,   setActiveZona]   = useState("depan");
  const [uploads,      setUploads]      = useState(() =>
    desainAwal ? { depan: desainAwal.gambarDesain } : {}
  );
  const [posisiDesain, setPosisiDesain] = useState({});
  const [catatan,      setCatatan]      = useState({});
  const [catatanInput, setCatatanInput] = useState("");
  const [briefKat,     setBriefKat]     = useState(null);
  const [briefTeks,    setBriefTeks]    = useState({ depan:"", belakang:"" });
  const [kodeDesain,   setKodeDesain]   = useState("");
  const [modeUkuran,   setModeUkuran]   = useState("satuan");
  const [satuanSize,   setSatuanSize]   = useState("M");
  const [satuanQty,    setSatuanQty]    = useState(1);
  const [massalQty,    setMassalQty]    = useState({});

  const fileRef = useRef(null);

  const warnaObj    = warnaKaos.find(w => w.hex === warna) || { nama: "Kustom" };
  const uploadCount = Object.values(uploads).filter(Boolean).length;
  const biayaDesain = uploadCount * config.harga.biayaDesainPerArea;
  const totalQty    = modeUkuran === "satuan"
    ? satuanQty
    : Object.values(massalQty).reduce((a,b) => a+(parseInt(b)||0), 0);
  const totalHarga  = (produk.harga + biayaDesain) * totalQty;

  const handleZonaClick = (zona) => {
    setActiveZona(zona);
    setCatatanInput(catatan[zona] || "");
    const z = AREA_CETAK.find(a => a.id === zona);
    if (z) setSide(z.side);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploads(prev => ({ ...prev, [activeZona]: ev.target.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const hapusUpload = (zona) => setUploads(prev => { const n={...prev}; delete n[zona]; return n; });
  const simpanCatatan = () => setCatatan(prev => ({ ...prev, [activeZona]: catatanInput }));

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
    else onBack();
  };

  const handleTambahKeranjang = () => {
    onTambahKeranjang({
      id: Date.now(), produk, warna, warnaLabel: warnaObj.nama,
      opsiDesain, uploads, posisiDesain, catatan, briefKat, briefTeks, kodeDesain,
      modeUkuran, satuanSize, satuanQty, massalQty, totalQty, totalHarga,
    });
  };

  const canNext = () => {
    if (step === 0) return !!warna;
    if (step === 1) {
      if (!opsiDesain) return false;
      if (opsiDesain === "brief") return !!briefKat;
      return true;
    }
    if (step === 2) return totalQty > 0;
    return true;
  };

  const S = {
    card:  { background:"white", borderRadius:"14px", padding:"16px", marginBottom:"12px" },
    label: { fontWeight:"700", fontSize:"13px", color:"#374151", marginBottom:"8px" },
    sub:   { fontSize:"12px", color:"#9CA3AF", marginBottom:"10px" },
  };

  const StepBar = () => (
    <div style={{ background:"white", borderBottom:"1px solid #E5E7EB", padding:"10px 16px" }}>
      <div style={{ display:"flex", alignItems:"center" }}>
        {STEPS.map((s,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", flex:i<STEPS.length-1?1:"none" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"3px" }}>
              <div style={{
                width:"24px", height:"24px", borderRadius:"50%",
                background: i<step?"#0A0A0A":i===step?"#C8392B":"#E5E7EB",
                color: i<=step?"white":"#9CA3AF",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"10px", fontWeight:"800",
              }}>{i<step?"✓":i+1}</div>
              <div style={{ fontSize:"9px", whiteSpace:"nowrap",
                fontWeight:i===step?"800":"400",
                color:i===step?"#C8392B":i<step?"#374151":"#9CA3AF" }}>{s}</div>
            </div>
            {i<STEPS.length-1 && (
              <div style={{ flex:1, height:"2px", margin:"0 4px", marginBottom:"14px",
                background:i<step?"#0A0A0A":"#E5E7EB" }}/>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ background:"#F2F2F0", minHeight:"100vh", paddingBottom:"90px" }}>
      <Header halaman="custom" judul={produk.nama} onBack={handleBack}/>
      <StepBar/>

      <div style={{ padding:"16px", maxWidth:"480px", margin:"0 auto" }}>

        {/* ══ STEP 0: PILIH WARNA ══ */}
        {step === 0 && (
          <div>
            <div style={{ background:"#F8FAFC", borderRadius:"18px", padding:"20px 24px 14px",
              marginBottom:"12px", border:"1px solid #E2E8F0" }}>
              <div style={{ maxWidth:"200px", margin:"0 auto" }}>
                <MockupKaos warna={warna} produkId={produk.id} side="front"/>
              </div>
              <div style={{ textAlign:"center", fontSize:"12px", color:"#6B7280",
                marginTop:"10px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                <div style={{ width:"14px", height:"14px", borderRadius:"50%", background:warna,
                  border:"1px solid "+(warna==="#FFFFFF"?"#D1D5DB":"#00000020"), flexShrink:0 }}/>
                <span><strong style={{color:"#0A0A0A"}}>{produk.nama}</strong> · {warnaObj.nama}</span>
              </div>
            </div>
            <div style={S.card}>
              <div style={S.label}>🎨 Pilih Warna Kaos</div>
              <ColorPicker warna={warna} setWarna={setWarna}/>
            </div>
          </div>
        )}

        {/* ══ STEP 1: DESAIN ══ */}
        {step === 1 && (
          <div>
            {!opsiDesain && (
              <div>
                <div style={{ fontWeight:900, fontSize:"18px", marginBottom:"4px" }}>Punya Desain?</div>
                <div style={{ ...S.sub, marginBottom:"16px" }}>Pilih cara kamu mau mendesain kaos ini</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {[
                    { id:"upload", icon:"📁", bg:"#0A0A0A", judul:"Punya Desain Sendiri",
                      desc:"Upload file PNG, JPG. Atur posisi desain di area cetak A4." },
                    { id:"brief",  icon:"✏️", bg:"#C8392B", judul:"Belum Punya Desain",
                      desc:"Ceritakan idemu. Tim desainer kami akan bantu wujudkan." },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setOpsiDesain(opt.id)} style={{
                      background:"white", borderRadius:"14px", padding:"18px 16px",
                      border:"2px solid #E5E7EB", cursor:"pointer", textAlign:"left",
                      display:"flex", gap:"14px", alignItems:"center",
                    }}>
                      <div style={{ width:"48px", height:"48px", borderRadius:"12px",
                        background:opt.bg, display:"flex", alignItems:"center",
                        justifyContent:"center", flexShrink:0, fontSize:"22px" }}>{opt.icon}</div>
                      <div>
                        <div style={{ fontWeight:"800", fontSize:"15px", marginBottom:"3px" }}>{opt.judul}</div>
                        <div style={{ fontSize:"12px", color:"#9CA3AF", lineHeight:1.4 }}>{opt.desc}</div>
                      </div>
                      <div style={{ marginLeft:"auto", color:"#9CA3AF", fontSize:"18px" }}>→</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── OPSI A: UPLOAD ── */}
            {opsiDesain === "upload" && (
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
                  <button onClick={() => setOpsiDesain(null)} style={{
                    background:"none", border:"none", cursor:"pointer", fontSize:"20px", padding:0, color:"#9CA3AF" }}>←</button>
                  <div style={{ fontWeight:900, fontSize:"17px" }}>Upload Desain</div>
                  {/* Mini color picker */}
                  <input type="color"
                    value={warna.match(/^#[0-9A-Fa-f]{6}$/) ? warna : "#ffffff"}
                    onChange={e => setWarna(e.target.value)}
                    title="Ubah warna kaos"
                    style={{ marginLeft:"auto", width:"36px", height:"36px", borderRadius:"10px",
                      border:"2px solid #E5E7EB", cursor:"pointer", padding:"2px", background:"white" }}/>
                </div>

                {/* Toggle Depan/Belakang */}
                <div style={{ display:"flex", background:"#E5E7EB", borderRadius:"10px",
                  padding:"3px", marginBottom:"12px", gap:"3px" }}>
                  {AREA_CETAK.map(a => (
                    <button key={a.id} onClick={() => { setSide(a.side); setActiveZona(a.id); handleZonaClick(a.id); }} style={{
                      flex:1, padding:"8px", borderRadius:"8px", border:"none",
                      background: activeZona===a.id ? "white" : "transparent",
                      fontWeight: activeZona===a.id ? "800" : "400",
                      fontSize:"13px", cursor:"pointer",
                    }}>
                      {a.id === "depan" ? "👕 Depan" : "🔄 Belakang"}
                      {uploads[a.id] && <span style={{ marginLeft:"4px", color:"#10B981" }}>✓</span>}
                    </button>
                  ))}
                </div>

                {/* Kanvas mockup + desain — menyatu jadi 1 tampilan, bisa digeser & di-zoom, maks. area A4 */}
                <div style={{ marginBottom:"12px" }}>
                  <div style={{ fontWeight:"700", fontSize:"13px", color:"#374151",
                    marginBottom:"8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span>📐 {uploads[activeZona] ? "Atur Posisi Desain" : `Area Cetak ${activeZona === "depan" ? "Depan" : "Belakang"}`}</span>
                    {uploads[activeZona] && (
                      <div style={{ display:"flex", gap:"6px" }}>
                        <button onClick={() => fileRef.current?.click()} style={{
                          padding:"5px 10px", borderRadius:"8px", border:"2px solid #E5E7EB",
                          background:"white", fontSize:"11px", fontWeight:"700", cursor:"pointer" }}>🔄 Ganti</button>
                        <button onClick={() => hapusUpload(activeZona)} style={{
                          padding:"5px 10px", borderRadius:"8px", border:"2px solid #FCA5A5",
                          background:"#FEF2F2", color:"#C8392B", fontSize:"11px",
                          fontWeight:"700", cursor:"pointer" }}>🗑 Hapus</button>
                      </div>
                    )}
                  </div>
                  <DesignCanvas
                    uploadSrc={uploads[activeZona]}
                    zona={activeZona}
                    warna={warna}
                    produkId={produk.id}
                    side={side}
                    onUploadClick={() => fileRef.current?.click()}
                    onPosisiChange={(zona, p) => setPosisiDesain(prev => ({ ...prev, [zona]: p }))}
                  />
                  <div style={{ fontSize:"10px", color:"#9CA3AF", marginTop:"6px", textAlign:"center" }}>
                    Area cetak maksimal setara ukuran A4 (21×29.7cm)
                  </div>
                </div>

                <input ref={fileRef} type="file" accept="image/*"
                  style={{ display:"none" }} onChange={handleUpload}/>

                {/* Catatan */}
                <div style={S.card}>
                  <div style={{ ...S.label, marginBottom:"6px" }}>
                    Catatan — {activeZona === "depan" ? "Depan" : "Belakang"}
                  </div>
                  <textarea value={catatanInput}
                    onChange={e => setCatatanInput(e.target.value)}
                    onBlur={simpanCatatan}
                    placeholder="Contoh: warna sablon hitam, ukuran 20×20cm..."
                    style={{ width:"100%", minHeight:"60px", borderRadius:"8px",
                      border:"2px solid #E5E7EB", padding:"10px", fontSize:"13px",
                      resize:"none", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}/>
                </div>

                {desainAwal && (
                  <div style={{ background:"#FEF2F2", borderRadius:"10px",
                    padding:"10px 12px", fontSize:"12px", color:"#C8392B", fontWeight:"600", marginBottom:"10px" }}>
                    🎨 Desain dari Karya Instar: "{desainAwal.label}" sudah terpasang. Kamu masih bisa atur posisi atau ganti desain.
                  </div>
                )}

                {uploadCount > 0 && (
                  <div style={{ background:"#ECFDF5", borderRadius:"10px",
                    padding:"10px 12px", fontSize:"12px", color:"#065F46", fontWeight:"600" }}>
                    ✅ {uploadCount} area · Biaya desain: {rp(biayaDesain)}
                  </div>
                )}
              </div>
            )}

            {/* ── OPSI B: BRIEF ── */}
            {opsiDesain === "brief" && (
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
                  <button onClick={() => setOpsiDesain(null)} style={{
                    background:"none", border:"none", cursor:"pointer", fontSize:"20px", padding:0, color:"#9CA3AF" }}>←</button>
                  <div style={{ fontWeight:900, fontSize:"17px" }}>Konsultasi Desainer</div>
                </div>
                <div style={S.card}>
                  <div style={S.label}>Kategori Desain</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"16px" }}>
                    {kategoriTemplate.map(k => (
                      <button key={k.id} onClick={() => setBriefKat(k.id)} style={{
                        padding:"12px 14px", borderRadius:"10px", border:"2px solid",
                        borderColor:briefKat===k.id?"#C8392B":"#E5E7EB",
                        background:briefKat===k.id?"#FEF2F2":"white",
                        cursor:"pointer", textAlign:"left",
                        display:"flex", alignItems:"center", gap:"10px" }}>
                        <span style={{ fontSize:"20px" }}>{k.icon}</span>
                        <span style={{ fontWeight:"700", fontSize:"13px",
                          color:briefKat===k.id?"#C8392B":"#0A0A0A" }}>{k.label}</span>
                        {briefKat===k.id && <span style={{ marginLeft:"auto", color:"#C8392B", fontWeight:"900" }}>✓</span>}
                      </button>
                    ))}
                  </div>
                  {briefKat && (
                    <>
                      <div style={S.label}>Ceritakan Idemu</div>
                      {[{key:"depan",label:"Desain Depan"},{key:"belakang",label:"Desain Belakang"}].map(f => (
                        <div key={f.key} style={{ marginBottom:"10px" }}>
                          <div style={{ fontSize:"12px", fontWeight:"600", color:"#6B7280", marginBottom:"5px" }}>{f.label}</div>
                          <textarea value={briefTeks[f.key]}
                            onChange={e => setBriefTeks(prev => ({...prev,[f.key]:e.target.value}))}
                            placeholder="Contoh: nama kelas, tahun angkatan, tema warna..."
                            style={{ width:"100%", minHeight:"60px", borderRadius:"8px",
                              border:"2px solid #E5E7EB", padding:"10px", fontSize:"13px",
                              resize:"none", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}/>
                        </div>
                      ))}
                      <div style={{ background:"#FEF9C3", borderRadius:"10px", padding:"12px",
                        fontSize:"12px", color:"#854D0E", border:"1px solid #FDE047", lineHeight:1.5 }}>
                        💡 Tim desainer akan menghubungi kamu via WhatsApp dan mengirimkan <strong>Kode Desain</strong> setelah fix.
                      </div>
                    </>
                  )}
                </div>
                <div style={S.card}>
                  <div style={S.label}>Sudah Punya Kode Desain?</div>
                  <div style={{ fontSize:"12px", color:"#9CA3AF", marginBottom:"10px" }}>
                    Masukkan kode yang dikirim desainer via WhatsApp
                  </div>
                  <input value={kodeDesain} onChange={e => setKodeDesain(e.target.value.toUpperCase())}
                    placeholder="INSTAR-XXXX"
                    style={{ width:"100%", borderRadius:"8px", border:"2px solid #E5E7EB",
                      padding:"10px 12px", fontSize:"14px", fontWeight:"700",
                      outline:"none", boxSizing:"border-box",
                      letterSpacing:"2px", fontFamily:"monospace",
                      color:kodeDesain?"#10B981":"#374151" }}/>
                  {kodeDesain && <div style={{ marginTop:"8px", fontSize:"12px", color:"#10B981", fontWeight:"700" }}>✅ Kode desain tersimpan</div>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ STEP 2: UKURAN ══ */}
        {step === 2 && (
          <div>
            <div style={{ fontWeight:900, fontSize:"18px", marginBottom:"4px" }}>Ukuran & Jumlah</div>
            <div style={{ ...S.sub, marginBottom:"16px" }}>Tentukan ukuran dan jumlah pesanan</div>
            <div style={{ display:"flex", background:"#E5E7EB", borderRadius:"10px",
              padding:"3px", marginBottom:"14px", gap:"3px" }}>
              {[["satuan","👕 Satuan"],["massal","📦 Massal"]].map(([m,l]) => (
                <button key={m} onClick={() => setModeUkuran(m)} style={{
                  flex:1, padding:"9px", borderRadius:"8px", border:"none",
                  background:modeUkuran===m?"white":"transparent",
                  fontWeight:modeUkuran===m?"800":"400",
                  fontSize:"13px", cursor:"pointer",
                  boxShadow:modeUkuran===m?"0 1px 4px #00000015":"none" }}>{l}</button>
              ))}
            </div>
            {modeUkuran === "satuan" ? (
              <div style={S.card}>
                <div style={S.label}>Ukuran</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"18px" }}>
                  {ukuranTersedia.map(sz => (
                    <button key={sz} onClick={() => setSatuanSize(sz)} style={{
                      padding:"8px 16px", borderRadius:"10px", border:"2px solid",
                      borderColor:satuanSize===sz?"#C8392B":"#E5E7EB",
                      background:satuanSize===sz?"#FEF2F2":"white",
                      fontWeight:"800", fontSize:"13px", cursor:"pointer",
                      color:satuanSize===sz?"#C8392B":"#0A0A0A" }}>{sz}</button>
                  ))}
                </div>
                <div style={S.label}>Jumlah</div>
                <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                  <button onClick={() => setSatuanQty(q => Math.max(1,q-1))} style={{ width:"38px",height:"38px",borderRadius:"10px",border:"2px solid #E5E7EB",background:"white",fontWeight:"900",fontSize:"20px",cursor:"pointer" }}>−</button>
                  <span style={{ fontWeight:"900",fontSize:"24px",minWidth:"36px",textAlign:"center" }}>{satuanQty}</span>
                  <button onClick={() => setSatuanQty(q => q+1)} style={{ width:"38px",height:"38px",borderRadius:"10px",border:"2px solid #E5E7EB",background:"white",fontWeight:"900",fontSize:"20px",cursor:"pointer" }}>+</button>
                  <span style={{ color:"#9CA3AF",fontSize:"13px" }}>pcs</span>
                </div>
              </div>
            ) : (
              <div style={S.card}>
                <div style={S.label}>Jumlah per Ukuran</div>
                <div style={{ fontSize:"12px",color:"#9CA3AF",marginBottom:"14px" }}>Isi 0 atau kosongkan jika tidak ada</div>
                {ukuranTersedia.map(sz => (
                  <div key={sz} style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px" }}>
                    <div style={{ width:"40px",height:"40px",borderRadius:"8px",background:"#0A0A0A",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"900",fontSize:"13px",flexShrink:0 }}>{sz}</div>
                    <button onClick={() => setMassalQty(p => ({...p,[sz]:Math.max(0,(parseInt(p[sz])||0)-1)}))} style={{ width:"30px",height:"30px",borderRadius:"8px",border:"2px solid #E5E7EB",background:"white",fontWeight:"800",fontSize:"16px",cursor:"pointer" }}>−</button>
                    <input type="number" min="0" value={massalQty[sz]||""} onChange={e => setMassalQty(p => ({...p,[sz]:e.target.value}))} placeholder="0" style={{ width:"54px",textAlign:"center",borderRadius:"8px",border:"2px solid #E5E7EB",padding:"6px",fontSize:"15px",fontWeight:"700",outline:"none" }}/>
                    <button onClick={() => setMassalQty(p => ({...p,[sz]:(parseInt(p[sz])||0)+1}))} style={{ width:"30px",height:"30px",borderRadius:"8px",border:"2px solid #E5E7EB",background:"white",fontWeight:"800",fontSize:"16px",cursor:"pointer" }}>+</button>
                    <span style={{ fontSize:"12px",color:"#9CA3AF" }}>pcs</span>
                  </div>
                ))}
                <div style={{ borderTop:"1px solid #E5E7EB",paddingTop:"12px",marginTop:"4px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <span style={{ fontWeight:"700",fontSize:"14px" }}>Total</span>
                  <span style={{ fontWeight:"900",fontSize:"20px",color:"#C8392B" }}>{totalQty} pcs</span>
                </div>
              </div>
            )}
            {totalQty > 0 && (
              <div style={{ background:"#0A0A0A",borderRadius:"14px",padding:"16px",color:"white" }}>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#9CA3AF",marginBottom:"6px" }}>
                  <span>Harga kaos</span><span>{rp(produk.harga)} × {totalQty}</span>
                </div>
                {biayaDesain > 0 && (
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#9CA3AF",marginBottom:"6px" }}>
                    <span>Biaya desain ({uploadCount} area)</span><span>{rp(biayaDesain)} × {totalQty}</span>
                  </div>
                )}
                <div style={{ display:"flex",justifyContent:"space-between",fontWeight:"900",fontSize:"18px",borderTop:"1px solid #ffffff15",paddingTop:"10px",marginTop:"6px" }}>
                  <span>ESTIMASI</span><span style={{ color:"#C8392B" }}>{rp(totalHarga)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ STEP 3: KONFIRMASI ══ */}
        {step === 3 && (
          <div>
            <div style={{ fontWeight:900,fontSize:"18px",marginBottom:"4px" }}>Konfirmasi</div>
            <div style={{ ...S.sub,marginBottom:"16px" }}>Cek detail sebelum masuk keranjang</div>
            <div style={{ background:"#0A0A0A",borderRadius:"16px",padding:"18px",color:"white",marginBottom:"12px" }}>
              <div style={{ display:"flex",gap:"12px",marginBottom:"14px" }}>
                <PreviewKonfirmasi warna={warna} produk={produk} opsiDesain={opsiDesain} uploads={uploads} posisiDesain={posisiDesain} />
                <div>
                  <div style={{ fontWeight:"800",fontSize:"15px" }}>{produk.nama}</div>
                  <div style={{ color:"#9CA3AF",fontSize:"12px",marginTop:"3px" }}>
                    Warna: {warnaObj.nama} <span style={{ fontFamily:"monospace",fontSize:"10px" }}>({warna})</span>
                  </div>
                  <div style={{ color:"#9CA3AF",fontSize:"12px" }}>
                    Desain: {opsiDesain==="upload"
                      ? `Upload · ${uploadCount} area`
                      : kodeDesain ? `Kode: ${kodeDesain}` : `Brief ke desainer`}
                  </div>
                  <div style={{ color:"#9CA3AF",fontSize:"12px" }}>
                    {modeUkuran==="satuan"
                      ? `Ukuran ${satuanSize} · ${satuanQty} pcs`
                      : `Massal · ${totalQty} pcs`}
                  </div>
                </div>
              </div>
              {modeUkuran==="massal" && (
                <div style={{ borderTop:"1px solid #ffffff15",paddingTop:"12px",marginBottom:"12px" }}>
                  <div style={{ fontSize:"11px",color:"#6B7280",marginBottom:"8px",letterSpacing:"1px" }}>BREAKDOWN UKURAN</div>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:"6px" }}>
                    {ukuranTersedia.filter(sz => parseInt(massalQty[sz])>0).map(sz => (
                      <div key={sz} style={{ background:"#1A1A1A",borderRadius:"6px",padding:"4px 10px",fontSize:"12px",fontWeight:"700" }}>
                        {sz}: {massalQty[sz]} pcs
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ borderTop:"1px solid #ffffff15",paddingTop:"12px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#9CA3AF",marginBottom:"5px" }}>
                  <span>Harga kaos</span><span>{rp(produk.harga)} × {totalQty}</span>
                </div>
                {biayaDesain > 0 && (
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#9CA3AF",marginBottom:"5px" }}>
                    <span>Biaya desain</span><span>{rp(biayaDesain)} × {totalQty}</span>
                  </div>
                )}
                <div style={{ display:"flex",justifyContent:"space-between",fontWeight:"900",fontSize:"17px",borderTop:"1px solid #ffffff15",paddingTop:"10px",marginTop:"6px" }}>
                  <span>TOTAL</span><span style={{ color:"#C8392B" }}>{rp(totalHarga)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── BOTTOM BUTTONS ── */}
      <div style={{ position:"fixed",bottom:0,left:0,right:0,background:"white",
        borderTop:"1px solid #E5E7EB",padding:"14px 16px",display:"flex",gap:"10px",
        maxWidth:"480px",margin:"0 auto" }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s-1)} style={{
            padding:"13px 18px",borderRadius:"12px",border:"2px solid #E5E7EB",
            background:"white",fontWeight:"700",fontSize:"14px",cursor:"pointer",flexShrink:0 }}>← Kembali</button>
        )}
        {step < 3 ? (
          <button onClick={() => setStep(s => s+1)} disabled={!canNext()} style={{
            flex:1,padding:"13px",borderRadius:"12px",border:"none",
            background:canNext()?"#0A0A0A":"#E5E7EB",
            color:canNext()?"white":"#9CA3AF",
            fontWeight:"900",fontSize:"15px",cursor:canNext()?"pointer":"not-allowed" }}>
            {step===0?"Pilih Desain →":step===1?"Pilih Ukuran →":"Konfirmasi →"}
          </button>
        ) : (
          <button onClick={handleTambahKeranjang} style={{
            flex:1,padding:"13px",borderRadius:"12px",border:"none",
            background:"#C8392B",color:"white",fontWeight:"900",fontSize:"15px",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",gap:"8px" }}>
            🛒 Tambah ke Keranjang
          </button>
        )}
      </div>
    </div>
  );
}

