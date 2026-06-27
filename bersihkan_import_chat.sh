#!/data/data/com.termux/files/usr/bin/bash

FILE="src/App.jsx"

echo "Menghapus import Chat..."

sed -i '/import Chat.*pages\/Chat\.jsx/d' "$FILE"
sed -i '/import DaftarChat.*pages\/DaftarChat\.jsx/d' "$FILE"

echo
echo "Selesai."
echo
echo "Sisa referensi Chat di App.jsx:"
grep -n "Chat\|chat\|daftar-chat" "$FILE" || echo "Tidak ada."
