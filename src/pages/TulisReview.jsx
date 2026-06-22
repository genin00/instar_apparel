// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — TULIS ULASAN
// ═══════════════════════════════════════════════════════════
import { useState, useRef } from "react";
import Header from "../components/Header.jsx";
import { saveReview } from "../services/reviewService.js";

function Bintang({ nilai, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display:"flex", gap:"6px" }}>
      {[1,2,3,4,5].map(i => (
        <button key={i} onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
          style={{ background:"none", border:"none", cursor:"pointer", padding:"2px", fontSize:"42px", lineHeight:1 }}>
          <span style={{ color: i<=(hover||nilai) ? "#F59E0B" : "#E5E7EB", display:"block" }}>★</span>
        </button>
      ))}
    </div>
  );
}

export default function TulisReview({ pesanan, item, akun, onBack, onSelesai }) {
  const [rating,  setRating]  = useState(0);
  const [teks,    setTeks]    = useState("");
  const [media,   setMedia]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const fileRef = useRef();
  const label = ["","Kecewa 😞","Kurang Puas 😕","Cukup 😐","Puas 😊","Sangat Puas 🤩"];

  const handleMedia = (e) => {
    Array.from(e.target.files).slice(0, 6-media.length).forEach(file => {
      if (file.type.startsWith("video/")) {
        setMedia(prev => [...prev, { type:"video", url:URL.createObjectURL(file), persisted:false }]);
      } else {
        const r = new FileReader();
        r.onload = ev => setMedia(prev => [...prev, { type:"image", url:ev.target.result, persisted:true }]);
        r.readAsDataURL(file);
      }
    });
    e.target.value = "";
  };

  const hapus = (idx) => setMedia(prev => { if (!prev[idx].persisted) URL.revokeObjectURL(prev[idx].url); return prev.filter((_,i)=>i!==idx); });

  const handleSubmit = async () => {
    if (!rating) { setError("Pilih rating dulu!"); return; }
    setError(""); setLoading(true);
    await saveReview({
      id: "rev_"+Date.now(), produkId: item.produk.id, orderId: pesanan.orderId,
      userName: akun?.nama||"Anonim", rating, teks: teks.trim(),
      media: media.filter(m=>m.persisted).map(m=>({ type:m.type, url:m.url })),
      videoCount: media.filter(m=>!m.persisted).length,
      tanggal: new Date().toLocaleDateString("id-ID",{ day:"2-digit", month:"short", year:"numeric" }),
    });
    setLoading(false); onSelesai?.();
  };

  const mockup = item.produk?.id==="lengan-panjang" ? "/mockup-panjang.png" : item.produk?.id==="rib" ? "/mockup-rib.png" : "/mockup-pendek.png";

  return (
    <div style={{ background:"#F2F2F0", minHeight:"100vh", paddingBottom:"100px", fontFamily:"'Inter',system-ui,sans-serif" }}>
      <Header halaman="review" judul="Tulis Ulasan" onBack={onBack} />
      <div style={{ padding:"16px", maxWidth:"480px", margin:"0 auto" }}>

        <div style={{ background:"white", borderRadius:"14px", padding:"14px", marginBottom:"12px", display:"flex", gap:"12px", alignItems:"center" }}>
          <img src={mockup} alt="" style={{ width:"48px", height:"auto", borderRadius:"8px", flexShrink:0 }} />
          <div>
            <div style={{ fontWeight:"800", fontSize:"14px" }}>{item.produk.nama}</div>
            <div style={{ fontSize:"11px", color:"#9CA3AF", marginTop:"2px" }}>{item.warnaLabel} · {pesanan.orderId}</div>
          </div>
        </div>

        <div style={{ background:"white", borderRadius:"14px", padding:"20px 16px", marginBottom:"12px", textAlign:"center" }}>
          <div style={{ fontWeight:"700", fontSize:"13px", color:"#374151", marginBottom:"16px" }}>Seberapa puas kamu dengan produk ini?</div>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"10px" }}><Bintang nilai={rating} onChange={setRating} /></div>
          <div style={{ fontWeight:"700", fontSize:"15px", color: rating ? "#F59E0B" : "#D1D5DB", minHeight:"22px" }}>{label[rating]}</div>
        </div>

        <div style={{ background:"white", borderRadius:"14px", padding:"16px", marginBottom:"12px" }}>
          <div style={{ fontWeight:"700", fontSize:"13px", color:"#374151", marginBottom:"8px" }}>Ceritakan pengalamanmu <span style={{ color:"#9CA3AF", fontWeight:"400" }}>(opsional)</span></div>
          <textarea value={teks} onChange={e=>setTeks(e.target.value.slice(0,500))} placeholder="Bagikan pengalaman kamu..."
            style={{ width:"100%", minHeight:"100px", borderRadius:"10px", border:"2px solid #E5E7EB", padding:"10px 12px", fontSize:"14px", outline:"none", resize:"none", fontFamily:"inherit", boxSizing:"border-box", lineHeight:1.5 }} />
          <div style={{ fontSize:"11px", color:"#9CA3AF", textAlign:"right", marginTop:"4px" }}>{teks.length}/500</div>
        </div>

        <div style={{ background:"white", borderRadius:"14px", padding:"16px", marginBottom:"12px" }}>
          <div style={{ fontWeight:"700", fontSize:"13px", color:"#374151", marginBottom:"12px" }}>Tambah Foto / Video <span style={{ color:"#9CA3AF", fontWeight:"400" }}>(maks. 6)</span></div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {media.map((m,idx) => (
              <div key={idx} style={{ position:"relative", width:"80px", height:"80px", flexShrink:0 }}>
                {m.type==="video"
                  ? <video src={m.url} style={{ width:"80px", height:"80px", objectFit:"cover", borderRadius:"10px", background:"#000" }} />
                  : <img src={m.url} alt="" style={{ width:"80px", height:"80px", objectFit:"cover", borderRadius:"10px" }} />}
                {m.type==="video" && <div style={{ position:"absolute", bottom:"5px", left:"5px", background:"rgba(0,0,0,0.65)", borderRadius:"4px", padding:"2px 5px", fontSize:"9px", color:"white", fontWeight:"700" }}>▶ VIDEO</div>}
                <button onClick={()=>hapus(idx)} style={{ position:"absolute", top:"-7px", right:"-7px", background:"#C8392B", color:"white", border:"2px solid white", borderRadius:"50%", width:"22px", height:"22px", fontSize:"13px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0 }}>×</button>
              </div>
            ))}
            {media.length < 6 && (
              <button onClick={()=>fileRef.current?.click()} style={{ width:"80px", height:"80px", borderRadius:"10px", border:"2px dashed #D1D5DB", background:"#F9FAFB", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"4px" }}>
                <span style={{ fontSize:"26px" }}>📷</span>
                <span style={{ fontSize:"10px", color:"#9CA3AF", fontWeight:"600" }}>Tambah</span>
              </button>
            )}
          </div>
          <div style={{ fontSize:"10px", color:"#9CA3AF", marginTop:"10px", lineHeight:1.5 }}>📸 Foto tersimpan · 🎥 Video hanya tampil sesi ini</div>
          <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={handleMedia} style={{ display:"none" }} />
        </div>

        {error && <div style={{ background:"#FEF2F2", border:"1px solid #FCA5A5", borderRadius:"10px", padding:"10px 14px", fontSize:"13px", color:"#C8392B", fontWeight:"600", marginBottom:"12px" }}>⚠️ {error}</div>}
      </div>

      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"white", borderTop:"1px solid #E5E7EB", padding:"14px 16px", maxWidth:"480px", margin:"0 auto" }}>
        <button onClick={handleSubmit} disabled={!rating||loading} style={{ width:"100%", padding:"14px", borderRadius:"12px", border:"none", background: rating ? "#C8392B" : "#E5E7EB", color: rating ? "white" : "#9CA3AF", fontWeight:"900", fontSize:"15px", cursor: rating ? "pointer" : "not-allowed", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Menyimpan..." : "⭐ Kirim Ulasan"}
        </button>
      </div>
    </div>
  );
}
