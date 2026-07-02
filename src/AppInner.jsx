// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — APPINNER.JSX (ORKESTRATOR UTAMA)
// ═══════════════════════════════════════════════════════════
import { useEffect } from "react";
import { usePesanan } from "./hooks/usePesanan.js";
import { useNavigasi } from "./hooks/useNavigasi.js";
import { useCartWishlist } from "./hooks/useCartWishlist.js";
import { useAuthGate } from "./hooks/useAuthGate.js";
import { useCheckoutFlow } from "./hooks/useCheckoutFlow.js";
import HalamanSukses from "./pages/HalamanSukses.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import SubHalaman from "./router/SubHalaman.jsx";
import { initPushNotification } from "./services/pushNotification.js";

export default function AppInner({ akun, setAkun, profilUser, setProfilUser }) {
  useEffect(() => {
    if (akun) {
      initPushNotification("customer", akun);
    }
  }, [akun]);

  const { pesananList, setPesananList, pesananFilter, setPesananFilter, refreshPesanan } = usePesanan(akun);

  const nav = useNavigasi();
  const { keranjang, setKeranjang, wishlist, handleWishlist, handleHapusKeranjang } = useCartWishlist();
  const authGate = useAuthGate();
  const checkout = useCheckoutFlow({
    akun,
    setHalaman: nav.setHalaman,
    setPesananList,
    setKeranjang,
    requireLogin: authGate.requireLogin,
    setShowLogin: authGate.setShowLogin,
  });

  const handleTambahKeranjang = (item) => { setKeranjang(prev => [...prev, item]); nav.setHalaman("keranjang"); };

  const subResult = SubHalaman({
    halaman: nav.halaman, setHalaman: nav.setHalaman,
    halamanKodeGrup: nav.halamanKodeGrup, setHalamanKodeGrup: nav.setHalamanKodeGrup,
    keranjang, handleHapusKeranjang, handleCheckout: checkout.handleCheckout,
    produkAktif: checkout.produkAktif, desainAwalAktif: checkout.desainAwalAktif,
    chatBriefRef: checkout.chatBriefRef, chatBriefContext: checkout.chatBriefContext, setChatBriefContext: checkout.setChatBriefContext,
    showLogin: authGate.showLogin, setShowLogin: authGate.setShowLogin, loginPesan: authGate.loginPesan,
    checkoutItems: checkout.checkoutItems, setCheckoutItems: checkout.setCheckoutItems,
    pendingItem: authGate.pendingItem, setPendingItem: authGate.setPendingItem,
    handleTambahKeranjang, handleChatDesainer: checkout.handleChatDesainer,
    akun, handleCheckoutSelesai: checkout.handleCheckoutSelesai,
    reviewTarget: checkout.reviewTarget, setReviewTarget: checkout.setReviewTarget,
    pesananList, pesananFilter, setPesananFilter, refreshPesanan,
    chatConv: checkout.chatConv, setChatConv: checkout.setChatConv,
    handleAccDesain: checkout.handleAccDesain, navigateTab: nav.navigateTab,
  });
  if (subResult) return subResult;

  if (nav.halaman === "sukses") {
    return <HalamanSukses pesananList={pesananList} setHalaman={nav.setHalaman} navigateTab={nav.navigateTab} />;
  }

  return (
    <MainLayout
      tab={nav.tab} navigateTab={nav.navigateTab} setHalaman={nav.setHalaman}
      setHalamanKodeGrup={nav.setHalamanKodeGrup}
      keranjang={keranjang} wishlist={wishlist} handleWishlist={handleWishlist}
      handleCustom={checkout.handleCustom} handleBuatSepertiIni={checkout.handleBuatSepertiIni}
      akun={akun} profilUser={profilUser} setProfilUser={setProfilUser} setAkun={setAkun}
      pesananList={pesananList} setPesananFilter={setPesananFilter}
      requireLogin={authGate.requireLogin}
      showLogin={authGate.showLogin} loginPesan={authGate.loginPesan} setShowLogin={authGate.setShowLogin}
      checkoutItems={checkout.checkoutItems} setCheckoutItems={checkout.setCheckoutItems}
    />
  );
}
