// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — GRUP SERVICE
// ═══════════════════════════════════════════════════════════
import supabase from './supabase.js';

// ── JOIN GRUP ───────────────────────────────────────────────
export const joinGrup = async (idPesanan, akun) => {
  const { data, error } = await supabase
    .from('pesanan_grup')
    .insert({
      id_pesanan: idPesanan.toUpperCase(),
      user_id:    akun.noWA,
      nama_user:  akun.nama,
      no_wa:      akun.noWA,
    });
  if (error) throw error;
  return data;
};

// ── CEK SUDAH JOIN BELUM ────────────────────────────────────
export const cekSudahJoin = async (idPesanan, noWA) => {
  const { data, error } = await supabase
    .from('pesanan_grup')
    .select('id')
    .eq('id_pesanan', idPesanan.toUpperCase())
    .eq('user_id', noWA)
    .single();
  if (error) return false;
  return !!data;
};

// ── AMBIL ANGGOTA GRUP ──────────────────────────────────────
export const getAnggotaGrup = async (idPesanan) => {
  const { data, error } = await supabase
    .from('pesanan_grup')
    .select('*')
    .eq('id_pesanan', idPesanan.toUpperCase())
    .order('joined_at', { ascending: true });
  if (error) throw error;
  return data || [];
};

// ── AMBIL SEMUA GRUP USER ───────────────────────────────────
export const getGrupByUser = async (noWA) => {
  const { data, error } = await supabase
    .from('pesanan_grup')
    .select('id_pesanan, joined_at')
    .eq('user_id', noWA)
    .order('joined_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

// ── TAMBAH ULASAN ───────────────────────────────────────────
export const tambahUlasan = async (idPesanan, akun, rating, komentar, fotoUrl = null) => {
  const { data, error } = await supabase
    .from('ulasan')
    .insert({
      id_pesanan: idPesanan.toUpperCase(),
      user_id:    akun.noWA,
      nama_user:  akun.nama,
      rating,
      komentar,
      foto_url:   fotoUrl,
    });
  if (error) throw error;
  return data;
};

// ── AMBIL ULASAN ────────────────────────────────────────────
export const getUlasan = async (idPesanan) => {
  const { data, error } = await supabase
    .from('ulasan')
    .select('*')
    .eq('id_pesanan', idPesanan.toUpperCase())
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

// ── CEK SUDAH ULASAN BELUM ──────────────────────────────────
export const cekSudahUlasan = async (idPesanan, noWA) => {
  const { data, error } = await supabase
    .from('ulasan')
    .select('id')
    .eq('id_pesanan', idPesanan.toUpperCase())
    .eq('user_id', noWA)
    .single();
  if (error) return false;
  return !!data;
};

// ── RATA-RATA RATING ────────────────────────────────────────
export const getRataRating = async (idPesanan) => {
  const { data, error } = await supabase
    .from('ulasan')
    .select('rating')
    .eq('id_pesanan', idPesanan.toUpperCase());
  if (error) return { rata: 0, total: 0 };
  if (!data.length) return { rata: 0, total: 0 };
  const rata = data.reduce((a, b) => a + b.rating, 0) / data.length;
  return { rata: Math.round(rata * 10) / 10, total: data.length };
};

// ── TAMBAH KARYA (ADMIN) ────────────────────────────────────
export const tambahKarya = async (idPesanan, judul, fotoUrl, kategori) => {
  const { data, error } = await supabase
    .from('karya')
    .insert({ id_pesanan: idPesanan, judul, foto_url: fotoUrl, kategori });
  if (error) throw error;
  return data;
};

// ── AMBIL SEMUA KARYA ───────────────────────────────────────
export const getAllKarya = async () => {
  const { data, error } = await supabase
    .from('karya')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};
