import { useState, useEffect } from "react";

export function useNavigasi() {
  const [tab, setTab] = useState("beranda");
  const [tabStack, setTabStack] = useState(["beranda"]);
  const [halaman, setHalaman] = useState(null);
  const [halamanKodeGrup, setHalamanKodeGrup] = useState(false);

  const navigateTab = (newTab) => {
    setTabStack(prev => [...prev, newTab]);
    setTab(newTab);
    setHalaman(null);
  };

  useEffect(() => {
    window.history.pushState({ page: 1 }, "", window.location.href);
    window.history.pushState({ page: 2 }, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState({ page: 2 }, "", window.location.href);
      if (halaman) {
        if (halaman === "checkout")          setHalaman("keranjang");
        else if (halaman === "tulis-review") setHalaman("pesanan");
        else if (halaman === "chat-room")    setHalaman("chat");
        else                                 setHalaman(null);
      } else if (tabStack.length > 1) {
        const newStack = tabStack.slice(0, -1);
        setTabStack(newStack);
        setTab(newStack[newStack.length - 1]);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [halaman, tab, tabStack]);

  return { tab, setTab, tabStack, setTabStack, halaman, setHalaman, halamanKodeGrup, setHalamanKodeGrup, navigateTab };
}
