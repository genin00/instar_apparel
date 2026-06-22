// ═══════════════════════════════════════════════════════════
//  REVIEW SERVICE — sekarang localStorage, nanti Supabase
// ═══════════════════════════════════════════════════════════
const KEY = "instar_reviews";
const _load = () => { try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : []; } catch { return []; } };
const _save = (r) => { try { localStorage.setItem(KEY, JSON.stringify(r)); } catch {} };

export const getReviews = async (produkId) => { const all = _load(); return produkId ? all.filter(r => r.produkId === produkId) : all; };
export const saveReview = async (review) => { const all = [review, ..._load()]; _save(all); return review; };
export const sudahReview = (orderId, produkId) => _load().some(r => r.orderId === orderId && r.produkId === produkId);
export const getRatingSummary = (produkId) => {
  const reviews = _load().filter(r => r.produkId === produkId);
  if (!reviews.length) return { rata: 0, total: 0, distribusi: {} };
  const rata = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  const dist = { 1:0, 2:0, 3:0, 4:0, 5:0 };
  reviews.forEach(r => dist[r.rating]++);
  return { rata: Math.round(rata * 10) / 10, total: reviews.length, distribusi: dist };
};
