import { useState, useEffect } from "react";
import { getOrders } from "../services/orderService.js";
import { supabase } from "../lib/supabase.js";

export function usePesanan(akun) {
  const [pesananList,  setPesananList]  = useState([]);
  const [pesananFilter, setPesananFilter] = useState(null);

  const refreshPesanan = async () => {
    if (!akun) return;
    try {
      const data = await getOrders(akun.id);
      setPesananList(data || []);
    } catch (e) {
      console.error("refreshPesanan error:", e.message);
    }
  };

  useEffect(() => {
    if (!akun) {
      setPesananList([]);
      return;
    }

    refreshPesanan();

    const channel = supabase
      .channel(`pesanan_customer_${akun.id}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "pesanan",
        filter: `customer_id=eq.${akun.id}`,
      }, () => {
        refreshPesanan();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [akun]);

  return { pesananList, setPesananList, pesananFilter, setPesananFilter, refreshPesanan };
}
