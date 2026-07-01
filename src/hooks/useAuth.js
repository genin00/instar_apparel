import { useState, useEffect } from "react";
import { getSession, getProfil, onAuthStateChange } from "../lib/auth.js";

export function useAuth() {
  const [akun,        setAkun]        = useState(null);
  const [profilUser,  setProfilUser]  = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    getSession().then(async (session) => {
      if (session?.user) {
        setAkun(session.user);
        try {
          const profil = await getProfil(session.user.id);
          setProfilUser(profil);
        } catch {}
      }
      setAuthLoading(false);
    });

    const subscription = onAuthStateChange(async (session) => {
      if (session?.user) {
        setAkun(session.user);
        try {
          const profil = await getProfil(session.user.id);
          setProfilUser(profil);
        } catch {}
      } else {
        setAkun(null);
        setProfilUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { akun, setAkun, profilUser, setProfilUser, authLoading };
}
