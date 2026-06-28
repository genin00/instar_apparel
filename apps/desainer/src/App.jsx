import { useState, useEffect } from "react";
import supabase from "./lib/supabase.js";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ChatRoom from "./pages/ChatRoom.jsx";

export default function App() {
  const [user,      setUser]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [halaman,   setHalaman]   = useState("dashboard");
  const [convAktif, setConvAktif] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleBukaPesanan = (conv) => {
    setConvAktif(conv);
    setHalaman("chat");
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F2F2F0" }}>
      <div style={{ fontSize: "32px" }}>⏳</div>
    </div>
  );

  if (!user) return <Login onLogin={setUser} />;

  if (halaman === "chat" && convAktif) {
    return (
      <ChatRoom
        user={user}
        conversation={convAktif}
        pesanan={null}
        onBack={() => { setHalaman("dashboard"); setConvAktif(null); }}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      onLogout={() => supabase.auth.signOut()}
      onBukaPesanan={handleBukaPesanan}
    />
  );
}
