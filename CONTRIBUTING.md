# 🐾 Berkontribusi ke PawPics

Terima kasih sudah tertarik! PawPics sengaja dibuat **sederhana**: HTML + CSS + JavaScript biasa, tanpa build. Siapa pun yang bisa membaca JavaScript dasar bisa ikut membantu.

## Mulai dari mana?

| Kamu ingin… | Lakukan ini |
|---|---|
| 🧩 Menambah **templat** | Ikuti [panduan templat](js/template/README.md) — cara paling mudah untuk kontribusi pertama |
| 🐞 Melapor **bug** | [Buat isu](https://github.com/adjisoft/pawpics/issues/new/choose) pilih *Laporan bug* |
| 💡 Mengusulkan **fitur/saran** | [Buat isu](https://github.com/adjisoft/pawpics/issues/new/choose) pilih *Saran & ide* |
| 🛠️ Memperbaiki kode | Cari isu `good first issue`, komentari bahwa kamu mengerjakannya |
| 📝 Memperbaiki dokumentasi | Langsung kirim PR |

## Persiapan

```bash
git clone https://github.com/adjisoft/pawpics.git
cd pawpics
# buka index.html di browser — selesai. (Node.js ≥ 18 hanya dibutuhkan untuk skrip di folder tools/)
```

## Alur kerja

1. **Fork** repositori, buat cabang: `git checkout -b templat/brosur-kursus`
2. Kerjakan perubahanmu (satu PR = satu topik).
3. Jalankan pemeriksaan: `node tools/cek-template.mjs`
4. Coba manual di browser (buka `index.html`).
5. Commit dengan pesan jelas, mis. `templat: tambah brosur kursus bahasa`.
6. Kirim **Pull Request** dan isi daftar periksa di formulirnya.

## Menambah templat (ringkas)

```bash
node tools/baru-template.mjs brosur kursus-bahasa "Brosur Kursus Bahasa" 1240 1754
```

Edit berkas yang dibuat, lalu `node tools/cek-template.mjs`. Detail di [js/template/README.md](js/template/README.md).

## Gaya kode

- JavaScript biasa (tanpa modul/bundler); mengikuti gaya ringkas yang sudah ada di berkas sekitar.
- Templat: satu berkas satu templat, id unik, jenis = folder.
- Teks antarmuka & contoh berbahasa Indonesia.
- Jangan menambah dependensi/CDN baru tanpa diskusi di isu terlebih dahulu.
- Jangan campur refaktor besar dengan fitur/templat dalam satu PR.

## Diskusi & etika

Gunakan **Issues** untuk bug, saran, dan permintaan templat. Bersikaplah ramah — semua orang di sini sedang belajar. Kritik kode, bukan orangnya. Pelanggaran sikap dapat dilaporkan ke pemilik repositori.

## Lisensi

Dengan mengirim kontribusi, kamu setuju karyamu dirilis di bawah lisensi **GPL** yang sama dengan proyek ini. Pastikan templat/aset yang kamu kirim adalah karyamu sendiri atau berlisensi kompatibel (jangan menyalin desain berhak cipta atau karakter berlisensi).
