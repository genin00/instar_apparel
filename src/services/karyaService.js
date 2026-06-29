// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — KARYA SERVICE
//  Handle: kode grup, karya member, ulasan karya
// ═══════════════════════════════════════════════════════════

import { supabase } from "../lib/supabase.js";

// ── KODE GRUP ───────────────────────────────────────────────

export const joinKodeGrup = async (kode, userId) => {
  // Cari kode
  const { data: kodeData, error: kodeErr } = await supabase
    .from("karya_kode")
    .select("*")
    .eq("kode", kode.toUpperCase().trim())
    .eq("aktif", true)
    .single();

  if (kodeErr || !kodeData) throw new Error("Kode tidak valid atau sudah tidak aktif");

  // Cek sudah join belum
  const { data: existing } = await supabase
    .from("karya_member")
    .select("id")
    .eq("karya_id", kodeData.karya_id)
    .eq("user_id", userId)
    .single();

  if (existing) throw new Error("Kamu sudah bergabung dengan karya ini");

  // Join karya
  const { error: joinErr } = await supabase
    .from("karya_member")
    .insert({
      karya_id: kodeData.karya_id,
      user_id:  userId,
      kode_id:  kodeData.id,
    });

  if (joinErr) throw new Error("Gagal bergabung: " + joinErr.message);
  return kodeData.karya_id;
};

export const getKaryaGrup = async (userId) => {
  const { data } = await supabase
    .from("karya_member")
    .select("karya_id")
    .eq("user_id", userId);
  return (data || []).map(d => d.karya_id);
};

export const isMemberKarya = async (karyaId, userId) => {
  if (!userId) return false;
  const { data } = await supabase
    .from("karya_member")
    .select("id")
    .eq("karya_id", karyaId)
    .eq("user_id", userId)
    .single();
  return !!data;
};

// ── ULASAN KARYA ────────────────────────────────────────────

export const getUlasanKarya = async (karyaId) => {
  const { data } = await supabase
    .from("karya_ulasan")
    .select("*, profiles(nama, foto_url)")
    .eq("karya_id", karyaId)
    .order("created_at", { ascending: false });
  return data || [];
};

export const getUlasanSaya = async (karyaId, userId) => {
  const { data } = await supabase
    .from("karya_ulasan")
    .select("*")
    .eq("karya_id", karyaId)
    .eq("user_id", userId)
    .single();
  return data || null;
};

export const simpanUlasan = async ({ karyaId, userId, rating, teks, fotoUrl, isAnonim }) => {
  const { data: existing } = await supabase
    .from("karya_ulasan")
    .select("id")
    .eq("karya_id", karyaId)
    .eq("user_id", userId)
    .single();

  if (existing) {
    // Update
    const { error } = await supabase
      .from("karya_ulasan")
      .update({
        rating,
        teks,
        foto_url:   fotoUrl || [],
        is_anonim:  isAnonim,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    // Insert
    const { error } = await supabase
      .from("karya_ulasan")
      .insert({
        karya_id:  karyaId,
        user_id:   userId,
        rating,
        teks,
        foto_url:  fotoUrl || [],
        is_anonim: isAnonim,
      });
    if (error) throw error;
  }
};

export const getRatingSummary = async (karyaId) => {
  const { data } = await supabase
    .from("karya_ulasan")
    .select("rating")
    .eq("karya_id", karyaId);
  if (!data || data.length === 0) return { rata: 0, total: 0 };
  const rata = data.reduce((a, d) => a + d.rating, 0) / data.length;
  return { rata: Math.round(rata * 10) / 10, total: data.length };
};
