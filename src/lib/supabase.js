// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — SUPABASE CLIENT
// ═══════════════════════════════════════════════════════════
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

alert("SUPABASE URL = " + supabaseUrl);
alert("SUPABASE KEY = " + (supabaseKey ? "ADA" : "TIDAK ADA"));

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL atau Key tidak ditemukan di .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
