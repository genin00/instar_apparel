// ═══════════════════════════════════════════════════════════
//  ORDER SERVICE — Supabase
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL = "https://wfgjvpbehhbuysdklimg.supabase.co";
const SUPABASE_KEY = "sb_publishable_savuuXHTZZp_FZuTNfKqjQ_2iKIx6ZA";

const headers = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
};

const endpoint = `${SUPABASE_URL}/rest/v1/pesanan`;

export const getOrders = async (customerId) => {
  try {
    const url = customerId
      ? `${endpoint}?customer_id=eq.${customerId}&order=created_at.desc`
      : `${endpoint}?order=created_at.desc`;
    const res = await fetch(url, { headers });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(row => ({
      orderId:           row.order_id,
      tanggal:           row.tanggal,
      status:            row.status,
      items:             row.items,
      totalQty:          row.total_qty,
      totalHarga:        row.total_harga,
      nama:              row.nama,
      telepon:           row.telepon,
      alamat:            row.alamat,
      ongkir:            row.ongkir || 0,
      metodePembayaran:  row.metode_pembayaran || "-",
      customerId:        row.customer_id,
    }));
  } catch { return []; }
};

export const saveOrder = async (order) => {
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { ...headers, "Prefer": "return=minimal" },
      body: JSON.stringify({
        order_id:          order.orderId,
        tanggal:           order.tanggal,
        status:            order.status,
        items:             order.items,
        total_qty:         order.totalQty,
        total_harga:       order.totalHarga,
        nama:              order.nama,
        telepon:           order.telepon,
        alamat:            order.alamat,
        ongkir:            order.ongkir || 0,
        metode_pembayaran: order.metodePembayaran || null,
        customer_id:       order.customerId || null,
      }),
    });
  } catch {}
  return order;
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    await fetch(`${endpoint}?order_id=eq.${orderId}`, {
      method: "PATCH",
      headers: { ...headers, "Prefer": "return=minimal" },
      body: JSON.stringify({ status }),
    });
  } catch {}
};

export const deleteOrder = async (orderId) => {
  try {
    await fetch(`${endpoint}?order_id=eq.${orderId}`, {
      method: "DELETE",
      headers,
    });
  } catch {}
};
