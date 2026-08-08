/**
 * AGE YT# Content Strategy — config.js
 * Data 6 fitur + prompt builder + konstanta default.
 * Struktur & konvensi mengikuti AGE YT# Script & Caption Studio (Tools #1).
 */

// ─── Worker & Model default (WAJIB konsisten dengan tools AGE YT# lain) ───────
const DEFAULT_WORKER_URL  = "https://age-yt-proxy.kitakustik-managemen.workers.dev/";
const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";

const PLATFORMS = ["TikTok", "Instagram", "YouTube", "Facebook"];

const AUDIENCE_OPTIONS = [
  { value: "id-umum",  label: "🇮🇩 Umum" },
  { value: "id-muda",  label: "🇮🇩 Anak Muda" },
  { value: "id-ortu",  label: "🇮🇩 Orang Tua/Dewasa" },
  { value: "en-umum",  label: "🌍 Global (English)" },
];

// ─── Util kecil untuk prompt builder ───────────────────────────────────────────
function ctxLine(label, val) { return val ? `${label}: ${val}\n` : ""; }

// ─── 6 Fitur Content Strategy & Calendar ───────────────────────────────────────
const FEATURES = [
  {
    id: "trend-finder",
    label: "Trending Topic Finder",
    subtitle: "Cari ide topik yang lagi ramai di niche kamu",
    icon: "🔥",
    color: "#FF6B35",
    topicLabel: "Niche / kategori akun kamu",
    topicPlaceholder: "Contoh: resep masakan rumahan, tips finansial anak muda",
    maxTokens: 4096,
    buildPrompt: (ctx) => `Kamu adalah social media strategist yang paham tren konten terkini.
Buatkan daftar 8 topik konten yang berpotensi trending untuk niche berikut, khusus platform ${ctx.platform}.

${ctxLine("Niche/kategori", ctx.topic)}${ctxLine("Target penonton", ctx.audience)}${ctxLine("Catatan tambahan", ctx.detail)}
JANGAN tulis kalimat pembuka/sapaan/penutup apapun — langsung mulai dari topik #1. Untuk tiap topik, sertakan: judul topik, kenapa berpotensi menarik perhatian saat ini, dan sudut pandang (angle) unik yang bisa dipakai supaya tidak generic — tapi tetap ringkas (maksimal 3 baris per topik). WAJIB sampai topik ke-8, jangan berhenti di tengah. Tulis dalam Bahasa Indonesia (kecuali audiens Global/English, maka tulis dalam Bahasa Inggris), format rapi dan mudah dibaca di HP.`,
  },
  {
    id: "idea-generator",
    label: "Auto-Idea Generator",
    subtitle: "Ubah 1 topik jadi banyak ide konten siap pakai",
    icon: "💡",
    color: "#FFC145",
    topicLabel: "Topik / ide konten",
    topicPlaceholder: "Contoh: tips hemat belanja bulanan untuk anak kos",
    maxTokens: 4096,
    buildPrompt: (ctx) => `Kamu adalah content ideator untuk kreator ${ctx.platform}.
Dari satu topik berikut, buatkan 10 variasi ide konten yang berbeda sudut pandang (bisa berupa daftar/listicle, cerita personal, tutorial, mitos vs fakta, tanya-jawab, before-after, dsb).

${ctxLine("Topik", ctx.topic)}${ctxLine("Target penonton", ctx.audience)}${ctxLine("Catatan tambahan", ctx.detail)}
JANGAN tulis kalimat pembuka/sapaan/penutup apapun — langsung mulai dari ide #1. Setiap ide: judul singkat + 1 kalimat penjelasan format/pendekatannya. WAJIB sampai ide ke-10, jangan berhenti di tengah. Tulis dalam Bahasa Indonesia (kecuali audiens Global/English, maka Bahasa Inggris), rapi dan mudah discan cepat.`,
  },
  {
    id: "content-calendar",
    label: "Content Calendar 30 Hari",
    subtitle: "Jadwal ide konten harian selama sebulan",
    icon: "🗓️",
    color: "#4C6FFF",
    topicLabel: "Niche / topik utama akun",
    topicPlaceholder: "Contoh: skincare lokal untuk kulit remaja",
    extraField: {
      id: "frequency",
      label: "Frekuensi posting",
      options: ["Setiap hari", "3x seminggu", "5x seminggu", "2x sehari"],
    },
    maxTokens: 12000,
    temperature: 0.55,
    buildPrompt: (ctx) => `Kamu adalah content planner untuk kreator ${ctx.platform}.
Buatkan rencana kalender konten 30 hari (Hari 1 sampai Hari 30) berdasarkan niche berikut, dengan frekuensi posting: ${ctx.frequency || "3x seminggu"}.

${ctxLine("Niche/topik utama", ctx.topic)}${ctxLine("Target penonton", ctx.audience)}${ctxLine("Catatan tambahan", ctx.detail)}
ATURAN OUTPUT (WAJIB DIIKUTI, TANPA PENGECUALIAN):
- DILARANG menulis kalimat pembuka/sapaan apapun seperti "Halo", "Tentu", "Sebagai content planner", dsb. Karakter PERTAMA yang kamu tulis harus langsung baris tabel.
- DILARANG menulis kalimat penutup/kesimpulan di akhir.
- Format tabel Markdown dengan kolom: Hari | Ide Konten | Format | Tujuan.
- Isi kolom "Ide Konten" SINGKAT, maksimal 6 kata per baris. Jangan pakai bold/italic berlebihan.
- WAJIB tercantum LENGKAP semua hari sesuai frekuensi posting sampai Hari ke-30 — jangan berhenti di tengah, jangan dipotong. Ini instruksi paling penting.
- Boleh kelompokkan per minggu dengan sub-judul singkat (maksimal 4 kata), tapi kelengkapan tabel sampai Hari 30 jauh lebih penting daripada elaborasi tambahan.
- Tulis dalam Bahasa Indonesia (kecuali audiens Global/English, maka Bahasa Inggris) — tapi tetap ikuti aturan ringkas di atas.`,
  },
  {
    id: "niche-scorer",
    label: "Niche Profitability Scorer",
    subtitle: "Nilai potensi cuan sebuah niche konten",
    icon: "💰",
    color: "#22C55E",
    topicLabel: "Niche yang ingin dinilai",
    topicPlaceholder: "Contoh: review skincare lokal, konten parenting",
    extraField: {
      id: "monetization",
      label: "Model monetisasi yang direncanakan",
      options: ["Affiliate marketing", "Jual produk sendiri", "Jasa/endorse", "Iklan platform (AdSense/Bonus Kreator)", "Belum tahu"],
    },
    maxTokens: 3072,
    buildPrompt: (ctx) => `Kamu adalah konsultan strategi monetisasi konten kreator.
Nilai potensi profitabilitas niche berikut untuk platform ${ctx.platform}, dengan rencana monetisasi: ${ctx.monetization || "belum ditentukan"}.

${ctxLine("Niche", ctx.topic)}${ctxLine("Target penonton", ctx.audience)}${ctxLine("Catatan tambahan", ctx.detail)}
JANGAN tulis kalimat pembuka/sapaan apapun — langsung ke poin (1). Berikan: (1) skor potensi profitabilitas 1-10 beserta alasannya, (2) tingkat persaingan (rendah/sedang/tinggi), (3) potensi sumber pendapatan yang realistis untuk niche ini, (4) 3 saran konkret untuk memperbesar peluang cuan di niche ini. WAJIB sampai poin (4) selesai, jangan berhenti di tengah. Tulis dalam Bahasa Indonesia (kecuali audiens Global/English, maka Bahasa Inggris), jujur dan tidak berlebihan optimis.`,
  },
  {
    id: "competitor-analyzer",
    label: "Competitor Analyzer",
    subtitle: "Bedah strategi konten akun kompetitor",
    icon: "🔍",
    color: "#A855F7",
    topicLabel: "Niche / topik akun kompetitor",
    topicPlaceholder: "Contoh: akun kuliner review makanan pedas",
    extraField: {
      id: "competitorInfo",
      label: "Info akun kompetitor (nama/gaya konten, opsional)",
      placeholder: "Contoh: @namaakun, sering pakai format komedi + review jujur",
    },
    maxTokens: 3072,
    buildPrompt: (ctx) => `Kamu adalah analis strategi konten kompetitor untuk kreator ${ctx.platform}.
Analisa gaya & strategi konten kompetitor pada niche berikut.

${ctxLine("Niche akun kompetitor", ctx.topic)}${ctxLine("Info kompetitor", ctx.competitorInfo)}${ctxLine("Target penonton", ctx.audience)}${ctxLine("Catatan tambahan", ctx.detail)}
JANGAN tulis kalimat pembuka/sapaan apapun — langsung ke poin (1). Berikan: (1) kemungkinan pola konten yang membuat kompetitor di niche ini berhasil (hook, format, jadwal posting), (2) celah/gap yang mungkin belum digarap kompetitor di niche ini, (3) 3 ide konten yang bisa membedakan diri (differentiation) dari kompetitor sejenis. WAJIB sampai poin (3) selesai, jangan berhenti di tengah. Tulis dalam Bahasa Indonesia (kecuali audiens Global/English, maka Bahasa Inggris).`,
  },
  {
    id: "brand-voice",
    label: "Brand Voice Trainer",
    subtitle: "Rumuskan gaya bahasa khas kontenmu",
    icon: "🎙️",
    color: "#14B8A6",
    topicLabel: "Deskripsi singkat akun/brand kamu",
    topicPlaceholder: "Contoh: akun edukasi keuangan santai untuk anak muda",
    extraField: {
      id: "sampleText",
      label: "Contoh caption/tulisan kamu sebelumnya (opsional, tempel 1-2 contoh)",
      type: "textarea",
      placeholder: "Tempel contoh caption atau naskah kamu di sini...",
    },
    maxTokens: 3072,
    buildPrompt: (ctx) => `Kamu adalah brand voice consultant untuk kreator ${ctx.platform}.
Rumuskan panduan gaya bahasa (brand voice) berdasarkan deskripsi akun berikut${ctx.sampleText ? " dan contoh tulisan yang diberikan" : ""}.

${ctxLine("Deskripsi akun/brand", ctx.topic)}${ctxLine("Target penonton", ctx.audience)}${ctxLine("Catatan tambahan", ctx.detail)}${ctx.sampleText ? `\nContoh tulisan sebelumnya:\n"""${ctx.sampleText}"""\n` : ""}
JANGAN tulis kalimat pembuka/sapaan apapun — langsung ke poin (1). Berikan panduan brand voice yang berisi: (1) 3-5 kata sifat yang mendeskripsikan tone (misal: santai, tegas, hangat), (2) hal yang SEBAIKNYA dilakukan dalam penulisan caption/naskah, (3) hal yang SEBAIKNYA dihindari, (4) 1 contoh kalimat pembuka (hook) yang mencerminkan brand voice ini. WAJIB sampai poin (4) selesai, jangan berhenti di tengah. Tulis dalam Bahasa Indonesia (kecuali audiens Global/English, maka Bahasa Inggris).`,
  },
];
