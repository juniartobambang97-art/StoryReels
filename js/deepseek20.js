(() => {
const stories = [
["Suami Sachet",`Aku menikah dengan pria yang kutemukan di bungkus kopi sachet. "Berlaku sampai kapan?" tanyaku. "Sampai kau bosan," jawabnya. Dua tahun kemudian dia masih di rumah, masih bikin kopi, dan masih belum bosan. Aku yang mulai bosan. Sachetnya sudah kadaluarsa.`],
["Interview Kerja Aneh",`"Kelebihan Anda?" tanya HRD. "Saya bisa tidur 12 jam tanpa bangun," jawabku yakin. Dia menatapku lama. "Diterima. Kami butuh penjaga gudang malam." Sekarang aku tidur dibayar. Mimpi jadi kenyataan, literally.`],
["Pacar dari Iklan",`Aku klik iklan "dapatkan pacar dalam 1 menit." Satu menit kemudian pintu rumahku dibuka paksa. Seorang pria masuk, langsung buka kulkas. "Aku pacarmu," katanya sambil makan sosisku. "Bayar dulu," kataku. Dia kabur lewat jendela. Kembali besok dengan bunga.`],
["Mimpi yang Salah Orang",`Aku bisa masuk ke mimpi orang lain. Suatu malam aku masuk ke mimpi tetangga dan menemukan dia memimpikan aku. Aneh tapi manis. Sampai dia mimpi aku jadi ikan dan dia makan aku. Paginya dia minta maaf. Aku belum memaafkan.`],
["Kurir Paket Misterius",`Paket datang tanpa nama pengirim. Isinya cermin dengan tulisan "jangan lihat ke belakang." Tentu saja aku lihat. Tidak ada apa-apa. Lega. Sampai cermin itu bilang, "Aku bilang jangan lihat ke belakang cermin, bodoh." Cerminnya yang ngambek, bukan hantunya.`],
["Nasi Goreng Rahasia",`Warung nasi goreng itu selalu ramai, tapi tidak ada yang pernah melihat penjualnya. Uang ditaruh di mangkuk, nasi goreng muncul. Suatu hari aku sembunyi dan mengintip. Ternyata yang masak adalah kucing jalanan pakai celemek. Aku diam-diam jadi pelanggan setia. Jangan sampai dia pindah warung.`],
["Mantan di Lantai Dua",`Aku pindah kos dan tetangga lantai duaku ternyata mantan pacar. "Kita harus dewasa," katanya. Malam itu dia kunci aku di luar kamar mandi. "Dewasa itu antre," katanya sambil ngakak. Ternyata dewasanya belum naik level. Aku lapor ibu kos. Dia kena denda.`],
["Kue Ulang Tahun Salah Tanggal",`Aku pesan kue ultah, tapi yang datang bertuliskan "Selamat Datang di Dunia." Tukang kue salah dengar. Aku sudah 30 tahun. Tapi ya sudah, kupakai. Tamu-tamuku bingung, tapi kuenya enak. Tahun depan aku pesan lagi. Siapa tahu salah dengar jadi "Selamat Jalan."`],
["Hantu yang Salah Rumah",`Hantu muncul di kamarku jam 3 pagi. "Aku menghantui rumah ini," katanya. "Rumah ini nomor 12, bukan 13," kataku. Dia panik. "Astaga, salah alamat." Dia minta maaf dan pergi. Lima menit kemudian dia balik. "Kau tahu rumah nomor 13?" Aku tunjukkan. Dia berterima kasih. Sopan sekali.`],
["Detektif Kucing",`Kucingku selalu pulang membawa bukti kejahatan: kaus kaki tetangga, dompet hilang, bahkan gigi palsu. Ternyata dia detektif swasta. "Aku menyamar sebagai kucing," katanya. "Kau kucing beneran," kataku. "Detail kecil," jawabnya. Kasusnya banyak, bayarannya ikan.`],
["Jodoh Lewat Antrean",`Aku antre di kasir minimarket. Pria di depanku kurang 500 rupiah. Kubayarin. Dia bilang makasih, lalu pergi. Seminggu kemudian dia muncul lagi di antrean yang sama, kurang 500 rupiah lagi. Setahun kemudian kami menikah. Sampai sekarang dia masih kurang 500 rupiah setiap belanja. Aku curiga ini rencananya.`],
["Warisan Sepatu",`Ayah mewariskan sepasang sepatu butut dengan pesan "pakai saat kau benar-benar butuh." Aku simpan bertahun-tahun. Suatu hari aku kepepet, kupakai. Sepatu itu membawaku ke kantor ayah di... neraka? "Ayah kerja di sini?" tanyaku. "Sampingan," jawab ayah santai. "Sini, ayah pinjamkan uang."`],
["Tetangga yang Selalu Buka Jendela",`Tetanggaku selalu buka jendela jam 2 pagi, padahal hujan. Suatu malam aku intip. Ternyata dia menjemur pakaian. "Kenapa jam segini?" tanyaku. "Supaya tidak ada yang lihat," katanya. Aku lihat jemurannya: semua pakaianku yang hilang dari jemuran. Kami sekarang tidak bertetangga lagi.`],
["Ramalan yang Meleset",`Peramal bilang aku akan bertemu jodoh hari Selasa. Aku dandan maksimal, duduk di kafe seharian. Tidak ada siapa-siapa. Malamnya aku makan di warung tenda. Pelayan yang hidangkan nasi gorengku tersenyum. "Selasa kan besok, Mbak," katanya. Aku lupa hari. Dia jadi jodohku, sih.`],
["Radio yang Bisa Bicara",`Radio tua di gudang tiba-tiba menyala sendiri. "Aku bisa meramal masa depan," katanya. "Besok kau kena macet." Besok aku memang kena macet. "Besok hujan." Benar. "Besok kau ketemu mantan." Aku panik, tapi ternyata salah. Radio itu cuma benar soal cuaca. Meramalnya payah, tapi akurat soal cuaca.`],
["Pensiunan Superhero",`Kakekku ternyata superhero pensiunan. "Dulu aku bisa terbang," katanya. "Sekarang?" tanyaku. "Sekarang lututku sakit." Suatu hari ada pencuri di rumah. Kakek berdiri, mengangkat tangan, dan... pencuri itu tertidur karena ceramahnya. Kekuatan barunya: membosankan orang sampai pingsan.`],
["Salon yang Aneh",`Aku masuk salon dan minta potong sedikit. Tukang cukainya bilang "siap." Aku tertidur. Bangun-bangun rambutku jadi mohawk warna pelangi. "Sedikit kan relatif," katanya. Aku marah. Dia kasih diskon 50 persen. Sekarang aku model iklan sampo. Hidup ini aneh, tapi ya jalani saja.`],
["Buku Harian yang Menjawab",`Aku menulis di buku harian: "Aku kesepian." Keesokan paginya ada balasan tulisan tangan lain: "Sama." Aku tulis lagi: "Siapa kau?" Balasannya: "Penghuni buku ini sebelum kau. Aku terjebak di sini." Aku panik dan mau buang buku. Tapi tulisannya muncul lagi: "Jangan. Aku butuh teman. Kau kan kesepian juga." Kami jadi sahabat. Buku itu sekarang penuh curhat.`],
["Ojek yang Salah Arah",`Aku pesan ojek online ke kantor. Tapi pengemudinya membawaku ke pantai. "Ini bukan jalannya," kataku. "Saya tahu," jawabnya. "Kau kelihatan stres. Kita healing dulu." Aku mau marah, tapi ternyata enak juga. Kami duduk di pantai, ngobrol, dan aku lupa soal meeting. Besoknya aku dipecat. Tapi aku dan driver itu sekarang buka usaha kopi di pantai.`],
["Kulkas yang Menyimpan Rahasia",`Kulkasku selalu berisik jam 3 pagi. Kubongkar dan kutemukan pintu kecil di belakangnya. Di dalamnya ada dunia mini dengan penduduk seukuran semut. Mereka menyembah aku sebagai dewa. "Kami butuh susu," kata pemimpinnya. Sejak itu aku rutin memberi persembahan susu. Imbalannya: kulkasku tidak pernah rusak. Kontrak yang adil.`]
];

const input = document.getElementById("storyInput");
if (!input) return;

input.value = stories.map(([title, content]) =>
  `Judul: ${title}\nCerita: ${content}`
).join("\n\n");

const button = document.getElementById("uploadButton");
if (button) button.textContent = "UPLOAD 20 CERITA";

const heading = document.querySelector(".import-box h1");
if (heading) heading.textContent = "Import 20 Cerita";

const description = document.querySelector(".import-box p");
if (description) description.textContent =
  "DeepSeek Batch — 20 cerita siap diunggah sekaligus.";

console.log("DeepSeek batch loaded:", stories.length);
})();

(() => {
const input = document.getElementById("storyInput");
const list = document.getElementById("previewList");
const count = document.getElementById("previewCount");
if (!input || !list || !count) return;

function renderPreview() {
  const regex = /Judul:\s*(.*?)\s*\nCerita:\s*([\s\S]*?)(?=\n\s*Judul:|$)/g;
  const stories = [...input.value.matchAll(regex)]
    .map(m => ({title:m[1].trim(), content:m[2].trim()}))
    .filter(s => s.title && s.content);

  count.textContent = stories.length + " cerita siap diperiksa";
  list.innerHTML = "";

  stories.forEach((story, i) => {
    const card = document.createElement("article");
    card.className = "preview-card";

    const number = document.createElement("div");
    number.className = "preview-number";
    number.textContent = "CERITA " + String(i + 1).padStart(2, "0");

    const title = document.createElement("h3");
    title.textContent = story.title;

    const content = document.createElement("p");
    content.textContent = story.content;

    card.append(number, title, content);
    list.appendChild(card);
  });
}

input.addEventListener("input", renderPreview);
renderPreview();
})();
