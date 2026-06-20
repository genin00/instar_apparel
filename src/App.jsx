// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — APP.JSX (ROUTER UTAMA)
// ═══════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
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
import Support       from "./pages/Support.jsx";
import Akun          from "./pages/Akun.jsx";

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
  const [pesananList,   setPesananList]   = useState(() => load("instar_pesanan", []));
  const [akun,          setAkun]          = useState(() => load("instar_akun", null));
  const [checkoutItems, setCheckoutItems] = useState([]);

  useEffect(() => { save("instar_keranjang", keranjang);   }, [keranjang]);
  useEffect(() => { save("instar_wishlist",  wishlist);    }, [wishlist]);
  useEffect(() => { save("instar_pesanan",   pesananList); }, [pesananList]);
  useEffect(() => { save("instar_akun",      akun);        }, [akun]);

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

  const handleCheckoutSelesai = (orderId, detail) => {
    const pesananBaru = {
      orderId,
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
      }),
      status:     "diterima",
      items:      checkoutItems,
      totalQty:   checkoutItems.reduce((a, i) => a + i.totalQty, 0),
      totalHarga: checkoutItems.reduce((a, i) => a + i.totalHarga, 0),
      ...detail,
    };
    setPesananList(prev => [pesananBaru, ...prev]);
    setKeranjang(prev =>
      prev.filter(i => !checkoutItems.find(ci => ci.id === i.id))
    );
    setCheckoutItems([]);
    setHalaman("sukses");
  };

  // ── RENDER ─────────────────────────────────────────────────

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
      />
    );
  }

  if (halaman === "checkout") {
    return (
      <Checkout
        items={checkoutItems}
        onBack={() => setHalaman("keranjang")}
        onSelesai={handleCheckoutSelesai}
      />
    );
  }

  if (halaman === "pesanan") {
    return (
      <Pesanan
        pesananList={pesananList}
        onBack={() => setHalaman(null)}
      />
    );
  }

  if (halaman === "sukses") {
    return (
      <div style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "#F2F2F0", minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "32px", textAlign: "center",
      }}>
        <div style={{ fontSize: "72px", marginBottom: "16px" }}>🎉</div>
        <div style={{ fontWeight: "900", fontSize: "24px", color: "#0A0A0A", marginBottom: "8px" }}>
          Pesanan Terkirim!
        </div>
        <div style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6, marginBottom: "32px" }}>
          WhatsApp admin sudah terbuka.<br />
          Jangan lupa lampirkan file desain kamu.
        </div>
        <button onClick={() => setHalaman("pesanan")} style={{
          background: "#0A0A0A", color: "white", border: "none",
          borderRadius: "50px", padding: "13px 36px",
          fontSize: "13px", fontWeight: "900",
          letterSpacing: "1.5px", cursor: "pointer",
          marginBottom: "12px", width: "100%",
        }}>
          Lihat Pesanan Saya
        </button>
        <button onClick={() => { setHalaman(null); setTab("beranda"); }} style={{
          background: "none", border: "2px solid #E5E7EB",
          borderRadius: "50px", padding: "13px 36px",
          fontSize: "13px", fontWeight: "700",
          cursor: "pointer", width: "100%", color: "#6B7280",
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
      maxWidth:   "480px",
      margin:     "0 auto",
      position:   "relative",
    }}>

      {tab === "beranda" && (
        <Beranda
          onCustom={handleCustom}
          onWishlist={handleWishlist}
          wishlist={wishlist}
          onLihatSemua={() => setTab("produk")}
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
        />
      )}

      {tab === "karya" && (
        <div style={{ background: "#F2F2F0", minHeight: "100vh", paddingBottom: "80px" }}>
          <Header halaman="karya" judul="Karya Instar" />
          <div style={{ padding: "20px" }}>
            <KaryaInstar onBuatSepertiIni={handleBuatSepertiIni} />
          </div>
        </div>
      )}

      {tab === "support" && <Support />}

      {tab === "akun" && (
        <Akun
          akun={akun}
          onLogin={(data) => setAkun(data)}
          onLogout={() => setAkun(null)}
          onLihatPesanan={() => setHalaman("pesanan")}
        />
      )}

      <BottomNav
        aktif={tab}
        onChange={(t) => { setTab(t); setHalaman(null); }}
        keranjangCount={keranjang.length}
      />

    </div>
  );
}
