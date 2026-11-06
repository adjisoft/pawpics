#!/usr/bin/env node
/* baru-template.mjs — membuat kerangka templat baru + mendaftarkannya otomatis.
   Pakai:  node tools/baru-template.mjs <jenis> <id> "<Nama Templat>" [lebar] [tinggi]
   Contoh: node tools/baru-template.mjs promo tahun-baru "Promo Tahun Baru" 1080 1080 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'js', 'template');
const JENIS = ['sosmed','promo','brosur','bisnis','acara','foto','kolase','pendidikan','kreatif','lainnya'];
const [jenis, id, nama, w = '1080', h = '1080'] = process.argv.slice(2);
const pakai = () => { console.error('Pakai: node tools/baru-template.mjs <jenis> <id> "<Nama>" [lebar] [tinggi]\nJenis : ' + JENIS.join(', ')); process.exit(1); };
if (!jenis || !id || !nama) pakai();
if (!JENIS.includes(jenis)) { console.error(`Jenis "${jenis}" tidak dikenal.`); pakai(); }
if (!/^[a-z0-9_-]+$/i.test(id)) { console.error('id hanya boleh huruf, angka, _ dan -'); process.exit(1); }
if (!(+w >= 100 && +h >= 100)) { console.error('Ukuran minimal 100×100'); process.exit(1); }

const idxPath = path.join(dir, 'index.js');
let idx = fs.readFileSync(idxPath, 'utf8');
if (idx.includes(`tmplt-${id}.js'`) || fs.existsSync(path.join(dir, jenis, `tmplt-${id}.js`))) { console.error(`id "${id}" sudah ada.`); process.exit(1); }
const Jenis = jenis[0].toUpperCase() + jenis.slice(1), cx = Math.round(w / 2), cy = Math.round(h / 2);
const berkas = `/* PawPics · Templat "${nama}" (${id}) · jenis: ${Jenis} · ${w}×${h} px */
/* Koordinat = titik TENGAH elemen. Fungsi bantu: B(latar[,gradasi])  S(bentuk,x,y,lebar,tinggi,warna[,opasitas,rotasi])
   T(teks,x,y,ukuran,warna,tebal,font)  G(warna,blur) → glow untuk lapisan terakhir. Baca js/template/README.md */
TPX.push(['${id}','${nama}',${w},${h},()=>{B('#ffffff');S('rrect',${cx},${cy},${Math.round(w * .8)},${Math.round(h * .5)},'#6366f1');T('${nama}',${cx},${cy},${Math.round(Math.min(w, h) / 12)},'#ffffff',1,FK.Poppins)},'${Jenis}']);
`;
fs.mkdirSync(path.join(dir, jenis), {recursive: true});
fs.writeFileSync(path.join(dir, jenis, `tmplt-${id}.js`), berkas);
idx = idx.replace(/\n\];\n/, `,\n  '${jenis}/tmplt-${id}.js'\n];\n`);
fs.writeFileSync(idxPath, idx);
console.log(`✓ Dibuat   js/template/${jenis}/tmplt-${id}.js\n✓ Didaftarkan di js/template/index.js\nSelanjutnya: edit berkasnya, buka index.html di browser, lalu jalankan  node tools/cek-template.mjs`);
