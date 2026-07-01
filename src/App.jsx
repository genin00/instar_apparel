// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — APP.JSX (LOADING / INTRO / AUTH GATE)
// ═══════════════════════════════════════════════════════════
import { useState } from "react";
import { useAuth } from "./hooks/useAuth.js";
import { ChatProvider } from "./context/ChatContext.jsx";
import Intro from "./pages/Intro.jsx";
import AppInner from "./AppInner.jsx";

const cekIntroHariIni = () => { try { return localStorage.getItem("instar_intro_tanggal") === new Date().toDateString(); } catch { return false; } };
const simpanIntroHariIni = () => { try { localStorage.setItem("instar_intro_tanggal", new Date().toDateString()); } catch {} };

export default function App() {
  const { akun, setAkun, profilUser, setProfilUser, authLoading } = useAuth();
  const [introSelesai, setIntroSelesai] = useState(() => cekIntroHariIni());

  if (authLoading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F2F2F0" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
        <div style={{ fontSize: "13px", color: "#9CA3AF" }}>Memuat...</div>
      </div>
    </div>
  );

  if (!introSelesai) return <Intro onSelesai={() => { simpanIntroHariIni(); setIntroSelesai(true); }} />;

  return (
    <ChatProvider akun={akun}>
      <AppInner
        akun={akun}
        setAkun={setAkun}
        profilUser={profilUser}
        setProfilUser={setProfilUser}
      />
    </ChatProvider>
  );
}
