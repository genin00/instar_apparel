import { useState, useEffect } from "react";

const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

export function useCartWishlist() {
  const [keranjang, setKeranjang] = useState(() => load("instar_keranjang", []));
  const [wishlist,  setWishlist]  = useState(() => load("instar_wishlist", []));

  useEffect(() => { save("instar_keranjang", keranjang); }, [keranjang]);
  useEffect(() => { save("instar_wishlist",  wishlist);  }, [wishlist]);

  const handleWishlist = (produk) => {
    setWishlist(prev => prev.some(w => w.id === produk.id) ? prev.filter(w => w.id !== produk.id) : [...prev, produk]);
  };
  const handleHapusKeranjang = (id) => {
    setKeranjang(prev => prev.filter(i => i.id !== id));
  };

  return { keranjang, setKeranjang, wishlist, setWishlist, handleWishlist, handleHapusKeranjang };
}
