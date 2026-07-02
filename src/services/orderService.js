import { supabase } from "../lib/supabase.js";

export const getOrders = async (customerId) => {
  let query = supabase
    .from("pesanan")
    .select("*")
    .order("created_at", { ascending: false });

  if (customerId) {
    query = query.eq("customer_id", customerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getOrders FAILED:", error.message);
    return [];
  }

  return (data || []).map(row => ({
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
};

export const saveOrder = async (order) => {
  const payload = {
    order_id:          order.orderId,
    tanggal:           order.tanggal,
    status:            order.status,
    items:             order.items,
    total_qty:         order.totalQty,
    total_harga:       order.totalHarga,
    nama:              order.nama,
    telepon:           order.telepon || order.noWA || null,
    alamat:            order.alamat,
    ongkir:            order.ongkir || 0,
    metode_pembayaran: order.metodePembayaran || order.metodeBayar || null,
    customer_id:       order.customerId || null,
  };

  const { error } = await supabase
    .from("pesanan")
    .upsert(payload, { onConflict: "order_id" });

  if (error) {
    console.error("saveOrder FAILED:", error.message, payload);
    throw new Error("Gagal menyimpan pesanan: " + error.message);
  }

  return order;
};

export const updateOrderStatus = async (orderId, status) => {
  const { error } = await supabase
    .from("pesanan")
    .update({ status })
    .eq("order_id", orderId);

  if (error) {
    console.error("updateOrderStatus FAILED:", error.message);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  const { error } = await supabase
    .from("pesanan")
    .delete()
    .eq("order_id", orderId);

  if (error) {
    console.error("deleteOrder FAILED:", error.message);
    throw error;
  }
};
