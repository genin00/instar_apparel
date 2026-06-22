"""
Generator data karya.js dari nama file dengan format:
  Judul_Kategori_PanjangN_PendekN.webp
Contoh: Al-Quds_komunitas_Panjang0_Pendek1.webp

Jalankan dari root project: python3 generate_karya.py
"""
import os
import re

FOLDER = "public/karya"
OUTPUT = "src/data/karya.js"

KATEGORI_VALID = ["kelas", "event", "perpisahan", "komunitas", "umkm", "instansi", "custom"]

def judul_dari_slug(slug):
    kata = re.sub(r'[_\-]+', ' ', slug)
    return kata.strip().title()

if not os.path.isdir(FOLDER):
    print(f"❌ Folder {FOLDER} tidak ditemukan. Jalankan dari root project.")
    exit(1)

exts = (".webp", ".png", ".jpg", ".jpeg", ".WEBP", ".PNG", ".JPG", ".JPEG")
files = sorted([f for f in os.listdir(FOLDER) if f.endswith(exts)])

if not files:
    print(f"⚠️  Tidak ada file gambar di {FOLDER}/.")
    exit(0)

entries = []
gagal_parse = []

i = 0
for f in files:
    nama_tanpa_ext = os.path.splitext(f)[0]
    parts = nama_tanpa_ext.split("_")

    if len(parts) != 4:
        gagal_parse.append((f, "format tidak sesuai (butuh 4 bagian dipisah _)"))
        continue

    judul_slug, kategori_raw, panjang_raw, pendek_raw = parts
    kategori = kategori_raw.lower()

    if kategori not in KATEGORI_VALID:
        gagal_parse.append((f, f"kategori '{kategori_raw}' tidak dikenal"))
        continue

    m_panjang = re.match(r'(?i)panjang(\d+)', panjang_raw)
    m_pendek  = re.match(r'(?i)pendek(\d+)', pendek_raw)

    if not m_panjang or not m_pendek:
        gagal_parse.append((f, "format Panjang/Pendek tidak sesuai (contoh: Panjang0_Pendek1)"))
        continue

    qty_panjang = int(m_panjang.group(1))
    qty_pendek  = int(m_pendek.group(1))

    if qty_panjang > 0 and qty_pendek > 0:
        produk_tersedia = ["lengan-panjang", "lengan-pendek"]
    elif qty_panjang > 0:
        produk_tersedia = ["lengan-panjang"]
    elif qty_pendek > 0:
        produk_tersedia = ["lengan-pendek"]
    else:
        produk_tersedia = []

    produk_default = "lengan-panjang" if qty_panjang >= qty_pendek and qty_panjang > 0 else "lengan-pendek"

    judul = judul_dari_slug(judul_slug)
    produk_tersedia_str = ", ".join(f'"{p}"' for p in produk_tersedia)

    i += 1
    entry = f'''  {{
    id:             {i},
    label:          "{judul}",
    subjudul:       "",
    kategori:       "{kategori}",
    produkId:       "{produk_default}",
    produkTersedia: [{produk_tersedia_str}],
    qtyPanjang:     {qty_panjang},
    qtyPendek:      {qty_pendek},
    gambarUtama:    "/karya/{f}",
    gambarDesain:   "/karya/{f}",
    galeriDetail:   [],
    deskripsi:      "",
    tahun:          "2026",
  }},'''
    entries.append(entry)

isi = '''// ═══════════════════════════════════════════════════════════
//  INSTAR APPAREL — DATA KARYA
//  Format nama file: Judul_Kategori_PanjangN_PendekN.webp
//  Contoh: Al-Quds_komunitas_Panjang0_Pendek1.webp
//
//  Kategori valid: kelas, event, perpisahan, komunitas, umkm, instansi, custom
//
//  Untuk tambah karya baru:
//  1. Taruh file baru di public/karya/ dengan format nama di atas
//  2. Jalankan ulang: python3 generate_karya.py
// ═══════════════════════════════════════════════════════════

export const kategoriKarya = [
  {{ id: "semua",      label: "Semua" }},
  {{ id: "kelas",      label: "Kelas" }},
  {{ id: "event",      label: "Event" }},
  {{ id: "perpisahan", label: "Perpisahan" }},
  {{ id: "komunitas",  label: "Komunitas" }},
  {{ id: "umkm",       label: "UMKM" }},
  {{ id: "instansi",   label: "Instansi" }},
  {{ id: "custom",     label: "Custom" }},
];

const karya = [
{entries}
];

export default karya;
'''.format(entries="\n".join(entries))

with open(OUTPUT, "w") as out:
    out.write(isi)

print(f"\n✅ Berhasil: {len(entries)} karya di-generate ke {OUTPUT}")

if gagal_parse:
    print(f"\n⚠️  {len(gagal_parse)} file DILEWATI (perlu di-rename ulang):")
    for fname, alasan in gagal_parse:
        print(f"   - {fname}  →  {alasan}")

print(f"\n👉 Jalankan npm run dev untuk cek hasilnya.")
