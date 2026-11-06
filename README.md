<div align="center">

<img src="logo/pawpics-logo.svg" alt="PawPics" width="360">

### Edit foto & desain langsung di browser — tanpa instal, tanpa ribet. 🐾

[![Coba sekarang](https://img.shields.io/badge/%E2%96%B6%20Coba%20sekarang-adjisoft.github.io%2Fpawpics-6366f1?style=for-the-badge)](https://adjisoft.github.io/pawpics)
[![Lisensi: GPL](https://img.shields.io/badge/lisensi-GPL-ec4899?style=for-the-badge)](#-lisensi)
[![Templat](https://img.shields.io/badge/templat-108-8b5cf6?style=for-the-badge)](js/template)
[![PR welcome](https://img.shields.io/badge/PR-welcome-22c55e?style=for-the-badge)](CONTRIBUTING.md)

[**Buka aplikasi**](https://adjisoft.github.io/pawpics) · [**Tambah templat**](#-tambah-templat-dalam-3-langkah) · [**Diskusi & saran**](https://github.com/adjisoft/pawpics/issues) · [**Panduan kontributor**](CONTRIBUTING.md)

</div>

---

## ✨ Kenapa PawPics?

PawPics adalah editor foto dan desain yang **berjalan sepenuhnya di browser**. Tidak ada build, tidak ada server, tidak ada framework — cukup HTML, CSS, dan JavaScript biasa. Artinya: **mudah dibaca, mudah diutak-atik, dan mudah dikontribusi.**

| 🎨 Edit | 🧩 Susun | 🚀 Bagikan |
|---|---|---|
| Atur, filter, efek, warna (grading), retus, lukis | Lapisan, topeng, klip, bentuk, teks, kolase | Simpan **JPG** atau **PNG** (termasuk latar transparan) |

**Alat di dalam aplikasi:** Lapisan · Posisi · Atur · Filter · Efek · Latar · Klip · Gambar · Teks · Bentuk · Topeng · Kolase · Potong · Warna · Retus · Lukis · **Templat**

## 🧩 Galeri templat

Saat ini ada **108 templat** siap pakai. Setiap templat adalah **satu berkas kecil** — mudah ditambah, mudah diperbaiki.

| Jenis | Folder | Jumlah | Contoh |
|---|---|:--:|---|
| 📱 Sosmed | [`js/template/sosmed`](js/template/sosmed) | 18 | Story, Pin Pinterest, Cover TikTok, Carousel |
| 🏷️ Promo | [`js/template/promo`](js/template/promo) | 10 | Flash sale, Kupon, Banner promo |
| 📰 **Brosur** | [`js/template/brosur`](js/template/brosur) | 8 | Promo Bold, Elegan Minimal, Jasa 3 kolom, **PawPics (clickbait)** |
| 💼 Bisnis | [`js/template/bisnis`](js/template/bisnis) | 12 | CV, Invoice, Sertifikat, Proposal |
| 🎉 Acara | [`js/template/acara`](js/template/acara) | 18 | Undangan, Konser, Webinar, Lebaran |
| 📸 Foto | [`js/template/foto`](js/template/foto) | 18 | Polaroid, Film strip, Photobooth, Majalah |
| 🖼️ Kolase | [`js/template/kolase`](js/template/kolase) | 10 | Kolase 4 kotak, Hati, Recap |
| 📚 Pendidikan | [`js/template/pendidikan`](js/template/pendidikan) | 5 | Jadwal, Kuis, Checklist, Infografis |
| 🎭 Kreatif | [`js/template/kreatif`](js/template/kreatif) | 9 | Blob, Sunburst, Brutalis, Orbit |

## 🗂️ Struktur proyek

```text
pawpics/
├── index.html              # satu-satunya halaman
├── css/                    # tampilan
├── js/
│   ├── app.js …            # inti editor (lapisan, kanvas, alat)
│   └── template/           # ⭐ semua templat ada di sini
│       ├── index.js        #   daftar + pemuat templat (urutan tampil di galeri)
│       ├── kategori.js     #   peta id → jenis
│       ├── _helpers.js     #   fungsi bantu templat (pol, ph, bl, gs, …)
│       ├── brosur/         #   📂 satu folder per jenis
│       │   └── tmplt-brs-promo.js     # 📄 satu berkas per templat
│       ├── sosmed/ promo/ bisnis/ acara/ foto/ kolase/ pendidikan/ kreatif/
│       └── README.md       #   panduan lengkap membuat templat
├── tools/
│   ├── baru-template.mjs   # buat kerangka templat baru otomatis
│   └── cek-template.mjs    # periksa semua templat (tanpa browser)
└── logo/
```

## 🛠️ Tambah templat dalam 3 langkah

> Tidak perlu paham seluruh kode aplikasi. Cukup tahu menaruh bentuk dan teks di kanvas.

**1. Buat kerangkanya**

```bash
node tools/baru-template.mjs brosur diskon-akhir-tahun "Diskon Akhir Tahun" 1240 1754
```

Skrip ini membuat `js/template/brosur/tmplt-diskon-akhir-tahun.js` **dan** mendaftarkannya otomatis.

**2. Desain di kodenya** — contoh isi berkas:

```js
TPX.push(['diskon-akhir-tahun','Diskon Akhir Tahun',1240,1754,()=>{
  B('#111827','#7c3aed');                                   // latar (warna / gradasi)
  S('circ',620,700,800,800,'#ffffff',.1);                   // bentuk: jenis,x,y,lebar,tinggi,warna,opasitas
  T('DISKON\nAKHIR TAHUN',620,620,170,'#fde047',1,FK.Anton); // teks: isi,x,y,ukuran,warna,tebal,font
  T('Mulai 1 Desember',620,1000,56,'#ffffff',0,FK.Poppins);
},'Brosur']);
```

**3. Cek lalu kirim**

```bash
node tools/cek-template.mjs     # ✓ Semua templat lolos pemeriksaan
```

Buka `index.html` di browser → tab **Templat** → pilih jenisnya → pastikan tampil bagus → kirim **Pull Request**. 🎉

Panduan lengkap (fungsi bantu, daftar font, tips koordinat): [`js/template/README.md`](js/template/README.md).

## 💬 Diskusi, isu, dan saran

Ada ide fitur, bug, atau permintaan templat? Kami senang mendengarnya.

- 🐞 **Lapor bug** → [buat isu](https://github.com/adjisoft/pawpics/issues/new/choose)
- 💡 **Usul fitur / saran** → [buat isu](https://github.com/adjisoft/pawpics/issues/new/choose)
- 🧩 **Minta atau usulkan templat** → [buat isu](https://github.com/adjisoft/pawpics/issues/new/choose)
- 🙋 **Mau mulai tapi bingung dari mana?** Cari isu berlabel `good first issue`, atau tambahkan satu templat sederhana — itu kontribusi pertama yang bagus!

## 🤝 Berkontribusi

Semua kontribusi diterima: templat baru, perbaikan bug, terjemahan, dokumentasi, sampai sekadar melaporkan sesuatu yang terasa janggal. Baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk alur kerja, gaya kode, dan checklist PR.

**Ide kontribusi cepat**
- [ ] Templat brosur / poster untuk usaha lokal (warung, laundry, bengkel, kursus)
- [ ] Templat sosmed tema Ramadan, 17 Agustus, atau Hari Guru
- [ ] Kolase dengan tata letak baru
- [ ] Memperbaiki templat yang kurang rapi di ukuran tertentu
- [ ] Menambah dokumentasi atau contoh

## 📜 Lisensi

PawPics adalah perangkat lunak bebas di bawah lisensi **GPL**. Kamu boleh memakai, mempelajari, mengubah, dan membagikannya — dengan syarat turunannya tetap berlisensi GPL. Lihat berkas `LICENSE` di repositori untuk teks lengkap.

Dengan mengirim kontribusi, kamu setuju kontribusimu dirilis dengan lisensi yang sama.

<div align="center">

**Dibuat dengan 🐾 oleh [adjisoft](https://github.com/adjisoft) dan para kontributor.**
Kalau PawPics berguna, beri ⭐ di repositori ini — itu sangat berarti!

</div>
