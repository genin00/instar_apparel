// ═══════════════════════════════════════════════════════════
//  REVIEW SERVICE — Supabase
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL = "https://wfgjvpbehhbuysdklimg.supabase.co";
const SUPABASE_KEY = "sb_publishable_savuuXHTZZp_FZuTNfKqjQ_2iKIx6ZA";
const headers = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
};

export const getReviews = async (produkId) => {
  try {
    const url = produkId
      ? `${SUPABASE_URL}/rest/v1/reviews?produk_id=eq.${produkId}&order=created_at.desc`
      : `${SUPABASE_URL}/rest/v1/reviews?order=created_at.desc`;
    const res = await fetch(url, { headers });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(r => ({
      id:        r.id,
      produkId:  r.produk_id,
      orderId:   r.order_id,
      userName:  r.user_name,
      rating:    r.rating,
      teks:      r.teks,
      media:     r.media || [],
      tanggal:   r.tanggal,
    }));
  } catch { return []; }
};

export const saveReview = async (review) => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
      method: "POST",
      headers: { ...headers, "Prefer": "return=minimal" },
      body: JSON.stringify({
        id:          review.id,
        produk_id:   review.produkId,
        order_id:    review.orderId,
        customer_id: review.customerId || null,
        user_name:   review.userName,
        rating:      review.rating,
        teks:        review.teks,
        media:       review.media || [],
        tanggal:     review.tanggal,
      }),
    });
  } catch(e) { console.error(e); }
  return review;
};

export const sudahReview = async (orderId, produkId) => {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/reviews?order_id=eq.${orderId}&produk_id=eq.${produkId}&select=id&limit=1`,
      { headers }
    );
    const data = await res.json();
    return data.length > 0;
  } catch { return false; }
};

export const getRatingSummary = async (produkId) => {
  try {
    const reviews = await getReviews(produkId);
    if (!reviews.length) return { rata: 0, total: 0, distribusi: {} };
    const rata = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
    const dist = { 1:0, 2:0, 3:0, 4:0, 5:0 };
    reviews.forEach(r => dist[r.rating]++);
    return { rata: Math.round(rata * 10) / 10, total: reviews.length, distribusi: dist };
  } catch { return { rata: 0, total: 0, distribusi: {} }; }
};
