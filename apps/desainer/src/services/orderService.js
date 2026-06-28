import supabase from "../lib/supabase.js";

export const getOrders = async () => {
  const { data, error } = await supabase
    .from("pesanan")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data.map(row => ({
    orderId:    row.order_id,
    tanggal:    row.tanggal,
    status:     row.status,
    items:      row.items,
    totalQty:   row.total_qty,
    totalHarga: row.total_harga,
    nama:       row.nama,
    telepon:    row.telepon,
    alamat:     row.alamat,
  }));
};

export const updateOrderStatus = async (orderId, status) => {
  await supabase
    .from("pesanan")
    .update({ status })
    .eq("order_id", orderId);
};

