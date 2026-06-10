import { useState, useRef } from "react";

// ── WHATSAPP NUMBER — ganti dengan nomor WA admin ──
const WA_NUMBER = "6281230220456"; //

// ── REAL INSTAR LOGO ──────────────────────────────────────────────────────
const InstarLogo = ({ size = 40, white = false }) => {
  const c = white ? "#FFFFFF" : "#0A0A0A";
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 220 200" fill="none">
      {/* dot */}
      <circle cx="72" cy="38" r="13" fill={c} />
      {/* S-curve body */}
      <path
        d="M52 68 Q18 52 28 88 Q38 124 80 118 Q122 112 148 132 Q174 152 158 178 Q142 198 108 192 Q74 186 52 162"
        stroke={c} strokeWidth="20" strokeLinecap="round" fill="none"
      />
      {/* inner highlight */}
      <path
        d="M58 78 Q86 62 116 76 Q146 90 148 124"
        stroke={white ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.9)"}
        strokeWidth="5" strokeLinecap="round" fill="none"
      />
      {/* lightning bolt */}
      <path d="M138 100 L124 126 L134 126 L120 154 L142 118 L130 118 Z" fill={c} />
    </svg>
  );
};

// ── T-SHIRT MOCKUP SVG ────────────────────────────────────────────────────
const TShirtMockup = ({ color, type, activeZone, uploadedImages, side, onZoneClick }) => {
  const isSweater = type === "sweater";
  const isLong = type === "lengan-panjang";
  const isRib = type === "rib";
  const sc = color || "#FFFFFF";
  const border = sc === "#FFFFFF" || sc === "#F5F5DC" ? "#D1D5DB" : darken(sc, 30);

  const zoneActive = (z) => activeZone === z;
  const zoneHasImg = (z) => !!uploadedImages[z];

  const zoneRect = (zone, x, y, w, h, rx = 8) => (
    <g key={zone} onClick={() => onZoneClick(zone)} style={{ cursor: "pointer" }}>
      <rect x={x} y={y} width={w} height={h} rx={rx}
        fill={zoneHasImg(zone) ? "transparent" : zoneActive(zone) ? "#C8392B18" : "transparent"}
        stroke={zoneActive(zone) ? "#C8392B" : zoneHasImg(zone) ? "#10B981" : "transparent"}
        strokeWidth="2.5" strokeDasharray={zoneActive(zone) ? "6 3" : "none"}
      />
      {zoneHasImg(zone) ? (
        <image href={uploadedImages[zone]} x={x + 2} y={y + 2} width={w - 4} height={h - 4}
          preserveAspectRatio="xMidYMid meet" style={{ borderRadius: rx }} clipPath={`url(#clip-${zone})`} />
      ) : zoneActive(zone) ? (
        <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="10" fill="#C8392B" fontWeight="700">
          + TAP
        </text>
      ) : null}
      {zoneHasImg(zone) && (
        <circle cx={x + w - 6} cy={y + 6} r="7" fill="#10B981" />
      )}
    </g>
  );

  const zoneEllipse = (zone, cx, cy, rx2, ry2, rotate = 0) => (
    <g key={zone} onClick={() => onZoneClick(zone)} style={{ cursor: "pointer" }}>
      <ellipse cx={cx} cy={cy} rx={rx2} ry={ry2}
        transform={rotate ? `rotate(${rotate} ${cx} ${cy})` : ""}
        fill={zoneHasImg(zone) ? "transparent" : zoneActive(zone) ? "#C8392B18" : "transparent"}
        stroke={zoneActive(zone) ? "#C8392B" : zoneHasImg(zone) ? "#10B981" : "transparent"}
        strokeWidth="2.5" strokeDasharray={zoneActive(zone) ? "6 3" : "none"}
      />
      {zoneActive(zone) && !zoneHasImg(zone) && (
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="8" fill="#C8392B" fontWeight="700">+</text>
      )}
      {zoneHasImg(zone) && <circle cx={cx + rx2 - 4} cy={cy - ry2 + 4} r="6" fill="#10B981" />}
    </g>
  );

  return (
    <svg viewBox="0 0 320 360" style={{ width: "100%", maxWidth: "300px", display: "block", margin: "0 auto", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18))" }}>
      <defs>
        {["depan","belakang","dada","lengan-kiri","lengan-kanan"].map(z => (
          <clipPath key={z} id={`clip-${z}`}>
            {z === "lengan-kiri" ? <ellipse cx="46" cy="88" rx="22" ry="28" transform="rotate(-12 46 88)" /> :
             z === "lengan-kanan" ? <ellipse cx="274" cy="88" rx="22" ry="28" transform="rotate(12 274 88)" /> :
             z === "dada" ? <rect x="88" y="82" width="56" height="54" rx="8" /> :
             z === "depan" ? <rect x="94" y="148" width="132" height="110" rx="8" /> :
             <rect x="94" y="82" width="132" height="168" rx="8" />}
          </clipPath>
        ))}
      </defs>

      {/* ── DROP SHADOW ── */}
      <ellipse cx="160" cy="352" rx="90" ry="9" fill="#00000012" />

      {/* ── SHIRT BODY ── */}
      {isSweater || isLong ? (
        <path
          d={`M62 62 L14 96 L38 118 L66 96 L66 ${isSweater ? "308" : "292"} L254 ${isSweater ? "308" : "292"} L254 96 L282 118 L306 96 L258 62 Q226 48 200 ${isSweater ? "54" : "46"} Q182 ${isSweater ? "70" : "64"} 160 ${isSweater ? "74" : "66"} Q138 ${isSweater ? "70" : "64"} 120 ${isSweater ? "54" : "46"} Q94 48 62 62Z`}
          fill={sc} stroke={border} strokeWidth="1.5"
        />
      ) : (
        <path
          d="M68 62 L14 94 L36 116 L68 96 L68 292 L252 292 L252 96 L284 116 L306 94 L252 62 Q222 48 200 46 Q182 62 160 65 Q138 62 120 46 Q98 48 68 62Z"
          fill={sc} stroke={border} strokeWidth="1.5"
        />
      )}

      {/* ── FABRIC TEXTURE (subtle) ── */}
      {isRib && [110, 140, 170, 200, 230, 260].map(y => (
        <line key={y} x1="70" y1={y} x2="250" y2={y} stroke={border} strokeWidth="1" opacity="0.3" />
      ))}

      {/* ── COLLAR ── */}
      {isSweater ? (
        <path d="M120 54 Q160 78 200 54 Q184 88 160 92 Q136 88 120 54Z" fill={sc} stroke={border} strokeWidth="1.5" />
      ) : (
        <path d="M122 46 Q160 70 198 46 Q182 78 160 82 Q138 78 122 46Z" fill={sc} stroke={border} strokeWidth="1.5" />
      )}

      {/* ── SLEEVE DETAILS (long/sweater) ── */}
      {(isSweater || isLong) && (
        <>
          <line x1="66" y1="96" x2="38" y2="118" stroke={border} strokeWidth="1" opacity="0.5" />
          <line x1="254" y1="96" x2="282" y2="118" stroke={border} strokeWidth="1" opacity="0.5" />
        </>
      )}
      {isSweater && (
        <>
          <rect x="14" y="108" width="28" height="14" rx="5" fill={sc} stroke={border} strokeWidth="1.5" />
          <rect x="278" y="108" width="28" height="14" rx="5" fill={sc} stroke={border} strokeWidth="1.5" />
          <rect x="68" y="296" width="184" height="16" rx="5" fill={sc} stroke={border} strokeWidth="1.5" />
        </>
      )}

      {/* ── SEAM LINES ── */}
      <line x1="160" y1={isSweater ? "74" : "66"} x2="160" y2={isSweater ? "296" : "292"} stroke={border} strokeWidth="0.8" opacity="0.25" strokeDasharray="4 4" />

      {/* ── INTERACTIVE ZONES ── */}
      {side === "front" && (
        <>
          {zoneEllipse("lengan-kiri", 46, 88, 22, 28, -12)}
          {zoneEllipse("lengan-kanan", 274, 88, 22, 28, 12)}
          {zoneRect("dada", 88, 82, 56, 54)}
          {zoneRect("depan", 94, 148, 132, 110)}
        </>
      )}
      {side === "back" && zoneRect("belakang", 94, 82, 132, 168)}
    </svg>
  );
};

// darken helper
function darken(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (n >> 16) - amt);
  const g = Math.max(0, ((n >> 8) & 0xff) - amt);
  const b = Math.max(0, (n & 0xff) - amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// ── DATA ─────────────────────────────────────────────────────────────────
const COLORS = [
  { name: "Putih", hex: "#FFFFFF" }, { name: "Hitam", hex: "#1A1A1A" },
  { name: "Abu-abu", hex: "#9CA3AF" }, { name: "Navy", hex: "#1E3A5F" },
  { name: "Merah", hex: "#C8392B" }, { name: "Maroon", hex: "#6B2737" },
  { name: "Olive", hex: "#6B7040" }, { name: "Krem", hex: "#F5F5DC" },
  { name: "Biru", hex: "#3B82F6" }, { name: "Hijau", hex: "#10B981" },
  { name: "Kuning", hex: "#F59E0B" }, { name: "Pink", hex: "#EC4899" },
  { name: "Ungu", hex: "#7C3AED" }, { name: "Cokelat", hex: "#92400E" },
];

const PRODUCTS = [
  { id: "pendek", label: "Kaos Lengan Pendek", price: 95000 },
  { id: "lengan-panjang", label: "Kaos Lengan Panjang", price: 145000 },
  { id: "rib", label: "Kaos Rib", price: 120000 },
  { id: "sweater", label: "Sweater", price: 185000 },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const ZONES_FRONT = [
  { id: "dada", label: "Dada Kiri" },
  { id: "depan", label: "Depan Tengah" },
  { id: "lengan-kiri", label: "Lengan Kiri" },
  { id: "lengan-kanan", label: "Lengan Kanan" },
];
const ZONES_BACK = [{ id: "belakang", label: "Belakang" }];
const ALL_ZONES = [...ZONES_FRONT, ...ZONES_BACK];

const STEPS = ["Produk", "Desain", "Ukuran", "Pesan"];

// ── FORMAT RUPIAH ─────────────────────────────────────────────────────────
const rp = (n) => "Rp " + n.toLocaleString("id-ID");

// ── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [productId, setProductId] = useState(null);
  const [color, setColor] = useState("#FFFFFF");
  const [side, setSide] = useState("front");
  const [activeZone, setActiveZone] = useState("depan");
  const [uploadedImages, setUploadedImages] = useState({});
  const [zoneNotes, setZoneNotes] = useState({});
  const [activeNote, setActiveNote] = useState("");
  const [sizes, setSizes] = useState({});       // { S: 0, M: 0, ... }
  const [orderMode, setOrderMode] = useState("massal"); // "massal" | "satuan"
  const [satuanQty, setSatuanQty] = useState(1);
  const [satuanSize, setSatuanSize] = useState("M");
  const [customerName, setCustomerName] = useState("");
  const [customerWA, setCustomerWA] = useState("");
  const [payMethod, setPayMethod] = useState(null);
  const [orderId] = useState("IA-" + Math.floor(100000 + Math.random() * 900000));

  const fileInputRef = useRef(null);

  const product = PRODUCTS.find(p => p.id === productId);
  const activeColor = COLORS.find(c => c.hex === color) || COLORS[0];
  const designCount = Object.values(uploadedImages).filter(Boolean).length;
  const designFee = designCount * 25000;

  // total qty
  const totalQty = orderMode === "satuan"
    ? satuanQty
    : Object.values(sizes).reduce((a, b) => a + (parseInt(b) || 0), 0);

  const basePrice = product?.price || 0;
  const total = (basePrice + designFee) * totalQty;

  const handleZoneClick = (zone) => {
    setActiveZone(zone);
    setActiveNote(zoneNotes[zone] || "");
    const z = ALL_ZONES.find(z => z.id === zone);
    if (z && ZONES_BACK.find(b => b.id === zone)) setSide("back");
    else setSide("front");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImages(prev => ({ ...prev, [activeZone]: ev.target.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeImage = (zone) => {
    setUploadedImages(prev => { const n = { ...prev }; delete n[zone]; return n; });
  };

  const saveNote = () => {
    setZoneNotes(prev => ({ ...prev, [activeZone]: activeNote }));
  };

  const canNext = () => {
    if (step === 0) return !!productId;
    if (step === 1) return true;
    if (step === 2) return totalQty > 0;
    if (step === 3) return !!customerName && !!customerWA && !!payMethod;
    return false;
  };

  // ── BUILD WHATSAPP MESSAGE ────────────────────────────────────────────
  const buildWAMessage = () => {
    const lines = [];
    lines.push("🧾 *PESANAN CUSTOM — INSTAR APPAREL*");
    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push(`📋 *ID Pesanan:* ${orderId}`);
    lines.push(`👤 *Nama:* ${customerName}`);
    lines.push(`📞 *WA:* ${customerWA}`);
    lines.push("");
    lines.push(`👕 *Produk:* ${product?.label}`);
    lines.push(`🎨 *Warna:* ${activeColor.name}`);
    lines.push("");

    if (orderMode === "satuan") {
      lines.push(`📦 *Mode:* Satuan`);
      lines.push(`📏 *Ukuran:* ${satuanSize} × ${satuanQty} pcs`);
    } else {
      lines.push(`📦 *Mode:* Massal`);
      const sizeList = SIZES.map(s => {
        const q = parseInt(sizes[s]) || 0;
        return q > 0 ? `  ${s}: ${q} pcs` : null;
      }).filter(Boolean);
      sizeList.forEach(l => lines.push(l));
    }

    lines.push(`📦 *Total:* ${totalQty} pcs`);
    lines.push("");

    if (designCount > 0) {
      lines.push(`🖼 *Area Desain (${designCount} area):*`);
      ALL_ZONES.forEach(z => {
        if (uploadedImages[z.id]) {
          const note = zoneNotes[z.id] ? ` — ${zoneNotes[z.id]}` : "";
          lines.push(`  ✅ ${z.label}${note} _(gambar dilampirkan)_`);
        }
      });
      lines.push("");
    }

    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push(`💰 *Harga kaos:* ${rp(basePrice)} × ${totalQty} pcs`);
    if (designFee > 0) lines.push(`🖼 *Biaya desain:* ${rp(designFee)} × ${totalQty} pcs`);
    lines.push(`💳 *TOTAL: ${rp(total)}*`);
    lines.push(`💳 *Pembayaran:* ${payMethod}`);
    lines.push("");
    lines.push("_Mohon lampirkan file gambar desain setelah mengirim pesan ini. Terima kasih!_ 🙏");

    return encodeURIComponent(lines.join("\n"));
  };

  const handleOrder = () => {
    const msg = buildWAMessage();
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
    setStep(4);
  };

  // ── UI HELPERS ────────────────────────────────────────────────────────
  const S = {
    card: { background: "white", borderRadius: "14px", padding: "16px", marginBottom: "14px" },
    label: { fontWeight: "700", fontSize: "13px", color: "#374151", marginBottom: "8px" },
    sub: { fontSize: "12px", color: "#9CA3AF", marginBottom: "10px" },
    input: { width: "100%", borderRadius: "8px", border: "2px solid #E5E7EB", padding: "10px 12px", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#F2F2F0", minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "#0A0A0A", color: "white", padding: "12px 18px", display: "flex", alignItems: "center", gap: "10px", position: "sticky", top: 0, zIndex: 100 }}>
        <InstarLogo size={38} white />
        <div style={{ marginLeft: "2px" }}>
          <div style={{ fontWeight: 900, fontSize: "17px", letterSpacing: "3px", lineHeight: 1 }}>INSTAR</div>
          <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#6B7280", lineHeight: 1, marginTop: "2px" }}>APPAREL</div>
        </div>
        <div style={{ marginLeft: "auto", background: "#C8392B", color: "white", fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "20px" }}>
          Custom Order
        </div>
      </div>

      {/* ── PROGRESS ── */}
      {step < 4 && (
        <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "10px 18px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                  <div style={{
                    width: "26px", height: "26px", borderRadius: "50%",
                    background: i < step ? "#0A0A0A" : i === step ? "#C8392B" : "#E5E7EB",
                    color: i <= step ? "white" : "#9CA3AF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: "800",
                  }}>{i < step ? "✓" : i + 1}</div>
                  <div style={{ fontSize: "9px", fontWeight: i === step ? "800" : "400", color: i === step ? "#C8392B" : i < step ? "#374151" : "#9CA3AF", whiteSpace: "nowrap" }}>{s}</div>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: "2px", background: i < step ? "#0A0A0A" : "#E5E7EB", margin: "0 5px", marginBottom: "14px" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CONTENT ── */}
      <div style={{ padding: "18px 16px", maxWidth: "480px", margin: "0 auto", paddingBottom: "110px" }}>

        {/* ═══ STEP 0: PILIH PRODUK ═══ */}
        {step === 0 && (
          <div>
            <h2 style={{ fontWeight: 900, fontSize: "21px", marginBottom: "4px" }}>Pilih Produk</h2>
            <p style={S.sub}>Jenis kaos yang akan di-custom</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "18px" }}>
              {PRODUCTS.map(p => (
                <button key={p.id} onClick={() => setProductId(p.id)} style={{
                  padding: "0", borderRadius: "14px", border: "2.5px solid",
                  borderColor: productId === p.id ? "#C8392B" : "#E5E7EB",
                  background: productId === p.id ? "#FEF2F2" : "white",
                  cursor: "pointer", overflow: "hidden", textAlign: "center"
                }}>
                  {/* mockup preview mini */}
                  <div style={{ background: productId === p.id ? "#FEF2F2" : "#F9FAFB", padding: "14px 10px 6px" }}>
                    <MiniMockup type={p.id} color={color} />
                  </div>
                  <div style={{ padding: "8px 8px 12px" }}>
                    <div style={{ fontWeight: "800", fontSize: "12px", color: productId === p.id ? "#C8392B" : "#0A0A0A", lineHeight: 1.3 }}>{p.label}</div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "3px" }}>{rp(p.price)}</div>
                  </div>
                </button>
              ))}
            </div>

            <div style={S.card}>
              <div style={S.label}>Pilih Warna</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "10px" }}>
                {COLORS.map(c => (
                  <button key={c.hex} onClick={() => setColor(c.hex)} title={c.name} style={{
                    width: "32px", height: "32px", borderRadius: "50%", background: c.hex,
                    border: "3px solid", cursor: "pointer",
                    borderColor: color === c.hex ? "#C8392B" : c.hex === "#FFFFFF" ? "#D1D5DB" : "transparent",
                    boxShadow: color === c.hex ? "0 0 0 2px #C8392B50" : "none",
                  }} />
                ))}
              </div>
              <div style={{ fontSize: "13px", color: "#6B7280" }}>
                Dipilih: <strong style={{ color: "#0A0A0A" }}>{activeColor.name}</strong>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 1: DESAIN ═══ */}
        {step === 1 && (
          <div>
            <h2 style={{ fontWeight: 900, fontSize: "21px", marginBottom: "4px" }}>Upload Desain</h2>
            <p style={S.sub}>Pilih area → upload gambar desain kamu</p>

            {/* Toggle front/back */}
            <div style={{ display: "flex", background: "#E5E7EB", borderRadius: "10px", padding: "3px", marginBottom: "14px", gap: "3px" }}>
              {[["front", "👕 Tampak Depan"], ["back", "🔄 Tampak Belakang"]].map(([s, l]) => (
                <button key={s} onClick={() => setSide(s)} style={{
                  flex: 1, padding: "8px", borderRadius: "8px", border: "none",
                  background: side === s ? "white" : "transparent",
                  fontWeight: side === s ? "800" : "400", fontSize: "13px", cursor: "pointer",
                  boxShadow: side === s ? "0 1px 4px #00000015" : "none",
                }}>{l}</button>
              ))}
            </div>

            {/* Mockup */}
            <div style={{ background: "white", borderRadius: "16px", padding: "20px 16px 12px", marginBottom: "14px" }}>
              <TShirtMockup
                color={color} type={productId}
                activeZone={activeZone}
                uploadedImages={uploadedImages}
                side={side}
                onZoneClick={handleZoneClick}
              />
              <div style={{ textAlign: "center", fontSize: "11px", color: "#9CA3AF", marginTop: "8px" }}>
                {product?.label} · {activeColor.name} · Tap area untuk upload desain
              </div>
            </div>

            {/* Zone pills */}
            <div style={S.card}>
              <div style={S.label}>Pilih Area</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "14px" }}>
                {ALL_ZONES.map(z => (
                  <button key={z.id} onClick={() => handleZoneClick(z.id)} style={{
                    padding: "6px 13px", borderRadius: "20px", border: "2px solid", fontSize: "12px", fontWeight: "600", cursor: "pointer",
                    borderColor: activeZone === z.id ? "#C8392B" : uploadedImages[z.id] ? "#10B981" : "#E5E7EB",
                    background: activeZone === z.id ? "#FEF2F2" : uploadedImages[z.id] ? "#ECFDF5" : "white",
                    color: activeZone === z.id ? "#C8392B" : uploadedImages[z.id] ? "#065F46" : "#374151",
                  }}>
                    {uploadedImages[z.id] ? "✓ " : ""}{z.label}
                  </button>
                ))}
              </div>

              {/* Upload area */}
              <div style={{ border: "2px dashed", borderColor: uploadedImages[activeZone] ? "#10B981" : "#E5E7EB", borderRadius: "12px", padding: "16px", textAlign: "center", background: uploadedImages[activeZone] ? "#F0FDF4" : "#FAFAFA" }}>
                {uploadedImages[activeZone] ? (
                  <div>
                    <img src={uploadedImages[activeZone]} alt="desain" style={{ maxHeight: "120px", maxWidth: "100%", borderRadius: "8px", marginBottom: "10px" }} />
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button onClick={() => fileInputRef.current?.click()} style={{ padding: "7px 14px", borderRadius: "8px", border: "2px solid #E5E7EB", background: "white", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                        🔄 Ganti
                      </button>
                      <button onClick={() => removeImage(activeZone)} style={{ padding: "7px 14px", borderRadius: "8px", border: "2px solid #FCA5A5", background: "#FEF2F2", color: "#C8392B", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                        🗑 Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>🖼</div>
                    <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "4px" }}>
                      Upload Desain — {ALL_ZONES.find(z => z.id === activeZone)?.label}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "12px" }}>PNG, JPG, SVG (maks. 10MB)</div>
                    <button onClick={() => fileInputRef.current?.click()} style={{
                      padding: "10px 24px", borderRadius: "10px", border: "none",
                      background: "#C8392B", color: "white", fontWeight: "800", fontSize: "13px", cursor: "pointer"
                    }}>
                      📁 Pilih File
                    </button>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
              </div>

              {/* Catatan */}
              <div style={{ marginTop: "12px" }}>
                <div style={{ ...S.label, marginBottom: "6px" }}>Catatan desain (opsional)</div>
                <textarea
                  value={activeNote}
                  onChange={e => setActiveNote(e.target.value)}
                  onBlur={saveNote}
                  placeholder="Contoh: warna desain disesuaikan background, ukuran logo 10cm..."
                  style={{ ...S.input, minHeight: "64px", resize: "none" }}
                />
              </div>
            </div>

            {designCount > 0 && (
              <div style={{ background: "#ECFDF5", borderRadius: "10px", padding: "12px 14px", fontSize: "13px", color: "#065F46", fontWeight: "600" }}>
                ✅ {designCount} area sudah ada desain · Biaya: {rp(designFee * totalQty || designFee)}
              </div>
            )}
          </div>
        )}

        {/* ═══ STEP 2: UKURAN ═══ */}
        {step === 2 && (
          <div>
            <h2 style={{ fontWeight: 900, fontSize: "21px", marginBottom: "4px" }}>Ukuran & Jumlah</h2>
            <p style={S.sub}>Tentukan ukuran dan jumlah pesanan</p>

            {/* Mode toggle */}
            <div style={{ display: "flex", background: "#E5E7EB", borderRadius: "10px", padding: "3px", marginBottom: "16px", gap: "3px" }}>
              {[["massal", "📦 Massal (per ukuran)"], ["satuan", "👕 Satuan"]].map(([m, l]) => (
                <button key={m} onClick={() => setOrderMode(m)} style={{
                  flex: 1, padding: "9px", borderRadius: "8px", border: "none",
                  background: orderMode === m ? "white" : "transparent",
                  fontWeight: orderMode === m ? "800" : "400", fontSize: "12px", cursor: "pointer",
                  boxShadow: orderMode === m ? "0 1px 4px #00000015" : "none",
                }}>{l}</button>
              ))}
            </div>

            {orderMode === "massal" ? (
              <div style={S.card}>
                <div style={S.label}>Jumlah per Ukuran</div>
                <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "14px" }}>Isi 0 jika tidak ada ukuran tersebut</div>
                {SIZES.map(sz => (
                  <div key={sz} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "8px", background: "#0A0A0A", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "13px", flexShrink: 0 }}>{sz}</div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
                      <button onClick={() => setSizes(prev => ({ ...prev, [sz]: Math.max(0, (parseInt(prev[sz]) || 0) - 1) }))}
                        style={{ width: "32px", height: "32px", borderRadius: "8px", border: "2px solid #E5E7EB", background: "white", fontWeight: "800", fontSize: "16px", cursor: "pointer", flexShrink: 0 }}>−</button>
                      <input
                        type="number" min="0"
                        value={sizes[sz] || ""}
                        onChange={e => setSizes(prev => ({ ...prev, [sz]: e.target.value }))}
                        placeholder="0"
                        style={{ width: "60px", textAlign: "center", borderRadius: "8px", border: "2px solid #E5E7EB", padding: "6px", fontSize: "15px", fontWeight: "700", outline: "none" }}
                      />
                      <button onClick={() => setSizes(prev => ({ ...prev, [sz]: (parseInt(prev[sz]) || 0) + 1 }))}
                        style={{ width: "32px", height: "32px", borderRadius: "8px", border: "2px solid #E5E7EB", background: "white", fontWeight: "800", fontSize: "16px", cursor: "pointer", flexShrink: 0 }}>+</button>
                      <span style={{ fontSize: "12px", color: "#9CA3AF" }}>pcs</span>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "12px", marginTop: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "700", fontSize: "14px" }}>Total</span>
                  <span style={{ fontWeight: "900", fontSize: "20px", color: "#C8392B" }}>{totalQty} pcs</span>
                </div>
              </div>
            ) : (
              <div style={S.card}>
                <div style={S.label}>Ukuran</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "18px" }}>
                  {SIZES.map(sz => (
                    <button key={sz} onClick={() => setSatuanSize(sz)} style={{
                      padding: "8px 16px", borderRadius: "10px", border: "2px solid",
                      borderColor: satuanSize === sz ? "#C8392B" : "#E5E7EB",
                      background: satuanSize === sz ? "#FEF2F2" : "white",
                      fontWeight: "800", fontSize: "13px", cursor: "pointer",
                      color: satuanSize === sz ? "#C8392B" : "#0A0A0A",
                    }}>{sz}</button>
                  ))}
                </div>
                <div style={S.label}>Jumlah</div>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <button onClick={() => setSatuanQty(q => Math.max(1, q - 1))} style={{ width: "38px", height: "38px", borderRadius: "10px", border: "2px solid #E5E7EB", background: "white", fontWeight: "900", fontSize: "20px", cursor: "pointer" }}>−</button>
                  <span style={{ fontWeight: "900", fontSize: "24px", minWidth: "36px", textAlign: "center" }}>{satuanQty}</span>
                  <button onClick={() => setSatuanQty(q => q + 1)} style={{ width: "38px", height: "38px", borderRadius: "10px", border: "2px solid #E5E7EB", background: "white", fontWeight: "900", fontSize: "20px", cursor: "pointer" }}>+</button>
                  <span style={{ color: "#9CA3AF", fontSize: "13px" }}>pcs</span>
                </div>
              </div>
            )}

            {/* Price preview */}
            {totalQty > 0 && (
              <div style={{ background: "#0A0A0A", borderRadius: "14px", padding: "16px", color: "white" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#9CA3AF", marginBottom: "6px" }}>
                  <span>Harga kaos</span><span>{rp(basePrice)} × {totalQty}</span>
                </div>
                {designFee > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#9CA3AF", marginBottom: "6px" }}>
                    <span>Biaya desain ({designCount} area)</span><span>{rp(designFee)} × {totalQty}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "900", fontSize: "18px", borderTop: "1px solid #ffffff15", paddingTop: "10px", marginTop: "4px" }}>
                  <span>ESTIMASI TOTAL</span>
                  <span style={{ color: "#C8392B" }}>{rp(total)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ STEP 3: PESAN / PEMBAYARAN ═══ */}
        {step === 3 && (
          <div>
            <h2 style={{ fontWeight: 900, fontSize: "21px", marginBottom: "4px" }}>Detail & Bayar</h2>
            <p style={S.sub}>Isi data kamu lalu klik Pesan via WhatsApp</p>

            <div style={S.card}>
              <div style={S.label}>Nama Lengkap</div>
              <input value={customerName} onChange={e => setCustomerName(e.target.value)}
                placeholder="Nama pemesan" style={{ ...S.input, marginBottom: "12px" }} />
              <div style={S.label}>Nomor WhatsApp</div>
              <input value={customerWA} onChange={e => setCustomerWA(e.target.value)}
                placeholder="08xxxxxxxxxx" type="tel" style={S.input} />
            </div>

            {/* Summary */}
            <div style={{ background: "#0A0A0A", borderRadius: "14px", padding: "18px", color: "white", marginBottom: "14px" }}>
              <div style={{ fontWeight: "900", fontSize: "13px", letterSpacing: "1.5px", color: "#6B7280", marginBottom: "12px" }}>RINGKASAN PESANAN</div>
              <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                <div style={{ width: "52px", height: "62px", borderRadius: "10px", background: color, border: "2px solid #ffffff15", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                  {productId === "sweater" ? "🧥" : productId === "rib" ? "🧶" : productId === "lengan-panjang" ? "👔" : "👕"}
                </div>
                <div>
                  <div style={{ fontWeight: "800", fontSize: "15px" }}>{product?.label}</div>
                  <div style={{ color: "#9CA3AF", fontSize: "12px", marginTop: "3px" }}>Warna: {activeColor.name}</div>
                  {orderMode === "satuan" ? (
                    <div style={{ color: "#9CA3AF", fontSize: "12px" }}>Ukuran {satuanSize} · {satuanQty} pcs</div>
                  ) : (
                    <div style={{ color: "#9CA3AF", fontSize: "12px" }}>
                      {SIZES.filter(s => parseInt(sizes[s]) > 0).map(s => `${s}:${sizes[s]}`).join(" · ")} · Total {totalQty} pcs
                    </div>
                  )}
                  <div style={{ color: "#9CA3AF", fontSize: "12px" }}>{designCount} area desain</div>
                </div>
              </div>
              <div style={{ borderTop: "1px solid #ffffff15", paddingTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#9CA3AF", marginBottom: "5px" }}>
                  <span>Harga kaos</span><span>{rp(basePrice)} × {totalQty}</span>
                </div>
                {designFee > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#9CA3AF", marginBottom: "5px" }}>
                  <span>Biaya desain</span><span>{rp(designFee)} × {totalQty}</span>
                </div>}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "900", fontSize: "17px", borderTop: "1px solid #ffffff15", paddingTop: "10px", marginTop: "6px" }}>
                  <span>TOTAL</span><span style={{ color: "#C8392B" }}>{rp(total)}</span>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div style={S.card}>
              <div style={S.label}>Metode Pembayaran</div>
              {[
                { id: "Transfer Bank", sub: "BCA · BRI · Mandiri · BNI", icon: "🏦" },
                { id: "GoPay / OVO / Dana", sub: "E-Wallet populer", icon: "📱" },
                { id: "ShopeePay", sub: "Via Shopee", icon: "🛒" },
                { id: "COD", sub: "Bayar saat barang tiba", icon: "🏠" },
              ].map(m => (
                <button key={m.id} onClick={() => setPayMethod(m.id)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "11px 12px",
                  borderRadius: "10px", border: "2px solid", marginBottom: "8px", cursor: "pointer", textAlign: "left",
                  borderColor: payMethod === m.id ? "#C8392B" : "#E5E7EB",
                  background: payMethod === m.id ? "#FEF2F2" : "white",
                }}>
                  <span style={{ fontSize: "20px" }}>{m.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "700", fontSize: "13px", color: payMethod === m.id ? "#C8392B" : "#0A0A0A" }}>{m.id}</div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{m.sub}</div>
                  </div>
                  {payMethod === m.id && <span style={{ color: "#C8392B", fontWeight: "900" }}>✓</span>}
                </button>
              ))}
            </div>

            <div style={{ background: "#FEF9C3", borderRadius: "10px", padding: "12px 14px", fontSize: "12px", color: "#854D0E", border: "1px solid #FDE047" }}>
              ⚠️ Setelah menekan tombol di bawah, kamu akan diarahkan ke WhatsApp admin. Lampirkan file gambar desain kamu di sana.
            </div>
          </div>
        )}

        {/* ═══ STEP 4: SUCCESS ═══ */}
        {step === 4 && (
          <div>
            <div style={{ textAlign: "center", padding: "24px 0 20px" }}>
              <div style={{ fontSize: "60px", marginBottom: "12px" }}>🎉</div>
              <h2 style={{ fontWeight: 900, fontSize: "24px", marginBottom: "6px" }}>Pesanan Terkirim!</h2>
              <p style={{ color: "#6B7280", fontSize: "14px" }}>WhatsApp admin sudah terbuka. Jangan lupa lampirkan file desain kamu.</p>
            </div>

            <div style={{ background: "white", borderRadius: "14px", padding: "18px", marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <span style={{ fontWeight: "700" }}>ID Pesanan</span>
                <span style={{ background: "#0A0A0A", color: "white", padding: "4px 12px", borderRadius: "20px", fontWeight: "900", fontSize: "14px", letterSpacing: "1px" }}>{orderId}</span>
              </div>
              {[
                { label: "Pesanan Dikirim ke Admin", time: "Baru saja", done: true },
                { label: "Konfirmasi Pembayaran", time: "~15 menit", done: false, active: true },
                { label: "Proses Produksi", time: "3–5 hari kerja", done: false },
                { label: "Quality Check", time: "1 hari kerja", done: false },
                { label: "Pengiriman", time: "1–3 hari", done: false },
                { label: "Pesanan Tiba ✨", time: "", done: false },
              ].map((item, i, arr) => (
                <div key={i} style={{ display: "flex", gap: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: item.done ? "#0A0A0A" : item.active ? "#C8392B" : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "white", fontWeight: "800", flexShrink: 0 }}>
                      {item.done ? "✓" : ""}
                    </div>
                    {i < arr.length - 1 && <div style={{ width: "2px", flex: 1, minHeight: "24px", background: item.done ? "#0A0A0A" : "#E5E7EB" }} />}
                  </div>
                  <div style={{ paddingBottom: "14px" }}>
                    <div style={{ fontWeight: item.done || item.active ? "700" : "400", fontSize: "13px", color: item.active ? "#C8392B" : item.done ? "#0A0A0A" : "#9CA3AF" }}>{item.label}</div>
                    {item.time && <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{item.time}</div>}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => window.open(`https://wa.me/${WA_NUMBER}`, "_blank")}
              style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "#25D366", color: "white", fontWeight: "900", fontSize: "15px", cursor: "pointer", marginBottom: "10px" }}>
              💬 Buka WhatsApp Admin
            </button>
            <button onClick={() => { setStep(0); setProductId(null); setUploadedImages({}); setZoneNotes({}); setSizes({}); setPayMethod(null); setCustomerName(""); setCustomerWA(""); }}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "2px solid #E5E7EB", background: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
              + Buat Pesanan Baru
            </button>
          </div>
        )}

      </div>

      {/* ── BOTTOM NAV ── */}
      {step < 4 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #E5E7EB", padding: "14px 16px", display: "flex", gap: "10px", maxWidth: "480px", margin: "0 auto" }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ padding: "13px 18px", borderRadius: "12px", border: "2px solid #E5E7EB", background: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer", flexShrink: 0 }}>
              ← Kembali
            </button>
          )}
          {step < 3 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} style={{
              flex: 1, padding: "13px", borderRadius: "12px", border: "none",
              background: canNext() ? "#C8392B" : "#E5E7EB",
              color: canNext() ? "white" : "#9CA3AF",
              fontWeight: "900", fontSize: "15px", cursor: canNext() ? "pointer" : "not-allowed",
            }}>
              {step === 0 ? "Lanjut ke Desain →" : step === 1 ? "Lanjut ke Ukuran →" : "Lanjut ke Pembayaran →"}
            </button>
          ) : (
            <button onClick={handleOrder} disabled={!canNext()} style={{
              flex: 1, padding: "13px", borderRadius: "12px", border: "none",
              background: canNext() ? "#25D366" : "#E5E7EB",
              color: canNext() ? "white" : "#9CA3AF",
              fontWeight: "900", fontSize: "15px", cursor: canNext() ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
            }}>
              💬 Pesan via WhatsApp
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── MINI MOCKUP for product card ─────────────────────────────────────────
function MiniMockup({ type, color }) {
  const isSweater = type === "sweater";
  const isLong = type === "lengan-panjang";
  const sc = color || "#FFFFFF";
  const border = sc === "#FFFFFF" || sc === "#F5F5DC" ? "#D1D5DB" : darken(sc, 30);
  return (
    <svg viewBox="0 0 120 110" style={{ width: "80px", height: "auto", display: "block", margin: "0 auto" }}>
      {isSweater || isLong ? (
        <path d={`M24 22 L6 36 L14 44 L26 36 L26 ${isSweater?"98":"94"} L94 ${isSweater?"98":"94"} L94 36 L106 44 L114 36 L96 22 Q84 17 76 ${isSweater?"20":"18"} Q66 ${isSweater?"27":"24"} 60 ${isSweater?"28":"26"} Q54 ${isSweater?"27":"24"} 44 ${isSweater?"20":"18"} Q36 17 24 22Z`}
          fill={sc} stroke={border} strokeWidth="1.5" />
      ) : (
        <path d="M26 22 L6 36 L14 44 L26 36 L26 94 L94 94 L94 36 L106 44 L114 36 L94 22 Q82 16 76 18 Q66 26 60 27 Q54 26 44 18 Q38 16 26 22Z"
          fill={sc} stroke={border} strokeWidth="1.5" />
      )}
      {isSweater ? (
        <path d="M44 20 Q60 30 76 20 Q70 34 60 36 Q50 34 44 20Z" fill={sc} stroke={border} strokeWidth="1.5" />
      ) : (
        <path d="M46 18 Q60 28 74 18 Q68 32 60 34 Q52 32 46 18Z" fill={sc} stroke={border} strokeWidth="1.5" />
      )}
    </svg>
  );
}

