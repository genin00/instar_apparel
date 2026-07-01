import { useState } from "react";

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

export default ColorPicker;
