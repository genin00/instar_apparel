// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — CHAT SERVICE
// ═══════════════════════════════════════════════════════════
import supabase from "../lib/supabase.js";

// ── Ambil semua pesan per order ─────────────────────────────
export const getPesan = async (orderId) => {
  const { data, error } = await supabase
    .from("chat_pesan")
    .select("*")
    .eq("order_id", orderId.toUpperCase())
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
};

// ── Kirim pesan teks ────────────────────────────────────────
export const kirimPesan = async ({ orderId, senderId, senderRole, isi }) => {
  const { data, error } = await supabase
    .from("chat_pesan")
    .insert({
      order_id:    orderId.toUpperCase(),
      sender_id:   senderId,
      sender_role: senderRole,
      tipe:        "teks",
      isi,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ── Kirim pesan gambar ──────────────────────────────────────
export const kirimGambar = async ({ orderId, senderId, senderRole, file }) => {
  const ext      = file.name.split(".").pop();
  const path     = `chat/${orderId}/${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("chat-images")
    .upload(path, file, { upsert: true });
  if (upErr) throw upErr;

  const { data: urlData } = supabase.storage
    .from("chat-images")
    .getPublicUrl(path);

  const { data, error } = await supabase
    .from("chat_pesan")
    .insert({
      order_id:    orderId.toUpperCase(),
      sender_id:   senderId,
      sender_role: senderRole,
      tipe:        "gambar",
      gambar_url:  urlData.publicUrl,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ── Kirim pesan sistem (otomatis) ───────────────────────────
export const kirimPesanSistem = async ({ orderId, isi }) => {
  const { data, error } = await supabase
    .from("chat_pesan")
    .insert({
      order_id:    orderId.toUpperCase(),
      sender_id:   "00000000-0000-0000-0000-000000000000",
      sender_role: "sistem",
      tipe:        "sistem",
      isi,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ── Subscribe realtime ──────────────────────────────────────
export const subscribeChat = (orderId, callback) => {
  const channel = supabase
    .channel(`chat_${orderId}`)
    .on("postgres_changes", {
      event:  "INSERT",
      schema: "public",
      table:  "chat_pesan",
      filter: `order_id=eq.${orderId.toUpperCase()}`,
    }, payload => callback(payload.new))
    .subscribe();
  return () => supabase.removeChannel(channel);
};

// ── Ambil daftar chat (per user) ────────────────────────────
export const getDaftarChat = async (pesananList) => {
  if (!pesananList.length) return [];
  const orderIds = pesananList.map(p => p.orderId.toUpperCase());
  const hasil = [];
  for (const orderId of orderIds) {
    const { data } = await supabase
      .from("chat_pesan")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })
      .limit(1);
    const pesanan = pesananList.find(p => p.orderId.toUpperCase() === orderId);
    hasil.push({
      orderId,
      pesanan,
      pesanTerakhir: data?.[0] || null,
    });
  }
  return hasil;
};
