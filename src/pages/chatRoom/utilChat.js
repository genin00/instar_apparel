function formatWaktu(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function formatTanggal(iso) {
  if (!iso) return "";
  const d   = new Date(iso);
  const now = new Date();
  const isToday     = d.toDateString() === now.toDateString();
  const isYesterday = d.toDateString() === new Date(now - 86400000).toDateString();
  if (isToday)     return "Hari ini";
  if (isYesterday) return "Kemarin";
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long" });
}

function groupByTanggal(messages) {
  const groups = [];
  let lastDate = null;
  for (const msg of messages) {
    const tanggal = formatTanggal(msg.created_at);
    if (tanggal !== lastDate) {
      groups.push({ type: "date", label: tanggal });
      lastDate = tanggal;
    }
    groups.push({ type: "msg", data: msg });
  }
  return groups;
}


export { formatWaktu, formatTanggal, groupByTanggal };
