// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — CUSTOM BUILDER
//  Flow: Pilih Warna → Desain → Ukuran → Keranjang
// ═══════════════════════════════════════════════════════════

import { useState, useRef } from "react";
import Header from "../components/Header.jsx";
import { warnaKaos, areaCetak, ukuranTersedia, kategoriTemplate } from "../data/products.js";
import config from "../config.js";

const rp = (n) => "Rp " + n.toLocaleString("id-ID");

const STEPS = ["Warna", "Desain", "Ukuran", "Konfirmasi"];

// ── MOCKUP SVG ──────────────────────────────────────────────
function Mockup({ warna, tipe, activeZone, uploads, side, onZoneClick }) {
  const sc     = warna || "#FFFFFF";
  const border = sc === "#FFFFFF" || sc === "#F5F5DC" ? "#D1D5DB" : sc + "99";
  const isLong = tipe === "lengan-panjang";
  const isRib  = tipe === "rib";

  const zoneBox = (zone, x, y, w, h, rx = 8) => {
    const hasImg  = !!uploads[zone];
    const isAktif = activeZone === zone;
    return (
      <g key={zone} onClick={() => onZoneClick(zone)} style={{ cursor: "pointer" }}>
        <rect x={x} y={y} width={w} height={h} rx={rx}
          fill={hasImg ? "transparent" : isAktif ? "#C8392B15" : "transparent"}
          stroke={isAktif ? "#C8392B" : hasImg ? "#10B981" : "transparent"}
          strokeWidth="2" strokeDasharray={isAktif ? "5 3" : "none"} />
        {hasImg && (
          <>
            <defs>
              <clipPath id={`cp-${zone}`}>
                <rect x={x+2} y={y+2} width={w-4} height={h-4} rx={rx} />
              </clipPath>
            </defs>
            <image href={uploads[zone]} x={x+2} y={y+2}
              width={w-4} height={h-4}
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#cp-${zone})`} />
            <circle cx={x+w-6} cy={y+6} r="7" fill="#10B981" />
            <text x={x+w-6} y={y+10} textAnchor="middle"
              fontSize="8" fill="white" fontWeight="800">✓</text>
          </>
        )}
        {isAktif && !hasImg && (
          <text x={x+w/2} y={y+h/2+4} textAnchor="middle"
            fontSize="10" fill="#C8392B" fontWeight="800">+ TAP</text>
        )}
      </g>
    );
  };

  const zoneEllipse = (zone, cx, cy, rx2, ry2, rotate = 0) => {
    const hasImg  = !!uploads[zone];
    const isAktif = activeZone === zone;
    return (
      <g key={zone} onClick={() => onZoneClick(zone)} style={{ cursor: "pointer" }}>
        <ellipse cx={cx} cy={cy} rx={rx2} ry={ry2}
          transform={rotate ? `rotate(${rotate} ${cx} ${cy})` : ""}
          fill={hasImg ? "transparent" : isAktif ? "#C8392B15" : "transparent"}
          stroke={isAktif ? "#C8392B" : hasImg ? "#10B981" : "transparent"}
          strokeWidth="2" strokeDasharray={isAktif ? "5 3" : "none"} />
        {isAktif && !hasImg && (
          <text x={cx} y={cy+4} textAnchor="middle"
            fontSize="8" fill="#C8392B" fontWeight="800">+</text>
        )}
        {hasImg && (
          <circle cx={cx+rx2-4} cy={cy-ry2+4} r="6" fill="#10B981" />
        )}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 320 360"
      style={{ width: "100%", maxWidth: "280px", display: "block", margin: "0 auto",
        filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.15))" }}>
      <ellipse cx="160" cy="352" rx="90" ry="8" fill="#00000010" />
      {isLong ? (
        <path d="M62 62 L14 96 L38 118 L66 96 L66 292 L254 292 L254 96 L282 118 L306 96 L258 62 Q226 48 200 46 Q182 64 160 66 Q138 64 120 46 Q94 48 62 62Z"
          fill={sc} stroke={border} strokeWidth="1.5" />
      ) : (
        <path d="M68 62 L14 94 L36 116 L68 96 L68 292 L252 292 L252 96 L284 116 L306 94 L252 62 Q222 48 200 46 Q182 62 160 65 Q138 62 120 46 Q98 48 68 62Z"
          fill={sc} stroke={border} strokeWidth="1.5" />
      )}
      {isRib && [110,140,170,200,230,260].map(y => (
        <line key={y} x1="70" y1={y} x2="250" y2={y}
          stroke={border} strokeWidth="1" opacity="0.3" />
      ))}
      <path d="M122 46 Q160 70 198 46 Q182 78 160 82 Q138 78 122 46Z"
        fill={sc} stroke={border} strokeWidth="1.5" />
      <line x1="160" y1="66" x2="160" y2="292"
        stroke={border} strokeWidth="0.8" opacity="0.2" strokeDasharray="4 4" />

      {side === "front" && (
        <>
          {zoneEllipse("lengan-kiri",  46, 88, 22, 28, -12)}
          {zoneEllipse("lengan-kanan", 274, 88, 22, 28,  12)}
          {zoneBox("dada",  88, 82, 56, 54)}
          {zoneBox("depan", 94, 148, 132, 110)}
        </>
      )}
      {side === "back" && zoneBox("belakang", 94, 82, 132, 168)}
    </svg>
  );
}

// ── MAIN COMPONENT ──────────────────────────────────────────
export default function CustomBuilder({ produk, onBack, onTambahKeranjang }) {
  const [step,         setStep]         = useState(0);
  const [warna,        setWarna]        = useState("#FFFFFF");
  const [opsiDesain,   setOpsiDesain]   = useState(null); // "upload" | "brief"
  const [side,         setSide]         = useState("front");
  const [activeZone,   setActiveZone]   = useState("depan");
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

  const warnaObj      = warnaKaos.find(w => w.hex === warna) || warnaKaos[0];
  const uploadCount   = Object.values(uploads).filter(Boolean).length;
  const biayaDesain   = uploadCount * config.harga.biayaDesainPerArea;
  const totalQty      = modeUkuran === "satuan"
    ? satuanQty
    : Object.values(massalQty).reduce((a, b) => a + (parseInt(b) || 0), 0);
  const totalHarga    = (produk.harga + biayaDesain) * totalQty;

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
    reader.onload = (ev) => {
      setUploads(prev => ({ ...prev, [activeZone]: ev.target.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const hapusUpload = (zone) => {
    setUploads(prev => { const n = { ...prev }; delete n[zone]; return n; });
  };

  const simpanCatatan = () => {
    setCatatan(prev => ({ ...prev, [activeZone]: catatanInput }));
  };

  const handleTambahKeranjang = () => {
    const item = {
      id:          Date.now(),
      produk,
      warna,
      warnaLabel:  warnaObj.nama,
      opsiDesain,
      uploads,
      catatan,
      briefKat,
      briefTeks,
      kodeDesain,
      modeUkuran,
      satuanSize,
      satuanQty,
      massalQty,
      totalQty,
      totalHarga,
    };
    onTambahKeranjang(item);
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

  // ── STEP INDICATOR ──────────────────────────────────────
  const StepBar = () => (
    <div style={{
      background: "white", borderBottom: "1px solid #E5E7EB",
      padding: "10px 16px",
    }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center",
            flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
              <div style={{
                width: "24px", height: "24px", borderRadius: "50%",
                background: i < step ? "#0A0A0A" : i === step ? "#C8392B" : "#E5E7EB",
                color: i <= step ? "white" : "#9CA3AF",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", fontWeight: "800",
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              <div style={{
                fontSize: "9px", whiteSpace: "nowrap",
                fontWeight: i === step ? "800" : "400",
                color: i === step ? "#C8392B" : i < step ? "#374151" : "#9CA3AF",
              }}>{s}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: "2px", margin: "0 4px", marginBottom: "14px",
                background: i < step ? "#0A0A0A" : "#E5E7EB",
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const S = {
    card:  { background: "white", borderRadius: "14px", padding: "16px", marginBottom: "12px" },
    label: { fontWeight: "700", fontSize: "13px", color: "#374151", marginBottom: "8px" },
    sub:   { fontSize: "12px", color: "#9CA3AF", marginBottom: "10px" },
  };

  return (
    <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "90px" }}>
      <Header halaman="custom" judul={produk.nama} onBack={onBack} />
      <StepBar />

      <div style={{ padding: "16px", maxWidth: "480px", margin: "0 auto" }}>

        {/* ══ STEP 0: PILIH WARNA ══ */}
        {step === 0 && (
          <div>
            <div style={S.card}>
              {/* Mini mockup preview */}
              <div style={{
                background: "#F9FAFB", borderRadius: "10px",
                padding: "20px", marginBottom: "16px", textAlign: "center",
              }}>
                <svg viewBox="0 0 120 100" style={{ width: "100px", margin: "0 auto", display: "block" }}>
                  <path d="M26 22 L6 36 L14 44 L26 36 L26 88 L94 88 L94 36 L106 44 L114 36 L94 22 Q82 16 76 18 Q66 26 60 27 Q54 26 44 18 Q38 16 26 22Z"
                    fill={warna} stroke={warna === "#FFFFFF" ? "#D1D5DB" : warna + "99"} strokeWidth="1.5" />
                  <path d="M46 18 Q60 28 74 18 Q68 32 60 34 Q52 32 46 18Z"
                    fill={warna} stroke={warna === "#FFFFFF" ? "#D1D5DB" : warna + "99"} strokeWidth="1.5" />
                </svg>
                <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "8px" }}>
                  {produk.nama} · <strong style={{ color: "#0A0A0A" }}>{warnaObj.nama}</strong>
                </div>
              </div>

              <div style={S.label}>Pilih Warna</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {warnaKaos.map(w => (
                  <button key={w.hex} onClick={() => setWarna(w.hex)} title={w.nama}
                    style={{
                      width: "34px", height: "34px", borderRadius: "50%",
                      background: w.hex, cursor: "pointer",
                      border: "3px solid",
                      borderColor: warna === w.hex ? "#C8392B" : w.hex === "#FFFFFF" ? "#D1D5DB" : "transparent",
                      boxShadow: warna === w.hex ? "0 0 0 2px #C8392B40" : "none",
                    }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ STEP 1: DESAIN ══ */}
        {step === 1 && (
          <div>
            {/* Pilih opsi */}
            {!opsiDesain && (
              <div>
                <div style={{ fontWeight: 900, fontSize: "18px", marginBottom: "4px" }}>
                  Punya Desain?
                </div>
                <div style={{ ...S.sub, marginBottom: "16px" }}>
                  Pilih cara kamu mau mendesain kaos ini
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {/* Opsi A */}
                  <button onClick={() => setOpsiDesain("upload")} style={{
                    background: "white", borderRadius: "14px", padding: "18px 16px",
                    border: "2px solid #E5E7EB", cursor: "pointer", textAlign: "left",
                    display: "flex", gap: "14px", alignItems: "center",
                  }}>
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "12px",
                      background: "#0A0A0A", display: "flex", alignItems: "center",
                      justifyContent: "center", flexShrink: 0, fontSize: "22px",
                    }}>📁</div>
                    <div>
                      <div style={{ fontWeight: "800", fontSize: "15px", marginBottom: "3px" }}>
                        Punya Desain Sendiri
                      </div>
                      <div style={{ fontSize: "12px", color: "#9CA3AF", lineHeight: 1.4 }}>
                        Upload file PNG, JPG, atau SVG. Letakkan di area yang kamu mau.
                      </div>
                    </div>
                    <div style={{ marginLeft: "auto", color: "#9CA3AF", fontSize: "18px" }}>→</div>
                  </button>

                  {/* Opsi B */}
                  <button onClick={() => setOpsiDesain("brief")} style={{
                    background: "white", borderRadius: "14px", padding: "18px 16px",
                    border: "2px solid #E5E7EB", cursor: "pointer", textAlign: "left",
                    display: "flex", gap: "14px", alignItems: "center",
                  }}>
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "12px",
                      background: "#C8392B", display: "flex", alignItems: "center",
                      justifyContent: "center", flexShrink: 0, fontSize: "22px",
                    }}>✏️</div>
                    <div>
                      <div style={{ fontWeight: "800", fontSize: "15px", marginBottom: "3px" }}>
                        Belum Punya Desain
                      </div>
                      <div style={{ fontSize: "12px", color: "#9CA3AF", lineHeight: 1.4 }}>
                        Ceritakan idemu. Tim desainer profesional kami akan bantu wujudkan.
                      </div>
                    </div>
                    <div style={{ marginLeft: "auto", color: "#9CA3AF", fontSize: "18px" }}>→</div>
                  </button>
                </div>
              </div>
            )}

            {/* ── OPSI A: UPLOAD ── */}
            {opsiDesain === "upload" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <button onClick={() => setOpsiDesain(null)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "20px", padding: 0, color: "#9CA3AF",
                  }}>←</button>
                  <div style={{ fontWeight: 900, fontSize: "17px" }}>Upload Desain</div>
                </div>

                {/* Toggle front/back */}
                <div style={{
                  display: "flex", background: "#E5E7EB", borderRadius: "10px",
                  padding: "3px", marginBottom: "12px", gap: "3px",
                }}>
                  {[["front","👕 Depan"],["back","🔄 Belakang"]].map(([s,l]) => (
                    <button key={s} onClick={() => setSide(s)} style={{
                      flex: 1, padding: "8px", borderRadius: "8px", border: "none",
                      background: side === s ? "white" : "transparent",
                      fontWeight: side === s ? "800" : "400",
                      fontSize: "13px", cursor: "pointer",
                    }}>{l}</button>
                  ))}
                </div>

                {/* Mockup */}
                <div style={{ background: "white", borderRadius: "14px", padding: "16px", marginBottom: "12px" }}>
                  <Mockup warna={warna} tipe={produk.id} activeZone={activeZone}
                    uploads={uploads} side={side} onZoneClick={handleZoneClick} />
                  <div style={{ textAlign: "center", fontSize: "11px", color: "#9CA3AF", marginTop: "8px" }}>
                    Tap area untuk upload desain
                  </div>
                </div>

                {/* Area pills */}
                <div style={S.card}>
                  <div style={{ ...S.label }}>Pilih Area Cetak</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "14px" }}>
                    {areaCetak.map(z => (
                      <button key={z.id} onClick={() => handleZoneClick(z.id)} style={{
                        padding: "6px 13px", borderRadius: "20px", border: "2px solid",
                        fontSize: "12px", fontWeight: "600", cursor: "pointer",
                        borderColor: activeZone === z.id ? "#C8392B" : uploads[z.id] ? "#10B981" : "#E5E7EB",
                        background: activeZone === z.id ? "#FEF2F2" : uploads[z.id] ? "#ECFDF5" : "white",
                        color: activeZone === z.id ? "#C8392B" : uploads[z.id] ? "#065F46" : "#374151",
                      }}>
                        {uploads[z.id] ? "✓ " : ""}{z.label}
                      </button>
                    ))}
                  </div>

                  {/* Upload box */}
                  <div style={{
                    border: "2px dashed",
                    borderColor: uploads[activeZone] ? "#10B981" : "#E5E7EB",
                    borderRadius: "12px", padding: "16px", textAlign: "center",
                    background: uploads[activeZone] ? "#F0FDF4" : "#FAFAFA",
                  }}>
                    {uploads[activeZone] ? (
                      <div>
                        <img src={uploads[activeZone]} alt="desain"
                          style={{ maxHeight: "100px", maxWidth: "100%", borderRadius: "8px", marginBottom: "10px" }} />
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button onClick={() => fileRef.current?.click()} style={{
                            padding: "7px 14px", borderRadius: "8px", border: "2px solid #E5E7EB",
                            background: "white", fontSize: "12px", fontWeight: "700", cursor: "pointer",
                          }}>🔄 Ganti</button>
                          <button onClick={() => hapusUpload(activeZone)} style={{
                            padding: "7px 14px", borderRadius: "8px", border: "2px solid #FCA5A5",
                            background: "#FEF2F2", color: "#C8392B", fontSize: "12px",
                            fontWeight: "700", cursor: "pointer",
                          }}>🗑 Hapus</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: "28px", marginBottom: "8px" }}>🖼</div>
                        <div style={{ fontWeight: "700", fontSize: "13px", marginBottom: "4px" }}>
                          {areaCetak.find(z => z.id === activeZone)?.label}
                        </div>
                        <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "12px" }}>
                          PNG, JPG, SVG · maks 10MB
                        </div>
                        <button onClick={() => fileRef.current?.click()} style={{
                          padding: "9px 22px", borderRadius: "8px", border: "none",
                          background: "#0A0A0A", color: "white",
                          fontWeight: "800", fontSize: "12px", cursor: "pointer",
                        }}>📁 Pilih File</button>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*"
                      style={{ display: "none" }} onChange={handleUpload} />
                  </div>

                  {/* Catatan */}
                  <div style={{ marginTop: "12px" }}>
                    <div style={{ ...S.label, marginBottom: "6px" }}>
                      Catatan — {areaCetak.find(z => z.id === activeZone)?.label}
                    </div>
                    <textarea
                      value={catatanInput}
                      onChange={e => setCatatanInput(e.target.value)}
                      onBlur={simpanCatatan}
                      placeholder="Contoh: posisi logo di tengah, ukuran 10cm..."
                      style={{
                        width: "100%", minHeight: "60px", borderRadius: "8px",
                        border: "2px solid #E5E7EB", padding: "10px",
                        fontSize: "13px", resize: "none", outline: "none",
                        boxSizing: "border-box", fontFamily: "inherit",
                      }} />
                  </div>

                  {uploadCount > 0 && (
                    <div style={{
                      marginTop: "10px", background: "#ECFDF5", borderRadius: "8px",
                      padding: "10px 12px", fontSize: "12px", color: "#065F46", fontWeight: "600",
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
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <button onClick={() => setOpsiDesain(null)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "20px", padding: 0, color: "#9CA3AF",
                  }}>←</button>
                  <div style={{ fontWeight: 900, fontSize: "17px" }}>Konsultasi Desainer</div>
                </div>

                <div style={S.card}>
                  <div style={S.label}>Kategori Desain</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                    {kategoriTemplate.map(k => (
                      <button key={k.id} onClick={() => setBriefKat(k.id)} style={{
                        padding: "12px 14px", borderRadius: "10px", border: "2px solid",
                        borderColor: briefKat === k.id ? "#C8392B" : "#E5E7EB",
                        background: briefKat === k.id ? "#FEF2F2" : "white",
                        cursor: "pointer", textAlign: "left",
                        display: "flex", alignItems: "center", gap: "10px",
                      }}>
                        <span style={{ fontSize: "20px" }}>{k.icon}</span>
                        <span style={{
                          fontWeight: "700", fontSize: "13px",
                          color: briefKat === k.id ? "#C8392B" : "#0A0A0A",
                        }}>{k.label}</span>
                        {briefKat === k.id && (
                          <span style={{ marginLeft: "auto", color: "#C8392B", fontWeight: "900" }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {briefKat && (
                    <>
                      <div style={S.label}>Ceritakan Idemu</div>
                      {[
                        { key: "depan",    label: "Desain Depan" },
                        { key: "belakang", label: "Desain Belakang" },
                        { key: "lengan",   label: "Desain Lengan (opsional)" },
                      ].map(f => (
                        <div key={f.key} style={{ marginBottom: "10px" }}>
                          <div style={{ fontSize: "12px", fontWeight: "600",
                            color: "#6B7280", marginBottom: "5px" }}>{f.label}</div>
                          <textarea
                            value={briefTeks[f.key]}
                            onChange={e => setBriefTeks(prev => ({ ...prev, [f.key]: e.target.value }))}
                            placeholder={`Contoh: nama kelas, tahun angkatan, tema warna...`}
                            style={{
                              width: "100%", minHeight: "60px", borderRadius: "8px",
                              border: "2px solid #E5E7EB", padding: "10px",
                              fontSize: "13px", resize: "none", outline: "none",
                              boxSizing: "border-box", fontFamily: "inherit",
                            }} />
                        </div>
                      ))}

                      <div style={{
                        background: "#FEF9C3", borderRadius: "10px",
                        padding: "12px", fontSize: "12px", color: "#854D0E",
                        border: "1px solid #FDE047", lineHeight: 1.5,
                      }}>
                        💡 Setelah order, tim desainer akan menghubungi kamu via WhatsApp untuk diskusi lebih lanjut dan mengirimkan <strong>Kode Desain</strong> setelah desain fix.
                      </div>
                    </>
                  )}
                </div>

                {/* Input kode desain — kalau sudah dapat dari desainer */}
                <div style={S.card}>
                  <div style={S.label}>Sudah Punya Kode Desain?</div>
                  <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "10px" }}>
                    Masukkan kode yang dikirim desainer via WhatsApp
                  </div>
                  <input
                    value={kodeDesain}
                    onChange={e => setKodeDesain(e.target.value.toUpperCase())}
                    placeholder="INSTAR-XXXX"
                    style={{
                      width: "100%", borderRadius: "8px", border: "2px solid #E5E7EB",
                      padding: "10px 12px", fontSize: "14px", fontWeight: "700",
                      outline: "none", boxSizing: "border-box",
                      letterSpacing: "2px", fontFamily: "monospace",
                      color: kodeDesain ? "#10B981" : "#374151",
                    }} />
                  {kodeDesain && (
                    <div style={{
                      marginTop: "8px", fontSize: "12px", color: "#10B981", fontWeight: "700",
                    }}>
                      ✅ Kode desain tersimpan
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ STEP 2: UKURAN ══ */}
        {step === 2 && (
          <div>
            <div style={{ fontWeight: 900, fontSize: "18px", marginBottom: "4px" }}>Ukuran & Jumlah</div>
            <div style={{ ...S.sub, marginBottom: "16px" }}>Tentukan ukuran dan jumlah pesanan</div>

            {/* Toggle mode */}
            <div style={{
              display: "flex", background: "#E5E7EB", borderRadius: "10px",
              padding: "3px", marginBottom: "14px", gap: "3px",
            }}>
              {[["satuan","👕 Satuan"],["massal","📦 Massal"]].map(([m,l]) => (
                <button key={m} onClick={() => setModeUkuran(m)} style={{
                  flex: 1, padding: "9px", borderRadius: "8px", border: "none",
                  background: modeUkuran === m ? "white" : "transparent",
                  fontWeight: modeUkuran === m ? "800" : "400",
                  fontSize: "13px", cursor: "pointer",
                  boxShadow: modeUkuran === m ? "0 1px 4px #00000015" : "none",
                }}>{l}</button>
              ))}
            </div>

            {modeUkuran === "satuan" ? (
              <div style={S.card}>
                <div style={S.label}>Ukuran</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "18px" }}>
                  {ukuranTersedia.map(sz => (
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
                  <button onClick={() => setSatuanQty(q => Math.max(1, q-1))} style={{
                    width: "38px", height: "38px", borderRadius: "10px",
                    border: "2px solid #E5E7EB", background: "white",
                    fontWeight: "900", fontSize: "20px", cursor: "pointer",
                  }}>−</button>
                  <span style={{ fontWeight: "900", fontSize: "24px", minWidth: "36px", textAlign: "center" }}>
                    {satuanQty}
                  </span>
                  <button onClick={() => setSatuanQty(q => q+1)} style={{
                    width: "38px", height: "38px", borderRadius: "10px",
                    border: "2px solid #E5E7EB", background: "white",
                    fontWeight: "900", fontSize: "20px", cursor: "pointer",
                  }}>+</button>
                  <span style={{ color: "#9CA3AF", fontSize: "13px" }}>pcs</span>
                </div>
              </div>
            ) : (
              <div style={S.card}>
                <div style={S.label}>Jumlah per Ukuran</div>
                <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "14px" }}>
                  Isi 0 atau kosongkan jika tidak ada
                </div>
                {ukuranTersedia.map(sz => (
                  <div key={sz} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "8px",
                      background: "#0A0A0A", color: "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: "900", fontSize: "13px", flexShrink: 0,
                    }}>{sz}</div>
                    <button onClick={() => setMassalQty(p => ({ ...p, [sz]: Math.max(0,(parseInt(p[sz])||0)-1) }))}
                      style={{ width:"30px", height:"30px", borderRadius:"8px",
                        border:"2px solid #E5E7EB", background:"white",
                        fontWeight:"800", fontSize:"16px", cursor:"pointer" }}>−</button>
                    <input type="number" min="0"
                      value={massalQty[sz] || ""}
                      onChange={e => setMassalQty(p => ({ ...p, [sz]: e.target.value }))}
                      placeholder="0"
                      style={{ width:"54px", textAlign:"center", borderRadius:"8px",
                        border:"2px solid #E5E7EB", padding:"6px",
                        fontSize:"15px", fontWeight:"700", outline:"none" }} />
                    <button onClick={() => setMassalQty(p => ({ ...p, [sz]: (parseInt(p[sz])||0)+1 }))}
                      style={{ width:"30px", height:"30px", borderRadius:"8px",
                        border:"2px solid #E5E7EB", background:"white",
                        fontWeight:"800", fontSize:"16px", cursor:"pointer" }}>+</button>
                    <span style={{ fontSize:"12px", color:"#9CA3AF" }}>pcs</span>
                  </div>
                ))}
                <div style={{
                  borderTop: "1px solid #E5E7EB", paddingTop: "12px", marginTop: "4px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontWeight:"700", fontSize:"14px" }}>Total</span>
                  <span style={{ fontWeight:"900", fontSize:"20px", color:"#C8392B" }}>{totalQty} pcs</span>
                </div>
              </div>
            )}

            {/* Estimasi harga */}
            {totalQty > 0 && (
              <div style={{
                background: "#0A0A0A", borderRadius: "14px",
                padding: "16px", color: "white",
              }}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  fontSize:"13px", color:"#9CA3AF", marginBottom:"6px" }}>
                  <span>Harga kaos</span>
                  <span>{rp(produk.harga)} × {totalQty}</span>
                </div>
                {biayaDesain > 0 && (
                  <div style={{ display:"flex", justifyContent:"space-between",
                    fontSize:"13px", color:"#9CA3AF", marginBottom:"6px" }}>
                    <span>Biaya desain ({uploadCount} area)</span>
                    <span>{rp(biayaDesain)} × {totalQty}</span>
                  </div>
                )}
                <div style={{
                  display:"flex", justifyContent:"space-between",
                  fontWeight:"900", fontSize:"18px",
                  borderTop:"1px solid #ffffff15", paddingTop:"10px", marginTop:"6px",
                }}>
                  <span>ESTIMASI</span>
                  <span style={{ color:"#C8392B" }}>{rp(totalHarga)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ STEP 3: KONFIRMASI ══ */}
        {step === 3 && (
          <div>
            <div style={{ fontWeight: 900, fontSize: "18px", marginBottom: "4px" }}>Konfirmasi</div>
            <div style={{ ...S.sub, marginBottom: "16px" }}>Cek detail sebelum masuk keranjang</div>

            <div style={{ background:"#0A0A0A", borderRadius:"16px", padding:"18px", color:"white", marginBottom:"12px" }}>
              <div style={{ display:"flex", gap:"12px", marginBottom:"14px" }}>
                <div style={{
                  width:"56px", height:"64px", borderRadius:"10px",
                  background: warna, border:"2px solid #ffffff20",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"24px", flexShrink:0,
                }}>👕</div>
                <div>
                  <div style={{ fontWeight:"800", fontSize:"15px" }}>{produk.nama}</div>
                  <div style={{ color:"#9CA3AF", fontSize:"12px", marginTop:"3px" }}>
                    Warna: {warnaObj.nama}
                  </div>
                  <div style={{ color:"#9CA3AF", fontSize:"12px" }}>
                    Desain: {opsiDesain === "upload"
                      ? `Upload · ${uploadCount} area`
                      : kodeDesain
                        ? `Kode: ${kodeDesain}`
                        : `Brief ke desainer`}
                  </div>
                  <div style={{ color:"#9CA3AF", fontSize:"12px" }}>
                    {modeUkuran === "satuan"
                      ? `Ukuran ${satuanSize} · ${satuanQty} pcs`
                      : `Massal · ${totalQty} pcs`}
                  </div>
                </div>
              </div>

              {modeUkuran === "massal" && (
                <div style={{ borderTop:"1px solid #ffffff15", paddingTop:"12px", marginBottom:"12px" }}>
                  <div style={{ fontSize:"11px", color:"#6B7280", marginBottom:"8px", letterSpacing:"1px" }}>
                    BREAKDOWN UKURAN
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
                    {ukuranTersedia.filter(sz => parseInt(massalQty[sz]) > 0).map(sz => (
                      <div key={sz} style={{
                        background:"#1A1A1A", borderRadius:"6px",
                        padding:"4px 10px", fontSize:"12px", fontWeight:"700",
                      }}>
                        {sz}: {massalQty[sz]} pcs
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ borderTop:"1px solid #ffffff15", paddingTop:"12px" }}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  fontSize:"13px", color:"#9CA3AF", marginBottom:"5px" }}>
                  <span>Harga kaos</span><span>{rp(produk.harga)} × {totalQty}</span>
                </div>
                {biayaDesain > 0 && (
                  <div style={{ display:"flex", justifyContent:"space-between",
                    fontSize:"13px", color:"#9CA3AF", marginBottom:"5px" }}>
                    <span>Biaya desain</span><span>{rp(biayaDesain)} × {totalQty}</span>
                  </div>
                )}
                <div style={{ display:"flex", justifyContent:"space-between",
                  fontWeight:"900", fontSize:"17px",
                  borderTop:"1px solid #ffffff15", paddingTop:"10px", marginTop:"6px" }}>
                  <span>TOTAL</span>
                  <span style={{ color:"#C8392B" }}>{rp(totalHarga)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── BOTTOM BUTTONS ── */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0,
        background:"white", borderTop:"1px solid #E5E7EB",
        padding:"14px 16px", display:"flex", gap:"10px",
        maxWidth:"480px", margin:"0 auto",
      }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s-1)} style={{
            padding:"13px 18px", borderRadius:"12px",
            border:"2px solid #E5E7EB", background:"white",
            fontWeight:"700", fontSize:"14px", cursor:"pointer", flexShrink:0,
          }}>← Kembali</button>
        )}
        {step < 3 ? (
          <button onClick={() => setStep(s => s+1)} disabled={!canNext()} style={{
            flex:1, padding:"13px", borderRadius:"12px", border:"none",
            background: canNext() ? "#0A0A0A" : "#E5E7EB",
            color: canNext() ? "white" : "#9CA3AF",
            fontWeight:"900", fontSize:"15px",
            cursor: canNext() ? "pointer" : "not-allowed",
          }}>
            {step === 0 ? "Pilih Desain →"
              : step === 1 ? "Pilih Ukuran →"
              : "Konfirmasi →"}
          </button>
        ) : (
          <button onClick={handleTambahKeranjang} style={{
            flex:1, padding:"13px", borderRadius:"12px", border:"none",
            background:"#C8392B", color:"white",
            fontWeight:"900", fontSize:"15px", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
          }}>
            🛒 Tambah ke Keranjang
          </button>
        )}
      </div>

    </div>
  );
}

