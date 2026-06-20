#!/usr/bin/env python3
# ═══════════════════════════════════════════════════════════
#  INSTAR APPAREL — Generate Mockup per Warna
#  Cara pakai:
#    python3 generate_mockups.py
#  Jalankan dari folder: ~/instar_apparel/
# ═══════════════════════════════════════════════════════════

from PIL import Image
import os

# ── WARNA KAOS (sama dengan warnaKaos di products.js) ───────
WARNA = [
    ("putih",   "#FFFFFF"),
    ("hitam",   "#1A1A1A"),
    ("abu",     "#9CA3AF"),
    ("navy",    "#1E3A5F"),
    ("merah",   "#C8392B"),
    ("maroon",  "#6B2737"),
    ("olive",   "#6B7040"),
    ("krem",    "#F5F5DC"),
    ("biru",    "#3B82F6"),
    ("hijau",   "#10B981"),
    ("kuning",  "#F59E0B"),
    ("pink",    "#EC4899"),
    ("ungu",    "#7C3AED"),
    ("cokelat", "#92400E"),
]

# ── FILE MOCKUP SUMBER (harus putih/terang) ─────────────────
MOCKUP_FILES = [
    ("pendek",          "public/mockup-pendek.png"),
    ("pendek-belakang", "public/mockup-pendek-belakang.png"),
    ("panjang",         "public/mockup-panjang.png"),
    ("panjang-belakang","public/mockup-panjang-belakang.png"),
    ("rib",             "public/mockup-rib.png"),
    ("rib-belakang",    "public/mockup-rib-belakang.png"),
]

OUTPUT_DIR = "public/mockups"

# ── FUNGSI HEX → RGB ─────────────────────────────────────────
def hex_to_rgb(hex_color):
    h = hex_color.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

# ── FUNGSI RECOLOR (multiply blend) ──────────────────────────
def recolor_mockup(src_path, target_hex):
    img = Image.open(src_path).convert("RGBA")
    pixels = img.load()
    w, h = img.size

    tr, tg, tb = hex_to_rgb(target_hex)
    is_white = target_hex.upper() in ("#FFFFFF", "#FFFFFFFF")

    if is_white:
        return img  # tidak perlu recolor

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a < 10:
                continue  # skip transparan

            # Luminance pixel
            lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255

            # Multiply blend
            nr = int(lum * tr)
            ng = int(lum * tg)
            nb = int(lum * tb)

            pixels[x, y] = (nr, ng, nb, a)

    return img

# ── MAIN ─────────────────────────────────────────────────────
def main():
    # Buat folder output
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    total = len(MOCKUP_FILES) * len(WARNA)
    count = 0

    print(f"\n🎨 Generate {total} mockup...\n")

    for (produk_id, src_path) in MOCKUP_FILES:
        if not os.path.exists(src_path):
            print(f"  ⚠️  Skip (tidak ada): {src_path}")
            continue

        print(f"📦 {produk_id}:")

        for (nama_warna, hex_color) in WARNA:
            out_path = f"{OUTPUT_DIR}/mockup-{produk_id}-{nama_warna}.png"

            # Skip kalau sudah ada
            if os.path.exists(out_path):
                print(f"   ✓ {nama_warna} (sudah ada, skip)")
                count += 1
                continue

            try:
                result = recolor_mockup(src_path, hex_color)
                result.save(out_path, "PNG", optimize=True)
                count += 1
                print(f"   ✅ {nama_warna} → {out_path}")
            except Exception as e:
                print(f"   ❌ {nama_warna} ERROR: {e}")

        print()

    print(f"🎉 Selesai! {count}/{total} file generated")
    print(f"📁 Output: {OUTPUT_DIR}/")
    print()
    print("Contoh nama file yang dihasilkan:")
    print("  public/mockups/mockup-pendek-hitam.png")
    print("  public/mockups/mockup-panjang-navy.png")
    print("  public/mockups/mockup-rib-merah.png")

if __name__ == "__main__":
    main()

