// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — CHAT SERVICE
//  Handles: conversations, messages, realtime, image upload
// ═══════════════════════════════════════════════════════════

import { supabase } from "./supabase.js";

// ── GET / BUAT CONVERSATION ─────────────────────────────────
// Cari conversation aktif milik customer, atau buat baru
export async function getOrCreateConversation(customerId, orderId = null, metadata = null) {
  // Cari conversation open yang sudah ada
  let query = supabase
    .from("conversations")
    .select("*")
    .eq("customer_id", customerId)
    .eq("status", "open");

  if (orderId) {
    query = query.eq("order_id", orderId);
  } else {
    query = query.is("order_id", null);
  }

  query = query
    .order("last_at", { ascending: false })
    .limit(1);

  const { data: existing, error: findErr } = await query;
  if (findErr) throw findErr;
  if (existing && existing.length > 0) {
    const conv = existing[0];
    // Update metadata kalau masih null
    if (metadata) {
      await supabase
        .from("conversations")
        .update({ metadata })
        .eq("id", conv.id);
      conv.metadata = metadata;
    }
    return conv;
  }

  // Buat baru
  const { data: newConv, error: createErr } = await supabase
    .from("conversations")
    .insert({
      customer_id: customerId,
      order_id:    orderId || null,
      status:      "open",
      metadata:    metadata || null,
    })
    .select()
    .single();

  if (createErr) throw createErr;
  return newConv;
}

// ── LIST CONVERSATIONS CUSTOMER ──────────────────────────────
export async function getConversationsByCustomer(customerId) {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("customer_id", customerId)
    .order("last_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// ── AMBIL PESAN DALAM CONVERSATION ──────────────────────────
export async function getMessages(conversationId) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

// ── KIRIM PESAN ─────────────────────────────────────────────
export async function sendMessage({ conversationId, senderId, senderRole, body, imageUrl = null, type = "text" }) {
  const { data: msg, error: msgErr } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id:       senderId,
      sender_role:     senderRole,
      body:            body || null,
      image_url:       imageUrl || null,
      is_read:         false,
      type:             type,
    })
    .select()
    .single();

  if (msgErr) throw msgErr;

  // Update last_message & unread counter di conversation
  const unreadField = senderRole === "customer" ? "unread_desainer" : "unread_customer";
  await supabase
    .from("conversations")
    .update({
      last_message: imageUrl && !body ? "📷 Gambar" : body,
      last_at:      new Date().toISOString(),
      [unreadField]: supabase.rpc ? undefined : undefined, // increment via rpc kalau ada
    })
    .eq("id", conversationId);

  // Increment unread via raw update (fetch dulu lalu +1)
  const { data: conv } = await supabase
    .from("conversations")
    .select(unreadField)
    .eq("id", conversationId)
    .single();

  if (conv) {
    await supabase
      .from("conversations")
      .update({ [unreadField]: (conv[unreadField] || 0) + 1 })
      .eq("id", conversationId);
  }

  return msg;
}

// ── TANDAI PESAN SUDAH DIBACA ────────────────────────────────
export async function markAsRead(conversationId, readerRole) {
  // Tandai semua pesan dari pihak lain sebagai read
  const senderRole = readerRole === "customer" ? "desainer" : "customer";
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .eq("sender_role", senderRole)
    .eq("is_read", false);

  // Reset unread counter
  const unreadField = readerRole === "customer" ? "unread_customer" : "unread_desainer";
  await supabase
    .from("conversations")
    .update({ [unreadField]: 0 })
    .eq("id", conversationId);
}

// ── UPLOAD GAMBAR KE STORAGE ─────────────────────────────────
export async function uploadChatImage(file, userId) {
  const ext      = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from("chat-images")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (uploadErr) throw uploadErr;

  const { data: urlData } = supabase.storage
    .from("chat-images")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

// ── REALTIME SUBSCRIBE MESSAGES ──────────────────────────────
export function subscribeToMessages(conversationId, onNewMessage) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event:  "INSERT",
        schema: "public",
        table:  "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => onNewMessage(payload.new)
    )
    .subscribe();
}

// ── REALTIME SUBSCRIBE CONVERSATIONS (badge) ─────────────────
export function subscribeToConversations(customerId, onUpdate) {
  return supabase
    .channel(`conversations:${customerId}`)
    .on(
      "postgres_changes",
      {
        event:  "*",
        schema: "public",
        table:  "conversations",
        filter: `customer_id=eq.${customerId}`,
      },
      (payload) => onUpdate(payload)
    )
    .subscribe();
}

// ── TOTAL UNREAD CUSTOMER ────────────────────────────────────
export async function getTotalUnread(customerId) {
  const { data, error } = await supabase
    .from("conversations")
    .select("unread_customer")
    .eq("customer_id", customerId);

  if (error) return 0;
  return (data || []).reduce((sum, c) => sum + (c.unread_customer || 0), 0);
}


// ── EDIT PESAN ────────────────────────────────────────────────
export async function editMessage(id, teks) {
  const { error } = await supabase
    .from("messages")
    .update({ body: teks, is_edited: true, edited_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

// ── HAPUS PESAN UNTUK SAYA ───────────────────────────────────
export async function deleteMessageForMe(id, deletedFor) {
  const { error } = await supabase
    .from("messages")
    .update({ deleted_for: deletedFor })
    .eq("id", id);
  if (error) throw error;
}

// ── HAPUS PESAN UNTUK SEMUA ───────────────────────────────────
export async function deleteMessageForAll(id) {
  const { error } = await supabase
    .from("messages")
    .update({ body: null, image_url: null, deleted_for: ["all"] })
    .eq("id", id);
  if (error) throw error;
}
