import { useState, useRef } from "react";
import { saveOrder } from "../services/orderService.js";
import { supabase } from "../lib/supabase.js";
import { getOrCreateConversation } from "../lib/chatService.js";

export function useCheckoutFlow({ akun, setHalaman, setPesananList, setKeranjang, requireLogin, setShowLogin }) {
  const [produkAktif, setProdukAktif]         = useState(null);
  const [desainAwalAktif, setDesainAwalAktif] = useState(null);
  const [checkoutItems, setCheckoutItems]     = useState([]);
  const [reviewTarget, setReviewTarget]       = useState(null);
  const [chatConv, setChatConv]               = useState(null);
  const [chatBriefContext, setChatBriefContext] = useState(null);
  const chatBriefRef = useRef(null);

  const handleCustom = (produk) => { setProdukAktif(produk); setDesainAwalAktif(null); setHalaman("custom"); };
  const handleBuatSepertiIni = (karya, produk) => { setProdukAktif(produk); setDesainAwalAktif(karya); setHalaman("custom"); };

  const handleChatDesainer = (briefData) => {
    if (!akun) { chatBriefRef.current = briefData; setChatBriefContext(briefData); requireLogin("Login dulu untuk chat dengan desainer"); setShowLogin(true); return; }
    chatBriefRef.current = briefData; setChatBriefContext(briefData); setHalaman("chat");
  };

  const handleCheckout = (items) => {
    if (!akun) { setCheckoutItems(items); requireLogin("Login untuk melanjutkan checkout"); return; }
    setCheckoutItems(items); setHalaman("checkout");
  };

  const handleCheckoutSelesai = async (orderId, detail) => {
    const pesananBaru = {
      orderId,
      tanggal: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      status: checkoutItems.every(i => i.opsiDesain === "brief") ? "desain" : "diterima",
      customerId: akun?.id || null,
      items: checkoutItems,
      totalQty: checkoutItems.reduce((a, i) => a + i.totalQty, 0),
      totalHarga: checkoutItems.reduce((a, i) => a + i.totalHarga, 0),
      ...detail,
    };
    await saveOrder(pesananBaru);

    await getOrCreateConversation(akun.id, orderId, {
      source: "checkout",
      totalQty: pesananBaru.totalQty,
      totalHarga: pesananBaru.totalHarga,
      items: pesananBaru.items,
    });
  const convId = checkoutItems.find(i => i.conversationId)?.conversationId;
  if (convId) {
    await supabase
      .from("conversations")
      .update({ order_id: orderId })
      .eq("id", convId);
  }

    setPesananList(prev => [pesananBaru, ...prev]);
    setKeranjang(prev => prev.filter(i => !checkoutItems.find(ci => ci.id === i.id)));
    setCheckoutItems([]);
    setHalaman("pesanan");
  };

  const handleAccDesain = async (conversation) => {
    // Kalau order sudah ada, cukup ubah status ke produksi.
    if (conversation.order_id) {
      try {
        const { updateOrderStatus } = await import("../services/orderService.js");
        await updateOrderStatus(conversation.order_id, "produksi");
        setPesananList(prev =>
          prev.map(p =>
            p.orderId === conversation.order_id
              ? { ...p, status: "produksi" }
              : p
          )
        );
        return;
      } catch (e) {
        console.error(e);
        return;
      }
    }

    // Belum ada order → lanjut checkout
    const meta = conversation.metadata || {};
    handleCheckout([{
      id: "brief-" + Date.now(),
      produk: meta.produk || { nama: "Kaos Custom" },
      nama: meta.produk?.nama || "Kaos Custom",
      warna: meta.warna || null,
      warnaLabel: meta.warnaLabel || "-",
      opsiDesain: "brief",
      briefKat: meta.briefKat || "-",
      briefTeks: meta.briefTeks || {},
      modeUkuran: meta.modeUkuran || "satuan",
      satuanSize: meta.satuanSize || "-",
      satuanQty: meta.satuanQty || 1,
      massalQty: meta.massalQty || null,
      totalQty: meta.totalQty || 1,
      totalHarga: meta.totalHarga || 0,
      conversationId: conversation.id,
    }]);
  };

  return {
    produkAktif, setProdukAktif, desainAwalAktif, setDesainAwalAktif,
    checkoutItems, setCheckoutItems, reviewTarget, setReviewTarget,
    chatConv, setChatConv, chatBriefContext, setChatBriefContext, chatBriefRef,
    handleCustom, handleBuatSepertiIni, handleChatDesainer,
    handleCheckout, handleCheckoutSelesai, handleAccDesain,
  };
}
