// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — APP.JSX (ROUTER UTAMA)
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase.js";
import { getProfil } from "./lib/auth.js";
import BottomNav     from "./components/BottomNav.jsx";
import Header        from "./components/Header.jsx";
import KaryaInstar   from "./components/KaryaInstar.jsx";
import Intro         from "./pages/Intro.jsx";
import Beranda       from "./pages/Beranda.jsx";
import Produk        from "./pages/Produk.jsx";
import CustomBuilder from "./pages/CustomBuilder.jsx";
import Keranjang     from "./pages/Keranjang.jsx";
import Checkout      from "./pages/Checkout.jsx";
import Pesanan       from "./pages/Pesanan.jsx";
import Wishlist      from "./pages/Wishlist.jsx";
import config from "./config.js";
import { saveOrder, getOrders } from "./services/orderService.js";
import TulisReview   from "./pages/TulisReview.jsx";
import Akun          from "./pages/Akun.jsx";
import LoginPopup    from "./components/LoginPopup.jsx";
import ChatCenter    from "./pages/ChatCenter.jsx";
import PromoPopup    from "./components/PromoPopup.jsx";
import ChatRoom      from "./pages/ChatRoom.jsx";
import { getTotalUnread, subscribeToConversations } from "./lib/chatService.js";

const load = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch { return fallback; }
};

const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

const cekIntroHariIni = () => {
  try {
    const terakhir = localStorage.getItem("instar_intro_tanggal");
    return terakhir === new Date().toDateString();
  } catch { return false; }
};

const simpanIntroHariIni = () => {
  try {
    localStorage.setItem("instar_intro_tanggal", new Date().toDateString());
  } catch {}
};

export default function App() {
  const [introSelesai,  setIntroSelesai]  = useState(() => cekIntroHariIni());
  const [tab,           setTab]           = useState("beranda");
  const [tabStack,      setTabStack]      = useState(["beranda"]);
  const [halaman,       setHalaman]       = useState(null);
  const [produkAktif,   setProdukAktif]   = useState(null);
  const [desainAwalAktif, setDesainAwalAktif] = useState(null);
  const [keranjang,     setKeranjang]     = useState(() => load("instar_keranjang", []));
  const [wishlist,      setWishlist]      = useState(() => load("instar_wishlist", []));
  const [pesananList,   setPesananList]   = useState(() => { try { const v = localStorage.getItem("instar_pesanan"); return v ? JSON.parse(v) : []; } catch { return []; } });
  const [akun,          setAkun]          = useState(null);
  const [profilUser,    setProfilUser]    = useState(null);
  const [authLoading,   setAuthLoading]   = useState(true);
  const [checkoutItems,  setCheckoutItems]  = useState([]);
  const [reviewTarget,   setReviewTarget]   = useState(null);
  const [pesananFilter,  setPesananFilter]  = useState(null);
  const [customStep,     setCustomStep]     = useState(0);
  const [showLogin,      setShowLogin]      = useState(false);
  const [loginPesan,     setLoginPesan]     = useState("");
  const [pendingItem,    setPendingItem]    = useState(null);
  const [chatConv,       setChatConv]       = useState(null);
  const [chatBriefContext, setChatBriefContext] = useState(null);

  const navigateTab = (newTab) => {
    setTabStack(prev => [...prev, newTab]);
    setTab(newTab);
    setHalaman(null);
  };
  const [unreadChat,     setUnreadChat]     = useState(0);

  useEffect(() => { save("instar_keranjang", keranjang); }, [keranjang]);
  useEffect(() => { save("instar_wishlist",  wishlist);  }, [wishlist]);

  // ── Handle tombol back Android ──────────────────────────────
  useEffect(() => {
    // Selalu push 2 state — satu sebagai "buffer" yang akan di-pop,
    // satu lagi sebagai posisi aktif. Sehingga back button tidak pernah
    // keluar dari aplikasi.
    window.history.pushState({ page: 1 }, "", window.location.href);
    window.history.pushState({ page: 2 }, "", window.location.href);

    const handlePopState = (e) => {
      // Langsung push lagi agar browser tidak bisa keluar
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
      // Kalau sudah di beranda, tidak lakukan apa-apa (tidak keluar app)
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [halaman, tab, tabStack]);

  // ── Auth listener ────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setAkun(session.user);
        try {
          const profil = await getProfil(session.user.id);
          setProfilUser(profil);
        } catch {}
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  // ── Badge unread chat ────────────────────────────────────────
  useEffect(() => {
    if (!akun) { setUnreadChat(0); return; }

    getTotalUnread(akun.id).then(setUnreadChat);

    const channel = subscribeToConversations(akun.id, async () => {
      const total = await getTotalUnread(akun.id);
      setUnreadChat(total);
    });

    return () => channel.unsubscribe();
  }, [akun]);

  const handleIntroSelesai = () => {
    simpanIntroHariIni();
    setIntroSelesai(true);
  };

  const handleCustom = (produk) => {
    setProdukAktif(produk);
    setDesainAwalAktif(null);
    setHalaman("custom");
  };

  const handleBuatSepertiIni = (karyaItem, produkDasar) => {
    setProdukAktif(produkDasar);
    setDesainAwalAktif(karyaItem);
    setHalaman("custom");
  };

  const handleWishlist = (produk) => {
    setWishlist(prev => {
      const ada = prev.some(w => w.id === produk.id);
      return ada ? prev.filter(w => w.id !== produk.id) : [...prev, produk];
    });
  };

  const handleTambahKeranjang = (item) => {
    setKeranjang(prev => [...prev, item]);
    setHalaman("keranjang");
  };

  const handleHapusKeranjang = (id) => {
    setKeranjang(prev => prev.filter(i => i.id !== id));
  };

  const chatBriefRef = useRef(null);

  const handleChatDesainer = (briefData) => {
    if (!akun) {
      chatBriefRef.current = briefData;
      setChatBriefContext(briefData);
      setLoginPesan("Login dulu untuk chat dengan desainer");
      setShowLogin(true);
      return;
    }
    chatBriefRef.current = briefData;
    setChatBriefContext(briefData);
    setHalaman("chat");
  };

  const requireLogin = (pesan) => {
    setLoginPesan(pesan);
    setShowLogin(true);
  };

  const handleAccDesain = (conversation) => {
    const meta = conversation.metadata || {};
    const items = [{
      id:          'brief-' + Date.now(),
      produk:      meta.produk || { nama: 'Kaos Custom' },
      nama:        meta.produk?.nama || 'Kaos Custom',
      warna:       meta.warna || null,
      warnaLabel:  meta.warnaLabel || '-',
      opsiDesain:  'brief',
      briefKat:    meta.briefKat || '-',
      briefTeks:   meta.briefTeks || {},
      modeUkuran:  meta.modeUkuran || 'satuan',
      satuanSize:  meta.satuanSize || '-',
      satuanQty:   meta.satuanQty || 1,
      massalQty:   meta.massalQty || null,
      totalQty:    meta.totalQty || 1,
      totalHarga:  meta.totalHarga || 0,
      conversationId: conversation.id,
    }];
    handleCheckout(items);
  };

  const handleCheckout = (items) => {
    if (!akun) {
      setCheckoutItems(items);
      requireLogin("Login untuk melanjutkan checkout");
      return;
    }
    setCheckoutItems(items);
    setHalaman("checkout");
  };

  const handleCheckoutSelesai = async (orderId, detail) => {
    const pesananBaru = {
      orderId,
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
      }),
      status: checkoutItems.every(i => i.opsiDesain === "brief") ? "desain" : "diterima",
      items:      checkoutItems,
      totalQty:   checkoutItems.reduce((a, i) => a + i.totalQty, 0),
      totalHarga: checkoutItems.reduce((a, i) => a + i.totalHarga, 0),
      ...detail,
    };
    await saveOrder(pesananBaru);
    setPesananList(prev => [pesananBaru, ...prev]);
    setKeranjang(prev =>
      prev.filter(i => !checkoutItems.find(ci => ci.id === i.id))
    );
    setCheckoutItems([]);
    setHalaman("pesanan");
  };

  // ── RENDER ─────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        background: "#F2F2F0",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
          <div style={{ fontSize: "13px", color: "#9CA3AF" }}>Memuat...</div>
        </div>
      </div>
    );
  }

  if (!introSelesai) {
    return <Intro onSelesai={handleIntroSelesai} />;
  }

  // ── SUB HALAMAN (tanpa BottomNav) ──

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
            onSuccess={() => {
              setShowLogin(false);
              if (checkoutItems.length > 0) setHalaman("checkout");
            }}
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
              if (chatBriefRef.current) {
                setHalaman("chat");
              } else if (pendingItem) {
                setPendingItem(null);
              }
            }}
          />
        )}
        <CustomBuilder
          produk={produkAktif}
          desainAwal={desainAwalAktif}
          onBack={() => setHalaman(null)}
          onTambahKeranjang={handleTambahKeranjang}
          onStepChange={setCustomStep}
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

  if (halaman === "sukses") {
    const pesananTerbaru = pesananList[0];
    const isBrief = pesananTerbaru?.items?.some(i => i.opsiDesain === "brief");

    const bukaWA = () => {
      const orderId = pesananTerbaru?.orderId || "";
      const msg = encodeURIComponent(
        `Halo Instar Apparel! 👋\n\nSaya baru saja melakukan pesanan dengan ID: *${orderId}*\n\nSaya belum punya desain dan ingin konsultasi dengan tim desainer. Mohon bantuannya ya! 🙏`
      );
      window.open(`https://wa.me/${config.whatsapp.desainer}?text=${msg}`, "_blank");
    };

    return (
      <div style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "#F2F2F0", minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "32px", textAlign: "center",
      }}>
        <div style={{ fontSize: "72px", marginBottom: "16px" }}>
          {isBrief ? "🎨" : "🎉"}
        </div>
        <div style={{ fontWeight: "900", fontSize: "24px", color: "#0A0A0A", marginBottom: "8px" }}>
          {isBrief ? "Pesanan Diterima!" : "Pesanan Terkirim!"}
        </div>
        <div style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6, marginBottom: "24px" }}>
          {isBrief ? (
            <>
              Pesananmu sudah masuk ke sistem kami.<br/>
              Lanjutkan konsultasi desain dengan tim kami<br/>
              langsung di dalam aplikasi.
            </>
          ) : (
            <>
              Pesananmu berhasil dibuat.<br/>
              Pantau status di halaman Pesanan.
            </>
          )}
        </div>

        {pesananTerbaru?.orderId && (
          <div style={{
            background: "white", borderRadius: "14px", padding: "14px 20px",
            marginBottom: "24px", width: "100%",
            border: "1px solid #E5E7EB",
          }}>
            <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "4px" }}>ID Pesanan</div>
            <div style={{ fontWeight: "900", fontSize: "18px", letterSpacing: "2px", color: "#0A0A0A" }}>
              {pesananTerbaru.orderId}
            </div>
            <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>
              Simpan ID ini untuk cek status pesanan
            </div>
          </div>
        )}

        {isBrief ? (
          <>
            <button
              onClick={() => {
                const conv = null; // akan dibuat otomatis di ChatCenter
                setHalaman("chat");
              }}
              style={{
                background: "#0A0A0A", color: "white", border: "none",
                borderRadius: "14px", padding: "14px 36px",
                fontSize: "14px", fontWeight: "900",
                cursor: "pointer", marginBottom: "12px", width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              💬 Chat Desainer Sekarang
            </button>
            <button onClick={() => setHalaman("pesanan")} style={{
              background: "white", border: "2px solid #E5E7EB",
              borderRadius: "14px", padding: "13px 36px",
              fontSize: "13px", fontWeight: "700",
              cursor: "pointer", marginBottom: "12px", width: "100%", color: "#374151",
            }}>
              Lihat Pesanan Saya
            </button>
          </>
        ) : (
          <button onClick={() => setHalaman("pesanan")} style={{
            background: "#0A0A0A", color: "white", border: "none",
            borderRadius: "14px", padding: "13px 36px",
            fontSize: "13px", fontWeight: "900",
            cursor: "pointer", marginBottom: "12px", width: "100%",
          }}>
            Lihat Pesanan Saya
          </button>
        )}

        <button onClick={() => { setHalaman(null); navigateTab("beranda"); }} style={{
          background: "none", border: "none",
          fontSize: "13px", fontWeight: "600",
          cursor: "pointer", width: "100%", color: "#9CA3AF",
        }}>
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // ── HALAMAN UTAMA (dengan BottomNav) ──
  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      background: "#F2F2F0",
      minHeight:  "100vh",
      position:   "relative",
      overflowX:  "hidden",
      maxWidth:   "480px",
      margin:     "0 auto",
      width:      "100%",
    }}>

      <div style={{ width: "100%", overflowX: "hidden", boxSizing: "border-box" }}>
        {tab === "beranda" && (
          <Beranda
            onCustom={handleCustom}
            onWishlist={handleWishlist}
            wishlist={wishlist}
            onLihatSemua={() => navigateTab("produk")}
            onLihatKarya={() => navigateTab("karya")}
            onBuatSepertiIni={handleBuatSepertiIni}
          />
        )}

        {tab === "produk" && (
          <Produk
            onCustom={handleCustom}
            onWishlist={handleWishlist}
            wishlist={wishlist}
            keranjangCount={keranjang.length}
            onKeranjang={() => setHalaman("keranjang")}
            onKonsultasi={() => {
              if (!akun) {
                setLoginPesan("Login dulu untuk konsultasi dengan desainer");
                setShowLogin(true);
                return;
              }
              setHalaman("chat");
            }}
          />
        )}

        {tab === "karya" && (
          <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px", overflowX: "hidden" }}>
            <Header halaman="karya" judul="Karya Instar"
              keranjangCount={keranjang.length}
              onKeranjang={() => setHalaman("keranjang")} />
            <div style={{ padding: "16px", boxSizing: "border-box", overflowX: "hidden" }}>
              <KaryaInstar onBuatSepertiIni={handleBuatSepertiIni} akun={akun} pesananList={pesananList} />
            </div>
          </div>
        )}

        {tab === "akun" && (
          <Akun
            akun={akun}
            profil={profilUser}
            onProfilUpdate={(p) => setProfilUser(p)}
            pesananList={pesananList}
            onLogout={() => { setAkun(null); setProfilUser(null); }}
            onLihatPesanan={(filter) => { setPesananFilter(filter || null); setHalaman("pesanan"); }}
            wishlist={wishlist}
            onCustom={handleCustom}
          />
        )}
      </div>

      {showLogin && (
        <LoginPopup
          pesan={loginPesan}
          onClose={() => { setShowLogin(false); setCheckoutItems([]); }}
          onSuccess={() => {
            setShowLogin(false);
            if (checkoutItems.length > 0) setHalaman("checkout");
          }}
        />
      )}

      {/* ── FLOATING CHAT BUTTON ── */}
      {akun && (
        <button
          onClick={() => setHalaman("chat")}
          style={{
            position:       "fixed",
            bottom:         "76px",
            right:          "16px",
            width:          "52px",
            height:         "52px",
            borderRadius:   "50%",
            background:     "#0A0A0A",
            border:         "none",
            boxShadow:      "0 4px 16px rgba(0,0,0,0.25)",
            cursor:         "pointer",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            fontSize:       "22px",
            zIndex:         99,
          }}
        >
          💬
          {unreadChat > 0 && (
            <div style={{
              position:       "absolute",
              top:            "0px",
              right:          "0px",
              background:     "#C8392B",
              color:          "white",
              fontSize:       "9px",
              fontWeight:     "800",
              minWidth:       "17px",
              height:         "17px",
              borderRadius:   "10px",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              padding:        "0 4px",
              border:         "2px solid white",
            }}>
              {unreadChat > 9 ? "9+" : unreadChat}
            </div>
          )}
        </button>
      )}

      <PromoPopup
        onCta={(promo) => {
          if (promo.cta === "Chat Desainer") {
            if (!akun) { setLoginPesan("Login untuk chat desainer"); setShowLogin(true); return; }
            setHalaman("chat");
          }
        }}
      />
      <BottomNav
        aktif={tab}
        onChange={(t) => navigateTab(t)}
        keranjangCount={keranjang.length}
      />

    </div>
  );
}

