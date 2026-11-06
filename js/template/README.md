# 🧩 Panduan Templat PawPics

Satu templat = **satu berkas** `tmplt-<id>.js` di dalam folder **jenis**-nya.
Tidak perlu build, tidak perlu framework — cukup JavaScript biasa.

```text
js/template/
├── index.js          ← daftar & pemuat (urutan = urutan di galeri)
├── kategori.js       ← peta id → jenis untuk templat lama
├── _helpers.js       ← fungsi bantu: F, pol, ph, PC, bl, gs, A, cT, sh2, stk
└── <jenis>/tmplt-<id>.js
```

**Jenis (folder) yang tersedia:** `sosmed` · `promo` · `brosur` · `bisnis` · `acara` · `foto` · `kolase` · `pendidikan` · `kreatif` · `lainnya`

## Cara tercepat

```bash
node tools/baru-template.mjs <jenis> <id> "<Nama Templat>" [lebar] [tinggi]
node tools/cek-template.mjs
```

## Anatomi sebuah templat

```js
TPX.push([
  'id-unik',            // 1. id: huruf/angka/_/-  → nama berkas harus tmplt-id-unik.js
  'Nama di Galeri',     // 2. nama yang tampil
  1080, 1350,           // 3-4. lebar & tinggi kanvas (px)
  () => {               // 5. fungsi yang menyusun lapisan dari belakang ke depan
    B('#fff');
    T('Halo', 540, 675, 120, '#000', 1, FK.Poppins);
  },
  'Sosmed'              // 6. jenis (huruf kapital di awal) — HARUS sama dengan nama folder
]);
```

## Fungsi bantu (global)

> **Semua koordinat adalah titik TENGAH elemen**, bukan pojok kiri atas. `x` dari kiri, `y` dari atas.

| Fungsi | Isi | Keterangan |
|---|---|---|
| `B(warna[, warna2])` | latar | dua warna = gradasi |
| `S(bentuk,x,y,w,h,warna[,opasitas,rotasi])` | bentuk | rotasi dalam radian |
| `T(teks,x,y,ukuran,warna,tebal,font)` | teks | `\n` = baris baru, `tebal` 1/0, rata tengah |
| `G(warna[,blur])` | glow | berlaku untuk **lapisan terakhir** yang dibuat |
| `FK.Poppins` / `FK['Bebas Neue']` | font | lihat daftar font di bawah |

**Bentuk (`S`):** `rect` · `rrect` (rounded) · `circ` · `tri` · `star` · `hex` · `heart` · `arrow` · `bolt` — lihat templat lain untuk contoh pemakaiannya.

**Font:** Poppins, Montserrat, Raleway, Oswald, Bebas Neue, Anton, Archivo Black, Space Grotesk, Fredoka, Comfortaa, Righteous, Orbitron, Bangers, Playfair Display, Merriweather, Roboto Slab, Abril Fatface, Cinzel, Lobster, Pacifico, Dancing Script, Great Vibes, Satisfy, Caveat, Permanent Marker, Shadows Into Light, Special Elite, Press Start 2P.

### Fungsi bantu tambahan (`_helpers.js`)

Jika templatmu memakainya, ambil dulu dari `TPLH` dengan pembungkus seperti ini:

```js
(()=>{const {F,ph}=TPLH;
TPX.push([ /* … */ ]);
})();
```

| Nama | Dipakai untuk |
|---|---|
| `F('Poppins')` | singkatan `FK['Poppins']` |
| `pol(x,y,lebar,rotasi,keterangan[,warna])` | kartu Polaroid |
| `ph(x,y,w,h,warna[,bentuk,rotasi])` | kotak penampung foto bertanda `+` (kolase) |
| `PC` | palet pastel (array warna) |
| `bl(x,y,radius,warna,seed[,opasitas])` | blob organik |
| `gs(bentuk,x,y,w,h,warna1,warna2,sudut[,rotasi,opasitas])` | bentuk bergradasi |
| `A({...})` | ubah properti lapisan terakhir |
| `cT(teks,x,y,ukuran,warna,font,lengkung[,rotasi])` | teks melengkung |
| `sh2`, `stk` | gaya bayangan & gaya stiker |

## Aturan main

- ✅ Satu berkas = satu templat. Nama berkas: `tmplt-<id>.js`, id **unik** di seluruh proyek.
- ✅ Letakkan di folder yang sama dengan jenisnya (elemen ke-6).
- ✅ Daftarkan di `index.js` (otomatis jika memakai `baru-template.mjs`). Urutan di daftar = urutan di galeri.
- ✅ Teks contoh berbahasa Indonesia; isian yang harus diganti pengguna pakai tanda kurung siku, mis. `[NAMA USAHA]`.
- ✅ Pakai warna dengan kontras cukup — teks harus terbaca.
- ✅ Jalankan `node tools/cek-template.mjs` sebelum membuat PR.
- ❌ Jangan memuat gambar/font dari luar. Font hanya dari daftar di atas.
- ❌ Jangan menyentuh kode inti (`app.js`, dll.) di PR yang isinya templat — pisahkan PR-nya.

## Debug di browser

Buka `index.html` → tab **Templat** → pilih jenis → klik templatmu. Kalau tidak muncul, buka *DevTools → Console*:

| Gejala | Penyebab umum |
|---|---|
| Tidak muncul di galeri | belum terdaftar di `index.js`, atau jenis (elemen ke-6) tidak sama dengan folder |
| `TPLH is not defined` / `bl is not defined` | pembungkus `const {…}=TPLH` belum ditulis |
| Error saat dipilih | cek urutan argumen `S`/`T` |
