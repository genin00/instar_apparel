import Header from "../components/Header.jsx";
import KaryaInstar from "../components/KaryaInstar.jsx";
import LoginPopup from "../components/LoginPopup.jsx";
import PromoPopup from "../components/PromoPopup.jsx";
import BottomNav from "../components/BottomNav.jsx";
import Beranda from "../pages/Beranda.jsx";
import Produk from "../pages/Produk.jsx";
import Akun from "../pages/akun/index.jsx";

export default function MainLayout({
  tab, navigateTab, setHalaman, setHalamanKodeGrup,
  keranjang, wishlist, handleWishlist,
  handleCustom, handleBuatSepertiIni,
  akun, profilUser, setProfilUser, setAkun,
  pesananList, setPesananFilter,
  unreadChat, requireLogin,
  showLogin, loginPesan, setShowLogin,
  checkoutItems, setCheckoutItems,
}) {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#F2F2F0", minHeight: "100vh", position: "relative", overflowX: "hidden", maxWidth: "480px", margin: "0 auto", width: "100%" }}>
      <div style={{ width: "100%", overflowX: "hidden", boxSizing: "border-box" }}>

        {tab === "beranda" && (
          <Beranda onCustom={handleCustom} onKodeGrup={() => setHalamanKodeGrup(true)} onWishlist={handleWishlist} wishlist={wishlist} onLihatSemua={() => navigateTab("produk")} onLihatKarya={() => navigateTab("karya")} onBuatSepertiIni={handleBuatSepertiIni} />
        )}
        {tab === "produk" && (
          <Produk onCustom={handleCustom} onKodeGrup={() => setHalamanKodeGrup(true)} onWishlist={handleWishlist} wishlist={wishlist} keranjangCount={keranjang.length} onKeranjang={() => setHalaman("keranjang")}
            onKonsultasi={() => { if (!akun) { requireLogin("Login dulu untuk konsultasi"); return; } setHalaman("chat"); }} />
        )}
        {tab === "karya" && (
          <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px", overflowX: "hidden" }}>
            <Header halaman="karya" judul="Karya Instar" keranjangCount={keranjang.length} onKeranjang={() => setHalaman("keranjang")} />
            <div style={{ padding: "16px", boxSizing: "border-box", overflowX: "hidden" }}>
              <KaryaInstar onBuatSepertiIni={handleBuatSepertiIni} akun={akun} pesananList={pesananList} />
            </div>
          </div>
        )}
        {tab === "akun" && (
          <Akun akun={akun} profil={profilUser} onProfilUpdate={setProfilUser} pesananList={pesananList}
            onLogout={() => { setAkun(null); setProfilUser(null); }}
            onLihatPesanan={(filter) => { setPesananFilter(filter || null); setHalaman("pesanan"); }}
            wishlist={wishlist} onCustom={handleCustom} onKodeGrup={() => setHalamanKodeGrup(true)} />
        )}
      </div>

      {showLogin && (
        <LoginPopup pesan={loginPesan} onClose={() => { setShowLogin(false); setCheckoutItems([]); }}
          onSuccess={() => { setShowLogin(false); if (checkoutItems.length > 0) setHalaman("checkout"); }} />
      )}

      {akun && (
        <button onClick={() => setHalaman("chat")} style={{ position: "fixed", bottom: "76px", right: "16px", width: "52px", height: "52px", borderRadius: "50%", background: "#0A0A0A", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.25)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", zIndex: 99 }}>
          💬
          {unreadChat > 0 && (
            <div style={{ position: "absolute", top: "0px", right: "0px", background: "#C8392B", color: "white", fontSize: "9px", fontWeight: "800", minWidth: "17px", height: "17px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", border: "2px solid white" }}>
              {unreadChat > 9 ? "9+" : unreadChat}
            </div>
          )}
        </button>
      )}

      <PromoPopup onCta={(promo) => { if (promo.cta === "Chat Desainer") { if (!akun) { requireLogin("Login untuk chat desainer"); return; } setHalaman("chat"); } }} />
      <BottomNav aktif={tab} onChange={navigateTab} keranjangCount={keranjang.length} />
    </div>
  );
}
