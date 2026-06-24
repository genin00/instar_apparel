// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — APP.JSX (ROUTER UTAMA)
// ═══════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
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
import Support       from "./pages/Support.jsx";
import TulisReview   from "./pages/TulisReview.jsx";
import Akun          from "./pages/Akun.jsx";
import Chat          from "./pages/Chat.jsx";
import DaftarChat    from "./pages/DaftarChat.jsx";

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
  const [chatPesanan,    setChatPesanan]    = useState(null);

  useEffect(() => { save("instar_keranjang", keranjang);   }, [keranjang]);
  useEffect(() => { save("instar_wishlist",  wishlist);    }, [wishlist]);
  // Auth listener — deteksi login/logout otomatis
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

  const handleCheckout = (items) => {
    if (!akun) {
      setTab("akun");
      setHalaman(null);
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
      <Keranjang
        items={keranjang}
        onHapus={handleHapusKeranjang}
        onCheckout={handleCheckout}
        onLanjutBelanja={() => setHalaman(null)}
        onBack={() => setHalaman(null)}
      />
    );
  }

  if (halaman === "custom" && produkAktif) {
    return (
      <CustomBuilder
        produk={produkAktif}
        desainAwal={desainAwalAktif}
        onBack={() => setHalaman(null)}
        onTambahKeranjang={handleTambahKeranjang}
        onChatDesainer={handleChatDesainer}
      />
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

  const handleChatDesainer = async (item) => {
    // Auto simpan pesanan dengan status "desain"
    const orderId = "IA-" + Math.floor(100000 + Math.random() * 900000);
    const pesananBaru = {
      orderId,
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
      }),
      status: "desain",
      items: [item],
      totalQty: item.totalQty,
      totalHarga: item.totalHarga,
      nama: profilUser?.nama || akun?.email || "",
      noWA: profilUser?.no_wa || "",
      tipeBayar: "lunas",
      metodeBayar: "-",
      pengiriman: "toko",
    };
    await saveOrder(pesananBaru);
    setPesananList(prev => [pesananBaru, ...prev]);
    // Buka chat langsung
    setChatPesanan(pesananBaru);
    setHalaman("chat");
  };

  const handleBukaChat = (pesanan) => {
    setChatPesanan(pesanan);
    setHalaman("chat");
  };

  if (halaman === "daftar-chat") {
    return (
      <DaftarChat
        pesananList={pesananList}
        akun={akun}
        onBack={() => setHalaman(null)}
        onBukaChat={handleBukaChat}
      />
    );
  }

  if (halaman === "chat" && chatPesanan) {
    return (
      <Chat
        pesanan={chatPesanan}
        akun={akun}
        onBack={() => setHalaman("daftar-chat")}
      />
    );
  }

  if (halaman === "sukses") {
    const adaBrief = checkoutItems.length > 0
      ? false
      : pesananList[0]?.items?.some(i => i.opsiDesain === "brief");
    // Cek dari pesanan terbaru
    const pesananTerbaru = pesananList[0];
    const isBrief = pesananTerbaru?.items?.some(i => i.opsiDesain === "brief");

    const bukaWA = () => {
      const orderId = pesananTerbaru?.orderId || "";
      const msg = encodeURIComponent(
        `Halo Instar Apparel! 👋

Saya baru saja melakukan pesanan dengan ID: *${orderId}*

Saya belum punya desain dan ingin konsultasi dengan tim desainer. Mohon bantuannya ya! 🙏`
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
              Tim desainer akan segera menghubungimu<br/>
              via WhatsApp untuk diskusi desain.
            </>
          ) : (
            <>
              WhatsApp admin sudah terbuka.<br/>
              Jangan lupa lampirkan file desain kamu.
            </>
          )}
        </div>

        {/* Info order ID */}
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
            <button onClick={bukaWA} style={{
              background: "#25D366", color: "white", border: "none",
              borderRadius: "14px", padding: "14px 36px",
              fontSize: "14px", fontWeight: "900",
              cursor: "pointer", marginBottom: "12px", width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}>
              💬 Chat Desainer via WhatsApp
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

        <button onClick={() => { setHalaman(null); setTab("beranda"); }} style={{
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
          onLihatSemua={() => setTab("produk")}
          onLihatKarya={() => setTab("karya")}
          onBuatSepertiIni={handleBuatSepertiIni}
        onChat={() => setHalaman("daftar-chat")}
        />
      )}

      {tab === "produk" && (
        <Produk
          onCustom={handleCustom}
          onWishlist={handleWishlist}
          wishlist={wishlist}
          keranjangCount={keranjang.length}
          onKeranjang={() => setHalaman("keranjang")}
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
      <BottomNav
        aktif={tab}
        onChange={(t) => { setTab(t); setHalaman(null); }}
        keranjangCount={keranjang.length}
      />

    </div>
  );
}
