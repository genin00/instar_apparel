import { useState, useEffect } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DetailPesanan from "./pages/DetailPesanan.jsx";
import supabase from "./lib/supabase.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [halaman, setHalaman] = useState("dashboard");
  const [pesananAktif, setPesananAktif] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#F2F2F0" }}>
      <div style={{ fontSize: "32px" }}>⏳</div>
    </div>
  );

  if (!user) return <Login onLogin={setUser} />;

  if (halaman === "detail" && pesananAktif) {
    return (
      <DetailPesanan
        pesanan={pesananAktif}
        user={user}
        onBack={() => { setHalaman("dashboard"); setPesananAktif(null); }}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      onLogout={() => supabase.auth.signOut()}
      onBukaPesanan={(p) => { setPesananAktif(p); setHalaman("detail"); }}
    />
  );
}
