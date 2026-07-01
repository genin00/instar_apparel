import { useState } from "react";

function Avatar({ profil, size = 56 }) {
  if (profil?.foto_url) {
    return (
      <img src={profil.foto_url} alt="foto profil"
        style={{ width: size, height: size, borderRadius: size / 4,
          objectFit: "cover", flexShrink: 0 }} />
    );
  }
  const inisial = (profil?.nama || "?").charAt(0).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 4,
      background: "#C8392B", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontSize: size * 0.4, fontWeight: "900",
      color: "white", flexShrink: 0,
    }}>{inisial}</div>
  );
}


function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #F2F2F0" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", padding: "14px 0",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "12px",
        background: "none", border: "none", cursor: "pointer", textAlign: "left",
      }}>
        <div style={{ fontWeight: "600", fontSize: "13px", color: "#0A0A0A", flex: 1 }}>{q}</div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
          <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div style={{ paddingBottom: "14px", fontSize: "13px", color: "#6B7280", lineHeight: 1.6 }}>{a}</div>
      )}
    </div>
  );
}


function MenuItem({ icon, label, sub, action, danger }) {
  return (
    <button onClick={action || undefined} style={{
      width: "100%", display: "flex", alignItems: "center", gap: "14px",
      background: "none", border: "none", borderBottom: "1px solid #F2F2F0",
      padding: "14px 0", cursor: action ? "pointer" : "default", textAlign: "left",
    }}>
      <div style={{ color: danger ? "#C8392B" : "#374151", flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "600", fontSize: "13px", color: danger ? "#C8392B" : "#0A0A0A" }}>{label}</div>
        {sub && <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>{sub}</div>}
      </div>
      {action && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 18l6-6-6-6" stroke={danger ? "#C8392B" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}


function SectionCard({ title, children }) {
  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "0 16px", marginBottom: "12px" }}>
      {title && (
        <div style={{ fontSize: "11px", fontWeight: "700", color: "#9CA3AF",
          letterSpacing: "1px", padding: "14px 0 8px", borderBottom: "1px solid #F2F2F0" }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}


export { Avatar, FAQItem, MenuItem, SectionCard };
