// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — CUSTOM BUILDER (v5)
//  - 2 zona: Depan & Belakang
//  - Canvas A4 untuk posisi desain
//  - Drag desain di atas canvas
//  - Warna kaos via CSS filter preset
// ═══════════════════════════════════════════════════════════

import { useState, useRef, useCallback, useEffect } from "react";
import Header from "../../components/Header.jsx";
import { warnaKaos, ukuranTersedia, tambahanUkuran, kategoriTemplate } from "../../data/products.js";
import config from "../../config.js";

const rp = (n) => "Rp " + n.toLocaleString("id-ID");
const STEPS = ["Warna", "Desain", "Ukuran", "Konfirmasi"];

// ── Area cetak (hanya depan & belakang) ──────────────────────
const AREA_CETAK = [
  { id: "depan",    label: "Depan",    side: "front" },
  { id: "belakang", label: "Belakang", side: "back"  },
];

// ── CSS Filter preset per warna ───────────────────────────────
import DesignCanvas from "./DesignCanvas.jsx";
import MockupKaos from "./MockupKaos.jsx";
import PreviewKonfirmasi from "./PreviewKonfirmasi.jsx";
import ColorPicker from "./ColorPicker.jsx";

export default function CustomBuilder({ produk, onBack, onTambahKeranjang, onStepChange, desainAwal, onChatDesainer }) {
  const [step,         setStep]         = useState(0);
  const [warna,        setWarna]        = useState("#FFFFFF");
  const [opsiDesain,   setOpsiDesain]   = useState(null);
  const [side,         setSide]         = useState("front");
  const [activeZona,   setActiveZona]   = useState("depan");
  const [uploads,      setUploads]      = useState({});
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
  const biayaTambahan = opsiDesain === "brief" ? config.harga.biayaBrief : config.harga.biayaSablon;
  const totalQty    = modeUkuran === "satuan"
    ? satuanQty
    : Object.values(massalQty).reduce((a,b) => a+(parseInt(b)||0), 0);
  const totalHarga  = modeUkuran === "massal"
    ? Object.entries(massalQty).reduce((total, [sz, qty]) => {
        const q = parseInt(qty) || 0;
        if (q <= 0) return total;
        return total + (produk.harga + (tambahanUkuran[sz] || 0) + biayaTambahan) * q;
      }, 0)
    : (produk.harga + (tambahanUkuran[satuanSize] || 0) + biayaTambahan) * satuanQty;

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

  // Beritahu App.jsx step saat ini untuk handle back button
  useEffect(() => {
    if (typeof onStepChange === "function") onStepChange(step);
  }, [step]);

  const handleTambahKeranjang = () => {
    if (opsiDesain === "brief") {
      onChatDesainer?.({
        produk,
        warna,
        warnaLabel: warnaObj.nama,
        briefKat,
        briefTeks,
        kodeDesain,
        modeUkuran,
        satuanSize,
        satuanQty,
        massalQty,
        totalQty,
        totalHarga,
      });
      return;
    }

    const item = {
      id: Date.now(), produk, warna, warnaLabel: warnaObj.nama,
      opsiDesain, uploads, posisiDesain, catatan, briefKat, briefTeks, kodeDesain,
      modeUkuran, satuanSize, satuanQty, massalQty, totalQty, totalHarga,
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
                <div style={{ fontWeight:900, fontSize:"22px", marginBottom:"6px", color:"#0A0A0A" }}>Punya Desain?</div>
                <div style={{ fontSize:"13px", color:"#9CA3AF", marginBottom:"20px", lineHeight:1.5 }}>Pilih cara kamu mau mendesain kaos ini</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>

                  <button onClick={() => setOpsiDesain("upload")} style={{
                    background:"white", borderRadius:"18px", padding:"20px 18px",
                    border:"1.5px solid #E5E7EB", cursor:"pointer", textAlign:"left",
                    display:"flex", gap:"16px", alignItems:"center",
                    boxShadow:"0 2px 16px rgba(0,0,0,0.07)",
                  }}>
                    <div style={{
                      width:"52px", height:"52px", borderRadius:"14px",
                      background:"#0A0A0A",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      flexShrink:0,
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="17 8 12 3 7 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="12" y1="3" x2="12" y2="15" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:"800", fontSize:"15px", color:"#0A0A0A", marginBottom:"4px" }}>Punya Desain Sendiri</div>
                      <div style={{ fontSize:"12px", color:"#9CA3AF", lineHeight:1.5 }}>Upload file PNG atau JPG. Atur posisi desain di area cetak A4.</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18l6-6-6-6" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <button onClick={() => setOpsiDesain("brief")} style={{
                    background:"white", borderRadius:"18px", padding:"20px 18px",
                    border:"1.5px solid #E5E7EB", cursor:"pointer", textAlign:"left",
                    display:"flex", gap:"16px", alignItems:"center",
                    boxShadow:"0 2px 16px rgba(0,0,0,0.07)",
                  }}>
                    <div style={{
                      width:"52px", height:"52px", borderRadius:"14px",
                      background:"#C8392B",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      flexShrink:0,
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 20h9" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:"800", fontSize:"15px", color:"#0A0A0A", marginBottom:"4px" }}>Belum Punya Desain</div>
                      <div style={{ fontSize:"12px", color:"#9CA3AF", lineHeight:1.5 }}>Ceritakan idemu. Tim desainer kami akan bantu wujudkan.</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18l6-6-6-6" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

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
                      {a.id === "depan" ? "Depan" : "Belakang"}
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
                    ✅ {uploadCount} area desain terupload
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
                {/* Banner */}
                <div style={{ background:"linear-gradient(135deg,#0A0A0A,#1a1a2e)", borderRadius:"16px",
                  padding:"16px 18px", marginBottom:"14px", display:"flex", gap:"14px", alignItems:"center" }}>
                  <div style={{
                    width:"48px", height:"48px", borderRadius:"12px",
                    background:"rgba(255,255,255,0.08)",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                  }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.7"/>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07" stroke="#9CA3AF" strokeWidth="1.7" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ color:"white", fontWeight:"800", fontSize:"14px", marginBottom:"4px" }}>Tim Desainer Siap Bantu</div>
                    <div style={{ color:"#6B7280", fontSize:"11px", lineHeight:1.6 }}>Ceritakan idemu → Desainer buatkan → Kamu setujui → Produksi</div>
                  </div>
                </div>

                {/* Step 1: Kategori */}
                <div style={{ background:"white", borderRadius:"14px", marginBottom:"12px", overflow:"hidden" }}>
                  <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid #F3F4F6", display:"flex", alignItems:"center", gap:"8px" }}>
                    <div style={{ width:"22px", height:"22px", borderRadius:"50%", background:briefKat?"#10B981":"#C8392B",
                      color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:"900", flexShrink:0 }}>
                      {briefKat ? "✓" : "1"}
                    </div>
                    <div style={{ fontWeight:"800", fontSize:"14px" }}>Pilih Kategori</div>
                  </div>
                  <div style={{ padding:"12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                    {kategoriTemplate.map(k => (
                      <button key={k.id} onClick={() => setBriefKat(k.id)} style={{
                        padding:"14px 10px", borderRadius:"12px", border:"2px solid",
                        borderColor:briefKat===k.id?"#C8392B":"#F3F4F6",
                        background:briefKat===k.id?"#FEF2F2":"#FAFAFA",
                        cursor:"pointer", textAlign:"center",
                        display:"flex", flexDirection:"column", alignItems:"center", gap:"6px",
                        boxShadow:briefKat===k.id?"0 0 0 3px rgba(200,57,43,0.1)":"none" }}>
                        <div style={{ width:"32px", height:"32px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {k.id === "kelas" && <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#0A0A0A" strokeWidth="1.8" strokeLinejoin="round"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0A0A0A" strokeWidth="1.8" strokeLinejoin="round"/></svg>}
                          {k.id === "event" && <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#0A0A0A" strokeWidth="1.8"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round"/></svg>}
                          {k.id === "perpisahan" && <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#0A0A0A" strokeWidth="1.8" strokeLinejoin="round"/></svg>}
                          {k.id === "komunitas" && <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" stroke="#0A0A0A" strokeWidth="1.8"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                          {k.id === "organisasi" && <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#0A0A0A" strokeWidth="1.8" strokeLinejoin="round"/></svg>}
                        </div>
                        <span style={{ fontWeight:"700", fontSize:"11px", lineHeight:1.3,
                          color:briefKat===k.id?"#C8392B":"#374151" }}>{k.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Form brief */}
                {briefKat && (
                  <div style={{ background:"white", borderRadius:"14px", marginBottom:"12px", overflow:"hidden" }}>
                    <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid #F3F4F6", display:"flex", alignItems:"center", gap:"8px" }}>
                      <div style={{ width:"22px", height:"22px", borderRadius:"50%", background:"#C8392B",
                        color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:"900", flexShrink:0 }}>2</div>
                      <div style={{ fontWeight:"800", fontSize:"14px" }}>Ceritakan Idemu</div>
                    </div>
                    <div style={{ padding:"14px 16px" }}>
                      {[
                        {key:"depan", label:"Desain Depan", required:true, placeholder:"Contoh: logo sekolah di tengah, tulisan nama kelas, warna navy..."},
                        {key:"belakang", label:"Desain Belakang (opsional)", required:false, placeholder:"Contoh: daftar nama anggota, quote, tahun angkatan..."},
                      ].map(f => (
                        <div key={f.key} style={{ marginBottom:"14px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"6px" }}>
                            <div style={{ fontSize:"12px", fontWeight:"700", color:"#374151" }}>{f.label}</div>
                            {f.required && <div style={{ fontSize:"9px", background:"#FEF2F2", color:"#C8392B",
                              padding:"1px 6px", borderRadius:"4px", fontWeight:"700" }}>Wajib</div>}
                          </div>
                          <textarea value={briefTeks[f.key]}
                            onChange={e => setBriefTeks(prev => ({...prev,[f.key]:e.target.value}))}
                            placeholder={f.placeholder}
                            style={{ width:"100%", minHeight:"80px", borderRadius:"10px",
                              border:"2px solid", borderColor:briefTeks[f.key]?"#10B981":"#E5E7EB",
                              padding:"10px 12px", fontSize:"13px", resize:"none", outline:"none",
                              boxSizing:"border-box", fontFamily:"inherit", lineHeight:1.5 }}/>
                          {briefTeks[f.key] && <div style={{ fontSize:"10px", color:"#10B981", fontWeight:"600", marginTop:"3px" }}>✓ Tersimpan</div>}
                        </div>
                      ))}
                      <div style={{ background:"#F0FDF4", borderRadius:"10px", padding:"12px",
                        fontSize:"12px", color:"#065F46", border:"1px solid #BBF7D0", lineHeight:1.6 }}>
                        <div style={{ fontWeight:"700", marginBottom:"4px" }}>📋 Proses Selanjutnya:</div>
                        <div>1. Admin WhatsApp konfirmasi pesanan</div>
                        <div>2. Desainer kirim draft desain (1-2 hari)</div>
                        <div>3. Kamu setujui → produksi dimulai</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Kode desain */}
                <div style={{ background:"white", borderRadius:"14px", marginBottom:"12px", overflow:"hidden" }}>
                  <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid #F3F4F6", display:"flex", alignItems:"center", gap:"8px" }}>
                    <div style={{ width:"22px", height:"22px", borderRadius:"50%",
                      background:kodeDesain?"#10B981":"#E5E7EB", color:kodeDesain?"white":"#9CA3AF",
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:"900", flexShrink:0 }}>
                      {kodeDesain?"✓":"3"}
                    </div>
                    <div>
                      <div style={{ fontWeight:"800", fontSize:"14px" }}>Sudah Punya Kode Desain?</div>
                      <div style={{ fontSize:"10px", color:"#9CA3AF" }}>Opsional — isi jika sudah dapat dari desainer</div>
                    </div>
                  </div>
                  <div style={{ padding:"14px 16px" }}>
                    <input value={kodeDesain} onChange={e => setKodeDesain(e.target.value.toUpperCase())}
                      placeholder="INSTAR-XXXX"
                      style={{ width:"100%", borderRadius:"10px", border:"2px solid",
                        borderColor:kodeDesain?"#10B981":"#E5E7EB",
                        padding:"12px 14px", fontSize:"15px", fontWeight:"800",
                        outline:"none", boxSizing:"border-box",
                        letterSpacing:"3px", fontFamily:"monospace",
                        color:kodeDesain?"#10B981":"#374151", textAlign:"center" }}/>
                    {kodeDesain && <div style={{ marginTop:"8px", fontSize:"12px", color:"#10B981", fontWeight:"700", textAlign:"center" }}>✅ Kode desain tersimpan</div>}
                  </div>
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
              {[["satuan","Satuan"],["massal","Grup"]].map(([m,l]) => (
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
                      borderColor:satuanSize===sz?"#0A0A0A":"#E5E7EB",
                      background:satuanSize===sz?"#0A0A0A":"white",
                      fontWeight:"800", fontSize:"13px", cursor:"pointer",
                      color:satuanSize===sz?"#FFFFFF":"#0A0A0A" }}>{sz}</button>
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
                {biayaTambahan > 0 && (
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#9CA3AF",marginBottom:"6px" }}>
                    <span>Biaya sablon & press</span><span>{rp(biayaTambahan)} × {totalQty}</span>
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
                {biayaTambahan > 0 && (
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#9CA3AF",marginBottom:"5px" }}>
                    <span>Biaya sablon & press</span><span>{rp(biayaTambahan)} × {totalQty}</span>
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
            background: opsiDesain === "brief" ? "#0A0A0A" : "#C8392B",
            color:"white",fontWeight:"900",fontSize:"15px",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",gap:"8px" }}>
            {opsiDesain === "brief" ? "💬 Chat dengan Desainer" : "🛒 Tambah ke Keranjang"}
          </button>
        )}
      </div>
    </div>
  );
}
