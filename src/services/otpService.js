// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — OTP SERVICE (Fonnte WhatsApp)
// ═══════════════════════════════════════════════════════════

import config from "../config.js";

// Simpan OTP sementara di memory (per session)
const otpStore = {};

// Generate 6 digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Format nomor HP ke format internasional
export const formatPhone = (phone) => {
  let p = phone.replace(/\D/g, "");
  if (p.startsWith("0")) p = "62" + p.slice(1);
  if (!p.startsWith("62")) p = "62" + p;
  return p;
};

// Kirim OTP via Fonnte WhatsApp
export const kirimOTP = async (noHp) => {
  const phone = formatPhone(noHp);
  const otp   = generateOTP();
  const pesan = `*Instar Apparel* 🔐\n\nKode verifikasi kamu: *${otp}*\n\nBerlaku 5 menit. Jangan bagikan ke siapapun.`;

  const res = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: {
      "Authorization": config.fonnte.token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      target:  phone,
      message: pesan,
    }),
  });

  const data = await res.json();
  if (!data.status) throw new Error(data.reason || "Gagal kirim OTP");

  // Simpan OTP dengan expiry 5 menit
  otpStore[phone] = {
    otp,
    expiry: Date.now() + 5 * 60 * 1000,
  };

  return phone;
};

// Verifikasi OTP
export const verifikasiOTP = (noHp, inputOtp) => {
  const phone = formatPhone(noHp);
  const data  = otpStore[phone];

  if (!data) return { valid: false, pesan: "OTP tidak ditemukan, minta ulang" };
  if (Date.now() > data.expiry) {
    delete otpStore[phone];
    return { valid: false, pesan: "OTP sudah kadaluarsa, minta ulang" };
  }
  if (data.otp !== inputOtp.trim()) return { valid: false, pesan: "Kode OTP salah" };

  delete otpStore[phone];
  return { valid: true };
};
