import { useState, useEffect } from "react";
import { getOrders } from "../services/orderService.js";

export function usePesanan(akun) {
  const [pesananList,  setPesananList]  = useState([]);
  const [pesananFilter, setPesananFilter] = useState(null);

  useEffect(() => {
    if (!akun) { setPesananList([]); return; }
    getOrders(akun.id).then(data => {
      setPesananList(data || []);
    }).catch(() => {});
  }, [akun]);

  const refreshPesanan = async () => {
    if (!akun) return;
    try {
      const data = await getOrders(akun.id);
      setPesananList(data || []);
    } catch {}
  };

  return { pesananList, setPesananList, pesananFilter, setPesananFilter, refreshPesanan };
}
