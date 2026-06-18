// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — CUSTOM BUILDER (v3)
//  Mockup: Foto kaos asli PNG + overlay zona CSS
//  Color: CSS filter hue-rotate + saturate untuk ganti warna
// ═══════════════════════════════════════════════════════════

import { useState, useRef } from "react";
import Header from "../components/Header.jsx";
import { warnaKaos, areaCetak, ukuranTersedia, kategoriTemplate } from "../data/products.js";
import config from "../config.js";

const rp = (n) => "Rp " + n.toLocaleString("id-ID");
const STEPS = ["Warna", "Desain", "Ukuran", "Konfirmasi"];

// ── Konversi HEX → HSL untuk CSS filter ─────────────────────
function hexToHsl(hex) {
  let r = parseInt(hex.slice(1,3),16)/255;
  let g = parseInt(hex.slice(3,5),16)/255;
  let b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h=0, s=0, l=(max+min)/2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h=((g-b)/d+(g<b?6:0))/6; break;
      case g: h=((b-r)/d+2)/6; break;
      case b: h=((r-g)/d+4)/6; break;
    }
  }
  return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
}

// Hitung CSS filter untuk ubah warna kaos putih → warna pilihan
function getShirtFilter(hex) {
  if (!hex || hex === "#FFFFFF" || hex === "#ffffff") return "none";
  const { h, s, l } = hexToHsl(hex);
  // Untuk warna gelap (hitam, navy, dll) perlu brightness rendah
  const brightness = l < 20 ? 0.15 : l < 40 ? 0.4 : l / 100;
  const saturate = s < 10 ? 0 : s / 40;
  return `brightness(${brightness}) sepia(1) hue-rotate(${h - 30}deg) saturate(${Math.max(1, saturate * 4)}) brightness(${Math.min(2, brightness + 0.8)})`;
}

// ── MOCKUP dengan foto PNG asli ─────────────────────────────
function MockupFoto({ warna, produkId, activeZone, uploads, onZoneClick, showZones = true, side = "front" }) {
  // Path mockup sesuai produk.id + side (front/back)
  const mockupMap = {
    "lengan-pendek":  { front: "/mockup-pendek.png",  back: "/mockup-pendek-belakang.png"  },
    "lengan-panjang": { front: "/mockup-panjang.png", back: "/mockup-panjang-belakang.png" },
    "rib":            { front: "/mockup-rib.png",     back: "/mockup-rib-belakang.png"     },
  };
  const sideKey     = side === "back" ? "back" : "front";
  const mockupSrc   = mockupMap[produkId]?.[sideKey] || "/mockup-pendek.png";
  const fallbackSrc = "/mockup-pendek.png";

  const shirtFilter = getShirtFilter(warna);

  // Zona area cetak per sisi
  const zonesDepan = {
    "dada":         { top: "26%", left: "36%", width: "26%", height: "16%", label: "Dada Kiri" },
    "depan":        { top: "37%", left: "28%", width: "44%", height: "30%", label: "Badan Depan" },
    "lengan-kiri":  { top: "28%", left: "6%",  width: "20%", height: "24%", label: "Lengan Kiri" },
    "lengan-kanan": { top: "28%", left: "74%", width: "20%", height: "24%", label: "Lengan Kanan" },
  };
  const zonesBelakang = {
    "belakang": { top: "25%", left: "26%", width: "48%", height: "42%", label: "Belakang" },
  };
  const zones = side === "back" ? zonesBelakang : zonesDepan;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "320px", margin: "0 auto" }}>
      {/* Gambar kaos asli + CSS filter untuk warna */}
      <img
        src={mockupSrc}
        onError={e => { e.target.src = fallbackSrc; }}
        alt="mockup kaos"
        style={{
          width: "100%",
          display: "block",
          filter: shirtFilter,
          transition: "filter 0.3s ease",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* Overlay zona cetak */}
      {showZones && Object.entries(zones).map(([zoneId, pos]) => {
        const hasImg  = !!uploads[zoneId];
        const isAktif = activeZone === zoneId;

        return (
          <div key={zoneId}
            onClick={() => onZoneClick(zoneId)}
            style={{
              position: "absolute",
              top: pos.top, left: pos.left,
              width: pos.width, height: pos.height,
              border: `2px ${isAktif ? "solid" : hasImg ? "solid" : "dashed"}`,
              borderColor: isAktif ? "#C8392B" : hasImg ? "#10B981" : "rgba(255,255,255,0.7)",
              borderRadius: "6px",
              background: isAktif ? "rgba(200,57,43,0.12)"
                        : hasImg  ? "rgba(16,185,129,0.08)"
                        : "rgba(255,255,255,0.05)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isAktif ? "0 0 0 3px rgba(200,57,43,0.2)" : "none",
              transition: "all 0.15s",
            }}
          >
            {/* Gambar upload di zona */}
            {hasImg && (
              <img src={uploads[zoneId]} alt="desain"
                style={{
                  width: "90%", height: "90%",
                  objectFit: "contain",
                  borderRadius: "4px",
                  mixBlendMode: "multiply",
                }} />
            )}

            {/* Label zona */}
            {!hasImg && (
              <div style={{
                fontSize: "10px", fontWeight: "800",
                color: isAktif ? "#C8392B" : "rgba(255,255,255,0.9)",
                textAlign: "center", lineHeight: 1.2,
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                padding: "2px",
              }}>
                {isAktif ? "📌 TAP\nUPLOAD" : "+ TAP"}
              </div>
            )}

            {/* Badge centang kalau ada upload */}
            {hasImg && (
              <div style={{
                position: "absolute", top: "-6px", right: "-6px",
                width: "18px", height: "18px", borderRadius: "50%",
                background: "#10B981", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", fontWeight: "800",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}>✓</div>
            )}
          </div>
        );
      })}
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
      {/* Grid warna preset */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
        {warnaKaos.map(w => (
          <button key={w.hex} onClick={() => { setWarna(w.hex); setCustomHex(w.hex); }}
            title={w.nama}
            style={{
              width: "38px", height: "38px", borderRadius: "50%",
              background: w.hex, cursor: "pointer",
              border: "3px solid",
              borderColor: warna === w.hex ? "#C8392B" : w.hex === "#FFFFFF" ? "#D1D5DB" : "transparent",
              boxShadow: warna === w.hex
                ? "0 0 0 3px rgba(200,57,43,0.3), 0 2px 8px rgba(0,0,0,0.2)"
                : "0 2px 6px rgba(0,0,0,0.12)",
              transition: "all 0.15s",
              flexShrink: 0,
            }} />
        ))}

        {/* Tombol custom */}
        <button onClick={() => setShowCustom(s => !s)} title="Warna kustom"
          style={{
            width: "38px", height: "38px", borderRadius: "50%",
            background: isCustom
              ? warna
              : "conic-gradient(#FF6B6B, #FFD93D, #6BCB77, #4D96FF, #C44FFF, #FF6B6B)",
            cursor: "pointer",
            border: "3px solid",
            borderColor: isCustom ? "#C8392B" : "transparent",
            boxShadow: isCustom
              ? "0 0 0 3px rgba(200,57,43,0.3)"
              : "0 2px 6px rgba(0,0,0,0.2)",
            fontSize: isCustom ? "0" : "14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
          {!isCustom && "🎨"}
        </button>
      </div>

      {/* Label warna aktif */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "10px 14px", background: "#F9FAFB",
        borderRadius: "10px", marginBottom: showCustom ? "10px" : "0",
        border: "1px solid #E5E7EB",
      }}>
        <div style={{
          width: "26px", height: "26px", borderRadius: "50%",
          background: warna,
          border: "2px solid " + (warna === "#FFFFFF" ? "#D1D5DB" : "#00000020"),
          flexShrink: 0,
        }} />
        <div>
          <div style={{ fontWeight: "700", fontSize: "13px" }}>
            {isCustom ? "Warna Kustom" : warnaObj?.nama}
          </div>
          <div style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "monospace" }}>
            {warna.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Custom picker panel */}
      {showCustom && (
        <div style={{
          background: "white", border: "2px solid #E5E7EB",
          borderRadius: "12px", padding: "14px",
        }}>
          <div style={{ fontWeight: "700", fontSize: "13px", marginBottom: "12px", color: "#374151" }}>
            🎨 Pilih Warna Kustom
          </div>

          {/* Color wheel + HEX input */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
            <input type="color"
              value={customHex.match(/^#[0-9A-Fa-f]{6}$/) ? customHex : "#000000"}
              onChange={e => { setCustomHex(e.target.value); setWarna(e.target.value); }}
              style={{
                width: "56px", height: "56px", borderRadius: "12px",
                border: "2px solid #E5E7EB", cursor: "pointer",
                padding: "3px", background: "white", flexShrink: 0,
              }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "5px" }}>Kode HEX</div>
              <div style={{ display: "flex", gap: "6px" }}>
                <input value={customHex}
                  onChange={e => setCustomHex(e.target.value)}
                  placeholder="#000000"
                  style={{
                    flex: 1, border: "2px solid #E5E7EB", borderRadius: "8px",
                    padding: "8px 10px", fontSize: "13px", fontWeight: "700",
                    fontFamily: "monospace", outline: "none", letterSpacing: "1px",
                  }} />
                <button onClick={() => {
                  const h = customHex.startsWith("#") ? customHex : "#" + customHex;
                  if (/^#[0-9A-Fa-f]{6}$/.test(h)) { setWarna(h); setCustomHex(h); }
                }} style={{
                  padding: "8px 14px", borderRadius: "8px", border: "none",
                  background: "#0A0A0A", color: "white",
                  fontWeight: "700", fontSize: "12px", cursor: "pointer",
                }}>OK</button>
              </div>
            </div>
          </div>

          {/* Warna populer */}
          <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "8px" }}>Warna Populer</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {[
              "#FF6B6B","#FF8E53","#FFD93D","#6BCB77","#4D96FF",
              "#C44FFF","#FF69B4","#00BCD4","#795548","#607D8B",
              "#1A1A1A","#2C3E50","#8B0000","#006400","#00008B",
            ].map(h => (
              <button key={h} onClick={() => { setWarna(h); setCustomHex(h); }}
                style={{
                  width: "30px", height: "30px", borderRadius: "50%",
                  background: h, border: "2px solid",
                  borderColor: warna === h ? "#C8392B" : "transparent",
                  cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────
export default function CustomBuilder({ produk, onBack, onTambahKeranjang }) {
  const [step,         setStep]         = useState(0);
  const [warna,        setWarna]        = useState("#FFFFFF");
  const [opsiDesain,   setOpsiDesain]   = useState(null);
  const [side,         setSide]         = useState("front");
  const [activeZone,   setActiveZone]   = useState("dada");
  const [uploads,      setUploads]      = useState({});
  const [catatan,      setCatatan]      = useState({});
  const [catatanInput, setCatatanInput] = useState("");
  const [briefKat,     setBriefKat]     = useState(null);
  const [briefTeks,    setBriefTeks]    = useState({ depan: "", belakang: "", lengan: "" });
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
    : Object.values(massalQty).reduce((a,b) => a + (parseInt(b)||0), 0);
  const totalHarga  = (produk.harga + biayaDesain) * totalQty;

  const handleZoneClick = (zone) => {
    setActiveZone(zone);
    setCatatanInput(catatan[zone] || "");
    const z = areaCetak.find(a => a.id === zone);
    if (z) setSide(z.side);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploads(prev => ({ ...prev, [activeZone]: ev.target.result }));
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const hapusUpload = (zone) => {
    setUploads(prev => { const n = {...prev}; delete n[zone]; return n; });
  };

  const simpanCatatan = () => setCatatan(prev => ({ ...prev, [activeZone]: catatanInput }));

  const handleTambahKeranjang = () => {
    onTambahKeranjang({
      id: Date.now(), produk, warna, warnaLabel: warnaObj.nama,
      opsiDesain, uploads, catatan, briefKat, briefTeks, kodeDesain,
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
    card:  { background: "white", borderRadius: "14px", padding: "16px", marginBottom: "12px" },
    label: { fontWeight: "700", fontSize: "13px", color: "#374151", marginBottom: "8px" },
    sub:   { fontSize: "12px", color: "#9CA3AF", marginBottom: "10px" },
  };

  const StepBar = () => (
    <div style={{ background:"white", borderBottom:"1px solid #E5E7EB", padding:"10px 16px" }}>
      <div style={{ display:"flex", alignItems:"center" }}>
        {STEPS.map((s,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", flex: i<STEPS.length-1?1:"none" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"3px" }}>
              <div style={{
                width:"24px", height:"24px", borderRadius:"50%",
                background: i<step?"#0A0A0A":i===step?"#C8392B":"#E5E7EB",
                color: i<=step?"white":"#9CA3AF",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"10px", fontWeight:"800",
              }}>{i<step?"✓":i+1}</div>
              <div style={{
                fontSize:"9px", whiteSpace:"nowrap",
                fontWeight: i===step?"800":"400",
                color: i===step?"#C8392B":i<step?"#374151":"#9CA3AF",
              }}>{s}</div>
            </div>
            {i<STEPS.length-1 && (
              <div style={{
                flex:1, height:"2px", margin:"0 4px", marginBottom:"14px",
                background: i<step?"#0A0A0A":"#E5E7EB",
              }}/>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ background:"#F2F2F0", minHeight:"100vh", paddingBottom:"90px" }}>
      <Header halaman="custom" judul={produk.nama} onBack={onBack} />
      <StepBar />

      <div style={{ padding:"16px", maxWidth:"480px", margin:"0 auto" }}>

        {/* ══ STEP 0: PILIH WARNA ══ */}
        {step === 0 && (
          <div>
            {/* Mockup foto asli */}
            <div style={{
              background: "#F8FAFC",
              borderRadius: "18px", padding: "20px 12px 12px",
              marginBottom: "12px",
              border: "1px solid #E2E8F0",
            }}>
              <MockupFoto
                warna={warna}
                produkId={produk.id}
                activeZone={null}
                uploads={{}}
                onZoneClick={() => {}}
                showZones={false}
              />
              <div style={{
                textAlign:"center", fontSize:"12px", color:"#6B7280",
                marginTop:"10px", display:"flex", alignItems:"center",
                justifyContent:"center", gap:"8px",
              }}>
                <div style={{
                  width:"14px", height:"14px", borderRadius:"50%",
                  background: warna,
                  border:"1px solid " + (warna==="#FFFFFF"?"#D1D5DB":"#00000020"),
                  flexShrink:0,
                }}/>
                <span><strong style={{color:"#0A0A0A"}}>{produk.nama}</strong> · {warnaObj.nama}</span>
              </div>
            </div>

            {/* Color picker */}
            <div style={S.card}>
              <div style={S.label}>🎨 Pilih Warna Kaos</div>
              <ColorPicker warna={warna} setWarna={setWarna} />
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
                    { id:"upload", icon:"📁", bg:"#0A0A0A",
                      judul:"Punya Desain Sendiri",
                      desc:"Upload file PNG, JPG, atau SVG. Letakkan di area yang kamu mau." },
                    { id:"brief", icon:"✏️", bg:"#C8392B",
                      judul:"Belum Punya Desain",
                      desc:"Ceritakan idemu. Tim desainer profesional kami akan bantu wujudkan." },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setOpsiDesain(opt.id)} style={{
                      background:"white", borderRadius:"14px", padding:"18px 16px",
                      border:"2px solid #E5E7EB", cursor:"pointer", textAlign:"left",
                      display:"flex", gap:"14px", alignItems:"center",
                    }}>
                      <div style={{
                        width:"48px", height:"48px", borderRadius:"12px",
                        background:opt.bg, display:"flex", alignItems:"center",
                        justifyContent:"center", flexShrink:0, fontSize:"22px",
                      }}>{opt.icon}</div>
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
                    background:"none", border:"none", cursor:"pointer",
                    fontSize:"20px", padding:0, color:"#9CA3AF",
                  }}>←</button>
                  <div style={{ fontWeight:900, fontSize:"17px" }}>Upload Desain</div>
                </div>

                {/* Toggle front/back */}
                <div style={{
                  display:"flex", background:"#E5E7EB", borderRadius:"10px",
                  padding:"3px", marginBottom:"12px", gap:"3px",
                }}>
                  {[["front","👕 Depan"],["back","🔄 Belakang"]].map(([s,l]) => (
                    <button key={s} onClick={() => setSide(s)} style={{
                      flex:1, padding:"8px", borderRadius:"8px", border:"none",
                      background: side===s?"white":"transparent",
                      fontWeight: side===s?"800":"400",
                      fontSize:"13px", cursor:"pointer",
                    }}>{l}</button>
                  ))}
                </div>

                {/* Mockup foto asli dengan zona */}
                <div style={{
                  background:"#F8FAFC",
                  borderRadius:"18px", padding:"16px 10px 10px",
                  marginBottom:"12px", border:"1px solid #E2E8F0",
                }}>
                  <MockupFoto
                    warna={warna}
                    produkId={produk.id}
                    activeZone={activeZone}
                    uploads={uploads}
                    onZoneClick={handleZoneClick}
                    showZones={true}
                    side={side}
                  />
                  <div style={{ textAlign:"center", fontSize:"11px", color:"#9CA3AF", marginTop:"8px" }}>
                    Tap area putus-putus untuk upload desain
                  </div>
                </div>

                {/* Area pills */}
                <div style={S.card}>
                  <div style={S.label}>Area Cetak</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"7px", marginBottom:"14px" }}>
                    {areaCetak.map(z => (
                      <button key={z.id} onClick={() => handleZoneClick(z.id)} style={{
                        padding:"6px 13px", borderRadius:"20px", border:"2px solid",
                        fontSize:"12px", fontWeight:"600", cursor:"pointer",
                        borderColor: activeZone===z.id?"#C8392B":uploads[z.id]?"#10B981":"#E5E7EB",
                        background: activeZone===z.id?"#FEF2F2":uploads[z.id]?"#ECFDF5":"white",
                        color: activeZone===z.id?"#C8392B":uploads[z.id]?"#065F46":"#374151",
                      }}>
                        {uploads[z.id]?"✓ ":""}{z.label}
                      </button>
                    ))}
                  </div>

                  {/* Upload box */}
                  <div style={{
                    border:"2px dashed",
                    borderColor: uploads[activeZone]?"#10B981":"#E5E7EB",
                    borderRadius:"12px", padding:"16px", textAlign:"center",
                    background: uploads[activeZone]?"#F0FDF4":"#FAFAFA",
                  }}>
                    {uploads[activeZone] ? (
                      <div>
                        <img src={uploads[activeZone]} alt="desain"
                          style={{ maxHeight:"100px", maxWidth:"100%", borderRadius:"8px", marginBottom:"10px" }}/>
                        <div style={{ display:"flex", gap:"8px", justifyContent:"center" }}>
                          <button onClick={() => fileRef.current?.click()} style={{
                            padding:"7px 14px", borderRadius:"8px", border:"2px solid #E5E7EB",
                            background:"white", fontSize:"12px", fontWeight:"700", cursor:"pointer",
                          }}>🔄 Ganti</button>
                          <button onClick={() => hapusUpload(activeZone)} style={{
                            padding:"7px 14px", borderRadius:"8px", border:"2px solid #FCA5A5",
                            background:"#FEF2F2", color:"#C8392B", fontSize:"12px",
                            fontWeight:"700", cursor:"pointer",
                          }}>🗑 Hapus</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize:"28px", marginBottom:"8px" }}>🖼</div>
                        <div style={{ fontWeight:"700", fontSize:"13px", marginBottom:"4px" }}>
                          {areaCetak.find(z => z.id===activeZone)?.label}
                        </div>
                        <div style={{ fontSize:"11px", color:"#9CA3AF", marginBottom:"12px" }}>
                          PNG, JPG, SVG · maks 10MB
                        </div>
                        <button onClick={() => fileRef.current?.click()} style={{
                          padding:"9px 22px", borderRadius:"8px", border:"none",
                          background:"#0A0A0A", color:"white",
                          fontWeight:"800", fontSize:"12px", cursor:"pointer",
                        }}>📁 Pilih File</button>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*"
                      style={{ display:"none" }} onChange={handleUpload}/>
                  </div>

                  {/* Catatan */}
                  <div style={{ marginTop:"12px" }}>
                    <div style={{ ...S.label, marginBottom:"6px" }}>
                      Catatan — {areaCetak.find(z=>z.id===activeZone)?.label}
                    </div>
                    <textarea value={catatanInput}
                      onChange={e => setCatatanInput(e.target.value)}
                      onBlur={simpanCatatan}
                      placeholder="Contoh: posisi logo di tengah, ukuran 10cm..."
                      style={{
                        width:"100%", minHeight:"60px", borderRadius:"8px",
                        border:"2px solid #E5E7EB", padding:"10px",
                        fontSize:"13px", resize:"none", outline:"none",
                        boxSizing:"border-box", fontFamily:"inherit",
                      }}/>
                  </div>

                  {uploadCount > 0 && (
                    <div style={{
                      marginTop:"10px", background:"#ECFDF5", borderRadius:"8px",
                      padding:"10px 12px", fontSize:"12px", color:"#065F46", fontWeight:"600",
                    }}>
                      ✅ {uploadCount} area · Biaya desain: {rp(biayaDesain)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── OPSI B: BRIEF ── */}
            {opsiDesain === "brief" && (
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
                  <button onClick={() => setOpsiDesain(null)} style={{
                    background:"none", border:"none", cursor:"pointer",
                    fontSize:"20px", padding:0, color:"#9CA3AF",
                  }}>←</button>
                  <div style={{ fontWeight:900, fontSize:"17px" }}>Konsultasi Desainer</div>
                </div>
                <div style={S.card}>
                  <div style={S.label}>Kategori Desain</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"16px" }}>
                    {kategoriTemplate.map(k => (
                      <button key={k.id} onClick={() => setBriefKat(k.id)} style={{
                        padding:"12px 14px", borderRadius:"10px", border:"2px solid",
                        borderColor: briefKat===k.id?"#C8392B":"#E5E7EB",
                        background: briefKat===k.id?"#FEF2F2":"white",
                        cursor:"pointer", textAlign:"left",
                        display:"flex", alignItems:"center", gap:"10px",
                      }}>
                        <span style={{ fontSize:"20px" }}>{k.icon}</span>
                        <span style={{ fontWeight:"700", fontSize:"13px",
                          color: briefKat===k.id?"#C8392B":"#0A0A0A" }}>{k.label}</span>
                        {briefKat===k.id && <span style={{ marginLeft:"auto", color:"#C8392B", fontWeight:"900" }}>✓</span>}
                      </button>
                    ))}
                  </div>
                  {briefKat && (
                    <>
                      <div style={S.label}>Ceritakan Idemu</div>
                      {[{key:"depan",label:"Desain Depan"},{key:"belakang",label:"Desain Belakang"},{key:"lengan",label:"Desain Lengan (opsional)"}].map(f=>(
                        <div key={f.key} style={{ marginBottom:"10px" }}>
                          <div style={{ fontSize:"12px", fontWeight:"600", color:"#6B7280", marginBottom:"5px" }}>{f.label}</div>
                          <textarea value={briefTeks[f.key]}
                            onChange={e=>setBriefTeks(prev=>({...prev,[f.key]:e.target.value}))}
                            placeholder="Contoh: nama kelas, tahun angkatan, tema warna..."
                            style={{ width:"100%", minHeight:"60px", borderRadius:"8px",
                              border:"2px solid #E5E7EB", padding:"10px", fontSize:"13px",
                              resize:"none", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}/>
                        </div>
                      ))}
                      <div style={{ background:"#FEF9C3", borderRadius:"10px", padding:"12px",
                        fontSize:"12px", color:"#854D0E", border:"1px solid #FDE047", lineHeight:1.5 }}>
                        💡 Setelah order, tim desainer akan menghubungi kamu via WhatsApp dan mengirimkan <strong>Kode Desain</strong> setelah desain fix.
                      </div>
                    </>
                  )}
                </div>
                <div style={S.card}>
                  <div style={S.label}>Sudah Punya Kode Desain?</div>
                  <div style={{ fontSize:"12px", color:"#9CA3AF", marginBottom:"10px" }}>
                    Masukkan kode yang dikirim desainer via WhatsApp
                  </div>
                  <input value={kodeDesain}
                    onChange={e=>setKodeDesain(e.target.value.toUpperCase())}
                    placeholder="INSTAR-XXXX"
                    style={{ width:"100%", borderRadius:"8px", border:"2px solid #E5E7EB",
                      padding:"10px 12px", fontSize:"14px", fontWeight:"700",
                      outline:"none", boxSizing:"border-box",
                      letterSpacing:"2px", fontFamily:"monospace",
                      color: kodeDesain?"#10B981":"#374151" }}/>
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
              {[["satuan","👕 Satuan"],["massal","📦 Massal"]].map(([m,l])=>(
                <button key={m} onClick={()=>setModeUkuran(m)} style={{
                  flex:1, padding:"9px", borderRadius:"8px", border:"none",
                  background: modeUkuran===m?"white":"transparent",
                  fontWeight: modeUkuran===m?"800":"400",
                  fontSize:"13px", cursor:"pointer",
                  boxShadow: modeUkuran===m?"0 1px 4px #00000015":"none",
                }}>{l}</button>
              ))}
            </div>
            {modeUkuran==="satuan" ? (
              <div style={S.card}>
                <div style={S.label}>Ukuran</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"18px" }}>
                  {ukuranTersedia.map(sz=>(
                    <button key={sz} onClick={()=>setSatuanSize(sz)} style={{
                      padding:"8px 16px", borderRadius:"10px", border:"2px solid",
                      borderColor: satuanSize===sz?"#C8392B":"#E5E7EB",
                      background: satuanSize===sz?"#FEF2F2":"white",
                      fontWeight:"800", fontSize:"13px", cursor:"pointer",
                      color: satuanSize===sz?"#C8392B":"#0A0A0A",
                    }}>{sz}</button>
                  ))}
                </div>
                <div style={S.label}>Jumlah</div>
                <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                  <button onClick={()=>setSatuanQty(q=>Math.max(1,q-1))} style={{ width:"38px",height:"38px",borderRadius:"10px",border:"2px solid #E5E7EB",background:"white",fontWeight:"900",fontSize:"20px",cursor:"pointer" }}>−</button>
                  <span style={{ fontWeight:"900",fontSize:"24px",minWidth:"36px",textAlign:"center" }}>{satuanQty}</span>
                  <button onClick={()=>setSatuanQty(q=>q+1)} style={{ width:"38px",height:"38px",borderRadius:"10px",border:"2px solid #E5E7EB",background:"white",fontWeight:"900",fontSize:"20px",cursor:"pointer" }}>+</button>
                  <span style={{ color:"#9CA3AF",fontSize:"13px" }}>pcs</span>
                </div>
              </div>
            ) : (
              <div style={S.card}>
                <div style={S.label}>Jumlah per Ukuran</div>
                <div style={{ fontSize:"12px",color:"#9CA3AF",marginBottom:"14px" }}>Isi 0 atau kosongkan jika tidak ada</div>
                {ukuranTersedia.map(sz=>(
                  <div key={sz} style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px" }}>
                    <div style={{ width:"40px",height:"40px",borderRadius:"8px",background:"#0A0A0A",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"900",fontSize:"13px",flexShrink:0 }}>{sz}</div>
                    <button onClick={()=>setMassalQty(p=>({...p,[sz]:Math.max(0,(parseInt(p[sz])||0)-1)}))} style={{ width:"30px",height:"30px",borderRadius:"8px",border:"2px solid #E5E7EB",background:"white",fontWeight:"800",fontSize:"16px",cursor:"pointer" }}>−</button>
                    <input type="number" min="0" value={massalQty[sz]||""} onChange={e=>setMassalQty(p=>({...p,[sz]:e.target.value}))} placeholder="0" style={{ width:"54px",textAlign:"center",borderRadius:"8px",border:"2px solid #E5E7EB",padding:"6px",fontSize:"15px",fontWeight:"700",outline:"none" }}/>
                    <button onClick={()=>setMassalQty(p=>({...p,[sz]:(parseInt(p[sz])||0)+1}))} style={{ width:"30px",height:"30px",borderRadius:"8px",border:"2px solid #E5E7EB",background:"white",fontWeight:"800",fontSize:"16px",cursor:"pointer" }}>+</button>
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
                {biayaDesain>0&&<div style={{ display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#9CA3AF",marginBottom:"6px" }}><span>Biaya desain ({uploadCount} area)</span><span>{rp(biayaDesain)} × {totalQty}</span></div>}
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
                <div style={{ width:"56px",height:"64px",borderRadius:"10px",background:warna,border:"2px solid #ffffff20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px",flexShrink:0 }}>👕</div>
                <div>
                  <div style={{ fontWeight:"800",fontSize:"15px" }}>{produk.nama}</div>
                  <div style={{ color:"#9CA3AF",fontSize:"12px",marginTop:"3px" }}>Warna: {warnaObj.nama} <span style={{ fontFamily:"monospace",fontSize:"10px" }}>({warna})</span></div>
                  <div style={{ color:"#9CA3AF",fontSize:"12px" }}>Desain: {opsiDesain==="upload"?`Upload · ${uploadCount} area`:kodeDesain?`Kode: ${kodeDesain}`:`Brief ke desainer`}</div>
                  <div style={{ color:"#9CA3AF",fontSize:"12px" }}>{modeUkuran==="satuan"?`Ukuran ${satuanSize} · ${satuanQty} pcs`:`Massal · ${totalQty} pcs`}</div>
                </div>
              </div>
              {modeUkuran==="massal"&&(
                <div style={{ borderTop:"1px solid #ffffff15",paddingTop:"12px",marginBottom:"12px" }}>
                  <div style={{ fontSize:"11px",color:"#6B7280",marginBottom:"8px",letterSpacing:"1px" }}>BREAKDOWN UKURAN</div>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:"6px" }}>
                    {ukuranTersedia.filter(sz=>parseInt(massalQty[sz])>0).map(sz=>(
                      <div key={sz} style={{ background:"#1A1A1A",borderRadius:"6px",padding:"4px 10px",fontSize:"12px",fontWeight:"700" }}>{sz}: {massalQty[sz]} pcs</div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ borderTop:"1px solid #ffffff15",paddingTop:"12px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#9CA3AF",marginBottom:"5px" }}><span>Harga kaos</span><span>{rp(produk.harga)} × {totalQty}</span></div>
                {biayaDesain>0&&<div style={{ display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#9CA3AF",marginBottom:"5px" }}><span>Biaya desain</span><span>{rp(biayaDesain)} × {totalQty}</span></div>}
                <div style={{ display:"flex",justifyContent:"space-between",fontWeight:"900",fontSize:"17px",borderTop:"1px solid #ffffff15",paddingTop:"10px",marginTop:"6px" }}>
                  <span>TOTAL</span><span style={{ color:"#C8392B" }}>{rp(totalHarga)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── BOTTOM BUTTONS ── */}
      <div style={{ position:"fixed",bottom:0,left:0,right:0,background:"white",borderTop:"1px solid #E5E7EB",padding:"14px 16px",display:"flex",gap:"10px",maxWidth:"480px",margin:"0 auto" }}>
        {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{ padding:"13px 18px",borderRadius:"12px",border:"2px solid #E5E7EB",background:"white",fontWeight:"700",fontSize:"14px",cursor:"pointer",flexShrink:0 }}>← Kembali</button>}
        {step<3?(
          <button onClick={()=>setStep(s=>s+1)} disabled={!canNext()} style={{ flex:1,padding:"13px",borderRadius:"12px",border:"none",background:canNext()?"#0A0A0A":"#E5E7EB",color:canNext()?"white":"#9CA3AF",fontWeight:"900",fontSize:"15px",cursor:canNext()?"pointer":"not-allowed" }}>
            {step===0?"Pilih Desain →":step===1?"Pilih Ukuran →":"Konfirmasi →"}
          </button>
        ):(
          <button onClick={handleTambahKeranjang} style={{ flex:1,padding:"13px",borderRadius:"12px",border:"none",background:"#C8392B",color:"white",fontWeight:"900",fontSize:"15px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px" }}>
            🛒 Tambah ke Keranjang
          </button>
        )}
      </div>
    </div>
  );
}

