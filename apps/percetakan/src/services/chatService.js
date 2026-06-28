import supabase from "../lib/supabase.js";

// Cari conversation berdasarkan order_id (dibuat oleh customer)
export const getConversationByOrder = async (orderId) => {
  const { data } = await supabase
    .from("conversations")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1);
  return data?.[0] || null;
};

// Ambil semua conversations (untuk dashboard badge)
export const getAllConversations = async () => {
  const { data } = await supabase
    .from("conversations")
    .select("*")
    .order("last_at", { ascending: false });
  return data || [];
};

// Ambil pesan dalam conversation
export const getMessages = async (conversationId) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
};

// Kirim pesan teks (dari desainer)
export const kirimPesan = async ({ conversationId, senderId, isi, type = "text" }) => {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id:       senderId,
      sender_role:     "desainer",
      body:            isi,
      image_url:       null,
      is_read:         false,
      type:            type,
    })
    .select()
    .single();
  if (error) throw error;

  // Update last_message + increment unread_customer
  const { data: conv } = await supabase
    .from("conversations")
    .select("unread_customer")
    .eq("id", conversationId)
    .single();

  await supabase
    .from("conversations")
    .update({
      last_message:    isi,
      last_at:         new Date().toISOString(),
      unread_customer: (conv?.unread_customer || 0) + 1,
    })
    .eq("id", conversationId);

  return data;
};

// Kirim gambar (dari desainer)
export const kirimGambar = async ({ conversationId, senderId, file }) => {
  const ext  = file.name.split(".").pop();
  const path = `desainer/${senderId}/${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("chat-images")
    .upload(path, file, { upsert: false });
  if (upErr) throw upErr;

  const { data: urlData } = supabase.storage
    .from("chat-images")
    .getPublicUrl(path);

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id:       senderId,
      sender_role:     "desainer",
      body:            null,
      image_url:       urlData.publicUrl,
      is_read:         false,
    })
    .select()
    .single();
  if (error) throw error;

  const { data: conv } = await supabase
    .from("conversations")
    .select("unread_customer")
    .eq("id", conversationId)
    .single();

  await supabase
    .from("conversations")
    .update({
      last_message:    "📷 Gambar desain",
      last_at:         new Date().toISOString(),
      unread_customer: (conv?.unread_customer || 0) + 1,
    })
    .eq("id", conversationId);

  return data;
};

// Tandai sudah dibaca oleh desainer
export const markAsRead = async (conversationId) => {
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .eq("sender_role", "customer")
    .eq("is_read", false);

  await supabase
    .from("conversations")
    .update({ unread_desainer: 0 })
    .eq("id", conversationId);
};

// Subscribe realtime pesan
export const subscribeMessages = (conversationId, callback) => {
  const channel = supabase
    .channel(`msg_${conversationId}`)
    .on("postgres_changes", {
      event:  "INSERT",
      schema: "public",
      table:  "messages",
      filter: `conversation_id=eq.${conversationId}`,
    }, payload => callback(payload.new))
    .subscribe();
  return () => supabase.removeChannel(channel);
};

// Subscribe realtime conversations (untuk badge unread di dashboard)
export const subscribeConversations = (callback) => {
  const channel = supabase
    .channel("conv_desainer")
    .on("postgres_changes", {
      event:  "*",
      schema: "public",
      table:  "conversations",
    }, () => callback())
    .subscribe();
  return () => supabase.removeChannel(channel);
};

// Total unread untuk desainer
export const getTotalUnread = async () => {
  const { data } = await supabase
    .from("conversations")
    .select("unread_desainer");
  return (data || []).reduce((sum, c) => sum + (c.unread_desainer || 0), 0);
};


// Update status pesanan
export const updateStatusPesanan = async (orderId, status) => {
  const { error } = await supabase
    .from("pesanan")
    .update({ status })
    .eq("order_id", orderId);
  if (error) throw error;
};

// Ambil status pesanan
export const getStatusPesanan = async (orderId) => {
  const { data } = await supabase
    .from("pesanan")
    .select("status")
    .eq("order_id", orderId)
    .single();
  return data?.status || null;
};
