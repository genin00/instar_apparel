import { useState } from "react";

export function useAuthGate() {
  const [showLogin, setShowLogin]   = useState(false);
  const [loginPesan, setLoginPesan] = useState("");
  const [pendingItem, setPendingItem] = useState(null);

  const requireLogin = (pesan) => { setLoginPesan(pesan); setShowLogin(true); };

  return { showLogin, setShowLogin, loginPesan, setLoginPesan, pendingItem, setPendingItem, requireLogin };
}
