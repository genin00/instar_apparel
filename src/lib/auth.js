// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — AUTH & PROFILE API
// ═══════════════════════════════════════════════════════════
import { supabase } from './supabase.js';

// ── REGISTER ────────────────────────────────────────────────
export async function register({ email, password, nama }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nama } },
  });
  if (error) throw error;
  return data;
}

// ── LOGIN ───────────────────────────────────────────────────
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// ── LOGOUT ──────────────────────────────────────────────────
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ── GET SESSION (cek login) ──────────────────────────────────
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ── GET PROFIL ───────────────────────────────────────────────
export async function getProfil(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

// ── UPDATE PROFIL ────────────────────────────────────────────
export async function updateProfil(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── UPLOAD FOTO PROFIL ───────────────────────────────────────
export async function uploadFotoProfil(userId, file) {
  const ext = file.name.split('.').pop();
  const path = `avatars/${userId}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  await updateProfil(userId, { foto_url: data.publicUrl });
  return data.publicUrl;
}

// ── ALAMAT ───────────────────────────────────────────────────
export async function getAlamat(userId) {
  const { data, error } = await supabase
    .from('alamat')
    .select('*')
    .eq('user_id', userId)
    .order('is_utama', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function tambahAlamat(userId, alamat) {
  if (alamat.is_utama) {
    await supabase.from('alamat')
      .update({ is_utama: false })
      .eq('user_id', userId);
  }
  const { data, error } = await supabase
    .from('alamat')
    .insert({ ...alamat, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateAlamat(alamatId, updates) {
  const { data, error } = await supabase
    .from('alamat')
    .update(updates)
    .eq('id', alamatId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function hapusAlamat(alamatId) {
  const { error } = await supabase
    .from('alamat')
    .delete()
    .eq('id', alamatId);
  if (error) throw error;
}

// ── KOMENTAR & RATING KARYA ──────────────────────────────────
export async function getKomentarKarya(karyaId) {
  const { data, error } = await supabase
    .from('karya_komentar')
    .select(`*, profiles(nama, foto_url, username)`)
    .eq('karya_id', karyaId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function tambahKomentar({ karyaId, userId, rating, komentar }) {
  const { data, error } = await supabase
    .from('karya_komentar')
    .upsert({
      karya_id: karyaId,
      user_id: userId,
      rating,
      komentar,
    }, { onConflict: 'karya_id,user_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getRataRatingKarya(karyaId) {
  const { data, error } = await supabase
    .from('karya_komentar')
    .select('rating')
    .eq('karya_id', karyaId);
  if (error) return null;
  if (!data || data.length === 0) return null;
  const rata = data.reduce((a, b) => a + b.rating, 0) / data.length;
  return Math.round(rata * 10) / 10;
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/?reset=true",
  });
  if (error) throw error;
}
