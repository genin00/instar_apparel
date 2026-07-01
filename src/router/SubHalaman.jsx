import Keranjang     from "../pages/Keranjang.jsx";
import CustomBuilder from "../pages/customBuilder/index.jsx";
import Checkout      from "../pages/checkout/index.jsx";
import Pesanan       from "../pages/pesanan/index.jsx";
import TulisReview   from "../pages/TulisReview.jsx";
import KodeGrup      from "../pages/KodeGrup.jsx";
import ChatRoom      from "../pages/chatRoom/index.jsx";
import ChatCenter    from "../pages/ChatCenter.jsx";
import LoginPopup    from "../components/LoginPopup.jsx";
import config        from "../config.js";

export default function SubHalaman({
  halaman, setHalaman,
  halamanKodeGrup, setHalamanKodeGrup,
  keranjang, handleHapusKeranjang, handleCheckout,
  produkAktif, desainAwalAktif,
  chatBriefRef, chatBriefContext, setChatBriefContext,
  showLogin, setShowLogin, loginPesan,
  checkoutItems, setCheckoutItems,
  pendingItem, setPendingItem,
  handleTambahKeranjang, handleChatDesainer,
  akun, handleCheckoutSelesai,
  reviewTarget, setReviewTarget,
  pesananList, pesananFilter, setPesananFilter, refreshPesanan,
  chatConv, setChatConv,
  handleAccDesain, navigateTab,
}) {

  if (halaman === "keranjang") {
    return (
      <>
        <Keranjang
          items={keranjang}
          onHapus={handleHapusKeranjang}
          onCheckout={handleCheckout}
          onLanjutBelanja={() => setHalaman(null)}
          onBack={() => setHalaman(null)}
        />
        {showLogin && (
          <LoginPopup
            pesan={loginPesan}
            onClose={() => { setShowLogin(false); setCheckoutItems([]); }}
            onSuccess={() => { setShowLogin(false); if (checkoutItems.length > 0) setHalaman("checkout"); }}
          />
        )}
      </>
    );
  }

  if (halaman === "custom" && produkAktif) {
    return (
      <>
        {showLogin && (
          <LoginPopup
            pesan={loginPesan}
            onClose={() => { setShowLogin(false); setPendingItem(null); }}
            onSuccess={() => {
              setShowLogin(false);
              if (chatBriefRef.current) setHalaman("chat");
              else if (pendingItem) setPendingItem(null);
            }}
          />
        )}
        <CustomBuilder
          produk={produkAktif}
          desainAwal={desainAwalAktif}
          onBack={() => setHalaman(null)}
          onTambahKeranjang={handleTambahKeranjang}
          onChatDesainer={handleChatDesainer}
        />
      </>
    );
  }

  if (halaman === "checkout") {
    return (
      <Checkout
        akun={akun}
        items={checkoutItems}
        onBack={() => setHalaman("keranjang")}
        onSelesai={handleCheckoutSelesai}
      />
    );
  }

  if (halaman === "tulis-review" && reviewTarget) {
    return (
      <TulisReview
        pesanan={reviewTarget.pesanan}
        item={reviewTarget.item}
        akun={akun}
        onBack={() => setHalaman("pesanan")}
        onSelesai={() => setHalaman("pesanan")}
      />
    );
  }

  if (halaman === "pesanan") {
    return (
      <Pesanan
        pesananList={pesananList}
        filterStatus={pesananFilter}
        onBack={() => { setPesananFilter(null); setHalaman(null); }}
        onRefresh={refreshPesanan}
        onBeriUlasan={(pesanan) => {
          const item = pesanan.items?.[0];
          if (!item) return;
          setReviewTarget({ pesanan, item });
          setHalaman("tulis-review");
        }}
      />
    );
  }

  if (halamanKodeGrup) {
    return (
      <KodeGrup
        akun={akun}
        onBack={() => setHalamanKodeGrup(false)}
        onLihatKarya={() => { setHalamanKodeGrup(false); navigateTab("karya"); }}
      />
    );
  }

  if (halaman === "chat-room" && chatConv) {
    return (
      <ChatRoom
        akun={akun}
        conversation={chatConv}
        onBack={() => { setChatConv(null); setHalaman("chat"); }}
        onAccDesain={handleAccDesain}
      />
    );
  }

  if (halaman === "chat") {
    return (
      <ChatCenter
        akun={akun}
        pesananList={pesananList}
        keranjangCount={keranjang.length}
        briefContext={chatBriefRef.current || chatBriefContext}
        onKeranjang={() => setHalaman("keranjang")}
        onBack={() => { chatBriefRef.current = null; setChatBriefContext(null); setHalaman(null); }}
        onOpenRoom={(conv) => { chatBriefRef.current = null; setChatBriefContext(null); setChatConv(conv); setHalaman("chat-room"); }}
      />
    );
  }

  return null;
}
