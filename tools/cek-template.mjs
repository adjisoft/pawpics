#!/usr/bin/env node
/* cek-template.mjs — memeriksa semua templat PawPics tanpa browser & tanpa dependensi.
   Jalankan:  node tools/cek-template.mjs   (atau: npm run cek)
   Yang diperiksa: daftar di index.js ⇄ berkas di disk, penamaan, id unik, ukuran, jenis=folder,
   dan fungsi templat benar-benar jalan (menghasilkan lapisan) di sandbox. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'js', 'template');
const JENIS = ['sosmed','promo','brosur','bisnis','acara','foto','kolase','pendidikan','kreatif','lainnya'];
const galat = [], info = [];
const gagal = m => galat.push(m);

/* 1. daftar index.js ⇄ disk */
const idx = fs.readFileSync(path.join(dir, 'index.js'), 'utf8');
const blok = idx.slice(idx.indexOf('const TEMPLAT=['), idx.indexOf('];', idx.indexOf('const TEMPLAT=[')));
const daftar = [...blok.matchAll(/'([^']+\.js)'/g)].map(m => m[1]);
const disk = [];
for (const j of fs.readdirSync(dir, {withFileTypes: true}).filter(d => d.isDirectory())) {
  if (!JENIS.includes(j.name)) gagal(`Folder jenis tidak dikenal: js/template/${j.name} (pilih: ${JENIS.join(', ')})`);
  for (const f of fs.readdirSync(path.join(dir, j.name))) disk.push(`${j.name}/${f}`);
}
for (const f of daftar) if (!disk.includes(f)) gagal(`Ada di index.js tapi berkasnya tidak ada: ${f}`);
for (const f of disk) if (!daftar.includes(f)) gagal(`Ada di disk tapi belum didaftarkan di js/template/index.js: ${f}`);
if (new Set(daftar).size !== daftar.length) gagal('Ada berkas yang terdaftar dua kali di index.js');

/* 2. sandbox mirip aplikasi (fungsi B,S,T,G dari js/extra.js) */
let L = [], D = {};
const sb = {
  window: {}, console, Math, JSON, Object, Array, String, Number,
  FK: new Proxy({}, {get: (_, n) => String(n)}),
  E0: {sb:0,so:0,sc:'#000000',ow:0,oc:'#ffffff',vg:0,gn:0,tn:0,tc:'#ff5a8a',px:0},
  TPX: [],
};
sb.window = sb;
Object.assign(sb, {
  T: (t,x,y,s,c,b,ff) => L.push({t:'text',txt:t,x,y,s,c,b,ff:ff||'system-ui',op:1,r:0,w:10,h:10}),
  S: (k,x,y,w,h,c,op,r) => L.push({t:'shape',k,x,y,w,h,c,op:op??1,r:r||0}),
  B: (c,c2) => { D.bg = c2 ? {t:'grad',c,c2} : {t:'color',c}; },
  G: (c,b) => { L[L.length-1].e = {...sb.E0, sb:b||40, sc:c}; },
});
Object.defineProperty(sb, 'L', {get: () => L});
vm.createContext(sb);
const muat = rel => vm.runInContext(fs.readFileSync(path.join(dir, rel), 'utf8'), sb, {filename: rel});
try { muat('kategori.js'); muat('_helpers.js'); } catch (e) { gagal(`kategori.js/_helpers.js error: ${e.message}`); }

/* 3. periksa tiap templat */
const ids = new Set();
for (const rel of daftar) {
  const [jenis, nama] = rel.split('/');
  const sebelum = sb.TPX.length;
  try { muat(rel); } catch (e) { gagal(`${rel}: gagal dimuat — ${e.message}`); continue; }
  const baru = sb.TPX.slice(sebelum);
  if (baru.length !== 1) { gagal(`${rel}: harus mendaftarkan tepat 1 templat (ketemu ${baru.length})`); continue; }
  const t = baru[0], [id, nm, w, h, fn] = t;
  if (nama !== `tmplt-${id}.js`) gagal(`${rel}: nama berkas harus tmplt-${id}.js`);
  if (!/^[a-z0-9_-]+$/i.test(id)) gagal(`${rel}: id "${id}" hanya boleh huruf, angka, _ dan -`);
  if (ids.has(id)) gagal(`${rel}: id "${id}" sudah dipakai templat lain`);
  ids.add(id);
  if (typeof nm !== 'string' || !nm.trim()) gagal(`${rel}: nama templat kosong`);
  if (!Number.isInteger(w) || !Number.isInteger(h) || w < 100 || h < 100 || w > 8000 || h > 8000) gagal(`${rel}: ukuran ${w}×${h} tidak masuk akal (100–8000 px)`);
  if (typeof fn !== 'function') { gagal(`${rel}: elemen ke-5 harus fungsi`); continue; }
  const cat = (t[5] || (sb.TCAT || {})[id] || 'Lainnya');
  if (cat.toLowerCase() !== jenis) gagal(`${rel}: jenis "${cat}" tidak sama dengan folder "${jenis}" (isi elemen ke-6 dengan '${jenis[0].toUpperCase()+jenis.slice(1)}')`);
  L = []; D = {};
  try { fn(); } catch (e) { gagal(`${rel}: fungsi templat error — ${e.message}`); continue; }
  if (!L.length) gagal(`${rel}: templat tidak menghasilkan lapisan apa pun`);
  if (!D.bg) gagal(`${rel}: templat belum memanggil B(...) untuk latar`);
  for (const l of L) for (const k of ['x','y']) if (!Number.isFinite(l[k])) gagal(`${rel}: ada lapisan dengan ${k} tidak valid`);
}
info.push(`${daftar.length} templat terdaftar, ${ids.size} id unik`);

if (galat.length) { console.error('✗ Ditemukan masalah:\n' + galat.map(g => '  • ' + g).join('\n')); process.exit(1); }
console.log('✓ Semua templat lolos pemeriksaan — ' + info.join('; '));
