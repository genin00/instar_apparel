// ═══════════════════════════════════════════════════════════
//  ORDER SERVICE
//  Sekarang : localStorage (lokal)
//  Go-online : ganti isi tiap fungsi ke Supabase/Firebase
//              — App.jsx & Checkout.jsx tidak perlu diubah
// ═══════════════════════════════════════════════════════════

const KEY = "instar_pesanan";

const _load = () => {
  try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : []; }
  catch { return []; }
};
const _save = (orders) => {
  try { localStorage.setItem(KEY, JSON.stringify(orders)); } catch {}
};

// ── Baca semua pesanan ──────────────────────────────────────
export const getOrders = async () => _load();

// ── Simpan pesanan baru ─────────────────────────────────────
export const saveOrder = async (order) => {
  const orders = [order, ..._load()];
  _save(orders);
  return order;
};

// ── Update status pesanan ───────────────────────────────────
export const updateOrderStatus = async (orderId, status) => {
  const orders = _load().map(o =>
    o.orderId === orderId ? { ...o, status } : o
  );
  _save(orders);
};

// ── Hapus pesanan ───────────────────────────────────────────
export const deleteOrder = async (orderId) => {
  _save(_load().filter(o => o.orderId !== orderId));
};
